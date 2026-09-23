import base64
import re

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile


def _normalize_name(value):
    return ' '.join((value or '').strip().split())


def _build_internal_username(email, preferred=''):
    """Create a stable unique Django username while the product stays email-first."""
    preferred = (preferred or '').strip()
    if preferred:
        base = preferred
    else:
        base = (email or '').split('@', 1)[0]
    base = re.sub(r'[^A-Za-z0-9._-]+', '-', base).strip('-._') or 'user'
    base = base[:140]
    candidate = base
    suffix = 1
    while User.objects.filter(username=candidate).exists():
        suffix_text = f'-{suffix}'
        candidate = f'{base[:150-len(suffix_text)]}{suffix_text}'
        suffix += 1
    return candidate


class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, required=False, allow_blank=False, max_length=150)
    # Backward-compatible API field. The React form no longer exposes it.
    username = serializers.CharField(write_only=True, required=False, allow_blank=True, max_length=150)
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)
    tokens = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'name', 'username', 'email', 'password', 'password2', 'tokens')
        extra_kwargs = {
            'email': {'required': True, 'allow_blank': False},
        }

    def validate_email(self, value):
        email = (value or '').strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError('Bu email allaqachon ishlatilgan.')
        return email

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Parollar bir xil emas.'})
        name = _normalize_name(attrs.get('name'))
        legacy_username = (attrs.get('username') or '').strip()
        if not name and legacy_username:
            name = legacy_username
        if len(name) < 2:
            raise serializers.ValidationError({'name': 'Ism kamida 2 ta belgidan iborat bo‘lsin.'})
        attrs['name'] = name
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        name = validated_data.pop('name')
        legacy_username = validated_data.pop('username', '')
        email = validated_data.pop('email').lower()
        user = User(
            username=_build_internal_username(email, legacy_username),
            email=email,
            first_name=name,
            **validated_data,
        )
        user.set_password(password)
        user.save()
        UserProfile.objects.get_or_create(user=user)
        return user

    def get_tokens(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class UserProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='first_name', required=False, max_length=150)
    profile_image = serializers.FileField(write_only=True, required=False, allow_null=True)
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'name', 'email', 'profile_image', 'profile_image_url',
            'date_joined', 'is_staff', 'is_superuser',
        )
        read_only_fields = ('id', 'username', 'date_joined', 'is_staff', 'is_superuser', 'profile_image_url')

    def validate_name(self, value):
        value = _normalize_name(value)
        if len(value) < 2:
            raise serializers.ValidationError('Ism kamida 2 ta belgidan iborat bo‘lsin.')
        return value

    def validate_email(self, value):
        email = (value or '').strip().lower()
        qs = User.objects.filter(email__iexact=email)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('Bu email boshqa akkauntda ishlatilgan.')
        return email

    def validate_profile_image(self, value):
        if value is None:
            return value
        if value.size > 1536 * 1024:
            raise serializers.ValidationError('Profil rasmi 1.5 MB dan katta bo‘lmasin.')
        content_type = (getattr(value, 'content_type', '') or '').lower()
        allowed_types = {'image/jpeg', 'image/png', 'image/webp'}
        if content_type and content_type not in allowed_types:
            raise serializers.ValidationError('Faqat JPG, PNG yoki WEBP rasm yuboring.')
        name = (getattr(value, 'name', '') or '').lower()
        if name and not name.endswith(('.jpg', '.jpeg', '.png', '.webp')):
            raise serializers.ValidationError('Rasm formati JPG, PNG yoki WEBP bo‘lishi kerak.')
        return value

    def get_profile_image_url(self, obj):
        profile = UserProfile.objects.filter(user=obj).first()
        if not profile or not profile.profile_image_data:
            return None
        mime = profile.profile_image_mime or 'image/jpeg'
        return f'data:{mime};base64,{profile.profile_image_data}'

    def update(self, instance, validated_data):
        image_present = 'profile_image' in validated_data
        image = validated_data.pop('profile_image', None) if image_present else None
        instance = super().update(instance, validated_data)
        profile, _ = UserProfile.objects.get_or_create(user=instance)
        if image_present and image is not None:
            profile.profile_image_data = base64.b64encode(image.read()).decode('ascii')
            profile.profile_image_mime = (getattr(image, 'content_type', '') or 'image/jpeg').lower()
            profile.save(update_fields=['profile_image_data', 'profile_image_mime', 'updated_at'])
        return instance


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    # Legacy clients can still send `username`; if it looks like an email it works identically.
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = (attrs.get('email') or attrs.get('username') or '').strip().lower()
        password = attrs.get('password') or ''
        if not identifier:
            raise serializers.ValidationError({'email': 'Emailni kiriting.'})

        user = User.objects.filter(email__iexact=identifier).first()
        if user is None and attrs.get('username'):
            # Backward compatibility for old API consumers only.
            user = User.objects.filter(username=attrs['username'].strip()).first()

        if user is None:
            raise serializers.ValidationError({'detail': 'Email yoki parol noto‘g‘ri.'})

        authenticated = authenticate(username=user.username, password=password)
        if authenticated is None or not authenticated.is_active:
            raise serializers.ValidationError({'detail': 'Email yoki parol noto‘g‘ri.'})

        refresh = RefreshToken.for_user(authenticated)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password2 = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        request = self.context['request']
        if not request.user.check_password(attrs['current_password']):
            raise serializers.ValidationError({'current_password': 'Hozirgi parol noto‘g‘ri.'})
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({'new_password2': 'Yangi parollar bir xil emas.'})
        if attrs['current_password'] == attrs['new_password']:
            raise serializers.ValidationError({'new_password': 'Yangi parol eski paroldan farq qilishi kerak.'})
        return attrs

from django.db.models import Q
from rest_framework import serializers
from .models import (
    Subject,
    Course,
    Test,
    Question,
    Option,
    TestAttempt,
    Answer,
    PremiumAccess,
    PaymentRequest,
)


def user_has_test_access(user, test):
    if not test.is_premium:
        return True
    if not user or not user.is_authenticated:
        return False
    return PremiumAccess.objects.filter(
        user=user,
        status=PremiumAccess.STATUS_PAID,
    ).filter(
        Q(test=test) | Q(subject=test.subject)
    ).exists()


class SubjectSerializer(serializers.ModelSerializer):
    tests_count = serializers.SerializerMethodField()
    courses_count = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = ('id', 'name', 'slug', 'description', 'is_featured', 'order', 'tests_count', 'courses_count')

    def get_tests_count(self, obj):
        return obj.tests.filter(is_active=True).count()

    def get_courses_count(self, obj):
        return obj.courses.filter(is_active=True).count()


class CourseSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    subject_id = serializers.PrimaryKeyRelatedField(
        source='subject', queryset=Subject.objects.all(), write_only=True, required=False
    )

    class Meta:
        model = Course
        fields = ('id', 'subject', 'subject_id', 'title', 'description', 'level', 'image_url', 'is_active', 'order')


class OptionPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ('id', 'text', 'order')


class QuestionPublicSerializer(serializers.ModelSerializer):
    options = OptionPublicSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'text', 'order', 'options')


class TestListSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    questions_count = serializers.SerializerMethodField()
    has_access = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()

    class Meta:
        model = Test
        fields = (
            'id', 'subject', 'title', 'description', 'duration_minutes',
            'is_premium', 'price', 'is_active', 'order', 'questions_count',
            'has_access', 'payment_status',
        )

    def get_questions_count(self, obj):
        return obj.questions.count()

    def get_has_access(self, obj):
        if not obj.is_premium:
            return True
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return False
        return PremiumAccess.objects.filter(
            user=user,
            status=PremiumAccess.STATUS_PAID,
        ).filter(test=obj).exists() or PremiumAccess.objects.filter(
            user=user,
            subject=obj.subject,
            status=PremiumAccess.STATUS_PAID,
        ).exists()

    def get_payment_status(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if not obj.is_premium or not user or not user.is_authenticated:
            return None
        latest = PaymentRequest.objects.filter(user=user, test=obj).order_by('-created_at').first()
        return latest.status if latest else None


class TestDetailSerializer(TestListSerializer):
    questions = QuestionPublicSerializer(many=True, read_only=True)

    class Meta(TestListSerializer.Meta):
        fields = TestListSerializer.Meta.fields + ('questions',)


class SubmitAnswerItemSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    option_id = serializers.IntegerField(allow_null=True, required=False)


class SubmitTestSerializer(serializers.Serializer):
    answers = SubmitAnswerItemSerializer(many=True)


class LocalTestAttemptSerializer(serializers.Serializer):
    score = serializers.IntegerField(min_value=0)
    total_questions = serializers.IntegerField(min_value=1)
    duration_seconds = serializers.IntegerField(min_value=0, required=False, default=0)

    def validate(self, attrs):
        if attrs['score'] > attrs['total_questions']:
            raise serializers.ValidationError({'score': 'Score cannot exceed total_questions.'})
        return attrs


class AnswerReviewSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.text', read_only=True)
    selected_option_text = serializers.CharField(source='selected_option.text', read_only=True)
    correct_option_text = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = ('id', 'question', 'question_text', 'selected_option', 'selected_option_text', 'correct_option_text', 'is_correct')

    def get_correct_option_text(self, obj):
        option = obj.question.options.filter(is_correct=True).first()
        return option.text if option else None


class TestAttemptSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source='test.title', read_only=True)
    subject_slug = serializers.CharField(source='test.subject.slug', read_only=True)
    percentage = serializers.FloatField(read_only=True)
    answers = AnswerReviewSerializer(many=True, read_only=True)

    class Meta:
        model = TestAttempt
        fields = (
            'id', 'test', 'test_title', 'subject_slug', 'score', 'total_questions',
            'percentage', 'started_at', 'finished_at', 'duration_seconds', 'answers'
        )


class PremiumAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = PremiumAccess
        fields = ('id', 'subject', 'test', 'amount', 'status', 'created_at')


class PaymentRequestCreateSerializer(serializers.Serializer):
    test_id = serializers.IntegerField()
    transaction_id = serializers.CharField(max_length=120, required=False, allow_blank=True)
    receipt = serializers.FileField(required=False, allow_null=True)

    def validate(self, attrs):
        transaction_id = (attrs.get('transaction_id') or '').strip()
        receipt = attrs.get('receipt')
        if not transaction_id and not receipt:
            raise serializers.ValidationError('Transaction ID yoki chek faylini yuboring.')

        if receipt:
            if receipt.size > 5 * 1024 * 1024:
                raise serializers.ValidationError({'receipt': 'Chek fayli 5 MB dan katta bo‘lmasin.'})
            content_type = getattr(receipt, 'content_type', '')
            allowed = {'image/jpeg', 'image/png', 'image/webp', 'application/pdf'}
            if content_type and content_type not in allowed:
                raise serializers.ValidationError({'receipt': 'Faqat JPG, PNG, WEBP yoki PDF yuboring.'})

        attrs['transaction_id'] = transaction_id
        return attrs


class PaymentRequestSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source='test.title', read_only=True)
    receipt_url = serializers.SerializerMethodField()

    class Meta:
        model = PaymentRequest
        fields = (
            'id', 'test', 'test_title', 'amount', 'transaction_id', 'receipt_url',
            'status', 'admin_note', 'created_at', 'updated_at', 'reviewed_at',
        )

    def get_receipt_url(self, obj):
        if not obj.receipt:
            return None
        request = self.context.get('request')
        url = obj.receipt.url
        return request.build_absolute_uri(url) if request else url

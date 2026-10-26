import os

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from apps.users.models import UserProfile
from apps.users.serializers import _build_internal_username


class Command(BaseCommand):
    help = (
        'Create a staff/superuser from ADMIN_EMAIL + ADMIN_PASSWORD if it does not exist. '
        'Never overwrites the password of an existing account.'
    )

    def handle(self, *args, **options):
        email = (os.getenv('ADMIN_EMAIL') or '').strip().lower()
        password = os.getenv('ADMIN_PASSWORD') or ''
        if not email or not password:
            self.stdout.write('ADMIN_EMAIL/ADMIN_PASSWORD not set; skipping admin bootstrap.')
            return

        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            user = User(
                username=_build_internal_username(email),
                email=email,
                first_name='Admin',
            )
            user.set_password(password)
            created = True
        else:
            created = False

        user.is_staff = True
        user.is_superuser = True
        user.save()
        UserProfile.objects.get_or_create(user=user)
        self.stdout.write(f'Admin {"created" if created else "ensured"}: {email}')

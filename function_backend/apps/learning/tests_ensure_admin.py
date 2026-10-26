import os
from unittest import mock

from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import TestCase


class EnsureAdminTests(TestCase):
    def run_command(self, **env):
        with mock.patch.dict(os.environ, env, clear=False):
            call_command('ensure_admin', verbosity=0)

    def test_creates_staff_user_that_can_log_in_by_email(self):
        self.run_command(ADMIN_EMAIL='Admin@Example.com', ADMIN_PASSWORD='S3cret-pass-123')
        user = User.objects.get(email='admin@example.com')
        self.assertTrue(user.is_staff and user.is_superuser)
        response = self.client.post(
            '/api/auth/login/',
            {'email': 'admin@example.com', 'password': 'S3cret-pass-123'},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)

    def test_existing_account_is_promoted_but_password_is_kept(self):
        user = User.objects.create_user('someone', 'admin@example.com', 'original-pass-1')
        self.run_command(ADMIN_EMAIL='admin@example.com', ADMIN_PASSWORD='new-pass-12345')
        user.refresh_from_db()
        self.assertTrue(user.is_staff and user.is_superuser)
        self.assertTrue(user.check_password('original-pass-1'))

    def test_skips_without_env(self):
        with mock.patch.dict(os.environ, {'ADMIN_EMAIL': '', 'ADMIN_PASSWORD': ''}):
            call_command('ensure_admin', verbosity=0)
        self.assertEqual(User.objects.count(), 0)

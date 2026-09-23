import shutil
import tempfile

from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import UserProfile


TEST_MEDIA_ROOT = tempfile.mkdtemp(prefix='function-user-tests-')


@override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT)
class AuthAPITest(TestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TEST_MEDIA_ROOT, ignore_errors=True)

    def test_register_with_name_and_email(self):
        client = APIClient()
        response = client.post('/api/auth/register/', {
            'name': 'Ramazon Raximov',
            'email': 'ramazon@example.com',
            'password': 'StrongPass123',
            'password2': 'StrongPass123',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('tokens', response.data)
        user = User.objects.get(email='ramazon@example.com')
        self.assertEqual(user.first_name, 'Ramazon Raximov')

    def test_legacy_register_payload_still_works(self):
        client = APIClient()
        response = client.post('/api/auth/register/', {
            'username': 'ramazon',
            'email': 'legacy@example.com',
            'password': 'StrongPass123',
            'password2': 'StrongPass123',
        }, format='json')
        self.assertEqual(response.status_code, 201)

    def test_email_login_profile_update_password_and_delete(self):
        user = User.objects.create_user(
            username='internal-user',
            email='student@example.com',
            password='StrongPass123',
            first_name='Student Name',
        )
        UserProfile.objects.create(user=user)
        client = APIClient()

        login = client.post('/api/auth/login/', {
            'email': 'student@example.com',
            'password': 'StrongPass123',
        }, format='json')
        self.assertEqual(login.status_code, 200)
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")

        image = SimpleUploadedFile('avatar.png', b'fake-avatar', content_type='image/png')
        updated = client.patch('/api/auth/profile/', {
            'name': 'New Name',
            'email': 'new@example.com',
            'profile_image': image,
        }, format='multipart')
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(updated.data['name'], 'New Name')
        self.assertEqual(updated.data['email'], 'new@example.com')
        self.assertTrue(updated.data['profile_image_url'])

        password = client.post('/api/auth/password/', {
            'current_password': 'StrongPass123',
            'new_password': 'AnotherStrongPass123',
            'new_password2': 'AnotherStrongPass123',
        }, format='json')
        self.assertEqual(password.status_code, 200)

        deleted = client.delete('/api/auth/profile/')
        self.assertEqual(deleted.status_code, 204)
        self.assertFalse(User.objects.filter(pk=user.pk).exists())

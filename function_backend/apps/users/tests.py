from django.test import TestCase
from rest_framework.test import APIClient


class AuthAPITest(TestCase):
    def test_register(self):
        client = APIClient()
        response = client.post('/api/auth/register/', {
            'username': 'ramazon',
            'email': 'ramazon@example.com',
            'password': 'StrongPass123',
            'password2': 'StrongPass123',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('tokens', response.data)

from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from .models import PaymentRequest, PremiumAccess, Subject, Test
from .views import has_test_access


User = get_user_model()
URL = '/api/admin/grant-access/'


class AdminGrantAccessTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user('boss', 'boss@example.com', 'strong-pass-123', is_staff=True)
        self.student = User.objects.create_user('student', 'Student@Example.com', 'strong-pass-123')
        subject = Subject.objects.create(name='Math', slug='math')
        self.premium = Test.objects.create(subject=subject, title='Premium', is_premium=True, price=Decimal('2990.00'))
        self.free = Test.objects.create(subject=subject, title='Free', is_premium=False, price=0)

    def grant(self, **payload):
        self.client.force_authenticate(self.admin)
        return self.client.post(URL, payload, format='json')

    def test_grant_opens_the_test_for_that_user_only(self):
        other = User.objects.create_user('other', 'other@example.com', 'strong-pass-123')
        response = self.grant(email='student@example.com', test_id=self.premium.id)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(has_test_access(self.student, self.premium))
        self.assertFalse(has_test_access(other, self.premium))
        self.assertEqual(PremiumAccess.objects.get(user=self.student, test=self.premium).amount, Decimal('2990.00'))

    def test_granting_twice_keeps_one_access_row(self):
        self.grant(email='student@example.com', test_id=self.premium.id)
        self.grant(email='student@example.com', test_id=self.premium.id)
        self.assertEqual(PremiumAccess.objects.filter(user=self.student, test=self.premium).count(), 1)

    def test_waiting_payment_request_is_closed_as_approved(self):
        payment = PaymentRequest.objects.create(user=self.student, test=self.premium, amount=self.premium.price)
        self.grant(email='student@example.com', test_id=self.premium.id)
        payment.refresh_from_db()
        self.assertEqual(payment.status, PaymentRequest.STATUS_APPROVED)
        self.assertEqual(payment.reviewed_by, self.admin)
        self.assertTrue(has_test_access(self.student, self.premium))

    def test_rejects_unknown_email_free_test_and_bad_input(self):
        self.assertEqual(self.grant(email='nobody@example.com', test_id=self.premium.id).status_code, 404)
        self.assertEqual(self.grant(email='student@example.com', test_id=self.free.id).status_code, 400)
        self.assertEqual(self.grant(email='student@example.com', test_id='abc').status_code, 400)
        self.assertEqual(self.grant(email='student@example.com', test_id=99999).status_code, 404)

    def test_only_staff_can_grant(self):
        self.client.force_authenticate(self.student)
        response = self.client.post(URL, {'email': 'student@example.com', 'test_id': self.premium.id}, format='json')
        self.assertEqual(response.status_code, 403)
        self.assertFalse(has_test_access(self.student, self.premium))
        self.client.force_authenticate(None)
        self.assertEqual(self.client.post(URL, {}, format='json').status_code, 401)


class TestCatalogTests(APITestCase):
    def test_catalog_is_not_cut_off_after_one_page(self):
        subject = Subject.objects.create(name='Math', slug='math')
        for index in range(25):
            Test.objects.create(subject=subject, title=f'T{index}')
        data = self.client.get('/api/tests/').json()
        self.assertEqual(len(data), 25)

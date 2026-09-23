from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from rest_framework.test import APITestCase

from .models import PaymentRequest, PremiumAccess, Subject, Test


User = get_user_model()


@override_settings(PAYMENT_CARD_NUMBER='8600123412345678', PAYMENT_CARD_HOLDER='Test User', PAYMENT_TELEGRAM_URL='https://t.me/function_payments')
class ManualPaymentPatchTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='student', password='strong-pass-123')
        self.admin = User.objects.create_user(username='admin-reviewer', password='strong-pass-123')
        self.subject = Subject.objects.create(name='Math', slug='math')
        self.free_test = Test.objects.create(
            subject=self.subject,
            title='Free',
            is_premium=False,
            price=0,
        )
        self.premium_test = Test.objects.create(
            subject=self.subject,
            title='Premium',
            is_premium=True,
            price=Decimal('5000.00'),
        )

    def test_free_test_detail_is_public(self):
        response = self.client.get(f'/api/tests/{self.free_test.id}/')
        self.assertEqual(response.status_code, 200)

    def test_premium_detail_is_locked_without_access(self):
        response = self.client.get(f'/api/tests/{self.premium_test.id}/')
        self.assertEqual(response.status_code, 403)
        self.assertTrue(response.data['requires_payment'])

    def test_card_info_requires_authentication(self):
        response = self.client.get('/api/payments/card-info/')
        self.assertEqual(response.status_code, 401)

        self.client.force_authenticate(self.user)
        response = self.client.get('/api/payments/card-info/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['card_number'], '8600123412345678')
        self.assertEqual(response.data['telegram_url'], 'https://t.me/function_payments')

    def test_payment_amount_is_taken_from_database(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(
            '/api/payments/submit/',
            {'test_id': self.premium_test.id, 'transaction_id': 'TRX-001', 'amount': '1'},
            format='multipart',
        )
        self.assertEqual(response.status_code, 201)
        payment = PaymentRequest.objects.get(user=self.user, test=self.premium_test)
        self.assertEqual(payment.amount, Decimal('5000.00'))
        self.assertEqual(payment.status, PaymentRequest.STATUS_PENDING)
        self.assertFalse(PremiumAccess.objects.filter(user=self.user, test=self.premium_test).exists())

    def test_proof_is_required(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(
            '/api/payments/submit/',
            {'test_id': self.premium_test.id},
            format='multipart',
        )
        self.assertEqual(response.status_code, 400)


    def test_telegram_receipt_confirmation_is_accepted(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(
            '/api/payments/submit/',
            {'test_id': self.premium_test.id, 'telegram_receipt_sent': 'true'},
            format='multipart',
        )
        self.assertEqual(response.status_code, 201)
        payment = PaymentRequest.objects.get(user=self.user, test=self.premium_test)
        self.assertTrue(payment.telegram_receipt_sent)

    def test_receipt_upload_is_accepted(self):
        self.client.force_authenticate(self.user)
        receipt = SimpleUploadedFile('receipt.png', b'fake-png-content', content_type='image/png')
        response = self.client.post(
            '/api/payments/submit/',
            {'test_id': self.premium_test.id, 'receipt': receipt},
            format='multipart',
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(PaymentRequest.objects.get(user=self.user).receipt.name)

    def test_admin_approval_grants_access(self):
        payment = PaymentRequest.objects.create(
            user=self.user,
            test=self.premium_test,
            amount=self.premium_test.price,
            transaction_id='TRX-APPROVE',
        )
        payment.approve(reviewed_by=self.admin)

        self.assertTrue(PremiumAccess.objects.filter(
            user=self.user,
            test=self.premium_test,
            status=PremiumAccess.STATUS_PAID,
        ).exists())

        self.client.force_authenticate(self.user)
        response = self.client.get(f'/api/tests/{self.premium_test.id}/')
        self.assertEqual(response.status_code, 200)

    def test_submit_endpoint_is_locked_before_payment(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(
            f'/api/tests/{self.premium_test.id}/submit/',
            {'answers': []},
            format='json',
        )
        self.assertEqual(response.status_code, 403)

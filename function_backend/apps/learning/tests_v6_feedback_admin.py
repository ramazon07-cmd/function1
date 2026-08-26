import shutil
import tempfile
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from rest_framework.test import APITestCase

from .models import Feedback, PaymentRequest, PremiumAccess, Subject, Test


TEST_MEDIA_ROOT = tempfile.mkdtemp(prefix='function1-v6-media-')


@override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT)
class FeedbackAndAdminPaymentsV6Tests(APITestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TEST_MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        self.user = User.objects.create_user('student', 'student@example.com', 'Password123!')
        self.admin = User.objects.create_user('admin', 'admin@example.com', 'Password123!', is_staff=True)
        self.subject = Subject.objects.create(name='Math', slug='math')
        self.test = Test.objects.create(subject=self.subject, title='Premium Test', is_premium=True, price=5000)

    def test_feedback_requires_profile_image_and_lists_saved_feedback(self):
        no_image = self.client.post('/api/feedback/', {
            'name': 'Ali', 'direction': 'Math', 'message': 'Zo‘r platforma',
        }, format='multipart')
        self.assertEqual(no_image.status_code, 400)

        image = SimpleUploadedFile('avatar.png', b'fake-png-content', content_type='image/png')
        response = self.client.post('/api/feedback/', {
            'name': 'Ali', 'direction': 'Math', 'message': 'Zo‘r platforma', 'profile_image': image,
        }, format='multipart')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Feedback.objects.count(), 1)
        self.assertTrue(response.data['feedback']['profile_image_url'])

        listing = self.client.get('/api/feedback/')
        self.assertEqual(listing.status_code, 200)
        self.assertEqual(listing.data[0]['name'], 'Ali')

    def test_staff_only_admin_payment_approve_activates_premium(self):
        payment = PaymentRequest.objects.create(
            user=self.user,
            test=self.test,
            amount=self.test.price,
            transaction_id='TX-123',
        )

        self.client.force_authenticate(self.user)
        denied = self.client.get('/api/admin/payments/')
        self.assertEqual(denied.status_code, 403)

        self.client.force_authenticate(self.admin)
        listing = self.client.get('/api/admin/payments/?status=pending')
        self.assertEqual(listing.status_code, 200)
        self.assertEqual(len(listing.data), 1)

        approved = self.client.post(
            f'/api/admin/payments/{payment.id}/decision/',
            {'action': 'approve', 'admin_note': 'Chek tasdiqlandi'},
            format='json',
        )
        self.assertEqual(approved.status_code, 200)
        self.assertTrue(approved.data['premium_active'])
        payment.refresh_from_db()
        self.assertEqual(payment.status, PaymentRequest.STATUS_APPROVED)
        self.assertTrue(PremiumAccess.objects.filter(
            user=self.user, test=self.test, status=PremiumAccess.STATUS_PAID
        ).exists())

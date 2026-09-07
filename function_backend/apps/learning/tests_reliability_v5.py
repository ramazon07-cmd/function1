from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from tempfile import TemporaryDirectory
from django.urls import reverse
from rest_framework.test import APITestCase

from .local_question_bank import load_local_question_bank
from .models import Feedback, LocalAttemptAnswer, Subject, Test, TestAttempt


class FeedbackPersistenceTests(APITestCase):
    def setUp(self):
        media = TemporaryDirectory()
        self.addCleanup(media.cleanup)
        self.enterContext(override_settings(MEDIA_ROOT=media.name))

    def test_public_feedback_is_persisted(self):
        response = self.client.post(
            reverse('feedback'),
            {
                'name': 'Javohir',
                'direction': 'Matematika',
                'message': 'Platforma juda foydali.',
                'profile_image': SimpleUploadedFile('avatar.png', b'test-image', content_type='image/png'),
            },
            format='multipart',
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(Feedback.objects.count(), 1)
        feedback = Feedback.objects.get()
        self.assertEqual(feedback.name, 'Javohir')
        self.assertEqual(feedback.direction, 'Matematika')
        self.assertEqual(feedback.message, 'Platforma juda foydali.')


class ReliableLocalResultTests(APITestCase):
    def setUp(self):
        bank = load_local_question_bank()
        self.bank_version = bank['version']
        self.entry = bank['sets'][0]
        self.subject = Subject.objects.create(
            name='Audit subject',
            slug=self.entry['category'],
            order=999,
        )
        self.test = Test.objects.create(
            subject=self.subject,
            title=self.entry['topic'],
            duration_minutes=30,
            is_premium=False,
            is_active=True,
        )
        User = get_user_model()
        self.user = User.objects.create_user(username='reliable-user', password='test-pass-123')
        self.client.force_authenticate(self.user)

    def payload(self, client_attempt_id='attempt-v5-001'):
        first = self.entry['questions'][0]
        return {
            # Spoofed fields must never become the source of truth.
            'score': 999,
            'total_questions': 1,
            'answers': [
                {
                    'question_index': 0,
                    'selected_answer': first['answer'],
                }
            ],
            'duration_seconds': 123,
            'question_bank_version': self.bank_version,
            'client_attempt_id': client_attempt_id,
        }

    def test_backend_recomputes_score_and_stores_all_question_rows(self):
        response = self.client.post(
            reverse('record_local_attempt', kwargs={'pk': self.test.pk}),
            self.payload(),
            format='json',
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data['score'], 1)
        self.assertEqual(response.data['total_questions'], len(self.entry['questions']))
        attempt = TestAttempt.objects.get()
        self.assertEqual(attempt.score, 1)
        self.assertEqual(attempt.total_questions, len(self.entry['questions']))
        self.assertEqual(attempt.question_bank_version, self.bank_version)
        self.assertEqual(LocalAttemptAnswer.objects.filter(attempt=attempt).count(), len(self.entry['questions']))

    def test_same_client_attempt_is_idempotent(self):
        url = reverse('record_local_attempt', kwargs={'pk': self.test.pk})
        first = self.client.post(url, self.payload('same-attempt'), format='json')
        second = self.client.post(url, self.payload('same-attempt'), format='json')
        self.assertEqual(first.status_code, 201, first.data)
        self.assertEqual(second.status_code, 200, second.data)
        self.assertEqual(TestAttempt.objects.count(), 1)
        self.assertEqual(first.data['id'], second.data['id'])

    def test_bank_version_mismatch_is_rejected(self):
        payload = self.payload('mismatch-attempt')
        payload['question_bank_version'] = '0' * 64
        response = self.client.post(
            reverse('record_local_attempt', kwargs={'pk': self.test.pk}),
            payload,
            format='json',
        )
        self.assertEqual(response.status_code, 409, response.data)
        self.assertEqual(TestAttempt.objects.count(), 0)

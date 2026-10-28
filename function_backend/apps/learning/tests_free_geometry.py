import json
from io import StringIO
from pathlib import Path

from django.contrib.auth import get_user_model
from django.core.management import call_command
from rest_framework.test import APITestCase

from .local_question_bank import get_local_test_bank_entry
from .models import LocalAttemptAnswer, Test, TestAttempt


FREE_TOPICS = [
    'Koordinata tekisligi', 'Yuzalar', "To'rtburchaklar",
    "Ko'pburchaklar", 'Hajmlar',
]


class FreeGeometryTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('seed_function_data', stdout=StringIO())
        cls.user = get_user_model().objects.create_user(username='geometry-student')

    def test_catalog_and_public_details_include_five_free_tests(self):
        response = self.client.get('/api/tests/?subject=geo&premium=false')
        self.assertEqual(response.status_code, 200)
        self.assertEqual([test['title'] for test in response.data], FREE_TOPICS)
        for test in response.data:
            self.assertFalse(test['is_premium'])
            self.assertEqual(float(test['price']), 0)
            detail = self.client.get(f"/api/tests/{test['id']}/")
            self.assertEqual(detail.status_code, 200)
            self.assertEqual(len(detail.data['questions']), 15)
        self.assertEqual(Test.objects.filter(subject__slug='geo', is_premium=True).count(), 5)

    def test_reseed_reactivates_free_tests_and_preserves_questions_and_attempts(self):
        tests = Test.objects.filter(subject__slug='geo', title__in=FREE_TOPICS)
        test = tests.first()
        question_ids = list(test.questions.values_list('id', flat=True))
        attempt = TestAttempt.objects.create(user=self.user, test=test, total_questions=15)
        tests.update(is_active=False)
        for _ in range(2):
            call_command('seed_function_data', stdout=StringIO())
        self.assertEqual(tests.filter(is_active=True, is_premium=False, price=0).count(), 5)
        self.assertEqual(list(test.questions.values_list('id', flat=True)), question_ids)
        self.assertTrue(TestAttempt.objects.filter(pk=attempt.pk, test=test).exists())

    def test_frontend_questions_match_server_scoring_bank_and_seeded_questions(self):
        frontend_path = Path(__file__).resolve().parents[3] / 'bilmman/src/data/freeGeometryTests.json'
        frontend_sets = json.loads(frontend_path.read_text(encoding='utf-8'))
        self.assertEqual([entry['topic'] for entry in frontend_sets], FREE_TOPICS)
        for entry in frontend_sets:
            _, server_entry = get_local_test_bank_entry('geo', entry['topic'])
            self.assertEqual(entry, server_entry)
            test = Test.objects.get(subject__slug='geo', title=entry['topic'])
            for question, bank_question in zip(test.questions.all(), entry['questions']):
                self.assertEqual(question.text, bank_question['question'])
                self.assertEqual(list(question.options.values_list('text', flat=True)), bank_question['options'])
                self.assertEqual(question.options.get(is_correct=True).text, bank_question['answer'])

    def test_all_five_tests_save_verified_results_and_show_in_history(self):
        self.client.force_authenticate(self.user)
        for topic in FREE_TOPICS:
            test = Test.objects.get(subject__slug='geo', title=topic)
            _, entry = get_local_test_bank_entry('geo', topic)
            payload = {
                'client_attempt_id': f'free-geometry-{test.pk}',
                'duration_seconds': 60,
                'answers': [
                    {'question_index': i, 'selected_answer': question['answer']}
                    for i, question in enumerate(entry['questions'])
                ],
            }
            url = f'/api/tests/{test.pk}/record-verified-local-attempt-v13/'
            response = self.client.post(url, payload, format='json')
            self.assertEqual(response.status_code, 201, response.data)
            self.assertEqual(response.data['score'], 15)
            self.assertEqual(response.data['total_questions'], 15)
            self.assertEqual(LocalAttemptAnswer.objects.filter(attempt_id=response.data['id']).count(), 15)
            retry = self.client.post(url, payload, format='json')
            self.assertEqual(retry.status_code, 200, retry.data)
            self.assertEqual(retry.data['id'], response.data['id'])
        self.assertEqual(TestAttempt.objects.filter(user=self.user).count(), 5)
        history = self.client.get('/api/attempts/')
        self.assertEqual(history.status_code, 200)
        self.assertEqual({row['test_title'] for row in history.data['results']}, set(FREE_TOPICS))

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient
from .models import Subject, Test, Question, Option


class LearningAPITest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='StrongPass123')
        self.subject = Subject.objects.create(name='Matematika', slug='math')
        self.test = Test.objects.create(subject=self.subject, title='Demo test')
        self.question = Question.objects.create(test=self.test, text='2 + 2 = ?')
        self.wrong = Option.objects.create(question=self.question, text='3', is_correct=False)
        self.correct = Option.objects.create(question=self.question, text='4', is_correct=True)
        self.client = APIClient()

    def test_subjects_list(self):
        response = self.client.get('/api/subjects/')
        self.assertEqual(response.status_code, 200)

    def test_submit_test(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(f'/api/tests/{self.test.id}/submit/', {
            'answers': [{'question_id': self.question.id, 'option_id': self.correct.id}]
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['score'], 1)

    def test_record_local_attempt(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(f'/api/tests/{self.test.id}/record-local-attempt/', {
            'score': 12,
            'total_questions': 15,
            'duration_seconds': 420,
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['score'], 12)
        self.assertEqual(response.data['total_questions'], 15)
        self.assertEqual(response.data['duration_seconds'], 420)

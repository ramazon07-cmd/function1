from django.contrib.auth import get_user_model
from django.core.management import call_command
from rest_framework.test import APITestCase

from .local_question_bank import get_local_test_bank_entry
from .models import Test

TOPIC = 'Koordinata tekisligi'


class FreeGeometryCoordinateTestTests(APITestCase):
    def test_bank_entry_is_complete(self):
        _, entry = get_local_test_bank_entry('geo', TOPIC)
        self.assertEqual(len(entry['questions']), 10)
        for question in entry['questions']:
            self.assertIn(question['answer'], question['options'])
            self.assertEqual(len(set(question['options'])), len(question['options']))

    def test_seed_makes_it_a_free_playable_test_scored_by_the_server(self):
        call_command('seed_function_data', verbosity=0)
        test = Test.objects.get(subject__slug='geo', title=TOPIC)
        self.assertFalse(test.is_premium)
        self.assertTrue(test.is_active)
        self.assertEqual(test.questions.count(), 10)
        self.assertEqual(test.questions.filter(options__is_correct=True).distinct().count(), 10)

        _, entry = get_local_test_bank_entry('geo', TOPIC)
        user = get_user_model().objects.create_user('player', 'player@example.com', 'strong-pass-123')
        self.client.force_authenticate(user)
        response = self.client.post(
            f'/api/tests/{test.id}/record-verified-local-attempt-v13/',
            {
                'answers': [{'question_index': q['index'], 'selected_answer': q['answer']} for q in entry['questions']],
                'duration_seconds': 60,
                'client_attempt_id': 'coord-1',
            },
            format='json',
        )
        self.assertIn(response.status_code, (200, 201), response.data)
        self.assertEqual(response.data['score'], 10)

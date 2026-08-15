from django.db import transaction
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Subject, Course, Test, Question, Option, TestAttempt, Answer, PremiumAccess
from .serializers import (
    SubjectSerializer, CourseSerializer, TestListSerializer, TestDetailSerializer,
    SubmitTestSerializer, LocalTestAttemptSerializer, TestAttemptSerializer, PremiumPurchaseSerializer,
    PremiumAccessSerializer,
)


class SubjectListAPIView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class CourseListAPIView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Course.objects.select_related('subject').filter(is_active=True)
        subject = self.request.query_params.get('subject')
        if subject:
            qs = qs.filter(subject__slug=subject)
        return qs


class TestListAPIView(generics.ListAPIView):
    serializer_class = TestListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Test.objects.select_related('subject').filter(is_active=True)
        subject = self.request.query_params.get('subject')
        premium = self.request.query_params.get('premium')
        search = self.request.query_params.get('search')
        if subject:
            qs = qs.filter(subject__slug=subject)
        if premium in ('true', 'false'):
            qs = qs.filter(is_premium=(premium == 'true'))
        if search:
            qs = qs.filter(title__icontains=search)
        return qs


class TestDetailAPIView(generics.RetrieveAPIView):
    queryset = Test.objects.select_related('subject').prefetch_related('questions__options').filter(is_active=True)
    serializer_class = TestDetailSerializer
    permission_classes = [permissions.AllowAny]


class SubmitTestAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        serializer = SubmitTestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        test = generics.get_object_or_404(Test.objects.prefetch_related('questions__options'), pk=pk, is_active=True)
        answers_data = serializer.validated_data['answers']
        questions = list(test.questions.all())

        # Frontend yuborgan javoblarni question_id bo‘yicha map qilamiz.
        # Duplicate kelib qolsa, oxirgi javob olinadi.
        submitted_answers = {item['question_id']: item.get('option_id') for item in answers_data}

        attempt = TestAttempt.objects.create(
            user=request.user,
            test=test,
            total_questions=len(questions),
        )

        score = 0
        for question in questions:
            option = None
            option_id = submitted_answers.get(question.id)

            if option_id is not None:
                option = Option.objects.filter(id=option_id, question=question).first()

            is_correct = bool(option and option.is_correct)
            if is_correct:
                score += 1

            # Har bir savol uchun Answer yozamiz.
            # Shunda javob berilmagan savollar ham natijada xato sifatida ko‘rinadi.
            Answer.objects.create(
                attempt=attempt,
                question=question,
                selected_option=option,
                is_correct=is_correct,
            )

        attempt.score = score
        attempt.total_questions = len(questions)
        attempt.finish()
        attempt.refresh_from_db()

        return Response(TestAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)


class RecordLocalTestAttemptAPIView(APIView):
    """Record the result of a frontend-owned image/rich-content test bank."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        serializer = LocalTestAttemptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        test = generics.get_object_or_404(Test, pk=pk, is_active=True)
        data = serializer.validated_data

        attempt = TestAttempt.objects.create(
            user=request.user,
            test=test,
            score=data['score'],
            total_questions=data['total_questions'],
            duration_seconds=data.get('duration_seconds', 0),
            finished_at=timezone.now(),
        )
        return Response(TestAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)


class MyAttemptListAPIView(generics.ListAPIView):
    serializer_class = TestAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TestAttempt.objects.filter(user=self.request.user).select_related('test', 'test__subject').prefetch_related('answers__question__options', 'answers__selected_option')


class PremiumMockPurchaseAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PremiumPurchaseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        test = None
        subject = None
        if data.get('test_id'):
            test = generics.get_object_or_404(Test, id=data['test_id'])
        if data.get('subject_id'):
            subject = generics.get_object_or_404(Subject, id=data['subject_id'])

        access = PremiumAccess.objects.create(
            user=request.user,
            test=test,
            subject=subject,
            amount=data.get('amount', 5000),
            status=PremiumAccess.STATUS_PAID,
        )
        return Response({
            'message': 'Premium access activated in demo mode.',
            'access': PremiumAccessSerializer(access).data,
        }, status=status.HTTP_201_CREATED)

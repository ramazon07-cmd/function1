from django.conf import settings
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Subject,
    Course,
    Test,
    Option,
    TestAttempt,
    Answer,
    PremiumAccess,
    PaymentRequest,
)
from .serializers import (
    SubjectSerializer,
    CourseSerializer,
    TestListSerializer,
    TestDetailSerializer,
    SubmitTestSerializer,
    LocalTestAttemptSerializer,
    TestAttemptSerializer,
    PaymentRequestCreateSerializer,
    PaymentRequestSerializer,
)


def has_test_access(user, test):
    """Server-side premium gate. Frontend state is never trusted."""
    if not test.is_premium:
        return True
    if not user or not user.is_authenticated:
        return False
    return PremiumAccess.objects.filter(
        user=user,
        status=PremiumAccess.STATUS_PAID,
    ).filter(Q(test=test) | Q(subject=test.subject)).exists()


def premium_required_response(test):
    return Response(
        {
            'detail': 'Bu premium test. Avval to‘lov tasdiqlanishi kerak.',
            'requires_payment': True,
            'test_id': test.id,
            'price': str(test.price),
        },
        status=status.HTTP_403_FORBIDDEN,
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

    def retrieve(self, request, *args, **kwargs):
        test = self.get_object()
        if not has_test_access(request.user, test):
            return premium_required_response(test)
        return Response(self.get_serializer(test).data)


class SubmitTestAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        test = generics.get_object_or_404(
            Test.objects.prefetch_related('questions__options'),
            pk=pk,
            is_active=True,
        )
        if not has_test_access(request.user, test):
            return premium_required_response(test)

        serializer = SubmitTestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        answers_data = serializer.validated_data['answers']
        questions = list(test.questions.all())
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
    """Record a frontend-owned test result, but never bypass premium access."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        test = generics.get_object_or_404(Test, pk=pk, is_active=True)
        if not has_test_access(request.user, test):
            return premium_required_response(test)

        serializer = LocalTestAttemptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
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
        return TestAttempt.objects.filter(user=self.request.user).select_related(
            'test', 'test__subject'
        ).prefetch_related(
            'answers__question__options', 'answers__selected_option'
        )


class PaymentCardInfoAPIView(APIView):
    """Return the configured P2P destination card to authenticated users only."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        card_number = ''.join(ch for ch in getattr(settings, 'PAYMENT_CARD_NUMBER', '') if ch.isdigit())
        if len(card_number) < 12:
            return Response(
                {'detail': 'PAYMENT_CARD_NUMBER serverda sozlanmagan.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        masked = f'•••• •••• •••• {card_number[-4:]}'
        return Response({
            'card_number': card_number,
            'masked_card_number': masked,
            'card_holder': getattr(settings, 'PAYMENT_CARD_HOLDER', ''),
        })


class PaymentRequestCreateAPIView(APIView):
    """User submits transaction ID and/or receipt after a manual card transfer."""

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    @transaction.atomic
    def post(self, request):
        serializer = PaymentRequestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        test = generics.get_object_or_404(Test, pk=data['test_id'], is_active=True)
        if not test.is_premium:
            return Response({'detail': 'Bu test bepul.'}, status=status.HTTP_400_BAD_REQUEST)

        if has_test_access(request.user, test):
            return Response({
                'message': 'Bu test uchun premium access allaqachon mavjud.',
                'has_access': True,
            })

        # A user gets one active pending request per test. Re-submission updates its proof.
        payment = PaymentRequest.objects.filter(
            user=request.user,
            test=test,
            status=PaymentRequest.STATUS_PENDING,
        ).first()

        created = payment is None
        if payment is None:
            payment = PaymentRequest(user=request.user, test=test)

        # SECURITY: amount always comes from Test.price in the database.
        payment.amount = test.price
        payment.transaction_id = data.get('transaction_id', '')
        if data.get('receipt') is not None:
            payment.receipt = data['receipt']
        payment.save()

        output = PaymentRequestSerializer(payment, context={'request': request}).data
        return Response(
            {
                'message': 'To‘lov ma’lumoti yuborildi. Admin tasdiqlashini kuting.',
                'payment': output,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class MyPaymentRequestListAPIView(generics.ListAPIView):
    serializer_class = PaymentRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return PaymentRequest.objects.filter(user=self.request.user).select_related('test')

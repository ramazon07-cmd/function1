from django.conf import settings
from django.db import IntegrityError, transaction
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
    LocalAttemptAnswer,
    Feedback,
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
    FeedbackSerializer,
    AdminPaymentRequestSerializer,
)

from .local_question_bank import get_local_test_bank_entry


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
    """Server-verified persistence for legacy `bilmman` question-bank results."""

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        test = generics.get_object_or_404(
            Test.objects.select_related('subject'),
            pk=pk,
            is_active=True,
        )
        if not has_test_access(request.user, test):
            return premium_required_response(test)

        serializer = LocalTestAttemptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        server_version, bank_entry = get_local_test_bank_entry(test.subject.slug, test.title)
        if bank_entry is None:
            return Response(
                {
                    'detail': 'Bu test uchun server question-bank mapping topilmadi.',
                    'code': 'question_bank_mapping_missing',
                },
                status=status.HTTP_409_CONFLICT,
            )

        if data['question_bank_version'] != server_version:
            return Response(
                {
                    'detail': 'Frontend va backend question-bank versiyalari mos emas. Sahifani yangilang.',
                    'code': 'question_bank_version_mismatch',
                    'server_version': server_version,
                },
                status=status.HTTP_409_CONFLICT,
            )

        client_attempt_id = data['client_attempt_id'].strip()
        existing = TestAttempt.objects.filter(client_attempt_id=client_attempt_id).first()
        if existing:
            if existing.user_id == request.user.id and existing.test_id == test.id:
                return Response(TestAttemptSerializer(existing).data, status=status.HTTP_200_OK)
            return Response(
                {'detail': 'client_attempt_id boshqa attempt tomonidan ishlatilgan.'},
                status=status.HTTP_409_CONFLICT,
            )

        questions = bank_entry.get('questions') or []
        if not questions:
            return Response(
                {'detail': 'Server question bank bo‘sh.'},
                status=status.HTTP_409_CONFLICT,
            )

        submitted = {
            item['question_index']: item.get('selected_answer')
            for item in data['answers']
        }
        if any(index >= len(questions) for index in submitted):
            return Response(
                {'detail': 'Noto‘g‘ri question_index yuborildi.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        score = 0
        rows = []
        for index, question in enumerate(questions):
            selected = submitted.get(index)
            if selected is None:
                selected = ''
            selected = str(selected)
            allowed_options = [str(value) for value in (question.get('options') or [])]
            if selected and selected not in allowed_options:
                return Response(
                    {
                        'detail': f'{index + 1}-savol uchun tanlangan variant mavjud emas.',
                        'question_index': index,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            correct = str(question.get('answer', ''))
            is_correct = bool(selected) and selected == correct
            if is_correct:
                score += 1

            rows.append(
                LocalAttemptAnswer(
                    question_index=index,
                    question_text=str(question.get('question') or '[Rasmli savol]'),
                    selected_answer=selected,
                    correct_answer=correct,
                    is_correct=is_correct,
                )
            )

        max_duration = max(int(test.duration_minutes or 30) * 60, 1)
        duration = min(int(data.get('duration_seconds', 0)), max_duration)
        # The unique client_attempt_id makes saving idempotent even if the browser
        # retries the same request. The nested savepoint also handles a rare race
        # where two identical requests arrive almost simultaneously.
        try:
            with transaction.atomic():
                attempt = TestAttempt.objects.create(
                    user=request.user,
                    test=test,
                    score=score,
                    total_questions=len(questions),
                    duration_seconds=duration,
                    finished_at=timezone.now(),
                    client_attempt_id=client_attempt_id,
                    question_bank_version=server_version,
                )
                for row in rows:
                    row.attempt = attempt
                LocalAttemptAnswer.objects.bulk_create(rows)
        except IntegrityError:
            existing = TestAttempt.objects.filter(client_attempt_id=client_attempt_id).first()
            if existing and existing.user_id == request.user.id and existing.test_id == test.id:
                return Response(TestAttemptSerializer(existing).data, status=status.HTTP_200_OK)
            raise

        attempt.refresh_from_db()
        return Response(TestAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)


class MyAttemptListAPIView(generics.ListAPIView):
    serializer_class = TestAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TestAttempt.objects.filter(user=self.request.user).select_related(
            'test', 'test__subject'
        ).prefetch_related(
            'answers__question__options', 'answers__selected_option', 'local_answers'
        )


class FeedbackCreateAPIView(APIView):
    """Public feedback feed + multipart submission for the home-page carousel."""

    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        feedbacks = Feedback.objects.all().order_by('-created_at')[:60]
        serializer = FeedbackSerializer(feedbacks, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = FeedbackSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = request.user if request.user and request.user.is_authenticated else None
        feedback = serializer.save(user=user)
        return Response(
            {
                'message': 'Fikringiz saqlandi va karuselga qo‘shildi. Rahmat!',
                'feedback': FeedbackSerializer(feedback, context={'request': request}).data,
            },
            status=status.HTTP_201_CREATED,
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


class AdminPaymentRequestListAPIView(generics.ListAPIView):
    """Staff-only payment review feed for the custom React admin page."""

    serializer_class = AdminPaymentRequestSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = None

    def get_queryset(self):
        qs = PaymentRequest.objects.select_related(
            'user', 'test', 'test__subject', 'reviewed_by'
        ).all()
        payment_status = (self.request.query_params.get('status') or '').strip().lower()
        if payment_status in {
            PaymentRequest.STATUS_PENDING,
            PaymentRequest.STATUS_APPROVED,
            PaymentRequest.STATUS_REJECTED,
        }:
            qs = qs.filter(status=payment_status)
        return qs.order_by('-created_at')


class AdminPaymentRequestDecisionAPIView(APIView):
    """Approve/reject a manual payment. Approval activates PremiumAccess atomically."""

    permission_classes = [permissions.IsAdminUser]

    @transaction.atomic
    def post(self, request, pk):
        payment = generics.get_object_or_404(
            PaymentRequest.objects.select_for_update().select_related(
                'user', 'test', 'test__subject', 'reviewed_by'
            ),
            pk=pk,
        )
        action = (request.data.get('action') or '').strip().lower()
        note = (request.data.get('admin_note') or '').strip()[:3000]

        if action not in {'approve', 'reject'}:
            return Response(
                {'detail': 'action faqat approve yoki reject bo‘lishi mumkin.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if action == 'approve':
            if payment.status == PaymentRequest.STATUS_REJECTED:
                return Response(
                    {'detail': 'Rad etilgan to‘lovni qayta approve qilish uchun yangi payment request kerak.'},
                    status=status.HTTP_409_CONFLICT,
                )
            payment.admin_note = note
            if payment.status != PaymentRequest.STATUS_APPROVED:
                payment.save(update_fields=['admin_note', 'updated_at'])
                payment.approve(reviewed_by=request.user)
            elif note != payment.admin_note:
                payment.save(update_fields=['admin_note', 'updated_at'])

            payment.refresh_from_db()
            return Response({
                'message': 'To‘lov tasdiqlandi. Premium aktivlashtirildi.',
                'premium_active': PremiumAccess.objects.filter(
                    user=payment.user,
                    test=payment.test,
                    status=PremiumAccess.STATUS_PAID,
                ).exists(),
                'payment': AdminPaymentRequestSerializer(payment, context={'request': request}).data,
            })

        # reject
        if payment.status == PaymentRequest.STATUS_APPROVED:
            return Response(
                {'detail': 'Tasdiqlangan to‘lovni bu endpoint orqali reject qilib bo‘lmaydi.'},
                status=status.HTTP_409_CONFLICT,
            )
        if payment.status == PaymentRequest.STATUS_PENDING:
            payment.admin_note = note
            payment.save(update_fields=['admin_note', 'updated_at'])
            payment.reject(reviewed_by=request.user)
        else:
            payment.admin_note = note
            payment.save(update_fields=['admin_note', 'updated_at'])
        payment.refresh_from_db()
        return Response({
            'message': 'To‘lov rad etildi.',
            'premium_active': False,
            'payment': AdminPaymentRequestSerializer(payment, context={'request': request}).data,
        })

from django.urls import path

from .views import (
    SubjectListAPIView,
    CourseListAPIView,
    TestListAPIView,
    TestDetailAPIView,
    SubmitTestAPIView,
    RecordLocalTestAttemptAPIView,
    MyAttemptListAPIView,
    PaymentCardInfoAPIView,
    PaymentRequestCreateAPIView,
    MyPaymentRequestListAPIView,
    FeedbackCreateAPIView,
)

urlpatterns = [
    path('subjects/', SubjectListAPIView.as_view(), name='subjects'),
    path('courses/', CourseListAPIView.as_view(), name='courses'),
    path('tests/', TestListAPIView.as_view(), name='tests'),
    path('tests/<int:pk>/', TestDetailAPIView.as_view(), name='test_detail'),
    path('tests/<int:pk>/submit/', SubmitTestAPIView.as_view(), name='test_submit'),
    path('tests/<int:pk>/record-local-attempt/', RecordLocalTestAttemptAPIView.as_view(), name='record_local_attempt'),
    path('attempts/', MyAttemptListAPIView.as_view(), name='my_attempts'),
    path('feedback/', FeedbackCreateAPIView.as_view(), name='feedback_create'),
    path('payments/card-info/', PaymentCardInfoAPIView.as_view(), name='payment_card_info'),
    path('payments/submit/', PaymentRequestCreateAPIView.as_view(), name='payment_submit'),
    path('payments/mine/', MyPaymentRequestListAPIView.as_view(), name='my_payment_requests'),
]

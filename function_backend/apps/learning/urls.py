from django.urls import path
from .views import (
    SubjectListAPIView, CourseListAPIView, TestListAPIView, TestDetailAPIView,
    SubmitTestAPIView, RecordLocalTestAttemptAPIView, MyAttemptListAPIView, PremiumMockPurchaseAPIView,
)

urlpatterns = [
    path('subjects/', SubjectListAPIView.as_view(), name='subjects'),
    path('courses/', CourseListAPIView.as_view(), name='courses'),
    path('tests/', TestListAPIView.as_view(), name='tests'),
    path('tests/<int:pk>/', TestDetailAPIView.as_view(), name='test_detail'),
    path('tests/<int:pk>/submit/', SubmitTestAPIView.as_view(), name='test_submit'),
    path('tests/<int:pk>/record-local-attempt/', RecordLocalTestAttemptAPIView.as_view(), name='record_local_attempt'),
    path('attempts/', MyAttemptListAPIView.as_view(), name='my_attempts'),
    path('premium/mock-purchase/', PremiumMockPurchaseAPIView.as_view(), name='premium_mock_purchase'),
]

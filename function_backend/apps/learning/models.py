from django.conf import settings
from django.db import models, transaction
from django.utils import timezone


class Subject(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=80, unique=True)
    description = models.TextField(blank=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Course(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='courses')
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    level = models.CharField(max_length=80, default='Boshlangich')
    image_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


class Test(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='tests')
    title = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField(default=30)
    is_premium = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['subject__order', 'order', 'title']

    def __str__(self):
        return f'{self.subject.name} - {self.title}'


class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    explanation = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.text[:80]


class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.text


class TestAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='test_attempts')
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='attempts')
    score = models.PositiveIntegerField(default=0)
    total_questions = models.PositiveIntegerField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    duration_seconds = models.PositiveIntegerField(default=0)
    # FUNCTION1_RELIABLE_RESULTS_V5: idempotent client submission + exact bank version.
    client_attempt_id = models.CharField(max_length=80, null=True, blank=True, unique=True)
    question_bank_version = models.CharField(max_length=64, blank=True, default='')

    class Meta:
        ordering = ['-started_at']

    @property
    def percentage(self):
        if not self.total_questions:
            return 0
        return round((self.score / self.total_questions) * 100, 2)

    def finish(self):
        self.finished_at = timezone.now()
        if self.started_at:
            self.duration_seconds = int((self.finished_at - self.started_at).total_seconds())
        self.save(update_fields=['score', 'total_questions', 'finished_at', 'duration_seconds'])

    def __str__(self):
        return f'{self.user} - {self.test} - {self.score}/{self.total_questions}'


class Answer(models.Model):
    attempt = models.ForeignKey(TestAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(Option, on_delete=models.SET_NULL, null=True, blank=True)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.question_id}: {self.is_correct}'


class PremiumAccess(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_PAID = 'paid'
    STATUS_CHOICES = (
        (STATUS_PENDING, 'Pending'),
        (STATUS_PAID, 'Paid'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='premium_accesses')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True, blank=True)
    test = models.ForeignKey(Test, on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user} - {self.status}'


class PaymentRequest(models.Model):
    """Manual P2P payment proof submitted by a user for a premium test."""

    STATUS_PENDING = 'pending'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'
    STATUS_CHOICES = (
        (STATUS_PENDING, 'Pending'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_REJECTED, 'Rejected'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payment_requests')
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='payment_requests')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=120, blank=True)
    receipt = models.FileField(upload_to='payment_receipts/%Y/%m/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    admin_note = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_payment_requests',
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'test', 'status'], name='pay_user_test_status_idx'),
            models.Index(fields=['status', 'created_at'], name='pay_status_created_idx'),
        ]

    def __str__(self):
        return f'{self.user} - {self.test} - {self.status}'

    @transaction.atomic
    def approve(self, reviewed_by=None):
        """Approve this proof and grant test access atomically."""
        if self.status == self.STATUS_APPROVED:
            return PremiumAccess.objects.filter(
                user=self.user, test=self.test, status=PremiumAccess.STATUS_PAID
            ).first()

        self.status = self.STATUS_APPROVED
        self.reviewed_by = reviewed_by
        self.reviewed_at = timezone.now()
        self.save(update_fields=['status', 'reviewed_by', 'reviewed_at', 'updated_at'])

        access = PremiumAccess.objects.filter(user=self.user, test=self.test).first()
        if access:
            access.amount = self.amount
            access.status = PremiumAccess.STATUS_PAID
            access.save(update_fields=['amount', 'status'])
        else:
            access = PremiumAccess.objects.create(
                user=self.user,
                test=self.test,
                amount=self.amount,
                status=PremiumAccess.STATUS_PAID,
            )
        return access

    def reject(self, reviewed_by=None):
        if self.status != self.STATUS_PENDING:
            return False
        self.status = self.STATUS_REJECTED
        self.reviewed_by = reviewed_by
        self.reviewed_at = timezone.now()
        self.save(update_fields=['status', 'reviewed_by', 'reviewed_at', 'updated_at'])
        return True

class LocalAttemptAnswer(models.Model):
    """Auditable answer rows for legacy `bilmman` local question-bank attempts."""

    attempt = models.ForeignKey(
        TestAttempt,
        on_delete=models.CASCADE,
        related_name='local_answers',
    )
    question_index = models.PositiveIntegerField()
    question_text = models.TextField(blank=True)
    selected_answer = models.TextField(blank=True)
    correct_answer = models.TextField()
    is_correct = models.BooleanField(default=False)

    class Meta:
        ordering = ['question_index', 'id']
        constraints = [
            models.UniqueConstraint(
                fields=['attempt', 'question_index'],
                name='uniq_local_answer_attempt_q',
            ),
        ]

    def __str__(self):
        return f'{self.attempt_id} / Q{self.question_index + 1}: {self.is_correct}'


class Feedback(models.Model):
    """Feedback submitted from the public home-page form."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='site_feedbacks',
    )
    name = models.CharField(max_length=120)
    direction = models.CharField(max_length=160, blank=True)
    message = models.TextField()
    # V6: optional in DB for backward compatibility, required for new submissions by serializer.
    profile_image = models.FileField(upload_to='feedback_profiles/%Y/%m/', blank=True, null=True)
    is_reviewed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['is_reviewed', 'created_at'], name='feedback_reviewed_created_idx'),
        ]

    def __str__(self):
        return f'{self.name}: {self.message[:60]}'


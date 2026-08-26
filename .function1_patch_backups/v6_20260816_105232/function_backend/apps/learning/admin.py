from django.contrib import admin
from django.utils.html import format_html

from .models import (
    Subject,
    Course,
    Test,
    Question,
    Option,
    TestAttempt,
    Answer,
    PremiumAccess,
    PaymentRequest,
    LocalAttemptAnswer,
    Feedback,
)


class OptionInline(admin.TabularInline):
    model = Option
    extra = 4


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_featured', 'order')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'slug')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'level', 'is_active', 'order')
    list_filter = ('subject', 'is_active')
    search_fields = ('title', 'description')


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'duration_minutes', 'is_premium', 'price', 'is_active', 'order')
    list_filter = ('subject', 'is_premium', 'is_active')
    search_fields = ('title', 'description')
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'test', 'order')
    list_filter = ('test__subject', 'test')
    search_fields = ('text',)
    inlines = [OptionInline]


@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ('text', 'question', 'is_correct', 'order')
    list_filter = ('is_correct',)


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 0
    readonly_fields = ('question', 'selected_option', 'is_correct')


class LocalAttemptAnswerInline(admin.TabularInline):
    model = LocalAttemptAnswer
    extra = 0
    can_delete = False
    readonly_fields = (
        'question_index', 'question_text', 'selected_answer',
        'correct_answer', 'is_correct',
    )


@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'test', 'score', 'total_questions', 'started_at', 'finished_at')
    list_filter = ('test__subject', 'test')
    inlines = [AnswerInline, LocalAttemptAnswerInline]


@admin.register(PremiumAccess)
class PremiumAccessAdmin(admin.ModelAdmin):
    list_display = ('user', 'subject', 'test', 'amount', 'status', 'created_at')
    list_filter = ('status', 'subject')
    search_fields = ('user__username', 'test__title')


@admin.action(description='Tanlangan to‘lovlarni TASDIQLASH va premium ochish')
def approve_payment_requests(modeladmin, request, queryset):
    approved = 0
    for payment in queryset.select_related('user', 'test'):
        if payment.status != PaymentRequest.STATUS_PENDING:
            continue
        payment.approve(reviewed_by=request.user)
        approved += 1
    modeladmin.message_user(request, f'{approved} ta to‘lov tasdiqlandi va premium access ochildi.')


@admin.action(description='Tanlangan PENDING to‘lovlarni RAD ETISH')
def reject_payment_requests(modeladmin, request, queryset):
    rejected = 0
    for payment in queryset:
        if payment.reject(reviewed_by=request.user):
            rejected += 1
    modeladmin.message_user(request, f'{rejected} ta to‘lov rad etildi.')


@admin.register(PaymentRequest)
class PaymentRequestAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'test', 'amount', 'transaction_id', 'status',
        'receipt_link', 'created_at', 'reviewed_by',
    )
    list_filter = ('status', 'test__subject', 'test')
    search_fields = ('user__username', 'user__email', 'transaction_id', 'test__title')
    readonly_fields = (
        'user', 'test', 'amount', 'transaction_id', 'receipt_link', 'status',
        'created_at', 'updated_at', 'reviewed_at', 'reviewed_by',
    )
    fields = (
        'user', 'test', 'amount', 'transaction_id', 'receipt_link',
        'status', 'admin_note', 'created_at', 'updated_at', 'reviewed_at', 'reviewed_by',
    )
    actions = [approve_payment_requests, reject_payment_requests]

    @admin.display(description='Chek')
    def receipt_link(self, obj):
        if not obj.receipt:
            return '—'
        return format_html('<a href="{}" target="_blank">Chekni ochish</a>', obj.receipt.url)


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'direction', 'short_message', 'user', 'is_reviewed', 'created_at')
    list_filter = ('is_reviewed', 'created_at')
    search_fields = ('name', 'direction', 'message', 'user__username', 'user__email')
    readonly_fields = ('user', 'name', 'direction', 'message', 'created_at')
    list_editable = ('is_reviewed',)

    @admin.display(description='Fikr')
    def short_message(self, obj):
        return obj.message[:80]


@admin.register(LocalAttemptAnswer)
class LocalAttemptAnswerAdmin(admin.ModelAdmin):
    list_display = ('attempt', 'question_index', 'selected_answer', 'correct_answer', 'is_correct')
    list_filter = ('is_correct', 'attempt__test__subject', 'attempt__test')
    search_fields = ('attempt__user__username', 'attempt__test__title', 'question_text')
    readonly_fields = (
        'attempt', 'question_index', 'question_text', 'selected_answer',
        'correct_answer', 'is_correct',
    )

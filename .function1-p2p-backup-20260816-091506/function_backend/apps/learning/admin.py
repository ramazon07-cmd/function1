from django.contrib import admin
from .models import Subject, Course, Test, Question, Option, TestAttempt, Answer, PremiumAccess


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


@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'test', 'score', 'total_questions', 'started_at', 'finished_at')
    list_filter = ('test__subject', 'test')
    inlines = [AnswerInline]


@admin.register(PremiumAccess)
class PremiumAccessAdmin(admin.ModelAdmin):
    list_display = ('user', 'subject', 'test', 'amount', 'status', 'created_at')
    list_filter = ('status', 'subject')

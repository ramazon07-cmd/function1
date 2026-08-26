from rest_framework import serializers
from .models import Subject, Course, Test, Question, Option, TestAttempt, Answer, PremiumAccess


class SubjectSerializer(serializers.ModelSerializer):
    tests_count = serializers.SerializerMethodField()
    courses_count = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = ('id', 'name', 'slug', 'description', 'is_featured', 'order', 'tests_count', 'courses_count')

    def get_tests_count(self, obj):
        return obj.tests.filter(is_active=True).count()

    def get_courses_count(self, obj):
        return obj.courses.filter(is_active=True).count()


class CourseSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    subject_id = serializers.PrimaryKeyRelatedField(
        source='subject', queryset=Subject.objects.all(), write_only=True, required=False
    )

    class Meta:
        model = Course
        fields = ('id', 'subject', 'subject_id', 'title', 'description', 'level', 'image_url', 'is_active', 'order')


class OptionPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ('id', 'text', 'order')


class QuestionPublicSerializer(serializers.ModelSerializer):
    options = OptionPublicSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'text', 'order', 'options')


class TestListSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    questions_count = serializers.SerializerMethodField()

    class Meta:
        model = Test
        fields = (
            'id', 'subject', 'title', 'description', 'duration_minutes',
            'is_premium', 'price', 'is_active', 'order', 'questions_count'
        )

    def get_questions_count(self, obj):
        return obj.questions.count()


class TestDetailSerializer(TestListSerializer):
    questions = QuestionPublicSerializer(many=True, read_only=True)

    class Meta(TestListSerializer.Meta):
        fields = TestListSerializer.Meta.fields + ('questions',)


class SubmitAnswerItemSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    option_id = serializers.IntegerField(allow_null=True, required=False)


class SubmitTestSerializer(serializers.Serializer):
    answers = SubmitAnswerItemSerializer(many=True)


class LocalTestAttemptSerializer(serializers.Serializer):
    score = serializers.IntegerField(min_value=0)
    total_questions = serializers.IntegerField(min_value=1)
    duration_seconds = serializers.IntegerField(min_value=0, required=False, default=0)

    def validate(self, attrs):
        if attrs['score'] > attrs['total_questions']:
            raise serializers.ValidationError({'score': 'Score cannot exceed total_questions.'})
        return attrs


class AnswerReviewSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.text', read_only=True)
    selected_option_text = serializers.CharField(source='selected_option.text', read_only=True)
    correct_option_text = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = ('id', 'question', 'question_text', 'selected_option', 'selected_option_text', 'correct_option_text', 'is_correct')

    def get_correct_option_text(self, obj):
        option = obj.question.options.filter(is_correct=True).first()
        return option.text if option else None


class TestAttemptSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source='test.title', read_only=True)
    subject_slug = serializers.CharField(source='test.subject.slug', read_only=True)
    percentage = serializers.FloatField(read_only=True)
    answers = AnswerReviewSerializer(many=True, read_only=True)

    class Meta:
        model = TestAttempt
        fields = (
            'id', 'test', 'test_title', 'subject_slug', 'score', 'total_questions',
            'percentage', 'started_at', 'finished_at', 'duration_seconds', 'answers'
        )


class PremiumPurchaseSerializer(serializers.Serializer):
    test_id = serializers.IntegerField(required=False)
    subject_id = serializers.IntegerField(required=False)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, default=5000)

    def validate(self, attrs):
        if not attrs.get('test_id') and not attrs.get('subject_id'):
            raise serializers.ValidationError('test_id or subject_id is required.')
        return attrs


class PremiumAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = PremiumAccess
        fields = ('id', 'subject', 'test', 'amount', 'status', 'created_at')

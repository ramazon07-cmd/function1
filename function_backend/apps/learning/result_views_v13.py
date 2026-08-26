import json
import re
import unicodedata
from pathlib import Path

from django.apps import apps
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PremiumAccess, Test, TestAttempt

MANIFEST_PATH = Path(__file__).resolve().parent / "data" / "local_question_bank.json"


def _norm(value):
    value = unicodedata.normalize("NFKC", str(value or ""))
    for ch in ("ʻ", "ʼ", "’", "‘", "`", "´"):
        value = value.replace(ch, "'")
    return re.sub(r"\s+", " ", value.strip().lower())


def _load_manifest():
    with MANIFEST_PATH.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def _find_bank_entry(manifest, category, topic):
    category_n = _norm(category)
    topic_n = _norm(topic)
    for item in manifest.get("sets", []):
        if _norm(item.get("category")) == category_n and _norm(item.get("topic")) == topic_n:
            return item
    return None


def _has_premium_access(user, test):
    if not getattr(test, "is_premium", False):
        return True
    qs = PremiumAccess.objects.filter(user=user, test=test)
    if any(f.name == "status" for f in PremiumAccess._meta.fields):
        qs = qs.filter(status=getattr(PremiumAccess, "STATUS_PAID", "paid"))
    return qs.exists()


def _attempt_payload(attempt):
    return {
        "id": attempt.id,
        "test": attempt.test_id,
        "test_title": attempt.test.title,
        "subject_slug": attempt.test.subject.slug,
        "score": attempt.score,
        "total_questions": attempt.total_questions,
        "percentage": attempt.percentage,
        "started_at": attempt.started_at,
        "finished_at": attempt.finished_at,
        "duration_seconds": attempt.duration_seconds,
    }


class RecordVerifiedLocalAttemptV13APIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        test = get_object_or_404(Test.objects.select_related("subject"), pk=pk, is_active=True)
        if not _has_premium_access(request.user, test):
            return Response({"detail": "Premium test uchun tasdiqlangan to'lov kerak."}, status=403)

        answers = (request.data or {}).get("answers")
        if not isinstance(answers, list):
            return Response({"detail": "answers list yuborilishi kerak."}, status=400)

        try:
            manifest = _load_manifest()
        except (OSError, ValueError, json.JSONDecodeError):
            return Response({"detail": "Server test bank manifestini o'qiy olmadi."}, status=500)

        bank = _find_bank_entry(manifest, test.subject.slug, test.title)
        if bank is None:
            return Response({
                "detail": "Backend test uchun bilmman question bank mapping topilmadi.",
                "subject": test.subject.slug,
                "test_title": test.title,
            }, status=409)

        questions = bank.get("questions") or []
        if not questions:
            return Response({"detail": "Test bank bo'sh."}, status=409)

        submitted = {}
        for item in answers:
            if not isinstance(item, dict):
                return Response({"detail": "Noto'g'ri answer format."}, status=400)
            try:
                idx = int(item.get("question_index"))
            except (TypeError, ValueError):
                return Response({"detail": "Noto'g'ri question_index."}, status=400)
            if idx < 0 or idx >= len(questions):
                return Response({"detail": "question_index chegaradan tashqarida."}, status=400)
            submitted[idx] = "" if item.get("selected_answer") is None else str(item.get("selected_answer"))

        score = 0
        correctness = []
        for idx, question in enumerate(questions):
            selected = submitted.get(idx, "")
            correct = str(question.get("answer", ""))
            is_correct = bool(selected and _norm(selected) == _norm(correct))
            score += int(is_correct)
            correctness.append((idx, selected, correct, is_correct, str(question.get("question", ""))))

        try:
            duration = int((request.data or {}).get("duration_seconds") or 0)
        except (TypeError, ValueError):
            duration = 0
        max_duration = max(int(getattr(test, "duration_minutes", 30) or 30) * 60, 1)
        duration = max(0, min(duration, max_duration))

        model_fields = {f.name for f in TestAttempt._meta.fields}
        client_attempt_id = str((request.data or {}).get("client_attempt_id") or "").strip()
        if client_attempt_id and "client_attempt_id" in model_fields:
            existing = TestAttempt.objects.select_related("test__subject").filter(
                user=request.user, test=test, client_attempt_id=client_attempt_id
            ).first()
            if existing:
                return Response(_attempt_payload(existing), status=200)

        kwargs = {
            "user": request.user,
            "test": test,
            "score": score,
            "total_questions": len(questions),
            "duration_seconds": duration,
            "finished_at": timezone.now(),
        }
        if client_attempt_id and "client_attempt_id" in model_fields:
            kwargs["client_attempt_id"] = client_attempt_id
        if "question_bank_version" in model_fields:
            kwargs["question_bank_version"] = str(manifest.get("version") or "v13")

        attempt = TestAttempt.objects.create(**kwargs)

        try:
            LocalAttemptAnswer = apps.get_model("learning", "LocalAttemptAnswer")
        except LookupError:
            LocalAttemptAnswer = None
        if LocalAttemptAnswer is not None:
            answer_fields = {f.name for f in LocalAttemptAnswer._meta.fields}
            rows = []
            for idx, selected, correct, is_correct, question_text in correctness:
                values = {}
                if "attempt" in answer_fields: values["attempt"] = attempt
                if "question_index" in answer_fields: values["question_index"] = idx
                if "question_text" in answer_fields: values["question_text"] = question_text
                if "selected_answer" in answer_fields: values["selected_answer"] = selected
                if "correct_answer" in answer_fields: values["correct_answer"] = correct
                if "is_correct" in answer_fields: values["is_correct"] = is_correct
                rows.append(LocalAttemptAnswer(**values))
            if rows:
                LocalAttemptAnswer.objects.bulk_create(rows)

        attempt = TestAttempt.objects.select_related("test__subject").get(pk=attempt.pk)
        return Response(_attempt_payload(attempt), status=status.HTTP_201_CREATED)

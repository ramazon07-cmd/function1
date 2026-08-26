import json
import re
import unicodedata
from pathlib import Path

from django.db import transaction
from django.apps import apps
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Test, TestAttempt, PremiumAccess


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
    status_field = next((f for f in PremiumAccess._meta.fields if f.name == "status"), None)
    if status_field is not None:
        paid_value = getattr(PremiumAccess, "STATUS_PAID", "paid")
        qs = qs.filter(status=paid_value)
    return qs.exists()


class RecordVerifiedLocalAttemptAPIView(APIView):
    """V12: save a local TestCard attempt, but recompute score on the server."""

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        test = get_object_or_404(Test.objects.select_related("subject"), pk=pk, is_active=True)

        if not _has_premium_access(request.user, test):
            return Response(
                {"detail": "Premium test uchun tasdiqlangan to'lov kerak."},
                status=status.HTTP_403_FORBIDDEN,
            )

        payload = request.data or {}
        answers = payload.get("answers")
        if not isinstance(answers, list):
            return Response(
                {"detail": "answers list yuborilishi kerak."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            manifest = _load_manifest()
        except (OSError, ValueError, json.JSONDecodeError):
            return Response(
                {"detail": "Server test bank manifestini o'qiy olmadi."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        bank = _find_bank_entry(manifest, test.subject.slug, test.title)
        if bank is None:
            return Response(
                {
                    "detail": "Bu backend testi uchun local question bank mapping topilmadi.",
                    "subject": test.subject.slug,
                    "test_title": test.title,
                },
                status=status.HTTP_409_CONFLICT,
            )

        questions = bank.get("questions") or []
        if not questions:
            return Response(
                {"detail": "Test bank bo'sh."},
                status=status.HTTP_409_CONFLICT,
            )

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
            selected = item.get("selected_answer")
            submitted[idx] = "" if selected is None else str(selected)

        score = 0
        for idx, question in enumerate(questions):
            selected = submitted.get(idx, "")
            correct = str(question.get("answer", ""))
            if selected and _norm(selected) == _norm(correct):
                score += 1

        try:
            duration = int(payload.get("duration_seconds") or 0)
        except (TypeError, ValueError):
            duration = 0
        max_duration = max(int(getattr(test, "duration_minutes", 30) or 30) * 60, 1)
        duration = max(0, min(duration, max_duration))

        # If an earlier patch added idempotency fields, use them automatically.
        model_fields = {f.name for f in TestAttempt._meta.fields}
        client_attempt_id = str(payload.get("client_attempt_id") or "").strip()
        if client_attempt_id and "client_attempt_id" in model_fields:
            existing = TestAttempt.objects.filter(
                user=request.user,
                test=test,
                client_attempt_id=client_attempt_id,
            ).first()
            if existing:
                return Response({
                    "id": existing.id,
                    "test": existing.test_id,
                    "test_title": existing.test.title,
                    "subject_slug": existing.test.subject.slug,
                    "score": existing.score,
                    "total_questions": existing.total_questions,
                    "percentage": existing.percentage,
                    "started_at": existing.started_at,
                    "finished_at": existing.finished_at,
                    "duration_seconds": existing.duration_seconds,
                }, status=status.HTTP_200_OK)

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
            kwargs["question_bank_version"] = str(manifest.get("version") or "v12")

        attempt = TestAttempt.objects.create(**kwargs)

        # If V5's LocalAttemptAnswer model exists, persist every selected/correct
        # answer too. The endpoint still works on repositories where that model
        # was never created.
        try:
            LocalAttemptAnswer = apps.get_model("learning", "LocalAttemptAnswer")
        except LookupError:
            LocalAttemptAnswer = None
        if LocalAttemptAnswer is not None:
            rows = []
            for idx, question in enumerate(questions):
                selected = submitted.get(idx, "")
                correct = str(question.get("answer", ""))
                rows.append(LocalAttemptAnswer(
                    attempt=attempt,
                    question_index=idx,
                    question_text=str(question.get("question", "")),
                    selected_answer=selected,
                    correct_answer=correct,
                    is_correct=bool(selected and _norm(selected) == _norm(correct)),
                ))
            LocalAttemptAnswer.objects.bulk_create(rows)

        return Response({
            "id": attempt.id,
            "test": attempt.test_id,
            "test_title": test.title,
            "subject_slug": test.subject.slug,
            "score": attempt.score,
            "total_questions": attempt.total_questions,
            "percentage": attempt.percentage,
            "started_at": attempt.started_at,
            "finished_at": attempt.finished_at,
            "duration_seconds": attempt.duration_seconds,
        }, status=status.HTTP_201_CREATED)

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ohirgi.css";
import "katex/dist/katex.min.css";
import { learningApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function TestCard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const testId = location.state?.testId;

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [time, setTime] = useState(0);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!testId) {
      setError("Test ID topilmadi. Testlar sahifasidan qayta tanlang.");
      setLoading(false);
      return;
    }

    let alive = true;
    learningApi
      .testDetail(testId)
      .then((data) => {
        if (!alive) return;
        setTest(data);
        setTime((data.duration_minutes || 30) * 60);
      })
      .catch((err) => setError(err.message || "Test yuklanmadi."))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [testId]);

  const questions = useMemo(() => test?.questions || [], [test]);

  useEffect(() => {
    if (!showModal && time > 0 && !finished) {
      const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }

    if (time === 0 && questions.length > 0 && !showModal && !finished) {
      finishTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, finished, showModal, questions.length]);

  const formatTime = () => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const finishTest = async (finalAnswers = answers) => {
    if (finished || submitting) return;

    if (!user) {
      alert("Natijani saqlash uchun avval login qiling.");
      navigate("/hae");
      return;
    }

    try {
      setSubmitting(true);
      const response = await learningApi.submitTest(test.id, finalAnswers);
      setResult(response);
      setFinished(true);
    } catch (err) {
      setError(err.message || "Natijani yuborishda xatolik.");
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (!selected || !questions[current]) return;

    const answerItem = {
      question_id: questions[current].id,
      option_id: selected,
    };

    const nextAnswers = [...answers, answerItem];
    setAnswers(nextAnswers);
    setSelected(null);

    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      finishTest(nextAnswers);
    }
  };

  if (loading) {
    return (
      <div className="test-container">
        <p>Test yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-container">
        <p style={{ color: "crimson" }}>{error}</p>
        <button className="next-btn" onClick={() => navigate("/test")}>Chiqish</button>
      </div>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <div className="test-container">
        <p>Bu testda savollar topilmadi.</p>
        <button className="next-btn" onClick={() => navigate("/test")}>Chiqish</button>
      </div>
    );
  }

  if (finished && result) {
    return (
      <div className="test-container">
        <div className="result-card">
          <h1>Natija</h1>
          <h2>{result.score} / {result.total_questions}</h2>
          <p>Foiz: {result.percentage}%</p>

          <div className="review-grid">
            {(result.answers || [])
              .filter((item) => !item.is_correct)
              .map((item) => (
                <div className="wrong-card" key={item.id}>
                  <h3>{item.question_text}</h3>
                  <p>
                    Siz tanladingiz:
                    <span style={{ color: "red" }}> {item.selected_option_text || "Tanlanmagan"}</span>
                  </p>
                  <p>
                    To'g'ri javob:
                    <span style={{ color: "green" }}> {item.correct_option_text}</span>
                  </p>
                </div>
              ))}
          </div>

          <button className="next-btn" onClick={() => navigate("/test")}>Chiqish</button>
        </div>
      </div>
    );
  }

  const activeQuestion = questions[current];

  return (
    <div className="test-container">
      {showModal && (
        <div className="modal_overlay">
          <div className="modal">
            <h2>{test.title}</h2>
            <p>{questions.length} ta savol mavjud</p>
            <p>Vaqt: {test.duration_minutes} daqiqa</p>
            <p>Test boshlashga tayormisiz?</p>
            {!user && (
              <p style={{ color: "crimson" }}>
                Natijani backendga saqlash uchun login kerak.
              </p>
            )}
            <div className="buttons">
              <button onClick={() => navigate("/test")}>Chiqish</button>
              <button
                onClick={() => {
                  if (!user) navigate("/hae");
                  else setShowModal(false);
                }}
              >
                Boshlash
              </button>
            </div>
          </div>
        </div>
      )}

      {!showModal && (
        <>
          <div className="timer-card">Vaqt: {formatTime()}</div>
          <div className="progress">
            <div
              className="progress-fill"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="kere">
            <div className="question-card">
              <p className="q-number">Savol {current + 1} / {questions.length}</p>
              <h2>{activeQuestion.text}</h2>
            </div>

            <div className="options-card">
              {activeQuestion.options.map((opt) => (
                <div
                  key={opt.id}
                  className={`option ${selected === opt.id ? "active" : ""}`}
                  onClick={() => setSelected(opt.id)}
                >
                  {opt.text}
                </div>
              ))}
            </div>
          </div>

          <button className="next-btn" disabled={submitting || !selected} onClick={nextQuestion}>
            {submitting ? "Yuborilmoqda..." : current === questions.length - 1 ? "Yakunlash" : "Keyingi"}
          </button>
        </>
      )}
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ohirgi.css";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function TestCard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const testId = location.state?.testId;

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [time, setTime] = useState(0);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadTest() {
      if (!testId) {
        setError("Test tanlanmagan. /test sahifasidan testni tanlang.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await api.testDetail(testId);
        if (!alive) return;
        setTest(data);
        setTime((data.duration_minutes || 30) * 60);
      } catch (err) {
        if (alive) setError(err.message || "Testni yuklashda xatolik yuz berdi.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadTest();
    return () => {
      alive = false;
    };
  }, [testId]);

  const questions = useMemo(() => test?.questions || [], [test]);

  useEffect(() => {
    if (showModal || finished || loading || error) return;

    if (time <= 0) {
      finishTest();
      return;
    }

    const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [time, showModal, finished, loading, error]);

  function formatTime() {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  }

  function saveCurrentAnswer() {
    const question = questions[current];
    if (!question) return answers;

    const withoutCurrent = answers.filter((item) => item.question_id !== question.id);
    return [
      ...withoutCurrent,
      {
        question_id: question.id,
        option_id: selected,
      },
    ];
  }

  function nextQuestion() {
    if (!selected) return;

    const nextAnswers = saveCurrentAnswer();
    setAnswers(nextAnswers);
    setSelected(null);

    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      finishTest(nextAnswers);
    }
  }

  async function finishTest(finalAnswers = answers) {
    if (finished || submitting) return;

    if (!isAuthenticated) {
      alert("Natijani saqlash uchun avval tizimga kiring.");
      navigate("/hae");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.submitTest(test.id, finalAnswers);
      setResult(response);
      setFinished(true);
    } catch (err) {
      setError(err.message || "Javoblarni yuborishda xatolik yuz berdi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="test-container">
        <h2>Test yuklanmoqda...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-container">
        <p style={{ color: "crimson" }}>{error}</p>
        <button className="next-btn" onClick={() => navigate("/test")}>Testlarga qaytish</button>
      </div>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <div className="test-container">
        <p>Bu testda hali savollar yo‘q. Backend admin’dan savol qo‘shing.</p>
        <button className="next-btn" onClick={() => navigate("/test")}>Chiqish</button>
      </div>
    );
  }

  if (finished && result) {
    const wrongAnswers = (result.answers || []).filter((item) => !item.is_correct);

    return (
      <div className="test-container">
        <div className="result-card">
          <h1>Natija</h1>
          <h2>{result.score} / {result.total_questions}</h2>
          <p>Foiz: {result.percentage}%</p>

          <div className="review-grid">
            {wrongAnswers.length === 0 && <p>Zo‘r! Xato javob yo‘q.</p>}
            {wrongAnswers.map((item) => (
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

          <button className="next-btn" onClick={() => navigate("/test")}>Testlarga qaytish</button>
        </div>
      </div>
    );
  }

  const question = questions[current];

  return (
    <div className="test-container">
      {showModal && (
        <div className="modal_overlay">
          <div className="modal">
            <h2>{test.title}</h2>
            <p>{questions.length} ta savol mavjud</p>
            <p>Vaqt: {test.duration_minutes} daqiqa</p>
            <p>Test boshlashga tayormisiz?</p>
            <div className="buttons">
              <button onClick={() => navigate("/test")}>Chiqish</button>
              <button onClick={() => setShowModal(false)}>Boshlash</button>
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
              <h2>{question.text}</h2>
            </div>

            <div className="options-card">
              {question.options.map((opt) => (
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

          <button className="next-btn" onClick={nextQuestion} disabled={!selected || submitting}>
            {submitting ? "Yuborilmoqda..." : current === questions.length - 1 ? "Yakunlash" : "Keyingi"}
          </button>
        </>
      )}
    </div>
  );
}

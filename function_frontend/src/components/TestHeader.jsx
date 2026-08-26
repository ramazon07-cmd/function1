import React, { useEffect, useMemo, useState } from "react";
import "../styles/testlar.css";
import { useNavigate } from "react-router-dom";
import jovo from "../images/jovo.jpg";
import rsm from "../images/math1.jpg";
import rms from "../images/images (1).jpg";
import rssm from "../images/images (2).jpg";
import iq from "../images/iqtisod.png";
import iqq from "../images/phoh.jpg";
import AOS from "aos";
import "aos/dist/aos.css";
import { LayoutGrid, Calculator, Triangle, Brain, TrendingUp, Star, Copy, Upload } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const subjectIconMap = {
  math: <Calculator size={24} />,
  matematika: <Calculator size={24} />,
  algebra: <Calculator size={24} />,
  geo: <Triangle size={24} />,
  geometriya: <Triangle size={24} />,
  logic: <Brain size={24} />,
  mantiq: <Brain size={24} />,
  iq: <TrendingUp size={28} />,
  iqtisod: <TrendingUp size={28} />,
};

const imageMap = {
  math: rsm,
  matematika: rsm,
  algebra: rsm,
  geo: rms,
  geometriya: rms,
  logic: rssm,
  mantiq: rssm,
  iq: iq,
  iqtisod: iqq,
};

function getSubjectSlug(test) {
  return test?.subject?.slug || "math";
}

function getImage(test) {
  return imageMap[getSubjectSlug(test)] || rsm;
}

function formatCardNumber(value = "") {
  return value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
}

function TestHeader() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [tests, setTests] = useState([]);
  const [catTest, setCatTest] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [paymentInfoError, setPaymentInfoError] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [catTest, tests]);

  async function fetchTests(category = catTest) {
    const testData = await api.tests(category === "all" ? {} : { subject: category });
    return Array.isArray(testData) ? testData : testData?.results || [];
  }

  useEffect(() => {
    let alive = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const [subjectData, loadedTests] = await Promise.all([
          api.subjects(),
          fetchTests(catTest),
        ]);
        if (!alive) return;
        setSubjects(Array.isArray(subjectData) ? subjectData : subjectData?.results || []);
        setTests(loadedTests);
      } catch (err) {
        if (alive) setError(err.message || "Testlarni yuklashda xatolik yuz berdi.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadData();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catTest]);

  useEffect(() => {
    setTransactionId("");
    setReceiptFile(null);
    setPaymentMessage("");
    setPaymentInfo(null);
    setPaymentInfoError("");

    if (!openModal || !selectedTest?.is_premium || selectedTest?.has_access || !isAuthenticated) {
      return;
    }

    let alive = true;
    api.paymentCardInfo()
      .then((data) => {
        if (alive) setPaymentInfo(data);
      })
      .catch((err) => {
        if (alive) setPaymentInfoError(err.message || "Karta ma'lumotini olishda xatolik.");
      });

    return () => {
      alive = false;
    };
  }, [openModal, selectedTest?.id, selectedTest?.has_access, isAuthenticated]);

  const categoryButtons = useMemo(() => {
    const apiButtons = subjects.map((subject) => ({
      catTitle: subject.name,
      cat: subject.slug,
      icon: subjectIconMap[subject.slug] || <Calculator size={24} />,
      special: subject.slug === "iq" || subject.slug === "iqtisod",
    }));

    return [
      { catTitle: "Barchasi", cat: "all", icon: <LayoutGrid size={24} /> },
      ...apiButtons,
    ];
  }, [subjects]);

  function startTest(test) {
    navigate("/card", { state: { testId: test.id } });
  }

  function openTestModal(test) {
    setSelectedTest(test);
    setOpenModal(true);
  }

  async function copyCardNumber() {
    if (!paymentInfo?.card_number) return;
    try {
      await navigator.clipboard.writeText(paymentInfo.card_number);
      setPaymentMessage("Karta raqami nusxalandi.");
    } catch {
      setPaymentMessage("Karta raqamini qo'lda nusxalang.");
    }
  }

  async function submitPaymentProof() {
    if (!selectedTest) return;
    if (!isAuthenticated) {
      navigate("/hae");
      return;
    }
    if (!transactionId.trim() && !receiptFile) {
      setPaymentMessage("Transaction ID yoki chek rasmini/faylini yuboring.");
      return;
    }

    try {
      setSubmittingPayment(true);
      setPaymentMessage("");
      const result = await api.submitPayment({
        test_id: selectedTest.id,
        transaction_id: transactionId.trim(),
        receipt: receiptFile,
      });
      const statusValue = result?.payment?.status || "pending";
      setSelectedTest((prev) => ({ ...prev, payment_status: statusValue }));
      setTests((prev) => prev.map((item) => (
        item.id === selectedTest.id ? { ...item, payment_status: statusValue } : item
      )));
      setPaymentMessage(result?.message || "To'lov ma'lumoti yuborildi.");
      setTransactionId("");
      setReceiptFile(null);
    } catch (err) {
      setPaymentMessage(err.message || "To'lov ma'lumotini yuborishda xatolik.");
    } finally {
      setSubmittingPayment(false);
    }
  }

  async function checkPaymentStatus() {
    if (!selectedTest) return;
    try {
      setCheckingPayment(true);
      const loadedTests = await fetchTests(catTest);
      setTests(loadedTests);
      const refreshed = loadedTests.find((item) => item.id === selectedTest.id);
      if (refreshed) {
        setSelectedTest(refreshed);
        if (refreshed.has_access) {
          setPaymentMessage("To'lov tasdiqlandi. Premium test ochildi ✅");
        } else if (refreshed.payment_status === "pending") {
          setPaymentMessage("To'lov hali admin tekshiruvida.");
        } else if (refreshed.payment_status === "rejected") {
          setPaymentMessage("To'lov rad etilgan. Ma'lumotni tekshirib qayta yuboring.");
        } else {
          setPaymentMessage("Tasdiqlangan to'lov topilmadi.");
        }
      }
    } catch (err) {
      setPaymentMessage(err.message || "Holatni tekshirishda xatolik.");
    } finally {
      setCheckingPayment(false);
    }
  }

  if (loading) {
    return (
      <section className="testlar_section">
        <div className="box"><h2 style={{ padding: "40px 0" }}>Testlar yuklanmoqda...</h2></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="testlar_section">
        <div className="box">
          <h2 style={{ padding: "40px 0", color: "crimson" }}>{error}</h2>
          <p>Backend ishlayotganini tekshir: http://127.0.0.1:8000/api/tests/</p>
        </div>
      </section>
    );
  }

  return (
    <section className="testlar_section">
      <div className="box">
        <div className="header_testlar">
          {categoryButtons.map((item, index) => (
            item.special ? (
              <div key={index} className="economy-card" style={{ backgroundImage: `url(${jovo})` }}>
                <div className="economy-card-overlay" />
                <div className="economy-card-content">
                  <div className="economy-badge"><Star size={20} fill="currentColor" />Asosiy yo'nalish</div>
                  <div className="economy-title-row">
                    <h1 className="grg">{item.catTitle}</h1>
                    <h2 className="economy-count">Backend testlar</h2>
                  </div>
                  <h1 className="pl">Platformaning asosiy yo'nalishi</h1>
                  <button type="button" className="economy-action" onClick={() => setCatTest(item.cat)}>
                    Testlarni ko‘rish
                  </button>
                </div>
              </div>
            ) : (
              <button
                key={index}
                onClick={() => setCatTest(item.cat)}
                className={`category-btn ${catTest === item.cat ? "active" : ""}`}
              >
                {item.icon}<span>{item.catTitle}</span>
              </button>
            )
          ))}
        </div>

        <div className="wrapper">
          {tests.length === 0 && (
            <div style={{ padding: "40px 0" }}>
              <h2>Hali test yo‘q.</h2>
              <p>Django admin’dan test qo‘shsang, shu yerda avtomatik chiqadi.</p>
            </div>
          )}

          {tests.map((item) => (
            <div
              key={item.id}
              className={`testlar_card ${item.is_premium ? "premium-card" : ""}`}
              data-aos="zoom-in"
              data-aos-duration="800"
            >
              <div className="testlar_card_wrapper">
                <img src={getImage(item)} alt={item.title} />
                <div className="card-header">
                  {item.is_premium && (
                    <div className="card-badge">
                      <Star size={16} fill="white" color="white" strokeWidth={1.5} />
                      <span>{item.has_access ? "PURCHASED" : "GOLDEN"}</span>
                    </div>
                  )}
                  <h4>{item.title}</h4>
                  <div className="card-meta">
                    <span>{item.questions_count || 0} savol</span>
                    <span>{item.duration_minutes} daqiqa</span>
                  </div>
                </div>
              </div>

              <div className="butoon_test">
                <button className="tafsilot" onClick={() => openTestModal(item)}>Tafsilot</button>
                <button
                  className={item.is_premium && !item.has_access ? "premium-btn" : "boshlash"}
                  onClick={() => {
                    if (item.is_premium && !item.has_access) {
                      if (!isAuthenticated) {
                        navigate("/hae");
                        return;
                      }
                      openTestModal(item);
                    } else {
                      startTest(item);
                    }
                  }}
                >
                  {item.is_premium && !item.has_access
                    ? (item.payment_status === "pending" ? "Tekshiruvda" : "Premium ochish")
                    : "Testni boshlash"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {openModal && selectedTest && (
        <div className="modal_overlay">
          <div className="modal" data-aos="fade-up" style={{ maxWidth: 560 }}>
            <h2>{selectedTest.title}</h2>
            <p>Savollar soni: {selectedTest.questions_count || 0} ta</p>
            <p>Vaqt: {selectedTest.duration_minutes} daqiqa</p>
            {selectedTest.description && <p className="info_text">{selectedTest.description}</p>}

            {selectedTest.is_premium && selectedTest.has_access && (
              <div style={{ padding: 14, borderRadius: 12, background: "rgba(34,197,94,.1)", margin: "14px 0" }}>
                <strong>Premium tasdiqlangan ✅</strong>
                <p style={{ margin: "6px 0 0" }}>Bu test siz uchun ochiq.</p>
              </div>
            )}

            {selectedTest.is_premium && !selectedTest.has_access && !isAuthenticated && (
              <p className="info_text">Premium sotib olish uchun avval akkauntga kiring.</p>
            )}

            {selectedTest.is_premium && !selectedTest.has_access && isAuthenticated && (
              <>
                <p className="payment-label">Premium test</p>
                <p className="payment-price">Narxi: {selectedTest.price || 5000} so'm</p>

                {selectedTest.payment_status === "pending" ? (
                  <div style={{ padding: 14, borderRadius: 12, background: "rgba(245,158,11,.12)", margin: "14px 0" }}>
                    <strong>To'lov tekshiruvda ⏳</strong>
                    <p style={{ margin: "6px 0 0" }}>Admin chekni tasdiqlagach test avtomatik ochiladi.</p>
                  </div>
                ) : (
                  <>
                    {selectedTest.payment_status === "rejected" && (
                      <div style={{ padding: 12, borderRadius: 12, background: "rgba(220,38,38,.08)", margin: "12px 0" }}>
                        Oldingi to'lov rad etilgan. To'g'ri ma'lumot bilan qayta yuboring.
                      </div>
                    )}

                    {paymentInfoError && <p style={{ color: "crimson" }}>{paymentInfoError}</p>}
                    {paymentInfo && (
                      <div style={{ padding: 14, borderRadius: 12, background: "rgba(0,0,0,.04)", margin: "14px 0" }}>
                        <small>Pulni ushbu kartaga o'tkazing:</small>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7, flexWrap: "wrap" }}>
                          <strong style={{ fontSize: 20, letterSpacing: 1 }}>{formatCardNumber(paymentInfo.card_number)}</strong>
                          <button type="button" onClick={copyCardNumber} title="Nusxalash" style={{ padding: 8 }}>
                            <Copy size={17} />
                          </button>
                        </div>
                        {paymentInfo.card_holder && <div style={{ marginTop: 5 }}>{paymentInfo.card_holder}</div>}
                      </div>
                    )}

                    <div style={{ display: "grid", gap: 10, margin: "14px 0" }}>
                      <label>
                        <span style={{ display: "block", marginBottom: 5 }}>Transaction ID (ixtiyoriy, agar chek yuklasangiz)</span>
                        <input
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="Masalan: 123456789"
                          style={{ width: "100%", padding: 10, boxSizing: "border-box" }}
                        />
                      </label>

                      <label style={{ display: "block" }}>
                        <span style={{ display: "block", marginBottom: 5 }}>Chek rasmi yoki fayli</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Upload size={18} />
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                          />
                        </span>
                      </label>
                    </div>
                  </>
                )}

                {paymentMessage && <p className="info_text">{paymentMessage}</p>}
              </>
            )}

            <div className="buttons">
              <button onClick={() => setOpenModal(false)}>Ortga qaytish</button>

              {!selectedTest.is_premium && (
                <button onClick={() => startTest(selectedTest)}>Boshlash</button>
              )}

              {selectedTest.is_premium && selectedTest.has_access && (
                <button className="premium-btn" onClick={() => startTest(selectedTest)}>Testni boshlash</button>
              )}

              {selectedTest.is_premium && !selectedTest.has_access && !isAuthenticated && (
                <button className="premium-btn" onClick={() => navigate("/hae")}>Kirish</button>
              )}

              {selectedTest.is_premium && !selectedTest.has_access && isAuthenticated && selectedTest.payment_status !== "pending" && (
                <button className="premium-btn" onClick={submitPaymentProof} disabled={submittingPayment}>
                  {submittingPayment ? "Yuborilmoqda..." : "To'lovni tekshirishga yuborish"}
                </button>
              )}

              {selectedTest.is_premium && !selectedTest.has_access && isAuthenticated && (
                <button onClick={checkPaymentStatus} disabled={checkingPayment}>
                  {checkingPayment ? "Tekshirilmoqda..." : "Holatni tekshirish"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TestHeader;

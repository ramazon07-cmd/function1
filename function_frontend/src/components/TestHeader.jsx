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
import { LayoutGrid, Calculator, Triangle, Brain, TrendingUp, Star } from "lucide-react";
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
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [catTest, tests]);

  useEffect(() => {
    let alive = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const [subjectData, testData] = await Promise.all([
          api.subjects(),
          api.tests(catTest === "all" ? {} : { subject: catTest }),
        ]);

        if (!alive) return;
        setSubjects(Array.isArray(subjectData) ? subjectData : subjectData?.results || []);
        setTests(Array.isArray(testData) ? testData : testData?.results || []);
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
  }, [catTest]);

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

  async function buyPremium() {
    if (!selectedTest) return;

    if (!isAuthenticated) {
      navigate("/hae");
      return;
    }

    try {
      setBuying(true);
      await api.premiumMockPurchase({
        test_id: selectedTest.id,
        amount: selectedTest.price || 5000,
      });
      setOpenModal(false);
      startTest(selectedTest);
    } catch (err) {
      alert(err.message || "Premium ochishda xatolik yuz berdi.");
    } finally {
      setBuying(false);
    }
  }

  if (loading) {
    return (
      <section className="testlar_section">
        <div className="box">
          <h2 style={{ padding: "40px 0" }}>Testlar yuklanmoqda...</h2>
        </div>
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
              <div
                key={index}
                className="economy-card"
                style={{ backgroundImage: `url(${jovo})` }}
              >
                <div className="economy-card-overlay" />
                <div className="economy-card-content">
                  <div className="economy-badge">
                    <Star size={20} fill="currentColor" />
                    Asosiy yo'nalish
                  </div>
                  <div className="economy-title-row">
                    <h1 className="grg">{item.catTitle}</h1>
                    <h2 className="economy-count">Backend testlar</h2>
                  </div>
                  <h1 className="pl">Platformaning asosiy yo'nalishi</h1>
                  <button
                    type="button"
                    className="economy-action"
                    onClick={() => setCatTest(item.cat)}
                  >
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
                {item.icon}
                <span>{item.catTitle}</span>
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
                      <span>GOLDEN</span>
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
                <button
                  className="tafsilot"
                  onClick={() => {
                    setSelectedTest(item);
                    setOpenModal(true);
                  }}
                >
                  Tafsilot
                </button>

                <button
                  className={item.is_premium ? "premium-btn" : "boshlash"}
                  onClick={() => {
                    if (item.is_premium) {
                      setSelectedTest(item);
                      setOpenModal(true);
                    } else {
                      startTest(item);
                    }
                  }}
                >
                  {item.is_premium ? "Premium ochish" : "Testni boshlash"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {openModal && selectedTest && (
        <div className="modal_overlay">
          <div className="modal" data-aos="fade-up">
            <h2>{selectedTest.title}</h2>
            <p>Savollar soni: {selectedTest.questions_count || 0} ta</p>
            <p>Vaqt: {selectedTest.duration_minutes} daqiqa</p>
            {selectedTest.description && <p className="info_text">{selectedTest.description}</p>}

            {selectedTest.is_premium && (
              <>
                <p className="payment-label">Premium test</p>
                <p className="payment-price">Narxi: {selectedTest.price || 5000} so'm</p>
                <p className="info_text">Bu demo payment: real karta raqami so‘ralmaydi.</p>
              </>
            )}

            <div className="buttons">
              <button onClick={() => setOpenModal(false)}>Ortga qaytish</button>
              {selectedTest.is_premium ? (
                <button className="premium-btn" onClick={buyPremium} disabled={buying}>
                  {buying ? "Ochilmoqda..." : "Premiumni ochish"}
                </button>
              ) : (
                <button onClick={() => startTest(selectedTest)}>Boshlash</button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TestHeader;

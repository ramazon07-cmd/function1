import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/testlar.css";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
    LayoutGrid,
    Calculator,
    Triangle,
    Brain,
    TrendingUp,
    Star,
} from "lucide-react";
import jovo from "../images/jovo.jpg";
import rsm from "../images/math1.jpg";
import rms from "../images/images (1).jpg";
import rssm from "../images/images (2).jpg";
import iq from "../images/iqtisod.png";
import iqq from "../images/phoh.jpg";
import { learningApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

const subjectMeta = {
    math: { title: "Matematika", icon: <Calculator size={24} />, image: rsm },
    geo: { title: "Geometry", icon: <Triangle size={24} />, image: rms },
    logic: { title: "Mantiq", icon: <Brain size={24} />, image: rssm },
    iq: { title: "IQTISOD", icon: <TrendingUp size={28} />, image: iq },
};

function TestHeader() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("detail");
    const [selectedTest, setSelectedTest] = useState(null);
    const [paymentCard, setPaymentCard] = useState("");
    const [catTest, setCatTest] = useState("all");
    const [subjects, setSubjects] = useState([]);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [paying, setPaying] = useState(false);
    const wrapperRef = useRef(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    useEffect(() => {
        let alive = true;
        setLoading(true);

        async function loadAllTests(page = 1, acc = []) {
            const data = await learningApi.tests({ page });
            if (Array.isArray(data)) return data;

            const results = data.results || [];
            const nextAcc = [...acc, ...results];
            return data.next ? loadAllTests(page + 1, nextAcc) : nextAcc;
        }

        Promise.all([learningApi.subjects(), loadAllTests()])
            .then(([subjectData, testData]) => {
                if (!alive) return;
                setSubjects(Array.isArray(subjectData) ? subjectData : subjectData.results || []);
                setTests(testData);
            })
            .catch((err) => setError(err.message || "Testlar yuklanmadi."))
            .finally(() => alive && setLoading(false));

        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        if (shouldScroll && wrapperRef.current) {
            wrapperRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            setShouldScroll(false);
        }
    }, [shouldScroll]);

    useEffect(() => {
        AOS.refresh();
    }, [catTest, tests]);

    const categoryTest = useMemo(() => {
        const dynamic = subjects.map((subject) => {
            const meta = subjectMeta[subject.slug] || {};
            return {
                catTitle: meta.title || subject.name,
                cat: subject.slug,
                icon: meta.icon || <LayoutGrid size={24} />,
                special: subject.slug === "iq",
                count: subject.tests_count,
            };
        });

        return [
            { catTitle: "Barchasi", cat: "all", icon: <LayoutGrid size={24} /> },
            ...dynamic,
        ];
    }, [subjects]);

    const filteredTests = tests.filter((item) => {
        if (catTest === "all") return true;
        return item.subject?.slug === catTest;
    });

    const goToTest = (test) => {
        if (!user) {
            navigate("/hae");
            return;
        }

        navigate("/card", {
            state: {
                testId: test.id,
                title: test.title,
                category: test.subject?.slug,
            },
        });
    };

    const handleMockPayment = async () => {
        if (!user) {
            navigate("/hae");
            return;
        }

        if (!selectedTest) return;

        try {
            setPaying(true);
            await learningApi.mockPurchase({
                test_id: selectedTest.id,
                amount: selectedTest.price || 5000,
            });
            setOpenModal(false);
            setPaymentCard("");
            goToTest(selectedTest);
        } catch (err) {
            alert(err.message || "Premium ochishda xatolik bo‘ldi.");
        } finally {
            setPaying(false);
        }
    };

    if (loading) {
        return (
            <section className="testlar_section">
                <div className="box">
                    <h2>Testlar yuklanmoqda...</h2>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="testlar_section">
                <div className="box">
                    <h2 style={{ color: "crimson" }}>{error}</h2>
                    <p>Backend ishlayotganini tekshir: http://127.0.0.1:8000/api/</p>
                </div>
            </section>
        );
    }

    return (
        <section className="testlar_section">
            <div className="box">
                <div className="header_testlar">
                    {categoryTest.map((item, index) => (
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
                                        <h1 className="grg">IQTISOD</h1>
                                        <h2 className="economy-count">{item.count || 0} ta test</h2>
                                    </div>
                                    <h1 className="pl">Platformaning asosiy yo'nalishi</h1>
                                    <button
                                        type="button"
                                        className="economy-action"
                                        onClick={() => {
                                            setCatTest("iq");
                                            setShouldScroll(true);
                                        }}
                                    >
                                        Testlarni boshlash
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                key={index}
                                onClick={() => {
                                    setCatTest(item.cat);
                                    setShouldScroll(true);
                                }}
                                className={`category-btn ${catTest === item.cat ? "active" : ""}`}
                            >
                                {item.icon}
                                <span>{item.catTitle}</span>
                            </button>
                        )
                    ))}
                </div>

                <div className="wrapper" ref={wrapperRef}>
                    {filteredTests.map((item) => {
                        const slug = item.subject?.slug;
                        const meta = subjectMeta[slug] || {};
                        const image = slug === "iq" && item.is_premium ? iqq : meta.image || rsm;

                        return (
                            <div
                                key={item.id}
                                className={`testlar_card ${item.is_premium ? "premium-card" : ""}`}
                                data-aos="zoom-in"
                                data-aos-duration="800"
                            >
                                <div className="testlar_card_wrapper">
                                    <img src={image} alt={item.title} />
                                    <div className="card-header">
                                        {item.is_premium && (
                                            <div className="card-badge">
                                                <Star size={16} fill="white" color="white" strokeWidth={1.5} />
                                                <span>GOLDEN</span>
                                            </div>
                                        )}
                                        <h4>{item.title}</h4>
                                        <div className="card-meta">
                                            <span>{item.questions_count} savol</span>
                                            <span>{item.duration_minutes} daqiqa</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="butoon_test">
                                    <button
                                        className="tafsilot"
                                        onClick={() => {
                                            setSelectedTest(item);
                                            setModalType("detail");
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
                                                setModalType("payment");
                                                setOpenModal(true);
                                            } else {
                                                goToTest(item);
                                            }
                                        }}
                                    >
                                        {item.is_premium ? "Premium ochish" : "Testni boshlash"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {openModal && selectedTest && (
                <div className="modal_overlay">
                    <div className="modal" data-aos="fade-up">
                        <h2>{selectedTest.title}</h2>
                        {modalType === "detail" ? (
                            <>
                                <p>Savollar soni: {selectedTest.questions_count} ta</p>
                                <p>Vaqt: {selectedTest.duration_minutes} daqiqa</p>
                                <p className="info_text">
                                    Ushbu test orqali bilimingizni sinab ko‘rishingiz mumkin.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="payment-label">Premium ochish</p>
                                <p className="payment-price">Narxi: {selectedTest.price || 5000} so'm</p>
                                <label className="payment-input-label" htmlFor="card-number">
                                    Karta raqami
                                </label>
                                <input
                                    id="card-number"
                                    className="payment-input"
                                    type="text"
                                    value={paymentCard}
                                    onChange={(e) => setPaymentCard(e.target.value)}
                                    placeholder="DEMO — xohlagan raqam"
                                />
                                <p className="info_text">
                                    Bu demo premium. Real karta ma'lumotini kiritmang.
                                </p>
                            </>
                        )}

                        <div className="buttons">
                            <button
                                onClick={() => {
                                    setOpenModal(false);
                                    setPaymentCard("");
                                }}
                            >
                                Ortga qaytish
                            </button>
                            {modalType === "payment" && (
                                <button
                                    className="premium-btn"
                                    disabled={paying}
                                    onClick={handleMockPayment}
                                >
                                    {paying ? "Ochilyapti..." : "To'lovni tasdiqlash"}
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

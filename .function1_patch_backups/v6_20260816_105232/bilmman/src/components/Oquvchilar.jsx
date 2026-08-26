import React, { useEffect, useState } from "react";
import "../styles/oquvchilar.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { FaUser, FaGraduationCap, FaCommentDots } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";

import AOS from "aos";
import "aos/dist/aos.css";
import { api } from "../api/client";

function Oquvchilar() {
  const [form, setForm] = useState({ name: "", direction: "", message: "" });
  const [sending, setSending] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (feedbackStatus.message) setFeedbackStatus({ type: "", message: "" });
  };

  const submitFeedback = async (event) => {
    event.preventDefault();
    const payload = {
      name: form.name.trim(),
      direction: form.direction.trim(),
      message: form.message.trim(),
    };

    if (payload.name.length < 2 || payload.message.length < 3) {
      setFeedbackStatus({
        type: "error",
        message: "Ismingiz va fikringizni to‘liq kiriting.",
      });
      return;
    }

    setSending(true);
    setFeedbackStatus({ type: "", message: "" });
    try {
      const response = await api.submitFeedback(payload);
      setForm({ name: "", direction: "", message: "" });
      setFeedbackStatus({
        type: "success",
        message: response?.message || "Fikringiz saqlandi. Rahmat!",
      });
    } catch (error) {
      setFeedbackStatus({
        type: "error",
        message: error?.message || "Fikrni yuborishda xatolik yuz berdi.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section>
      <div className="box">
        <h1 className="oquvchi" data-aos="fade-up">
          O'quvchilar Fikri
        </h1>
        <div className="feedback">
          <div className="feedback_left" data-aos="fade-right">
            <HiOutlineChatBubbleLeftRight
              className="feedback-icon"
              data-aos="zoom-in"
              data-aos-delay="200"
            />
            <h2>Fikringiz biz uchun muhim</h2>
            <p>
              Sizning har bir fikringiz platformamizni yanada rivojlantirish va
              foydalanuvchilar uchun qulay qilishga yordam beradi.
            </p>
          </div>

          <form className="feedback_right" data-aos="fade-left" onSubmit={submitFeedback}>
            <h3>Fikr qoldirish</h3>

            <div className="inputBox">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Ismingiz"
                maxLength={120}
                required
              />
            </div>

            <div className="inputBox">
              <FaGraduationCap className="input-icon" />
              <input
                type="text"
                name="direction"
                value={form.direction}
                onChange={updateField}
                placeholder="Yo'nalishingiz"
                maxLength={160}
              />
            </div>

            <div className="inputBox textarea">
              <FaCommentDots className="input-icon" />
              <textarea
                name="message"
                value={form.message}
                onChange={updateField}
                placeholder="Fikringiz..."
                maxLength={3000}
                required
              />
            </div>

            {feedbackStatus.message && (
              <p
                className={`function1-feedback-status ${
                  feedbackStatus.type === "success" ? "is-success" : "is-error"
                }`}
                role="status"
              >
                {feedbackStatus.message}
              </p>
            )}

            <button type="submit" disabled={sending}>
              {sending ? "Yuborilmoqda..." : "Yuborish"}
            </button>
          </form>
        </div>

        <Swiper
          loop={true}
          slidesPerView={3}
          spaceBetween={20}
          speed={4000}
          autoplay={{ delay: 500, disableOnInteraction: false }}
          pagination={{ dynamicBullets: true }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 14 },
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          }}
          modules={[Pagination, Autoplay]}
          className="myswiper"
          data-aos="fade-up"
        >
          <SwiperSlide>
            <div className="student_card" data-aos="zoom-in">
              <div className="student_top">
                <div className="imgBox" />
                <div>
                  <h3>Ali Valiyev</h3>
                  <span>Frontend Student</span>
                </div>
              </div>
              <p>Function orqali matematika va mantiqiy fikrlashim ancha rivojlandi.</p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="student_card" data-aos="zoom-in">
              <div className="student_top">
                <div className="imgBox" />
                <div>
                  <h3>Jasur Karimov</h3>
                  <span>Math Student</span>
                </div>
              </div>
              <p>Platformadagi testlar bilimimni ancha oshirdi.</p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="student_card" data-aos="zoom-in">
              <div className="student_top">
                <div className="imgBox" />
                <div>
                  <h3>Malika Rustamova</h3>
                  <span>Geometry Student</span>
                </div>
              </div>
              <p>O'rganish jarayoni juda qiziqarli.</p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="student_card" data-aos="zoom-in">
              <div className="student_top">
                <div className="imgBox" />
                <div>
                  <h3>Sardor Aliyev</h3>
                  <span>Logic Arena</span>
                </div>
              </div>
              <p>Mantiqiy fikrlashim rivojlandi.</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}

export default Oquvchilar;

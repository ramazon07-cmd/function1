import React, { useEffect, useMemo, useState } from "react";
import "../styles/oquvchilar.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { FaUser, FaGraduationCap, FaCommentDots, FaImage } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";

import AOS from "aos";
import "aos/dist/aos.css";
import { api } from "../api/client";

const fallbackFeedbacks = [
  {
    id: "fallback-1",
    name: "Ali Valiyev",
    direction: "Frontend Student",
    message: "Function orqali matematika va mantiqiy fikrlashim ancha rivojlandi.",
    profile_image_url: null,
  },
  {
    id: "fallback-2",
    name: "Jasur Karimov",
    direction: "Math Student",
    message: "Platformadagi testlar bilimimni ancha oshirdi.",
    profile_image_url: null,
  },
  {
    id: "fallback-3",
    name: "Malika Rustamova",
    direction: "Geometry Student",
    message: "O'rganish jarayoni juda qiziqarli.",
    profile_image_url: null,
  },
];

// Uploaded files can disappear from the server's disk, so a failed load falls back to initials.
function FeedbackAvatar({ name, url }) {
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(url) && !broken;
  return (
    <div className={`imgBox ${showImage ? "has-image" : "has-initials"}`}>
      {showImage ? (
        <img src={url} alt="" onError={() => setBroken(true)} />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "F";
}

function Oquvchilar() {
  const [form, setForm] = useState({ name: "", direction: "", message: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [sending, setSending] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    AOS.init({ duration: 1000 });
    let alive = true;
    api.feedbacks()
      .then((data) => {
        if (alive) setFeedbacks(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoadingFeedbacks(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!profileImage) {
      setImagePreview("");
      return undefined;
    }
    const url = URL.createObjectURL(profileImage);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [profileImage]);

  const carouselFeedbacks = useMemo(
    () => [...feedbacks, ...fallbackFeedbacks],
    [feedbacks]
  );

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (feedbackStatus.message) setFeedbackStatus({ type: "", message: "" });
  };

  const selectImage = (event) => {
    const file = event.target.files?.[0] || null;
    setProfileImage(file);
    if (feedbackStatus.message) setFeedbackStatus({ type: "", message: "" });
  };

  const submitFeedback = async (event) => {
    event.preventDefault();
    const payload = {
      name: form.name.trim(),
      direction: form.direction.trim(),
      message: form.message.trim(),
      profile_image: profileImage,
    };

    if (payload.name.length < 2 || payload.message.length < 3) {
      setFeedbackStatus({ type: "error", message: "Ismingiz va fikringizni to‘liq kiriting." });
      return;
    }
    if (!profileImage) {
      setFeedbackStatus({ type: "error", message: "Portfolio/profil rasmingizni yuklang." });
      return;
    }

    setSending(true);
    setFeedbackStatus({ type: "", message: "" });
    try {
      const response = await api.submitFeedback(payload);
      if (response?.feedback) {
        setFeedbacks((current) => [
          response.feedback,
          ...current.filter((item) => item.id !== response.feedback.id),
        ]);
      }
      setForm({ name: "", direction: "", message: "" });
      setProfileImage(null);
      const fileInput = document.getElementById("function1-feedback-image");
      if (fileInput) fileInput.value = "";
      setFeedbackStatus({
        type: "success",
        message: response?.message || "Fikringiz saqlandi va karuselga qo‘shildi.",
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
        <h1 className="oquvchi" data-aos="fade-up">O'quvchilar Fikri</h1>
        <div className="feedback">
          <div className="feedback_left" data-aos="fade-right">
            <HiOutlineChatBubbleLeftRight className="feedback-icon" data-aos="zoom-in" data-aos-delay="200" />
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
              <input type="text" name="name" value={form.name} onChange={updateField} placeholder="Ismingiz" maxLength={120} required />
            </div>

            <div className="inputBox">
              <FaGraduationCap className="input-icon" />
              <input type="text" name="direction" value={form.direction} onChange={updateField} placeholder="Yo'nalishingiz" maxLength={160} />
            </div>

            <label className="function1-feedback-image-field" htmlFor="function1-feedback-image">
              <div className="function1-feedback-image-preview">
                {imagePreview ? <img src={imagePreview} alt="Portfolio preview" /> : <FaImage />}
              </div>
              <div className="function1-feedback-image-copy">
                <strong>Portfolio / profil rasmi</strong>
                <span>{profileImage ? profileImage.name : "JPG, PNG yoki WEBP · max 3 MB"}</span>
              </div>
              <span className="function1-feedback-image-action">Rasm tanlash</span>
            </label>
            <input
              id="function1-feedback-image"
              className="function1-feedback-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={selectImage}
              required
            />

            <div className="inputBox textarea">
              <FaCommentDots className="input-icon" />
              <textarea name="message" value={form.message} onChange={updateField} placeholder="Fikringiz..." maxLength={3000} required />
            </div>

            {feedbackStatus.message && (
              <p className={`function1-feedback-status ${feedbackStatus.type === "success" ? "is-success" : "is-error"}`} role="status">
                {feedbackStatus.message}
              </p>
            )}

            <button type="submit" disabled={sending}>{sending ? "Yuborilmoqda..." : "Yuborish"}</button>
          </form>
        </div>

        {loadingFeedbacks && <p className="function1-feedback-loading">Fikrlar yuklanmoqda...</p>}

        <Swiper
          key={carouselFeedbacks.map((item) => item.id).join("-")}
          loop={carouselFeedbacks.length > 3}
          slidesPerView={3}
          spaceBetween={20}
          speed={4000}
          autoplay={{ delay: 900, disableOnInteraction: false }}
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
          {carouselFeedbacks.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="student_card" data-aos="zoom-in">
                <div className="student_top">
                  <FeedbackAvatar name={item.name} url={item.profile_image_url} />
                  <div>
                    <h3>{item.name}</h3>
                    <span>{item.direction || "Function foydalanuvchisi"}</span>
                  </div>
                </div>
                <p>{item.message}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Oquvchilar;

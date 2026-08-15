import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // AOS stillarini ulash
import profileImg from "../images/jovohir.jpg";
import '../styles/desigin.css'; // Yangilangan CSS faylingiz

const Admin = () => {
  // Sahifa yuklanganda AOS ni ishga tushiramiz
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animatsiya davomiyligi (millisekundda)
      once: true,     // Animatsiya faqat bir marta (pastga tushganda) ishlasin
    });
  }, []);

  return (
    <section className="profile-section">
      <div className="profile-container">
        
        {/* Chap qism: Rasm va Asoschi nishoni (Chapdan kirib keladi) */}
        <div className="profile-image-card" data-aos="fade-right">
          <div className="image-wrapper">
            <img src={profileImg} alt="Javohir Ikromov" className="profile-photo" />
            <div className="profile-status-badge">LOYIHA ASOSCHISI</div>
          </div>
          <h1 className="founder-name">Javohir Ikromov</h1>
          <p className="founder-title">Matematika va raqamli ta'lim dasturchisi</p>
        </div>

        {/* O'ng qism: Batafsil ma'lumotlar (O'ngdan kirib keladi) */}
        <div className="profile-details" data-aos="fade-left">
          <h2 className="section-title">Asoschi Haqida</h2>
          
          <div className="bio-text" data-aos="fade-up" data-aos-delay="200">
            <p>
              <strong>"Prezident iqtidorli farzandlari"</strong> milliy dasturi a'zosi hamda 
              <strong> IELTS 7.0</strong> sertifikati sohibi. Matematika va moliyaviy savodxonlik 
              bo‘yicha zamonaviy ta'lim platformalarini yaratish orqali barkamol yoshlarning bilim 
              olish imkoniyatlarini kengaytirishni maqsad qilgan.
            </p>
          </div>

          <hr className="divider" />

          {/* Muallif so'zi (Pastdan tepaga biroz kechikib chiqadi) */}
          <div className="quote-box" data-aos="fade-up" data-aos-delay="400">
            <h3 className="quote-title">Muallif nima deydi?</h3>
            <blockquote>
              "Bilim insonning eng katta boyligidir. Qolaversa, joriy davr programmalari bunday 
              mavzularni birlashtirib, butun bir loyiha sifatida olib chiqmadi. Biz ushbu og'ir mehnat 
              va izlanishlar mahsuli jamiyatimizni istiqbol sari yetaklaydi degan umiddamiz!"
            </blockquote>
          </div>
          
          {/* Harakat tugmalari */}
          <div className="action-buttons" data-aos="zoom-in" data-aos-delay="600">

          </div>
        </div>

      </div>
    </section>
  );
};

export default Admin;
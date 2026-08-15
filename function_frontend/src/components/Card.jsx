import React, { useEffect } from 'react'
import '../styles/card.css'
import cardimage from '../images/Снимок экрана 2026-04-30 150215.png'
import rasim from '../images/Снимок экрана 2026-04-30 161345.png'
import AOS from "aos";
import "aos/dist/aos.css";

import { FaBook } from "react-icons/fa";
import { IoFlash } from "react-icons/io5";
import { GiTrophyCup } from "react-icons/gi";
function Card() {

  useEffect(() => {
    AOS.init({
      duration: 1600,
      once: true,
    });
  }, []);

  return (
    <section className="courses">
      <div className='box'>
        <h1 className='sayt' data-aos="fade-up">
          Nega aynan bizning platforma?
        </h1>
        <div className="stats" data-aos="zoom-in"
          data-aos-delay="200"
          data-aos-duration="1000"
        >
          <div className="stat-card">
            <div className="icon"><FaBook />
            </div>
            <h2>200+</h2>
            <p>Test Savollari</p>
          </div>

          <div className="stat-card">
            <div className="icon"><IoFlash /></div>
            <h2>24/7</h2>
            <p>Doimiy Faol</p>
          </div>

          <div className="stat-card">
            <div className="icon"><GiTrophyCup />
            </div>
            <h2>4</h2>
            <p>Fan Yo'nalishi</p>
          </div>
        </div>

        <div className='courses_wrapper'>

          <img
            className='img'
            src={rasim}
            alt=""
            data-aos="zoom-in"
          />

          <div className="courses_text">

            <div className="courses_title" data-aos="fade-up">
              <h1>Haqiqiy matematika tajribasi</h1>
              <div className="textt">
                <p>Amaliy misollar va vaqt bilan ishlash orqali haqiqiy bilimni shakllantirasiz</p>
                <img className='smallcaed' src={cardimage} alt="" />
              </div>
            </div>
            <div className="courses_title" data-aos="fade-up">
              <h1>O‘sishni aqlli tarzda kuzatib borish</h1>
              <div className="textt">
                <p>Sizning iqtisodiy bilim va ko‘nikmalaringizni real vaqt rejimida kuzatib boramiz</p>
                <img className='smallcaed' src={cardimage} alt="" />
              </div>
            </div>

            <div className="courses_title" data-aos="fade-up">
              <h1>Oddiy va tushunarli o‘qitish</h1>
              <div className="textt">
                <p>Murakkab matematik mavzularni sodda va tushunarli tarzda o‘rgatamiz</p>
                <img className='smallcaed' src={cardimage} alt="" />
              </div>
            </div>

            <div className="courses_title" data-aos="fade-up">
              <h1>Iqtisodiy testlar orqali o‘rganish</h1>
              <div className="textt">
                <p>Barcha testlar iqtisodiy tushunchalarni mustahkamlash uchun sodda va aniq shaklda beriladi</p>
                <img className='smallcaed' src={cardimage} alt="" />
              </div>
            </div>

            <div className="courses_title" data-aos="fade-up">
              <h1>Masala yechish strategiyalari</h1>
              <div className="textt">
                <p>Tez va samarali yechish usullari hamda foydali strategiyalarni o‘rganasiz</p>
                <img className='smallcaed' src={cardimage} alt="" />
              </div>
            </div>

            <div className="courses_title" data-aos="fade-up">
              <h1>Nega aynan bizni tanlashadi?</h1>
              <div className="textt">
                <p>Chunki biz aniq natija beradigan tizim va real bilim beradigan mashg‘ulotlarni taqdim etamiz</p>
                <img className='smallcaed' src={cardimage} alt="" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default Card
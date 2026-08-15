import React, { useEffect } from "react";
import "../styles/courses.css";
import AOS from "aos";
import "aos/dist/aos.css";

import imgalgebra from "../images/Снимок экрана 2026-05-01 225512.png";
import imggeagrafya from "../images/Geometry.avif";
import imgmantiq from "../images/Critical Thinking.png";
import imgustoz from "../images/investing.png";
import { NavLink } from "react-router-dom";

export default function Courses() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const courses = [
    {
      title: "Algebra ",
      desc: "Murakkab formulalar va tenglamalarni oson usulda o‘rganing.",
      image: imgalgebra,
      className: "light",
    },
    {
      title: "Geometriya ",
      desc: "Fazoviy fikrlash va shakllarni professional darajada tushuning.",
      image: imggeagrafya,
      className: "light",
    },
    {
      title: "Mantiqiy Fikrlash",
      desc: "IQ va analytical thinking’ni kuchaytiruvchi topshiriqlar.",
      image: imgmantiq,
      className: "light",
    },
    {
      titlle: "IQTISOD",
      desc: "Iqtisodiy savodxonlikni va moliyaviy fikrlashni rivojlantiruvchi testlarimiz",
      image: imgustoz,
      className: "dark",
    },
  ];

  return (
    <section className="courses_section">
      <div className="box">
        <div className="courses_header" data-aos="fade-up">
          <span className="mini_title">Finaris PLATFORM</span>

          <h1 className="javox">
            Kelajagingiz uchun
            Eng <span className="span">Kuchli Kurslar</span>
          </h1>

          <p>
            Zamonaviy metodika, kuchli mentorlar va professional testlar bilan
            bilimingizni yangi bosqichga olib chiqing.
          </p>
        </div>

        <div className="courses_grid">
          {courses.map((item, index) => (
            <div
              className={`course_card ${item.className}`}
              key={index}
              data-aos="zoom-in"
            >
              <div className="image_wrap">
                <img src={item.image} alt={item.title} />
              </div>

              <div className="card_content">
                <h2>{item.title}</h2>
<h3 className="titt">{item.titlle}</h3>
                <p>{item.desc}</p>
                <NavLink to={"/account"}>
                  <button>
                    Boshlash
                    <span>→</span>
                  </button>
                </NavLink>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
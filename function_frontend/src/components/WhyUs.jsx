import React, { useEffect } from "react";
import "../styles/whyUs.css";

import student from "../images/student.png";
import book from "../images/bokicon.png";
import chart from "../images/keicon.png";
import trophy from "../images/kereiconca.png";

import AOS from "aos";
import "aos/dist/aos.css";

function AboutSection() {

    useEffect(() => {
        AOS.init({
            duration: 500,
            once: true,
            mirror: false,
            offset: 40,
            easing: "ease-out-cubic",
            delay: 0,
        });
        AOS.refresh();
    }, []);

    return (
        <section className="about">

            <div className="about-left" data-aos="fade-right">

                <span className="about-tag" data-aos="fade-down" data-aos-delay="0">
                   <span className="bbbb">●</span> NIMA UCHUN BIZ ?
                </span>

                <h1 data-aos="fade-up" data-aos-delay="80">
                    Bilim olishni <span>oson </span>va <span>qiziqarli</span> qilamiz
                </h1>

                <p data-aos="fade-up" data-aos-delay="120">
                    Platformamiz algebra, geometriya, mantiq va iqtisod fanlarini
                    zamonaviy usullar orqali o'rganishga yordam beradi.
                    Har bir test bilim darajangizni oshirish uchun ishlab chiqilgan.
                </p>

                <div
                    className="feature"
                    data-aos="fade-right"
                    data-aos-delay="160"
                >
                    <div className="icon">
                        <img src={book} alt="" />
                    </div>

                    <div>
                        <h3>Sifatli Testlar</h3>

                        <p>
                            Har bir savol puxta tayyorlangan va
                            bilimingizni oshirishga xizmat qiladi.
                        </p>
                    </div>
                </div>

                <div
                    className="feature"
                    data-aos="fade-right"
                    data-aos-delay="220"
                >
                    <div className="icon">
                        <img src={chart} alt="" />
                    </div>

                    <div>
                        <h3>Natijalarni Kuzatish</h3>

                        <p>
                            Rivojlanishingizni doimiy kuzatib boring va
                            o'zingizni baholab boring.
                        </p>
                    </div>
                </div>

                <div
                    className="feature"
                    data-aos="fade-right"
                    data-aos-delay="280"
                >
                    <div className="icon">
                        <img src={trophy} alt="" />
                    </div>

                    <div>
                        <h3>Eng Yaxshi Natijalar</h3>

                        <p>
                            Maqsadlaringizga tezroq erishing va
                            yuqori natijalarga ega bo'ling.
                        </p>
                    </div>
                </div>

            </div>

            <div className="about-right" data-aos="zoom-in-left">

                <div
                    className="circle"
                    data-aos="zoom-in"
                    data-aos-delay="340"
                ></div>

                <img
                    src={student}
                    alt="Student"
                    className="student"
                    data-aos="zoom-in"
                    data-aos-delay="400"
                />

            </div>

        </section>
    );
}

export default AboutSection;
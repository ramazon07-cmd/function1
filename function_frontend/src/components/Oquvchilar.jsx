import React, { useEffect } from 'react'
import '../styles/oquvchilar.css'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { FaUser, FaGraduationCap, FaCommentDots } from "react-icons/fa";
import 'swiper/css'
import 'swiper/css/navigation'

import AOS from 'aos'
import 'aos/dist/aos.css'

function Oquvchilar() {

  useEffect(() => {
    AOS.init({
      duration: 1000,
    })
  }, [])

  return (
    <section>
      <div className="box">

        <h1 className='oquvchi' data-aos="fade-up">
          O'quvchilar Fikri
        </h1>

        <div className="feedback">

          <div className="feedback_left"
              data-aos="fade-right"
          >

            <HiOutlineChatBubbleLeftRight className="feedback-icon"    data-aos="zoom-in"
    data-aos-delay="200"/>
            <h2>Fikringiz biz uchun muhim</h2>

            <p>
              Sizning har bir fikringiz platformamizni yanada
              rivojlantirish va foydalanuvchilar uchun qulay
              qilishga yordam beradi.
            </p>

          </div>

          <div className="feedback_right"   data-aos="fade-left">

            <h3>Fikr qoldirish</h3>

            <div className="inputBox">
              <FaUser className="input-icon" />
              <input type="text" placeholder="Ismingiz" />
            </div>

            <div className="inputBox">
              <FaGraduationCap className="input-icon" />
              <input type="text" placeholder="Yo'nalishingiz" />
            </div>

            <div className="inputBox textarea">
              <FaCommentDots className="input-icon" />
              <textarea placeholder="Fikringiz..."></textarea>
            </div>

            <button>
              Yuborish
            </button>

          </div>

        </div>

        <Swiper
          loop={true}
          slidesPerView={3}
          spaceBetween={20}
          speed={4000}
          autoplay={{
            delay: 500,
            disableOnInteraction: false,
          }}
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination, Autoplay]}
          className='myswiper'
          data-aos="fade-up"
        >

          <SwiperSlide>
            <div className='student_card' data-aos="zoom-in">

              <div className="student_top">
                <div className="imgBox">
                  <img src="https://i.pravatar.cc/150?img=12" alt="" />
                </div>

                <div>
                  <h3>Ali Valiyev</h3>
                  <span>Frontend Student</span>
                </div>
              </div>

              <p>
                Function orqali matematika va mantiqiy fikrlashim ancha rivojlandi.
              </p>

            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className='student_card' data-aos="zoom-in">

              <div className="student_top">
                <div className="imgBox">
                  <img src="https://i.pravatar.cc/150?img=13" alt="" />
                </div>

                <div>
                  <h3>Jasur Karimov</h3>
                  <span>Math Student</span>
                </div>
              </div>

              <p>
                Platformadagi testlar bilimimni ancha oshirdi.
              </p>

            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className='student_card' data-aos="zoom-in">

              <div className="student_top">
                <div className="imgBox">
                  <img src="https://i.pravatar.cc/150?img=14" alt="" />
                </div>

                <div>
                  <h3>Malika Rustamova</h3>
                  <span>Geometry Student</span>
                </div>
              </div>

              <p>
                O‘rganish jarayoni juda qiziqarli.
              </p>

            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className='student_card' data-aos="zoom-in">

              <div className="student_top">
                <div className="imgBox">
                  <img src="https://i.pravatar.cc/150?img=15" alt="" />
                </div>

                <div>
                  <h3>Sardor Aliyev</h3>
                  <span>Logic Arena</span>
                </div>
              </div>

              <p>
                Mantiqiy fikrlashim rivojlandi.
              </p>

            </div>
          </SwiperSlide>

        </Swiper>

      </div>
    </section>
  )
}

export default Oquvchilar
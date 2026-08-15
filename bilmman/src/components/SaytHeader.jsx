import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import "../styles/saytheader.css";
import { NavLink } from "react-router-dom";

function SaytHeader() {

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section>
      <div className="box">
        <div className="he">

          <div className="overlay"></div>

          <div className="he-content">

            <h1 data-aos="fade-up">
              Iqtisod va Bilim Markazi
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="250"
            >
               Iqtisod fani orqali
              bilimlaringizni yangi bosqichga olib chiqing !
            </p>

            <div
              className="buttonns"
              data-aos="zoom-in"
              data-aos-delay="500"
            >
              <NavLink to="/account">
                 <button className="btn-prrimary">
                Boshlash
              </button>
              </NavLink>
             
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default SaytHeader;
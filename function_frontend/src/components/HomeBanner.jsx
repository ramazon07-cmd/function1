import React from "react";
import { Link } from "react-router-dom";
import "../styles/homebanner.css";
import heroImg from "../images/kotlar.jpg";
import {
  FiTarget,
  FiBookOpen,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";

import { FaGraduationCap } from "react-icons/fa";

function HomeBanner() {
  return (
    <section
      className="homeBanner"
      style={{
        backgroundImage: ` url(${heroImg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
      }}
    >
      <div className="bannerContainer">
        <div className="bannerLeft">

          <div className="topBadge">
            <FaGraduationCap />
            Bilim va kelajak sari
          </div>

          <h1>
            Algebra, Geometriya va
            <span> Iqtisod </span>
            fanlarini oson o'rganing.
          </h1>

          <p>
            Platformamiz orqali matematika va iqtisod fanlaridan
            bilimlaringizni mustahkamlang. Testlar ishlang,
            formulalarni tushuning va har bir masalani bosqichma-bosqich
            yechishni o'rganing.
          </p>

          <Link to="/account" className="bannerButton">
            Boshlash  <span>→</span> 
          </Link>

          <div className="features">

            <div className="featureCard">
              <div className="iconBox">
                <FiTarget />
              </div>

              <h4>Aniq yechimlar</h4>
            </div>

            <div className="featureCard">
              <div className="iconBox">
                <FiBookOpen />
              </div>

              <h4>Juda aniq chunirish</h4>
            </div>

            <div className="featureCard">
              <div className="iconBox">
                <FiTrendingUp />
              </div>

              <h4>Iqtisod faniga ixtisoslashgan</h4>
            </div>

            <div className="featureCard">
              <div className="iconBox">
                <FiAward />
              </div>

              <h4>Yuqori natijalar</h4>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeBanner;
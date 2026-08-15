import React from 'react'
import '../styles/hero.css'
import heroimage from '../images/En.png'
import { NavLink } from 'react-router-dom'

function Hero() {
  return (

    <div className='hero-container'

      style={{
        background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${heroimage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>

      <div className="box">
        <section className="hero">
          <h1 className='typing'>
            <span className='sat'>Matematika</span> fanini chuqur va bosqichma-bosqich o‘rganish imkonini beradigan o‘quv dasturi
          </h1>
          <p className="slide">
            Algebra, geometriya, mantiq va iqtisod yo‘nalishlaridagi testlar orqali bilimlaringizni sinab ko‘ring. Murakkab va qiziqarli savollar bilan mantiqiy fikrlash, tahlil qilish va muammolarni hal qilish ko‘nikmalaringizni rivojlantiring.
          </p>
          <div className="butn">
            <NavLink to={"/account"}>
              <button className="btnnn">Boshlash</button>
            </NavLink>

            <NavLink to={"/test"}>
              <button className="btnn">Testni ishlang</button>
            </NavLink>

          </div>

        </section>
      </div>

    </div>
  )
}

export default Hero

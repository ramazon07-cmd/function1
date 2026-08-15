import React from "react";
import "../styles/footer.css";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="footerSection">
      <div className="box">
        <div className="footerTop">

          <div className="footerBrand">
            <h2>Function</h2>
            <p>
              Zamonaviy platforma orqali matematika va Iqtisodni oson va
              samarali o‘rganing.
            </p>
          </div>
          <div className="footerBox">
            <h3>Yaratuvchi</h3>
            <p className="jobo">Jovohir (2009)</p>
            <h3>Dasturchi</h3>
            <p>Miranshoh (2010)</p>
          </div>
          <div className="footerLinks">

            <h3>Bo‘limlar</h3>
            <NavLink to={"/mtm"}>
              <h5>Matematika
              </h5>
            </NavLink>
<NavLink to={"/syt"}>
    <h5>Iqtisod</h5>
</NavLink>
          <NavLink to={"/test"}>
               <h5>Testlar</h5>
          </NavLink>
         
          </div>


          <div className="footerContact">
            <h3>Aloqa</h3>
            <p>Email: function@gmail.com</p>
            <p>Tel: +998 94 588 16 85</p>
            <p>Sirdaryo, Guliston</p>
          </div>

        </div>

        <div className="footerBottom">
          <p>© 2026 Function. Barcha huquqlar himoyalangan</p>
        </div>
      </div>


    </footer>
  );
}

export default Footer;
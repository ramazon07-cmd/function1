
import React from "react";
import "../styles/apply.css";
import { NavLink } from "react-router-dom";
export default function Apply() {
    return (
        <section className="apply-section">

            <div className="apply-left">
                <div className="apply_text">
                    <h1>
                        Orzuga yaqinroq bo'ling
                    </h1>

                    <p>
                        Matematika o‘rganish endi murakkab emas.
                        Biz sizga eng samarali metodlar orqali mantiqiy fikrlashni rivojlantirish va masalalarni tez yechishni o‘rgatamiz.
                        Har bir dars sizni maqsadingizga yaqinlashtiradi — bugunoq boshlang!
                    </p>
                </div>
                <NavLink to={"/account"}>
                    <button className="button">Ro‘yxatdan o‘tish</button>
                </NavLink>
                
            </div>




        </section>
    );
}
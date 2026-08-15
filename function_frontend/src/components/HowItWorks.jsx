import "../styles/how.css";
import { FaUserGraduate, FaBookOpen, FaClipboardCheck, FaTrophy } from "react-icons/fa";

function HowItWorks() {

    const steps = [
        {
            id: "01",
            icon: <FaUserGraduate />,
            title: "Ro'yxatdan o'ting",
            text: "Platformaga kiring va o'zingiz uchun akkaunt yarating."
        },
        {
            id: "02",
            icon: <FaBookOpen />,
            title: "Fan tanlang",
            text: "Algebra, Geometriya, Mantiq yoki Iqtisod fanidan birini tanlang."
        },
        {
            id: "03",
            icon: <FaClipboardCheck />,
            title: "Test ishlang",
            text: "Belgilangan vaqt ichida testlarni yeching."
        },
        {
            id: "04",
            icon: <FaTrophy />,
            title: "Natijani oling",
            text: "Natijangiz va statistikangizni darhol ko'ring."
        }
    ];

    return (
        <section
            className="works"
            data-aos="fade-up"
            data-aos-duration="1000"
        >

            <span
                className="works-subtitle"
                data-aos="fade-down"
            >
                QANDAY ISHLAYDI
            </span>

            <h2
                data-aos="fade-up"
                data-aos-delay="100"
            >
                Platformadan foydalanish juda oson
            </h2>

            <p
                className="works-desc"
                data-aos="fade-up"
                data-aos-delay="200"
            >
                Bir necha oddiy qadam orqali bilimingizni sinab ko'ring
                va natijalaringizni kuzatib boring.
            </p>

            <div className="works-container">

                {steps.map((item, index) => (

                    <div
                        className="work-card"
                        key={item.id}
                        data-aos="zoom-in-up"
                        data-aos-delay={index * 150}
                        data-aos-duration="800"
                    >

                        <div className="number">
                            {item.id}
                        </div>

                        <div className="work-icon">
                            {item.icon}
                        </div>

                        <h3>{item.title}</h3>

                        <p>{item.text}</p>

                    </div>

                ))}

            </div>

        </section>
    )

}

export default HowItWorks;
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    showButton && (
      <button
        onClick={handleClick}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          zIndex: 9999,
          border: "none",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          fontSize: "20px",
        }}
        aria-label="Go to top"
      >
        ↑
      </button>
    )
  );
}

export default ScrollToTop;

import { useEffect, useState, useCallback } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed z-50 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-primary-500 text-foreground-50 shadow-lg btn-pulse transition-all duration-400 ease-in-out cursor-pointer border-0 outline-none left-4 md:left-6 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto bottom-20 md:bottom-24"
          : "opacity-0 translate-y-4 pointer-events-none bottom-4 md:bottom-6"
      }`}
      style={{ transitionProperty: "opacity, transform, bottom" }}
    >
      <i className="ri-arrow-up-line text-lg"></i>
    </button>
  );
}
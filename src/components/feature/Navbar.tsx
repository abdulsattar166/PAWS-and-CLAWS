import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "@/components/feature/Logo";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Navbar() {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
  const navLinks = settings.navigation.links;
  const contactPhone = settings.contact.phone || "+971 55 703 3165";
  const contactTel = `tel:${contactPhone.replace(/[^0-9+]/g, "")}`;
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 80) {
      setMobileOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background-50/90 backdrop-blur border-b border-background-200/40 py-3"
          : "bg-transparent py-4 md:py-5"
      }`}
    >
      <div className="w-full px-4 md:px-10 flex items-center justify-between gap-4 md:gap-6 relative">
        <Link to="/" className="shrink-0 z-10">
          <Logo variant="dark" />
        </Link>

        <nav className="hidden xl:flex items-center gap-6 absolute left-1/2 -translate-x-[57%]">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href + link.label}
                to={link.href}
                className={`nav-link text-base font-bold tracking-wide transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "is-active text-primary-400"
                    : "text-white hover:text-primary-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4 ml-auto z-10">
          <a
            href={contactTel}
            className="text-sm font-medium flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors text-foreground-800/90 hover:text-primary-600"
          >
            <i className="ri-phone-line" aria-hidden="true"></i>
            {contactPhone}
          </a>
          <Link
            to="/booking"
            className="btn-pulse text-sm font-semibold px-5 py-2.5 rounded-full bg-primary-500 text-foreground-50 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            {t("nav.book_now")}
          </Link>
        </div>

        {/* Mobile: phone + menu */}
        <div className="flex xl:hidden items-center gap-1.5 md:gap-2 ml-auto">
          <a
            href={contactTel}
            aria-label="Call us"
            className="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer active:scale-95 transition-transform text-foreground-900 bg-foreground-950/10 backdrop-blur-sm"
          >
            <i className="ri-phone-line text-lg" aria-hidden="true"></i>
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer active:scale-95 transition-transform text-foreground-900 bg-foreground-950/10 backdrop-blur-sm"
          >
            <i className={mobileOpen ? "ri-close-line text-xl" : "ri-menu-line text-xl"} aria-hidden="true"></i>
          </button>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      <div
        className={`xl:hidden fixed inset-0 z-40 bg-foreground-50/60 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer panel */}
      <div
        className={`xl:hidden fixed top-0 right-0 z-50 h-full w-[85vw] max-w-[320px] bg-background-50 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-background-200/40">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <Logo variant="dark" compact />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-background-100 text-foreground-800 cursor-pointer active:scale-90 transition-transform"
          >
            <i className="ri-close-line text-xl" aria-hidden="true"></i>
          </button>
        </div>

        <div className={`px-5 pt-4 pb-6 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)] ${mobileOpen ? "mobile-drawer-open" : ""}`}>
          {navLinks.map((link, idx) => (
            <Link
              key={link.href + link.label}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={`mobile-nav-item flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-colors cursor-pointer ${
                location.pathname === link.href
                  ? "bg-primary-500/15 text-primary-700"
                  : "text-foreground-700 hover:bg-background-100 hover:text-primary-700"
              }`}
              style={{ transitionDelay: `${60 + idx * 40}ms` }}
            >
              <span className="w-9 h-9 rounded-lg bg-background-100 flex items-center justify-center shrink-0">
                <i className={`${link.icon} text-lg`} aria-hidden="true"></i>
              </span>
              {link.label}
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-background-200/40">
            <a
              href={contactTel}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-foreground-700 hover:bg-background-100 cursor-pointer"
            >
              <span className="w-9 h-9 rounded-lg bg-primary-500/15 text-primary-700 flex items-center justify-center shrink-0">
                <i className="ri-phone-line text-lg" aria-hidden="true"></i>
              </span>
              {contactPhone}
            </a>
            <Link
              to="/booking"
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-primary-500 text-foreground-50 font-semibold text-sm cursor-pointer btn-pulse"
            >
              <i className="ri-calendar-check-line" aria-hidden="true"></i>
              {t("nav.book_now")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
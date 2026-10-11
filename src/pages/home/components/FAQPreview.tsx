import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { faq } from "@/mocks/pawsAndClaws";

export default function FAQPreview() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative py-14 md:py-20 px-4 md:px-10 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://readdy.ai/api/search-image?query=soft%20elegant%20abstract%20flowing%20waves%20in%20deep%20purple%20and%20warm%20gold%20tones%20on%20dark%20violet%20background%2C%20premium%20luxury%20pattern%2C%20subtle%20organic%20curves%2C%20modern%20sophisticated%20aesthetic%2C%20low%20contrast%20dreamy%20decorative%20background%20texture&width=1920&height=1080&seq=pc-faq-bg-01&orientation=landscape&nocache=true"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background-50/90"></div>
      </div>

      {/* Decorative paw accents */}
      <div className="absolute top-16 right-10 text-secondary-400/8 text-8xl pointer-events-none z-0 animate-float-paw" style={{ animationDelay: "0s" }}>
        <i className="ri-footprint-line"></i>
      </div>
      <div className="absolute bottom-16 left-10 text-accent-500/6 text-7xl pointer-events-none z-0 animate-float-paw" style={{ animationDelay: "2.5s" }}>
        <i className="ri-footprint-line"></i>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-primary-500"></span>
            FAQ
          </p>
          <h2 className="mt-4 font-heading text-4xl md:text-5xl text-foreground-950 leading-tight">
            {t("faq_page.hero_title")}
          </h2>
          <p className="mt-4 text-foreground-700 leading-relaxed max-w-xl mx-auto">
            {t("faq_page.hero_subtitle")}
          </p>
        </div>

        <div className="space-y-3">
          {faq.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-400 ${
                open === i
                  ? "bg-background-100 border-primary-400/40 shadow-lg shadow-primary-400/5"
                  : "bg-background-100/60 border-background-200/50 hover:border-primary-400/30 hover:bg-background-100/80"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
              >
                <span className="font-heading text-lg text-foreground-950">{item.q}</span>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  open === i ? "bg-primary-500 text-foreground-50 rotate-45" : "bg-background-200/60 text-background-950"
                }`}>
                  <i className="ri-add-line text-lg"></i>
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-foreground-700 leading-relaxed text-sm">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center bg-background-100/80 rounded-2xl p-8 max-w-lg mx-auto card-lift border border-background-200/50">
          <h3 className="font-heading text-xl text-foreground-950">{t("faq_page.still_question")}</h3>
          <p className="mt-2 text-foreground-700 text-sm leading-relaxed">{t("faq_page.still_question_desc")}</p>
          <Link
            to="/contact"
            className="btn-pulse mt-5 inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-foreground-50 px-6 py-3 rounded-full text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-mail-line" aria-hidden="true"></i>
            {t("faq_page.contact_cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
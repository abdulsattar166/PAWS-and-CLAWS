import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 md:py-32 px-4 md:px-10 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=warm%20soft%20focus%20image%20of%20a%20freshly%20groomed%20fluffy%20white%20samoyed%20dog%20looking%20up%20happily%20with%20a%20gold%20colored%20bandana%2C%20deep%20royal%20purple%20studio%20background%20with%20gentle%20moody%20lighting%2C%20editorial%20pet%20photography%2C%20premium%20salon%20aesthetic%2C%20warm%20gold%20tones%20against%20deep%20purple&width=1800&height=1000&seq=pc-cta-bg-01&orientation=landscape&nocache=true"
          alt="Happy groomed pet"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-background-50/85"></div>
        <div className="absolute inset-0 animated-gradient bg-gradient-to-tr from-primary-500/15 via-transparent to-secondary-500/25 pointer-events-none"></div>
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="font-heading text-4xl md:text-6xl text-foreground-950 leading-tight">
          {t("cta.heading")}{" "}
          <span className="italic text-accent-500">{t("cta.heading_italic")}</span>
        </h2>
        <p className="mt-6 text-foreground-900/90 text-lg leading-relaxed max-w-xl mx-auto">
          {t("cta.subtitle")}
        </p>
        <Link
          to="/booking"
          className="btn-pulse sheen animate-glow-pulse mt-8 inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-foreground-50 px-8 py-4 rounded-full text-base font-semibold transition-colors whitespace-nowrap cursor-pointer"
        >
          <i className="ri-calendar-check-line" aria-hidden="true"></i>
          {t("cta.button")}
        </Link>
      </div>
    </section>
  );
}
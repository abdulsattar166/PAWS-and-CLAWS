import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import FirstTimeOffer from "@/components/feature/FirstTimeOffer";
import { usePackages } from "@/hooks/usePackages";
import { formatAed } from "@/hooks/useServicePrices";

export default function PricingPreview() {
  const { t } = useTranslation();
  const { items: livePackages } = usePackages();
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="pricing" className="relative py-14 md:py-20 px-4 md:px-10 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://readdy.ai/api/search-image?query=soft%20elegant%20abstract%20flowing%20curves%20in%20deep%20purple%20and%20warm%20gold%20tones%20on%20dark%20violet%20background%2C%20premium%20luxury%20texture%2C%20subtle%20gradient%20waves%2C%20modern%20sophisticated%20aesthetic%2C%20low%20contrast%20decorative%20pattern%2C%20dreamy%20atmospheric%20background&width=1920&height=1080&seq=pc-pricing-bg-01&orientation=landscape&nocache=true"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background-50/90"></div>
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-400/6 blur-3xl pointer-events-none z-0"></div>
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-accent-400/5 blur-3xl pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-primary-500"></span>
            {t("pricing.label")}
          </p>
          <h2 className="mt-3 font-heading text-3xl md:text-4xl lg:text-[42px] text-foreground-950 leading-tight">
            {t("pricing.heading")}{" "}
            <span className="italic text-accent-500">{t("pricing.heading_italic")}</span>
          </h2>
        </div>

        <div className="mb-8 flex justify-center">
          <FirstTimeOffer size="sm" />
        </div>

        <div ref={ref} className={`reveal-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto ${isVisible ? 'is-visible' : ''}`}>
          {livePackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`card-lift relative flex flex-col h-full rounded-2xl p-6 md:p-7 border transition-all duration-400 ${
                pkg.highlighted
                  ? "bg-secondary-600 border-secondary-600 text-foreground-950 hover:scale-[1.03] hover:shadow-lg hover:shadow-secondary-500/30"
                  : "bg-background-100/80 border-background-200/50 text-foreground-950 hover:border-primary-400/50 hover:scale-[1.02]"
              }`}
            >
              {pkg.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full bg-accent-500 text-background-950 animate-pulse">
                  {t("pricing.popular")}
                </span>
              )}
              <p className={`text-[11px] md:text-xs uppercase tracking-[0.18em] font-semibold ${pkg.highlighted ? "text-foreground-300" : "text-foreground-600"}`}>
                {pkg.name}
              </p>
              <p className={`text-sm mt-1.5 ${pkg.highlighted ? "text-foreground-300" : "text-foreground-600"}`}>
                {pkg.subtitle}
              </p>
              <p className="mt-5 font-heading text-3xl md:text-4xl">
                {pkg.originalPrice != null && (
                  <span className="line-through text-foreground-400 text-xl mr-2">{formatAed(pkg.originalPrice)}</span>
                )}
                {formatAed(pkg.price)}
              </p>
              <p className={`text-xs mt-1 ${pkg.highlighted ? "text-foreground-300" : "text-foreground-500"}`}>{pkg.priceNote}</p>
              <ul className="mt-5 mb-6 space-y-2.5">
                {pkg.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${pkg.highlighted ? "text-foreground-300" : "text-foreground-700"}`}>
                    <i className={`ri-check-line mt-0.5 ${pkg.highlighted ? "text-accent-400" : "text-accent-500"}`} aria-hidden="true"></i>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/booking"
                className={`btn-pulse sheen mt-auto block text-center text-sm font-semibold px-5 py-3 rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                  pkg.highlighted
                    ? "bg-accent-500 text-background-950 hover:bg-accent-400"
                    : "bg-primary-500 text-foreground-50 hover:bg-primary-600"
                }`}
              >
                {t("pricing.cta")}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/services"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-accent-500 hover:text-accent-600 cursor-pointer"
          >
            {t("services.view_all")}
            <i className="ri-arrow-right-line arrow-nudge" aria-hidden="true"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
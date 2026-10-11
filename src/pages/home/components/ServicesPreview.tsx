import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import FirstTimeOffer from "@/components/feature/FirstTimeOffer";
import { useServicePrices, resolvePrice } from "@/hooks/useServicePrices";
import { useCatalogServices } from "@/hooks/useCatalogServices";
import { usePageContent } from "@/hooks/usePageContent";

const toneClasses: Record<string, { iconBg: string; iconText: string; accentBorder: string }> = {
  primary: { iconBg: "bg-primary-500", iconText: "text-foreground-50", accentBorder: "hover:border-primary-400/60" },
  accent: { iconBg: "bg-accent-500", iconText: "text-background-950", accentBorder: "hover:border-accent-400/60" },
  secondary: { iconBg: "bg-secondary-500", iconText: "text-white", accentBorder: "hover:border-secondary-400/60" },
};

export default function ServicesPreview() {
  const { t } = useTranslation();
  const { prices } = useServicePrices();
  const { items: catalog } = useCatalogServices();
  const { content } = usePageContent("home");
  const { ref, isVisible } = useScrollReveal();

  const label = content.servicesLabel || t("services.label");
  const heading = content.servicesHeading || t("services.heading");
  const headingItalic = content.servicesHeadingItalic || t("services.heading_italic");
  const subtitle = content.servicesSubtitle || t("services.subtitle");
  const services = catalog.slice(0, 6);

  return (
    <section className="relative py-14 md:py-20 px-4 md:px-10 overflow-hidden">
      {/* Background image with dim overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://readdy.ai/api/search-image?query=soft%20abstract%20flowing%20organic%20shapes%20in%20deep%20purple%20and%20warm%20gold%20tones%20on%20dark%20violet%20background%2C%20elegant%20luxury%20texture%2C%20subtle%20gradients%2C%20modern%20premium%20aesthetic%2C%20low%20contrast%20soft%20background%20pattern%2C%20dreamy%20atmospheric%20feel&width=1920&height=1080&seq=pc-services-bg-01&orientation=landscape&nocache=true"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background-50/90 backdrop-blur-[2px]"></div>
      </div>

      {/* Decorative glowing orbs */}
      <div className="absolute top-20 -left-32 w-72 h-72 rounded-full bg-secondary-400/10 blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-24 -right-32 w-80 h-80 rounded-full bg-primary-400/8 blur-3xl pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-secondary-600 font-semibold flex items-center gap-3">
              <span className="w-8 h-px bg-secondary-400"></span>
              {label}
            </p>
            <h2 className="mt-3 font-heading text-3xl md:text-4xl lg:text-[42px] text-foreground-950 leading-tight max-w-2xl">
              {heading}{" "}
              <span className="italic text-secondary-600">{headingItalic}</span>
            </h2>
          </div>
          <p className="text-foreground-700 max-w-md leading-relaxed text-sm">{subtitle}</p>
        </div>

        <div className="mb-8 flex justify-center">
          <FirstTimeOffer />
        </div>

        <div ref={ref} className={`reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 ${isVisible ? 'is-visible' : ''}`}>
          {services.map((service) => {
            const tc = toneClasses[service.tone];
            return (
              <article
                key={service.id}
                className={`group card-lift sheen rounded-2xl bg-background-100/70 backdrop-blur-sm border border-background-200/40 p-5 md:p-6 transition-all duration-400 ${tc.accentBorder} hover:shadow-lg hover:shadow-secondary-400/5`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`w-10 h-10 md:w-11 md:h-11 rounded-xl ${tc.iconBg} ${tc.iconText} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <i className={`${service.icon} text-lg md:text-xl icon-bounce`} aria-hidden="true"></i>
                  </span>
                  <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.16em] px-2.5 py-1 rounded-full bg-background-200/60 text-background-950 group-hover:bg-accent-500/20 group-hover:text-accent-600 transition-colors">
                    {service.duration}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-lg md:text-xl text-foreground-950 group-hover:text-secondary-600 transition-colors duration-300">{service.name}</h3>
                <p className="mt-1 text-xs md:text-sm text-foreground-600 italic">{service.tagline}</p>
                <p className="mt-2 text-foreground-700 text-sm leading-relaxed line-clamp-2">{service.description}</p>
                <div className="mt-4 pt-4 border-t border-background-200/40 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.18em] text-foreground-500">{t("services.starting_from")}</p>
                    <p className="font-heading text-lg md:text-xl text-foreground-950 mt-0.5">{resolvePrice(prices, service.id, service.price)}</p>
                  </div>
                  <Link
                    to="/booking"
                    className="btn-pulse w-9 h-9 rounded-full bg-secondary-500 text-white flex items-center justify-center hover:bg-secondary-400 transition-colors cursor-pointer"
                    aria-label={`Book ${service.name}`}
                  >
                    <i className="ri-arrow-right-up-line text-base" aria-hidden="true"></i>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/services"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-secondary-600 hover:text-secondary-700 cursor-pointer"
          >
            {t("services.view_all")}
            <i className="ri-arrow-right-line arrow-nudge" aria-hidden="true"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
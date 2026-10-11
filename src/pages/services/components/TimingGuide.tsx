import { useTranslation } from "react-i18next";
import { groomingTiming, otherAnimalTiming } from "@/mocks/pricingData";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function TimingGuide() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-14 md:py-20 px-4 md:px-10 bg-background-50">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-primary-500"></span>
            {t("price_list.timing_label")}
          </p>
          <h2 className="mt-4 font-heading text-3xl md:text-5xl text-foreground-950 leading-tight">
            {t("price_list.timing_heading")}{" "}
            <span className="italic">{t("price_list.timing_heading_italic")}</span>
          </h2>
          <p className="mt-4 text-foreground-700 leading-relaxed max-w-2xl mx-auto text-sm">
            {t("price_list.timing_subtitle")}
          </p>
        </div>

        <div
          ref={ref}
          className={`reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 ${isVisible ? "is-visible" : ""}`}
        >
          {groomingTiming.map((group) => (
            <article
              key={group.service}
              className="card-lift rounded-2xl bg-background-100 border border-background-200/70 p-5 md:p-6 hover:border-primary-400 transition-colors"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-background-200/70">
                <i className="ri-timer-line text-primary-500 text-lg" aria-hidden="true"></i>
                <h3 className="font-heading text-lg text-foreground-950">{group.service}</h3>
              </div>
              <ul className="mt-3 space-y-1">
                {group.rows.map((row) => (
                  <li
                    key={row.label}
                    className="flex items-center justify-between gap-3 py-1.5 text-sm"
                  >
                    <span className="text-foreground-700">{row.label}</span>
                    <span className="font-medium text-foreground-950 whitespace-nowrap">
                      {row.time}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <article className="card-lift rounded-2xl bg-secondary-50 border border-secondary-200/70 p-5 md:p-6">
            <div className="flex items-center gap-2 pb-3 border-b border-secondary-200/70">
              <i className="ri-leaf-line text-secondary-600 text-lg" aria-hidden="true"></i>
              <h3 className="font-heading text-lg text-secondary-900">
                {t("price_list.other_animals")}
              </h3>
            </div>
            <ul className="mt-3 space-y-1">
              {otherAnimalTiming.map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-3 py-1.5 text-sm">
                  <span className="text-secondary-900">{row.label}</span>
                  <span className="font-medium text-secondary-900 whitespace-nowrap">{row.time}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
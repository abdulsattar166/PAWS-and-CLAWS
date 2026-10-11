import { useTranslation } from "react-i18next";
import {
  hairCutServices,
  extraServices,
  extraTimeCharges,
} from "@/mocks/pricingData";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useServicePrices, resolvePrice } from "@/hooks/useServicePrices";
import { usePageContent } from "@/hooks/usePageContent";
import { DEFAULT_MEDICAL } from "@/lib/pageContent";

export default function AddOnServices() {
  const { t } = useTranslation();
  const { prices } = useServicePrices();
  const { content } = usePageContent("medical");
  const medical = { ...DEFAULT_MEDICAL, ...content };
  const medicalRef = useScrollReveal();
  const hairRef = useScrollReveal();
  const extraRef = useScrollReveal();

  return (
    <section className="relative py-14 md:py-20 px-4 md:px-10 bg-background-100/70">
      <div className="absolute top-16 left-6 text-primary-400/8 text-8xl pointer-events-none z-0 animate-float-paw">
        <i className="ri-scissors-2-line"></i>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Medical & special care */}
        <div
          ref={medicalRef.ref}
          className={`reveal-section ${medicalRef.isVisible ? "is-visible" : ""}`}
        >
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
              <span className="w-8 h-px bg-primary-500"></span>
              {medical.label}
            </p>
            <h2 className="mt-4 font-heading text-2xl md:text-4xl text-foreground-950 leading-tight">
              {medical.heading}{" "}
              <span className="italic">{medical.headingItalic}</span>
            </h2>
            {medical.intro && (
              <p className="mt-4 text-foreground-700 leading-relaxed max-w-2xl mx-auto text-sm">
                {medical.intro}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {medical.items.map((item, index) => (
              <article
                key={item.id || `medical-${index}`}
                className="card-lift flex gap-4 rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6 hover:border-accent-400 transition-colors"
              >
                <span className="w-12 h-12 shrink-0 rounded-xl bg-accent-500 text-background-950 flex items-center justify-center">
                  <i className={`${item.icon} text-xl`} aria-hidden="true"></i>
                </span>
                <div>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h3 className="font-heading text-lg text-foreground-950">{item.name}</h3>
                    <span className="whitespace-nowrap font-heading text-lg text-foreground-950">
                      {item.price}
                    </span>
                  </div>
                  {item.note && (
                    <span className="inline-block mt-1 text-[11px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1 rounded-full bg-accent-100 text-accent-900">
                      {item.note}
                    </span>
                  )}
                  <p className="mt-3 text-sm text-foreground-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {(medical.guideItems?.length ?? 0) > 0 && (
            <div className="mt-10">
              <div className="text-center mb-6">
                <h3 className="font-heading text-xl md:text-2xl text-foreground-950">{medical.guideTitle}</h3>
                {medical.guideIntro && (
                  <p className="mt-2 text-foreground-700 max-w-2xl mx-auto text-sm leading-relaxed">{medical.guideIntro}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {medical.guideItems.map((g, i) => (
                  <article key={`guide-${i}`} className="rounded-2xl bg-background-50 border border-background-200/70 p-5">
                    <span className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                      <i className={`${g.icon} text-lg`} aria-hidden="true"></i>
                    </span>
                    <h4 className="mt-3 font-heading text-base text-foreground-950">{g.title}</h4>
                    <p className="mt-2 text-sm text-foreground-700 leading-relaxed">{g.text}</p>
                  </article>
                ))}
              </div>
              {medical.disclaimer && (
                <p className="mt-6 max-w-3xl mx-auto flex items-start justify-center gap-2 text-center text-xs text-foreground-600 leading-relaxed">
                  <i className="ri-information-line mt-0.5 shrink-0" aria-hidden="true"></i>
                  <span>{medical.disclaimer}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Haircut menu */}
        <div ref={hairRef.ref} className={`reveal-section mt-16 ${hairRef.isVisible ? "is-visible" : ""}`}>
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
              <span className="w-8 h-px bg-primary-500"></span>
              {t("price_list.haircut_label")}
            </p>
            <h2 className="mt-4 font-heading text-2xl md:text-4xl text-foreground-950 leading-tight">
              {t("price_list.haircut_heading")}{" "}
              <span className="italic">{t("price_list.haircut_heading_italic")}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {hairCutServices.map((item, index) => (
              <article
                key={item.id}
                className="card-lift rounded-2xl bg-background-50 border border-background-200/70 p-5 flex flex-col hover:border-primary-400 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="w-9 h-9 rounded-lg bg-primary-500 text-foreground-50 flex items-center justify-center text-sm font-semibold">
                    {String(index + 12).padStart(2, "0")}
                  </span>
                  {item.note && (
                    <span className="text-[10px] uppercase tracking-[0.14em] font-semibold px-2 py-1 rounded-full bg-secondary-100 text-secondary-900">
                      {item.note}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-heading text-lg text-foreground-950">{item.name}</h3>
                <p className="mt-2 text-sm text-foreground-700 leading-relaxed flex-1">
                  {item.description}
                </p>
                <p className="mt-4 pt-3 border-t border-background-200/70 font-heading text-xl text-foreground-950">
                  {item.price}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Extra services + extra time charges */}
        <div ref={extraRef.ref} className={`reveal-section mt-16 ${extraRef.isVisible ? "is-visible" : ""}`}>
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
              <span className="w-8 h-px bg-primary-500"></span>
              {t("price_list.extra_label")}
            </p>
            <h2 className="mt-4 font-heading text-2xl md:text-4xl text-foreground-950 leading-tight">
              {t("price_list.extra_heading")}{" "}
              <span className="italic">{t("price_list.extra_heading_italic")}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
            <div className="lg:col-span-2 rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {extraServices.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between gap-3 py-3 border-b border-background-200/60 last:border-0 sm:[&:nth-last-child(2)]:border-0"
                  >
                    <span className="flex items-center gap-2 text-sm text-foreground-800">
                      <i className="ri-add-circle-line text-primary-500" aria-hidden="true"></i>
                      {item.name}
                    </span>
                    <span className="font-heading text-base text-foreground-950 whitespace-nowrap">
                      {resolvePrice(prices, item.id, item.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-secondary-50 border border-secondary-200/70 p-5 md:p-6">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-lg bg-secondary-500 text-background-50 flex items-center justify-center">
                  <i className="ri-time-line text-lg" aria-hidden="true"></i>
                </span>
                <h3 className="font-heading text-lg text-secondary-900">
                  {t("price_list.extra_time_heading")}
                </h3>
              </div>
              <ul className="mt-4 space-y-3">
                {extraTimeCharges.map((item) => (
                  <li key={item.name} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-secondary-900">{item.name}</span>
                    <span className="text-sm font-semibold text-secondary-900 whitespace-nowrap">
                      {item.price}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-secondary-900/80 leading-relaxed">
                {t("price_list.extra_time_note")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
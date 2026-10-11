import { useTranslation } from "react-i18next";
import { groomingTiers, otherAnimalPrices } from "@/mocks/pricingData";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useServicePrices, resolvePrice, useServiceSizePrices, resolveSizePrice } from "@/hooks/useServicePrices";

const tierTones = ["primary", "accent", "secondary", "primary"] as const;

// Representative service that carries the live S/M/L/XL prices for each tier.
const TIER_SIZE_SERVICE: Record<string, string> = {
  "wash-trimming": "dog-wash",
  "basic-grooming": "dog-basic",
  "full-grooming": "dog-full",
  "deep-cleaning": "dog-deep",
};

const ROW_SIZE_KEY: Record<string, string> = {
  "S & Cat": "small",
  M: "medium",
  L: "large",
  XL: "xl",
};

const toneMap: Record<string, { badge: string; dot: string; ring: string }> = {
  primary: {
    badge: "bg-primary-100 text-primary-700",
    dot: "bg-primary-500",
    ring: "hover:border-primary-400",
  },
  accent: {
    badge: "bg-accent-100 text-accent-900",
    dot: "bg-accent-500",
    ring: "hover:border-accent-400",
  },
  secondary: {
    badge: "bg-secondary-100 text-secondary-900",
    dot: "bg-secondary-500",
    ring: "hover:border-secondary-400",
  },
};

export default function PriceList() {
  const { t } = useTranslation();
  const { prices } = useServicePrices();
  const { sizePrices } = useServiceSizePrices();
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal();
  const otherRef = useScrollReveal();

  return (
    <section className="relative py-14 md:py-20 px-4 md:px-10 bg-background-50">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div
          ref={headerRef.ref}
          className={`reveal-section text-center mb-10 ${headerRef.isVisible ? "is-visible" : ""}`}
        >
          <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-primary-500"></span>
            {t("price_list.label")}
          </p>
          <h2 className="mt-4 font-heading text-3xl md:text-5xl text-foreground-950 leading-tight">
            {t("price_list.heading")}{" "}
            <span className="italic">{t("price_list.heading_italic")}</span>
          </h2>
          <p className="mt-4 text-foreground-700 leading-relaxed max-w-2xl mx-auto text-sm">
            {t("price_list.subtitle")}
          </p>
        </div>

        {/* Grooming tiers with size pricing */}
        <div
          ref={gridRef.ref}
          className={`reveal-stagger grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 ${gridRef.isVisible ? "is-visible" : ""}`}
        >
          {groomingTiers.map((tier, index) => {
            const tone = toneMap[tierTones[index % tierTones.length]];
            const sizeServiceId = TIER_SIZE_SERVICE[tier.id];
            return (
              <article
                key={tier.id}
                className={`card-lift rounded-2xl md:rounded-3xl bg-background-100 border border-background-200/70 p-5 md:p-7 transition-colors ${tone.ring}`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-heading text-xl md:text-2xl text-foreground-950">
                      {tier.name}
                    </h3>
                    <p className="mt-2 text-sm text-foreground-700 leading-relaxed max-w-md">
                      {tier.summary}
                    </p>
                  </div>
                  <span
                    className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full ${tone.badge}`}
                  >
                    {tier.serviceCount} {t("price_list.services_count")}
                  </span>
                </div>

                {/* Size price table */}
                <div className="mt-5 rounded-xl overflow-hidden border border-background-200/70 bg-background-50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-background-200/60 text-foreground-900">
                        <th className="text-left font-semibold px-4 py-2.5 text-xs uppercase tracking-[0.12em]">
                          {t("price_list.col_size")}
                        </th>
                        <th className="text-left font-semibold px-4 py-2.5 text-xs uppercase tracking-[0.12em]">
                          {t("price_list.col_weight")}
                        </th>
                        <th className="text-right font-semibold px-4 py-2.5 text-xs uppercase tracking-[0.12em]">
                          {t("price_list.col_price")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tier.prices.map((row) => (
                        <tr
                          key={row.size}
                          className="border-t border-background-200/60 hover:bg-primary-50/60 transition-colors"
                        >
                          <td className="px-4 py-2.5 text-foreground-950 font-medium">{row.size}</td>
                          <td className="px-4 py-2.5 text-foreground-700">{row.weight}</td>
                          <td className="px-4 py-2.5 text-right font-heading text-foreground-950 whitespace-nowrap">
                            {resolveSizePrice(sizePrices, sizeServiceId, ROW_SIZE_KEY[row.size] ?? "", row.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Includes */}
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-foreground-600 font-semibold">
                  {t("price_list.includes")}
                </p>
                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground-700">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${tone.dot}`}></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* Other animals */}
        <div
          ref={otherRef.ref}
          className={`reveal-section mt-6 md:mt-8 ${otherRef.isVisible ? "is-visible" : ""}`}
        >
          <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-primary-500"></span>
            {t("price_list.other_animals")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {otherAnimalPrices.map((animal) => (
              <article
                key={animal.id}
                className="card-lift rounded-2xl md:rounded-3xl bg-background-100 border border-background-200/70 p-5 md:p-7 hover:border-primary-400 transition-colors"
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-secondary-500 text-background-50 flex items-center justify-center">
                      <i
                        className={animal.id === "birds" ? "ri-flight-takeoff-line text-lg" : "ri-heart-line text-lg"}
                        aria-hidden="true"
                      ></i>
                    </span>
                    <h3 className="font-heading text-xl text-foreground-950">{animal.name}</h3>
                  </div>
                  <span className="whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary-100 text-secondary-900">
                    {animal.serviceCount} {t("price_list.services_count")}
                  </span>
                </div>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {animal.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground-700">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-secondary-500"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-4 border-t border-background-200/70 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-foreground-600">
                    {t("services.starting_from")}
                  </span>
                  <span className="font-heading text-2xl text-foreground-950">{resolvePrice(prices, animal.id === "birds" ? "bird-full" : "bunny-full", animal.price)}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
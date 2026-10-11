import { useTranslation } from "react-i18next";

interface FirstTimeOfferProps {
  size?: "lg" | "sm";
  className?: string;
}

/**
 * Promo strip highlighting the one-time 20% first-service discount.
 * Clearly scoped to a customer's FIRST booking only.
 */
export default function FirstTimeOffer({ size = "lg", className = "" }: FirstTimeOfferProps) {
  const { t } = useTranslation();
  const large = size === "lg";

  return (
    <div
      className={`inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 rounded-2xl border border-accent-300/70 bg-accent-100 px-4 sm:px-6 py-4 text-center sm:text-left ${className}`}
    >
      <span
        className={`shrink-0 rounded-full bg-accent-500 text-background-950 flex items-center justify-center ${
          large ? "w-11 h-11" : "w-9 h-9"
        }`}
      >
        <i className={`ri-gift-2-line ${large ? "text-xl" : "text-lg"}`} aria-hidden="true"></i>
      </span>
      <div>
        <p className={`font-heading text-foreground-50 leading-snug ${large ? "text-base md:text-lg" : "text-sm md:text-base"}`}>
          {t("offer.title")}
        </p>
        <p className={`mt-1 text-foreground-100 leading-relaxed ${large ? "text-xs md:text-sm" : "text-xs"}`}>
          {t("offer.text")}
        </p>
      </div>
      <span className="shrink-0 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.16em] px-3 py-1.5 rounded-full bg-accent-500 text-background-950 whitespace-nowrap">
        {t("offer.tag")}
      </span>
    </div>
  );
}
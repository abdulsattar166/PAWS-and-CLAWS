import { useTranslation } from "react-i18next";
import { whyUs } from "@/mocks/pawsAndClaws";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { usePageContent } from "@/hooks/usePageContent";
import type { IconItem } from "@/lib/pageContent";

export default function WhyUs() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal();
  const { content } = usePageContent("home");

  const whyLabels: Record<string, string> = {
    "One pet at a time": t("why.one_pet"),
    "Zero drive time for you": t("why.zero_drive"),
    "Vet-approved products": t("why.products"),
    "Fully insured team": t("why.insured"),
    "Salon-grade equipment": t("why.equipment"),
    "Same-week bookings": t("why.booking"),
  };
  const whyDescLabels: Record<string, string> = {
    "One pet at a time": t("why.one_pet_desc"),
    "Zero drive time for you": t("why.zero_drive_desc"),
    "Vet-approved products": t("why.products_desc"),
    "Fully insured team": t("why.insured_desc"),
    "Salon-grade equipment": t("why.equipment_desc"),
    "Same-week bookings": t("why.booking_desc"),
  };

  const label = content.whyLabel || t("why.label");
  const heading = content.whyHeading || t("why.heading");
  const headingItalic = content.whyHeadingItalic || t("why.heading_italic");
  const subtitle =
    content.whySubtitle ||
    "We obsess over the tiny details so your pet feels safe, and you feel like your money is well spent. Here's what makes us different.";

  const items: IconItem[] = content.whyItems?.length
    ? content.whyItems
    : whyUs.map((item) => ({
        icon: item.icon,
        title: whyLabels[item.title] || item.title,
        desc: whyDescLabels[item.title] || item.description,
      }));

  return (
    <section className="relative bg-background-50/95 py-14 md:py-20 px-4 md:px-10 overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent-400/5 blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary-400/4 blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center gap-3">
              <span className="w-8 h-px bg-accent-500"></span>
              {label}
            </p>
            <h2 className="mt-3 font-heading text-3xl md:text-4xl lg:text-[42px] text-foreground-950 leading-tight">
              {heading}{" "}
              <span className="italic text-accent-500">{headingItalic}</span>
            </h2>
          </div>
          <p className="text-foreground-700 leading-relaxed text-sm self-end">
            {subtitle}
          </p>
        </div>

        <div ref={ref} className={`reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${isVisible ? 'is-visible' : ''}`}>
          {items.map((item, idx) => (
            <div
              key={item.title}
              className={`group card-lift rounded-2xl p-6 md:p-7 border transition-all duration-400 ${
                idx === 1
                  ? "bg-primary-500 border-primary-500 hover:bg-primary-400 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-500/20"
                  : "bg-foreground-950/5 border-foreground-950/10 hover:bg-foreground-950/10 hover:border-primary-400/40 hover:scale-[1.02]"
              }`}
            >
              <span
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                  idx === 1 ? "bg-background-950 text-accent-400" : "bg-accent-500 text-background-950"
                }`}
              >
                <i className={`${item.icon} text-lg md:text-xl icon-bounce`} aria-hidden="true"></i>
              </span>
              <h3 className={`mt-5 font-heading text-lg md:text-xl transition-colors duration-300 ${idx === 1 ? "text-foreground-50 group-hover:text-foreground-100" : "text-foreground-950 group-hover:text-accent-500"}`}>
                {item.title}
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${idx === 1 ? "text-foreground-100" : "text-foreground-700"}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
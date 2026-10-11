import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import PageTransition from "@/components/base/PageTransition";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { bookingSlots } from "@/mocks/pawsAndClaws";

interface PolicyItem {
  labelKey: string;
  textKey: string;
}

interface PolicySection {
  number: string;
  icon: string;
  tone: "primary" | "accent" | "secondary";
  titleKey: string;
  introKey?: string;
  items: PolicyItem[];
}

const sections: PolicySection[] = [
  {
    number: "01",
    icon: "ri-time-line",
    tone: "primary",
    titleKey: "policies_page.s1_title",
    items: [
      { labelKey: "policies_page.s1_i1_label", textKey: "policies_page.s1_i1_text" },
      { labelKey: "policies_page.s1_i2_label", textKey: "policies_page.s1_i2_text" },
      { labelKey: "policies_page.s1_i3_label", textKey: "policies_page.s1_i3_text" },
    ],
  },
  {
    number: "02",
    icon: "ri-calendar-close-line",
    tone: "accent",
    titleKey: "policies_page.s2_title",
    introKey: "policies_page.s2_intro",
    items: [
      { labelKey: "policies_page.s2_i1_label", textKey: "policies_page.s2_i1_text" },
      { labelKey: "policies_page.s2_i2_label", textKey: "policies_page.s2_i2_text" },
      { labelKey: "policies_page.s2_i3_label", textKey: "policies_page.s2_i3_text" },
    ],
  },
  {
    number: "03",
    icon: "ri-map-pin-2-line",
    tone: "secondary",
    titleKey: "policies_page.s3_title",
    items: [
      { labelKey: "policies_page.s3_i1_label", textKey: "policies_page.s3_i1_text" },
      { labelKey: "policies_page.s3_i2_label", textKey: "policies_page.s3_i2_text" },
    ],
  },
  {
    number: "04",
    icon: "ri-heart-pulse-line",
    tone: "primary",
    titleKey: "policies_page.s4_title",
    items: [
      { labelKey: "policies_page.s4_i1_label", textKey: "policies_page.s4_i1_text" },
      { labelKey: "policies_page.s4_i2_label", textKey: "policies_page.s4_i2_text" },
      { labelKey: "policies_page.s4_i3_label", textKey: "policies_page.s4_i3_text" },
    ],
  },
  {
    number: "05",
    icon: "ri-moon-line",
    tone: "accent",
    titleKey: "policies_page.s5_title",
    items: [
      { labelKey: "policies_page.s5_i1_label", textKey: "policies_page.s5_i1_text" },
      { labelKey: "policies_page.s5_i2_label", textKey: "policies_page.s5_i2_text" },
    ],
  },
  {
    number: "06",
    icon: "ri-bank-card-line",
    tone: "secondary",
    titleKey: "policies_page.s6_title",
    items: [
      { labelKey: "policies_page.s6_i1_label", textKey: "policies_page.s6_i1_text" },
      { labelKey: "policies_page.s6_i2_label", textKey: "policies_page.s6_i2_text" },
    ],
  },
];

const toneStyles: Record<PolicySection["tone"], { badge: string; text: string }> = {
  primary: { badge: "bg-primary-500", text: "text-foreground-50" },
  accent: { badge: "bg-accent-500", text: "text-background-950" },
  secondary: { badge: "bg-secondary-500", text: "text-white" },
};

function RevealWrap({ children, delay }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`reveal-section ${isVisible ? "is-visible" : ""}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}

export default function BookingPolicies() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-transparent text-foreground-950">
      <Navbar />
      <PageTransition>
        {/* Hero */}
        <section className="relative pt-28 pb-16 md:pt-48 md:pb-28 px-4 md:px-10 overflow-hidden bg-background-900">
          <div className="absolute top-10 left-10 text-accent-500/10 text-8xl pointer-events-none">
            <i className="ri-file-list-3-line"></i>
          </div>
          <div className="absolute bottom-6 right-12 text-primary-400/10 text-8xl pointer-events-none">
            <i className="ri-footprint-line"></i>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-white/70 font-semibold flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-px bg-white/50"></span>
              {t("policies_page.hero_label")}
            </p>
            <h1 className="font-heading text-2xl md:text-5xl text-white leading-tight">{t("policies_page.title")}</h1>
            <p className="mt-4 text-white/80 text-sm">{t("policies_page.last_updated")}</p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-14 md:py-20 px-4 md:px-10 bg-background-50/92">
          <div className="max-w-3xl mx-auto">
            <RevealWrap>
              <div className="rounded-2xl bg-background-100 border border-background-200/70 p-6 md:p-8 card-lift">
                <div className="flex items-start gap-4">
                  <span className="w-12 h-12 rounded-2xl bg-primary-500 text-foreground-50 flex items-center justify-center shrink-0">
                    <i className="ri-information-line text-2xl" aria-hidden="true"></i>
                  </span>
                  <p className="text-foreground-700 leading-relaxed">{t("policies_page.intro")}</p>
                </div>
              </div>
            </RevealWrap>

            {/* Time slots reference */}
            <RevealWrap delay={80}>
              <div className="mt-12 text-center">
                <h2 className="font-heading text-3xl text-foreground-950">{t("policies_page.slots_title")}</h2>
                <p className="mt-3 text-foreground-700 leading-relaxed">{t("policies_page.slots_note")}</p>
              </div>
              <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {bookingSlots.map((slot) => (
                  <div
                    key={slot}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-background-50 border border-background-200/70 text-xs font-medium text-foreground-700 card-lift"
                  >
                    <i className="ri-time-line text-accent-500 text-sm" aria-hidden="true"></i>
                    <span className="whitespace-nowrap">{slot}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7 text-center">
                <Link
                  to="/booking"
                  className="btn-pulse inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary-500 text-foreground-50 font-semibold text-sm hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-calendar-check-line" aria-hidden="true"></i>
                  {t("policies_page.slots_cta")}
                </Link>
              </div>
            </RevealWrap>
          </div>
        </section>

        {/* Policy sections */}
        <section className="py-14 md:py-24 px-4 md:px-10 bg-background-100/88">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            {sections.map((section, idx) => {
              const tone = toneStyles[section.tone];
              return (
                <RevealWrap key={section.number} delay={idx * 60}>
                  <article className="rounded-2xl md:rounded-3xl bg-background-50 border border-background-200/70 p-6 md:p-8 card-lift">
                    <header className="flex items-center gap-4">
                      <span className={`w-12 h-12 rounded-2xl ${tone.badge} ${tone.text} flex items-center justify-center shrink-0`}>
                        <i className={`${section.icon} text-2xl`} aria-hidden="true"></i>
                      </span>
                      <div className="flex items-baseline gap-3">
                        <span className="font-heading text-2xl text-foreground-300">{section.number}</span>
                        <h2 className="font-heading text-xl md:text-2xl text-foreground-950">{t(section.titleKey)}</h2>
                      </div>
                    </header>
                    {section.introKey && (
                      <p className="mt-5 text-foreground-700 leading-relaxed italic">{t(section.introKey)}</p>
                    )}
                    <div className="mt-6 space-y-5">
                      {section.items.map((item) => (
                        <div key={item.labelKey} className="flex items-start gap-3">
                          <i className="ri-checkbox-circle-line text-accent-500 text-lg mt-0.5 shrink-0" aria-hidden="true"></i>
                          <div>
                            <h3 className="text-sm font-semibold text-foreground-950">{t(item.labelKey)}</h3>
                            <p className="mt-1 text-foreground-700 leading-relaxed text-sm">{t(item.textKey)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                </RevealWrap>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-16 md:py-24 px-4 md:px-10 overflow-hidden">
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "linear-gradient(135deg, oklch(0.40 0.14 295), oklch(0.55 0.19 295), oklch(0.30 0.10 295), oklch(0.48 0.16 295))",
              backgroundSize: "400% 400%",
              animation: "bgShimmer 8s ease infinite",
            }}
          ></div>
          <div className="absolute top-10 right-12 text-accent-500/10 text-8xl pointer-events-none z-0 animate-gentle-float">
            <i className="ri-scissors-cut-line"></i>
          </div>
          <RevealWrap>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="font-heading text-3xl md:text-5xl text-white leading-tight">{t("policies_page.cta_title")}</h2>
              <p className="mt-4 text-white/80 leading-relaxed">{t("policies_page.cta_subtitle")}</p>
              <Link
                to="/booking"
                className="btn-pulse mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent-500 text-background-950 font-semibold text-sm hover:bg-accent-400 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-calendar-check-line" aria-hidden="true"></i>
                {t("policies_page.cta_button")}
              </Link>
            </div>
          </RevealWrap>
        </section>
      </PageTransition>
      <Footer />
    </main>
  );
}
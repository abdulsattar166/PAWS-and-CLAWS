import { useTranslation } from "react-i18next";
import { howItWorks } from "@/mocks/pawsAndClaws";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { usePageContent } from "@/hooks/usePageContent";
import type { StepItem } from "@/lib/pageContent";

export default function HowItWorks() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal();
  const { content } = usePageContent("home");

  const stepTitles = [t("how.step1_title"), t("how.step2_title"), t("how.step3_title"), t("how.step4_title")];
  const stepDescs = [t("how.step1_desc"), t("how.step2_desc"), t("how.step3_desc"), t("how.step4_desc")];

  const label = content.howLabel || t("how.label");
  const heading = content.howHeading || t("how.heading");
  const headingItalic = content.howHeadingItalic || t("how.heading_italic");

  const steps: StepItem[] = content.howSteps?.length
    ? content.howSteps
    : howItWorks.map((s, i) => ({ icon: s.icon, title: stepTitles[i] || s.title, desc: stepDescs[i] || s.description }));

  return (
    <section id="how-it-works" className="relative bg-background-50/92 py-14 md:py-20 px-4 md:px-10 overflow-hidden">
      {/* Animated background paw prints */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-[5%] text-accent-500/6 text-6xl animate-float-paw" style={{ animationDelay: "0s" }}>
          <i className="ri-footprint-line"></i>
        </div>
        <div className="absolute top-1/3 right-[8%] text-accent-400/6 text-5xl animate-float-paw" style={{ animationDelay: "1.5s" }}>
          <i className="ri-footprint-line"></i>
        </div>
        <div className="absolute bottom-1/4 left-[15%] text-secondary-400/5 text-4xl animate-float-paw" style={{ animationDelay: "3s" }}>
          <i className="ri-footprint-line"></i>
        </div>
        <div className="absolute bottom-10 right-[10%] text-accent-500/5 text-5xl animate-float-paw" style={{ animationDelay: "4.5s" }}>
          <i className="ri-footprint-line"></i>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-primary-500"></span>
            {label}
            <span className="w-8 h-px bg-primary-500"></span>
          </p>
          <h2 className="mt-3 font-heading text-3xl md:text-4xl lg:text-[42px] text-foreground-950 leading-tight max-w-2xl mx-auto">
            {heading}{" "}
            <span className="italic text-accent-500">{headingItalic}</span>
          </h2>
        </div>

        <div ref={ref} className={`reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 relative ${isVisible ? 'is-visible' : ''}`}>
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="card-lift rounded-2xl bg-background-100/80 border border-background-200/50 p-6 md:p-7 h-full transition-all duration-400 hover:border-primary-400/50 hover:bg-background-100">
                {/* Step number with animated reveal */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-heading text-4xl md:text-5xl text-primary-500 font-semibold italic leading-none transition-transform duration-300 group-hover:scale-110">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-accent-500 border border-accent-400/15 transition-all duration-300 group-hover:bg-primary-500 group-hover:text-foreground-50">
                    <i className={`${step.icon} text-xl icon-bounce`} aria-hidden="true"></i>
                  </span>
                </div>
                <h3 className="font-heading text-lg md:text-xl text-foreground-950 group-hover:text-accent-500 transition-colors duration-300">{step.title}</h3>
                <p className="mt-2 text-sm text-foreground-700 leading-relaxed">{step.desc}</p>

                {/* Progress line on hover */}
                <div className="mt-5 h-0.5 rounded-full bg-background-200/50 overflow-hidden">
                  <div className="h-full rounded-full bg-primary-400/0 group-hover:bg-primary-400/60 transition-all duration-500 w-0 group-hover:w-full"></div>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <span className="hidden lg:flex absolute top-1/2 -right-2.5 w-5 h-5 rounded-full bg-secondary-400 text-secondary-950 items-center justify-center z-10">
                  <i className="ri-arrow-right-s-line text-sm" aria-hidden="true"></i>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
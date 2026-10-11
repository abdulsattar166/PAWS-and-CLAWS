import { useTranslation } from "react-i18next";
import { catHaircutStyles, dogHaircutStyles } from "@/mocks/pricingData";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function StyleCard({ name, description, tone }: { name: string; description: string; tone: string }) {
  return (
    <article
      className={`card-lift rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6 flex flex-col transition-colors ${tone}`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="font-heading text-lg text-foreground-950">{name}</h3>
        <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.14em] font-semibold px-2.5 py-1 rounded-full bg-accent-100 text-accent-900">
          Free Checkup Service
        </span>
      </div>
      <p className="mt-3 text-sm text-foreground-700 leading-relaxed flex-1">{description}</p>
    </article>
  );
}

export default function HaircutStyles() {
  const { t } = useTranslation();
  const headerRef = useScrollReveal();
  const catRef = useScrollReveal();
  const dogRef = useScrollReveal();

  return (
    <section className="relative py-14 md:py-20 px-4 md:px-10 bg-background-50">
      <div className="absolute top-20 right-8 text-accent-400/6 text-8xl pointer-events-none z-0 animate-float-paw">
        <i className="ri-scissors-cut-line"></i>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div
          ref={headerRef.ref}
          className={`reveal-section text-center mb-10 ${headerRef.isVisible ? "is-visible" : ""}`}
        >
          <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-primary-500"></span>
            {t("price_list.haircut_styles_label")}
          </p>
          <h2 className="mt-4 font-heading text-3xl md:text-5xl text-foreground-950 leading-tight">
            {t("price_list.haircut_styles_heading")}{" "}
            <span className="italic">{t("price_list.haircut_styles_heading_italic")}</span>
          </h2>
          <p className="mt-4 text-foreground-700 leading-relaxed max-w-2xl mx-auto text-sm">
            {t("price_list.haircut_styles_subtitle")}
          </p>
        </div>

        {/* Cat styles */}
        <div ref={catRef.ref} className={`reveal-section ${catRef.isVisible ? "is-visible" : ""}`}>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-10 rounded-xl bg-primary-500 text-foreground-50 flex items-center justify-center">
              <i className="ri-emotion-happy-line text-lg" aria-hidden="true"></i>
            </span>
            <h3 className="font-heading text-xl md:text-2xl text-foreground-950">
              {t("price_list.cat_styles_heading")}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {catHaircutStyles.map((style) => (
              <StyleCard
                key={style.id}
                name={style.name}
                description={style.description}
                tone="hover:border-primary-400"
              />
            ))}
          </div>
        </div>

        {/* Dog styles */}
        <div ref={dogRef.ref} className={`reveal-section mt-12 ${dogRef.isVisible ? "is-visible" : ""}`}>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-10 rounded-xl bg-accent-500 text-background-950 flex items-center justify-center">
              <i className="ri-footprint-line text-lg" aria-hidden="true"></i>
            </span>
            <h3 className="font-heading text-xl md:text-2xl text-foreground-950">
              {t("price_list.dog_styles_heading")}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {dogHaircutStyles.map((style) => (
              <StyleCard
                key={style.id}
                name={style.name}
                description={style.description}
                tone="hover:border-accent-400"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
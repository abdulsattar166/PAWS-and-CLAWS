import { usePageContent } from "@/hooks/usePageContent";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { DEFAULT_ABOUT } from "@/lib/pageContent";

export default function AboutJourney() {
  const { content } = usePageContent("about");
  const { ref, isVisible } = useScrollReveal();

  const label = content.journeyLabel || DEFAULT_ABOUT.journeyLabel;
  const title = content.journeyTitle || DEFAULT_ABOUT.journeyTitle;
  const subtitle = content.journeySubtitle || DEFAULT_ABOUT.journeySubtitle;
  const items = content.journeyItems?.length ? content.journeyItems : DEFAULT_ABOUT.journeyItems;

  return (
    <section className="relative py-14 md:py-20 px-4 md:px-10 bg-background-50/92 overflow-hidden">
      <div className="absolute top-16 right-6 text-accent-400/6 text-8xl pointer-events-none z-0 animate-float-paw">
        <i className="ri-route-line"></i>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-primary-500"></span>
            {label}
          </p>
          <h2 className="mt-4 font-heading text-3xl md:text-5xl text-foreground-950 leading-tight">{title}</h2>
          {subtitle && <p className="mt-4 max-w-2xl mx-auto text-foreground-700 leading-relaxed">{subtitle}</p>}
        </div>

        <div ref={ref} className={`reveal-stagger relative ${isVisible ? "is-visible" : ""}`}>
          {/* Vertical rail */}
          <span className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-background-300/70" aria-hidden="true"></span>

          <ul className="space-y-6 md:space-y-8">
            {items.map((item, idx) => {
              const right = idx % 2 === 1;
              return (
                <li key={idx} className="relative md:grid md:grid-cols-2 md:gap-10">
                  {/* Dot */}
                  <span
                    className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-5 w-8 h-8 rounded-full bg-primary-500 text-foreground-50 flex items-center justify-center -ml-4 md:ml-0 z-10"
                    aria-hidden="true"
                  >
                    <i className="ri-flag-2-line text-sm"></i>
                  </span>

                  <div className={right ? "md:col-start-2" : "md:col-start-1"}>
                    <article className="ml-12 md:ml-0 card-lift rounded-2xl bg-background-100 border border-background-200/70 p-5 md:p-6 hover:border-accent-400 transition-colors">
                      <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full bg-accent-100 text-accent-900">
                        {item.year}
                      </span>
                      <h3 className="mt-3 font-heading text-lg md:text-xl text-foreground-950">{item.title}</h3>
                      <p className="mt-2 text-sm text-foreground-700 leading-relaxed">{item.desc}</p>
                    </article>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
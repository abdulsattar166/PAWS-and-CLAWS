import { useTranslation } from "react-i18next";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const GOOGLE_REVIEW_URL =
  "https://www.google.com/maps/search/?api=1&query=Paws+and+Claws+Pets+Grooming+Salon+Abu+Dhabi";

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-accent-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={i < value ? "ri-star-fill" : "ri-star-line opacity-40"} aria-hidden="true"></i>
      ))}
    </span>
  );
}

/**
 * Displays the business's own website testimonials, kept clearly separate from
 * the Google-sourced reviews shown further down the page. Includes a direct
 * link for customers to leave their own Google review.
 */
export default function CustomerTestimonials() {
  const { t } = useTranslation();
  const { items, loading } = useTestimonials();
  const { ref, isVisible } = useScrollReveal();

  const ordered = [...items.filter((i) => i.rating >= 4), ...items.filter((i) => i.rating < 4)].slice(0, 6);

  return (
    <section className="bg-background-50 py-14 md:py-24 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-primary-500"></span>
            {t("testimonials.own_label")}
            <span className="w-8 h-px bg-primary-500"></span>
          </p>
          <h2 className="mt-4 font-heading text-4xl md:text-5xl text-foreground-950 leading-tight">
            {t("testimonials.own_heading")}{" "}
            <span className="italic text-accent-500">{t("testimonials.own_heading_italic")}</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-foreground-600 leading-relaxed">
            {t("testimonials.own_subtitle")}
          </p>
        </div>

        <p className="mb-10 flex items-center justify-center gap-2 text-xs text-foreground-500">
          <i className="ri-chat-quote-line text-accent-500" aria-hidden="true"></i>
          {t("testimonials.own_note")}
        </p>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-2xl"></div>
            ))}
          </div>
        )}

        {!loading && ordered.length === 0 && (
          <p className="text-center text-sm text-foreground-600">{t("testimonials.own_empty")}</p>
        )}

        {!loading && ordered.length > 0 && (
          <div ref={ref} className={`reveal-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 ${isVisible ? "is-visible" : ""}`}>
            {ordered.map((r) => (
              <figure key={r.id} className="rounded-2xl bg-background-100/70 border border-background-200/70 p-5 md:p-6 flex flex-col h-full">
                <Stars value={r.rating} />
                <blockquote className="mt-4 text-sm md:text-base text-foreground-800 leading-relaxed flex-1">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="w-11 h-11 rounded-full overflow-hidden bg-accent-500 text-background-950 flex items-center justify-center font-heading text-lg shrink-0">
                    {r.imageUrl ? (
                      <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                    ) : (
                      r.name.charAt(0).toUpperCase()
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-foreground-950 truncate">{r.name}</span>
                    {r.date && <span className="block text-xs text-foreground-500">{r.date}</span>}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-col items-center gap-2">
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pulse inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-500 text-foreground-50 text-sm font-semibold hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-star-smile-line" aria-hidden="true"></i>
            {t("testimonials.leave_review")}
          </a>
          <p className="text-xs text-foreground-500">{t("testimonials.leave_review_note")}</p>
        </div>
      </div>
    </section>
  );
}
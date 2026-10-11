import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTestimonials, type PublicTestimonial } from "@/hooks/useTestimonials";

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

function TestimonialCard({ review, className = "" }: { review: PublicTestimonial; className?: string }) {
  return (
    <figure className={`rounded-2xl bg-background-100/70 border border-background-200/70 p-5 md:p-6 flex flex-col ${className}`}>
      <Stars value={review.rating} />
      <blockquote className="mt-4 text-sm md:text-base text-foreground-800 leading-relaxed flex-1">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="w-11 h-11 rounded-full overflow-hidden bg-accent-500 text-background-950 flex items-center justify-center font-heading text-lg shrink-0">
          {review.imageUrl ? (
            <img src={review.imageUrl} alt={review.name} className="w-full h-full object-cover" />
          ) : (
            review.name.charAt(0).toUpperCase()
          )}
        </span>
        <span className="min-w-0">
          <span className="block font-semibold text-foreground-950 truncate">{review.name}</span>
          {review.date && <span className="block text-xs text-foreground-500">{review.date}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

const CARD_WIDTH = "shrink-0 w-[280px] sm:w-[330px] lg:w-[360px] mr-5";

/** Tracks the visitor's reduced-motion preference so we can render a static grid. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

/**
 * Displays the business's own website testimonials in a continuously scrolling
 * marquee. The movement pauses on hover/focus and via the Pause button, is
 * disabled entirely for reduced-motion visitors (who get a static grid), and
 * the duplicated track is hidden from assistive tech.
 */
export default function CustomerTestimonials() {
  const { t } = useTranslation();
  const { items, loading } = useTestimonials();
  const prefersReduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);

  const ordered = [...items.filter((i) => i.rating >= 4), ...items.filter((i) => i.rating < 4)].slice(0, 6);
  // Repeat the set so a single track is wider than any viewport (no gaps on
  // ultra-wide screens) and the -50% loop stays perfectly seamless.
  const loopItems = ordered.length ? [...ordered, ...ordered] : [];
  const duration = Math.max(26, loopItems.length * 4);

  return (
    <section className="bg-background-50 py-14 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
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

        <p className="mb-10 flex items-center justify-center gap-2 text-xs text-foreground-500 text-center">
          <i className="ri-chat-quote-line text-accent-500" aria-hidden="true"></i>
          {t("testimonials.own_note")}
        </p>
      </div>

      {loading && (
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[280px] sm:w-[330px] lg:w-[360px] skeleton h-48 rounded-2xl"></div>
            ))}
          </div>
        </div>
      )}

      {!loading && ordered.length === 0 && (
        <p className="text-center text-sm text-foreground-600">{t("testimonials.own_empty")}</p>
      )}

      {/* Reduced-motion visitors get a calm, static grid instead of movement. */}
      {!loading && ordered.length > 0 && prefersReduced && (
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {ordered.map((r) => (
              <TestimonialCard key={r.id} review={r} className="w-full" />
            ))}
          </div>
        </div>
      )}

      {/* Continuously scrolling marquee */}
      {!loading && ordered.length > 0 && !prefersReduced && (
        <div
          className="ct-marquee-viewport"
          role="region"
          aria-label="Customer testimonials"
        >
          <div
            className={`ct-marquee ${paused ? "is-paused" : ""}`}
            style={{ animationDuration: `${duration}s` }}
          >
            {[0, 1].map((copy) => (
              <div className="ct-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
                {loopItems.map((r, i) => (
                  <TestimonialCard key={`${copy}-${i}`} review={r} className={CARD_WIDTH} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        {!loading && ordered.length > 0 && !prefersReduced && (
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              className="inline-flex items-center gap-2 rounded-full border border-background-200/70 bg-background-100 px-4 py-2 text-xs font-semibold text-foreground-800 hover:border-primary-300 transition-colors cursor-pointer"
            >
              <i className={paused ? "ri-play-fill" : "ri-pause-fill"} aria-hidden="true"></i>
              {paused ? t("testimonials.marquee_play") : t("testimonials.marquee_pause")}
            </button>
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

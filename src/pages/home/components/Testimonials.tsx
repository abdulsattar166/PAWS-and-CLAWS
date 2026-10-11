import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface DisplayReview {
  authorName: string;
  authorPhoto: string;
  authorUrl: string;
  rating: number;
  text: string;
  relativeTime: string;
}

function AuthorAvatar({ review, size = "lg" }: { review: DisplayReview; size?: "lg" | "md" }) {
  const [failed, setFailed] = useState(false);
  const initial = (review.authorName || "G").charAt(0).toUpperCase();
  const cls =
    size === "lg"
      ? "w-14 h-14 font-heading text-xl"
      : "w-11 h-11 font-heading text-base";

  // Google profile photo — falls back to an initial if the image can't load.
  if (review.authorPhoto && !failed) {
    return (
      <img
        src={review.authorPhoto}
        alt={review.authorName}
        onError={() => setFailed(true)}
        className={`${cls} rounded-full object-cover border-2 border-accent-500/40`}
      />
    );
  }

  return (
    <span className={`${cls} rounded-full bg-accent-500 text-background-950 flex items-center justify-center`}>
      {initial}
    </span>
  );
}

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-accent-500 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={i < value ? "ri-star-fill" : "ri-star-line opacity-40"} aria-hidden="true"></i>
      ))}
    </span>
  );
}

function DemoBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-accent-500/40 bg-accent-500/15 text-[11px] font-semibold text-accent-200 whitespace-nowrap">
      <i className="ri-flask-line" aria-hidden="true"></i>
      {label}
    </span>
  );
}

/**
 * The Google reviews section. Genuine reviews for the official Google Business
 * Profile are shown first. Until the live integration is switched on, clearly
 * labelled demo/sample entries are shown so the layout can be previewed — these
 * are removed from the Admin Panel and ignored automatically once real reviews
 * arrive. A "Review Us on Google" button lets visitors leave their own review.
 */
export default function Testimonials() {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
  const cfg = settings.googleReviews;

  const { status, reviews, mapsUri, reload } = useGoogleReviews({
    placeId: cfg.placeId,
    query: cfg.placeId ? "" : "Paws and Claws Pets Grooming Salon Abu Dhabi UAE",
    enabled: cfg.enabled,
  });

  const [active, setActive] = useState(0);

  // The whole section can be switched off from the Admin Panel.
  if (!cfg.enabled) return null;

  const liveReady = status === "ready" && reviews.length > 0;
  const liveList: DisplayReview[] = reviews.slice(0, cfg.maxCount).map((r) => ({
    authorName: r.authorName,
    authorPhoto: r.authorPhoto,
    authorUrl: r.authorUrl,
    rating: r.rating,
    text: r.text,
    relativeTime: r.relativeTime,
  }));
  const demoList: DisplayReview[] = cfg.demoReviews.slice(0, cfg.maxCount).map((d) => ({
    authorName: d.authorName,
    authorPhoto: "",
    authorUrl: "",
    rating: d.rating,
    text: d.text,
    relativeTime: d.relativeTime,
  }));

  const showingDemo = !liveReady && cfg.showDemo && demoList.length > 0;
  const list = liveReady ? liveList : demoList;
  const safeIndex = Math.min(active, Math.max(list.length - 1, 0));
  const current = list[safeIndex];
  const isPlaceholder = !liveReady && !showingDemo && status !== "loading";
  const reviewUrl = cfg.profileUrl || cfg.mapsUrl || mapsUri;

  return (
    <section id="reviews" className="bg-background-950 py-14 md:py-24 px-4 md:px-10 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary-700/40 pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-accent-500/10 pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-accent-400"></span>
          {t("testimonials.label")}
          <span className="w-8 h-px bg-accent-400"></span>
        </p>
        <p className="mt-3 text-xs text-foreground-600 flex items-center justify-center gap-2">
          <i className="ri-google-fill text-accent-500" aria-hidden="true"></i>
          {t("testimonials.google_source")}
        </p>

        {showingDemo && (
          <div className="mt-6 mx-auto max-w-2xl rounded-xl border border-accent-500/40 bg-accent-500/10 px-4 py-3 text-left flex items-start gap-2.5">
            <i className="ri-information-line text-accent-300 text-base mt-0.5" aria-hidden="true"></i>
            <p className="text-xs md:text-sm text-accent-100 leading-relaxed">{t("testimonials.demo_banner")}</p>
          </div>
        )}

        {status === "loading" && !showingDemo && (
          <div className="mt-16 flex flex-col items-center gap-4">
            <span className="w-10 h-10 rounded-full border-2 border-accent-500/25 border-t-accent-500 animate-spin"></span>
            <p className="text-sm text-foreground-600">{t("testimonials.loading")}</p>
          </div>
        )}

        {/* Carousel layout — one large review at a time */}
        {list.length > 0 && cfg.layout === "carousel" && current && (
          <>
            <div className="mt-10 flex items-center justify-center gap-1 text-accent-500">
              {Array.from({ length: Math.max(current.rating, 0) }).map((_, i) => (
                <i key={i} className="ri-star-fill text-2xl" aria-hidden="true"></i>
              ))}
            </div>

            <blockquote className="mt-8 font-heading text-xl md:text-4xl leading-snug text-foreground-950 italic transition-all duration-500 testimonial-quote">
              &ldquo;{current.text}&rdquo;
            </blockquote>

            <div className="mt-10 flex flex-col items-center gap-2">
              <AuthorAvatar review={current} />
              <p className="mt-2 font-semibold text-foreground-950">{current.authorName}</p>
              <p className="text-sm text-foreground-600 flex items-center justify-center gap-1.5 flex-wrap">
                <i className="ri-google-fill text-accent-500" aria-hidden="true"></i>
                {t("testimonials.posted_on")}
                {current.relativeTime ? <span>· {current.relativeTime}</span> : null}
              </p>
              {showingDemo && <DemoBadge label={t("testimonials.demo_badge")} />}
            </div>

            {list.length > 1 && (
              <div className="mt-10 flex items-center justify-center gap-1">
                {list.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActive(idx)}
                    aria-label={`View review ${idx + 1}`}
                    aria-current={idx === safeIndex}
                    className="group flex h-10 w-10 items-center justify-center cursor-pointer"
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        idx === safeIndex ? "w-8 h-2 bg-primary-400" : "w-2.5 h-2.5 bg-background-300 group-hover:bg-background-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Grid layout — several review cards at once */}
        {list.length > 0 && cfg.layout === "grid" && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 text-left">
            {list.map((r, i) => (
              <figure
                key={i}
                className="rounded-2xl bg-background-900/70 border border-background-800 p-5 md:p-6 flex flex-col h-full"
              >
                <Stars value={r.rating} />
                <blockquote className="mt-3 text-sm text-foreground-900 leading-relaxed flex-1">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <AuthorAvatar review={r} size="md" />
                  <span className="min-w-0">
                    <span className="block font-semibold text-foreground-950 truncate">{r.authorName}</span>
                    <span className="block text-xs text-foreground-500">{r.relativeTime}</span>
                  </span>
                </figcaption>
                {showingDemo && <div className="mt-3"><DemoBadge label={t("testimonials.demo_badge")} /></div>}
              </figure>
            ))}
          </div>
        )}

        {isPlaceholder && (
          <div className="mt-12 flex flex-col items-center">
            <span className="w-14 h-14 rounded-full bg-accent-500/15 border border-accent-500/25 flex items-center justify-center">
              <i
                className={`${status === "empty" ? "ri-chat-smile-2-line" : "ri-google-fill"} text-2xl text-accent-500`}
                aria-hidden="true"
              ></i>
            </span>
            <p className="mt-5 max-w-md text-sm md:text-base text-foreground-600 leading-relaxed">
              {t(`testimonials.${status}`)}
            </p>
            {status === "error" && (
              <button
                type="button"
                onClick={reload}
                className="btn-pulse mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500 text-foreground-50 text-sm font-semibold hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-refresh-line" aria-hidden="true"></i>
                {t("testimonials.retry")}
              </button>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-col items-center gap-3">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pulse inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-500 text-background-950 text-sm font-semibold hover:bg-accent-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-google-fill" aria-hidden="true"></i>
            {t("testimonials.review_us")}
          </a>
          {(cfg.mapsUrl || mapsUri) && (
            <a
              href={cfg.mapsUrl || mapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent-300 hover:text-accent-200 underline underline-offset-4 cursor-pointer"
            >
              {t("testimonials.view_all")}
            </a>
          )}
          <p className="text-xs text-foreground-500 flex items-center gap-1.5">
            <i className="ri-shield-check-line" aria-hidden="true"></i>
            {t("testimonials.powered")}
          </p>
        </div>
      </div>
    </section>
  );
}
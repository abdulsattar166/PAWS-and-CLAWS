import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useParallax } from "@/hooks/useParallax";
import { usePageContent } from "@/hooks/usePageContent";

function CtaLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

const defaultHeroSlides = [
  {
    src: "https://readdy.ai/api/search-image?query=adorable%20fluffy%20golden%20retriever%20puppy%20sitting%20happily%20inside%20a%20modern%20mobile%20pet%20grooming%20van%20with%20warm%20natural%20lighting%2C%20professional%20grooming%20tools%20visible%2C%20clean%20bright%20interior%2C%20editorial%20pet%20photography%20with%20rich%20purple%20and%20champagne%20gold%20tones%2C%20premium%20lifestyle%20aesthetic&width=1800&height=1200&seq=pc-hero-slide-01&orientation=landscape&nocache=true",
    alt: "Golden retriever in mobile grooming van",
  },
  {
    src: "https://readdy.ai/api/search-image?query=beautiful%20fluffy%20persian%20cat%20being%20gently%20brushed%20by%20a%20professional%20groomer%2C%20calm%20serene%20expression%2C%20soft%20studio%20lighting%20with%20deep%20purple%20and%20warm%20gold%20tones%2C%20editorial%20pet%20photography%2C%20luxurious%20grooming%20aesthetic%2C%20clean%20minimal%20composition&width=1800&height=1200&seq=pc-hero-slide-02&orientation=landscape&nocache=true",
    alt: "Persian cat being groomed",
  },
  {
    src: "https://readdy.ai/api/search-image?query=happy%20freshly%20groomed%20white%20poodle%20with%20stylish%20haircut%20and%20golden%20bandana%20sitting%20proudly%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20champagne%20gold%20accents%2C%20professional%20pet%20portrait%20photography%2C%20premium%20grooming%20result%2C%20clean%20modern%20aesthetic&width=1800&height=1200&seq=pc-hero-slide-03&orientation=landscape&nocache=true",
    alt: "Freshly groomed poodle with bandana",
  },
  {
    src: "https://readdy.ai/api/search-image?query=fluffy%20husky%20dog%20smiling%20with%20bright%20eyes%20after%20a%20professional%20grooming%20session%2C%20deep%20purple%20and%20warm%20gold%20colored%20background%2C%20editorial%20pet%20photography%20with%20natural%20soft%20light%2C%20clean%20minimal%20composition%2C%20premium%20dog%20grooming%20aesthetic&width=1800&height=1200&seq=pc-hero-slide-04&orientation=landscape&nocache=true",
    alt: "Happy husky after grooming",
  },
  {
    src: "https://readdy.ai/api/search-image?query=cute%20small%20maltese%20and%20shih%20tzu%20dogs%20sitting%20together%20looking%20adorable%20after%20grooming%2C%20deep%20royal%20purple%20and%20gold%20studio%20background%2C%20soft%20natural%20window%20light%2C%20editorial%20pet%20photography%2C%20premium%20salon%20aesthetic%2C%20clean%20joyful%20composition&width=1800&height=1200&seq=pc-hero-slide-05&orientation=landscape&nocache=true",
    alt: "Maltese and shih tzu after grooming",
  },
];

const featureHighlights = [
  { icon: "ri-bank-line", label: "Financial License" },
  { icon: "ri-shield-check-line", label: "Insurance" },
  { icon: "ri-award-line", label: "Certificate" },
  { icon: "ri-user-heart-line", label: "Pet & Groomers" },
  { icon: "ri-home-heart-line", label: "No Cages" },
  { icon: "ri-emotion-happy-line", label: "No Collars" },
  { icon: "ri-truck-line", label: "Fully Equipped Mobile Van" },
];

export default function Hero() {
  const { t } = useTranslation();
  const { content } = usePageContent("home");
  const videoRef = useParallax<HTMLVideoElement>(0.06);

  // Editable copy — falls back to the built-in translations when untouched.
  const badge = content.heroBadge || t("hero.badge");
  const title1 = content.heroTitle1 || t("hero.title_line1");
  const title2 = content.heroTitle2 || t("hero.title_line2");
  const subtitle = content.heroSubtitle || t("hero.subtitle");
  const ctaBook = content.ctaBook || t("hero.cta_book");
  const ctaExplore = content.ctaExplore || t("hero.cta_explore");
  const ctaBookHref = content.ctaBookHref || "/booking";
  const ctaExploreHref = content.ctaExploreHref || "/services";
  const configuredSlides = (content.heroSlides ?? [])
    .filter((s) => s.image)
    .map((s) => ({ src: s.image, alt: s.alt }));
  const heroSlides = configuredSlides.length ? configuredSlides : defaultHeroSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 800);
    },
    [isTransitioning, currentSlide]
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % heroSlides.length);
  }, [currentSlide, goToSlide, heroSlides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    const t1 = setTimeout(() => setCardsVisible(true), 150);
    const t2 = setTimeout(() => setFeaturesVisible(true), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section id="top" className="relative min-h-[85vh] md:min-h-screen w-full overflow-hidden ios-full-height">
      {/* Cinematic background video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="parallax-video absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://storage.helloreaddy.io/project_files/8febc86b-4e1f-4ee6-b298-e6d30aff21a5/14fcd074-611a-4785-83ef-a36f960415ea_14535129_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        {/* Brand colour grade to unite the film with the purple + gold identity */}
        <div className="absolute inset-0 bg-primary-500/45 mix-blend-color pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary-900/55 via-transparent to-secondary-900/45 mix-blend-multiply pointer-events-none"></div>
        {/* Cinematic darkening for crisp text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-background-950/72 via-background-950/46 to-background-950/78 pointer-events-none"></div>
        {/* Blend into the page canvas at the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background-50/90 to-transparent pointer-events-none"></div>
        {/* Slow moving light sheen for a premium cinematic feel */}
        <div className="absolute inset-0 animated-gradient bg-gradient-to-tr from-primary-500/10 via-transparent to-secondary-500/14 pointer-events-none"></div>
      </div>

      {/* Decorative est date */}
      <div className="absolute top-20 left-4 md:left-16 hidden lg:flex items-center gap-2 text-foreground-900/70 text-xs uppercase tracking-[0.28em] z-20">
        <span className="w-8 h-px bg-foreground-900/50"></span>
        Est. 2021 · Abu Dhabi
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 md:px-10 pt-20 md:pt-28 pb-10 md:pb-16">
        <div className="w-full max-w-7xl mx-auto">

          {/* ── Two-Card Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-stretch">

            {/* Left Card: Text Content */}
            <div
              className={`transition-all duration-[900ms] ease-out ${
                cardsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="relative h-full bg-background-100/60 border border-foreground-800/15 rounded-2xl md:rounded-3xl p-5 md:p-8 lg:p-10 overflow-hidden">
                {/* Subtle inner glow */}
                <div className="absolute -top-20 -left-20 w-56 h-56 bg-primary-500/8 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-accent-500/6 rounded-full blur-3xl pointer-events-none"></div>

                {/* Badge */}
                <span className="relative inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-foreground-950/10 border border-foreground-800/25 text-foreground-900 text-[11px] md:text-xs font-medium uppercase tracking-[0.2em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse"></span>
                  {badge}
                </span>

                {/* Headline */}
                <h1 className="relative mt-4 md:mt-5 font-heading text-foreground-950 text-[1.65rem] sm:text-3xl md:text-4xl lg:text-[46px] leading-[1.08] tracking-tight">
                  {title1}
                  <br />
                  <span className="italic text-accent-600">{title2}</span>
                </h1>

                {/* Description */}
                <p className="relative mt-3 md:mt-4 text-sm md:text-base text-foreground-800/90 leading-relaxed max-w-lg">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Right Card: Image Slideshow */}
            <div
              className={`transition-all duration-[900ms] delay-200 ease-out ${
                cardsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="relative h-full bg-background-100/50 backdrop-blur-md border border-foreground-800/12 rounded-2xl md:rounded-3xl p-3 md:p-4 overflow-hidden">
                {/* Slideshow container */}
                <div className="relative aspect-[4/3] lg:aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden">
                  {heroSlides.map((slide, idx) => (
                    <div
                      key={idx}
                      className="absolute inset-0 transition-all duration-[800ms] ease-in-out"
                      style={{
                        opacity: idx === currentSlide ? 1 : 0,
                        transform: `scale(${idx === currentSlide ? 1 : 1.04})`,
                        zIndex: idx === currentSlide ? 1 : 0,
                      }}
                    >
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {/* Slide info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background-50/80 via-background-50/30 to-transparent p-3 md:p-4 z-10">
                    <p className="text-foreground-950 text-xs md:text-sm font-medium">
                      {heroSlides[currentSlide]?.alt ?? ""}
                    </p>
                  </div>
                </div>

                {/* Slide dots */}
                <div className="flex items-center justify-center gap-2 mt-3 md:mt-4">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`transition-all duration-[400ms] rounded-full cursor-pointer ${
                        idx === currentSlide
                          ? "w-6 h-2 bg-accent-400"
                          : "w-2 h-2 bg-foreground-800/40 hover:bg-foreground-800/70"
                      }`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ── CTA Buttons (below cards) ── */}
          <div
            className={`mt-8 md:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 transition-all duration-[700ms] ease-out ${
              featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <CtaLink
              href={ctaBookHref}
              className="btn-pulse sheen w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-foreground-50 px-7 md:px-9 py-3 md:py-3.5 rounded-full text-sm md:text-base font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-calendar-check-line" aria-hidden="true"></i>
              {ctaBook}
            </CtaLink>
            <CtaLink
              href={ctaExploreHref}
              className="btn-pulse sheen w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-foreground-800/40 hover:bg-foreground-950/8 text-foreground-950 px-7 md:px-9 py-3 md:py-3.5 rounded-full text-sm md:text-base font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              {ctaExplore}
              <i className="ri-arrow-right-line arrow-nudge" aria-hidden="true"></i>
            </CtaLink>
          </div>

          {/* ── Feature Highlights (below buttons) ── */}
          <div
            className={`mt-7 md:mt-9 flex flex-wrap items-center justify-center gap-2 md:gap-3 transition-all duration-[700ms] delay-100 ease-out ${
              featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {featureHighlights.map((item, idx) => (
              <span
                key={item.label}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-foreground-950/10 border border-foreground-800/20 text-foreground-900 text-[11px] md:text-xs font-medium whitespace-nowrap cursor-default transition-all duration-300 hover:bg-foreground-950/18 hover:border-foreground-800/40 hover:scale-105"
              >
                <span className="w-5 h-5 md:w-5 md:h-5 rounded-full bg-primary-500/15 flex items-center justify-center text-accent-500 text-[10px] md:text-xs transition-transform duration-300 group-hover:scale-110">
                  <i className={item.icon} aria-hidden="true"></i>
                </span>
                {item.label}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-10 hidden md:flex items-center gap-2.5 text-foreground-800/50 text-xs uppercase tracking-[0.28em] animate-float-paw z-20">
        <i className="ri-footprint-line text-xl" aria-hidden="true"></i>
        Scroll to explore
      </div>
    </section>
  );
}
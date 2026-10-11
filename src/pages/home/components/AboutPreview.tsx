import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { usePageContent } from "@/hooks/usePageContent";

const STAT_ICONS = ["ri-calendar-line", "ri-heart-pulse-line", "ri-star-fill", "ri-footprint-line"];
const STAT_COLORS = [
  "bg-primary-500/15 text-accent-500 border-primary-400/20",
  "bg-accent-500/15 text-accent-600 border-accent-400/20",
  "bg-secondary-500/15 text-secondary-600 border-secondary-400/20",
  "bg-primary-500/15 text-accent-500 border-primary-400/20",
];

export default function AboutPreview() {
  const { t } = useTranslation();
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal();
  const { content } = usePageContent("home");

  const heading = content.aboutHeading || t("about.heading");
  const headingItalic = content.aboutHeadingItalic || t("about.heading_italic");
  const para1 = content.aboutP1 || t("about.paragraph1");
  const para2 = content.aboutP2 || t("about.paragraph2");
  const aboutImage =
    content.aboutImage ||
    "https://readdy.ai/api/search-image?query=professional%20pet%20groomer%20in%20deep%20purple%20apron%20gently%20brushing%20a%20happy%20golden%20retriever%20inside%20a%20bright%20clean%20mobile%20grooming%20van%20with%20modern%20equipment%2C%20warm%20natural%20daylight%20streaming%20through%20windows%2C%20editorial%20photography%20with%20deep%20purple%20tones%20and%20warm%20gold%20accents%2C%20high%20detail&width=800&height=1000&seq=pc-about-preview-01&orientation=portrait";
  const statItems = content.stats?.length
    ? content.stats.map((s, i) => ({ value: s.value, label: s.label, icon: STAT_ICONS[i % 4], color: STAT_COLORS[i % 4] }))
    : [
        { value: "5+", label: t("about.stat_years"), icon: STAT_ICONS[0], color: STAT_COLORS[0] },
        { value: "500+", label: t("about.stat_pets"), icon: STAT_ICONS[1], color: STAT_COLORS[1] },
        { value: "4.9", label: t("about.stat_rating"), icon: STAT_ICONS[2], color: STAT_COLORS[2] },
        { value: "40+", label: t("about.stat_breeds"), icon: STAT_ICONS[3], color: STAT_COLORS[3] },
      ];

  return (
    <section className="relative py-14 md:py-20 px-4 md:px-10 bg-background-50/92 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full bg-primary-400/8 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-[350px] h-[350px] rounded-full bg-accent-400/6 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left - Image with decorative frame */}
          <div className="lg:w-[42%] relative">
            <div className="relative z-10 max-w-md mx-auto lg:max-w-none">
              <img
                src={aboutImage}
                alt="Professional mobile pet grooming"
                className="w-full h-auto rounded-2xl relative z-10"
              />
            </div>
            {/* Decorative offset shape behind image */}
            <div className="absolute -bottom-5 -left-5 w-full h-full rounded-2xl bg-primary-500/12 border border-primary-400/20 z-0 hidden lg:block"></div>
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 z-20 animate-float-paw">
              <div className="w-14 h-14 md:w-[68px] md:h-[68px] rounded-xl bg-accent-500 flex items-center justify-center">
                <div className="text-center">
                  <span className="block font-heading text-lg md:text-xl text-background-950 leading-none">5+</span>
                  <span className="block text-[8px] md:text-[9px] text-background-800 uppercase tracking-wider leading-tight mt-0.5">Years of<br/>Trust</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="lg:w-[58%]">
            <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center gap-3">
              <span className="w-8 h-px bg-primary-500"></span>
              {t("about.label")}
            </p>
            <h2 className="mt-3 font-heading text-3xl md:text-4xl lg:text-[42px] text-foreground-950 leading-tight">
              {heading}{" "}
              <span className="italic text-accent-500">{headingItalic}</span>
            </h2>
            <p className="mt-4 text-foreground-700 leading-relaxed text-sm md:text-base">
              {para1}
            </p>
            <p className="mt-3 text-foreground-700 leading-relaxed text-sm md:text-base">
              {para2}
            </p>

            {/* Stats grid with animations */}
            <div ref={statsRef} className={`mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 ${statsVisible ? 'reveal-stagger is-visible' : 'reveal-stagger'}`}>
              {statItems.map((stat) => (
                <div
                  key={stat.label}
                  className="group card-lift rounded-xl p-4 md:p-5 border border-background-200/50 hover:border-primary-400/30 transition-all duration-400 bg-background-100/60"
                >
                  <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color} border`}>
                    <i className={`${stat.icon} text-base`} aria-hidden="true"></i>
                  </span>
                  <p className="mt-2.5 font-heading text-2xl md:text-3xl text-foreground-950 group-hover:text-accent-500 transition-colors">{stat.value}</p>
                  <p className="text-xs md:text-sm text-foreground-600 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent-500 hover:text-accent-600 cursor-pointer"
            >
              {t("about.cta")}
              <i className="ri-arrow-right-line arrow-nudge" aria-hidden="true"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
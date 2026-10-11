import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import PageTransition from "@/components/base/PageTransition";
import HeroCarousel from "@/components/feature/HeroCarousel";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import PriceList from "@/pages/services/components/PriceList";
import AddOnServices from "@/pages/services/components/AddOnServices";
import HaircutStyles from "@/pages/services/components/HaircutStyles";
import TimingGuide from "@/pages/services/components/TimingGuide";
import FirstTimeOffer from "@/components/feature/FirstTimeOffer";
import { useServicePrices, resolvePrice, formatAed } from "@/hooks/useServicePrices";
import { useCatalogServices } from "@/hooks/useCatalogServices";
import { usePackages } from "@/hooks/usePackages";
import { usePetCategories } from "@/hooks/usePetCategories";

const servicesSlides = [
  {
    image: "https://readdy.ai/api/search-image?query=beautiful%20fluffy%20golden%20retriever%20getting%20professionally%20groomed%20on%20a%20modern%20white%20grooming%20table%20inside%20a%20bright%20clean%20mobile%20salon%2C%20gentle%20hands%20brushing%20the%20coat%2C%20purple%20and%20gold%20light%20streaming%20through%20windows%2C%20professional%20pet%20care%20photography%2C%20calm%20atmosphere&width=1920&height=900&seq=svc-hero-slide-01&orientation=landscape&nocache=true",
    alt: "Professional dog grooming session",
  },
  {
    image: "https://readdy.ai/api/search-image?query=gorgeous%20fluffy%20persian%20cat%20being%20gently%20brushed%20by%20caring%20hands%20on%20a%20soft%20cream%20grooming%20table%2C%20calm%20peaceful%20expression%2C%20purple%20and%20gold%20studio%20lighting%2C%20professional%20feline%20grooming%20photography%2C%20elegant%20clean%20aesthetic&width=1920&height=900&seq=svc-hero-slide-02&orientation=landscape&nocache=true",
    alt: "Gentle cat grooming session",
  },
  {
    image: "https://readdy.ai/api/search-image?query=adorable%20small%20golden%20retriever%20puppy%20sitting%20happily%20on%20a%20soft%20white%20towel%20during%20its%20first%20gentle%20grooming%20experience%2C%20bright%20curious%20eyes%2C%20purple%20and%20gold%20lighting%2C%20clean%20modern%20grooming%20salon%20background%2C%20heartwarming%20pet%20photography&width=1920&height=900&seq=svc-hero-slide-03&orientation=landscape&nocache=true",
    alt: "Puppy's first grooming experience",
  },
];

const serviceImages: Record<string, string> = {
  "cat-basic": "https://readdy.ai/api/search-image?query=beautiful%20fluffy%20grey%20cat%20freshly%20shampooed%20with%20soft%20clean%20coat%20sitting%20calmly%20on%20a%20cream%20towel%2C%20deep%20purple%20studio%20background%2C%20professional%20pet%20photography%2C%20soft%20natural%20light&width=800&height=600&seq=svc-cat-basic-01&orientation=landscape",
  "dog-basic": "https://readdy.ai/api/search-image?query=happy%20small%20white%20dog%20freshly%20washed%20with%20clean%20soft%20coat%20sitting%20on%20cream%20blanket%2C%20deep%20purple%20studio%20background%2C%20professional%20pet%20photography&width=800&height=600&seq=svc-dog-basic-07&orientation=landscape",
  "cat-full": "https://readdy.ai/api/search-image?query=gorgeous%20persian%20cat%20with%20perfectly%20styled%20breed%20cut%20looking%20elegant%2C%20deep%20purple%20studio%20background%2C%20premium%20grooming%20portrait%2C%20soft%20window%20light&width=800&height=600&seq=svc-cat-full-02&orientation=landscape",
  "dog-full": "https://readdy.ai/api/search-image?query=beautiful%20golden%20retriever%20with%20perfect%20full%20groom%20and%20silky%20coat%20sitting%20proudly%2C%20deep%20purple%20studio%20background%2C%20warm%20natural%20light&width=800&height=600&seq=svc-dog-full-08&orientation=landscape",
  "cat-haircut": "https://readdy.ai/api/search-image?query=stylish%20cat%20with%20lion%20cut%20haircut%20and%20shaped%20coat%20posing%20proudly%2C%20deep%20purple%20studio%20background%2C%20editorial%20pet%20fashion%20photography&width=800&height=600&seq=svc-cat-haircut-06&orientation=landscape",
  "dog-haircut": "https://readdy.ai/api/search-image?query=stylish%20poodle%20with%20teddy%20bear%20haircut%20and%20fluffy%20rounded%20coat%2C%20deep%20purple%20studio%20background%2C%20editorial%20pet%20fashion%20photography&width=800&height=600&seq=svc-dog-haircut-12&orientation=landscape",
  "cat-deep": "https://readdy.ai/api/search-image?query=fluffy%20cat%20after%20deep%20grooming%20with%20shiny%20glossy%20coat%20and%20pampered%20paws%2C%20deep%20purple%20background%2C%20luxury%20pet%20spa%20photography&width=800&height=600&seq=svc-cat-deep-03&orientation=landscape",
  "dog-deep": "https://readdy.ai/api/search-image?query=fluffy%20husky%20after%20deep%20cleaning%20with%20gleaming%20brushed%20coat%2C%20deep%20royal%20purple%20background%2C%20editorial%20pet%20photography&width=800&height=600&seq=svc-dog-deep-09&orientation=landscape",
  "cat-trim": "https://readdy.ai/api/search-image?query=neatly%20trimmed%20grey%20cat%20with%20tidy%20coat%20sitting%20on%20wooden%20grooming%20table%2C%20deep%20purple%20studio%20background%2C%20clean%20editorial%20pet%20photography&width=800&height=600&seq=svc-cat-trim-04&orientation=landscape",
  "dog-trim": "https://readdy.ai/api/search-image?query=neatly%20trimmed%20bichon%20frise%20with%20tidy%20rounded%20coat%2C%20deep%20purple%20studio%20background%2C%20clean%20professional%20pet%20grooming%20photography&width=800&height=600&seq=svc-dog-trim-10&orientation=landscape",
  "cat-wash": "https://readdy.ai/api/search-image?query=cute%20cat%20being%20gently%20washed%20with%20soft%20bubbles%20in%20a%20warm%20bath%2C%20deep%20purple%20ambient%20background%2C%20professional%20pet%20grooming%20photography&width=800&height=600&seq=svc-cat-wash-05&orientation=landscape",
  "dog-wash": "https://readdy.ai/api/search-image?query=cute%20small%20dog%20enjoying%20a%20warm%20bubble%20bath%20in%20a%20grooming%20tub%2C%20deep%20purple%20ambient%20background%2C%20professional%20pet%20photography&width=800&height=600&seq=svc-dog-wash-11&orientation=landscape",
  "bird-full": "https://readdy.ai/api/search-image?query=colorful%20pet%20parrot%20with%20glossy%20healthy%20feathers%20after%20grooming%20perched%20calmly%2C%20deep%20purple%20studio%20background%2C%20professional%20pet%20photography&width=800&height=600&seq=svc-bird-full-13&orientation=landscape",
  "bunny-full": "https://readdy.ai/api/search-image?query=adorable%20fluffy%20white%20rabbit%20with%20soft%20clean%20fur%20sitting%20on%20cream%20cushion%2C%20deep%20purple%20studio%20background%2C%20gentle%20professional%20pet%20photography&width=800&height=600&seq=svc-bunny-full-14&orientation=landscape",
};

// Shown for services that have no dedicated artwork yet (e.g. added in the database).
const fallbackImageByCategory: Record<string, string> = {
  cats: "https://readdy.ai/api/search-image?query=fluffy%20grey%20cat%20freshly%20groomed%20sitting%20calmly%20on%20a%20cream%20towel%2C%20deep%20purple%20studio%20background%2C%20professional%20pet%20photography&width=800&height=600&seq=svc-fallback-cat&orientation=landscape",
  dogs: "https://readdy.ai/api/search-image?query=happy%20small%20white%20dog%20freshly%20washed%20with%20a%20clean%20soft%20coat%2C%20deep%20purple%20studio%20background%2C%20professional%20pet%20photography&width=800&height=600&seq=svc-fallback-dog&orientation=landscape",
  birds: "https://readdy.ai/api/search-image?query=colorful%20pet%20parrot%20with%20glossy%20healthy%20feathers%20after%20grooming%2C%20deep%20purple%20studio%20background%2C%20professional%20pet%20photography&width=800&height=600&seq=svc-fallback-bird&orientation=landscape",
  bunny: "https://readdy.ai/api/search-image?query=adorable%20fluffy%20white%20rabbit%20with%20soft%20clean%20fur%20on%20a%20cream%20cushion%2C%20deep%20purple%20studio%20background%2C%20gentle%20pet%20photography&width=800&height=600&seq=svc-fallback-bunny&orientation=landscape",
};

const toneClasses: Record<string, { iconBg: string; iconText: string }> = {
  primary: { iconBg: "bg-primary-500", iconText: "text-foreground-50" },
  accent: { iconBg: "bg-accent-500", iconText: "text-background-950" },
  secondary: { iconBg: "bg-secondary-500", iconText: "text-white" },
};

function RevealWrap({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`reveal-section ${isVisible ? 'is-visible' : ''}`}>
      {children}
    </div>
  );
}

export default function Services() {
  const { t } = useTranslation();
  const { prices } = useServicePrices();
  const { items: catalogServices } = useCatalogServices();
  const { items: livePackages } = usePackages();
  const { categories: petCats } = usePetCategories();
  const [activeCat, setActiveCat] = useState("all");
  const servicesGridRef = useScrollReveal();
  const packagesGridRef = useScrollReveal();

  const filtered = activeCat === "all" ? catalogServices : catalogServices.filter((s) => s.category === activeCat);

  return (
    <main className="min-h-screen bg-transparent text-foreground-950">
      <Navbar />
      <PageTransition>
        {/* Hero with carousel background */}
        <HeroCarousel slides={servicesSlides} interval={4500}>
          <div className="animate-text-reveal" style={{ animationDelay: "0.2s" }}>
            <p className="text-xs uppercase tracking-[0.28em] text-foreground-700 font-semibold flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-px bg-foreground-700"></span>
              SERVICES
            </p>
          </div>
          <h1 className="font-heading text-2xl md:text-5xl text-foreground-950 leading-tight animate-text-reveal" style={{ animationDelay: "0.35s" }}>
            {t("services_page.hero_title")}
          </h1>
          <p className="mt-6 text-foreground-900/90 text-lg leading-relaxed max-w-2xl mx-auto animate-text-reveal" style={{ animationDelay: "0.5s" }}>
            {t("services_page.hero_subtitle")}
          </p>
        </HeroCarousel>

        {/* Services Section */}
        <RevealWrap>
          <section className="relative py-14 md:py-20 px-4 md:px-10 bg-background-50/92">
            <div className="absolute top-10 right-6 text-accent-400/6 text-8xl pointer-events-none z-0 animate-float-paw">
              <i className="ri-footprint-line"></i>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
                  <span className="w-8 h-px bg-primary-500"></span>
                  {t("services.label")}
                </p>
                <h2 className="mt-4 font-heading text-3xl md:text-5xl text-foreground-950 leading-tight">
                  {t("services.heading")}{" "}
                  <span className="italic">{t("services.heading_italic")}</span>
                </h2>
                <p className="mt-4 text-foreground-700 leading-relaxed max-w-2xl mx-auto text-sm">
                  {t("services.subtitle")}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                {[{ id: "all", label: t("services_page.all_services") }, ...petCats.map((c) => ({ id: c.id, label: c.label }))].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCat(cat.id)}
                    className={`text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer ${
                      activeCat === cat.id
                        ? "bg-primary-500 text-foreground-50 scale-105"
                        : "bg-background-100 text-foreground-700 hover:bg-background-200/70 border border-background-200/70 hover:scale-105"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div ref={servicesGridRef.ref} className={`reveal-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ${servicesGridRef.isVisible ? 'is-visible' : ''}`}>
                {filtered.map((service) => {
                  const tc = toneClasses[service.tone] ?? toneClasses.primary;
                  const imgSrc = serviceImages[service.id] ?? fallbackImageByCategory[service.category] ?? serviceImages["dog-basic"];
                  return (
                    <article
                      key={service.id}
                      className="group card-lift rounded-2xl md:rounded-3xl bg-background-100 border border-background-200/70 overflow-hidden transition-colors hover:border-primary-400"
                    >
                      <div className="h-40 md:h-48 overflow-hidden">
                        <img
                          src={imgSrc}
                          alt={service.name}
                          className="img-zoom w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-4 md:p-6">
                        <div className="flex items-start justify-between gap-4">
                          <span className={`w-10 h-10 rounded-xl ${tc.iconBg} ${tc.iconText} flex items-center justify-center`}>
                            <i className={`${service.icon} text-lg icon-bounce`} aria-hidden="true"></i>
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full bg-background-200/70 text-background-950">
                            {service.duration}
                          </span>
                        </div>
                        <h3 className="mt-4 font-heading text-xl text-foreground-950 group-hover:text-accent-500 transition-colors">{service.name}</h3>
                        {service.tagline && <p className="mt-1 text-sm text-foreground-600 italic">{service.tagline}</p>}
                        <p className="mt-3 text-foreground-700 leading-relaxed text-sm">{service.description}</p>
                        {service.includes.length > 0 && (
                          <ul className="mt-4 space-y-2">
                            {service.includes.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-sm text-foreground-700">
                                <i className="ri-check-line text-accent-500 mt-0.5" aria-hidden="true"></i>
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="mt-6 pt-5 border-t border-background-200/70 flex items-center justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-foreground-500">{t("services.starting_from")}</p>
                            <p className="font-heading text-2xl text-foreground-950 mt-1">{resolvePrice(prices, service.id, service.price)}</p>
                          </div>
                          <Link
                            to="/booking"
                            className="btn-pulse w-11 h-11 rounded-full bg-primary-500 text-foreground-50 flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer"
                            aria-label={`Book ${service.name}`}
                          >
                            <i className="ri-arrow-right-up-line text-lg" aria-hidden="true"></i>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </RevealWrap>

        {/* Full price list */}
        <PriceList />

        {/* Medical, haircut & extra services */}
        <AddOnServices />

        {/* Detailed haircut styles (cat & dog) */}
        <HaircutStyles />

        {/* Timing guide */}
        <TimingGuide />

        {/* Packages Section */}
        <RevealWrap>
          <section className="relative py-14 md:py-20 px-4 md:px-10 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src="https://readdy.ai/api/search-image?query=soft%20elegant%20abstract%20flowing%20waves%20in%20deep%20purple%20and%20warm%20gold%20tones%20on%20dark%20violet%20background%2C%20premium%20luxury%20pattern%2C%20subtle%20organic%20curves%2C%20modern%20sophisticated%20aesthetic%2C%20dreamy%20low%20contrast%20decorative%20texture&width=1920&height=1080&seq=pc-pkg-bg-01&orientation=landscape&nocache=true"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-background-50/90"></div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary-400/8 blur-[120px] pointer-events-none z-0"></div>

            <div className="relative z-10 max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
                  <span className="w-8 h-px bg-primary-500"></span>
                  {t("pricing.label")}
                </p>
                <h2 className="mt-4 font-heading text-3xl md:text-5xl text-foreground-950 leading-tight">
                  {t("pricing.heading")}{" "}
                  <span className="italic">{t("pricing.heading_italic")}</span>
                </h2>
                <p className="mt-4 text-foreground-700 leading-relaxed max-w-2xl mx-auto text-sm">
                  Every package includes our mobile concierge experience — the van comes to you, your pet gets one-on-one attention, and you get a fresh, happy companion back in under 90 minutes.
                </p>
              </div>

              <div className="mb-8 flex justify-center">
                <FirstTimeOffer size="sm" />
              </div>

              <div ref={packagesGridRef.ref} className={`reveal-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ${packagesGridRef.isVisible ? 'is-visible' : ''}`}>
                {livePackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`card-lift relative rounded-2xl md:rounded-3xl p-5 md:p-8 border pricing-card-mobile ${
                      pkg.highlighted
                        ? "bg-secondary-600 border-secondary-600 text-foreground-950"
                        : "bg-background-100 border-background-200/70 text-foreground-950 hover:border-primary-400"
                    }`}
                  >
                    {pkg.highlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-accent-500 text-background-950 animate-pulse">
                        {t("pricing.popular")}
                      </span>
                    )}
                    <p className={`text-xs uppercase tracking-[0.2em] font-semibold ${pkg.highlighted ? "text-foreground-300" : "text-foreground-600"}`}>
                      {pkg.name}
                    </p>
                    <p className={`text-sm mt-2 ${pkg.highlighted ? "text-foreground-300" : "text-foreground-600"}`}>
                      {pkg.subtitle}
                    </p>
                    <p className="mt-6 font-heading text-4xl">
                      {pkg.originalPrice != null && (
                        <span className="line-through text-foreground-400 text-2xl mr-2">{formatAed(pkg.originalPrice)}</span>
                      )}
                      {formatAed(pkg.price)}
                    </p>
                    <p className={`text-xs mt-1 ${pkg.highlighted ? "text-foreground-300" : "text-foreground-500"}`}>{pkg.priceNote}</p>
                    <ul className="mt-6 space-y-3">
                      {pkg.features.map((f) => (
                        <li key={f} className={`flex items-start gap-2 text-sm ${pkg.highlighted ? "text-foreground-300" : "text-foreground-700"}`}>
                          <i className={`ri-check-line mt-0.5 ${pkg.highlighted ? "text-accent-400" : "text-accent-500"}`} aria-hidden="true"></i>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/booking"
                      className={`btn-pulse mt-7 block text-center text-sm font-semibold px-5 py-3 rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                        pkg.highlighted
                          ? "bg-accent-500 text-background-950 hover:bg-accent-400"
                          : "bg-primary-500 text-foreground-50 hover:bg-primary-600"
                      }`}
                    >
                      {t("pricing.cta")}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </RevealWrap>

        {/* CTA */}
        <section className="py-10 md:py-16 px-4 md:px-10 bg-background-100/88">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl text-foreground-950 leading-tight">
              {t("cta.heading")}{" "}
              <span className="italic">{t("cta.heading_italic")}</span>
            </h2>
            <p className="mt-4 text-foreground-700 leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <Link
              to="/booking"
              className="btn-pulse mt-6 inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-foreground-50 px-7 py-3.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-calendar-check-line" aria-hidden="true"></i>
              {t("cta.button")}
            </Link>
          </div>
        </section>
      </PageTransition>
      <Footer />
    </main>
  );
}
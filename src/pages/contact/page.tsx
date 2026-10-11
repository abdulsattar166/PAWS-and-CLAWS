import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import PageTransition from "@/components/base/PageTransition";
import HeroCarousel from "@/components/feature/HeroCarousel";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import ContactForm from "@/pages/contact/components/ContactForm";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { usePageContent } from "@/hooks/usePageContent";
import { SOCIAL_LINKS, BUSINESS } from "@/lib/businessConfig";

const contactSlides = [
  {
    image: "https://readdy.ai/api/search-image?query=warm%20inviting%20pet%20friendly%20modern%20living%20room%20with%20deep%20purple%20sofa%20and%20a%20happy%20golden%20retriever%20sitting%20nearby%2C%20natural%20daylight%20streaming%20through%20large%20windows%2C%20welcoming%20home%20atmosphere%2C%20editorial%20interior%20photography%2C%20cozy%20elegant%20aesthetic&width=1920&height=900&seq=ct-hero-slide-01&orientation=landscape&nocache=true",
    alt: "Warm pet-friendly living room",
  },
  {
    image: "https://readdy.ai/api/search-image?query=pristine%20white%20modern%20mobile%20pet%20grooming%20van%20parked%20beautifully%20outside%20an%20elegant%20dubai%20villa%20entrance%20with%20palm%20trees%20and%20landscaped%20garden%2C%20warm%20golden%20hour%20sunlight%2C%20professional%20clean%20aesthetic%2C%20middle%20eastern%20architecture%20with%20purple%20and%20gold%20dusk%20lighting&width=1920&height=900&seq=ct-hero-slide-02&orientation=landscape&nocache=true",
    alt: "Mobile grooming van at Abu Dhabi villa",
  },
  {
    image: "https://readdy.ai/api/search-image?query=heartwarming%20moment%20of%20a%20happy%20pet%20owner%20hugging%20their%20freshly%20groomed%20fluffy%20golden%20retriever%20in%20a%20sunlit%20garden%2C%20genuine%20joy%20and%20connection%2C%20purple%20and%20gold%20ambient%20lighting%2C%20lifestyle%20pet%20photography%2C%20emotional%20authentic%20moment&width=1920&height=900&seq=ct-hero-slide-03&orientation=landscape&nocache=true",
    alt: "Happy pet owner with freshly groomed dog",
  },
];

const socialLinks = [
  { icon: "ri-facebook-fill", label: "Facebook", delay: "0.1s", href: SOCIAL_LINKS.facebook, color: "hover:bg-[#1877F2] hover:text-white" },
  { icon: "ri-instagram-line", label: "Instagram", delay: "0.25s", href: SOCIAL_LINKS.instagram, color: "hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white" },
  { icon: "ri-tiktok-line", label: "TikTok", delay: "0.4s", href: SOCIAL_LINKS.tiktok, color: "hover:bg-[#000000] hover:text-white" },
  { icon: "ri-whatsapp-line", label: "WhatsApp", delay: "0.55s", href: `https://wa.me/${BUSINESS.whatsappNumber}`, color: "hover:bg-[#25D366] hover:text-white" },
  { icon: "ri-snapchat-line", label: "Snapchat", delay: "0.7s", href: SOCIAL_LINKS.snapchat, color: "hover:bg-[#FFFC00] hover:text-foreground-950" },
];

const ALL_SECTIONS = { hero: true, info: true, form: true, follow: true, map: true, bookCta: true };

function RevealWrap({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`reveal-section ${isVisible ? 'is-visible' : ''}`}>
      {children}
    </div>
  );
}

export default function Contact() {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
  const c = settings.contact;
  const { content } = usePageContent("contact");
  const s = { ...ALL_SECTIONS, ...(content.sections ?? {}) };

  const heroTitle = content.heroTitle || t("contact_page.hero_title");
  const heroSubtitle = content.heroSubtitle || t("contact_page.hero_subtitle");
  const heroSlides = content.heroSlides?.length ? content.heroSlides.filter((sl) => sl.image) : contactSlides;
  const infoTitle = content.infoTitle || t("contact_page.info_title");
  const formTitle = content.formTitle || t("contact_page.form_title");
  const mapTitle = content.mapTitle || t("contact_page.map_title");
  const DEFAULT_MAP_QUERY = "Abu Dhabi and Al Ain, United Arab Emirates";
  const mapQuery = content.mapQuery || DEFAULT_MAP_QUERY;
  // By default the map shows the whole service corridor with BOTH hubs pinned
  // (Abu Dhabi → Al Ain). A custom query set in the Admin Panel overrides it.
  const mapSrc =
    mapQuery === DEFAULT_MAP_QUERY
      ? `https://www.google.com/maps?saddr=${encodeURIComponent("Abu Dhabi, United Arab Emirates")}&daddr=${encodeURIComponent("Al Ain, United Arab Emirates")}&z=9&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=9&output=embed`;
  const followLabel = content.followLabel || t("contact_page.follow_us_title");
  const followTitle = content.followTitle || t("contact_page.follow_us_title");
  const followSubtitle = content.followSubtitle || t("contact_page.follow_us_subtitle");
  const serviceAreaTitle = content.serviceAreaTitle || "Areas we serve";
  const serviceAreaItems = content.serviceAreaItems?.length ? content.serviceAreaItems : [];
  const bookLabel = content.bookLabel || "Book now";
  const bookHeading = content.bookHeading || t("booking.heading");
  const bookSubtitle = content.bookSubtitle || t("booking.page_subtitle");
  const bookButton = content.bookButton || t("nav.book_now");
  const SOCIAL_DELAYS = ["0.1s", "0.25s", "0.4s", "0.55s", "0.7s"];
  const SOCIAL_COLORS = [
    "hover:bg-[#1877F2] hover:text-white",
    "hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white",
    "hover:bg-[#000000] hover:text-white",
    "hover:bg-[#25D366] hover:text-white",
    "hover:bg-[#FFFC00] hover:text-foreground-950",
  ];
  const socials = content.socials?.length
    ? content.socials.map((s2, i) => ({ ...s2, delay: SOCIAL_DELAYS[i % 5], color: SOCIAL_COLORS[i % 5] }))
    : socialLinks;

  const contactItems = [
    { icon: "ri-phone-line", bg: "bg-primary-500", text: "text-foreground-50", label: "Phone", value: c.phone, href: `tel:${c.phone.replace(/[^0-9+]/g, "")}` },
    { icon: "ri-whatsapp-line", bg: "bg-[#25D366]", text: "text-white", label: "WhatsApp", value: c.whatsapp, href: `https://wa.me/${c.whatsappNumber}` },
    { icon: "ri-mail-line", bg: "bg-accent-500", text: "text-background-950", label: "Email", value: c.email, href: `mailto:${c.email}` },
    { icon: "ri-map-pin-line", bg: "bg-secondary-500", text: "text-white", label: "Service Area", value: c.address, href: null },
    { icon: "ri-time-line", bg: "bg-background-200/70", text: "text-background-950", label: "Hours", value: c.hours, href: null },
  ];

  return (
    <main className="min-h-screen bg-transparent text-foreground-950">
      <Navbar />
      <PageTransition>
        {/* Hero with carousel background */}
        {s.hero && (
          <HeroCarousel slides={heroSlides} interval={4500}>
            <div className="animate-text-reveal" style={{ animationDelay: "0.2s" }}>
              <p className="text-xs uppercase tracking-[0.28em] text-foreground-700 font-semibold flex items-center justify-center gap-3 mb-4">
                <span className="w-8 h-px bg-foreground-700"></span>
                CONTACT
              </p>
            </div>
            <h1 className="font-heading text-2xl md:text-5xl text-foreground-950 leading-tight animate-text-reveal" style={{ animationDelay: "0.35s" }}>
              {heroTitle}
            </h1>
            <p className="mt-6 text-foreground-900/90 text-lg leading-relaxed max-w-2xl mx-auto animate-text-reveal" style={{ animationDelay: "0.5s" }}>
              {heroSubtitle}
            </p>
          </HeroCarousel>
        )}

        {/* Contact Info + Form */}
        {(s.info || s.form) && (
          <RevealWrap>
            <section className="py-14 md:py-20 px-4 md:px-10 bg-background-50/92">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                {s.info && (
                  <div>
                    <h2 className="font-heading text-3xl text-foreground-950">{infoTitle}</h2>
                    <div className="mt-8 space-y-6">
                      {contactItems.map((item) => (
                        <div key={item.value} className="flex items-start gap-4 card-lift">
                          <span className={`w-12 h-12 rounded-2xl ${item.bg} ${item.text} flex items-center justify-center shrink-0`}>
                            <i className={`${item.icon} text-xl`} aria-hidden="true"></i>
                          </span>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-foreground-500 font-semibold">{item.label}</p>
                            {item.href ? (
                              <a href={item.href} className="text-lg font-medium text-foreground-950 hover:text-accent-500 cursor-pointer transition-colors">{item.value}</a>
                            ) : (
                              <p className="text-lg font-medium text-foreground-950">{item.value}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {s.form && (
                  <div>
                    <h2 className="font-heading text-3xl text-foreground-950">{formTitle}</h2>
                    <ContactForm t={t} />
                  </div>
                )}
              </div>
            </section>
          </RevealWrap>
        )}

        {/* Follow Us Section */}
        {s.follow && (
          <section className="relative py-16 md:py-24 px-4 md:px-10 overflow-hidden">
            {/* Animated gradient background */}
            <div
              className="absolute inset-0 z-0"
              style={{
                background: "linear-gradient(135deg, oklch(0.40 0.14 295), oklch(0.55 0.19 295), oklch(0.30 0.10 295), oklch(0.48 0.16 295))",
                backgroundSize: "400% 400%",
                animation: "bgShimmer 8s ease infinite",
              }}
            ></div>

            {/* Decorative elements */}
            <div className="absolute top-8 left-10 text-accent-500/8 text-7xl pointer-events-none z-0 animate-gentle-float">
              <i className="ri-footprint-line"></i>
            </div>
            <div className="absolute bottom-8 right-10 text-accent-400/8 text-7xl pointer-events-none z-0 animate-gentle-float" style={{ animationDelay: "4s" }}>
              <i className="ri-heart-line"></i>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-400/6 blur-[120px] pointer-events-none z-0"></div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
              <RevealWrap>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-accent-300 font-semibold flex items-center justify-center gap-3 mb-4">
                    <span className="w-8 h-px bg-accent-400"></span>
                    {followLabel}
                  </p>
                  <h2 className="font-heading text-4xl md:text-6xl text-white leading-tight animate-text-reveal">
                    {followTitle}
                  </h2>
                  <p className="mt-4 text-white/80 leading-relaxed max-w-xl mx-auto text-base">
                    {followSubtitle}
                  </p>
                </div>
              </RevealWrap>

              {/* Social Icons */}
              <div className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-12">
                {socials.map((sc) => (
                  <div key={sc.label} className="flex flex-col items-center gap-2 md:gap-3">
                    <a
                      href={sc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={sc.label}
                      className={`social-pop-in animate-social-glow w-16 h-16 md:w-24 md:h-24 rounded-full bg-background-100 border-2 border-background-200/70 text-foreground-700 flex items-center justify-center transition-all duration-300 cursor-pointer social-icon-mobile ${sc.color}`}
                      style={{ animationDelay: sc.delay }}
                    >
                      <i className={`${sc.icon} text-2xl md:text-4xl`} aria-hidden="true"></i>
                    </a>
                    <span
                      className="social-pop-in text-sm font-medium text-white/90"
                      style={{ animationDelay: `${parseFloat(sc.delay) + 0.15}s` }}
                    >
                      {sc.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Map — centred, responsive service area (both hubs pinned) */}
        {s.map && (
          <RevealWrap>
            <section className="py-14 md:py-20 px-4 md:px-10 bg-background-100/88">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-heading text-3xl text-foreground-950 text-center mb-3">{mapTitle}</h2>
                <p className="text-sm md:text-base text-foreground-600 text-center max-w-2xl mx-auto mb-8">
                  We bring the mobile salon to homes across Abu Dhabi, Al Ain and the surrounding islands.
                </p>

                <div className="mx-auto w-full rounded-2xl md:rounded-3xl overflow-hidden border border-background-200/70 bg-background-50 card-lift">
                  <div className="relative w-full aspect-[5/4] sm:aspect-[16/10]">
                    <iframe
                      src={mapSrc}
                      className="absolute inset-0 w-full h-full"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Paws and Claws service area — Abu Dhabi & Al Ain"
                    ></iframe>
                  </div>
                </div>

                {/* Both service hubs are marked on the map */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-background-50 border border-background-200/70 px-4 py-2 text-sm font-medium text-foreground-800">
                    <i className="ri-map-pin-2-fill text-primary-500" aria-hidden="true"></i> Abu Dhabi
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-background-50 border border-background-200/70 px-4 py-2 text-sm font-medium text-foreground-800">
                    <i className="ri-map-pin-2-fill text-accent-500" aria-hidden="true"></i> Al Ain
                  </span>
                </div>

                {serviceAreaItems.length > 0 && (
                  <div className="mt-6 rounded-2xl md:rounded-3xl bg-background-50 border border-background-200/70 p-5 md:p-6">
                    <h3 className="font-heading text-lg text-foreground-950 text-center">{serviceAreaTitle}</h3>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {serviceAreaItems.map((area) => (
                        <span key={area} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-secondary-100 text-secondary-900">
                          <i className="ri-map-pin-line" aria-hidden="true"></i>
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </RevealWrap>
        )}

        {/* Book a groom CTA */}
        {s.bookCta && (
          <section className="py-14 md:py-20 px-4 md:px-10 bg-background-50/92">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
                <span className="w-8 h-px bg-primary-500"></span>
                {bookLabel}
              </p>
              <h2 className="mt-4 font-heading text-4xl md:text-5xl text-foreground-950 leading-tight">{bookHeading}</h2>
              <p className="mt-4 text-foreground-700 leading-relaxed max-w-2xl mx-auto">{bookSubtitle}</p>
              <Link
                to="/booking"
                className="btn-pulse mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary-500 text-foreground-50 font-semibold text-sm hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-calendar-check-line" aria-hidden="true"></i>
                {bookButton}
              </Link>
            </div>
          </section>
        )}
      </PageTransition>
      <Footer />
    </main>
  );
}
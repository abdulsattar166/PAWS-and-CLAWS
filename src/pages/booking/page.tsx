import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import PageTransition from "@/components/base/PageTransition";
import HeroCarousel from "@/components/feature/HeroCarousel";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import BookingForm from "@/pages/booking/components/BookingForm";
import PromoBanner from "@/components/feature/PromoBanner";

const bookingSlides = [
  {
    image: "https://readdy.ai/api/search-image?query=artistic%20illustration%20of%20a%20calm%20mobile%20pet%20grooming%20scene%20with%20a%20fluffy%20dog%20being%20gently%20brushed%2C%20soft%20warm%20gold%20and%20deep%20violet%20color%20palette%2C%20stylized%20paint%20textures%2C%20elegant%20editorial%20poster%20aesthetic%2C%20dreamy%20ambient%20lighting%2C%20uncluttered%20background&width=1920&height=900&seq=bk-hero-slide-01&orientation=landscape",
    alt: "Calm mobile pet grooming scene",
  },
  {
    image: "https://readdy.ai/api/search-image?query=stylized%20abstract%20illustration%20of%20a%20booking%20calendar%20and%20paw%20prints%20floating%20over%20a%20soft%20violet%20gradient%2C%20warm%20amber%20highlights%2C%20minimal%20modern%20graphic%20design%2C%20clean%20negative%20space%2C%20premium%20pet%20salon%20branding%20mood%2C%20artistic%20textured%20background&width=1920&height=900&seq=bk-hero-slide-02&orientation=landscape",
    alt: "Booking a mobile grooming appointment",
  },
];

const trustItems = [
  { icon: "ri-bank-line", title: "Simple bank transfer", text: "Transfer to our ADIB account and confirm on WhatsApp — no card needed." },
  { icon: "ri-whatsapp-line", title: "Instant WhatsApp proof", text: "Send your transfer screenshot in one tap and we verify it for you." },
  { icon: "ri-shield-star-line", title: "Trusted local groomers", text: "Certified, insured and cage-free care across Abu Dhabi & Al Ain." },
];

function RevealWrap({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`reveal-section ${isVisible ? "is-visible" : ""}`}>
      {children}
    </div>
  );
}

export default function Booking() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-transparent text-foreground-950">
      <Navbar />
      <PageTransition>
        {/* Hero */}
        <HeroCarousel slides={bookingSlides} interval={5000}>
          <div className="animate-text-reveal" style={{ animationDelay: "0.2s" }}>
            <p className="text-xs uppercase tracking-[0.28em] text-foreground-700 font-semibold flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-px bg-foreground-700"></span>
              BOOKING
            </p>
          </div>
          <h1 className="font-heading text-2xl md:text-5xl text-foreground-950 leading-tight animate-text-reveal" style={{ animationDelay: "0.35s" }}>
            {t("booking.heading")}
          </h1>
          <p className="mt-6 text-foreground-900/90 text-lg leading-relaxed max-w-2xl mx-auto animate-text-reveal" style={{ animationDelay: "0.5s" }}>
            {t("booking.page_subtitle")}
          </p>
        </HeroCarousel>

        {/* Booking form */}
        <RevealWrap>
          <section id="booking" className="py-14 md:py-20 px-4 md:px-10 bg-background-50/92">
            <div className="max-w-3xl mx-auto">
              <PromoBanner className="mb-8" />
              <div className="text-center mb-10">
                <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
                  <span className="w-8 h-px bg-primary-500"></span>
                  BOOK NOW
                </p>
                <h2 className="mt-4 font-heading text-4xl md:text-5xl text-foreground-950 leading-tight">{t("booking.heading")}</h2>
                <p className="mt-4 text-foreground-700 leading-relaxed">{t("booking.subtitle")}</p>
              </div>
              <BookingForm t={t} />
              <p className="mt-6 text-center text-sm text-foreground-600">
                {t("booking.policies_note")}{" "}
                <Link to="/booking-policies" className="text-primary-600 font-medium hover:text-primary-700 underline underline-offset-4 cursor-pointer">
                  {t("footer.booking_policies")}
                </Link>
              </p>
            </div>
          </section>
        </RevealWrap>

        {/* Trust row */}
        <RevealWrap>
          <section className="py-14 md:py-20 px-4 md:px-10 bg-background-100/88">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                {trustItems.map((item) => (
                  <div key={item.title} className="card-lift rounded-2xl bg-background-50 border border-background-200/70 p-6 text-center">
                    <span className="mx-auto w-14 h-14 rounded-2xl bg-accent-500/15 text-accent-600 flex items-center justify-center">
                      <i className={`${item.icon} text-2xl`} aria-hidden="true"></i>
                    </span>
                    <h3 className="mt-4 font-heading text-lg text-foreground-950">{item.title}</h3>
                    <p className="mt-2 text-sm text-foreground-700 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </RevealWrap>
      </PageTransition>
      <Footer />
    </main>
  );
}
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import Hero from "./components/Hero";
import AboutPreview from "./components/AboutPreview";
import ServicesPreview from "./components/ServicesPreview";
import HowItWorks from "./components/HowItWorks";
import WhyUs from "./components/WhyUs";
import PricingPreview from "./components/PricingPreview";
import GalleryPreview from "./components/GalleryPreview";
import CustomerTestimonials from "./components/CustomerTestimonials";
import Testimonials from "./components/Testimonials";
import Newsletter from "./components/Newsletter";
import CTASection from "./components/CTASection";
import FAQPreview from "./components/FAQPreview";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { usePageContent } from "@/hooks/usePageContent";
import PromoBanner from "@/components/feature/PromoBanner";

function RevealWrap({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`reveal-section ${isVisible ? 'is-visible' : ''}`}>
      {children}
    </div>
  );
}

const ALL_SECTIONS = {
  hero: true,
  about: true,
  services: true,
  howItWorks: true,
  whyUs: true,
  packages: true,
  gallery: true,
};

export default function Home() {
  // Section visibility is managed from the Admin Panel (Home Page → Page sections).
  const { content } = usePageContent("home");
  const s = { ...ALL_SECTIONS, ...(content.sections ?? {}) };

  return (
    <main className="min-h-screen bg-transparent text-foreground-950">
      <Navbar />
      {s.hero && <Hero />}
      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-6">
        <PromoBanner />
      </div>
      {s.about && <RevealWrap><AboutPreview /></RevealWrap>}
      {s.services && <RevealWrap><ServicesPreview /></RevealWrap>}
      {s.howItWorks && <RevealWrap><HowItWorks /></RevealWrap>}
      {s.whyUs && <RevealWrap><WhyUs /></RevealWrap>}
      {s.packages && <RevealWrap><PricingPreview /></RevealWrap>}
      {s.gallery && <RevealWrap><GalleryPreview /></RevealWrap>}
      <RevealWrap><CustomerTestimonials /></RevealWrap>
      <RevealWrap><Testimonials /></RevealWrap>
      <RevealWrap><FAQPreview /></RevealWrap>
      <RevealWrap><Newsletter /></RevealWrap>
      <CTASection />
      <Footer />
    </main>
  );
}
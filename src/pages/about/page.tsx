import { useTranslation } from "react-i18next";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import PageTransition from "@/components/base/PageTransition";
import HeroCarousel from "@/components/feature/HeroCarousel";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { usePageContent } from "@/hooks/usePageContent";
import AboutJourney from "./components/AboutJourney";

const aboutSlides = [
  {
    image: "https://readdy.ai/api/search-image?query=professional%20luxurious%20white%20mobile%20pet%20grooming%20van%20exterior%20parked%20on%20a%20beautiful%20dubai%20street%20with%20palm%20trees%20and%20warm%20golden%20hour%20sunlight%2C%20modern%20sleek%20design%20with%20subtle%20purple%20and%20gold%20brand%20accents%2C%20clean%20professional%20aesthetic%2C%20editorial%20automotive%20photography&width=1920&height=900&seq=about-hero-slide-01&orientation=landscape&nocache=true",
    alt: "Paws and Claws mobile grooming van in Abu Dhabi",
  },
  {
    image: "https://readdy.ai/api/search-image?query=professional%20female%20pet%20groomer%20gently%20brushing%20a%20fluffy%20happy%20golden%20retriever%20inside%20a%20clean%20bright%20modern%20mobile%20grooming%20salon%20interior%2C%20purple%20and%20gold%20ambient%20lighting%20through%20windows%2C%20caring%20gentle%20expression%2C%20editorial%20pet%20care%20photography&width=1920&height=900&seq=about-hero-slide-02&orientation=landscape&nocache=true",
    alt: "Professional groomer caring for a golden retriever",
  },
  {
    image: "https://readdy.ai/api/search-image?query=diverse%20team%20of%20four%20happy%20pet%20grooming%20professionals%20standing%20together%20outdoors%20in%20dubai%20with%20warm%20smiles%2C%20one%20holding%20a%20freshly%20groomed%20fluffy%20white%20dog%2C%20casual%20professional%20attire%2C%20palm%20trees%20and%20modern%20architecture%20with%20purple%20and%20gold%20dusk%20lighting%2C%20team%20portrait%20photography&width=1920&height=900&seq=about-hero-slide-03&orientation=landscape&nocache=true",
    alt: "Paws and Claws grooming team",
  },
];

const whyChooseUs = [
  { icon: "ri-award-line", title: "Professional & High-Quality Service", desc: "Every groom is delivered to the highest salon standard, using premium products and techniques that keep your pet looking and feeling their best." },
  { icon: "ri-user-star-line", title: "Experienced & Skilled Professionals", desc: "Our certified groomers bring years of hands-on expertise across breeds, coat types and temperaments — so every pet is in safe, capable hands." },
  { icon: "ri-customer-service-2-line", title: "Customer-Focused Approach", desc: "We listen first, groom second. Every session is tailored to your pet's needs and your schedule, with open communication from booking to finish." },
  { icon: "ri-shield-check-line", title: "Reliable & Trustworthy", desc: "We show up on time, fully equipped and fully insured — so you always know exactly what to expect, with no surprises." },
  { icon: "ri-lightbulb-flash-line", title: "Modern & Innovative Solutions", desc: "From our self-contained mobile van to low-noise equipment and eco-friendly products, we bring modern grooming technology right to your doorstep." },
  { icon: "ri-focus-3-line", title: "Attention to Detail", desc: "From the perfect breed cut to a gentle paw finish, we obsess over the small things that make a groom truly exceptional." },
  { icon: "ri-money-dollar-circle-line", title: "Competitive Pricing", desc: "Transparent, size-based pricing with no hidden fees — premium grooming that stays honest and accessible for every pet parent." },
  { icon: "ri-emotion-happy-line", title: "Customer Satisfaction", desc: "Our happiest metric is a wagging tail. We're not done until you and your pet are genuinely delighted with the result." },
];

const coreValues = [
  { icon: "ri-medal-line", title: "Quality", desc: "We never compromise on the standard of our work, products or care — quality is the foundation of everything we do." },
  { icon: "ri-hand-heart-line", title: "Trust", desc: "Built through honesty, consistency and transparent pricing, trust is the bond we earn with every pet parent." },
  { icon: "ri-scales-3-line", title: "Integrity", desc: "We do the right thing, even when no one is watching — with clear communication and no shortcuts." },
  { icon: "ri-rocket-2-line", title: "Innovation", desc: "We embrace new tools, techniques and ideas to make grooming calmer, safer and better for every pet." },
  { icon: "ri-thumb-up-line", title: "Customer Satisfaction", desc: "Your pet's happiness is our ultimate measure of success — we don't rest until you're delighted." },
  { icon: "ri-briefcase-5-line", title: "Professionalism", desc: "Punctual, prepared and polished — our team upholds the highest standards of conduct on every single visit." },
  { icon: "ri-time-line", title: "Reliability", desc: "Count on us to arrive on time and deliver consistent, dependable results, every single time." },
  { icon: "ri-trophy-line", title: "Excellence", desc: "We aim not just to meet expectations, but to exceed them — one flawless groom at a time." },
];

const values = [
  { icon: "ri-heart-pulse-line", title: "Pet-first, always", desc: "Every decision we make starts with one question: is this best for the pet?" },
  { icon: "ri-shield-star-line", title: "Trust through transparency", desc: "No hidden fees, no rushing through sessions, no shortcuts." },
  { icon: "ri-global-line", title: "Sustainable grooming", desc: "Biodegradable products, water-efficient systems, and cruelty-free everything." },
  { icon: "ri-team-line", title: "People who care", desc: "We hire for compassion first, technical skill second. Training can fill the gap — heart can't." },
];

const ALL_SECTIONS = {
  hero: true,
  mission: true,
  story: true,
  why: true,
  core: true,
  values: true,
  journey: true,
};

function RevealWrap({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`reveal-section ${isVisible ? 'is-visible' : ''}`}>
      {children}
    </div>
  );
}

export default function About() {
  const { t } = useTranslation();
  const { content } = usePageContent("about");
  const s = { ...ALL_SECTIONS, ...(content.sections ?? {}) };

  const heroTitle = content.heroTitle || t("about_page.hero_title");
  const heroSubtitle = content.heroSubtitle || t("about_page.hero_subtitle");
  const heroSlides = content.heroSlides?.length ? content.heroSlides.filter((s2) => s2.image) : aboutSlides;
  const missionTitle = content.missionTitle || t("about_page.mission_title");
  const missionText = content.missionText || t("about_page.mission_text");
  const visionTitle = content.visionTitle || t("about_page.vision_title");
  const visionText = content.visionText || t("about_page.vision_text");
  const storyTitle = content.storyTitle || t("about_page.story_title");
  const storyP1 = content.storyP1 || t("about_page.story_p1");
  const storyP2 = content.storyP2 || t("about_page.story_p2");
  const storyP3 = content.storyP3 || t("about_page.story_p3");
  const storyImage = content.storyImage || "https://static.readdy.ai/image/773d73dcd4bfe3b3ab546a821d990052/6db7c7e95d950fa02c82b76794900c2d.jpeg";
  const whyLabel = content.whyLabel || t("about_page.why_choose_label");
  const whyTitle = content.whyTitle || t("about_page.why_choose_title");
  const whySubtitle = content.whySubtitle || t("about_page.why_choose_subtitle");
  const coreLabel = content.coreLabel || t("about_page.core_values_label");
  const coreTitle = content.coreTitle || t("about_page.core_values_title");
  const coreSubtitle = content.coreSubtitle || t("about_page.core_values_subtitle");
  const valuesLabel = content.valuesLabel || "What drives us";
  const valuesTitle = content.valuesTitle || t("about_page.values_title");
  const whyItems = content.whyItems?.length ? content.whyItems : whyChooseUs;
  const coreItems = content.coreItems?.length ? content.coreItems : coreValues;
  const valueItems = content.valuesItems?.length ? content.valuesItems : values;

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
                ABOUT
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

        {/* Mission & Vision */}
        {s.mission && (
          <RevealWrap>
            <section className="py-14 md:py-20 px-4 md:px-10 bg-background-50/92">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="card-lift bg-background-100 rounded-2xl md:rounded-3xl p-6 md:p-10 hover:bg-background-200">
                  <span className="w-12 h-12 rounded-2xl bg-accent-500 text-background-950 flex items-center justify-center">
                    <i className="ri-focus-2-line text-xl icon-bounce" aria-hidden="true"></i>
                  </span>
                  <h3 className="mt-6 font-heading text-2xl text-foreground-950">{missionTitle}</h3>
                  <p className="mt-4 text-foreground-700 leading-relaxed">{missionText}</p>
                </div>
                <div className="card-lift bg-secondary-100 rounded-3xl p-10 hover:bg-secondary-200">
                  <span className="w-12 h-12 rounded-2xl bg-secondary-500 text-white flex items-center justify-center">
                    <i className="ri-eye-line text-xl icon-bounce" aria-hidden="true"></i>
                  </span>
                  <h3 className="mt-6 font-heading text-2xl text-foreground-950">{visionTitle}</h3>
                  <p className="mt-4 text-foreground-700 leading-relaxed">{visionText}</p>
                </div>
              </div>
            </section>
          </RevealWrap>
        )}

        {/* Story */}
        {s.story && (
          <RevealWrap>
            <section className="py-14 md:py-20 px-4 md:px-10 bg-background-100/88">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 md:mb-10">
                  <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
                    <span className="w-8 h-px bg-primary-500"></span>
                    OUR JOURNEY
                  </p>
                  <h2 className="mt-4 font-heading text-3xl md:text-5xl text-foreground-950 leading-tight">{storyTitle}</h2>
                </div>
                <div className="flex flex-col md:flex-row gap-8 md:gap-14 items-center">
                  <div className="md:w-1/2 about-story-img">
                    <div className="relative">
                      <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 w-full h-full rounded-2xl md:rounded-3xl bg-accent-500/20 -z-10"></div>
                      <img
                        src={storyImage}
                        alt="Paws and Claws mobile grooming van — fully equipped salon on wheels"
                        className="w-full h-auto rounded-2xl md:rounded-3xl"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <p className="text-foreground-700 leading-relaxed">{storyP1}</p>
                    <p className="mt-4 text-foreground-700 leading-relaxed">{storyP2}</p>
                    <p className="mt-4 text-foreground-700 leading-relaxed">{storyP3}</p>
                  </div>
                </div>
              </div>
            </section>
          </RevealWrap>
        )}

        {/* Our Journey timeline */}
        {s.journey && <RevealWrap><AboutJourney /></RevealWrap>}

        {/* Why Choose Us */}
        {s.why && (
          <RevealWrap>
            <section className="py-14 md:py-20 px-4 md:px-10 bg-background-50/92">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 md:mb-12">
                  <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
                    <span className="w-8 h-px bg-primary-500"></span>
                    {whyLabel}
                  </p>
                  <h2 className="mt-4 font-heading text-3xl md:text-5xl text-foreground-950 leading-tight">{whyTitle}</h2>
                  <p className="mt-4 max-w-2xl mx-auto text-foreground-700 leading-relaxed">{whySubtitle}</p>
                </div>
                <div className="reveal-stagger is-visible grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {whyItems.map((item) => (
                    <div key={item.title} className="group card-lift rounded-2xl md:rounded-3xl bg-background-100 border border-background-200/70 p-5 md:p-6 hover:border-accent-400 hover:bg-background-200/70 transition-all duration-300">
                      <span className="w-12 h-12 rounded-2xl bg-accent-500 text-background-950 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <i className={`${item.icon} text-xl icon-bounce`} aria-hidden="true"></i>
                      </span>
                      <h3 className="mt-5 font-heading text-base md:text-lg text-foreground-950 leading-snug">{item.title}</h3>
                      <p className="mt-3 text-sm text-foreground-700 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </RevealWrap>
        )}

        {/* Our Core Values */}
        {s.core && (
          <RevealWrap>
            <section className="py-14 md:py-20 px-4 md:px-10 bg-background-100/88">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 md:mb-12">
                  <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
                    <span className="w-8 h-px bg-primary-500"></span>
                    {coreLabel}
                  </p>
                  <h2 className="mt-4 font-heading text-3xl md:text-5xl text-foreground-950 leading-tight">{coreTitle}</h2>
                  <p className="mt-4 max-w-2xl mx-auto text-foreground-700 leading-relaxed">{coreSubtitle}</p>
                </div>
                <div className="reveal-stagger is-visible grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {coreItems.map((v) => (
                    <div key={v.title} className="group card-lift rounded-2xl md:rounded-3xl bg-background-50 border border-background-200/70 p-5 md:p-6 hover:border-primary-400 hover:bg-background-100 transition-all duration-300">
                      <span className="w-12 h-12 rounded-2xl bg-primary-500 text-background-50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <i className={`${v.icon} text-xl icon-bounce`} aria-hidden="true"></i>
                      </span>
                      <h3 className="mt-5 font-heading text-base md:text-lg text-foreground-950 leading-snug">{v.title}</h3>
                      <p className="mt-3 text-sm text-foreground-700 leading-relaxed">{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </RevealWrap>
        )}

        {/* Values (What we believe in) */}
        {s.values && (
          <RevealWrap>
            <section className="py-14 md:py-20 px-4 md:px-10 bg-background-50/92">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 md:mb-10">
                  <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
                    <span className="w-8 h-px bg-primary-500"></span>
                    {valuesLabel}
                  </p>
                  <h2 className="mt-4 font-heading text-3xl md:text-5xl text-foreground-950 leading-tight">{valuesTitle}</h2>
                </div>
                <div className="reveal-stagger is-visible grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {valueItems.map((v) => (
                    <div key={v.title} className="card-lift rounded-2xl md:rounded-3xl bg-background-100 border border-background-200/70 p-5 md:p-8 hover:border-accent-400">
                      <span className="w-12 h-12 rounded-2xl bg-accent-500 text-background-950 flex items-center justify-center">
                        <i className={`${v.icon} text-xl icon-bounce`} aria-hidden="true"></i>
                      </span>
                      <h3 className="mt-5 font-heading text-lg text-foreground-950">{v.title}</h3>
                      <p className="mt-3 text-sm text-foreground-700 leading-relaxed">{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </RevealWrap>
        )}
      </PageTransition>
      <Footer />
    </main>
  );
}
// Editable content model for the marketing pages (Home, About, Contact).
// Stored in the `pages` table as one JSON row per page key. The public site
// reads whatever the administrator has saved and falls back to the built-in
// defaults below for anything left untouched.

export interface SlideItem {
  image: string;
  alt: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface StepItem {
  icon: string;
  title: string;
  desc: string;
}

export interface HomeSections {
  hero: boolean;
  about: boolean;
  services: boolean;
  howItWorks: boolean;
  whyUs: boolean;
  packages: boolean;
  gallery: boolean;
}

export interface IconItem {
  icon: string;
  title: string;
  desc: string;
}

export interface SocialItem {
  icon: string;
  label: string;
  href: string;
}

export interface HomeContent {
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  ctaBook: string;
  ctaExplore: string;
  ctaBookHref: string;
  ctaExploreHref: string;
  heroSlides: SlideItem[];
  sections: HomeSections;
  aboutHeading: string;
  aboutHeadingItalic: string;
  aboutP1: string;
  aboutP2: string;
  aboutImage: string;
  stats: StatItem[];
  howLabel: string;
  howHeading: string;
  howHeadingItalic: string;
  howSteps: StepItem[];
  whyLabel: string;
  whyHeading: string;
  whyHeadingItalic: string;
  whySubtitle: string;
  whyItems: IconItem[];
  servicesLabel: string;
  servicesHeading: string;
  servicesHeadingItalic: string;
  servicesSubtitle: string;
  galleryLabel: string;
  galleryHeading: string;
  galleryHeadingItalic: string;
  galleryCount: number;
}

export interface AboutSections {
  hero: boolean;
  mission: boolean;
  story: boolean;
  why: boolean;
  core: boolean;
  values: boolean;
  journey: boolean;
}

export interface JourneyItem {
  year: string;
  title: string;
  desc: string;
}

export interface ContactSections {
  hero: boolean;
  info: boolean;
  form: boolean;
  follow: boolean;
  map: boolean;
  bookCta: boolean;
}

export interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  heroSlides: SlideItem[];
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  storyTitle: string;
  storyP1: string;
  storyP2: string;
  storyP3: string;
  storyImage: string;
  whyLabel: string;
  whyTitle: string;
  whySubtitle: string;
  whyItems: IconItem[];
  coreLabel: string;
  coreTitle: string;
  coreSubtitle: string;
  coreItems: IconItem[];
  valuesLabel: string;
  valuesTitle: string;
  valuesItems: IconItem[];
  sections: AboutSections;
  journeyLabel: string;
  journeyTitle: string;
  journeySubtitle: string;
  journeyItems: JourneyItem[];
}

export interface ContactContent {
  heroTitle: string;
  heroSubtitle: string;
  heroSlides: SlideItem[];
  infoTitle: string;
  formTitle: string;
  mapTitle: string;
  mapQuery: string;
  followLabel: string;
  followTitle: string;
  followSubtitle: string;
  socials: SocialItem[];
  sections: ContactSections;
  serviceAreaTitle: string;
  serviceAreaItems: string[];
  bookLabel: string;
  bookHeading: string;
  bookSubtitle: string;
  bookButton: string;
}

export interface MedicalItem {
  id: string;
  icon: string;
  name: string;
  price: string;
  note: string;
  description: string;
}

export interface GuideItem {
  icon: string;
  title: string;
  text: string;
}

export interface MedicalContent {
  label: string;
  heading: string;
  headingItalic: string;
  intro: string;
  items: MedicalItem[];
  guideTitle: string;
  guideIntro: string;
  guideItems: GuideItem[];
  disclaimer: string;
}

export type PageKey = "home" | "about" | "contact" | "medical";

export interface PageContentMap {
  home: HomeContent;
  about: AboutContent;
  contact: ContactContent;
  medical: MedicalContent;
}

// ---- Defaults (also used as placeholders in the Admin editor) -------------

export const DEFAULT_HOME: HomeContent = {
  heroBadge: "Now booking · Abu Dhabi & Al Ain",
  heroTitle1: "The salon that comes",
  heroTitle2: "to your doorstep.",
  heroSubtitle:
    "Paws and Claws Pets Grooming Salon LLC — a fully equipped mobile grooming van bringing calm, cage-free, salon-quality care straight to your driveway. Cats, dogs, and every fluffy human in between.",
  ctaBook: "Book a mobile groom",
  ctaExplore: "Explore services",
  ctaBookHref: "/booking",
  ctaExploreHref: "/services",
  heroSlides: [
    { image: "https://readdy.ai/api/search-image?query=adorable%20fluffy%20golden%20retriever%20puppy%20sitting%20happily%20inside%20a%20modern%20mobile%20pet%20grooming%20van%20with%20warm%20natural%20lighting%2C%20professional%20grooming%20tools%20visible%2C%20clean%20bright%20interior%2C%20editorial%20pet%20photography%20with%20rich%20purple%20and%20champagne%20gold%20tones%2C%20premium%20lifestyle%20aesthetic&width=1800&height=1200&seq=pc-hero-slide-01&orientation=landscape&nocache=true", alt: "Golden retriever in mobile grooming van" },
    { image: "https://readdy.ai/api/search-image?query=beautiful%20fluffy%20persian%20cat%20being%20gently%20brushed%20by%20a%20professional%20groomer%2C%20calm%20serene%20expression%2C%20soft%20studio%20lighting%20with%20deep%20purple%20and%20warm%20gold%20tones%2C%20editorial%20pet%20photography%2C%20luxurious%20grooming%20aesthetic%2C%20clean%20minimal%20composition&width=1800&height=1200&seq=pc-hero-slide-02&orientation=landscape&nocache=true", alt: "Persian cat being groomed" },
    { image: "https://readdy.ai/api/search-image?query=happy%20freshly%20groomed%20white%20poodle%20with%20stylish%20haircut%20and%20golden%20bandana%20sitting%20proudly%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20champagne%20gold%20accents%2C%20professional%20pet%20portrait%20photography%2C%20premium%20grooming%20result%2C%20clean%20modern%20aesthetic&width=1800&height=1200&seq=pc-hero-slide-03&orientation=landscape&nocache=true", alt: "Freshly groomed poodle with bandana" },
  ],
  sections: {
    hero: true,
    about: true,
    services: true,
    howItWorks: true,
    whyUs: true,
    packages: true,
    gallery: true,
  },
  aboutHeading: "Mobile grooming reimagined for",
  aboutHeadingItalic: "Abu Dhabi's pets.",
  aboutP1:
    "Founded in 2021, Paws and Claws was born from a simple frustration — watching pets come home stressed after long salon waits. We believed there had to be a better way, and the mobile grooming van was our answer.",
  aboutP2:
    "Today, we bring a full luxury salon experience to your doorstep. No cages, no car rides, no waiting rooms. Just one groomer, one pet, and a calm, personalised session inside our state-of-the-art mobile unit.",
  aboutImage:
    "https://readdy.ai/api/search-image?query=professional%20pet%20groomer%20in%20deep%20purple%20apron%20gently%20brushing%20a%20happy%20golden%20retriever%20inside%20a%20bright%20clean%20mobile%20grooming%20van%20with%20modern%20equipment%2C%20warm%20natural%20daylight%20streaming%20through%20windows%2C%20editorial%20photography%20with%20deep%20purple%20tones%20and%20warm%20gold%20accents%2C%20high%20detail&width=800&height=1000&seq=pc-about-preview-01&orientation=portrait&nocache=true",
  stats: [
    { value: "5+", label: "Years in operation" },
    { value: "500+", label: "Happy pets groomed" },
    { value: "4.9", label: "Average rating" },
    { value: "40+", label: "Breeds served" },
  ],
  howLabel: "How it works",
  howHeading: "Four simple steps to a",
  howHeadingItalic: "happier, cleaner pet.",
  howSteps: [
    { icon: "ri-calendar-check-line", title: "Book your slot", desc: "Tell us about your pet, pick a service and choose a time that suits your day — right from our website or WhatsApp." },
    { icon: "ri-truck-line", title: "We roll up to you", desc: "Our fully equipped grooming van parks outside your home. Water, power and warmth are all self-contained inside." },
    { icon: "ri-heart-pulse-line", title: "Stress-free spa time", desc: "Your pet is groomed one-on-one by a certified specialist — no cages, no other animals, no long waits." },
    { icon: "ri-home-smile-line", title: "Fresh, happy, home", desc: "We hand your pet back at your door, smelling amazing and looking beautiful — usually in under 90 minutes." },
  ],
  whyLabel: "Why choose us",
  whyHeading: "What makes us",
  whyHeadingItalic: "different.",
  whySubtitle: "We obsess over the tiny details so your pet feels safe, and you feel like your money is well spent. Here's what makes us different.",
  whyItems: [
    { icon: "ri-user-heart-line", title: "One pet at a time", desc: "Zero cages, zero waiting room. Your pet gets our groomer's full, calm attention from start to finish." },
    { icon: "ri-map-pin-time-line", title: "Zero drive time for you", desc: "No traffic, no carrier stress, no double trips. We come to your driveway, villa gate or apartment lobby." },
    { icon: "ri-flask-line", title: "Organic, pet-safe products", desc: "Organic, paraben-free shampoos and conditioners — gentle enough for sensitive skin, kittens and puppies." },
    { icon: "ri-shield-star-line", title: "Fully insured team", desc: "Every groomer is trained, certified and covered by full public-liability insurance for total peace of mind." },
    { icon: "ri-medal-line", title: "Salon-grade equipment", desc: "Hydro-tubs, low-noise dryers and cordless clippers — the same tools used in top luxury pet salons." },
    { icon: "ri-24-hours-line", title: "Same-week bookings", desc: "Need a groom for a shoot, a trip or a visit tomorrow? We keep same-week slots open for our clients." },
  ],
  servicesLabel: "Our services",
  servicesHeading: "Handcrafted grooming, tailored to",
  servicesHeadingItalic: "your pet's personality.",
  servicesSubtitle: "From a gentle wash to a full breed-specific haircut — for cats, dogs, birds and bunnies. Every service is delivered inside our mobile salon, at a pace that keeps your pet relaxed and happy.",
  galleryLabel: "Gallery",
  galleryHeading: "Fresh faces, happy tails —",
  galleryHeadingItalic: "our work speaks for itself.",
  galleryCount: 6,
};

export const DEFAULT_ABOUT: AboutContent = {
  heroTitle: "Our Story",
  heroSubtitle: "How a love for pets and a van turned into Abu Dhabi's favourite mobile grooming service.",
  heroSlides: [
    { image: "https://readdy.ai/api/search-image?query=professional%20luxurious%20white%20mobile%20pet%20grooming%20van%20exterior%20parked%20on%20a%20beautiful%20dubai%20street%20with%20palm%20trees%20and%20warm%20golden%20hour%20sunlight%2C%20modern%20sleek%20design%20with%20subtle%20purple%20and%20gold%20brand%20accents%2C%20clean%20professional%20aesthetic%2C%20editorial%20automotive%20photography&width=1920&height=900&seq=about-hero-slide-01&orientation=landscape&nocache=true", alt: "Paws and Claws mobile grooming van in Abu Dhabi" },
    { image: "https://readdy.ai/api/search-image?query=professional%20female%20pet%20groomer%20gently%20brushing%20a%20fluffy%20happy%20golden%20retriever%20inside%20a%20clean%20bright%20modern%20mobile%20grooming%20salon%20interior%2C%20purple%20and%20gold%20ambient%20lighting%20through%20windows%2C%20caring%20gentle%20expression%2C%20editorial%20pet%20care%20photography&width=1920&height=900&seq=about-hero-slide-02&orientation=landscape&nocache=true", alt: "Professional groomer caring for a golden retriever" },
    { image: "https://readdy.ai/api/search-image?query=diverse%20team%20of%20four%20happy%20pet%20grooming%20professionals%20standing%20together%20outdoors%20in%20dubai%20with%20warm%20smiles%2C%20one%20holding%20a%20freshly%20groomed%20fluffy%20white%20dog%2C%20casual%20professional%20attire%2C%20palm%20trees%20and%20modern%20architecture%20with%20purple%20and%20gold%20dusk%20lighting%2C%20team%20portrait%20photography&width=1920&height=900&seq=about-hero-slide-03&orientation=landscape&nocache=true", alt: "Paws and Claws grooming team" },
  ],
  missionTitle: "Our Mission",
  missionText: "To make professional pet grooming calm, convenient, and completely cage-free — one doorstep at a time.",
  visionTitle: "Our Vision",
  visionText: "To become the most trusted name in mobile pet grooming across the UAE, setting a new standard for pet wellness and convenience.",
  storyTitle: "How it all started",
  storyP1: "Paws and Claws was founded in early 2021 by a team of pet lovers who saw a gap in the UAE market: grooming that was truly stress-free for both pets and their humans.",
  storyP2: "The idea was simple — instead of making pets travel to salons, why not bring the salon to them? With a fully self-contained mobile grooming van, every pet could enjoy a one-on-one, cage-free experience right outside their own door.",
  storyP3: "What started as a single van in Abu Dhabi quickly grew through word of mouth. Today, we serve communities across Abu Dhabi and Al Ain, with a team of certified, passionate groomers who treat every pet like family.",
  storyImage: "https://static.readdy.ai/image/773d73dcd4bfe3b3ab546a821d990052/6db7c7e95d950fa02c82b76794900c2d.jpeg",
  whyLabel: "Why choose us",
  whyTitle: "The Paws and Claws difference",
  whySubtitle: "More than a groom — a calm, premium experience built around your pet. Here's why pet parents across the UAE trust us with their best friends.",
  whyItems: [
    { icon: "ri-award-line", title: "Professional & High-Quality Service", desc: "Every groom is delivered to the highest salon standard, using premium products and techniques that keep your pet looking and feeling their best." },
    { icon: "ri-user-star-line", title: "Experienced & Skilled Professionals", desc: "Our certified groomers bring years of hands-on expertise across breeds, coat types and temperaments — so every pet is in safe, capable hands." },
    { icon: "ri-customer-service-2-line", title: "Customer-Focused Approach", desc: "We listen first, groom second. Every session is tailored to your pet's needs and your schedule, with open communication from booking to finish." },
    { icon: "ri-shield-check-line", title: "Reliable & Trustworthy", desc: "We show up on time, fully equipped and fully insured — so you always know exactly what to expect, with no surprises." },
    { icon: "ri-lightbulb-flash-line", title: "Modern & Innovative Solutions", desc: "From our self-contained mobile van to low-noise equipment and eco-friendly products, we bring modern grooming technology right to your doorstep." },
    { icon: "ri-focus-3-line", title: "Attention to Detail", desc: "From the perfect breed cut to a gentle paw finish, we obsess over the small things that make a groom truly exceptional." },
    { icon: "ri-money-dollar-circle-line", title: "Competitive Pricing", desc: "Transparent, size-based pricing with no hidden fees — premium grooming that stays honest and accessible for every pet parent." },
    { icon: "ri-emotion-happy-line", title: "Customer Satisfaction", desc: "Our happiest metric is a wagging tail. We're not done until you and your pet are genuinely delighted with the result." },
  ],
  coreLabel: "Our core values",
  coreTitle: "The principles that guide us",
  coreSubtitle: "These aren't just words on a page — they're the standards we hold ourselves to on every single visit, for every single pet.",
  coreItems: [
    { icon: "ri-medal-line", title: "Quality", desc: "We never compromise on the standard of our work, products or care — quality is the foundation of everything we do." },
    { icon: "ri-hand-heart-line", title: "Trust", desc: "Built through honesty, consistency and transparent pricing, trust is the bond we earn with every pet parent." },
    { icon: "ri-scales-3-line", title: "Integrity", desc: "We do the right thing, even when no one is watching — with clear communication and no shortcuts." },
    { icon: "ri-rocket-2-line", title: "Innovation", desc: "We embrace new tools, techniques and ideas to make grooming calmer, safer and better for every pet." },
    { icon: "ri-thumb-up-line", title: "Customer Satisfaction", desc: "Your pet's happiness is our ultimate measure of success — we don't rest until you're delighted." },
    { icon: "ri-briefcase-5-line", title: "Professionalism", desc: "Punctual, prepared and polished — our team upholds the highest standards of conduct on every single visit." },
    { icon: "ri-time-line", title: "Reliability", desc: "Count on us to arrive on time and deliver consistent, dependable results, every single time." },
    { icon: "ri-trophy-line", title: "Excellence", desc: "We aim not just to meet expectations, but to exceed them — one flawless groom at a time." },
  ],
  valuesLabel: "What drives us",
  valuesTitle: "What we believe in",
  valuesItems: [
    { icon: "ri-heart-pulse-line", title: "Pet-first, always", desc: "Every decision we make starts with one question: is this best for the pet?" },
    { icon: "ri-shield-star-line", title: "Trust through transparency", desc: "No hidden fees, no rushing through sessions, no shortcuts." },
    { icon: "ri-global-line", title: "Sustainable grooming", desc: "Biodegradable products, water-efficient systems, and cruelty-free everything." },
    { icon: "ri-team-line", title: "People who care", desc: "We hire for compassion first, technical skill second. Training can fill the gap — heart can't." },
  ],
  sections: {
    hero: true,
    mission: true,
    story: true,
    why: true,
    core: true,
    values: true,
    journey: true,
  },
  journeyLabel: "Our journey",
  journeyTitle: "From one van to a fleet of happy tails",
  journeySubtitle: "A few of the milestones that shaped Paws and Claws along the way.",
  journeyItems: [
    { year: "2021", title: "The first van hits the road", desc: "Paws and Claws launched in Abu Dhabi with a single fully equipped mobile grooming van and a big idea." },
    { year: "2022", title: "Our team grows", desc: "Demand grew through word of mouth, so we welcomed our first certified grooming specialists." },
    { year: "2023", title: "Expanding across the capital", desc: "We added new routes and reached more neighbourhoods across Abu Dhabi every week." },
    { year: "2024", title: "Hello, Al Ain", desc: "We extended service to Al Ain, bringing doorstep grooming to a whole new community." },
    { year: "2026", title: "500+ happy pets", desc: "Today we've groomed over 500 pets and earned a 4.9-star average from pet parents across the UAE." },
  ],
};

export const DEFAULT_CONTACT: ContactContent = {
  heroTitle: "Get in touch",
  heroSubtitle: "We'd love to hear from you. Reach out for bookings, questions, or just to say hello.",
  heroSlides: [
    { image: "https://readdy.ai/api/search-image?query=warm%20inviting%20pet%20friendly%20modern%20living%20room%20with%20deep%20purple%20sofa%20and%20a%20happy%20golden%20retriever%20sitting%20nearby%2C%20natural%20daylight%20streaming%20through%20large%20windows%2C%20welcoming%20home%20atmosphere%2C%20editorial%20interior%20photography%2C%20cozy%20elegant%20aesthetic&width=1920&height=900&seq=ct-hero-slide-01&orientation=landscape&nocache=true", alt: "Warm pet-friendly living room" },
    { image: "https://readdy.ai/api/search-image?query=pristine%20white%20modern%20mobile%20pet%20grooming%20van%20parked%20beautifully%20outside%20an%20elegant%20dubai%20villa%20entrance%20with%20palm%20trees%20and%20landscaped%20garden%2C%20warm%20golden%20hour%20sunlight%2C%20professional%20clean%20aesthetic%2C%20middle%20eastern%20architecture%20with%20purple%20and%20gold%20dusk%20lighting&width=1920&height=900&seq=ct-hero-slide-02&orientation=landscape&nocache=true", alt: "Mobile grooming van at Abu Dhabi villa" },
  ],
  infoTitle: "Contact info",
  formTitle: "Send us a message",
  mapTitle: "Service area",
  mapQuery: "Abu Dhabi and Al Ain, United Arab Emirates",
  followLabel: "Stay connected",
  followTitle: "Follow Us",
  followSubtitle: "Stay connected and see our daily happy tails!",
  socials: [
    { icon: "ri-facebook-fill", label: "Facebook", href: "https://www.facebook.com/share/1Bf4HuLpJX/" },
    { icon: "ri-instagram-line", label: "Instagram", href: "https://www.instagram.com/pawsandclaws.ad" },
    { icon: "ri-tiktok-line", label: "TikTok", href: "https://www.tiktok.com/@pawsandclaws.ad" },
    { icon: "ri-whatsapp-line", label: "WhatsApp", href: "https://wa.me/971557033165" },
    { icon: "ri-snapchat-line", label: "Snapchat", href: "https://www.snapchat.com/add/pawsandclaws.ad" },
  ],
  sections: {
    hero: true,
    info: true,
    form: true,
    follow: true,
    map: true,
    bookCta: true,
  },
  serviceAreaTitle: "Areas we serve",
  serviceAreaItems: [
    "Abu Dhabi City",
    "Al Ain",
    "Yas Island",
    "Saadiyat Island",
    "Jubail Island",
    "Al Reem Island",
    "Al Fahid Island",
    "Al Maryah Island",
    "Khalifa City",
    "Al Raha",
    "Al Shamkha",
    "Mohammed Bin Zayed City",
    "Baniyas",
    "Masdar City",
    "Zayed Sports City",
    "Al Reef",
  ],
  bookLabel: "Book now",
  bookHeading: "Ready for a happier, cleaner pet?",
  bookSubtitle: "Book your mobile grooming session today. Same-week slots available across Abu Dhabi & Al Ain.",
  bookButton: "Book a mobile groom",
};

export const DEFAULT_MEDICAL: MedicalContent = {
  label: "Medical & special care",
  heading: "Medical baths &",
  headingItalic: "specialist treatments.",
  intro:
    "Beyond routine grooming, we offer medically focused baths for pets dealing with skin conditions, parasites or sensitivities. Each treatment is carried out gently, with products chosen for your pet's specific need.",
  items: [
    {
      id: "flea-tick-bath",
      icon: "ri-bug-2-line",
      name: "Flea & Tick Medical Bath",
      price: "AED 90",
      note: "Extra",
      description:
        "Medicated shampoo to remove flea and tick bodies from the skin, Fibrotec pills to prevent future infestations, and body-sterilisation medicine for comprehensive prevention.",
    },
    {
      id: "fungal-bath",
      icon: "ri-first-aid-kit-line",
      name: "Fungal Medicated Bath",
      price: "AED 90",
      note: "Extra",
      description:
        "Medicated fungus shampoo that disinfects and deeply cleans the affected areas — a targeted antifungal treatment to soothe and clear fungal conditions.",
    },
  ],
  guideTitle: "Special care guidance",
  guideIntro:
    "A few things that help us look after pets with medical or special-care needs safely and comfortably.",
  guideItems: [
    {
      icon: "ri-health-book-line",
      title: "Share the medical history",
      text: "Tell us about any diagnosis, ongoing treatment or medication in the booking notes so our groomer can plan the session around your pet.",
    },
    {
      icon: "ri-alert-line",
      title: "Flag allergies & sensitivities",
      text: "Please let us know about skin allergies, product sensitivities or dietary restrictions before we begin, so we can pick the gentlest products.",
    },
    {
      icon: "ri-heart-pulse-line",
      title: "Age & mobility",
      text: "Senior pets, puppies and kittens get extra-short, low-stress sessions with plenty of breaks and minimal handling.",
    },
    {
      icon: "ri-user-heart-line",
      title: "Who to ask for advice",
      text: "For any diagnosed medical condition, always follow your vet's guidance first — our baths are supportive care, never a substitute for veterinary treatment.",
    },
  ],
  disclaimer:
    "Our medical baths are supportive grooming treatments and are not a substitute for professional veterinary diagnosis or prescription treatment. If your pet has an active or worsening medical condition, please consult your vet first.",
};

export const PAGE_DEFAULTS: PageContentMap = {
  home: DEFAULT_HOME,
  about: DEFAULT_ABOUT,
  contact: DEFAULT_CONTACT,
  medical: DEFAULT_MEDICAL,
};
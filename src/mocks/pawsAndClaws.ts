export const brandInfo = {
  name: "Paws and Claws",
  fullName: "Paws and Claws Pets Grooming Salon LLC",
  tagline: "Salon-quality grooming, delivered to your doorstep.",
  phone: "+971 55 703 3165",
  phoneHref: "tel:+971557033165",
  whatsapp: "+971 55 703 3165",
  whatsappHref: "https://wa.me/971557033165",
  email: "info@pawsandclaws.com",
  emailAlt: "Pawsandclawsauh@gmail.com",
  hoursShort: "Mon – Sun · 9:30 AM – 11:30 PM",
  serviceArea: "Serving Abu Dhabi · Al Ain & surrounding areas",
};

export const trustStats = [
  { icon: "ri-shield-check-line", label: "Fully licensed & insured" },
  { icon: "ri-award-line", label: "Certified pet groomers" },
  { icon: "ri-home-heart-line", label: "No cages, no crates" },
  { icon: "ri-truck-line", label: "Fully equipped mobile van" },
];

// Full service menu for cats, dogs, birds and bunnies.
// Every package includes a complimentary checkup service.
export const services = [
  {
    id: "cat-basic",
    category: "cats",
    name: "Cat Basic Grooming",
    price: "AED 180",
    duration: "90 min",
    icon: "ri-emotion-happy-line",
    tone: "primary",
    tagline: "Calm, clean and fresh — the essentials done right",
    description:
      "A gentle, unhurried session that keeps your cat feeling clean and comfortable, using organic products and a soft touch that suits even the most nervous felines.",
    includes: [
      "Double wash with organic shampoo",
      "Organic conditioner & blow-out",
      "Careful combing & loose-hair removal",
      "Ear and eye cleaning",
      "Nail clipping with polish",
      "Organic body mist & facial tidy",
      "Free Checkup Service",
    ],
  },
  {
    id: "dog-basic",
    category: "dogs",
    name: "Dog Basic Grooming",
    price: "AED 180",
    duration: "90 min",
    icon: "ri-footprint-line",
    tone: "accent",
    tagline: "The everyday essentials, beautifully done",
    description:
      "Everything your dog needs to stay clean, fresh and comfortable, finished with organic products and a calm, one-on-one approach.",
    includes: [
      "Double wash with organic shampoo",
      "Organic conditioner & blow-dry",
      "Combing & de-shedding",
      "Ear and eye cleaning",
      "Nail clipping with polish",
      "Organic body & breath spray",
      "Free Checkup Service",
    ],
  },
  {
    id: "cat-full",
    category: "cats",
    name: "Cat Full Grooming",
    price: "AED 230",
    duration: "120 min",
    icon: "ri-magic-line",
    tone: "secondary",
    tagline: "Our complete coat-to-claw pamper session",
    description:
      "The complete works for cats — the full wash-and-care routine plus a tailored breed cut and the extra finishing touches that make a real difference.",
    includes: [
      "Everything in Cat Basic Grooming",
      "Gentle tooth brushing",
      "Sensitive-area & paw shaving",
      "Breed-standard coat cut",
      "Organic finishing spray",
      "Free Checkup Service",
    ],
  },
  {
    id: "dog-full",
    category: "dogs",
    name: "Dog Full Grooming",
    price: "AED 230",
    duration: "120 min",
    icon: "ri-heart-3-line",
    tone: "primary",
    tagline: "A head-to-tail transformation for your dog",
    description:
      "Our most complete dog groom — the entire wash-and-care ritual plus a breed-appropriate haircut and all the premium finishing details.",
    includes: [
      "Everything in Dog Basic Grooming",
      "Gentle tooth brushing",
      "Sensitive-area & paw shaving",
      "Breed-standard coat cut",
      "Organic finishing spray",
      "Free Checkup Service",
    ],
  },
  {
    id: "cat-haircut",
    category: "cats",
    name: "Cat Haircut",
    price: "AED 180",
    duration: "90 min",
    icon: "ri-scissors-cut-line",
    tone: "accent",
    tagline: "Scissor & clipper styling, made for cats",
    description:
      "Our feline stylists shape the coat to suit your cat's breed, body and personality — from a cool summer trim to a full show-style finish.",
    includes: [
      "Shaving — full or partial coat removal",
      "Breed cut shaped to your cat's coat type",
      "Styled cuts: Lion, Panther, Crocodile, Round Face, Kitten",
      "Summer & Trimming cuts",
      "Showstar international show-style grooming",
    ],
  },
  {
    id: "dog-haircut",
    category: "dogs",
    name: "Dog Haircut",
    price: "AED 180",
    duration: "90 min",
    icon: "ri-sun-line",
    tone: "secondary",
    tagline: "Breed-perfect cuts and playful styles",
    description:
      "Whether you want a soft teddy-bear look or a sleek breed cut, our stylists shape the coat precisely and comfortably to suit your dog.",
    includes: [
      "Teddy Bear cut",
      "Poodle cut",
      "Summer cut",
      "Shaved body",
      "Trimming cut",
      "Breed-standard scissor finish",
    ],
  },
  {
    id: "cat-deep",
    category: "cats",
    name: "Cat Deep Cleaning",
    price: "AED 280",
    duration: "150 min",
    icon: "ri-sparkling-line",
    tone: "primary",
    tagline: "The deepest clean we offer for cats",
    description:
      "An intensive triple-wash session for cats who need the deepest possible clean, finished with premium detailing from nose to tail.",
    includes: [
      "Triple wash with organic shampoo",
      "Conditioner, combing & de-shedding",
      "Ear, eye & nail care with polish",
      "Mouthwash to fight bacteria & odour",
      "Paw balm, polish & de-matting",
      "Anal gland care",
      "Free Checkup Service",
    ],
  },
  {
    id: "dog-deep",
    category: "dogs",
    name: "Dog Deep Cleaning",
    price: "AED 280",
    duration: "150 min",
    icon: "ri-drop-line",
    tone: "accent",
    tagline: "An intensive, nose-to-tail reset",
    description:
      "A thorough triple-wash treatment that tackles odour, loose fur and build-up, leaving your dog's coat spotless and beautifully conditioned.",
    includes: [
      "Triple wash with organic shampoo",
      "Conditioner, combing & de-shedding",
      "Ear, eye & nail care with polish",
      "Mouthwash to fight bacteria & odour",
      "Paw balm, polish & de-matting",
      "Anal gland care",
      "Free Checkup Service",
    ],
  },
  {
    id: "cat-trim",
    category: "cats",
    name: "Cat Trimming",
    price: "AED 130",
    duration: "45 min",
    icon: "ri-seedling-line",
    tone: "secondary",
    tagline: "A quick tidy between full grooms",
    description:
      "A fast, no-nonsense refresh focused on combing and tidying up — perfect for keeping your cat neat in between bigger grooming days.",
    includes: [
      "Careful combing & de-shedding",
      "Ear and eye cleaning",
      "Nail clipping & polish",
      "Organic body & breath spray",
      "Free Checkup Service",
    ],
  },
  {
    id: "dog-trim",
    category: "dogs",
    name: "Dog Trimming",
    price: "AED 130",
    duration: "45 min",
    icon: "ri-leaf-line",
    tone: "primary",
    tagline: "Keep things neat, without the full groom",
    description:
      "A quick tidy-up that keeps your dog's coat fresh and manageable between full grooming appointments.",
    includes: [
      "Careful combing & de-shedding",
      "Ear and eye cleaning",
      "Nail clipping & polish",
      "Organic body & breath spray",
      "Free Checkup Service",
    ],
  },
  {
    id: "cat-wash",
    category: "cats",
    name: "Cat Washing",
    price: "AED 130",
    duration: "60 min",
    icon: "ri-water-flash-line",
    tone: "accent",
    tagline: "A soothing bath and gentle blow-out",
    description:
      "A calm double wash and blow-out that leaves the coat soft, clean and lightly scented — no cutting, just pure freshness.",
    includes: [
      "Double wash with organic shampoo",
      "Organic conditioner",
      "Combing & loose-hair removal",
      "Organic body mist & facial tidy",
      "Free Checkup Service",
    ],
  },
  {
    id: "dog-wash",
    category: "dogs",
    name: "Dog Washing",
    price: "AED 130",
    duration: "60 min",
    icon: "ri-water-flash-line",
    tone: "secondary",
    tagline: "A fresh, thorough bath and dry",
    description:
      "A warm, gentle bath and blow-dry that leaves your dog's coat clean, soft and smelling wonderful — no trimming required.",
    includes: [
      "Double wash with organic shampoo",
      "Organic conditioner",
      "Combing & loose-hair removal",
      "Organic body mist & facial tidy",
      "Free Checkup Service",
    ],
  },
  {
    id: "bird-full",
    category: "birds",
    name: "Birds Full Grooming",
    price: "AED 170",
    duration: "60 min",
    icon: "ri-flight-takeoff-line",
    tone: "primary",
    tagline: "Complete care for your feathered friend",
    description:
      "A full grooming session designed around the delicate needs of birds, using gentle, bird-safe products from start to finish.",
    includes: [
      "Double wash with bird-safe shampoo",
      "Organic conditioner",
      "Nail clipping & beak polish",
      "Specialist wing trim",
      "Organic conditioning spray",
      "Free Checkup Service",
    ],
  },
  {
    id: "bunny-full",
    category: "bunny",
    name: "Bunny Full Grooming",
    price: "AED 170",
    duration: "60 min",
    icon: "ri-heart-line",
    tone: "accent",
    tagline: "Soft, clean and comfortable rabbits",
    description:
      "A calm, complete grooming routine tailored to rabbits, keeping the coat healthy and their sensitive skin comfortable.",
    includes: [
      "Double wash with organic shampoo",
      "Organic conditioner & combing",
      "De-shedding & ear/eye cleaning",
      "Nail clipping & polish",
      "Organic body spray",
      "Free Checkup Service",
    ],
  },
];

export const serviceCategories = ["all", "cats", "dogs", "birds", "bunny"];

export const howItWorks = [
  {
    step: "01",
    title: "Book your slot",
    description:
      "Tell us about your pet, pick a service and choose a time that suits your day — right from our website or WhatsApp.",
    icon: "ri-calendar-check-line",
  },
  {
    step: "02",
    title: "We roll up to you",
    description:
      "Our fully equipped grooming van parks outside your home. Water, power and warmth are all self-contained inside.",
    icon: "ri-truck-line",
  },
  {
    step: "03",
    title: "Stress-free spa time",
    description:
      "Your pet is groomed one-on-one by a certified specialist — no cages, no other animals, no long waits.",
    icon: "ri-heart-pulse-line",
  },
  {
    step: "04",
    title: "Fresh, happy, home",
    description:
      "We hand your pet back at your door, smelling amazing and looking beautiful — usually in under 90 minutes.",
    icon: "ri-home-smile-line",
  },
];

export const whyUs = [
  {
    icon: "ri-user-heart-line",
    title: "One pet at a time",
    description:
      "Zero cages, zero waiting room. Your pet gets our groomer's full, calm attention from start to finish.",
  },
  {
    icon: "ri-map-pin-time-line",
    title: "Zero drive time for you",
    description:
      "No traffic, no carrier stress, no double trips. We come to your driveway, villa gate or apartment lobby.",
  },
  {
    icon: "ri-flask-line",
    title: "Organic, pet-safe products",
    description:
      "Organic, paraben-free shampoos and conditioners — gentle enough for sensitive skin, kittens and puppies.",
  },
  {
    icon: "ri-shield-star-line",
    title: "Fully insured team",
    description:
      "Every groomer is trained, certified and covered by full public-liability insurance for total peace of mind.",
  },
  {
    icon: "ri-medal-line",
    title: "Salon-grade equipment",
    description:
      "Hydro-tubs, low-noise dryers and cordless clippers — the same tools used in top luxury pet salons.",
  },
  {
    icon: "ri-24-hours-line",
    title: "Same-week bookings",
    description:
      "Need a groom for a shoot, a trip or a visit tomorrow? We keep same-week slots open for our clients.",
  },
];

export const packages = [
  {
    name: "Basic Grooming",
    subtitle: "Ideal for regular upkeep",
    priceServiceId: "cat-basic",
    price: "AED 180",
    priceNote: "S & cat · 9kg – 13kg",
    features: [
      "Double wash with organic shampoo",
      "Organic conditioner",
      "Hair combing",
      "De-shedding removal",
      "Ear cleaning",
      "Eye cleaning",
      "Nail clipping & polish",
      "Organic body spray",
      "Teeth brushing",
      "Organic breath spray",
      "Facial treatment",
      "Free Checkup Service",
    ],
    highlighted: false,
  },
  {
    name: "Full Grooming",
    subtitle: "Our most popular package",
    priceServiceId: "cat-full",
    price: "AED 230",
    priceNote: "S & cat · 9kg – 13kg",
    features: [
      "Double wash with organic shampoo",
      "Organic conditioner",
      "Hair combing",
      "De-shedding removal",
      "Ear cleaning",
      "Eye cleaning",
      "Nail clipping & polish",
      "Organic body spray",
      "Organic breath spray",
      "Facial treatment",
      "Tooth brushing",
      "Sensitive-area shaving",
      "Paw shaving",
      "Breed cut",
      "Free Checkup Service",
    ],
    highlighted: true,
  },
  {
    name: "Deep Cleaning",
    subtitle: "The deepest clean available",
    priceServiceId: "cat-deep",
    price: "AED 280",
    priceNote: "S & cat · 9kg – 13kg",
    features: [
      "Triple wash with organic shampoo",
      "Organic conditioner",
      "Hair combing",
      "De-shedding removal",
      "Ear cleaning",
      "Eye cleaning",
      "Nail clipping & polish",
      "Organic body spray",
      "Organic breath spray",
      "Facial treatment",
      "Tooth brushing",
      "Sensitive-area shaving",
      "Paw shaving",
      "Breed cut",
      "Mouthwash (removes bacteria & odours)",
      "Paw palm & polish",
      "De-matting",
      "Anal glands expressed",
      "Free Checkup Service",
    ],
    highlighted: false,
  },
];

export const faq = [
  {
    q: "How does mobile pet grooming actually work?",
    a: "Our fully equipped grooming van parks right outside your home. It has warm water, power, ventilation and everything a full salon has — just on wheels. Your pet is groomed one-on-one inside, and we bring them back to your door once we're done.",
  },
  {
    q: "Which areas do you cover?",
    a: "We serve Abu Dhabi and Al Ain, along with all the surrounding islands and neighbourhoods — including Yas Island, Saadiyat Island, Jubail Island, Al Reem Island and Al Fahid Island. Not sure if we reach your area? Just message us and we'll confirm.",
  },
  {
    q: "Do you groom cats and other pets as well as dogs?",
    a: "Absolutely — we groom cats, dogs, birds and bunnies. Our dedicated cat grooming range is designed by a certified feline specialist in a quiet, cage-free environment, so your cat feels safe throughout the session.",
  },
  {
    q: "What does the complimentary checkup service include?",
    a: "Every grooming package includes a free checkup service. While your pet is being groomed, our specialist gives them a quick once-over — checking the coat, skin, ears, eyes, nails and paws — and flags anything that may need a vet's attention.",
  },
  {
    q: "How long does a full grooming session take?",
    a: "Most sessions take between 45 and 150 minutes, depending on your pet's size, coat type and the service you've booked. We'll always give you an accurate estimate at the time of booking.",
  },
  {
    q: "Are your products safe for sensitive skin?",
    a: "Yes. We only use organic, paraben-free, pet-safe shampoos and conditioners. If your pet has known allergies, just let us know when booking and we'll adjust accordingly.",
  },
];

export const galleryImages = [
  {
    src: "https://readdy.ai/api/search-image?query=happy%20fluffy%20golden%20retriever%20freshly%20groomed%20sitting%20on%20a%20soft%20cream%20blanket%20with%20deep%20royal%20purple%20background%2C%20natural%20daylight%2C%20editorial%20pet%20photography%2C%20clean%20minimal%20composition%2C%20warm%20tones&width=800&height=1000&seq=pc-gallery-01&orientation=portrait&nocache=true",
    alt: "Freshly groomed golden retriever",
  },
  {
    src: "https://readdy.ai/api/search-image?query=beautiful%20fluffy%20persian%20cat%20with%20deep%20purple%20background%2C%20professional%20pet%20portrait%20photography%2C%20clean%20soft%20light%2C%20luxurious%20grooming%20aesthetic%2C%20purple%20and%20gold%20studio%20tones&width=800&height=1000&seq=pc-gallery-02&orientation=portrait&nocache=true",
    alt: "Groomed persian cat",
  },
  {
    src: "https://readdy.ai/api/search-image?query=cute%20small%20maltese%20dog%20with%20perfect%20haircut%20and%20small%20bow%20tie%2C%20deep%20royal%20purple%20background%2C%20editorial%20pet%20photography%20soft%20natural%20light%2C%20clean%20minimal%20composition&width=800&height=1000&seq=pc-gallery-03&orientation=portrait&nocache=true",
    alt: "Small dog after grooming",
  },
  {
    src: "https://readdy.ai/api/search-image?query=elegant%20black%20french%20bulldog%20freshly%20bathed%20with%20deep%20purple%20studio%20background%2C%20premium%20pet%20photography%2C%20soft%20natural%20window%20light%2C%20professional%20grooming%20portrait%2C%20warm%20color%20palette&width=800&height=1000&seq=pc-gallery-04&orientation=portrait&nocache=true",
    alt: "French bulldog after bath",
  },
  {
    src: "https://readdy.ai/api/search-image?query=fluffy%20pomeranian%20dog%20looking%20up%20cutely%20with%20deep%20purple%20studio%20background%2C%20professional%20pet%20portrait%2C%20editorial%20photography%20warm%20natural%20light%2C%20luxurious%20pet%20grooming%20aesthetic&width=800&height=1000&seq=pc-gallery-05&orientation=portrait&nocache=true",
    alt: "Groomed pomeranian",
  },
  {
    src: "https://readdy.ai/api/search-image?query=cute%20british%20shorthair%20kitten%20being%20gently%20brushed%20with%20deep%20purple%20and%20gold%20background%2C%20soft%20window%20light%2C%20editorial%20pet%20photography%2C%20premium%20grooming%20salon%20aesthetic&width=800&height=1000&seq=pc-gallery-06&orientation=portrait&nocache=true",
    alt: "Kitten being brushed",
  },
];

export const serviceAreas = [
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
];

export const partners = [
  "Vet Approved",
  "Fear Free Certified",
  "IPG Member",
  "Abu Dhabi Municipality Licensed",
  "Pet Insurance Partner",
  "Cruelty-Free Products",
];

// Daily 2-hour arrival windows available for mobile grooming bookings.
export const bookingSlots = [
  "9:30 AM – 11:30 AM",
  "11:30 AM – 1:30 PM",
  "1:30 PM – 3:30 PM",
  "3:30 PM – 5:30 PM",
  "5:30 PM – 7:30 PM",
  "7:30 PM – 9:30 PM",
  "9:30 PM – 11:30 PM",
];
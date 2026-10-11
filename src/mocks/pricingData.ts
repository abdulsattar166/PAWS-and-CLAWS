// Full client service & price menu.
// Prices are stored in AED (numbers taken directly from the client's price list).
// Every grooming tier includes a Free Checkup Service.

export const ALA_CARTE_NOTE = "Add-on services — book any of these alongside a groom.";

// 1 Wash and Trimming · 2 Basic · 3 Full · 4 Deep cleaning
export const groomingTiers = [
  {
    id: "wash-trimming",
    name: "Wash and Trimming",
    serviceCount: 5,
    summary:
      "A fresh double-wash and tidy-up that keeps the coat clean, soft and lightly scented — no cutting involved.",
    includes: [
      "Double wash with organic shampoo",
      "Organic conditioner",
      "Hair combing",
      "De-shedding removal",
      "Organic body spray",
      "Free Checkup Service",
    ],
    prices: [
      { size: "S & Cat", weight: "9kg – 13kg", price: "AED 130" },
      { size: "M", weight: "13kg – 22kg", price: "AED 180" },
      { size: "L", weight: "22kg – 40kg", price: "AED 230" },
      { size: "XL", weight: "40kg and up", price: "AED 280" },
    ],
  },
  {
    id: "basic-grooming",
    name: "Basic Grooming",
    serviceCount: 11,
    summary:
      "The complete everyday groom — wash, tidy and polish, finished with a breath-fresh touch and a free checkup.",
    includes: [
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
    prices: [
      { size: "S & Cat", weight: "9kg – 13kg", price: "AED 180" },
      { size: "M", weight: "13kg – 22kg", price: "AED 230" },
      { size: "L", weight: "22kg – 40kg", price: "AED 280" },
      { size: "XL", weight: "40kg and up", price: "AED 330" },
    ],
  },
  {
    id: "full-grooming",
    name: "Full Grooming",
    serviceCount: 14,
    summary:
      "Everything in Basic plus a tailored haircut and gentle detailing — our most popular all-round package.",
    includes: [
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
    prices: [
      { size: "S & Cat", weight: "9kg – 13kg", price: "AED 230" },
      { size: "M", weight: "13kg – 22kg", price: "AED 280" },
      { size: "L", weight: "22kg – 40kg", price: "AED 330" },
      { size: "XL", weight: "40kg and up", price: "AED 380" },
    ],
  },
  {
    id: "deep-cleaning",
    name: "Deep Cleaning",
    serviceCount: 18,
    summary:
      "Our most intensive clean — a triple wash with full detailing from nose to tail for a complete reset.",
    includes: [
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
    prices: [
      { size: "S & Cat", weight: "9kg – 13kg", price: "AED 280" },
      { size: "M", weight: "13kg – 22kg", price: "AED 330" },
      { size: "L", weight: "22kg – 40kg", price: "AED 380" },
      { size: "XL", weight: "40kg and up", price: "AED 430" },
    ],
  },
];

// 5 · Other animals
export const otherAnimalPrices = [
  {
    id: "rabbits",
    name: "Rabbits Full Grooming",
    serviceCount: 8,
    price: "AED 170",
    includes: [
      "Double wash with organic shampoo",
      "Organic conditioner",
      "Hair combing",
      "De-shedding",
      "Ear cleaning",
      "Eye cleaning",
      "Nail clipping & polish",
      "Organic body spray",
      "Free Checkup Service",
    ],
  },
  {
    id: "birds",
    name: "Birds Full Grooming",
    serviceCount: 6,
    price: "AED 170",
    includes: [
      "Double wash with special bird shampoo",
      "Organic conditioner",
      "Nail clipping & polish",
      "Beak polish",
      "Special wing cut",
      "Organic conditioner spray",
      "Free Checkup Service",
    ],
  },
];

// 6 · Medical services (add-on baths)
export const medicalServices = [
  {
    id: "flea-tick-bath",
    name: "Flea & Tick Medical Bath",
    price: "AED 90",
    note: "Extra",
    icon: "ri-bug-2-line",
    description:
      "Medicated shampoo to remove flea and tick bodies from the skin, Fibrotec pills to prevent future infestations, and body-sterilisation medicine for comprehensive prevention.",
  },
  {
    id: "fungal-bath",
    name: "Fungal Medicated Bath",
    price: "AED 90",
    note: "Extra",
    icon: "ri-first-aid-kit-line",
    description:
      "Medicated fungus shampoo that disinfects and deeply cleans the affected areas — a targeted antifungal treatment to soothe and clear fungal conditions.",
  },
];

// 7 · Haircut base pricing
export const hairCutServices = [
  {
    id: "shaving",
    name: "Shaving Hair",
    price: "AED 80",
    note: "If extra",
    description: "Shave or fully remove the coat for a clean, low-maintenance finish.",
  },
  {
    id: "trimming",
    name: "Trimming",
    price: "AED 130",
    note: "",
    description:
      "Trimming and cutting away extra growth so the coat sits neatly and suits your pet's type.",
  },
  {
    id: "style-cut",
    name: "Style Cut",
    price: "AED 180",
    note: "",
    description:
      "Instinctive hair styling shaped to your choice — lion cut, summer cut, teddy bear cut and more.",
  },
  {
    id: "showstar-cut",
    name: "Showstar Cut",
    price: "AED 230",
    note: "",
    description:
      "Distinctive international show cuts, especially for pets in shows and tournaments — toy poodle, Pomeranian, bichon frise, Maltese and schnauzer trims.",
  },
];

// 8 · Cat haircut styles (each includes a Free Checkup Service)
export const catHaircutStyles = [
  {
    id: "cat-lion",
    name: "Lion Cut",
    description:
      "A bold, majestic style where the body fur is clipped short, leaving a thick, luxurious mane around the head and neck — finished with fluffy boots on the paws and a pom-pom on the tail.",
  },
  {
    id: "cat-panther",
    name: "Panther Cut",
    description:
      "A smooth, very short all-over shave that gives your feline a sleek, athletic and shiny look, just like a wild panther. Excellent for extremely easy maintenance.",
  },
  {
    id: "cat-crocodile",
    name: "Crocodile Cut",
    description:
      "A fun, edgy and creative look with a distinct ridge of longer fur running down the spine, while the sides of the body are shaved completely short.",
  },
  {
    id: "cat-round-face",
    name: "Round Face Cut",
    description:
      "The body is groomed neatly while the focus stays on carefully scissoring the facial fur into a perfect, plush circle to highlight your cat's adorable eyes and expressions.",
  },
  {
    id: "cat-trimming",
    name: "Trimming Cut",
    description:
      "A gentle touch-up that only snips away uneven ends, extra growth and stray hairs — maintaining the natural coat shape while keeping your pet neat and well-kept.",
  },
  {
    id: "cat-summer",
    name: "Summer Cut",
    description:
      "Designed specifically to beat the heat — the coat is taken down to a comfortable, breathable length all over, reducing shedding and keeping your cat fresh.",
  },
  {
    id: "cat-kitten",
    name: "Kitten Cut",
    description:
      "Leaves the fur at a soft, manageable medium length across the whole body, giving even adult cats the fluffy, youthful and innocent look of a little kitten.",
  },
];

// 9 · Dog haircut styles (each includes a Free Checkup Service)
export const dogHaircutStyles = [
  {
    id: "dog-teddy-bear",
    name: "Teddy Bear Cut",
    description:
      "An incredibly popular, cuddly style that leaves the fur at a uniform, plush length across the body, with the face expertly rounded to look just like a stuffed toy.",
  },
  {
    id: "dog-poodle",
    name: "Poodle Cut",
    description:
      "A classic, elegant trim made for show and style — a neatly shaved face and feet, contrasted with stylised, voluminous pom-poms on the legs, tail and topknot.",
  },
  {
    id: "dog-summer",
    name: "Summer Cut",
    description:
      "A breezy, lightweight and practical clip that shortens the coat for the hotter months, keeping your dog cool, comfortable and easy to clean after outdoor play.",
  },
  {
    id: "dog-shaved-body",
    name: "Shaved Body",
    description:
      "A complete, close-to-the-skin removal of the coat — ultimate relief in extreme heat and the perfect fresh start for heavily matted or tangled fur.",
  },
  {
    id: "dog-trimming",
    name: "Trimming Cut",
    description:
      "A basic maintenance groom that neatens up the edges — carefully snipping around the paws, eyes and sanitary areas without taking off the main coat length.",
  },
];

// 10 · Extra services
export const extraServices = [
  { id: "anal-glands", name: "Anal Glands Expressed", price: "AED 20" },
  { id: "nail-trimming", name: "Nail Trimming", price: "AED 20" },
  { id: "teeth-brushing", name: "Teeth Brushing", price: "AED 20" },
  { id: "mouthwash", name: "Mouthwash", price: "AED 20" },
  { id: "paw-balm", name: "Natural Paw Balm", price: "AED 20" },
  { id: "de-matting", name: "De-matting Remove", price: "AED 50" },
];

// Extra time charges
export const extraTimeCharges = [
  { name: "De-matting", price: "AED 50 extra" },
  { name: "De-shedding", price: "AED 50 extra" },
];

// Grooming time guide (approximate session duration by size)
export const groomingTiming = [
  {
    service: "Wash",
    rows: [
      { label: "Kitten", time: "20 min" },
      { label: "S", time: "25 min" },
      { label: "M", time: "30 min" },
      { label: "L", time: "40 min" },
      { label: "XL", time: "45 min" },
    ],
  },
  {
    service: "Basic Grooming",
    rows: [
      { label: "Kitten", time: "30 min" },
      { label: "S", time: "35 min" },
      { label: "M", time: "40 min" },
      { label: "L", time: "50 min" },
      { label: "XL", time: "55 min" },
    ],
  },
  {
    service: "Full Grooming",
    rows: [
      { label: "S", time: "45 min" },
      { label: "M", time: "55 min" },
      { label: "L", time: "1 hr" },
      { label: "XL", time: "1 hr 15 min" },
    ],
  },
  {
    service: "Deep Cleaning",
    rows: [
      { label: "Kitten", time: "50 min" },
      { label: "S", time: "55 min" },
      { label: "M", time: "1 hr" },
      { label: "L", time: "1 hr 15 min" },
      { label: "XL", time: "1 hr 30 min" },
    ],
  },
];

export const otherAnimalTiming = [
  { label: "Bird", time: "25 min" },
  { label: "Rabbit", time: "30 min" },
];
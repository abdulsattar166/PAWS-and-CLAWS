// Complete gallery data — every single service in the client's menu has its own
// dedicated gallery with exactly 3 images. Images are professional pet grooming
// photography kept consistent with the purple + gold brand identity.

export const galleryCategories = [
  { id: "all", label: "All Services" },
  { id: "packages", label: "Grooming Packages" },
  { id: "animals", label: "Other Animals" },
  { id: "haircut-services", label: "Haircut Services" },
  { id: "cat-styles", label: "Cat Haircut Styles" },
  { id: "dog-styles", label: "Dog Haircut Styles" },
  { id: "medical", label: "Medical Baths" },
  { id: "extras", label: "Extra Add-ons" },
];

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface GalleryService {
  id: string;
  category: string;
  name: string;
  tagline: string;
  images: GalleryImage[];
}

export const galleryServices: GalleryService[] = [
  // ───────────────────────── GROOMING PACKAGES ─────────────────────────
  {
    id: "wash-trimming",
    category: "packages",
    name: "Wash and Trimming",
    tagline: "A fresh double-wash and tidy-up with no cutting",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20golden%20retriever%20enjoying%20a%20warm%20bubbly%20bath%20with%20organic%20shampoo%20lather%20on%20its%20coat%20while%20a%20groomer%20gently%20scrubs%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20high%20detail%20wet%20fur%20texture&width=800&height=800&seq=gal-wash-trim-1&orientation=squarish", alt: "Wash and Trimming — dog enjoying a warm organic shampoo bath" },
      { src: "https://readdy.ai/api/search-image?query=a%20freshly%20bathed%20white%20maltese%20dog%20being%20gently%20blow%20dried%20and%20brushed%20by%20a%20professional%20groomer%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20fluffy%20clean%20fur&width=800&height=800&seq=gal-wash-trim-2&orientation=squarish", alt: "Wash and Trimming — blow drying a clean white dog" },
      { src: "https://readdy.ai/api/search-image?query=a%20clean%20happy%20cat%20being%20softly%20combed%20after%20a%20gentle%20wash%2C%20sitting%20on%20a%20soft%20purple%20grooming%20towel%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20silky%20coat&width=800&height=800&seq=gal-wash-trim-3&orientation=squarish", alt: "Wash and Trimming — gentle combing after a cat wash" },
    ],
  },
  {
    id: "basic-grooming",
    category: "packages",
    name: "Basic Grooming",
    tagline: "The complete everyday groom with a free checkup",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20carefully%20brushing%20the%20coat%20of%20a%20fluffy%20samoyed%20dog%20with%20a%20slicker%20brush%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20high%20detail%20fur&width=800&height=800&seq=gal-basic-1&orientation=squarish", alt: "Basic Grooming — coat brushing for a fluffy dog" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20cleaning%20the%20ears%20of%20a%20calm%20beagle%20dog%20using%20a%20soft%20cotton%20pad%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20gentle%20care&width=800&height=800&seq=gal-basic-2&orientation=squarish", alt: "Basic Grooming — gentle ear cleaning for a beagle" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20trimming%20and%20polishing%20the%20nails%20of%20a%20small%20shih%20tzu%20dog%20held%20gently%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20close%20detail&width=800&height=800&seq=gal-basic-3&orientation=squarish", alt: "Basic Grooming — nail clipping and polish" },
    ],
  },
  {
    id: "full-grooming",
    category: "packages",
    name: "Full Grooming",
    tagline: "Wash, tidy and a tailored haircut",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20perfectly%20groomed%20poodle%20dog%20with%20a%20fresh%20stylish%20haircut%20sitting%20proudly%20and%20looking%20at%20the%20camera%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20sculpted%20coat&width=800&height=800&seq=gal-full-1&orientation=squarish", alt: "Full Grooming — a perfectly styled poodle" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20using%20scissors%20to%20shape%20the%20face%20of%20a%20bichon%20frise%20dog%20during%20a%20full%20grooming%20session%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-full-2&orientation=squarish", alt: "Full Grooming — scissoring a bichon frise face" },
      { src: "https://readdy.ai/api/search-image?query=a%20happy%20fluffy%20persian%20cat%20with%20a%20beautifully%20rounded%20groomed%20coat%20sitting%20elegantly%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20plush%20fur&width=800&height=800&seq=gal-full-3&orientation=squarish", alt: "Full Grooming — a groomed persian cat" },
    ],
  },
  {
    id: "deep-cleaning",
    category: "packages",
    name: "Deep Cleaning",
    tagline: "An intensive nose-to-tail reset",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20large%20golden%20retriever%20receiving%20a%20deep%20spa%20treatment%20with%20rich%20lather%20and%20a%20groomer%20massaging%20the%20coat%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-deep-1&orientation=squarish", alt: "Deep Cleaning — intensive spa treatment" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20carefully%20de-matting%20the%20thick%20fur%20of%20a%20long%20haired%20dog%20with%20a%20detangling%20comb%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20detailed%20care&width=800&height=800&seq=gal-deep-2&orientation=squarish", alt: "Deep Cleaning — de-matting thick fur" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20applying%20natural%20paw%20balm%20to%20the%20paw%20of%20a%20relaxed%20dog%20during%20a%20deep%20cleaning%20session%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-deep-3&orientation=squarish", alt: "Deep Cleaning — natural paw balm application" },
    ],
  },

  // ───────────────────────── OTHER ANIMALS ─────────────────────────
  {
    id: "rabbits-full",
    category: "animals",
    name: "Rabbits Full Grooming",
    tagline: "Soft, clean and comfortable rabbits",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20fluffy%20white%20rabbit%20being%20gently%20brushed%20by%20a%20groomer%20with%20a%20soft%20slicker%20brush%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20soft%20fur&width=800&height=800&seq=gal-rabbit-1&orientation=squarish", alt: "Rabbits Full Grooming — gentle brushing" },
      { src: "https://readdy.ai/api/search-image?query=a%20calm%20brown%20rabbit%20wrapped%20in%20a%20soft%20towel%20after%20a%20gentle%20bath%20looking%20relaxed%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-rabbit-2&orientation=squarish", alt: "Rabbits Full Grooming — cozy after bath" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20trimming%20the%20nails%20of%20a%20grey%20rabbit%20held%20gently%20and%20securely%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20close%20detail&width=800&height=800&seq=gal-rabbit-3&orientation=squarish", alt: "Rabbits Full Grooming — nail trimming" },
    ],
  },
  {
    id: "birds-full",
    category: "animals",
    name: "Birds Full Grooming",
    tagline: "Complete care for your feathered friend",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20colorful%20parakeet%20perched%20calmly%20while%20a%20groomer%20gently%20tends%20to%20its%20feathers%20with%20careful%20hands%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-bird-1&orientation=squarish", alt: "Birds Full Grooming — feather care" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20gently%20washing%20a%20calm%20white%20cockatoo%20with%20bird%20safe%20shampoo%20and%20warm%20water%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-bird-2&orientation=squarish", alt: "Birds Full Grooming — gentle bird wash" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20carefully%20polishing%20the%20beak%20and%20trimming%20the%20wings%20of%20a%20calm%20parrot%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-bird-3&orientation=squarish", alt: "Birds Full Grooming — beak polish and wing trim" },
    ],
  },

  // ───────────────────────── HAIRCUT SERVICES ─────────────────────────
  {
    id: "shaving-hair",
    category: "haircut-services",
    name: "Shaving Hair",
    tagline: "A clean, low-maintenance shave",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20using%20cordless%20clippers%20to%20shave%20the%20body%20of%20a%20dog%20leaving%20a%20short%20clean%20coat%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-shaving-1&orientation=squarish", alt: "Shaving Hair — clippers shaving a dog" },
      { src: "https://readdy.ai/api/search-image?query=a%20freshly%20shaved%20dog%20with%20a%20smooth%20very%20short%20coat%20sitting%20relaxed%20and%20comfortable%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-shaving-2&orientation=squarish", alt: "Shaving Hair — smooth short coat result" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20shaving%20the%20body%20of%20a%20cat%20with%20gentle%20clippers%20leaving%20a%20sleek%20smooth%20coat%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-shaving-3&orientation=squarish", alt: "Shaving Hair — sleek shaved cat" },
    ],
  },
  {
    id: "trimming",
    category: "haircut-services",
    name: "Trimming",
    tagline: "Neatening up the coat edges",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20trimming%20the%20fur%20around%20the%20paws%20of%20a%20dog%20with%20small%20precise%20scissors%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-trimming-1&orientation=squarish", alt: "Trimming — scissoring around paws" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20carefully%20trimming%20the%20hair%20around%20the%20eyes%20of%20a%20fluffy%20dog%20for%20a%20neat%20tidy%20look%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-trimming-2&orientation=squarish", alt: "Trimming — neatening around the eyes" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20trimming%20the%20coat%20of%20a%20cat%20to%20keep%20it%20neat%20and%20well%20kept%20with%20gentle%20scissors%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-trimming-3&orientation=squarish", alt: "Trimming — tidy cat coat" },
    ],
  },
  {
    id: "style-cut",
    category: "haircut-services",
    name: "Style Cut",
    tagline: "A creative style shaped to your choice",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20stylishly%20groomed%20dog%20with%20a%20fashionable%20modern%20haircut%20standing%20confidently%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-style-1&orientation=squarish", alt: "Style Cut — fashionable modern haircut" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20sculpting%20an%20artistic%20stylish%20haircut%20on%20a%20dog%20with%20scissors%20and%20clippers%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-style-2&orientation=squarish", alt: "Style Cut — sculpting an artistic cut" },
      { src: "https://readdy.ai/api/search-image?query=a%20cat%20with%20a%20creative%20styled%20haircut%20sitting%20proudly%20showing%20a%20fashionable%20look%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-style-3&orientation=squarish", alt: "Style Cut — creative cat style" },
    ],
  },
  {
    id: "showstar-cut",
    category: "haircut-services",
    name: "Showstar Cut",
    tagline: "International show-quality finishing",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20show%20ready%20toy%20poodle%20with%20an%20elaborate%20classic%20show%20cut%20and%20pom%20poms%20standing%20in%20a%20perfect%20pose%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-showstar-1&orientation=squarish", alt: "Showstar Cut — show-ready toy poodle" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20perfecting%20an%20elaborate%20show%20style%20haircut%20on%20a%20pomeranian%20with%20precise%20scissors%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-showstar-2&orientation=squarish", alt: "Showstar Cut — elaborate pomeranian show style" },
      { src: "https://readdy.ai/api/search-image?query=a%20beautifully%20groomed%20bichon%20frise%20with%20a%20flawless%20round%20show%20cut%20looking%20elegant%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-showstar-3&orientation=squarish", alt: "Showstar Cut — flawless bichon frise" },
    ],
  },

  // ───────────────────────── CAT HAIRCUT STYLES ─────────────────────────
  {
    id: "cat-lion",
    category: "cat-styles",
    name: "Lion Cut",
    tagline: "Majestic mane with fluffy boots and pom-pom",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20long%20haired%20cat%20with%20a%20bold%20lion%20cut%20showing%20a%20thick%20luxurious%20mane%20around%20the%20head%20and%20neck%20and%20a%20shaved%20body%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-lion-1&orientation=squarish", alt: "Lion Cut — majestic mane around head and neck" },
      { src: "https://readdy.ai/api/search-image?query=a%20cat%20with%20a%20lion%20cut%20showing%20fluffy%20boots%20of%20fur%20on%20the%20paws%20and%20a%20pom%20pom%20on%20the%20tail%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-lion-2&orientation=squarish", alt: "Lion Cut — fluffy boots and pom-pom tail" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20sculpting%20a%20lion%20cut%20mane%20on%20a%20calm%20cat%20with%20clippers%20and%20scissors%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-lion-3&orientation=squarish", alt: "Lion Cut — grooming the mane" },
    ],
  },
  {
    id: "cat-panther",
    category: "cat-styles",
    name: "Panther Cut",
    tagline: "Sleek, athletic all-over shave",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20sleek%20black%20cat%20with%20a%20smooth%20very%20short%20all%20over%20panther%20cut%20looking%20athletic%20and%20shiny%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-panther-1&orientation=squarish", alt: "Panther Cut — sleek athletic short coat" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20shaving%20a%20cat%20very%20short%20all%20over%20with%20clippers%20to%20create%20a%20smooth%20panther%20like%20appearance%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-panther-2&orientation=squarish", alt: "Panther Cut — clippers for smooth shave" },
      { src: "https://readdy.ai/api/search-image?query=a%20glossy%20shorthair%20cat%20with%20a%20sleek%20panther%20cut%20stretching%20elegantly%20showing%20its%20smooth%20shiny%20coat%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-panther-3&orientation=squarish", alt: "Panther Cut — glossy smooth coat" },
    ],
  },
  {
    id: "cat-crocodile",
    category: "cat-styles",
    name: "Crocodile Cut",
    tagline: "Edgy ridge of fur down the spine",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20cat%20with%20a%20crocodile%20cut%20showing%20a%20distinct%20ridge%20of%20longer%20fur%20running%20down%20the%20spine%20while%20the%20sides%20are%20shaved%20short%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-croc-1&orientation=squarish", alt: "Crocodile Cut — ridge of fur down the spine" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20creating%20a%20crocodile%20cut%20by%20shaving%20the%20sides%20of%20a%20cat%20and%20leaving%20a%20crest%20along%20the%20back%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-croc-2&orientation=squarish", alt: "Crocodile Cut — shaving sides leaving crest" },
      { src: "https://readdy.ai/api/search-image?query=a%20playful%20cat%20with%20a%20fun%20crocodile%20cut%20showing%20a%20spiked%20crest%20along%20its%20spine%20from%20a%20side%20angle%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-croc-3&orientation=squarish", alt: "Crocodile Cut — spiked crest side view" },
    ],
  },
  {
    id: "cat-round-face",
    category: "cat-styles",
    name: "Round Face Cut",
    tagline: "A perfect plush circle around the face",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20fluffy%20cat%20with%20a%20round%20face%20cut%20showing%20a%20perfect%20plush%20circular%20face%20framing%20its%20adorable%20eyes%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-round-1&orientation=squarish", alt: "Round Face Cut — perfect plush circular face" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20carefully%20scissoring%20the%20facial%20fur%20of%20a%20cat%20into%20a%20perfect%20round%20shape%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-round-2&orientation=squarish", alt: "Round Face Cut — scissoring facial fur" },
      { src: "https://readdy.ai/api/search-image?query=a%20cute%20cat%20with%20a%20perfectly%20rounded%20plush%20face%20looking%20at%20the%20camera%20with%20bright%20expressive%20eyes%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-round-3&orientation=squarish", alt: "Round Face Cut — expressive rounded face" },
    ],
  },
  {
    id: "cat-trimming",
    category: "cat-styles",
    name: "Trimming Cut",
    tagline: "A gentle touch-up of the coat",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20gently%20snipping%20away%20uneven%20ends%20and%20stray%20hairs%20on%20a%20calm%20cat%20to%20keep%20its%20coat%20neat%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-trim-1&orientation=squarish", alt: "Trimming Cut — snipping stray hairs" },
      { src: "https://readdy.ai/api/search-image?query=a%20cat%20with%20a%20neatly%20maintained%20natural%20coat%20shape%20after%20a%20gentle%20trimming%20touch%20up%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-trim-2&orientation=squarish", alt: "Trimming Cut — neat natural coat" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20trimming%20the%20fur%20around%20the%20sanitary%20area%20of%20a%20cat%20with%20careful%20precise%20scissors%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-trim-3&orientation=squarish", alt: "Trimming Cut — precise sanitary trim" },
    ],
  },
  {
    id: "cat-summer",
    category: "cat-styles",
    name: "Summer Cut",
    tagline: "A breathable length to beat the heat",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20cat%20with%20a%20short%20comfortable%20summer%20cut%20looking%20fresh%20and%20cool%20with%20a%20light%20breathable%20coat%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-summer-1&orientation=squarish", alt: "Summer Cut — fresh breathable coat" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20clipping%20a%20cat%20down%20to%20a%20short%20summer%20length%20with%20clippers%20for%20the%20hotter%20months%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-summer-2&orientation=squarish", alt: "Summer Cut — clipping for hot months" },
      { src: "https://readdy.ai/api/search-image?query=a%20relaxed%20cat%20with%20a%20short%20summer%20coat%20lying%20comfortably%20after%20a%20grooming%20session%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-summer-3&orientation=squarish", alt: "Summer Cut — relaxed short coat" },
    ],
  },
  {
    id: "cat-kitten",
    category: "cat-styles",
    name: "Kitten Cut",
    tagline: "Fluffy, youthful medium-length coat",
    images: [
      { src: "https://readdy.ai/api/search-image?query=an%20adult%20cat%20with%20a%20kitten%20cut%20showing%20a%20soft%20medium%20length%20fluffy%20coat%20that%20looks%20youthful%20and%20innocent%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-kitten-1&orientation=squarish", alt: "Kitten Cut — soft youthful coat" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20shaping%20a%20medium%20length%20kitten%20cut%20on%20a%20fluffy%20cat%20with%20scissors%20and%20comb%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-kitten-2&orientation=squarish", alt: "Kitten Cut — shaping medium length fur" },
      { src: "https://readdy.ai/api/search-image?query=a%20cute%20fluffy%20cat%20with%20a%20soft%20medium%20kitten%20cut%20coat%20looking%20adorable%20and%20innocent%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-kitten-3&orientation=squarish", alt: "Kitten Cut — adorable fluffy look" },
    ],
  },

  // ───────────────────────── DOG HAIRCUT STYLES ─────────────────────────
  {
    id: "dog-teddy-bear",
    category: "dog-styles",
    name: "Teddy Bear Cut",
    tagline: "Plush, rounded face like a stuffed toy",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20fluffy%20dog%20with%20a%20teddy%20bear%20cut%20showing%20a%20plush%20uniform%20coat%20and%20an%20expertly%20rounded%20face%20like%20a%20stuffed%20toy%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-teddy-1&orientation=squarish", alt: "Teddy Bear Cut — plush rounded face" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20shaping%20a%20teddy%20bear%20cut%20by%20rounding%20the%20face%20of%20a%20fluffy%20dog%20with%20scissors%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-teddy-2&orientation=squarish", alt: "Teddy Bear Cut — rounding the face" },
      { src: "https://readdy.ai/api/search-image?query=a%20cuddly%20looking%20dog%20with%20a%20teddy%20bear%20cut%20sitting%20with%20a%20sweet%20expression%20and%20plush%20fur%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-teddy-3&orientation=squarish", alt: "Teddy Bear Cut — cuddly plush look" },
    ],
  },
  {
    id: "dog-poodle",
    category: "dog-styles",
    name: "Poodle Cut",
    tagline: "Classic elegant trim with pom-poms",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20poodle%20with%20a%20classic%20elegant%20show%20cut%20showing%20a%20shaved%20face%20and%20voluminous%20pom%20poms%20on%20the%20legs%20tail%20and%20topknot%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-poodle-1&orientation=squarish", alt: "Poodle Cut — elegant show pom-poms" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20sculpting%20a%20classic%20poodle%20cut%20with%20a%20shaved%20face%20and%20styled%20pom%20poms%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-poodle-2&orientation=squarish", alt: "Poodle Cut — sculpting classic style" },
      { src: "https://readdy.ai/api/search-image?query=a%20standard%20poodle%20with%20a%20refined%20classic%20trim%20and%20elegant%20topknot%20standing%20gracefully%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-poodle-3&orientation=squarish", alt: "Poodle Cut — refined topknot" },
    ],
  },
  {
    id: "dog-summer",
    category: "dog-styles",
    name: "Summer Cut",
    tagline: "A breezy lightweight clip for hot months",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20happy%20dog%20with%20a%20short%20lightweight%20summer%20cut%20looking%20cool%20and%20comfortable%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-summer-1&orientation=squarish", alt: "Summer Cut — cool lightweight coat" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20clipping%20a%20dog%20down%20to%20a%20short%20summer%20length%20with%20clippers%20for%20the%20hotter%20months%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-summer-2&orientation=squarish", alt: "Summer Cut — clipping for heat" },
      { src: "https://readdy.ai/api/search-image?query=a%20playful%20dog%20with%20a%20breezy%20summer%20cut%20running%20through%20a%20sunlit%20studio%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-summer-3&orientation=squarish", alt: "Summer Cut — playful after clip" },
    ],
  },
  {
    id: "dog-shaved-body",
    category: "dog-styles",
    name: "Shaved Body",
    tagline: "Complete close-to-skin coat removal",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20dog%20with%20a%20completely%20shaved%20body%20showing%20a%20smooth%20close%20to%20the%20skin%20coat%20for%20extreme%20heat%20relief%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-shaved-1&orientation=squarish", alt: "Shaved Body — smooth close shave" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20shaving%20a%20heavily%20matted%20dog%20coat%20completely%20short%20with%20clippers%20for%20a%20fresh%20start%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-shaved-2&orientation=squarish", alt: "Shaved Body — shaving matted coat" },
      { src: "https://readdy.ai/api/search-image?query=a%20relaxed%20dog%20with%20a%20fresh%20fully%20shaved%20coat%20sitting%20comfortably%20after%20a%20grooming%20session%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-shaved-3&orientation=squarish", alt: "Shaved Body — fresh start after shave" },
    ],
  },
  {
    id: "dog-trimming",
    category: "dog-styles",
    name: "Trimming Cut",
    tagline: "Neatening around paws, eyes and sanitary area",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20carefully%20trimming%20the%20fur%20around%20the%20paws%20of%20a%20dog%20with%20small%20scissors%20during%20maintenance%20grooming%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-trim-1&orientation=squarish", alt: "Trimming Cut — trimming around paws" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20trimming%20the%20fur%20around%20the%20eyes%20of%20a%20dog%20to%20neaten%20the%20edges%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-trim-2&orientation=squarish", alt: "Trimming Cut — neaten around eyes" },
      { src: "https://readdy.ai/api/search-image?query=a%20well%20kept%20dog%20with%20neatly%20trimmed%20edges%20around%20the%20face%20and%20paws%20after%20maintenance%20grooming%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-trim-3&orientation=squarish", alt: "Trimming Cut — neat maintained look" },
    ],
  },

  // ───────────────────────── MEDICAL BATHS ─────────────────────────
  {
    id: "flea-tick-bath",
    category: "medical",
    name: "Flea & Tick Medical Bath",
    tagline: "Medicated shampoo to remove fleas and ticks",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20applying%20medicated%20shampoo%20to%20a%20dog%20during%20a%20flea%20and%20tick%20medical%20bath%20with%20rich%20lather%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-flea-1&orientation=squarish", alt: "Flea & Tick Bath — medicated shampoo lather" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20carefully%20washing%20the%20coat%20of%20a%20dog%20with%20medicated%20flea%20treatment%20shampoo%20and%20warm%20water%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-flea-2&orientation=squarish", alt: "Flea & Tick Bath — medicated washing" },
      { src: "https://readdy.ai/api/search-image?query=a%20clean%20comfortable%20dog%20after%20a%20flea%20and%20tick%20medical%20bath%20with%20a%20healthy%20shiny%20coat%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-flea-3&orientation=squarish", alt: "Flea & Tick Bath — healthy clean coat" },
    ],
  },
  {
    id: "fungal-bath",
    category: "medical",
    name: "Fungal Medicated Bath",
    tagline: "Antifungal shampoo to disinfect the skin",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20applying%20medicated%20antifungal%20shampoo%20to%20a%20dog%20to%20disinfect%20and%20clean%20affected%20skin%20areas%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-fungal-1&orientation=squarish", alt: "Fungal Bath — antifungal shampoo application" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20carefully%20washing%20a%20cat%20with%20medicated%20fungus%20shampoo%20to%20treat%20and%20clean%20the%20affected%20areas%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-fungal-2&orientation=squarish", alt: "Fungal Bath — treating a cat" },
      { src: "https://readdy.ai/api/search-image?query=a%20calm%20relaxed%20dog%20after%20a%20fungal%20medicated%20bath%20with%20a%20clean%20healthy%20coat%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-fungal-3&orientation=squarish", alt: "Fungal Bath — clean healthy result" },
    ],
  },

  // ───────────────────────── EXTRA ADD-ONS ─────────────────────────
  {
    id: "anal-glands",
    category: "extras",
    name: "Anal Glands Expressed",
    tagline: "Gentle, professional gland care",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20professional%20groomer%20carefully%20expressing%20the%20anal%20glands%20of%20a%20calm%20dog%20with%20gloved%20hands%20in%20a%20hygienic%20grooming%20setting%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-anal-1&orientation=squarish", alt: "Anal Glands Expressed — professional care" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20preparing%20clean%20hygiene%20supplies%20for%20anal%20gland%20expression%20on%20a%20grooming%20table%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-anal-2&orientation=squarish", alt: "Anal Glands Expressed — hygienic preparation" },
      { src: "https://readdy.ai/api/search-image?query=a%20relieved%20and%20comfortable%20dog%20sitting%20happily%20after%20professional%20anal%20gland%20care%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-anal-3&orientation=squarish", alt: "Anal Glands Expressed — comfortable result" },
    ],
  },
  {
    id: "nail-trimming",
    category: "extras",
    name: "Nail Trimming",
    tagline: "Safe, precise nail clipping",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20carefully%20trimming%20the%20nails%20of%20a%20dog%20with%20professional%20nail%20clippers%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20close%20detail&width=800&height=800&seq=gal-nail-1&orientation=squarish", alt: "Nail Trimming — precise clipping" },
      { src: "https://readdy.ai/api/search-image?query=a%20close%20up%20of%20a%20groomer%20trimming%20the%20nail%20of%20a%20cat%20held%20gently%20and%20securely%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-nail-2&orientation=squarish", alt: "Nail Trimming — gentle cat nail care" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20filing%20and%20polishing%20the%20freshly%20trimmed%20nails%20of%20a%20dog%20for%20a%20smooth%20finish%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-nail-3&orientation=squarish", alt: "Nail Trimming — filing and polish" },
    ],
  },
  {
    id: "teeth-brushing",
    category: "extras",
    name: "Teeth Brushing",
    tagline: "Fresh, clean teeth and healthy gums",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20gently%20brushing%20the%20teeth%20of%20a%20dog%20with%20a%20pet%20toothbrush%20for%20fresh%20breath%20and%20healthy%20gums%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-teeth-1&orientation=squarish", alt: "Teeth Brushing — brushing dog teeth" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20applying%20pet%20toothpaste%20to%20a%20small%20brush%20before%20brushing%20a%20cat%20teeth%20carefully%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-teeth-2&orientation=squarish", alt: "Teeth Brushing — cat dental care" },
      { src: "https://readdy.ai/api/search-image?query=a%20happy%20dog%20showing%20clean%20white%20teeth%20and%20fresh%20breath%20after%20a%20dental%20brushing%20session%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-teeth-3&orientation=squarish", alt: "Teeth Brushing — clean fresh smile" },
    ],
  },
  {
    id: "mouthwash",
    category: "extras",
    name: "Mouthwash",
    tagline: "Removes bacteria and odours",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20applying%20pet%20safe%20mouthwash%20to%20a%20dog%20to%20remove%20bacteria%20and%20odours%20for%20fresh%20breath%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-mouthwash-1&orientation=squarish", alt: "Mouthwash — applying pet-safe mouthwash" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20using%20a%20gentle%20oral%20rinse%20on%20a%20calm%20cat%20to%20freshen%20breath%20and%20remove%20bacteria%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-mouthwash-2&orientation=squarish", alt: "Mouthwash — gentle oral rinse" },
      { src: "https://readdy.ai/api/search-image?query=a%20fresh%20mouthed%20happy%20dog%20with%20clean%20teeth%20after%20an%20oral%20rinse%20treatment%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-mouthwash-3&orientation=squarish", alt: "Mouthwash — fresh clean result" },
    ],
  },
  {
    id: "paw-balm",
    category: "extras",
    name: "Natural Paw Balm",
    tagline: "Soft, nourished and protected paws",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20applying%20natural%20paw%20balm%20to%20the%20paw%20pads%20of%20a%20dog%20for%20soft%20nourished%20paws%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-paw-balm-1&orientation=squarish", alt: "Natural Paw Balm — nourishing paw pads" },
      { src: "https://readdy.ai/api/search-image?query=a%20close%20up%20of%20a%20groomer%20massaging%20natural%20paw%20balm%20into%20the%20paw%20pads%20of%20a%20relaxed%20cat%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-paw-balm-2&orientation=squarish", alt: "Natural Paw Balm — massaging into pads" },
      { src: "https://readdy.ai/api/search-image?query=a%20dog%20with%20soft%20healthy%20moisturized%20paw%20pads%20after%20a%20natural%20paw%20balm%20treatment%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-paw-balm-3&orientation=squarish", alt: "Natural Paw Balm — soft healthy pads" },
    ],
  },
  {
    id: "dematting",
    category: "extras",
    name: "De-matting Remove",
    tagline: "Gently removing mats and tangles",
    images: [
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20carefully%20de-matting%20the%20tangled%20fur%20of%20a%20long%20haired%20dog%20with%20a%20detangling%20comb%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-demat-1&orientation=squarish", alt: "De-matting — detangling comb" },
      { src: "https://readdy.ai/api/search-image?query=a%20groomer%20working%20through%20a%20matted%20section%20of%20cat%20fur%20with%20a%20dematting%20tool%20and%20gentle%20hands%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-demat-2&orientation=squarish", alt: "De-matting — working through mats" },
      { src: "https://readdy.ai/api/search-image?query=a%20dog%20with%20a%20smooth%20tangle%20free%20coat%20after%20a%20complete%20de-matting%20session%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-demat-3&orientation=squarish", alt: "De-matting — smooth tangle-free coat" },
    ],
  },
];
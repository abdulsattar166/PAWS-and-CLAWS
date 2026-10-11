import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import PageTransition from "@/components/base/PageTransition";
import HeroCarousel from "@/components/feature/HeroCarousel";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useGallery, type PublicGalleryImage } from "@/hooks/useGallery";

const gallerySlides = [
  {
    image: "https://readdy.ai/api/search-image?query=stunning%20professional%20collage%20of%20four%20freshly%20groomed%20happy%20dogs%20with%20perfect%20shiny%20coats%20looking%20at%20camera%2C%20deep%20purple%20studio%20background%2C%20editorial%20pet%20photography%2C%20bright%20clean%20aesthetic%2C%20high%20detail%20fur%20textures&width=1920&height=900&seq=gal-hero-slide-01&orientation=landscape&nocache=true",
    alt: "Beautifully groomed dogs collection",
  },
  {
    image: "https://readdy.ai/api/search-image?query=elegant%20collection%20of%20three%20beautifully%20styled%20cats%20with%20glossy%20coats%20sitting%20gracefully%20on%20soft%20velvet%20cushions%2C%20deep%20purple%20and%20gold%20studio%20tones%2C%20premium%20feline%20photography%2C%20soft%20diffused%20natural%20light&width=1920&height=900&seq=gal-hero-slide-02&orientation=landscape&nocache=true",
    alt: "Elegant groomed cats collection",
  },
  {
    image: "https://readdy.ai/api/search-image?query=heartwarming%20before%20and%20after%20pet%20grooming%20transformation%20split%20scene%20showing%20happy%20dog%20with%20messy%20coat%20on%20left%20and%20perfectly%20groomed%20gorgeous%20dog%20on%20right%2C%20purple%20and%20gold%20studio%20lighting%2C%20professional%20pet%20photography%2C%20clean%20modern%20aesthetic&width=1920&height=900&seq=gal-hero-slide-03&orientation=landscape&nocache=true",
    alt: "Before and after grooming transformation",
  },
];

const categoryIcons: Record<string, string> = {
  "dog-grooming": "ri-footprint-line",
  "cat-grooming": "ri-moon-clear-line",
  "grooming-packages": "ri-gift-line",
  "haircuts-styling": "ri-scissors-cut-line",
  "before-after": "ri-arrow-left-right-line",
  "other-animals": "ri-heart-3-line",
  "special-care": "ri-first-aid-kit-line",
  packages: "ri-scissors-cut-line",
  animals: "ri-heart-3-line",
  "haircut-services": "ri-scissors-line",
  "cat-styles": "ri-moon-clear-line",
  "dog-styles": "ri-sun-line",
  medical: "ri-first-aid-kit-line",
  extras: "ri-add-circle-line",
};

function RevealWrap({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`reveal-section ${isVisible ? "is-visible" : ""}`}>
      {children}
    </div>
  );
}

export default function Gallery() {
  const { t } = useTranslation();
  const { categories, images, loading } = useGallery();
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  // Images grouped by category (only categories that actually have photos).
  const groups = useMemo(() => {
    const known = categories.map((cat) => ({
      id: cat.id,
      label: cat.label,
      items: images.filter((img) => img.categoryId === cat.id),
    }));
    const uncategorised = images.filter((img) => !img.categoryId || !categories.some((c) => c.id === img.categoryId));
    const all = known.filter((g) => g.items.length > 0);
    if (uncategorised.length > 0) all.push({ id: "uncategorised", label: "More", items: uncategorised });
    return all;
  }, [categories, images]);

  const visibleGroups = activeCategory === "all" ? groups : groups.filter((g) => g.id === activeCategory);
  const visibleImages = useMemo(() => visibleGroups.flatMap((g) => g.items), [visibleGroups]);

  const openLightbox = (id: string) => setLightboxId(id);
  const closeLightbox = () => setLightboxId(null);
  const currentIndex = lightboxId ? visibleImages.findIndex((i) => i.id === lightboxId) : -1;
  const current: PublicGalleryImage | undefined = currentIndex >= 0 ? visibleImages[currentIndex] : undefined;
  const prevImage = () => {
    if (currentIndex < 0) return;
    setLightboxId(visibleImages[(currentIndex - 1 + visibleImages.length) % visibleImages.length].id);
  };
  const nextImage = () => {
    if (currentIndex < 0) return;
    setLightboxId(visibleImages[(currentIndex + 1) % visibleImages.length].id);
  };

  return (
    <main className="min-h-screen bg-transparent text-foreground-950">
      <Navbar />
      <PageTransition>
        <HeroCarousel slides={gallerySlides} interval={4000}>
          <div className="animate-text-reveal" style={{ animationDelay: "0.2s" }}>
            <p className="text-xs uppercase tracking-[0.28em] text-foreground-700 font-semibold flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-px bg-foreground-700"></span>
              {t("gallery.label")}
            </p>
          </div>
          <h1 className="font-heading text-2xl md:text-5xl text-foreground-950 leading-tight animate-text-reveal" style={{ animationDelay: "0.35s" }}>
            {t("gallery.heading")}{" "}
            <span className="italic">{t("gallery.heading_italic")}</span>
          </h1>
        </HeroCarousel>

        <section className="py-14 md:py-20 px-4 md:px-10 bg-background-50/92">
          <div className="max-w-7xl mx-auto">
            {/* Category filter */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12 md:mb-16">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap cursor-pointer transition-all duration-300 border ${
                  activeCategory === "all"
                    ? "bg-primary-500 text-foreground-50 border-primary-500"
                    : "bg-background-100/70 text-foreground-700 border-background-200/70 hover:border-primary-400/60 hover:text-foreground-950"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap cursor-pointer transition-all duration-300 border ${
                    activeCategory === cat.id
                      ? "bg-primary-500 text-foreground-50 border-primary-500"
                      : "bg-background-100/70 text-foreground-700 border-background-200/70 hover:border-primary-400/60 hover:text-foreground-950"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton aspect-[4/3] rounded-2xl"></div>
                ))}
              </div>
            )}

            {!loading && visibleImages.length === 0 && (
              <div className="text-center py-16">
                <span className="mx-auto w-14 h-14 rounded-full bg-background-100 text-foreground-500 flex items-center justify-center">
                  <i className="ri-image-2-line text-2xl" aria-hidden="true"></i>
                </span>
                <p className="mt-4 font-semibold text-foreground-950">No photos here yet</p>
                <p className="mt-1 text-sm text-foreground-600">Check back soon for fresh faces and happy tails.</p>
              </div>
            )}

            <div className="space-y-14 md:space-y-20">
              {visibleGroups.map((group) => (
                <RevealWrap key={group.id}>
                  <div>
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                      <span className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-accent-500/15 text-accent-500 flex items-center justify-center shrink-0">
                        <i className={`${categoryIcons[group.id] ?? "ri-footprint-line"} text-xl md:text-2xl`} aria-hidden="true"></i>
                      </span>
                      <div>
                        <h2 className="font-heading text-2xl md:text-3xl text-foreground-950">{group.label}</h2>
                        <p className="text-xs md:text-sm text-foreground-600 mt-1">
                          {group.items.length} {group.items.length === 1 ? "photo" : "photos"}
                        </p>
                      </div>
                      <span className="flex-1 h-px bg-background-200/50"></span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                      {group.items.map((img) => (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => openLightbox(img.id)}
                          aria-label={img.alt}
                          className="group relative rounded-2xl overflow-hidden cursor-pointer card-lift text-left"
                        >
                          <div className="w-full aspect-[4/3] overflow-hidden bg-background-100">
                            <img
                              src={img.imageUrl}
                              alt={img.alt}
                              title={`${img.title || "Pet grooming"} — Paws & Claws gallery`}
                              className="img-zoom w-full h-full object-cover object-top"
                            />
                          </div>
                          <div className="absolute inset-0 bg-background-950/0 group-hover:bg-background-950/40 transition-colors duration-300 flex flex-col justify-end p-3 md:p-4">
                            <div className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                              <p className="text-white font-semibold text-sm md:text-base leading-snug">{img.title}</p>
                              {img.caption && <p className="text-white/80 text-[11px] md:text-xs mt-0.5 line-clamp-2">{img.caption}</p>}
                            </div>
                          </div>
                          <span className="absolute top-2 right-2 w-9 h-9 rounded-full bg-background-50/90 text-foreground-950 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                            <i className="ri-zoom-in-line" aria-hidden="true"></i>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </RevealWrap>
              ))}
            </div>
          </div>
        </section>
      </PageTransition>
      <Footer />

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-[9998] bg-foreground-50/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background-100 border border-background-200/70 text-foreground-950 flex items-center justify-center cursor-pointer hover:bg-primary-500 hover:text-foreground-50 transition-colors z-20"
            aria-label="Close"
          >
            <i className="ri-close-line text-lg md:text-xl" aria-hidden="true"></i>
          </button>

          {visibleImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background-100 border border-background-200/70 text-foreground-950 flex items-center justify-center cursor-pointer hover:bg-primary-500 hover:text-foreground-50 transition-colors z-20"
                aria-label="Previous image"
              >
                <i className="ri-arrow-left-line text-lg md:text-xl" aria-hidden="true"></i>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background-100 border border-background-200/70 text-foreground-950 flex items-center justify-center cursor-pointer hover:bg-primary-500 hover:text-foreground-50 transition-colors z-20"
                aria-label="Next image"
              >
                <i className="ri-arrow-right-line text-lg md:text-xl" aria-hidden="true"></i>
              </button>
            </>
          )}

          <figure
            className="max-w-[92vw] md:max-w-[80vw] max-h-[88vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={current.imageUrl} alt={current.alt} className="max-w-full max-h-[74vh] rounded-2xl md:rounded-3xl object-contain" />
            <figcaption className="text-center max-w-2xl">
              <span className="block text-sm md:text-base font-semibold text-foreground-950">{current.title}</span>
              {current.caption && <span className="block text-xs md:text-sm text-foreground-600 mt-0.5">{current.caption}</span>}
              <span className="block text-xs text-foreground-500 mt-1">{currentIndex + 1} / {visibleImages.length}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}
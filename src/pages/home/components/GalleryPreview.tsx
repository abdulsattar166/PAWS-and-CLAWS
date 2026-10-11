import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGallery } from "@/hooks/useGallery";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { usePageContent } from "@/hooks/usePageContent";

export default function GalleryPreview() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal();
  const { images } = useGallery();
  const { content } = usePageContent("home");

  const label = content.galleryLabel || t("gallery.label");
  const heading = content.galleryHeading || t("gallery.heading");
  const headingItalic = content.galleryHeadingItalic || t("gallery.heading_italic");
  const count = content.galleryCount && content.galleryCount > 0 ? content.galleryCount : 6;

  // Prefer featured photos, then fill with the rest.
  const preview = useMemo(() => {
    const featured = images.filter((i) => i.featured);
    const rest = images.filter((i) => !i.featured);
    return [...featured, ...rest].slice(0, count);
  }, [images, count]);

  return (
    <section className="bg-background-100/88 py-14 md:py-24 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-primary-500"></span>
            {label}
          </p>
          <h2 className="mt-4 font-heading text-4xl md:text-5xl text-foreground-950 leading-tight">
            {heading}{" "}
            <span className="italic text-accent-500">{headingItalic}</span>
          </h2>
        </div>

        <div ref={ref} className={`reveal-stagger grid grid-cols-2 md:grid-cols-3 gap-4 ${isVisible ? 'is-visible' : ''}`}>
          {preview.map((img) => (
            <div key={img.id} className="group rounded-2xl overflow-hidden cursor-pointer">
              <img src={img.imageUrl} alt={img.alt} title={`${img.title || "Pet grooming"} — Paws & Claws gallery`} className="img-zoom img-reveal w-full h-72 object-cover object-top" />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-accent-500 hover:text-accent-600 cursor-pointer"
          >
            {t("services.view_all")}
            <i className="ri-arrow-right-line arrow-nudge" aria-hidden="true"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { galleryCategories, galleryServices } from "@/mocks/galleryData";

export interface PublicGalleryCategory {
  id: string;
  label: string;
}

export interface PublicGalleryImage {
  id: string;
  title: string;
  caption: string;
  alt: string;
  categoryId: string;
  imageUrl: string;
  featured: boolean;
}

// Fallback mirrors the built-in gallery so the page always renders, even before
// the administrator has uploaded anything (or if the table is emptied).
const FALLBACK_CATEGORIES: PublicGalleryCategory[] = galleryCategories
  .filter((c) => c.id !== "all")
  .map((c) => ({ id: c.id, label: c.label }));

const FALLBACK_IMAGES: PublicGalleryImage[] = galleryServices.flatMap((service) =>
  service.images.map((img, i) => ({
    id: `${service.id}-${i}`,
    title: service.name,
    caption: service.tagline,
    alt: img.alt,
    categoryId: service.category,
    imageUrl: img.src,
    featured: i === 0,
  })),
);

/**
 * Reads the live gallery library (categories + images) from the database. Only
 * active items are returned, ordered by display order. Falls back to the
 * built-in gallery so the public page never renders blank.
 */
export function useGallery() {
  const [categories, setCategories] = useState<PublicGalleryCategory[]>(FALLBACK_CATEGORIES);
  const [images, setImages] = useState<PublicGalleryImage[]>(FALLBACK_IMAGES);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const [catRes, imgRes] = await Promise.all([
        supabase.from("gallery_categories").select("*").eq("active", true).order("sort_order", { ascending: true }),
        supabase.from("gallery_images").select("*").eq("active", true).order("sort_order", { ascending: true }),
      ]);
      if (catRes.error) throw catRes.error;
      if (imgRes.error) throw imgRes.error;

      const cats = (catRes.data ?? []) as Array<{
        id: string;
        label: string;
      }>;
      const imgs = (imgRes.data ?? []) as Array<{
        id: string;
        title: string | null;
        caption: string | null;
        alt: string | null;
        category_id: string | null;
        image_url: string;
        featured: boolean;
      }>;

      if (imgs.length === 0) {
        setCategories(FALLBACK_CATEGORIES);
        setImages(FALLBACK_IMAGES);
        return;
      }

      setCategories(cats.length ? cats.map((c) => ({ id: c.id, label: c.label })) : FALLBACK_CATEGORIES);
      setImages(
        imgs.map((r) => ({
          id: r.id,
          title: r.title ?? "",
          caption: r.caption ?? "",
          alt: r.alt ?? r.title ?? "Pet grooming",
          categoryId: r.category_id ?? "",
          imageUrl: r.image_url,
          featured: r.featured,
        })),
      );
    } catch {
      setCategories(FALLBACK_CATEGORIES);
      setImages(FALLBACK_IMAGES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { categories, images, loading, reload: load };
}
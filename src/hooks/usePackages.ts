import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { packages as mockPackages } from "@/mocks/pawsAndClaws";

// Public shape used by the marketing pages (Home pricing preview + Services page).
export interface PublicPackage {
  id: string;
  name: string;
  subtitle: string;
  fullDescription: string;
  price: number;
  originalPrice: number | null;
  priceNote: string;
  features: string[];
  image: string;
  highlighted: boolean;
  petType: string;
  duration: string;
}

const SIZE_SHORT: Record<string, string> = {
  small: "S",
  medium: "M",
  large: "L",
  xl: "XL",
  "S & Cat": "S & Cat",
};

function toNumber(value: string): number {
  const match = /(\d+)/.exec(value);
  return match ? Number(match[1]) : 0;
}

// Fallback mirrors the built-in marketing packages so the page renders even
// before the live table is read (or if the administrator removes everything).
const FALLBACK: PublicPackage[] = mockPackages.map((p) => ({
  id: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name: p.name,
  subtitle: p.subtitle,
  fullDescription: "",
  price: toNumber(p.price),
  originalPrice: null,
  priceNote: p.priceNote,
  features: p.features,
  image: "",
  highlighted: p.highlighted,
  petType: "cat",
  duration: "",
}));

function buildPriceNote(size: string | null, min: number | null, max: number | null): string {
  const parts: string[] = [];
  if (size && SIZE_SHORT[size]) parts.push(SIZE_SHORT[size]);
  if (min != null && max != null) parts.push(`${min}kg – ${max}kg`);
  else if (min != null) parts.push(`${min}kg+`);
  return parts.join(" · ");
}

/**
 * Reads the live grooming packages from the `packages` table. Only active
 * packages are returned, ordered by display order. Falls back to the built-in
 * list when the table is empty so the marketing pages never render blank.
 */
export function usePackages() {
  const [items, setItems] = useState<PublicPackage[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) {
        setItems(FALLBACK);
        return;
      }
      const mapped: PublicPackage[] = data.map((row) => {
        const r = row as {
          id: string;
          name: string;
          short_description: string | null;
          full_description: string | null;
          pet_type: string;
          pet_size: string | null;
          min_weight: number | null;
          max_weight: number | null;
          original_price: number | string;
          discounted_price: number | string | null;
          duration: string | null;
          treatments: unknown;
          image_url: string | null;
          featured: boolean;
        };
        const original = Number(r.original_price) || 0;
        const discounted = r.discounted_price != null ? Number(r.discounted_price) : null;
        const price = discounted != null && discounted > 0 ? discounted : original;
        const features = Array.isArray(r.treatments) ? (r.treatments as string[]) : [];
        return {
          id: r.id,
          name: r.name,
          subtitle: r.short_description ?? "",
          fullDescription: r.full_description ?? "",
          price,
          originalPrice: discounted != null && discounted > 0 && discounted < original ? original : null,
          priceNote: buildPriceNote(r.pet_size, r.min_weight, r.max_weight),
          features,
          image: r.image_url ?? "",
          highlighted: r.featured,
          petType: r.pet_type,
          duration: r.duration ?? "",
        };
      });
      setItems(mapped);
    } catch {
      setItems(FALLBACK);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, reload: load };
}
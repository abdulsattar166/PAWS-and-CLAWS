import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { services as mockServices } from "@/mocks/pawsAndClaws";

export interface CatalogService {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  icon: string;
  tone: string;
  tagline: string;
  includes: string[];
}

interface Presentation {
  tone: string;
  tagline: string;
  includes: string[];
}

const fallbackToneByCategory: Record<string, string> = {
  cats: "primary",
  dogs: "accent",
  birds: "primary",
  bunny: "accent",
};

// Presentation-only metadata (tone, tagline, bullet list) keyed by service id.
const PRESENTATION: Record<string, Presentation> = mockServices.reduce(
  (acc, s) => ({
    ...acc,
    [s.id]: { tone: s.tone, tagline: s.tagline, includes: s.includes },
  }),
  {} as Record<string, Presentation>,
);

// Static fallback list so the page renders even before the live table loads.
const STATIC_CATALOG: CatalogService[] = mockServices.map((s) => ({
  id: s.id,
  name: s.name,
  category: s.category,
  description: s.description,
  price: s.price,
  duration: s.duration,
  icon: s.icon,
  tone: s.tone,
  tagline: s.tagline,
  includes: s.includes,
}));

/**
 * Merges the live `services` table with the static presentation metadata so
 * that any service added in the database shows up automatically (name,
 * description, duration, price and icon all come from the table). Card-only
 * "add-on" rows are excluded here — they have their own dedicated sections.
 */
export function useCatalogServices() {
  const [items, setItems] = useState<CatalogService[]>(STATIC_CATALOG);

  const load = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, category, description, price_aed, duration, icon, sort_order, pet_type")
        .eq("active", true)
        .neq("pet_type", "all")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) return;

      const merged: CatalogService[] = data.map((row) => {
        const r = row as {
          id: string;
          name: string;
          category: string;
          description: string | null;
          price_aed: number | string;
          duration: string | null;
          icon: string | null;
        };
        const meta = PRESENTATION[r.id];
        return {
          id: r.id,
          name: r.name,
          category: r.category,
          description: r.description ?? "",
          price: `AED ${Math.round(Number(r.price_aed))}`,
          duration: r.duration ?? "",
          icon: r.icon ?? "ri-service-line",
          tone: meta?.tone ?? fallbackToneByCategory[r.category] ?? "primary",
          tagline: meta?.tagline ?? "",
          includes: meta?.includes ?? [],
        };
      });
      setItems(merged);
    } catch {
      // Keep the static fallback list.
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { items, reload: load };
}
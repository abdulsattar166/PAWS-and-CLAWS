import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { PetCategoryRow } from "@/lib/adminTypes";

// Fallback matches the categories the site shipped with, so the Services page
// filter still renders even before the live table is read.
const FALLBACK: PetCategoryRow[] = [
  { id: "dogs", label: "Dogs", singular: "Dog", icon: "ri-footprint-line", sort_order: 10, active: true },
  { id: "cats", label: "Cats", singular: "Cat", icon: "ri-emotion-happy-line", sort_order: 20, active: true },
  { id: "birds", label: "Birds", singular: "Bird", icon: "ri-flight-takeoff-line", sort_order: 30, active: true },
  { id: "bunny", label: "Rabbits & Bunnies", singular: "Rabbit", icon: "ri-heart-line", sort_order: 40, active: true },
];

/**
 * Reads the configurable pet categories (dogs, cats, birds, bunnies, …) that
 * drive the Services page filter. Only active categories are returned.
 */
export function usePetCategories() {
  const [categories, setCategories] = useState<PetCategoryRow[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("pet_categories")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) {
        setCategories(FALLBACK);
        return;
      }
      setCategories(data as PetCategoryRow[]);
    } catch {
      setCategories(FALLBACK);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { categories, loading, reload: load };
}
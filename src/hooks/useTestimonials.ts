import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface PublicTestimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
  imageUrl: string;
}

function formatDate(value: string | null): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  const d = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

/**
 * Reads the business's own published testimonials from the `reviews` table.
 * These are kept completely separate from any Google-sourced reviews.
 */
export function useTestimonials() {
  const [items, setItems] = useState<PublicTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      const rows = (data ?? []) as Array<{
        id: string;
        customer_name: string;
        review_text: string;
        rating: number;
        review_date: string | null;
        image_url: string | null;
      }>;
      setItems(
        rows.map((r) => ({
          id: r.id,
          name: r.customer_name,
          text: r.review_text,
          rating: Number(r.rating) || 5,
          date: formatDate(r.review_date),
          imageUrl: r.image_url ?? "",
        })),
      );
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, reload: load };
}
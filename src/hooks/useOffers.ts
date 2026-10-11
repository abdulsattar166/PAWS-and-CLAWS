import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { isOfferLive, toDiscountOffers, type DiscountOffer } from "@/lib/discounts";

export interface PublicOffer extends DiscountOffer {
  description: string | null;
  promo_code: string | null;
  banner_text: string | null;
}

/** Live offers for the public site (booking form banner + price display). */
export function useOffers() {
  const [offers, setOffers] = useState<PublicOffer[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("offers")
        .select("id, title, description, discount_type, discount_value, service_ids, promo_code, banner_text, active, starts_at, ends_at")
        .eq("active", true);
      if (error) throw error;
      const mapped = toDiscountOffers((data ?? []) as Array<Record<string, unknown>>).filter((o) => isOfferLive(o));
      const withMeta = mapped.map((o) => {
        const row = (data ?? []).find((r) => String((r as { id: string }).id) === o.id) as Record<string, unknown> | undefined;
        return {
          ...o,
          description: (row?.description as string) ?? null,
          promo_code: (row?.promo_code as string) ?? null,
          banner_text: (row?.banner_text as string) ?? null,
        };
      });
      setOffers(withMeta);
    } catch {
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { offers, loading, reload: load };
}
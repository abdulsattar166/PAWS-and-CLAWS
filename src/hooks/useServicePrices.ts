import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type ServicePriceMap = Record<string, number>;
export type ServiceSizePriceMap = Record<string, Record<string, number>>;

export const formatAed = (value: number) => `AED ${Math.round(Number(value))}`;

/**
 * Resolve a displayed price from the live `services` table so the marketing
 * pages can never drift from what the booking engine actually charges.
 * Falls back to the supplied static string when the id isn't in the table
 * (table not loaded yet, or the service was removed).
 */
export function resolvePrice(
  prices: ServicePriceMap,
  id: string | undefined,
  fallback?: string,
): string {
  if (id && prices[id] != null) return formatAed(prices[id]);
  return fallback ?? "";
}

/**
 * Resolve a live size-based price (e.g. the flat S/M/L/XL breakdown table on
 * the services page). Falls back to the supplied static string when the row
 * isn't present yet.
 */
export function resolveSizePrice(
  sizePrices: ServiceSizePriceMap,
  serviceId: string | undefined,
  size: string,
  fallback?: string,
): string {
  if (serviceId && sizePrices[serviceId]?.[size] != null) {
    return formatAed(sizePrices[serviceId][size]);
  }
  return fallback ?? "";
}

/**
 * Loads service_id -> { size -> price } from the `service_size_prices` table so
 * the S/M/L/XL price breakdown can never drift from what the booking charges.
 */
export function useServiceSizePrices() {
  const [sizePrices, setSizePrices] = useState<ServiceSizePriceMap>({});
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) {
      setReady(true);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("service_size_prices")
        .select("service_id, size, price_aed");
      if (error) throw error;
      const map: ServiceSizePriceMap = {};
      (data ?? []).forEach((row) => {
        const record = row as { service_id: string; size: string; price_aed: number | string };
        if (!map[record.service_id]) map[record.service_id] = {};
        map[record.service_id][record.size] = Number(record.price_aed);
      });
      setSizePrices(map);
    } catch {
      // Keep static fallbacks so the page still renders.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { sizePrices, ready, reload: load };
}

/**
 * Loads the id -> price map from the same `services` table used by the
 * booking form. Any consumer can display a live price by service id.
 */
export function useServicePrices() {
  const [prices, setPrices] = useState<ServicePriceMap>({});
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) {
      setReady(true);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("services")
        .select("id, price_aed")
        .eq("active", true);
      if (error) throw error;
      const map: ServicePriceMap = {};
      (data ?? []).forEach((row) => {
        const record = row as { id: string; price_aed: number | string };
        map[record.id] = Number(record.price_aed);
      });
      setPrices(map);
    } catch {
      // Keep static fallbacks so the page still renders.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { prices, ready, reload: load };
}
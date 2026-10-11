import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface ServiceSizePrice {
  size: string;
  price_aed: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price_aed: number;
  duration: string | null;
  icon: string | null;
  sort_order: number;
  pet_type: string;
  size_prices: ServiceSizePrice[];
}

export type ServicesStatus = "loading" | "ready" | "error";

/** Pet-type value used for services that apply to every animal (add-ons, medical baths). */
export const PET_TYPE_ALL = "all";

/** True when a service bills by pet size (currently the larger dog grooms). */
export function serviceHasSizePricing(service: ServiceItem): boolean {
  return (service.size_prices?.length ?? 0) > 0;
}

/**
 * Resolve the price actually charged for a service given the customer's pet
 * size. Size pricing wins when the service has a row for that size, otherwise
 * the service's flat price applies (cats, birds, rabbits, add-ons).
 */
export function resolveServicePrice(service: ServiceItem, petSize?: string): number {
  if (petSize && service.size_prices?.length) {
    const row = service.size_prices.find((r) => r.size === petSize);
    if (row) return Number(row.price_aed);
  }
  return Number(service.price_aed);
}

/** Services that can be booked for a given pet type (own type or universal add-ons). */
export function servicesForPetType(services: ServiceItem[], petType: string): ServiceItem[] {
  if (!petType) return [];
  return services.filter((s) => s.pet_type === petType || s.pet_type === PET_TYPE_ALL);
}

export function useServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [status, setStatus] = useState<ServicesStatus>("loading");

  const load = useCallback(async () => {
    if (!supabase) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, category, description, price_aed, duration, icon, sort_order, pet_type")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      const base = (data ?? []) as Omit<ServiceItem, "size_prices">[];

      // Attach size-based prices (dog grooms bill by S/M/L/XL).
      let sizeMap: Record<string, ServiceSizePrice[]> = {};
      try {
        const { data: sizeRows } = await supabase
          .from("service_size_prices")
          .select("service_id, size, price_aed");
        (sizeRows ?? []).forEach((row) => {
          const r = row as { service_id: string; size: string; price_aed: number | string };
          if (!sizeMap[r.service_id]) sizeMap[r.service_id] = [];
          sizeMap[r.service_id].push({ size: r.size, price_aed: Number(r.price_aed) });
        });
      } catch {
        sizeMap = {};
      }

      const merged = base.map((s) => ({ ...s, size_prices: sizeMap[s.id] ?? [] }));
      setServices(merged);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { services, status, reload: load };
}
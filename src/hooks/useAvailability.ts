import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type AvailabilityStatus = "idle" | "loading" | "ready" | "error";

/**
 * Returns the time slots already taken for a given date, straight from the
 * backend (server-side), so two customers can never grab the same slot.
 */
export function useAvailability(date: string) {
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [status, setStatus] = useState<AvailabilityStatus>("idle");

  const load = useCallback(async () => {
    if (!supabase || !date) {
      setBookedSlots([]);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    try {
      const { data, error } = await supabase.rpc("get_booked_slots", { p_date: date });
      if (error) throw error;
      setBookedSlots(Array.isArray(data) ? (data as string[]) : []);
      setStatus("ready");
    } catch {
      setBookedSlots([]);
      setStatus("error");
    }
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  return { bookedSlots, status, reload: load };
}
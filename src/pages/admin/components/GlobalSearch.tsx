import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ADMIN_NAV_FLAT, type AdminNavItem } from "@/pages/admin/adminNav";
import { displayBookingRef } from "@/lib/adminTypes";

interface BookingHit {
  id: string;
  booking_ref: string;
  customer_name: string;
  pet_name: string | null;
  booking_status: string;
}

interface GlobalSearchProps {
  onGoTo: (tab: string, bookingRef?: string) => void;
}

/**
 * Header search bar. Matches Admin sections instantly and queries bookings by
 * reference, customer, pet or phone — then jumps straight to that destination.
 */
export default function GlobalSearch({ onGoTo }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<BookingHit[]>([]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const sections: AdminNavItem[] = q
    ? ADMIN_NAV_FLAT.filter((n) => n.key !== "logout" && (n.label.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q))).slice(0, 5)
    : [];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!supabase || q.length < 2) {
      setHits([]);
      setLoading(false);
      return;
    }
    // Strip characters that would break the PostgREST `or()` filter grammar.
    const safe = q.replace(/[%,()*\\"']/g, " ").replace(/\s+/g, " ").trim();
    if (!safe) {
      setHits([]);
      return;
    }
    let active = true;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const pattern = `%${safe}%`;
        const { data } = await supabase
          .from("bookings")
          .select("id, booking_ref, customer_name, pet_name, booking_status")
          .or(`booking_ref.ilike.${pattern},customer_name.ilike.${pattern},pet_name.ilike.${pattern},customer_phone.ilike.${pattern}`)
          .order("created_at", { ascending: false })
          .limit(6);
        if (active) setHits((data ?? []) as BookingHit[]);
      } catch {
        if (active) setHits([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 280);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [q]);

  const go = (tab: string, ref?: string) => {
    onGoTo(tab, ref);
    setQuery("");
    setOpen(false);
  };

  const showPanel = open && q.length > 0;

  return (
    <div ref={boxRef} className="relative flex-1 max-w-md">
      <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-500 text-sm" aria-hidden="true"></i>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "Enter" && sections[0] && !hits.length) go(sections[0].key);
          if (e.key === "Enter" && hits[0] && !sections.length) go("bookings", hits[0].booking_ref);
        }}
        placeholder="Search bookings, sections…"
        aria-label="Search the admin panel"
        className="w-full pl-9 pr-3 py-2 rounded-lg bg-background-50 border border-background-200 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
      />

      {showPanel && (
        <div className="absolute left-0 right-0 top-full mt-2 z-[95] rounded-xl bg-background-50 border border-background-200 shadow-lg overflow-hidden admin-rise">
          {sections.length > 0 && (
            <div className="py-1">
              <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-[0.14em] text-foreground-500 font-semibold">Sections</p>
              {sections.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => go(s.key)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-background-100 cursor-pointer"
                >
                  <i className={`${s.icon} text-lg text-primary-700`} aria-hidden="true"></i>
                  <span className="text-sm text-foreground-900">{s.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="py-1 border-t border-background-200/70">
            <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-[0.14em] text-foreground-500 font-semibold">Bookings</p>
            {loading && <p className="px-3 py-2 text-xs text-foreground-500">Searching…</p>}
            {!loading && hits.length === 0 && <p className="px-3 py-2 text-xs text-foreground-500">No matching bookings.</p>}
            {hits.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => go("bookings", b.booking_ref)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-background-100 cursor-pointer"
              >
                <i className="ri-calendar-check-line text-lg text-accent-600" aria-hidden="true"></i>
                <span className="min-w-0">
                  <span className="block text-sm text-foreground-900 truncate">
                    {displayBookingRef(b.booking_ref)} · {b.customer_name}
                  </span>
                  <span className="block text-[11px] text-foreground-500 truncate">
                    {b.pet_name ? `${b.pet_name} · ` : ""}{b.booking_status}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
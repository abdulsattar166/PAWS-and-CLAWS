import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  BOOKING_STATUS_LABELS,
  ADMIN_STATUS_LABELS,
  aed,
  displayBookingRef,
  formatDateOnly,
  formatDateTime,
  type BookingRow,
  type BookingStatusFilter,
} from "@/lib/adminTypes";
import { Card, EmptyState, ErrorState, Spinner, StatusPill, btnGhost, inputCls } from "./AdminUi";
import BookingDetail from "./BookingDetail";

const FILTERS: Array<{ key: BookingStatusFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending approval" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

function matchesFilter(b: BookingRow, filter: BookingStatusFilter): boolean {
  switch (filter) {
    case "pending": return b.admin_status === "pending";
    case "approved": return b.admin_status === "approved";
    case "rejected": return b.admin_status === "rejected";
    case "completed": return b.booking_status === "completed";
    case "cancelled": return b.booking_status === "cancelled";
    default: return true;
  }
}

function bookingTone(status: string): "neut" | "warn" | "ok" | "bad" {
  if (status === "confirmed" || status === "completed") return "ok";
  if (status === "in_progress") return "warn";
  if (status === "rejected" || status === "cancelled") return "bad";
  return "neut";
}

function waTone(status: string | null): "neut" | "warn" | "ok" | "bad" {
  if (status === "sent") return "ok";
  if (status === "failed") return "bad";
  if (status === "not_configured") return "warn";
  return "neut";
}

export default function BookingsManager({ openRef }: { openRef?: string }) {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<BookingStatusFilter>("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<BookingRow | null>(null);

  const load = useCallback(async () => {
    if (!supabase) {
      setStatus("error");
      setError("Backend not configured.");
      return;
    }
    setStatus("loading");
    try {
      const { data, error: err } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (err) throw err;
      setBookings((data ?? []) as BookingRow[]);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not load bookings.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Deep-link support: when the global search jumps here with a reference,
  // prefill the search box and auto-open the matching booking.
  useEffect(() => {
    if (openRef) setQuery(openRef);
  }, [openRef]);

  useEffect(() => {
    if (openRef && status === "ready") {
      const match = bookings.find((b) => b.booking_ref === openRef);
      if (match) setActive(match);
    }
  }, [openRef, status, bookings]);

  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.admin_status === "pending").length;
    const approved = bookings.filter((b) => b.admin_status === "approved").length;
    const rejected = bookings.filter((b) => b.admin_status === "rejected").length;
    const completed = bookings.filter((b) => b.booking_status === "completed").length;
    return { total: bookings.length, pending, approved, rejected, completed };
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (!matchesFilter(b, filter)) return false;
      if (!q) return true;
      return [b.booking_ref, b.customer_name, b.customer_email, b.customer_phone, b.pet_name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [bookings, filter, query]);

  const handleUpdated = (updated: BookingRow) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setActive(updated);
  };

  const statCards = [
    { label: "Total bookings", value: String(stats.total), icon: "ri-calendar-line", tone: "text-foreground-950" },
    { label: "Pending approval", value: String(stats.pending), icon: "ri-time-line", tone: "text-secondary-900" },
    { label: "Approved", value: String(stats.approved), icon: "ri-check-double-line", tone: "text-accent-700" },
    { label: "Completed", value: String(stats.completed), icon: "ri-flag-2-line", tone: "text-primary-700" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="p-4 md:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.12em] text-foreground-500 font-semibold">{s.label}</span>
              <i className={`${s.icon} text-lg text-foreground-400`} aria-hidden="true"></i>
            </div>
            <p className={`mt-2 font-heading text-2xl md:text-3xl ${s.tone}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4 md:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-500" aria-hidden="true"></i>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by reference, name, email, phone or pet…"
              className={`${inputCls} pl-10`}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap cursor-pointer transition-colors ${
                  filter === f.key
                    ? "bg-primary-500 text-foreground-50 border-primary-500"
                    : "bg-background-50 text-foreground-700 border-background-200 hover:border-primary-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={load} className={btnGhost}>
            <i className="ri-refresh-line" aria-hidden="true"></i> Refresh
          </button>
        </div>
      </Card>

      <Card>
        {status === "loading" && <Spinner label="Loading bookings…" />}
        {status === "error" && <ErrorState text={error} onRetry={load} />}
        {status === "ready" && filtered.length === 0 && (
          <EmptyState icon="ri-inbox-line" title="No bookings found" text="Adjust your search or filter to see more." />
        )}
        {status === "ready" && filtered.length > 0 && (
          <ul className="divide-y divide-background-200/70">
            {filtered.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => setActive(b)}
                  className="w-full text-left px-4 md:px-5 py-4 hover:bg-background-100/70 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading text-base text-foreground-950">{displayBookingRef(b.booking_ref)}</span>
                        <StatusPill label={ADMIN_STATUS_LABELS[b.admin_status] ?? b.admin_status} tone={b.admin_status === "approved" ? "ok" : b.admin_status === "rejected" ? "bad" : "warn"} />
                        <StatusPill label={BOOKING_STATUS_LABELS[b.booking_status] ?? b.booking_status} tone={bookingTone(b.booking_status)} />
                        <StatusPill label={b.whatsapp_status === "sent" ? "WA sent" : b.whatsapp_status === "failed" ? "WA failed" : "WA pending"} tone={waTone(b.whatsapp_status)} icon="ri-whatsapp-line" />
                      </div>
                      <p className="mt-1 text-sm text-foreground-700 truncate">
                        {b.customer_name} · {b.pet_name ?? "Pet"} · {formatDateOnly(b.preferred_date)} {b.time_slot}
                      </p>
                      <p className="mt-0.5 text-[11px] text-foreground-500">Received {formatDateTime(b.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                      <span className="font-heading text-lg text-foreground-950 whitespace-nowrap">{aed(b.amount)}</span>
                      <i className="ri-arrow-right-s-line text-xl text-foreground-400" aria-hidden="true"></i>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {active && (
        <BookingDetail key={active.id} booking={active} onClose={() => setActive(null)} onUpdated={handleUpdated} />
      )}
    </div>
  );
}
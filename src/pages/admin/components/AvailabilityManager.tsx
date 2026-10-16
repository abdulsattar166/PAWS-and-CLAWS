import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { bookingSlots } from "@/mocks/pawsAndClaws";
import { Card, EmptyState, ErrorState, Spinner, StatusPill, Modal, btnPrimary, btnGhost, btnDanger, inputCls, labelCls } from "./AdminUi";

interface BlockedSlot {
  id: string;
  block_date: string;
  time_slot: string | null;
  reason: string | null;
}

interface BookedSlot {
  time_slot: string;
  booking_ref: string;
}

type SlotState = "available" | "booked" | "blocked";

/**
 * Admin-managed availability. For a chosen date the administrator sees every
 * arrival window with its live state — Available, Booked (by a customer) or
 * Blocked — and can block/unblock individual slots or the whole day. Blocked
 * slots are hidden from customers in the booking form and rejected server-side.
 */
export default function AvailabilityManager() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState(today);
  const [blocks, setBlocks] = useState<BlockedSlot[]>([]);
  const [booked, setBooked] = useState<BookedSlot[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [upcoming, setUpcoming] = useState<BlockedSlot[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<BlockedSlot | null>(null);

  const load = useCallback(async () => {
    if (!supabase) {
      setStatus("error");
      setError("Backend not configured.");
      return;
    }
    setStatus("loading");
    try {
      const [blockRes, bookedRes, upcomingRes] = await Promise.all([
        supabase.from("blocked_slots").select("id, block_date, time_slot, reason").eq("block_date", date),
        supabase
          .from("bookings")
          .select("time_slot, booking_ref")
          .eq("preferred_date", date)
          .in("booking_status", ["pending_payment", "confirmed", "in_progress"]),
        supabase
          .from("blocked_slots")
          .select("id, block_date, time_slot, reason")
          .gte("block_date", today)
          .order("block_date", { ascending: true })
          .limit(200),
      ]);
      if (blockRes.error) throw blockRes.error;
      if (bookedRes.error) throw bookedRes.error;
      setBlocks((blockRes.data ?? []) as BlockedSlot[]);
      setBooked((bookedRes.data ?? []) as BookedSlot[]);
      setUpcoming((upcomingRes.data ?? []) as BlockedSlot[]);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not load availability.");
    }
  }, [date, today]);

  useEffect(() => {
    load();
  }, [load]);

  const wholeDayBlocked = blocks.some((b) => b.time_slot == null);
  const bookedSet = useMemo(() => new Set(booked.map((b) => b.time_slot)), [booked]);
  const blockedSet = useMemo(() => new Set(blocks.filter((b) => b.time_slot).map((b) => b.time_slot as string)), [blocks]);

  const stateFor = (slot: string): SlotState =>
    bookedSet.has(slot) ? "booked" : wholeDayBlocked || blockedSet.has(slot) ? "blocked" : "available";

  const setWholeDay = async (block: boolean) => {
    if (!supabase) return;
    setBusy("day");
    setError("");
    try {
      if (block) {
        const { error: err } = await supabase.from("blocked_slots").insert({ block_date: date, time_slot: null, reason: "Closed" });
        if (err && err.code !== "23505") throw err;
      } else {
        const { error: err } = await supabase.from("blocked_slots").delete().eq("block_date", date).is("time_slot", null);
        if (err) throw err;
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update.");
    } finally {
      setBusy("");
    }
  };

  const toggleSlot = async (slot: string) => {
    if (!supabase) return;
    setBusy(slot);
    setError("");
    try {
      if (blockedSet.has(slot)) {
        const { error: err } = await supabase.from("blocked_slots").delete().eq("block_date", date).eq("time_slot", slot);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("blocked_slots").insert({ block_date: date, time_slot: slot, reason: "Blocked" });
        if (err && err.code !== "23505") throw err;
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update.");
    } finally {
      setBusy("");
    }
  };

  const doDeleteUpcoming = async () => {
    if (!supabase || !confirmDelete) return;
    setBusy(confirmDelete.id);
    const { error: err } = await supabase.from("blocked_slots").delete().eq("id", confirmDelete.id);
    setBusy("");
    if (!err) {
      setConfirmDelete(null);
      load();
    } else {
      setError(err.message);
    }
  };

  const slotClasses: Record<SlotState, { box: string; pill: "neut" | "info" | "bad"; label: string; icon: string }> = {
    available: { box: "bg-background-50 border-background-200/70 text-foreground-700 hover:border-primary-300", pill: "info", label: "Available", icon: "ri-checkbox-circle-line" },
    booked: { box: "bg-secondary-100/70 border-secondary-200 text-secondary-900 cursor-not-allowed", pill: "neut", label: "Booked", icon: "ri-calendar-check-line" },
    blocked: { box: "bg-red-50 border-red-200 text-red-700", pill: "bad", label: "Blocked", icon: "ri-close-circle-line" },
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:justify-between">
          <div className="sm:max-w-xs w-full">
            <label htmlFor="av-date" className={labelCls}>Date</label>
            <input id="av-date" type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} className={`${inputCls} cursor-pointer`} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {wholeDayBlocked ? (
              <button type="button" onClick={() => setWholeDay(false)} disabled={busy === "day"} className={btnGhost}>
                <i className="ri-lock-unlock-line" aria-hidden="true"></i> Unblock entire day
              </button>
            ) : (
              <button type="button" onClick={() => setWholeDay(true)} disabled={busy === "day"} className={btnDanger}>
                <i className="ri-lock-line" aria-hidden="true"></i> Block entire day
              </button>
            )}
            <button type="button" onClick={load} className={btnGhost}>
              <i className="ri-refresh-line" aria-hidden="true"></i> Refresh
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-foreground-600">
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-background-50 border border-background-200/70"></span> Available</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-secondary-200"></span> Booked</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-200"></span> Blocked</span>
        </div>
        {error && <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>}
      </Card>

      <Card className="p-4 md:p-5">
        <h3 className="font-heading text-base text-foreground-950">Time slots · {date}</h3>
        <p className="text-sm text-foreground-600">Tap a slot to block or unblock it. Booked slots are held by a customer and cannot be blocked.</p>
        {status === "loading" ? (
          <Spinner label="Loading availability…" />
        ) : status === "error" ? (
          <ErrorState text={error} onRetry={load} />
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {bookingSlots.map((slot) => {
              const st = stateFor(slot);
              const cfg = slotClasses[st];
              const isBooked = st === "booked";
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isBooked || busy === slot || busy === "day"}
                  onClick={() => toggleSlot(slot)}
                  className={`flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl border text-left text-sm font-medium transition-colors ${cfg.box} ${isBooked ? "" : "cursor-pointer"}`}
                >
                  <span className="leading-tight">{slot}</span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${st === "available" ? "text-primary-700" : st === "blocked" ? "text-red-700" : "text-secondary-900"}`}>
                    <i className={cfg.icon} aria-hidden="true"></i>
                    {cfg.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {/* Upcoming blocks */}
      <Card>
        <div className="px-5 py-4 border-b border-background-200/70">
          <h3 className="font-heading text-base text-foreground-950">Upcoming blocked dates & slots</h3>
        </div>
        {upcoming.length === 0 ? (
          <EmptyState icon="ri-calendar-check-line" title="No blocks" text="You haven't blocked any upcoming dates or slots." />
        ) : (
          <ul className="divide-y divide-background-200/70">
            {upcoming.map((b) => (
              <li key={b.id} className="flex items-center gap-4 px-4 md:px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground-950">{b.block_date}</p>
                  <p className="text-xs text-foreground-500 truncate">{b.time_slot ?? "Entire day"} · {b.reason ?? "Blocked"}</p>
                </div>
                {b.time_slot ? <StatusPill label="Slot" tone="bad" /> : <StatusPill label="Whole day" tone="bad" />}
                <button type="button" onClick={() => setConfirmDelete(b)} className={`${btnGhost} px-3`}>
                  <i className="ri-delete-bin-line" aria-hidden="true"></i>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Remove block"
        footer={
          <>
            <button type="button" onClick={() => setConfirmDelete(null)} className={btnGhost}>Cancel</button>
            <button type="button" onClick={doDeleteUpcoming} disabled={busy === confirmDelete?.id} className={btnPrimary}>
              <i className="ri-check-line" aria-hidden="true"></i> Unblock
            </button>
          </>
        }
      >
        <p className="text-sm text-foreground-700">
          Remove the block for <strong>{confirmDelete?.block_date}</strong> {confirmDelete?.time_slot ? `· ${confirmDelete.time_slot}` : "· entire day"}? The slot(s) will become bookable again.
        </p>
      </Modal>
    </div>
  );
}

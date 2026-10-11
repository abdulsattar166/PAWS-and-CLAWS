import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  PAYMENT_STATUS_LABELS,
  aed,
  displayBookingRef,
  formatDateOnly,
  formatDateTime,
  type BookingRow,
} from "@/lib/adminTypes";
import { Card, EmptyState, ErrorState, Modal, Spinner, StatusPill, btnAccent, btnDanger, btnGhost, inputCls, labelCls } from "./AdminUi";

type PayFilter = "all" | "unpaid" | "awaiting_transfer" | "under_review" | "paid" | "failed";

const FILTERS: Array<{ key: PayFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "under_review", label: "Under review" },
  { key: "awaiting_transfer", label: "Awaiting transfer" },
  { key: "unpaid", label: "Unpaid" },
  { key: "paid", label: "Verified" },
  { key: "failed", label: "Failed" },
];

function payTone(status: string): "neut" | "warn" | "ok" | "bad" {
  if (status === "paid") return "ok";
  if (status === "under_review" || status === "awaiting_transfer") return "warn";
  if (status === "failed") return "bad";
  return "neut";
}

interface PaymentLog {
  id: string;
  action: string;
  amount: number | null;
  note: string | null;
  created_at: string;
}

const LOG_LABELS: Record<string, string> = {
  under_review: "Marked under review",
  verified: "Payment verified",
  rejected: "Payment rejected",
  screenshot: "Screenshot attached",
  rejected_screenshot: "Screenshot removed",
  note: "Note updated",
};

export default function PaymentsManager() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<PayFilter>("under_review");
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
      setError(e instanceof Error ? e.message : "Could not load payments.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const review = bookings.filter((b) => b.payment_status === "under_review").length;
    const awaiting = bookings.filter((b) => b.payment_status === "awaiting_transfer").length;
    const verified = bookings.filter((b) => b.payment_status === "paid");
    const collected = verified.reduce((sum, b) => sum + Number(b.amount ?? 0), 0);
    const pendingValue = bookings
      .filter((b) => b.payment_status === "under_review")
      .reduce((sum, b) => sum + Number(b.amount ?? 0), 0);
    return { review, awaiting, verifiedCount: verified.length, collected, pendingValue };
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (filter !== "all" && b.payment_status !== filter) return false;
      if (!q) return true;
      return [b.booking_ref, b.customer_name, b.pet_name, b.customer_phone, b.payment_ref]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [bookings, filter, query]);

  const handleUpdated = (updated: BookingRow) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setActive(updated);
  };

  const statCards = [
    { label: "Awaiting verification", value: String(stats.review), icon: "ri-file-search-line", tone: "text-secondary-900" },
    { label: "Awaiting transfer", value: String(stats.awaiting), icon: "ri-time-line", tone: "text-foreground-950" },
    { label: "Verified payments", value: String(stats.verifiedCount), icon: "ri-shield-check-line", tone: "text-accent-700" },
    { label: "Collected (verified)", value: aed(stats.collected), icon: "ri-money-dollar-circle-line", tone: "text-primary-700" },
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
              placeholder="Search by reference, customer, pet, phone or bank ref…"
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
        {status === "loading" && <Spinner label="Loading payments…" />}
        {status === "error" && <ErrorState text={error} onRetry={load} />}
        {status === "ready" && filtered.length === 0 && (
          <EmptyState icon="ri-secure-payment-line" title="No payments here" text="Adjust your search or filter to see more." />
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
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-background-100 border border-background-200/70 shrink-0 flex items-center justify-center">
                      {b.payment_screenshot_url ? (
                        <img src={b.payment_screenshot_url} alt="Payment screenshot" className="w-full h-full object-cover" />
                      ) : (
                        <i className="ri-image-line text-foreground-400 text-xl" aria-hidden="true"></i>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading text-base text-foreground-950">{displayBookingRef(b.booking_ref)}</span>
                        <StatusPill label={PAYMENT_STATUS_LABELS[b.payment_status] ?? b.payment_status} tone={payTone(b.payment_status)} />
                      </div>
                      <p className="mt-1 text-sm text-foreground-700 truncate">
                        {b.customer_name} · {b.pet_name ?? "Pet"} · {formatDateOnly(b.preferred_date)}
                      </p>
                      {b.payment_ref && <p className="mt-0.5 text-[11px] text-foreground-500 truncate">Ref: {b.payment_ref}</p>}
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 shrink-0">
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

      {active && <PaymentWorkspace key={active.id} booking={active} onClose={() => setActive(null)} onUpdated={handleUpdated} />}
    </div>
  );
}

function PaymentWorkspace({
  booking,
  onClose,
  onUpdated,
}: {
  booking: BookingRow;
  onClose: () => void;
  onUpdated: (updated: BookingRow) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [shotUrl, setShotUrl] = useState(booking.payment_screenshot_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [payRef, setPayRef] = useState(booking.payment_ref ?? "");
  const [received, setReceived] = useState(String(booking.amount ?? ""));
  const [note, setNote] = useState(booking.admin_note ?? "");
  const [logs, setLogs] = useState<PaymentLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  const loadLogs = useCallback(async () => {
    if (!supabase) {
      setLogsLoading(false);
      return;
    }
    setLogsLoading(true);
    try {
      const { data } = await supabase
        .from("payment_logs")
        .select("id, action, amount, note, created_at")
        .eq("booking_id", booking.id)
        .order("created_at", { ascending: false })
        .limit(50);
      setLogs((data ?? []) as PaymentLog[]);
    } catch {
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  }, [booking.id]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const addLog = async (action: string, amount: number | null, logNote: string | null) => {
    if (!supabase) return;
    const { data } = await supabase.auth.getUser();
    await supabase.from("payment_logs").insert({
      booking_id: booking.id,
      action,
      amount,
      note: logNote,
      actor: data.user?.email ?? null,
    });
  };

  const patch = async (
    values: Record<string, unknown>,
    log?: { action: string; amount?: number | null; note?: string | null },
  ) => {
    if (!supabase) return false;
    setSaving(true);
    setFeedback("");
    setError("");
    const { data, error: err } = await supabase
      .from("bookings")
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq("id", booking.id)
      .select()
      .maybeSingle();
    if (err || !data) {
      setSaving(false);
      setError(err?.message ?? "Update failed. Please try again.");
      return false;
    }
    if (log) await addLog(log.action, log.amount ?? null, log.note ?? null);
    onUpdated(data as BookingRow);
    setSaving(false);
    setFeedback("Saved.");
    loadLogs();
    setTimeout(() => setFeedback(""), 1800);
    return true;
  };

  const receivedNum = Number(received) || 0;

  const verify = () =>
    patch(
      {
        payment_status: "paid",
        booking_status: "confirmed",
        admin_status: "approved",
        payment_ref: payRef.trim() || null,
        paid_at: booking.paid_at ?? new Date().toISOString(),
        payment_method: booking.payment_method ?? "bank_transfer",
      },
      { action: "verified", amount: receivedNum, note: payRef.trim() || null },
    );

  const reject = () =>
    patch(
      { payment_status: "failed", booking_status: "rejected", admin_status: "rejected" },
      { action: "rejected", amount: null, note: note.trim() || null },
    );

  const underReview = () =>
    patch(
      { payment_status: "under_review", admin_status: "pending", payment_ref: payRef.trim() || null },
      { action: "under_review", amount: null, note: null },
    );

  const saveNote = () =>
    patch({ admin_note: note.trim() || null }, { action: "note", amount: null, note: note.trim() || null });

  const handleShotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !supabase) return;
    setUploading(true);
    setError("");
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${booking.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("payment-proofs")
        .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("payment-proofs").getPublicUrl(path);
      setShotUrl(pub.publicUrl);
      await patch(
        { payment_screenshot_url: pub.publicUrl, payment_status: "under_review" },
        { action: "screenshot", amount: null, note: null },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeShot = () => {
    setShotUrl("");
    patch({ payment_screenshot_url: null }, { action: "rejected_screenshot", amount: null, note: null });
  };

  const mismatch = receivedNum > 0 && Math.abs(receivedNum - Number(booking.amount ?? 0)) > 0.01;

  return (
    <Modal
      open
      onClose={onClose}
      wide
      title={`Payment · ${displayBookingRef(booking.booking_ref)}`}
      footer={
        <div className="flex flex-wrap items-center gap-2 w-full justify-between">
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={saving} onClick={verify} className={btnAccent}>
              <i className="ri-check-double-line" aria-hidden="true"></i> Verify payment
            </button>
            <button type="button" disabled={saving} onClick={underReview} className={btnGhost}>
              <i className="ri-file-search-line" aria-hidden="true"></i> Under review
            </button>
            <button type="button" disabled={saving} onClick={reject} className={btnDanger}>
              <i className="ri-close-line" aria-hidden="true"></i> Reject
            </button>
          </div>
          {feedback && <span className="text-xs font-semibold text-accent-700">{feedback}</span>}
          {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill label={PAYMENT_STATUS_LABELS[booking.payment_status] ?? booking.payment_status} tone={payTone(booking.payment_status)} icon="ri-secure-payment-line" />
          <span className="text-xs text-foreground-500">Booked {formatDateTime(booking.created_at)}</span>
          {booking.paid_at && <span className="text-xs text-accent-700 font-semibold">Verified {formatDateTime(booking.paid_at)}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Screenshot */}
          <section className="rounded-xl bg-background-100 border border-background-200/70 p-4 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold flex items-center gap-2">
              <i className="ri-image-2-line" aria-hidden="true"></i> Payment screenshot
            </h4>
            {shotUrl ? (
              <div className="space-y-2">
                <a href={shotUrl} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                  <img src={shotUrl} alt="Payment screenshot" className="w-full max-h-[380px] rounded-xl border border-background-200/70 object-contain bg-background-50" />
                </a>
                <div className="flex flex-wrap gap-2">
                  <a href={shotUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-background-200/70 bg-background-50 px-3 py-1.5 text-xs font-semibold text-foreground-800 hover:border-primary-300 cursor-pointer">
                    <i className="ri-external-link-line" aria-hidden="true"></i> Open full size
                  </a>
                  <button type="button" onClick={removeShot} className={btnDanger}>
                    <i className="ri-delete-bin-line" aria-hidden="true"></i> Remove
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[12px] text-foreground-600 leading-relaxed">
                No screenshot attached yet. Ask the customer for their bank transfer receipt on WhatsApp, then upload it here.
              </p>
            )}
            <label className="inline-flex items-center gap-2 rounded-full border border-background-200/70 bg-background-50 px-4 py-2 text-xs font-semibold text-foreground-800 hover:border-primary-300 cursor-pointer">
              <i className={uploading ? "ri-loader-4-line animate-spin" : "ri-upload-2-line"} aria-hidden="true"></i>
              {uploading ? "Uploading…" : "Upload / replace screenshot"}
              <input type="file" accept="image/*" onChange={handleShotUpload} disabled={uploading} className="hidden" />
            </label>
          </section>

          {/* Amounts */}
          <section className="rounded-xl bg-background-100 border border-background-200/70 p-4 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold flex items-center gap-2">
              <i className="ri-scales-3-line" aria-hidden="true"></i> Amount reconciliation
            </h4>
            <div className="flex items-center justify-between rounded-lg bg-background-50 border border-background-200/70 px-3.5 py-3">
              <span className="text-sm text-foreground-700">Expected amount</span>
              <span className="font-heading text-lg text-foreground-950">{aed(booking.amount)}</span>
            </div>
            <div>
              <label className={labelCls}>Amount received</label>
              <input value={received} onChange={(e) => setReceived(e.target.value.replace(/[^0-9.]/g, ""))} className={inputCls} placeholder="0" />
            </div>
            {mismatch && (
              <p className="flex items-start gap-2 rounded-lg border border-secondary-200 bg-secondary-100 px-3 py-2 text-xs font-semibold text-secondary-900">
                <i className="ri-alert-line mt-0.5" aria-hidden="true"></i>
                Received amount differs from the expected amount — please double-check before verifying.
              </p>
            )}
            <div>
              <label className={labelCls}>Bank / transfer reference</label>
              <input value={payRef} onChange={(e) => setPayRef(e.target.value)} className={inputCls} placeholder="e.g. ADIB txn ID" />
            </div>
            <div>
              <label className={labelCls}>Customer-visible update</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={500} className={`${inputCls} resize-none`} placeholder="e.g. Payment received — your groomer will arrive as scheduled."></textarea>
            </div>
            <button type="button" disabled={saving} onClick={saveNote} className={btnGhost}>
              <i className="ri-send-plane-line" aria-hidden="true"></i> Save update
            </button>
          </section>
        </div>

        {/* Customer + service summary */}
        <section className="rounded-xl bg-background-100 border border-background-200/70 p-4">
          <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold mb-2">Booking summary</h4>
          <p className="text-sm text-foreground-950 font-semibold">{booking.customer_name}</p>
          <p className="text-sm text-foreground-700">{booking.customer_phone} · {booking.customer_email}</p>
          <p className="mt-1 text-sm text-foreground-700">{[booking.pet_name, booking.pet_type, booking.pet_breed].filter(Boolean).join(" · ") || "Pet"} · {formatDateOnly(booking.preferred_date)} · {booking.time_slot}</p>
          <ul className="mt-3 divide-y divide-background-200/60">
            {(booking.services ?? []).map((s, i) => (
              <li key={i} className="flex items-center justify-between gap-4 py-2">
                <span className="text-sm text-foreground-950">{s.name}</span>
                <span className="text-sm font-medium text-foreground-950 whitespace-nowrap">{aed(s.price)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Verification log */}
        <section className="rounded-xl bg-background-100 border border-background-200/70 p-4">
          <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold mb-3 flex items-center gap-2">
            <i className="ri-history-line" aria-hidden="true"></i> Verification log
          </h4>
          {logsLoading ? (
            <p className="text-sm text-foreground-500">Loading log…</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-foreground-500">No activity recorded yet.</p>
          ) : (
            <ol className="relative border-l border-background-200 ml-2 space-y-4">
              {logs.map((l) => (
                <li key={l.id} className="ml-4">
                  <span className="absolute -left-[7px] mt-1.5 w-3 h-3 rounded-full bg-accent-500 border-2 border-background-50"></span>
                  <p className="text-sm font-semibold text-foreground-950">{LOG_LABELS[l.action] ?? l.action}</p>
                  <p className="text-[11px] text-foreground-500">{formatDateTime(l.created_at)}</p>
                  {l.amount != null && <p className="text-xs text-foreground-700">Amount: {aed(l.amount)}</p>}
                  {l.note && <p className="text-xs text-foreground-700 italic">“{l.note}”</p>}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </Modal>
  );
}
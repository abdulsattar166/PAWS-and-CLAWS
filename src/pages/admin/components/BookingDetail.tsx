import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { mapsEmbedSrc, mapsLink } from "@/lib/bookingOptions";
import {
  BOOKING_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  ADMIN_STATUS_LABELS,
  aed,
  displayBookingRef,
  formatDateOnly,
  formatDateTime,
  type BookingRow,
} from "@/lib/adminTypes";
import { Modal, btnPrimary, btnGhost, btnDanger, btnAccent, inputCls, labelCls, StatusPill } from "./AdminUi";

const BOOKING_STATUS_OPTIONS = [
  "pending_payment",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "rejected",
  "payment_failed",
];

function paymentTone(status: string): "neut" | "warn" | "ok" | "bad" {
  if (status === "paid") return "ok";
  if (status === "under_review" || status === "awaiting_transfer") return "warn";
  if (status === "failed") return "bad";
  return "neut";
}

function addressLines(b: BookingRow): string[] {
  const line1 = [b.addr_house_number, b.addr_street_number, b.addr_street_name].filter(Boolean).join(" ");
  return [
    line1,
    b.addr_area,
    [b.addr_city, b.addr_province].filter(Boolean).join(", "),
    b.addr_country,
    b.addr_postal_code,
    b.addr_landmark ? `Landmark: ${b.addr_landmark}` : "",
  ].filter((x) => x && String(x).trim());
}

export default function BookingDetail({
  booking,
  onClose,
  onUpdated,
}: {
  booking: BookingRow;
  onClose: () => void;
  onUpdated: (updated: BookingRow) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState(booking.admin_note ?? "");
  const [payRef, setPayRef] = useState(booking.payment_ref ?? "");
  const [statusSel, setStatusSel] = useState(booking.booking_status);
  const [feedback, setFeedback] = useState("");
  const [shotUrl, setShotUrl] = useState(booking.payment_screenshot_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [shotMsg, setShotMsg] = useState("");

  // Keep the status / screenshot selectors in sync when the booking is updated
  // (e.g. after an approve/reject) so a stale value can never revert it.
  useEffect(() => {
    setStatusSel(booking.booking_status);
    setShotUrl(booking.payment_screenshot_url ?? "");
  }, [booking.id, booking.booking_status, booking.payment_screenshot_url]);

  useEffect(() => {
    setNote(booking.admin_note ?? "");
    setPayRef(booking.payment_ref ?? "");
  }, [booking.id, booking.admin_note, booking.payment_ref]);

  const patch = async (values: Record<string, unknown>) => {
    if (!supabase) return;
    setSaving(true);
    setFeedback("");
    const { data, error } = await supabase
      .from("bookings")
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq("id", booking.id)
      .select()
      .maybeSingle();
    setSaving(false);
    if (error || !data) {
      setFeedback(error?.message ?? "Update failed. Please try again.");
      return;
    }
    onUpdated(data as BookingRow);
    setFeedback("Saved.");
    setTimeout(() => setFeedback(""), 1800);
  };

  const approve = () =>
    patch({
      payment_status: "paid",
      booking_status: "confirmed",
      admin_status: "approved",
      paid_at: booking.paid_at ?? new Date().toISOString(),
      payment_method: booking.payment_method ?? "bank_transfer",
    });

  const reject = () =>
    patch({ payment_status: "failed", booking_status: "rejected", admin_status: "rejected" });

  const underReview = () => patch({ payment_status: "under_review", admin_status: "pending" });
  const complete = () => patch({ booking_status: "completed", admin_status: "completed" });
  const cancel = () => patch({ booking_status: "cancelled", payment_status: "failed", admin_status: "rejected" });

  const saveNote = () => patch({ admin_note: note.trim() || null });
  const saveRef = () => patch({ payment_ref: payRef.trim() || null });
  const saveStatus = () => patch({ booking_status: statusSel });
  const startService = () => patch({ booking_status: "in_progress", admin_status: "approved" });

  // Attach the payment screenshot the customer sent over WhatsApp to this record.
  const handleShotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !supabase) return;
    setShotMsg("");
    setUploading(true);
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${booking.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("payment-proofs")
        .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("payment-proofs").getPublicUrl(path);
      const url = pub.publicUrl;
      setShotUrl(url);
      await patch({ payment_screenshot_url: url, payment_status: "under_review" });
      setShotMsg("Screenshot attached.");
      setTimeout(() => setShotMsg(""), 2000);
    } catch (err) {
      setShotMsg(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeShot = () => {
    setShotUrl("");
    patch({ payment_screenshot_url: null });
  };

  const hasGeo = booking.customer_lat != null && booking.customer_lng != null;

  const addr = addressLines(booking);

  return (
    <Modal
      open
      onClose={onClose}
      wide
      title={`Booking ${displayBookingRef(booking.booking_ref)}`}
      footer={
        <div className="flex flex-wrap items-center gap-2 w-full justify-between">
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={saving} onClick={approve} className={btnAccent}>
              <i className="ri-check-double-line" aria-hidden="true"></i> Approve payment
            </button>
            <button type="button" disabled={saving} onClick={underReview} className={btnGhost}>
              <i className="ri-file-search-line" aria-hidden="true"></i> Under review
            </button>
            <button type="button" disabled={saving} onClick={startService} className={btnGhost}>
              <i className="ri-play-circle-line" aria-hidden="true"></i> Start service
            </button>
            <button type="button" disabled={saving} onClick={complete} className={btnGhost}>
              <i className="ri-flag-line" aria-hidden="true"></i> Complete
            </button>
            <button type="button" disabled={saving} onClick={cancel} className={btnDanger}>
              <i className="ri-close-circle-line" aria-hidden="true"></i> Cancel
            </button>
            <button type="button" disabled={saving} onClick={reject} className={btnDanger}>
              <i className="ri-close-line" aria-hidden="true"></i> Reject
            </button>
          </div>
          {feedback && <span className="text-xs font-semibold text-accent-700">{feedback}</span>}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status summary */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill label={`Payment: ${PAYMENT_STATUS_LABELS[booking.payment_status] ?? booking.payment_status}`} tone={paymentTone(booking.payment_status)} icon="ri-secure-payment-line" />
          <StatusPill label={`Booking: ${BOOKING_STATUS_LABELS[booking.booking_status] ?? booking.booking_status}`} tone="info" icon="ri-calendar-check-line" />
          <StatusPill label={`Admin: ${ADMIN_STATUS_LABELS[booking.admin_status] ?? booking.admin_status}`} tone="neut" icon="ri-shield-user-line" />
        </div>

        {/* Customer + pet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <section className="rounded-xl bg-background-100 border border-background-200/70 p-4">
            <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold mb-2">Customer</h4>
            <p className="text-sm font-semibold text-foreground-950">{booking.customer_name}</p>
            <p className="mt-1 text-sm text-foreground-700 break-all">{booking.customer_email}</p>
            <p className="text-sm text-foreground-700">{booking.customer_phone}</p>
            {booking.customer_whatsapp && booking.customer_whatsapp !== booking.customer_phone && (
              <p className="text-sm text-foreground-700">WhatsApp: {booking.customer_whatsapp}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <a href={`tel:${booking.customer_phone}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-primary-600">
                <i className="ri-phone-line" aria-hidden="true"></i> Call
              </a>
              {booking.customer_whatsapp && (
                <a
                  href={`https://wa.me/${booking.customer_whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#128C4A] hover:text-[#25D366]"
                >
                  <i className="ri-whatsapp-line" aria-hidden="true"></i> WhatsApp
                </a>
              )}
            </div>
          </section>
          <section className="rounded-xl bg-background-100 border border-background-200/70 p-4">
            <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold mb-2">Pet</h4>
            <p className="text-sm font-semibold text-foreground-950">{booking.pet_name ?? "—"}</p>
            <p className="mt-1 text-sm text-foreground-700">
              {[booking.pet_type, booking.pet_breed, booking.pet_size].filter(Boolean).join(" · ") || "—"}
            </p>
          </section>
        </div>

        {/* Appointment + address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <section className="rounded-xl bg-background-100 border border-background-200/70 p-4">
            <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold mb-2">Appointment</h4>
            <p className="text-sm text-foreground-950">{formatDateOnly(booking.preferred_date)}</p>
            <p className="text-sm text-foreground-700">{booking.time_slot}</p>
            <p className="mt-2 text-[11px] text-foreground-500">Booked {formatDateTime(booking.created_at)}</p>
          </section>
          <section className="rounded-xl bg-background-100 border border-background-200/70 p-4">
            <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold mb-2">Service address</h4>
            {addr.length ? (
              <address className="not-italic text-sm text-foreground-700 leading-relaxed">{addr.join(", ")}</address>
            ) : (
              <p className="text-sm text-foreground-700">{booking.customer_address ?? "—"}</p>
            )}
          </section>
        </div>

        {/* Live location + complete address */}
        <section className="rounded-xl bg-background-100 border border-background-200/70 p-4">
          <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold mb-2 flex items-center gap-2">
            <i className="ri-road-map-line" aria-hidden="true"></i> Live location & complete address
          </h4>
          {booking.complete_address && (
            <p className="text-sm text-foreground-700 whitespace-pre-wrap leading-relaxed">{booking.complete_address}</p>
          )}
          {hasGeo ? (
            <div className="mt-3 space-y-2">
              <div className="overflow-hidden rounded-xl border border-background-200/70">
                <iframe
                  title="Customer shared location"
                  src={mapsEmbedSrc(Number(booking.customer_lat), Number(booking.customer_lng))}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                ></iframe>
              </div>
              <p className="flex flex-wrap items-center gap-2 text-xs text-foreground-700">
                <i className="ri-map-pin-2-fill text-accent-500" aria-hidden="true"></i>
                {Number(booking.customer_lat).toFixed(5)}, {Number(booking.customer_lng).toFixed(5)}
                <a
                  href={mapsLink(Number(booking.customer_lat), Number(booking.customer_lng))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1 font-semibold text-primary-700 hover:text-primary-600"
                >
                  <i className="ri-external-link-line" aria-hidden="true"></i> Open in Maps
                </a>
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-foreground-500">Customer did not share a live location.</p>
          )}
        </section>

        {/* Services + amount */}
        <section className="rounded-xl bg-background-100 border border-background-200/70 p-4">
          <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold mb-2">Services</h4>
          <ul className="divide-y divide-background-200/60">
            {(booking.services ?? []).map((s, i) => (
              <li key={i} className="flex items-center justify-between gap-4 py-2">
                <span className="text-sm text-foreground-950">{s.name}</span>
                <span className="text-sm font-medium text-foreground-950 whitespace-nowrap">{aed(s.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 pt-2 border-t border-background-200/70 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground-950">Total payable</span>
            <span className="font-heading text-lg text-foreground-950">{aed(booking.amount)}</span>
          </div>
        </section>

        {/* Notes / health */}
        {(booking.special_notes || booking.health_info) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <section className="rounded-xl bg-background-100 border border-background-200/70 p-4">
              <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold mb-2">Special notes</h4>
              <p className="text-sm text-foreground-700 whitespace-pre-wrap">{booking.special_notes || "—"}</p>
            </section>
            <section className="rounded-xl bg-background-100 border border-background-200/70 p-4">
              <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold mb-2">Health / medical</h4>
              <p className="text-sm text-foreground-700 whitespace-pre-wrap">{booking.health_info || "—"}</p>
            </section>
          </div>
        )}

        {/* Payment verification */}
        <section className="rounded-xl bg-secondary-50 border border-secondary-200/60 p-4 space-y-3">
          <h4 className="text-xs uppercase tracking-[0.14em] text-secondary-900 font-semibold flex items-center gap-2">
            <i className="ri-shield-check-line" aria-hidden="true"></i> Payment verification
          </h4>
          <p className="text-[12px] text-foreground-700 leading-relaxed">
            Confirm the transfer against the customer's WhatsApp screenshot, then record the bank reference and approve.
            A screenshot alone does not mark a payment verified — approval is always manual.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
            <div className="flex-1">
              <label className={labelCls}>Bank / transfer reference</label>
              <input value={payRef} onChange={(e) => setPayRef(e.target.value)} className={inputCls} placeholder="e.g. ADIB txn ID" />
            </div>
            <button type="button" disabled={saving} onClick={saveRef} className={btnGhost}>Save ref</button>
          </div>
        </section>

        {/* Payment screenshot */}
        <section className="rounded-xl bg-background-100 border border-background-200/70 p-4 space-y-3">
          <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold flex items-center gap-2">
            <i className="ri-image-2-line" aria-hidden="true"></i> Payment screenshot
          </h4>
          {shotUrl ? (
            <div className="space-y-2">
              <a href={shotUrl} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                <img
                  src={shotUrl}
                  alt="Payment screenshot"
                  className="max-h-72 w-full rounded-xl border border-background-200/70 object-contain bg-background-50"
                />
              </a>
              <div className="flex flex-wrap gap-2">
                <a
                  href={shotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-background-200/70 bg-background-50 px-3 py-1.5 text-xs font-semibold text-foreground-800 hover:border-primary-300 cursor-pointer"
                >
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
          {shotMsg && <p className="text-xs font-semibold text-accent-700">{shotMsg}</p>}
        </section>

        {/* Customer-visible update + status */}
        <section className="rounded-xl bg-background-100 border border-background-200/70 p-4 space-y-3">
          <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold flex items-center gap-2">
            <i className="ri-megaphone-line" aria-hidden="true"></i> Update shown to the customer
          </h4>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} rows={3} className={`${inputCls} resize-none`} placeholder="e.g. Payment received — your groomer will arrive as scheduled."></textarea>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-end gap-2">
              <div>
                <label className={labelCls}>Booking status</label>
                <select value={statusSel} onChange={(e) => setStatusSel(e.target.value)} className={`${inputCls} cursor-pointer`}>
                  {BOOKING_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{BOOKING_STATUS_LABELS[s] ?? s}</option>
                  ))}
                </select>
              </div>
              <button type="button" disabled={saving} onClick={saveStatus} className={btnGhost}>Set</button>
            </div>
            <button type="button" disabled={saving} onClick={saveNote} className={btnPrimary}>
              <i className="ri-send-plane-line" aria-hidden="true"></i> Save update
            </button>
          </div>
        </section>
      </div>
    </Modal>
  );
}
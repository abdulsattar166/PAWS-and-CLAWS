import { useEffect, useState } from "react";
import { supabase, functionsBaseUrl, supabaseAnonKey } from "@/lib/supabase";
import { mapsEmbedSrc, mapsLink } from "@/lib/bookingOptions";
import {
  BOOKING_STATUS_LABELS,
  ADMIN_STATUS_LABELS,
  aed,
  displayBookingRef,
  formatDateOnly,
  formatDateTime,
  buildCustomerApprovalMessage,
  type BookingRow,
} from "@/lib/adminTypes";
import { Modal, btnPrimary, btnGhost, btnDanger, btnAccent, inputCls, labelCls, StatusPill } from "./AdminUi";

const BOOKING_STATUS_OPTIONS = ["pending_payment", "confirmed", "in_progress", "completed", "cancelled", "rejected"];

function bookingTone(status: string): "neut" | "warn" | "ok" | "bad" {
  if (status === "confirmed" || status === "completed") return "ok";
  if (status === "in_progress") return "warn";
  if (status === "rejected" || status === "cancelled" || status === "payment_failed") return "bad";
  return "neut";
}

function waTone(status: string | null): "neut" | "warn" | "ok" | "bad" {
  if (status === "sent") return "ok";
  if (status === "failed") return "bad";
  if (status === "not_configured") return "warn";
  return "neut";
}

function waLabel(status: string | null): string {
  if (status === "sent") return "WhatsApp sent";
  if (status === "failed") return "WhatsApp failed";
  if (status === "not_configured") return "WhatsApp not configured";
  return "Not sent yet";
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
  const [statusSel, setStatusSel] = useState(booking.booking_status);
  const [feedback, setFeedback] = useState("");
  const [waBusy, setWaBusy] = useState(false);
  const [waMsg, setWaMsg] = useState("");

  useEffect(() => {
    setStatusSel(booking.booking_status);
    setNote(booking.admin_note ?? "");
  }, [booking.id, booking.booking_status, booking.admin_note]);

  const patch = async (values: Record<string, unknown>): Promise<BookingRow | null> => {
    if (!supabase) return null;
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
      return null;
    }
    onUpdated(data as BookingRow);
    setFeedback("Saved.");
    setTimeout(() => setFeedback(""), 1800);
    return data as BookingRow;
  };

  // Send (or re-send) the approval message to the customer's WhatsApp and
  // record the delivery status on the booking so admins can see it.
  const notifyCustomer = async (): Promise<void> => {
    setWaBusy(true);
    setWaMsg("");
    try {
      const res = await fetch(`${functionsBaseUrl}/notify-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (data.waLink && (!res.ok || data.status !== "sent")) {
        // Provider not configured / failed — open WhatsApp so the admin can send it manually.
        window.open(data.waLink as string, "_blank", "noopener,noreferrer");
      }
      // Refresh the row so the new whatsapp_status is reflected.
      const { data: fresh } = await supabase.from("bookings").select("*").eq("id", booking.id).maybeSingle();
      if (fresh) onUpdated(fresh as BookingRow);
      setWaMsg(data.status === "sent" ? "WhatsApp sent." : data.status === "not_configured" ? "Opened WhatsApp to send manually." : "Could not send automatically — opened WhatsApp.");
    } catch {
      setWaMsg("Could not reach the WhatsApp service. Open WhatsApp manually below.");
    } finally {
      setWaBusy(false);
      setTimeout(() => setWaMsg(""), 3000);
    }
  };

  const approve = async () => {
    const updated = await patch({ booking_status: "confirmed", admin_status: "approved" });
    if (updated) await notifyCustomer();
  };
  const reject = () => patch({ booking_status: "rejected", admin_status: "rejected" });
  const startService = () => patch({ booking_status: "in_progress", admin_status: "approved" });
  const complete = () => patch({ booking_status: "completed", admin_status: "completed" });
  const cancel = () => patch({ booking_status: "cancelled", admin_status: "rejected" });
  const saveNote = () => patch({ admin_note: note.trim() || null });
  const saveStatus = () => patch({ booking_status: statusSel });

  const hasGeo = booking.customer_lat != null && booking.customer_lng != null;
  const addr = addressLines(booking);
  const waNumber = (booking.customer_whatsapp || booking.customer_phone || "").replace(/\D/g, "");
  const manualWaLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(buildCustomerApprovalMessage(booking))}`;

  return (
    <Modal
      open
      onClose={onClose}
      wide
      title={`Booking ${displayBookingRef(booking.booking_ref)}`}
      footer={
        <div className="flex flex-wrap items-center gap-2 w-full justify-between">
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={saving || waBusy} onClick={approve} className={btnAccent}>
              <i className="ri-check-double-line" aria-hidden="true"></i> Approve &amp; notify
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
          <StatusPill label={`Booking: ${BOOKING_STATUS_LABELS[booking.booking_status] ?? booking.booking_status}`} tone={bookingTone(booking.booking_status)} icon="ri-calendar-check-line" />
          <StatusPill label={`Admin: ${ADMIN_STATUS_LABELS[booking.admin_status] ?? booking.admin_status}`} tone="neut" icon="ri-shield-user-line" />
          <StatusPill label={waLabel(booking.whatsapp_status)} tone={waTone(booking.whatsapp_status)} icon="ri-whatsapp-line" />
        </div>

        {/* WhatsApp approval notification */}
        <section className="rounded-xl bg-background-100 border border-background-200/70 p-4 space-y-3">
          <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold flex items-center gap-2">
            <i className="ri-whatsapp-line text-[#25D366]" aria-hidden="true"></i> WhatsApp notification
          </h4>
          <p className="text-[12px] text-foreground-700 leading-relaxed">
            Approving a booking automatically sends the customer a WhatsApp confirmation with their booking details.
            {booking.whatsapp_status === "not_configured" && " WhatsApp is not connected yet, so approving opens a pre-filled WhatsApp chat for you to send manually."}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className={`inline-flex items-center gap-1.5 font-semibold ${booking.whatsapp_status === "sent" ? "text-accent-700" : booking.whatsapp_status === "failed" ? "text-red-600" : "text-foreground-600"}`}>
              <i className={booking.whatsapp_status === "sent" ? "ri-checkbox-circle-line" : booking.whatsapp_status === "failed" ? "ri-error-warning-line" : "ri-time-line"} aria-hidden="true"></i>
              {waLabel(booking.whatsapp_status)}
            </span>
            {booking.whatsapp_sent_at && <span className="text-foreground-500">· {formatDateTime(booking.whatsapp_sent_at)}</span>}
            {booking.whatsapp_error && <span className="text-foreground-500 break-all">· {booking.whatsapp_error}</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={waBusy} onClick={notifyCustomer} className={btnPrimary}>
              <i className={waBusy ? "ri-loader-4-line animate-spin" : "ri-send-plane-line"} aria-hidden="true"></i>
              {booking.whatsapp_status === "sent" ? "Resend on WhatsApp" : "Send on WhatsApp"}
            </button>
            <a href={manualWaLink} target="_blank" rel="noopener noreferrer" className={btnGhost}>
              <i className="ri-external-link-line" aria-hidden="true"></i> Open WhatsApp manually
            </a>
          </div>
          {waMsg && <p className="text-xs font-semibold text-accent-700">{waMsg}</p>}
        </section>

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
                  href={`https://wa.me/${waNumber}`}
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
            <p className="mt-2 text-[11px] text-foreground-500">Requested {formatDateTime(booking.created_at)}</p>
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
            <span className="text-sm font-semibold text-foreground-950">Total</span>
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

        {/* Customer-visible update + status */}
        <section className="rounded-xl bg-background-100 border border-background-200/70 p-4 space-y-3">
          <h4 className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold flex items-center gap-2">
            <i className="ri-megaphone-line" aria-hidden="true"></i> Update shown to the customer
          </h4>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} rows={3} className={`${inputCls} resize-none`} placeholder="e.g. Your groomer will arrive as scheduled."></textarea>
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

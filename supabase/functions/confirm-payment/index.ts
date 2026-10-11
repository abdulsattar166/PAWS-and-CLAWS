// confirm-payment
// Called when the customer clicks "Confirm Your Payment" (after transferring
// the amount by bank transfer). This is the ONLY moment a customer-facing
// Booking Reference ID (PC@YYYY/N) is generated — the booking row already
// exists from create-booking with an internal placeholder reference.
//
// It marks the payment as *submitted for review* (under_review). It never
// marks the payment as paid/verified — that stays a manual admin decision.
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

interface BookingRow {
  id: string;
  booking_ref: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_whatsapp: string | null;
  customer_address: string | null;
  complete_address: string | null;
  customer_lat: number | null;
  customer_lng: number | null;
  pet_name: string | null;
  pet_type: string | null;
  pet_breed: string | null;
  pet_size: string | null;
  services: Array<{ name: string; price: number }>;
  amount: number;
  currency: string;
  preferred_date: string;
  time_slot: string;
  booking_status: string;
  payment_status: string;
  payment_method: string | null;
  admin_status: string | null;
  admin_note: string | null;
  payment_screenshot_url: string | null;
  created_at: string;
}

const money = (n: number) => `AED ${Number(n).toFixed(0)}`;

// Plain-text copy of the request, identical in spirit to the customer-facing
// WhatsApp copy, used for the automatic server-side admin notification.
function buildAdminText(b: BookingRow): string {
  const lines: string[] = ["🚨 NEW BOOKING REQUEST — Paws and Claws", ""];
  lines.push(`Booking Ref: ${b.booking_ref ?? "Pending"}`);
  lines.push("Status: Pending admin approval");
  lines.push("");
  lines.push("*Customer*");
  lines.push(`Name: ${b.customer_name}`);
  lines.push(`Phone: ${b.customer_phone}`);
  if (b.customer_whatsapp) lines.push(`WhatsApp: ${b.customer_whatsapp}`);
  if (b.customer_email) lines.push(`Email: ${b.customer_email}`);
  lines.push("");
  const pet = [b.pet_name, b.pet_type, b.pet_breed, b.pet_size].filter(Boolean).join(" · ");
  lines.push(`*Pet:* ${pet || "-"}`);
  lines.push("");
  lines.push("*Selected services:*");
  (b.services ?? []).forEach((s) => lines.push(`• ${s.name} — ${money(s.price)}`));
  lines.push(`*Total: ${money(b.amount)} ${b.currency}*`);
  lines.push("");
  lines.push(`*Arrival:* ${b.preferred_date} · ${b.time_slot}`);
  lines.push(`*Address:* ${b.customer_address ?? "-"}`);
  if (b.complete_address) lines.push(`Notes address: ${b.complete_address}`);
  if (b.customer_lat != null && b.customer_lng != null) {
    lines.push(`*Live location:* https://www.google.com/maps?q=${b.customer_lat},${b.customer_lng}`);
  }
  lines.push("");
  lines.push(`*Payment screenshot:* ${b.payment_screenshot_url ?? "Uploaded on the website (see Admin Panel)"}`);
  lines.push("");
  lines.push("Please review and approve this booking in the Admin Panel.");
  return lines.join("\n");
}

// Best-effort automatic notification. Sends to a WhatsApp provider and/or a
// generic webhook when configured via secrets; silently does nothing otherwise.
async function notifyAdmin(b: BookingRow): Promise<void> {
  const text = buildAdminText(b);
  const webhook = Deno.env.get("ADMIN_NOTIFY_WEBHOOK") ?? "";
  const token = Deno.env.get("WHATSAPP_ACCESS_TOKEN") ?? "";
  const phoneId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID") ?? "";
  const adminTo = Deno.env.get("ADMIN_WHATSAPP_NUMBER") ?? "971557033165";

  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, booking: b }),
      });
    } catch (_e) { /* non-fatal */ }
  }

  if (token && phoneId) {
    try {
      await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: adminTo,
          type: "text",
          text: { preview_url: true, body: text },
        }),
      });
    } catch (_e) { /* non-fatal */ }
  }
}

function shape(b: BookingRow) {
  return {
    bookingId: b.id,
    ref: b.booking_ref,
    customerName: b.customer_name,
    customerEmail: b.customer_email,
    customerPhone: b.customer_phone,
    address: b.customer_address,
    completeAddress: b.complete_address,
    lat: b.customer_lat,
    lng: b.customer_lng,
    petName: b.pet_name,
    petType: b.pet_type,
    petBreed: b.pet_breed,
    petSize: b.pet_size,
    services: b.services,
    amount: b.amount,
    currency: b.currency,
    date: b.preferred_date,
    timeSlot: b.time_slot,
    bookingStatus: b.booking_status,
    paymentStatus: b.payment_status,
    paymentMethod: b.payment_method,
    adminStatus: b.admin_status,
    adminNote: b.admin_note,
    paymentScreenshotUrl: b.payment_screenshot_url,
    createdAt: b.created_at,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }

  const bookingId = (body.bookingId ?? "").trim();
  if (!bookingId) return json({ ok: false, error: "missing_booking_id" }, 400);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: existing, error: fetchErr } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .maybeSingle();

  if (fetchErr || !existing) return json({ ok: false, error: "not_found" }, 404);
  const booking = existing as unknown as BookingRow;

  // Never touch a booking whose payment has already been verified.
  if (booking.payment_status === "paid") {
    return json({ ok: true, bookingRef: booking.booking_ref ?? "", booking: shape(booking) });
  }

  // Idempotent: if the real reference already exists, just return it.
  const alreadyGenerated = typeof booking.booking_ref === "string" && booking.booking_ref.startsWith("PC@");

  let ref = booking.booking_ref ?? "";
  let result = booking;

  if (!alreadyGenerated) {
    // Atomic, concurrency-safe sequential reference from the DB sequence.
    const { data: refData, error: refErr } = await supabase.rpc("next_booking_ref");
    if (refErr || !refData) {
      return json({ ok: false, error: "ref_failed", detail: refErr?.message }, 500);
    }
    ref = String(refData);

    const { data: updated, error: updateErr } = await supabase
      .from("bookings")
      .update({
        booking_ref: ref,
        payment_status: "under_review",
        admin_status: "pending",
        hold_expires_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select()
      .maybeSingle();

    if (updateErr || !updated) {
      return json({ ok: false, error: "update_failed", detail: updateErr?.message }, 500);
    }
    result = updated as unknown as BookingRow;

    // Fire-and-forget: push the full request to the admin (WhatsApp/webhook)
    // so the team gets an immediate copy alongside the Admin Panel entry.
    await notifyAdmin(result);
  }

  return json({ ok: true, bookingRef: ref, booking: shape(result) });
});

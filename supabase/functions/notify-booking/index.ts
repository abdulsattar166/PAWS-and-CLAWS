// notify-booking
// Called by the Admin Panel when a booking is approved. Sends a WhatsApp
// message to the customer confirming the approval with the key booking details,
// then records whether the message was sent or failed so the admin can see it.
//
// Delivery uses the WhatsApp Cloud API when the secrets
// WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID are configured. When they
// are not, the function reports "not_configured" and the admin can still send
// the message manually from their own WhatsApp.
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
  customer_whatsapp: string | null;
  customer_phone: string;
  pet_name: string | null;
  services: Array<{ name: string; price: number }>;
  preferred_date: string;
  time_slot: string;
  customer_address: string | null;
  amount: number;
  currency: string;
  booking_status: string;
}

const money = (n: number) => `AED ${Number(n).toFixed(0)}`;

/** Normalise to digits so wa.me / Cloud API accept the number. */
function digits(value: string | null | undefined): string {
  return String(value ?? "").replace(/\D/g, "");
}

function buildApprovalMessage(b: BookingRow): string {
  const services = (b.services ?? []).map((s) => s.name).join(", ") || "-";
  return [
    "*Paws and Claws — Booking Approved ✅*",
    "",
    `Hi ${b.customer_name}, great news — your booking has been approved!`,
    "",
    `Booking reference: ${b.booking_ref ?? "-"}`,
    `Pet: ${b.pet_name ?? "-"}`,
    `Service: ${services}`,
    `Date: ${b.preferred_date}`,
    `Time slot: ${b.time_slot}`,
    b.customer_address ? `Location: ${b.customer_address}` : "",
    `Total: ${money(b.amount)} ${b.currency}`,
    "",
    "Our mobile grooming van will arrive in the time window above. Reply here if anything changes.",
    "Thank you for choosing Paws and Claws!",
  ]
    .filter(Boolean)
    .join("\n");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }

  const bookingId = String(body.bookingId ?? "").trim();
  if (!bookingId) return json({ ok: false, error: "missing_booking_id" }, 400);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data, error } = await supabase
    .from("bookings")
    .select("id, booking_ref, customer_name, customer_whatsapp, customer_phone, pet_name, services, preferred_date, time_slot, customer_address, amount, currency, booking_status")
    .eq("id", bookingId)
    .maybeSingle();

  if (error || !data) return json({ ok: false, error: "not_found" }, 404);
  const booking = data as unknown as BookingRow;

  const to = digits(booking.customer_whatsapp || booking.customer_phone);
  const message = buildApprovalMessage(booking);

  const token = Deno.env.get("WHATSAPP_ACCESS_TOKEN") ?? "";
  const phoneId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID") ?? "";

  // No provider configured → let the admin send it manually from their phone.
  if (!token || !phoneId || to.length < 7) {
    await supabase
      .from("bookings")
      .update({
        whatsapp_status: token && phoneId ? "failed" : "not_configured",
        whatsapp_error: token && phoneId ? "invalid_whatsapp_number" : "whatsapp_provider_not_configured",
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId);
    return json({
      ok: false,
      status: token && phoneId ? "failed" : "not_configured",
      message,
      to,
      waLink: `https://wa.me/${to}?text=${encodeURIComponent(message)}`,
    });
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { preview_url: false, body: message },
      }),
    });
    const ok = res.ok;
    const detail = ok ? null : (await res.text()).slice(0, 300);
    await supabase
      .from("bookings")
      .update({
        whatsapp_status: ok ? "sent" : "failed",
        whatsapp_sent_at: ok ? new Date().toISOString() : null,
        whatsapp_error: detail,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId);
    return json({ ok, status: ok ? "sent" : "failed", detail, waLink: `https://wa.me/${to}?text=${encodeURIComponent(message)}` });
  } catch (e) {
    await supabase
      .from("bookings")
      .update({
        whatsapp_status: "failed",
        whatsapp_error: String(e).slice(0, 300),
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId);
    return json({ ok: false, status: "failed", detail: String(e).slice(0, 300), waLink: `https://wa.me/${to}?text=${encodeURIComponent(message)}` });
  }
});

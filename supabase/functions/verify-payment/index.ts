// verify-payment
// Used by the success page (card path, legacy) and the customer tracking page.
// Looks a booking up by Stripe session id or by booking reference, and returns
// the shaped booking plus its live statuses and any admin update.
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import Stripe from "npm:stripe@17.4.0";

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

const money = (n: number) => `AED ${Number(n).toFixed(2)}`;

interface BookingRow {
  booking_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_whatsapp: string | null;
  customer_address: string | null;
  addr_house_number: string | null;
  addr_street_number: string | null;
  addr_street_name: string | null;
  addr_area: string | null;
  addr_city: string | null;
  addr_province: string | null;
  addr_country: string | null;
  addr_postal_code: string | null;
  addr_landmark: string | null;
  pet_name: string | null;
  pet_type: string | null;
  pet_breed: string | null;
  pet_size: string | null;
  services: Array<{ name: string; price: number }>;
  amount: number;
  currency: string;
  preferred_date: string;
  time_slot: string;
  health_info: string | null;
  special_notes: string | null;
  booking_status: string;
  payment_status: string;
  payment_method: string | null;
  payment_ref: string | null;
  admin_status: string | null;
  admin_note: string | null;
  payment_screenshot_url: string | null;
  created_at: string;
}

function servicesHtml(b: BookingRow) {
  return (b.services ?? []).map((s) => `${s.name} — ${money(s.price)}`).join("<br/>");
}

function addressHtml(b: BookingRow) {
  const rows: Array<[string, string | null]> = [
    ["House / Home No.", b.addr_house_number],
    ["Street No.", b.addr_street_number],
    ["Street Name", b.addr_street_name],
    ["Area / Neighbourhood", b.addr_area],
    ["City", b.addr_city],
    ["Province / Emirate", b.addr_province],
    ["Country", b.addr_country],
    ["Postal Code", b.addr_postal_code],
    ["Landmark", b.addr_landmark],
  ].filter(([, v]) => v && String(v).trim());
  if (rows.length === 0) return b.customer_address ?? "-";
  return rows.map(([k, v]) => `${k}: ${v}`).join("<br/>");
}

async function sendResend(to: string, subject: string, html: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  const domain = Deno.env.get("RESEND_FROM_DOMAIN");
  if (!key || !domain) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: `Paws and Claws <noreply@${domain}>`, to: [to], subject, html }),
  });
  return res.ok;
}

async function sendBusinessEmail(b: BookingRow) {
  const businessEmail = Deno.env.get("BUSINESS_EMAIL") ?? "Pawsandclawsauh@gmail.com";
  const html = `
    <h2>New Paid Booking Received – ${b.booking_ref}</h2>
    <p><strong>Payment status:</strong> ${b.payment_status} (${b.payment_ref ?? "n/a"})</p>
    <h3>Customer</h3>
    <p>Name: ${b.customer_name}<br/>Email: ${b.customer_email}<br/>Phone: ${b.customer_phone}</p>
    <h3>Service location (home visit)</h3>
    <p>${addressHtml(b)}</p>
    <h3>Pet</h3>
    <p>Name: ${b.pet_name ?? "-"}<br/>Type: ${b.pet_type ?? "-"}<br/>Breed: ${b.pet_breed ?? "-"}<br/>Size: ${b.pet_size ?? "-"}</p>
    <h3>Service</h3>
    <p>${servicesHtml(b)}</p>
    <h3>Appointment</h3>
    <p>Date: ${b.preferred_date}<br/>Arrival window: ${b.time_slot}</p>
    <h3>Total</h3><p><strong>${money(b.amount)} ${b.currency}</strong></p>
  `;
  await sendResend(businessEmail, `New Paid Booking Received – ${b.booking_ref}`, html);
}

async function sendCustomerEmail(b: BookingRow) {
  const html = `
    <h2>Thank you for choosing Paws &amp; Claws!</h2>
    <p>Your booking has been successfully confirmed. We can't wait to meet ${b.pet_name ?? "your pet"}.</p>
    <p><strong>Booking reference:</strong> ${b.booking_ref}</p>
    <h3>Services</h3><p>${servicesHtml(b)}</p>
    <h3>Appointment</h3><p>Date: ${b.preferred_date}<br/>Arrival window: ${b.time_slot}</p>
    <h3>Total paid</h3><p><strong>${money(b.amount)} ${b.currency}</strong> — payment status: ${b.payment_status}</p>
  `;
  await sendResend(b.customer_email, `Your booking is confirmed – ${b.booking_ref}`, html);
}

async function confirmBooking(
  supabase: ReturnType<typeof createClient>,
  bookingId: string,
  paymentRef: string | null,
) {
  const { data: updated, error } = await supabase
    .from("bookings")
    .update({
      booking_status: "confirmed",
      payment_status: "paid",
      payment_ref: paymentRef,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId)
    .neq("payment_status", "paid")
    .select()
    .single();

  if (error || !updated) return null;
  const booking = updated as unknown as BookingRow;
  await Promise.all([sendBusinessEmail(booking), sendCustomerEmail(booking)]);
  return booking;
}

function shape(b: BookingRow) {
  return {
    ref: b.booking_ref,
    customerName: b.customer_name,
    customerEmail: b.customer_email,
    customerPhone: b.customer_phone,
    customerWhatsapp: b.customer_whatsapp,
    petName: b.pet_name,
    petType: b.pet_type,
    petBreed: b.pet_breed,
    petSize: b.pet_size,
    address: b.customer_address,
    date: b.preferred_date,
    timeSlot: b.time_slot,
    services: b.services,
    amount: b.amount,
    currency: b.currency,
    bookingStatus: b.booking_status,
    paymentStatus: b.payment_status,
    paymentMethod: b.payment_method,
    adminStatus: b.admin_status,
    adminNote: b.admin_note,
    paymentScreenshotUrl: b.payment_screenshot_url,
    createdAt: b.created_at,
  };
}

// Normalise a phone number down to its digits for a tolerant comparison.
function digits(value: string | null | undefined): string {
  return String(value ?? "").replace(/\D/g, "");
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

  const sessionId = body.sessionId ?? "";
  const bookingRef = body.bookingRef ?? "";
  const phone = body.phone ?? "";

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  let bookingId = "";

  if (sessionId) {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return json({ ok: false, error: "payment_not_configured" }, 503);

    try {
      const stripe = new Stripe(stripeKey, {
        apiVersion: "2024-06-20",
        httpClient: Stripe.createFetchHttpClient(),
      });
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      bookingId = session.metadata?.booking_id ?? "";
      if (session.payment_status === "paid" && bookingId) {
        await confirmBooking(supabase, bookingId, (session.payment_intent as string) ?? null);
      }
    } catch (err) {
      return json({ ok: false, error: "stripe_error", detail: String(err).slice(0, 300) }, 500);
    }
  } else if (bookingRef) {
    const { data } = await supabase.from("bookings").select("id").eq("booking_ref", bookingRef).maybeSingle();
    bookingId = (data?.id as string) ?? "";
  }

  if (!bookingId) return json({ ok: false, error: "not_found" }, 404);

  const { data: booking, error } = await supabase.from("bookings").select("*").eq("id", bookingId).maybeSingle();
  if (error || !booking) return json({ ok: false, error: "not_found" }, 404);

  const row = booking as unknown as BookingRow;

  // Privacy gate: reference + phone lookups must match the booking's phone or
  // WhatsApp number. (Stripe session lookups skip this — the session id is the
  // secret.) This stops one customer's reference exposing another's details.
  if (!sessionId) {
    const entered = digits(phone);
    if (entered.length < 7) return json({ ok: false, error: "verify_failed" }, 403);
    const matches =
      entered === digits(row.customer_phone) || entered === digits(row.customer_whatsapp);
    if (!matches) return json({ ok: false, error: "verify_failed" }, 403);
  }

  const shaped = shape(row);
  return json({
    ok: true,
    status: shaped.bookingStatus,
    paymentStatus: shaped.paymentStatus,
    booking: shaped,
  });
});

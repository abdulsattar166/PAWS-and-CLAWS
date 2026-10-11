// stripe-webhook
// Verifies the Stripe signature, then confirms the booking ONLY after the
// payment is genuinely paid. Sends the business + customer emails exactly once.
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import Stripe from "npm:stripe@17.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const money = (n: number) => `AED ${Number(n).toFixed(2)}`;

interface BookingRow {
  booking_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
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
  payment_status: string;
  payment_ref: string | null;
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
    body: JSON.stringify({
      from: `Paws and Claws <noreply@${domain}>`,
      to: [to],
      subject,
      html,
    }),
  });
  return res.ok;
}

async function sendBusinessEmail(b: BookingRow) {
  const businessEmail = Deno.env.get("BUSINESS_EMAIL") ?? "Pawsandclawsauh@gmail.com";
  const html = `
    <h2>New Paid Booking Received – ${b.booking_ref}</h2>
    <p><strong>Payment status:</strong> ${b.payment_status} (${b.payment_ref ?? "n/a"})</p>
    <h3>Customer</h3>
    <p>Name: ${b.customer_name}<br/>
       Email: ${b.customer_email}<br/>
       Phone: ${b.customer_phone}</p>
    <h3>Service location (home visit)</h3>
    <p>${addressHtml(b)}</p>
    <h3>Pet</h3>
    <p>Name: ${b.pet_name ?? "-"}<br/>
       Type: ${b.pet_type ?? "-"}<br/>
       Breed: ${b.pet_breed ?? "-"}<br/>
       Size: ${b.pet_size ?? "-"}</p>
    <h3>Service</h3>
    <p>${servicesHtml(b)}</p>
    <h3>Appointment</h3>
    <p>Date: ${b.preferred_date}<br/>
       Arrival window: ${b.time_slot}</p>
    <h3>Health / medical</h3>
    <p>${b.health_info ?? "-"}</p>
    <h3>Special notes</h3>
    <p>${b.special_notes ?? "-"}</p>
    <h3>Total</h3>
    <p><strong>${money(b.amount)} ${b.currency}</strong></p>
    <p>The customer's payment has been successfully completed.</p>
  `;
  await sendResend(businessEmail, `New Paid Booking Received – ${b.booking_ref}`, html);
}

async function sendCustomerEmail(b: BookingRow) {
  const html = `
    <h2>Thank you for choosing Paws &amp; Claws!</h2>
    <p>Your booking has been successfully confirmed. We can't wait to meet ${b.pet_name ?? "your pet"}.</p>
    <p><strong>Booking reference:</strong> ${b.booking_ref}</p>
    <h3>Services</h3>
    <p>${servicesHtml(b)}</p>
    <h3>Appointment</h3>
    <p>Date: ${b.preferred_date}<br/>Arrival window: ${b.time_slot}</p>
    <h3>Pet</h3>
    <p>${b.pet_name ?? "-"} · ${b.pet_type ?? "-"} · ${b.pet_breed ?? "-"} · ${b.pet_size ?? "-"}</p>
    <h3>Total paid</h3>
    <p><strong>${money(b.amount)} ${b.currency}</strong> — payment status: ${b.payment_status}</p>
    <p>Paws and Claws Pets Grooming Salon LLC<br/>
       Phone: +971 55 703 3165 · WhatsApp: +971 55 984 7575<br/>
       Email: Pawsandclawsauh@gmail.com</p>
  `;
  await sendResend(b.customer_email, `Your booking is confirmed – ${b.booking_ref}`, html);
}

async function confirmBooking(
  supabase: ReturnType<typeof createClient>,
  bookingId: string,
  paymentRef: string | null,
  provider = "stripe",
) {
  const { data: updated, error } = await supabase
    .from("bookings")
    .update({
      booking_status: "confirmed",
      payment_status: "paid",
      payment_ref: paymentRef,
      payment_provider: provider,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId)
    .neq("payment_status", "paid")
    .select()
    .single();

  if (error || !updated) return null; // already confirmed or not found
  const booking = updated as unknown as BookingRow;
  await Promise.all([sendBusinessEmail(booking), sendCustomerEmail(booking)]);
  return booking;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

  const sig = req.headers.get("stripe-signature") ?? "";
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
  const raw = await req.text();

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient(),
  });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, secret);
  } catch (err) {
    return new Response(`Webhook Error: ${String(err)}`, { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.booking_id;
      if (bookingId && session.payment_status === "paid") {
        await confirmBooking(supabase, bookingId, (session.payment_intent as string) ?? null);
      }
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.booking_id;
      if (bookingId) {
        await supabase
          .from("bookings")
          .update({
            booking_status: "cancelled",
            payment_status: "cancelled",
            hold_expires_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", bookingId)
          .neq("payment_status", "paid");
      }
    }
  } catch (err) {
    return new Response(`Handler Error: ${String(err)}`, { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

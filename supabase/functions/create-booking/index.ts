// create-booking
// Validates the booking on the server, re-prices services from the database
// (never trusting the client), applies any live offer discounts, reserves the
// date+time slot, and saves the booking so the customer can pay by bank
// transfer and confirm via WhatsApp. No card processing.
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

const HOLD_HOURS = 24;

const ALLOWED_PET_TYPES = ["dog", "cat", "bird", "rabbit", "other"];
const PET_TYPE_ALL = "all";
const ALLOWED_SIZES = ["small", "medium", "large", "xl"];
const ALLOWED_SLOTS = [
  "9:30 AM – 11:30 AM",
  "11:30 AM – 1:30 PM",
  "1:30 PM – 3:30 PM",
  "3:30 PM – 5:30 PM",
  "5:30 PM – 7:30 PM",
  "7:30 PM – 9:30 PM",
  "9:30 PM – 11:30 PM",
];
const REQUIRED_ADDRESS = [
  "house_number",
  "street_number",
  "street_name",
  "area",
  "city",
  "province",
  "country",
];

// --- Business timezone (Asia/Dubai, constant UTC+4) validation helpers ---
const DUBAI_OFFSET_MIN = 4 * 60;

function dubaiNow(now: Date = new Date()): { date: string; minuteOfDay: number } {
  const shifted = new Date(now.getTime() + DUBAI_OFFSET_MIN * 60 * 1000);
  const y = shifted.getUTCFullYear();
  const m = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const d = String(shifted.getUTCDate()).padStart(2, "0");
  return {
    date: `${y}-${m}-${d}`,
    minuteOfDay: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
  };
}

function slotStartMinutes(slot: string): number | null {
  const match = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(slot ?? "");
  if (!match) return null;
  let hours = Number(match[1]) % 12;
  const minutes = Number(match[2]);
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + minutes;
}

// Normalise an arrival window so any dash variant / spacing is accepted when
// matching against the allowed list (the browser sends an en dash).
function normalizeSlot(slot: string): string {
  return (slot ?? "")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

const ALLOWED_SLOT_KEYS = new Set(ALLOWED_SLOTS.map(normalizeSlot));

interface OfferRow {
  id: string;
  title: string;
  discount_type: string;
  discount_value: number;
  service_ids: string[];
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
}

// Internal placeholder reference. The customer-facing Booking Reference ID
// (PC@YYYY/N) is generated only AFTER the customer confirms their payment,
// so a booking always carries a unique temporary value until then.
function makeTempRef() {
  const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase();
  return `INT-${rand}`;
}

function composeAddress(a: Record<string, string>): string {
  const line1 = [a.house_number, a.street_number, a.street_name].filter(Boolean).join(" ");
  const parts = [line1, a.area, a.city, a.province, a.country, a.postal_code].filter(Boolean);
  const base = parts.join(", ");
  return a.landmark ? `${base} (Landmark: ${a.landmark})` : base;
}

function isLive(offer: OfferRow, now: Date): boolean {
  if (!offer.active) return false;
  if (offer.starts_at && new Date(offer.starts_at) > now) return false;
  if (offer.ends_at && new Date(offer.ends_at) < now) return false;
  return true;
}

function bestDiscount(price: number, serviceId: string, offers: OfferRow[]): number {
  let best = 0;
  offers.forEach((o) => {
    const ids = Array.isArray(o.service_ids) ? o.service_ids : [];
    const applies = ids.length === 0 || ids.includes(serviceId);
    if (!applies) return;
    const value = Number(o.discount_value);
    const amount = o.discount_type === "percent" ? (price * value) / 100 : Math.min(value, price);
    if (amount > best) best = amount;
  });
  return Math.max(0, best);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, serviceKey);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }

  const pet = (body.pet ?? {}) as Record<string, string>;
  const customer = (body.customer ?? {}) as Record<string, string>;
  const address = (body.address ?? {}) as Record<string, string>;
  const location = (body.location ?? {}) as Record<string, unknown>;
  const completeAddress = ((body.completeAddress as string) ?? "").trim();
  const serviceIds = Array.isArray(body.serviceIds) ? (body.serviceIds as string[]) : [];
  const preferredDate = (body.preferredDate as string) ?? "";
  const timeSlot = (body.timeSlot as string) ?? "";
  const notes = (body.notes as string) ?? "";
  const health = (body.health as string) ?? "";

  const lat = location.lat != null && location.lat !== "" ? Number(location.lat) : null;
  const lng = location.lng != null && location.lng !== "" ? Number(location.lng) : null;
  const hasLocation = lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng);

  const missing: string[] = [];
  if (!pet.name) missing.push("pet_name");
  if (!pet.type) missing.push("pet_type");
  if (serviceIds.length === 0) missing.push("services");
  if (!preferredDate) missing.push("preferred_date");
  if (!timeSlot) missing.push("time_slot");
  if (!customer.name) missing.push("customer_name");
  if (!customer.email) missing.push("customer_email");
  if (!customer.phone) missing.push("customer_phone");
  REQUIRED_ADDRESS.forEach((key) => {
    if (!String(address[key] ?? "").trim()) missing.push(`address_${key}`);
  });
  if (missing.length) return json({ ok: false, error: "validation", fields: missing }, 400);

  if (!ALLOWED_PET_TYPES.includes(pet.type)) {
    return json({ ok: false, error: "invalid_pet_type" }, 400);
  }

  if (!ALLOWED_SLOT_KEYS.has(normalizeSlot(timeSlot))) {
    return json({ ok: false, error: "invalid_slot" }, 400);
  }

  const parsedDate = new Date(`${preferredDate}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return json({ ok: false, error: "invalid_date" }, 400);
  }

  // Validate the date AND the arrival window against Dubai local time.
  const nowDubai = dubaiNow();
  if (preferredDate < nowDubai.date) {
    return json({ ok: false, error: "invalid_date" }, 400);
  }
  if (preferredDate === nowDubai.date) {
    const start = slotStartMinutes(timeSlot);
    if (start == null || start <= nowDubai.minuteOfDay) {
      return json({ ok: false, error: "slot_past" }, 400);
    }
  }

  // Look the services up server-side — the client price is never trusted.
  const { data: services, error: lookupErr } = await supabase
    .from("services")
    .select("id, name, price_aed, pet_type")
    .in("id", serviceIds)
    .eq("active", true);

  if (lookupErr) return json({ ok: false, error: "lookup_failed" }, 500);
  if (!services || services.length !== serviceIds.length) {
    return json({ ok: false, error: "invalid_service" }, 400);
  }

  const mismatched = services.some(
    (s) => s.pet_type !== pet.type && s.pet_type !== PET_TYPE_ALL,
  );
  if (mismatched) return json({ ok: false, error: "invalid_service" }, 400);

  const { data: sizeRows } = await supabase
    .from("service_size_prices")
    .select("service_id, size, price_aed")
    .in("service_id", serviceIds);

  const sizeMap: Record<string, Record<string, number>> = {};
  (sizeRows ?? []).forEach((row) => {
    const r = row as { service_id: string; size: string; price_aed: number | string };
    if (!sizeMap[r.service_id]) sizeMap[r.service_id] = {};
    sizeMap[r.service_id][r.size] = Number(r.price_aed);
  });

  const anySizePricing = serviceIds.some((id) => Object.keys(sizeMap[id] ?? {}).length > 0);
  if (anySizePricing && !pet.size) {
    return json({ ok: false, error: "size_required" }, 400);
  }
  if (pet.size && !ALLOWED_SIZES.includes(pet.size)) {
    return json({ ok: false, error: "invalid_size" }, 400);
  }

  const lineServices = services.map((s) => {
    const sized = pet.size ? sizeMap[s.id]?.[pet.size] : undefined;
    const price = sized != null ? sized : Number(s.price_aed);
    return { id: s.id as string, name: s.name as string, price };
  });

  // Apply live offer discounts (server-authoritative).
  const { data: offerRows } = await supabase
    .from("offers")
    .select("id, title, discount_type, discount_value, service_ids, active, starts_at, ends_at")
    .eq("active", true);

  const now = new Date();
  const liveOffers = ((offerRows ?? []) as OfferRow[]).filter((o) => isLive(o, now));

  const subtotal = lineServices.reduce((sum, s) => sum + s.price, 0);
  let discount = 0;
  lineServices.forEach((l) => {
    discount += bestDiscount(l.price, l.id, liveOffers);
  });
  discount = Math.round(discount * 100) / 100;
  const amount = Math.max(0, Math.round((subtotal - discount) * 100) / 100);

  // Release abandoned holds so their slots open back up. Only bookings that
  // are still awaiting a transfer AND have no screenshot submitted are removed
  // — a booking that is under review (or already paid) is never deleted.
  await supabase
    .from("bookings")
    .delete()
    .eq("booking_status", "pending_payment")
    .eq("payment_status", "awaiting_transfer")
    .lt("hold_expires_at", new Date().toISOString());

  const tempRef = makeTempRef();
  const holdExpires = new Date(Date.now() + HOLD_HOURS * 60 * 60 * 1000).toISOString();

  const { data: booking, error: insertErr } = await supabase
    .from("bookings")
    .insert({
      booking_ref: tempRef,
      pet_name: pet.name ?? null,
      pet_type: pet.type ?? null,
      pet_breed: pet.breed ?? null,
      pet_size: pet.size ?? null,
      services: lineServices,
      service_total: subtotal,
      preferred_date: preferredDate,
      time_slot: timeSlot,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      customer_whatsapp: customer.whatsapp || customer.phone || null,
      customer_address: composeAddress(address),
      addr_house_number: address.house_number ?? null,
      addr_street_number: address.street_number ?? null,
      addr_street_name: address.street_name ?? null,
      addr_area: address.area ?? null,
      addr_city: address.city ?? null,
      addr_province: address.province ?? null,
      addr_country: address.country ?? null,
      addr_postal_code: address.postal_code ?? null,
      addr_landmark: address.landmark ?? null,
      complete_address: completeAddress || null,
      customer_lat: hasLocation ? lat : null,
      customer_lng: hasLocation ? lng : null,
      location_shared_at: hasLocation ? new Date().toISOString() : null,
      special_notes: notes || null,
      health_info: health || null,
      amount,
      currency: "AED",
      booking_status: "pending_payment",
      payment_status: "awaiting_transfer",
      payment_provider: "bank_transfer",
      payment_method: "bank_transfer",
      admin_status: "pending",
      hold_expires_at: holdExpires,
    })
    .select()
    .single();

  if (insertErr || !booking) {
    if (insertErr?.code === "23505") return json({ ok: false, error: "slot_taken" }, 409);
    return json({ ok: false, error: "insert_failed", detail: insertErr?.message }, 500);
  }

  // NOTE: no customer-facing booking reference is returned here. It is
  // generated by confirm-payment only once the customer confirms payment.
  return json({
    ok: true,
    method: "bank_transfer",
    bookingId: booking.id,
    services: lineServices,
    subtotal,
    discount,
    amount,
    currency: "AED",
  });
});

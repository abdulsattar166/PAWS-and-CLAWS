// submit-payment-proof
// Receives a customer's bank-transfer screenshot (multipart/form-data), stores
// it in the public "payment-proofs" bucket, and attaches the resulting URL to
// the matching booking record so the admin can review it.
//
// Uploading a screenshot NEVER marks a payment as paid or a booking as
// approved — it only moves the payment to "under_review". Verification and
// approval remain a manual admin decision.
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

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function extFor(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ ok: false, error: "bad_form" }, 400);
  }

  const bookingId = String(form.get("bookingId") ?? "").trim();
  const file = form.get("file");

  if (!bookingId) return json({ ok: false, error: "missing_booking_id" }, 400);
  if (!(file instanceof File)) return json({ ok: false, error: "missing_file" }, 400);

  const type = (file.type || "").toLowerCase();
  if (!ALLOWED_TYPES.includes(type)) {
    return json({ ok: false, error: "invalid_type" }, 400);
  }
  if (file.size > MAX_BYTES) {
    return json({ ok: false, error: "too_large" }, 400);
  }

  // The booking must already exist (created by create-booking).
  const { data: existing, error: findErr } = await supabase
    .from("bookings")
    .select("id, payment_status")
    .eq("id", bookingId)
    .maybeSingle();
  if (findErr || !existing) return json({ ok: false, error: "not_found" }, 404);

  const alreadyPaid = (existing as { payment_status: string | null }).payment_status === "paid";

  const path = `${bookingId}/${Date.now()}.${extFor(type)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadErr } = await supabase.storage
    .from("payment-proofs")
    .upload(path, bytes, { upsert: true, contentType: type });

  if (uploadErr) {
    return json({ ok: false, error: "upload_failed", detail: uploadErr.message }, 500);
  }

  const { data: pub } = supabase.storage.from("payment-proofs").getPublicUrl(path);
  const screenshotUrl = pub.publicUrl;

  const { data: updated, error: updateErr } = await supabase
    .from("bookings")
    .update({
      payment_screenshot_url: screenshotUrl,
      // Only move into review while the payment is still unverified.
      ...(alreadyPaid ? {} : { payment_status: "under_review" }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId)
    .select()
    .maybeSingle();

  if (updateErr || !updated) {
    return json({ ok: false, error: "update_failed", detail: updateErr?.message }, 500);
  }

  return json({ ok: true, screenshotUrl });
});

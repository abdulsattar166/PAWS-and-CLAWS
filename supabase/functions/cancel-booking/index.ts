// cancel-booking
// Releases a reserved slot when a customer abandons checkout, but only while
// the booking is still unpaid (never undoes a confirmed paid booking).
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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }

  const bookingRef = body.bookingRef ?? "";
  if (!bookingRef) return json({ ok: false, error: "missing_ref" }, 400);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data, error } = await supabase
    .from("bookings")
    .update({
      booking_status: "cancelled",
      payment_status: "cancelled",
      hold_expires_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("booking_ref", bookingRef)
    .neq("payment_status", "paid")
    .select("booking_ref")
    .maybeSingle();

  if (error) return json({ ok: false, error: "update_failed" }, 500);
  return json({ ok: true, released: Boolean(data) });
});

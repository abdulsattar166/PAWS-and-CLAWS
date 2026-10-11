// google-reviews
// Returns genuine reviews for the business's official Google Business Profile
// using the official Google Places API (New).
//
// The Places API key is stored as a backend secret (GOOGLE_PLACES_API_KEY) and
// is never exposed to the browser — the frontend only ever talks to this
// function. Callers may pass either a confirmed ?placeId= (preferred) or a
// ?query= (business name) which is resolved through a Text Search first.
//
// When no API key (or no place) is configured the function reports
// configured:false so the website can show a friendly placeholder instead of an
// error. Genuine reviews are returned as-is and are never edited.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const FALLBACK_MAPS =
  "https://www.google.com/maps/search/?api=1&query=Paws+and+Claws+Pets+Grooming+Salon+Abu+Dhabi";

type Json = Record<string, unknown>;
const asRecord = (v: unknown): Json => (v && typeof v === "object" ? (v as Json) : {});
const asString = (v: unknown): string => (typeof v === "string" ? v : "");
const asNumber = (v: unknown): number => (typeof v === "number" && !Number.isNaN(v) ? v : 0);

interface NormalizedReview {
  authorName: string;
  authorPhoto: string;
  authorUrl: string;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
}

// Google's review payload nests the text/author fields — normalise them into a
// stable shape the website can render directly.
function normalizeReview(raw: unknown): NormalizedReview {
  const r = asRecord(raw);
  const textObj = asRecord(r.text);
  const originalObj = asRecord(r.originalText);
  const author = asRecord(r.authorAttribution);
  const text = asString(textObj.text) || asString(r.text) || asString(originalObj.text);
  return {
    authorName: asString(author.displayName) || "Google user",
    authorPhoto: asString(author.photoUri),
    authorUrl: asString(author.uri),
    rating: asNumber(r.rating),
    text,
    relativeTime: asString(r.relativePublishTimeDescription),
    publishTime: asString(r.publishTime),
  };
}

async function resolvePlaceId(apiKey: string, query: string): Promise<string> {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
    },
    body: JSON.stringify({ textQuery: query, maxResultCount: 1 }),
  });
  if (!res.ok) throw new Error(`search_${res.status}`);
  const data = asRecord(await res.json());
  const places = Array.isArray(data.places) ? (data.places as unknown[]) : [];
  const id = asString(asRecord(places[0]).id);
  if (!id) throw new Error("place_not_found");
  return id;
}

async function fetchPlaceDetails(apiKey: string, placeId: string): Promise<Json> {
  const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,googleMapsUri,reviews",
    },
  });
  if (!res.ok) throw new Error(`details_${res.status}`);
  return asRecord(await res.json());
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY") ?? "";

  let placeId = (url.searchParams.get("placeId") ?? "").trim();
  let query = (url.searchParams.get("query") ?? "").trim();

  // Allow the Admin Panel (supabase.functions.invoke) to send options as JSON.
  if (req.method === "POST") {
    try {
      const body = asRecord(await req.json());
      if (!placeId) placeId = asString(body.placeId).trim();
      if (!query) query = asString(body.query).trim();
    } catch {
      /* no JSON body — fall back to query params */
    }
  }

  if (!apiKey) {
    return json({
      ok: true,
      configured: false,
      reviews: [],
      rating: null,
      total: null,
      mapsUri: FALLBACK_MAPS,
      placeName: "",
    });
  }

  if (!placeId && !query) {
    return json({
      ok: true,
      configured: false,
      reviews: [],
      rating: null,
      total: null,
      mapsUri: FALLBACK_MAPS,
      placeName: "",
    });
  }

  try {
    const resolvedId = placeId || (await resolvePlaceId(apiKey, query));
    const place = await fetchPlaceDetails(apiKey, resolvedId);
    const rawReviews = Array.isArray(place.reviews) ? (place.reviews as unknown[]) : [];
    const reviews = rawReviews.map(normalizeReview);
    const displayName = asRecord(place.displayName);

    return json({
      ok: true,
      configured: true,
      placeId: resolvedId,
      placeName: asString(displayName.text),
      rating: typeof place.rating === "number" ? place.rating : null,
      total: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
      mapsUri: asString(place.googleMapsUri) || FALLBACK_MAPS,
      reviews,
      fetchedAt: new Date().toISOString(),
    });
  } catch (e) {
    return json({
      ok: false,
      configured: true,
      error: String(e).slice(0, 200),
      reviews: [],
      mapsUri: FALLBACK_MAPS,
    });
  }
});

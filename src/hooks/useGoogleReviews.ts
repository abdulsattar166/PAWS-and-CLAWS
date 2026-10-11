import { useCallback, useEffect, useState } from "react";

export interface GoogleReview {
  authorName: string;
  authorPhoto: string;
  authorUrl: string;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
}

export type GoogleReviewsStatus =
  | "loading"
  | "ready"
  | "empty"
  | "error"
  | "unconfigured"
  | "disabled";

interface GoogleReviewsState {
  status: GoogleReviewsStatus;
  reviews: GoogleReview[];
  rating: number | null;
  total: number | null;
  mapsUri: string;
  placeName: string;
}

export interface GoogleReviewsOptions {
  /** Confirmed Google Place ID (preferred). */
  placeId?: string;
  /** Fallback business-name query resolved by the backend. */
  query?: string;
  /** When false, no request is made and the section is treated as disabled. */
  enabled?: boolean;
}

const FALLBACK_MAPS_URI =
  "https://www.google.com/maps/search/?api=1&query=Paws+and+Claws+Pets+Grooming+Salon+Abu+Dhabi";

const EMPTY_STATE: GoogleReviewsState = {
  status: "loading",
  reviews: [],
  rating: null,
  total: null,
  mapsUri: FALLBACK_MAPS_URI,
  placeName: "",
};

/**
 * Loads genuine Google reviews from the secure `google-reviews` backend
 * function. Falls back gracefully (never throws into the page) so the site
 * keeps working even if the Google API is temporarily unavailable. Only the
 * backend ever sees the Places API key.
 */
export function useGoogleReviews(options: GoogleReviewsOptions = {}) {
  const placeId = options.placeId ?? "";
  const query = options.query ?? "";
  const enabled = options.enabled !== false;
  const [state, setState] = useState<GoogleReviewsState>(EMPTY_STATE);

  const load = useCallback(async () => {
    if (!enabled) {
      setState({ ...EMPTY_STATE, status: "disabled" });
      return;
    }

    const baseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

    // Backend not connected yet — show a friendly placeholder instead of erroring.
    if (!baseUrl || !anonKey) {
      setState({ ...EMPTY_STATE, status: "unconfigured" });
      return;
    }

    setState((prev) => ({ ...prev, status: "loading" }));

    try {
      const params = new URLSearchParams();
      if (placeId) params.set("placeId", placeId);
      else if (query) params.set("query", query);
      const qs = params.toString();

      const res = await fetch(`${baseUrl}/functions/v1/google-reviews${qs ? `?${qs}` : ""}`, {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      });
      const data = await res.json();

      const mapsUri = data?.mapsUri || FALLBACK_MAPS_URI;
      const rating = typeof data?.rating === "number" ? data.rating : null;
      const total = typeof data?.total === "number" ? data.total : null;
      const placeName = data?.placeName || "";
      const reviews: GoogleReview[] = Array.isArray(data?.reviews) ? data.reviews : [];

      if (data?.configured === false) {
        setState({ status: "unconfigured", reviews: [], rating, total, mapsUri, placeName });
        return;
      }

      if (!res.ok || data?.ok === false) {
        setState({ status: "error", reviews: [], rating, total, mapsUri, placeName });
        return;
      }

      if (reviews.length === 0) {
        setState({ status: "empty", reviews: [], rating, total, mapsUri, placeName });
        return;
      }

      setState({ status: "ready", reviews, rating, total, mapsUri, placeName });
    } catch {
      setState({ ...EMPTY_STATE, status: "error" });
    }
  }, [enabled, placeId, query]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
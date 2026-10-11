import { useState } from "react";
import {
  hasLocation,
  mapsEmbedSrc,
  mapsLink,
  type LocationInfo,
} from "@/lib/bookingOptions";

interface LiveLocationInputProps {
  value: LocationInfo;
  onChange: (next: LocationInfo) => void;
  t: (key: string) => string;
}

/**
 * Option A of the Service Location section: share the device's current live
 * location (with explicit permission only). The coordinates are attached to the
 * booking once; there is no continuous tracking of the device. If location
 * access is denied or unavailable, the customer simply fills the structured
 * Home Service Address below instead.
 */
export default function LiveLocationInput({ value, onChange, t }: LiveLocationInputProps) {
  const [state, setState] = useState<"idle" | "locating" | "error">("idle");
  const [message, setMessage] = useState("");
  const shared = hasLocation(value);

  const requestLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState("error");
      setMessage(t("booking.location_unsupported"));
      return;
    }
    setState("locating");
    setMessage("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          sharedAt: new Date().toISOString(),
        });
        setState("idle");
        setMessage(t("booking.location_shared"));
      },
      () => {
        setState("error");
        setMessage(t("booking.location_error"));
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  };

  const clearLocation = () => {
    onChange({ lat: null, lng: null, sharedAt: null });
    setState("idle");
    setMessage("");
  };

  return (
    <div className="rounded-xl bg-background-50 border border-background-200/70 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground-950">
        <i className="ri-map-pin-2-line text-accent-500" aria-hidden="true"></i>
        {t("booking.live_loc_title")}
      </p>
      <p className="mt-1 text-xs text-foreground-600 leading-relaxed">{t("booking.live_loc_hint")}</p>

      {!shared ? (
        <button
          type="button"
          onClick={requestLocation}
          disabled={state === "locating"}
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-foreground-50 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
        >
          <i className={state === "locating" ? "ri-loader-4-line animate-spin" : "ri-focus-3-line"} aria-hidden="true"></i>
          {state === "locating" ? t("booking.location_getting") : t("booking.share_location")}
        </button>
      ) : (
        <div className="mt-3 space-y-3">
          <div className="overflow-hidden rounded-xl border border-background-200/70 bg-background-100">
            <iframe
              title={t("booking.live_loc_title")}
              src={mapsEmbedSrc(value.lat as number, value.lng as number)}
              width="100%"
              height="220"
              style={{ border: 0 }}
            ></iframe>
          </div>
          <p className="flex flex-wrap items-center gap-2 text-xs text-foreground-600">
            <i className="ri-map-pin-2-fill text-accent-500" aria-hidden="true"></i>
            {value.lat?.toFixed(5)}, {value.lng?.toFixed(5)}
            <a
              href={mapsLink(value.lat as number, value.lng as number)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700 underline underline-offset-4 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-external-link-line" aria-hidden="true"></i>
              {t("booking.location_open_map")}
            </a>
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={requestLocation}
              disabled={state === "locating"}
              className="inline-flex items-center gap-2 rounded-full border border-background-200/70 bg-background-100 px-4 py-2 text-xs font-semibold text-foreground-800 hover:border-primary-300 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
            >
              <i className="ri-refresh-line" aria-hidden="true"></i>
              {t("booking.location_update")}
            </button>
            <button
              type="button"
              onClick={clearLocation}
              className="inline-flex items-center gap-2 rounded-full border border-background-200/70 bg-background-100 px-4 py-2 text-xs font-semibold text-foreground-800 hover:border-primary-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-close-line" aria-hidden="true"></i>
              {t("booking.location_clear")}
            </button>
          </div>
        </div>
      )}

      {message && (
        <p className={`mt-3 text-xs leading-relaxed ${state === "error" ? "text-red-600" : "text-accent-700"}`}>
          {message}
        </p>
      )}

      <p className="mt-3 flex items-start gap-2 text-[11px] text-foreground-500 leading-relaxed">
        <i className="ri-lock-line mt-0.5" aria-hidden="true"></i>
        {t("booking.location_privacy")}
      </p>
    </div>
  );
}
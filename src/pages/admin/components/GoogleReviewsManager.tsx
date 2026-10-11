import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSiteSettings, type GoogleReviewsSettings } from "@/hooks/useSiteSettings";
import {
  Card,
  EmptyState,
  Field,
  StatusPill,
  Modal,
  inputCls,
  btnPrimary,
  btnGhost,
  btnDanger,
} from "./AdminUi";

function formatStamp(value: string | null): string {
  if (!value) return "Never";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_TONE: Record<string, "ok" | "bad" | "warn" | "neut"> = {
  ok: "ok",
  error: "bad",
  unconfigured: "warn",
  never: "neut",
};

const STATUS_LABEL: Record<string, string> = {
  ok: "Connected",
  error: "Sync error",
  unconfigured: "Not configured",
  never: "Never synced",
};

const DEFAULT_QUERY = "Paws and Claws Pets Grooming Salon Abu Dhabi UAE";

/**
 * Google Reviews Management — connects the official Google Business Profile and
 * controls how genuine Google reviews appear on the website. Google reviews are
 * read-only (they can never be edited or fabricated); the temporary demo
 * entries used to preview the layout are managed and removed here. Website
 * testimonials are managed separately under "Reviews Management".
 */
export default function GoogleReviewsManager() {
  const { settings, reload } = useSiteSettings();
  const [draft, setDraft] = useState<GoogleReviewsSettings | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [touched, setTouched] = useState(false);

  // Keep the draft in step with the loaded settings until the admin edits it,
  // so a late-arriving settings load is never missed.
  useEffect(() => {
    if (!touched) setDraft({ ...settings.googleReviews });
  }, [settings, touched]);

  const persist = async (next: GoogleReviewsSettings) => {
    if (!supabase) return;
    await supabase
      .from("site_settings")
      .upsert({ key: "google_reviews", value: next, updated_at: new Date().toISOString() }, { onConflict: "key" });
  };

  const patch = (partial: Partial<GoogleReviewsSettings>) => {
    setTouched(true);
    setDraft((d) => (d ? { ...d, ...partial } : d));
  };

  const save = async () => {
    if (!supabase || !draft) return;
    setStatus("saving");
    setError("");
    const { error: err } = await supabase
      .from("site_settings")
      .upsert({ key: "google_reviews", value: draft, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (err) {
      setStatus("error");
      setError(err.message);
      return;
    }
    setStatus("saved");
    setTouched(false);
    await reload();
    setTimeout(() => setStatus("idle"), 2500);
  };

  const refresh = async () => {
    if (!supabase || !draft) return;
    setSyncing(true);
    setSyncMsg("");
    try {
      const { data, error: err } = await supabase.functions.invoke("google-reviews", {
        body: { placeId: draft.placeId, query: draft.placeId ? "" : DEFAULT_QUERY },
      });
      if (err) throw err;
      const configured = data?.configured !== false;
      const ok = data?.ok === true && configured;
      const count = Array.isArray(data?.reviews) ? data.reviews.length : 0;
      const next: GoogleReviewsSettings = {
        ...draft,
        placeId: (data?.placeId as string) || draft.placeId,
        lastSync: (data?.fetchedAt as string) ?? new Date().toISOString(),
        lastStatus: !configured ? "unconfigured" : ok ? "ok" : "error",
      };
      setDraft(next);
      await persist(next);
      setTouched(false);
      await reload();
      setSyncMsg(
        !configured
          ? "No Google API key is connected yet. Add GOOGLE_PLACES_API_KEY under Supabase Dashboard → Edge Functions → Secrets, then press Refresh again."
          : ok
            ? `Synced successfully — ${count} genuine review(s) returned by Google.`
            : "Google could not be reached, or the Place ID was not found. Please check the Place ID and try again.",
      );
    } catch (e) {
      setSyncMsg(e instanceof Error ? e.message : "Could not reach the Google integration.");
    } finally {
      setSyncing(false);
    }
  };

  const removeAllDemo = async () => {
    if (!draft) return;
    const next: GoogleReviewsSettings = { ...draft, demoReviews: [], showDemo: false };
    setDraft(next);
    setConfirmRemove(false);
    await persist(next);
    setTouched(false);
    await reload();
  };

  const deleteDemoReview = async (index: number) => {
    if (!draft) return;
    const next: GoogleReviewsSettings = {
      ...draft,
      demoReviews: draft.demoReviews.filter((_, i) => i !== index),
    };
    setDraft(next);
    await persist(next);
    setTouched(false);
    await reload();
  };

  if (!draft) return null;

  const demoCount = draft.demoReviews.length;

  return (
    <div className="space-y-6">
      {/* Connection + display configuration */}
      <Card className="p-5 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 justify-between">
          <div className="flex items-start gap-3">
            <span className="w-11 h-11 rounded-xl bg-accent-100 text-accent-700 flex items-center justify-center shrink-0">
              <i className="ri-google-fill text-xl" aria-hidden="true"></i>
            </span>
            <div>
              <h3 className="font-heading text-base text-foreground-950">Official Google Business Profile</h3>
              <p className="text-sm text-foreground-600 max-w-2xl">
                Connect the company&apos;s official profile so genuine customer reviews appear on the website. Reviews are
                always shown exactly as Google provides them — they can never be edited or invented here.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => patch({ enabled: !draft.enabled })}
            aria-pressed={draft.enabled}
            className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-semibold cursor-pointer transition-colors ${
              draft.enabled
                ? "bg-accent-100 border-accent-200 text-accent-900"
                : "bg-background-100 border-background-200 text-foreground-600"
            }`}
          >
            <i className={draft.enabled ? "ri-eye-line" : "ri-eye-off-line"} aria-hidden="true"></i>
            {draft.enabled ? "Section visible" : "Section hidden"}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Field
            label="Google Place ID"
            hint="The confirmed Place ID of the official profile. If left blank, the business name below is used to look it up."
          >
            <input
              value={draft.placeId}
              onChange={(e) => patch({ placeId: e.target.value })}
              className={inputCls}
              placeholder="e.g. ChIJ… (from the Google Business Profile)"
            />
          </Field>

          <Field label="Review Us on Google — button link" hint="Opens the official Google profile / review-submission page for customers.">
            <input
              value={draft.profileUrl}
              onChange={(e) => patch({ profileUrl: e.target.value })}
              className={inputCls}
              placeholder="https://share.google/…"
            />
          </Field>

          <Field label="View all reviews — link" hint="Where “view all reviews” points (usually the Google Maps listing).">
            <input
              value={draft.mapsUrl}
              onChange={(e) => patch({ mapsUrl: e.target.value })}
              className={inputCls}
              placeholder="https://www.google.com/maps/…"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Display layout">
              <select
                value={draft.layout}
                onChange={(e) => patch({ layout: e.target.value as GoogleReviewsSettings["layout"] })}
                className={inputCls}
              >
                <option value="carousel">Feature carousel</option>
                <option value="grid">Card grid</option>
              </select>
            </Field>
            <Field label="Reviews shown" hint="Google returns up to 5 per profile.">
              <input
                type="number"
                min={1}
                max={12}
                value={draft.maxCount}
                onChange={(e) => patch({ maxCount: Math.max(1, Math.min(12, Number(e.target.value) || 1)) })}
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={save} disabled={status === "saving"} className={btnPrimary}>
            {status === "saving" ? (
              "Saving…"
            ) : (
              <>
                <i className="ri-save-line" aria-hidden="true"></i> Save settings
              </>
            )}
          </button>
          <a href={draft.profileUrl} target="_blank" rel="noopener noreferrer" className={btnGhost}>
            <i className="ri-external-link-line" aria-hidden="true"></i> Preview Google profile
          </a>
          {status === "saved" && (
            <span className="text-sm font-semibold text-accent-700 flex items-center gap-1.5">
              <i className="ri-check-line" aria-hidden="true"></i> Saved
            </span>
          )}
          {error && <span className="text-sm font-semibold text-red-600">{error}</span>}
        </div>
      </Card>

      {/* Sync status */}
      <Card className="p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
              <i className="ri-refresh-line text-xl" aria-hidden="true"></i>
            </span>
            <div>
              <h3 className="font-heading text-base text-foreground-950">Synchronisation</h3>
              <p className="text-sm text-foreground-600">
                Last successful update: <strong>{formatStamp(draft.lastSync)}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill
              label={STATUS_LABEL[draft.lastStatus] ?? draft.lastStatus}
              tone={STATUS_TONE[draft.lastStatus] ?? "neut"}
            />
            <button type="button" onClick={refresh} disabled={syncing} className={btnPrimary}>
              {syncing ? (
                "Refreshing…"
              ) : (
                <>
                  <i className="ri-loop-right-line" aria-hidden="true"></i> Refresh now
                </>
              )}
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-foreground-500 leading-relaxed">
          Google reviews refresh automatically at a sensible interval subject to Google&apos;s API quota. New eligible
          reviews appear after the next successful sync — updates are not instant.
        </p>
        {syncMsg && (
          <p className="mt-3 text-sm text-foreground-700 flex items-start gap-2 rounded-lg bg-background-100 border border-background-200 px-3.5 py-2.5">
            <i className="ri-information-line text-primary-700 mt-0.5" aria-hidden="true"></i>
            <span>{syncMsg}</span>
          </p>
        )}
      </Card>

      {/* Demo reviews */}
      <Card className="p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <h3 className="font-heading text-base text-foreground-950 flex items-center gap-2">
              Demo reviews
              <StatusPill label={`${demoCount} entries`} tone="warn" />
            </h3>
            <p className="text-sm text-foreground-600 max-w-2xl">
              Sample entries shown only to preview the review-section layout. They are clearly labelled as demo content
              on the site and are ignored automatically once genuine Google reviews are available. Remove them here as
              soon as the live integration is working.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => patch({ showDemo: !draft.showDemo })}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-semibold cursor-pointer transition-colors ${
                draft.showDemo
                  ? "bg-secondary-100 border-secondary-200 text-secondary-900"
                  : "bg-background-100 border-background-200 text-foreground-600"
              }`}
            >
              <i className={draft.showDemo ? "ri-eye-line" : "ri-eye-off-line"} aria-hidden="true"></i>
              {draft.showDemo ? "Shown as fallback" : "Hidden"}
            </button>
            {demoCount > 0 && (
              <button type="button" onClick={() => setConfirmRemove(true)} className={btnDanger}>
                <i className="ri-delete-bin-6-line" aria-hidden="true"></i> Remove all
              </button>
            )}
          </div>
        </div>

        {demoCount === 0 ? (
          <EmptyState
            icon="ri-checkbox-circle-line"
            title="No demo reviews"
            text="All temporary sample entries have been removed. Genuine Google reviews will display here."
          />
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {draft.demoReviews.map((d, i) => (
              <div key={i} className="admin-rise rounded-2xl bg-background-50 border border-background-200/80 p-4 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-secondary-900 bg-secondary-100 px-2 py-1 rounded-full">
                    <i className="ri-flask-line" aria-hidden="true"></i> Demo
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-accent-500 text-xs">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <i key={s} className={s < d.rating ? "ri-star-fill" : "ri-star-line opacity-40"} aria-hidden="true"></i>
                    ))}
                  </span>
                </div>
                <p className="mt-3 text-sm text-foreground-700 line-clamp-3 flex-1">{d.text}</p>
                <div className="mt-3 flex items-center justify-between gap-2 pt-3">
                  <span className="text-xs text-foreground-500 truncate">
                    {d.authorName} · {d.relativeTime}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteDemoReview(i)}
                    aria-label="Delete demo review"
                    className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-700 cursor-pointer flex items-center justify-center shrink-0"
                  >
                    <i className="ri-delete-bin-line text-xs" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Distinguish from testimonials */}
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <span className="w-11 h-11 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
            <i className="ri-chat-quote-line text-xl" aria-hidden="true"></i>
          </span>
          <p className="text-sm text-foreground-600">
            <strong className="text-foreground-950">Website testimonials are managed separately.</strong> Reviews
            collected directly by your business live under <em>Reviews Management</em> and are always shown as their own
            labelled section — never mixed with Google reviews.
          </p>
        </div>
      </Card>

      <Modal
        open={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        title="Remove all demo reviews"
        footer={
          <>
            <button type="button" onClick={() => setConfirmRemove(false)} className={btnGhost}>
              Cancel
            </button>
            <button type="button" onClick={removeAllDemo} className={btnDanger}>
              <i className="ri-delete-bin-6-line" aria-hidden="true"></i> Remove all demo reviews
            </button>
          </>
        }
      >
        <p className="text-sm text-foreground-700">
          This permanently removes all {demoCount} temporary demo reviews and turns off the demo fallback. The website
          will then show genuine Google reviews only.
        </p>
      </Modal>
    </div>
  );
}
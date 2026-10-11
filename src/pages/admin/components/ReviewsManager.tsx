import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ReviewRow } from "@/lib/adminTypes";
import {
  Card,
  EmptyState,
  ErrorState,
  Spinner,
  StatusPill,
  Modal,
  Field,
  inputCls,
  btnPrimary,
  btnGhost,
  btnDanger,
  btnAccent,
} from "./AdminUi";
import ImageUploader from "./ImageUploader";

const GOOGLE_REVIEW_URL =
  "https://www.google.com/maps/search/?api=1&query=Paws+and+Claws+Pets+Grooming+Salon+Abu+Dhabi";

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-accent-500 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={i < value ? "ri-star-fill" : "ri-star-line opacity-40"} aria-hidden="true"></i>
      ))}
    </span>
  );
}

const EMPTY: Partial<ReviewRow> = {
  customer_name: "",
  review_text: "",
  rating: 5,
  review_date: new Date().toISOString().slice(0, 10),
  image_url: "",
  featured: false,
  published: true,
};

/**
 * Reviews Management — manages the business's own website testimonials. These
 * are kept clearly separate from Google-sourced reviews, which are shown on the
 * site through a read-only official integration. There is a link for customers
 * to leave their own review on Google.
 */
export default function ReviewsManager() {
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Partial<ReviewRow> | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<ReviewRow | null>(null);

  const load = useCallback(async () => {
    if (!supabase) {
      setStatus("error");
      setError("Backend not configured.");
      return;
    }
    setStatus("loading");
    try {
      const { data, error: err } = await supabase.from("reviews").select("*").order("sort_order", { ascending: true });
      if (err) throw err;
      setRows((data ?? []) as ReviewRow[]);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not load reviews.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!supabase || !draft) return;
    if (!draft.customer_name?.trim() || !draft.review_text?.trim()) {
      setError("Please add a customer name and the review text.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        customer_name: draft.customer_name.trim(),
        review_text: draft.review_text.trim(),
        rating: Math.min(5, Math.max(1, Number(draft.rating) || 5)),
        review_date: draft.review_date || null,
        image_url: draft.image_url || null,
        featured: Boolean(draft.featured),
        published: draft.published !== false,
      };
      if (draft.id) {
        const { error: err } = await supabase.from("reviews").update(payload).eq("id", draft.id);
        if (err) throw err;
      } else {
        const nextOrder = (rows.reduce((max, r) => Math.max(max, r.sort_order), 0) || 0) + 10;
        const { error: err } = await supabase.from("reviews").insert({ ...payload, sort_order: nextOrder });
        if (err) throw err;
      }
      setDraft(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the review.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (r: ReviewRow, field: "published" | "featured") => {
    if (!supabase) return;
    setBusyId(r.id);
    const value = !r[field];
    const { error: err } = await supabase.from("reviews").update({ [field]: value }).eq("id", r.id);
    setBusyId("");
    if (!err) setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, [field]: value } : x)));
  };

  const doDelete = async () => {
    if (!supabase || !confirmDelete) return;
    const { error: err } = await supabase.from("reviews").delete().eq("id", confirmDelete.id);
    if (!err) {
      setRows((prev) => prev.filter((x) => x.id !== confirmDelete.id));
      setConfirmDelete(null);
    } else {
      setError(err.message);
    }
  };

  const publishedCount = rows.filter((r) => r.published).length;
  const avg = rows.length ? (rows.reduce((s, r) => s + Number(r.rating || 0), 0) / rows.length).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      {/* Google reviews panel — clearly separated from website testimonials */}
      <Card className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          <div className="flex items-start gap-3">
            <span className="w-11 h-11 rounded-xl bg-accent-100 text-accent-700 flex items-center justify-center shrink-0">
              <i className="ri-google-fill text-xl" aria-hidden="true"></i>
            </span>
            <div>
              <h3 className="font-heading text-base text-foreground-950">Google reviews (read-only)</h3>
              <p className="text-sm text-foreground-600 max-w-xl">
                Live Google reviews are shown on your website through the official Google integration. To keep things honest,
                they cannot be edited here — and the website testimonials below are always labelled separately from Google.
              </p>
            </div>
          </div>
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className={`${btnAccent} shrink-0`}>
            <i className="ri-google-fill" aria-hidden="true"></i> Leave a review on Google
          </a>
        </div>
      </Card>

      {/* Website testimonials header */}
      <Card className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div>
            <h3 className="font-heading text-base text-foreground-950">Website testimonials</h3>
            <p className="text-sm text-foreground-600">
              {rows.length} total · {publishedCount} published · average {avg} ★
            </p>
          </div>
          <button type="button" onClick={() => setDraft({ ...EMPTY })} className={btnPrimary}>
            <i className="ri-add-line" aria-hidden="true"></i> Add testimonial
          </button>
        </div>
        {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
      </Card>

      {status === "loading" && (
        <Card>
          <Spinner label="Loading testimonials…" />
        </Card>
      )}
      {status === "error" && (
        <Card>
          <ErrorState text={error} onRetry={load} />
        </Card>
      )}
      {status === "ready" && rows.length === 0 && (
        <Card>
          <EmptyState icon="ri-chat-quote-line" title="No testimonials yet" text="Add your first customer testimonial." />
        </Card>
      )}
      {status === "ready" && rows.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {rows.map((r) => (
            <div key={r.id} className="admin-rise rounded-2xl bg-background-50 border border-background-200/80 p-4 flex flex-col">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full overflow-hidden bg-accent-100 text-accent-700 flex items-center justify-center shrink-0 font-heading text-lg">
                  {r.image_url ? (
                    <img src={r.image_url} alt={r.customer_name} className="w-full h-full object-cover" />
                  ) : (
                    r.customer_name.charAt(0).toUpperCase()
                  )}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground-950 truncate">{r.customer_name}</p>
                  <Stars value={Number(r.rating) || 0} className="text-xs" />
                </div>
                <div className="ml-auto flex flex-col items-end gap-1">
                  {r.featured && <StatusPill label="Featured" tone="ok" icon="ri-star-fill" />}
                  {r.published ? <StatusPill label="Published" tone="info" /> : <StatusPill label="Hidden" tone="bad" />}
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground-700 line-clamp-4">{r.review_text}</p>
              <div className="mt-3 flex items-center gap-1.5 mt-auto pt-3">
                <button type="button" onClick={() => toggle(r, "featured")} disabled={busyId === r.id} title="Toggle featured" className="w-8 h-8 rounded-lg bg-background-100 border border-background-200 text-foreground-700 cursor-pointer flex items-center justify-center">
                  <i className={r.featured ? "ri-star-fill text-accent-500 text-xs" : "ri-star-line text-xs"} aria-hidden="true"></i>
                </button>
                <button type="button" onClick={() => toggle(r, "published")} disabled={busyId === r.id} title="Publish / hide" className="w-8 h-8 rounded-lg bg-background-100 border border-background-200 text-foreground-700 cursor-pointer flex items-center justify-center">
                  <i className={r.published ? "ri-eye-line text-xs" : "ri-eye-off-line text-xs"} aria-hidden="true"></i>
                </button>
                <button type="button" onClick={() => setDraft(r)} className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background-100 border border-background-200 text-foreground-900 text-xs font-semibold cursor-pointer">
                  <i className="ri-edit-line" aria-hidden="true"></i> Edit
                </button>
                <button type="button" onClick={() => setConfirmDelete(r)} className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-700 cursor-pointer flex items-center justify-center">
                  <i className="ri-delete-bin-line text-xs" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      <Modal
        open={Boolean(draft)}
        onClose={() => setDraft(null)}
        title={draft?.id ? "Edit testimonial" : "Add testimonial"}
        wide
        footer={
          <>
            <button type="button" onClick={() => setDraft(null)} className={btnGhost}>Cancel</button>
            <button type="button" onClick={save} disabled={saving} className={btnPrimary}>
              {saving ? "Saving…" : <><i className="ri-save-line" aria-hidden="true"></i> Save testimonial</>}
            </button>
          </>
        }
      >
        {draft && (
          <div className="space-y-4">
            <Field label="Customer name">
              <input value={draft.customer_name ?? ""} onChange={(e) => setDraft({ ...draft, customer_name: e.target.value })} className={inputCls} placeholder="e.g. Sarah M." />
            </Field>

            <Field label="Star rating">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} type="button" onClick={() => setDraft({ ...draft, rating: i + 1 })} aria-label={`${i + 1} stars`} className="cursor-pointer text-2xl">
                    <i className={i < Number(draft.rating ?? 5) ? "ri-star-fill text-accent-500" : "ri-star-line text-foreground-300"} aria-hidden="true"></i>
                  </button>
                ))}
                <span className="ml-2 text-sm text-foreground-600">{Number(draft.rating ?? 5)} / 5</span>
              </div>
            </Field>

            <Field label="Review text">
              <textarea value={draft.review_text ?? ""} onChange={(e) => setDraft({ ...draft, review_text: e.target.value })} rows={4} maxLength={600} className={`${inputCls} resize-none`}></textarea>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Review date">
                <input type="date" value={draft.review_date ?? ""} onChange={(e) => setDraft({ ...draft, review_date: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Customer photo (optional)">
                <ImageUploader
                  value={draft.image_url ?? ""}
                  onChange={(url) => setDraft({ ...draft, image_url: url })}
                  label=""
                  folder="reviews"
                  height="h-24"
                />
              </Field>
            </div>

            <div className="flex flex-wrap gap-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={Boolean(draft.featured)} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} className="w-4 h-4 accent-[oklch(var(--primary-500))]" />
                <span className="text-sm text-foreground-800">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={draft.published !== false} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} className="w-4 h-4 accent-[oklch(var(--primary-500))]" />
                <span className="text-sm text-foreground-800">Published on site</span>
              </label>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete testimonial"
        footer={
          <>
            <button type="button" onClick={() => setConfirmDelete(null)} className={btnGhost}>Cancel</button>
            <button type="button" onClick={doDelete} className={btnDanger}>
              <i className="ri-delete-bin-line" aria-hidden="true"></i> Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-foreground-700">
          Delete the testimonial from <strong>{confirmDelete?.customer_name}</strong>?
        </p>
      </Modal>
    </div>
  );
}
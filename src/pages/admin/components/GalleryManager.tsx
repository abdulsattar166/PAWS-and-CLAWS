import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { GalleryCategoryRow, GalleryImageRow } from "@/lib/adminTypes";
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
} from "./AdminUi";
import ImageUploader from "./ImageUploader";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 30) || "category";
}

function move<T>(arr: T[], from: number, dir: -1 | 1): T[] {
  const to = from + dir;
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

const EMPTY_DRAFT: Partial<GalleryImageRow> = {
  title: "",
  caption: "",
  alt: "",
  category_id: null,
  image_url: "",
  featured: false,
  active: true,
};

/**
 * Gallery Management — a real image library. Upload photos (drag & drop, no
 * URLs), assign categories, reorder, and manage captions + alt text. Everything
 * written here appears on the live Gallery page automatically.
 */
export default function GalleryManager() {
  const [tab, setTab] = useState<"images" | "categories">("images");
  const [images, setImages] = useState<GalleryImageRow[]>([]);
  const [categories, setCategories] = useState<GalleryCategoryRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState<Partial<GalleryImageRow> | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<GalleryImageRow | null>(null);

  const load = useCallback(async () => {
    if (!supabase) {
      setStatus("error");
      setError("Backend not configured.");
      return;
    }
    setStatus("loading");
    try {
      const [catRes, imgRes] = await Promise.all([
        supabase.from("gallery_categories").select("*").order("sort_order", { ascending: true }),
        supabase.from("gallery_images").select("*").order("sort_order", { ascending: true }),
      ]);
      if (catRes.error) throw catRes.error;
      if (imgRes.error) throw imgRes.error;
      setCategories((catRes.data ?? []) as GalleryCategoryRow[]);
      setImages((imgRes.data ?? []) as GalleryImageRow[]);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not load the gallery.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const catLabel = (id: string | null) => categories.find((c) => c.id === id)?.label ?? "Uncategorised";

  const filtered = useMemo(
    () => (filter === "all" ? images : images.filter((i) => i.category_id === filter)),
    [images, filter],
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: images.length };
    categories.forEach((c) => {
      map[c.id] = images.filter((i) => i.category_id === c.id).length;
    });
    return map;
  }, [images, categories]);

  const saveImage = async () => {
    if (!supabase || !draft) return;
    if (!draft.image_url) {
      setError("Please upload an image first.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (draft.id) {
        const { error: err } = await supabase
          .from("gallery_images")
          .update({
            title: draft.title?.trim() || "Untitled",
            caption: draft.caption || null,
            alt: draft.alt || null,
            category_id: draft.category_id || null,
            image_url: draft.image_url,
            featured: Boolean(draft.featured),
            active: draft.active !== false,
          })
          .eq("id", draft.id);
        if (err) throw err;
      } else {
        const nextOrder = (images.reduce((max, i) => Math.max(max, i.sort_order), 0) || 0) + 10;
        const { error: err } = await supabase.from("gallery_images").insert({
          title: draft.title?.trim() || "Untitled",
          caption: draft.caption || null,
          alt: draft.alt || null,
          category_id: draft.category_id || null,
          image_url: draft.image_url,
          featured: Boolean(draft.featured),
          active: draft.active !== false,
          sort_order: nextOrder,
        });
        if (err) throw err;
      }
      setDraft(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the image.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (img: GalleryImageRow, field: "active" | "featured") => {
    if (!supabase) return;
    setBusyId(img.id);
    const value = !img[field];
    const { error: err } = await supabase.from("gallery_images").update({ [field]: value }).eq("id", img.id);
    setBusyId("");
    if (!err) setImages((prev) => prev.map((x) => (x.id === img.id ? { ...x, [field]: value } : x)));
  };

  const reorder = async (index: number, dir: -1 | 1) => {
    if (!supabase) return;
    const to = index + dir;
    if (to < 0 || to >= images.length) return;
    const next = move(images, index, dir).map((img, i) => ({ ...img, sort_order: (i + 1) * 10 }));
    setImages(next);
    setBusyId("__reorder__");
    try {
      await Promise.all(next.map((i) => supabase.from("gallery_images").update({ sort_order: i.sort_order }).eq("id", i.id)));
    } finally {
      setBusyId("");
    }
  };

  const doDelete = async () => {
    if (!supabase || !confirmDelete) return;
    const { error: err } = await supabase.from("gallery_images").delete().eq("id", confirmDelete.id);
    if (!err) {
      setImages((prev) => prev.filter((x) => x.id !== confirmDelete.id));
      setConfirmDelete(null);
    } else {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 rounded-full bg-background-100 border border-background-200/70 p-1 w-fit">
          {([["images", "Images", "ri-image-2-line"], ["categories", "Categories", "ri-price-tag-3-line"]] as const).map(([key, label, icon]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${tab === key ? "bg-primary-500 text-foreground-50" : "text-foreground-700 hover:bg-background-50"}`}
            >
              <i className={icon} aria-hidden="true"></i> {label}
            </button>
          ))}
        </div>
        {tab === "images" && (
          <button type="button" onClick={() => setDraft({ ...EMPTY_DRAFT })} className={btnPrimary}>
            <i className="ri-add-line" aria-hidden="true"></i> Add image
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm font-semibold text-red-600 flex items-center gap-1.5">
          <i className="ri-error-warning-line" aria-hidden="true"></i> {error}
        </p>
      )}

      {tab === "images" ? (
        <>
          <Card className="p-4">
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap cursor-pointer ${filter === "all" ? "bg-primary-500 text-foreground-50 border-primary-500" : "bg-background-50 text-foreground-700 border-background-200 hover:border-primary-300"}`}
              >
                All ({counts.all ?? 0})
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFilter(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap cursor-pointer ${filter === c.id ? "bg-primary-500 text-foreground-50 border-primary-500" : "bg-background-50 text-foreground-700 border-background-200 hover:border-primary-300"}`}
                >
                  {c.label} ({counts[c.id] ?? 0})
                </button>
              ))}
            </div>
            {filter === "all" && images.length > 1 && (
              <p className="mt-3 text-[11px] text-foreground-500">Use the arrows to reorder — the live gallery follows this order.</p>
            )}
          </Card>

          {status === "loading" && (
            <Card>
              <Spinner label="Loading gallery…" />
            </Card>
          )}
          {status === "error" && (
            <Card>
              <ErrorState text={error} onRetry={load} />
            </Card>
          )}
          {status === "ready" && filtered.length === 0 && (
            <Card>
              <EmptyState icon="ri-image-add-line" title="No images yet" text="Upload your first gallery image to get started." />
            </Card>
          )}
          {status === "ready" && filtered.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {filtered.map((img) => {
                const fullIndex = images.findIndex((x) => x.id === img.id);
                return (
                  <div key={img.id} className="admin-rise rounded-2xl bg-background-50 border border-background-200/80 overflow-hidden flex flex-col">
                    <div className="relative w-full aspect-[4/3] bg-background-100">
                      <img src={img.image_url} alt={img.alt || img.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        {img.featured && <StatusPill label="Featured" tone="ok" icon="ri-star-fill" />}
                        {!img.active && <StatusPill label="Hidden" tone="bad" />}
                      </div>
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <p className="text-sm font-semibold text-foreground-950 truncate">{img.title || "Untitled"}</p>
                      <p className="text-[11px] text-foreground-500 truncate">{catLabel(img.category_id)}</p>
                      {img.caption && <p className="mt-1 text-[11px] text-foreground-600 line-clamp-2">{img.caption}</p>}

                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {filter === "all" && (
                          <>
                            <button type="button" disabled={fullIndex === 0 || busyId === "__reorder__"} onClick={() => reorder(fullIndex, -1)} aria-label="Move up" className="w-8 h-8 rounded-lg bg-background-100 border border-background-200 text-foreground-700 disabled:opacity-40 cursor-pointer flex items-center justify-center">
                              <i className="ri-arrow-up-line text-xs" aria-hidden="true"></i>
                            </button>
                            <button type="button" disabled={fullIndex === images.length - 1 || busyId === "__reorder__"} onClick={() => reorder(fullIndex, 1)} aria-label="Move down" className="w-8 h-8 rounded-lg bg-background-100 border border-background-200 text-foreground-700 disabled:opacity-40 cursor-pointer flex items-center justify-center">
                              <i className="ri-arrow-down-line text-xs" aria-hidden="true"></i>
                            </button>
                          </>
                        )}
                        <button type="button" onClick={() => toggle(img, "featured")} disabled={busyId === img.id} title="Toggle featured" className="w-8 h-8 rounded-lg bg-background-100 border border-background-200 text-foreground-700 cursor-pointer flex items-center justify-center">
                          <i className={img.featured ? "ri-star-fill text-accent-500 text-xs" : "ri-star-line text-xs"} aria-hidden="true"></i>
                        </button>
                        <button type="button" onClick={() => toggle(img, "active")} disabled={busyId === img.id} title="Show / hide" className="w-8 h-8 rounded-lg bg-background-100 border border-background-200 text-foreground-700 cursor-pointer flex items-center justify-center">
                          <i className={img.active ? "ri-eye-line text-xs" : "ri-eye-off-line text-xs"} aria-hidden="true"></i>
                        </button>
                        <button type="button" onClick={() => setDraft(img)} className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background-100 border border-background-200 text-foreground-900 text-xs font-semibold cursor-pointer">
                          <i className="ri-edit-line" aria-hidden="true"></i> Edit
                        </button>
                        <button type="button" onClick={() => setConfirmDelete(img)} className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-700 cursor-pointer flex items-center justify-center">
                          <i className="ri-delete-bin-line text-xs" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <GalleryCategories categories={categories} images={images} reload={load} />
      )}

      {/* Image form */}
      <Modal
        open={Boolean(draft)}
        onClose={() => setDraft(null)}
        title={draft?.id ? "Edit image" : "Add image"}
        wide
        footer={
          <>
            <button type="button" onClick={() => setDraft(null)} className={btnGhost}>Cancel</button>
            <button type="button" onClick={saveImage} disabled={saving} className={btnPrimary}>
              {saving ? "Saving…" : <><i className="ri-save-line" aria-hidden="true"></i> Save image</>}
            </button>
          </>
        }
      >
        {draft && (
          <div className="space-y-4">
            <ImageUploader
              value={draft.image_url ?? ""}
              onChange={(url) => setDraft({ ...draft, image_url: url })}
              label="Image"
              folder="gallery"
              height="h-48"
            />
            <Field label="Title">
              <input value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className={inputCls} placeholder="e.g. Golden Retriever Spa Bath" />
            </Field>
            <Field label="Category">
              <select value={draft.category_id ?? ""} onChange={(e) => setDraft({ ...draft, category_id: e.target.value || null })} className={inputCls}>
                <option value="">Uncategorised</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Caption" hint="Shown under the image on hover / in the lightbox.">
              <textarea value={draft.caption ?? ""} onChange={(e) => setDraft({ ...draft, caption: e.target.value })} rows={2} maxLength={300} className={`${inputCls} resize-none`}></textarea>
            </Field>
            <Field label="Alt text" hint="Describes the image for accessibility & SEO.">
              <input value={draft.alt ?? ""} onChange={(e) => setDraft({ ...draft, alt: e.target.value })} className={inputCls} placeholder="Describe the photo" />
            </Field>
            <div className="flex flex-wrap gap-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={Boolean(draft.featured)} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} className="w-4 h-4 accent-[oklch(var(--primary-500))]" />
                <span className="text-sm text-foreground-800">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={draft.active !== false} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} className="w-4 h-4 accent-[oklch(var(--primary-500))]" />
                <span className="text-sm text-foreground-800">Active (visible on site)</span>
              </label>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete image"
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
          Delete <strong>{confirmDelete?.title || "this image"}</strong>? It will be removed from the live gallery.
        </p>
      </Modal>
    </div>
  );
}

/* ───────────────────────────── Categories ───────────────────────────── */

function GalleryCategories({
  categories,
  images,
  reload,
}: {
  categories: GalleryCategoryRow[];
  images: GalleryImageRow[];
  reload: () => void;
}) {
  const [rows, setRows] = useState<GalleryCategoryRow[]>(categories);
  const [adding, setAdding] = useState(false);
  const [newCat, setNewCat] = useState({ label: "" });
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<GalleryCategoryRow | null>(null);

  useEffect(() => {
    setRows(categories);
  }, [categories]);

  const countFor = (id: string) => images.filter((i) => i.category_id === id).length;

  const rename = async (cat: GalleryCategoryRow) => {
    if (!supabase) return;
    setBusy(cat.id);
    const { error } = await supabase.from("gallery_categories").update({ label: cat.label, active: cat.active }).eq("id", cat.id);
    setBusy("");
    if (error) setErr(error.message);
    else reload();
  };

  const reorder = async (index: number, dir: -1 | 1) => {
    if (!supabase) return;
    const next = move(rows, index, dir).map((c, i) => ({ ...c, sort_order: (i + 1) * 10 }));
    setRows(next);
    setBusy("__reorder__");
    try {
      await Promise.all(next.map((c) => supabase.from("gallery_categories").update({ sort_order: c.sort_order }).eq("id", c.id)));
    } finally {
      setBusy("");
      reload();
    }
  };

  const addCategory = async () => {
    if (!supabase || !newCat.label.trim()) return;
    const id = slugify(newCat.label);
    const nextOrder = (rows.reduce((max, c) => Math.max(max, c.sort_order), 0) || 0) + 10;
    const { error } = await supabase.from("gallery_categories").upsert({ id, label: newCat.label.trim(), sort_order: nextOrder, active: true }, { onConflict: "id" });
    if (error) {
      setErr(error.message);
      return;
    }
    setAdding(false);
    setNewCat({ label: "" });
    reload();
  };

  const doDelete = async () => {
    if (!supabase || !confirmDelete) return;
    const { error } = await supabase.from("gallery_categories").delete().eq("id", confirmDelete.id);
    if (error) setErr(error.message);
    else {
      setRows((prev) => prev.filter((c) => c.id !== confirmDelete.id));
      setConfirmDelete(null);
      reload();
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div>
            <h3 className="font-heading text-base text-foreground-950">Gallery categories</h3>
            <p className="text-sm text-foreground-600">Group your photos — e.g. Dog Grooming, Cat Grooming, Before &amp; After.</p>
          </div>
          <button type="button" onClick={() => setAdding(true)} className={btnGhost}>
            <i className="ri-add-line" aria-hidden="true"></i> Add category
          </button>
        </div>
        {err && <p className="mt-2 text-xs font-semibold text-red-600">{err}</p>}
      </Card>

      <Card>
        {rows.length === 0 ? (
          <EmptyState icon="ri-price-tag-3-line" title="No categories yet" text="Add your first gallery category." />
        ) : (
          <ul className="divide-y divide-background-200/70">
            {rows.map((c, i) => (
              <li key={c.id} className="px-4 md:px-5 py-4 flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="flex items-center gap-1">
                  <button type="button" disabled={i === 0 || busy === "__reorder__"} onClick={() => reorder(i, -1)} aria-label="Move up" className="w-9 h-9 rounded-lg bg-background-100 border border-background-200 text-foreground-700 disabled:opacity-40 cursor-pointer flex items-center justify-center">
                    <i className="ri-arrow-up-line" aria-hidden="true"></i>
                  </button>
                  <button type="button" disabled={i === rows.length - 1 || busy === "__reorder__"} onClick={() => reorder(i, 1)} aria-label="Move down" className="w-9 h-9 rounded-lg bg-background-100 border border-background-200 text-foreground-700 disabled:opacity-40 cursor-pointer flex items-center justify-center">
                    <i className="ri-arrow-down-line" aria-hidden="true"></i>
                  </button>
                </div>
                <input
                  value={c.label}
                  onChange={(e) => setRows((prev) => prev.map((x) => (x.id === c.id ? { ...x, label: e.target.value } : x)))}
                  onBlur={() => rename(c)}
                  className={`${inputCls} flex-1`}
                />
                <span className="text-xs text-foreground-500 whitespace-nowrap">{countFor(c.id)} images</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={c.active} onChange={(e) => { const next = { ...c, active: e.target.checked }; setRows((prev) => prev.map((x) => (x.id === c.id ? next : x))); rename(next); }} className="w-4 h-4 accent-[oklch(var(--primary-500))]" />
                  <span className="text-xs text-foreground-700">{c.active ? "Active" : "Hidden"}</span>
                </label>
                <button type="button" onClick={() => setConfirmDelete(c)} className={`${btnDanger} px-3`}>
                  <i className="ri-delete-bin-line" aria-hidden="true"></i>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Add gallery category"
        footer={
          <>
            <button type="button" onClick={() => setAdding(false)} className={btnGhost}>Cancel</button>
            <button type="button" onClick={addCategory} className={btnPrimary}>
              <i className="ri-add-line" aria-hidden="true"></i> Add category
            </button>
          </>
        }
      >
        <Field label="Category label" hint="e.g. Before & After">
          <input value={newCat.label} onChange={(e) => setNewCat({ label: e.target.value })} className={inputCls} />
        </Field>
      </Modal>

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete category"
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
          Delete <strong>{confirmDelete?.label}</strong>? Images in this category will become uncategorised.
        </p>
      </Modal>
    </div>
  );
}
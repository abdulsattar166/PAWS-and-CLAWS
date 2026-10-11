import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { PetCategoryRow } from "@/lib/adminTypes";
import { Card, EmptyState, ErrorState, Spinner, Modal, Field, inputCls, btnPrimary, btnGhost, btnDanger } from "./AdminUi";

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

/**
 * Manages the pet categories (dogs, cats, birds, bunnies, …) that drive the
 * Services page filter. Categories are fully configurable — not hard-coded —
 * so new animal types can be added without touching the site code.
 */
export default function PetCategoriesManager() {
  const [categories, setCategories] = useState<PetCategoryRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<PetCategoryRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [newCat, setNewCat] = useState({ label: "", singular: "", icon: "ri-footprint-line" });

  const load = useCallback(async () => {
    if (!supabase) {
      setStatus("error");
      setError("Backend not configured.");
      return;
    }
    setStatus("loading");
    try {
      const { data, error: err } = await supabase
        .from("pet_categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (err) throw err;
      setCategories((data ?? []) as PetCategoryRow[]);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not load categories.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const patch = (id: string, changes: Partial<PetCategoryRow>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...changes } : c)));
    setDirty(true);
    setSaved(false);
  };

  const saveAll = async () => {
    if (!supabase) return;
    setSaving(true);
    setError("");
    try {
      const rows = categories.map((c, i) => ({
        id: c.id,
        label: c.label.trim() || c.id,
        singular: c.singular?.trim() || null,
        icon: c.icon?.trim() || null,
        sort_order: c.sort_order != null ? c.sort_order : (i + 1) * 10,
        active: c.active,
      }));
      const { error: err } = await supabase.from("pet_categories").upsert(rows, { onConflict: "id" });
      if (err) throw err;
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save categories.");
    } finally {
      setSaving(false);
    }
  };

  const addCategory = async () => {
    if (!supabase) return;
    const label = newCat.label.trim();
    if (!label) return;
    const id = slugify(label);
    setError("");
    const nextOrder = (categories.reduce((max, c) => Math.max(max, c.sort_order), 0) || 0) + 10;
    const row = {
      id,
      label,
      singular: newCat.singular.trim() || null,
      icon: newCat.icon.trim() || null,
      sort_order: nextOrder,
      active: true,
    };
    const { error: err } = await supabase.from("pet_categories").upsert(row, { onConflict: "id" });
    if (err) {
      setError(err.message);
      return;
    }
    setAdding(false);
    setNewCat({ label: "", singular: "", icon: "ri-footprint-line" });
    load();
  };

  const doDelete = async () => {
    if (!supabase || !confirmDelete) return;
    const { error: err } = await supabase.from("pet_categories").delete().eq("id", confirmDelete.id);
    if (!err) {
      setCategories((prev) => prev.filter((c) => c.id !== confirmDelete.id));
      setConfirmDelete(null);
    } else {
      setError(err.message);
    }
  };

  const reorder = (index: number, dir: -1 | 1) => {
    setCategories((prev) => {
      const next = move(prev, index, dir).map((c, i) => ({ ...c, sort_order: (i + 1) * 10 }));
      return next;
    });
    setDirty(true);
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div>
            <h3 className="font-heading text-base text-foreground-950">Pet categories</h3>
            <p className="text-sm text-foreground-600">These drive the filter on the Services page. Add or rename any animal type.</p>
          </div>
          <div className="flex items-center gap-2">
            {dirty && (
              <button type="button" onClick={saveAll} disabled={saving} className={btnPrimary}>
                {saving ? "Saving…" : <><i className="ri-save-line" aria-hidden="true"></i> Save changes</>}
              </button>
            )}
            <button type="button" onClick={() => setAdding(true)} className={btnGhost}>
              <i className="ri-add-line" aria-hidden="true"></i> Add category
            </button>
          </div>
        </div>
        {saved && <p className="mt-2 text-xs font-semibold text-accent-700">Saved — live on the site.</p>}
        {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
      </Card>

      <Card>
        {status === "loading" && <Spinner label="Loading categories…" />}
        {status === "error" && <ErrorState text={error} onRetry={load} />}
        {status === "ready" && categories.length === 0 && (
          <EmptyState icon="ri-price-tag-3-line" title="No categories yet" text="Add your first pet category." />
        )}
        {status === "ready" && categories.length > 0 && (
          <ul className="divide-y divide-background-200/70">
            {categories.map((c, i) => (
              <li key={c.id} className="px-4 md:px-5 py-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <button type="button" disabled={i === 0} onClick={() => reorder(i, -1)} aria-label="Move up" className="w-9 h-9 rounded-lg bg-background-100 border border-background-200 text-foreground-700 disabled:opacity-40 cursor-pointer flex items-center justify-center">
                        <i className="ri-arrow-up-line" aria-hidden="true"></i>
                      </button>
                      <button type="button" disabled={i === categories.length - 1} onClick={() => reorder(i, 1)} aria-label="Move down" className="w-9 h-9 rounded-lg bg-background-100 border border-background-200 text-foreground-700 disabled:opacity-40 cursor-pointer flex items-center justify-center">
                        <i className="ri-arrow-down-line" aria-hidden="true"></i>
                      </button>
                    </div>
                    <span className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                      <i className={c.icon || "ri-footprint-line"} aria-hidden="true"></i>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 min-w-0">
                    <input value={c.label} onChange={(e) => patch(c.id, { label: e.target.value })} placeholder="Label" className={inputCls} />
                    <input value={c.singular ?? ""} onChange={(e) => patch(c.id, { singular: e.target.value })} placeholder="Singular (optional)" className={inputCls} />
                    <input value={c.icon ?? ""} onChange={(e) => patch(c.id, { icon: e.target.value })} placeholder="ri-footprint-line" className={`${inputCls} font-mono text-xs`} />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer mr-1">
                      <input type="checkbox" checked={c.active} onChange={(e) => patch(c.id, { active: e.target.checked })} className="w-4 h-4 accent-[oklch(var(--primary-500))]" />
                      <span className="text-xs text-foreground-700">{c.active ? "Active" : "Hidden"}</span>
                    </label>
                    <button type="button" onClick={() => setConfirmDelete(c)} className={`${btnDanger} px-3`}>
                      <i className="ri-delete-bin-line" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Add pet category"
        footer={
          <>
            <button type="button" onClick={() => setAdding(false)} className={btnGhost}>Cancel</button>
            <button type="button" onClick={addCategory} className={btnPrimary}>
              <i className="ri-add-line" aria-hidden="true"></i> Add category
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Category label" hint="Shown on the Services filter, e.g. Dogs">
            <input value={newCat.label} onChange={(e) => setNewCat({ ...newCat, label: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Singular (optional)" hint="e.g. Dog">
            <input value={newCat.singular} onChange={(e) => setNewCat({ ...newCat, singular: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Icon (Remix Icon class)" hint="e.g. ri-footprint-line, ri-heart-line">
            <input value={newCat.icon} onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })} className={inputCls} />
          </Field>
        </div>
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
          Delete <strong>{confirmDelete?.label}</strong>? Services in this category will no longer be filterable by it.
        </p>
      </Modal>
    </div>
  );
}
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { PackageRow } from "@/lib/adminTypes";
import { PET_TYPES, PET_SIZES } from "@/lib/bookingOptions";
import { Modal, Field, inputCls, btnPrimary, btnGhost, btnDanger } from "./AdminUi";
import ImageUploader from "./ImageUploader";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "package";
}

function move<T>(arr: T[], from: number, dir: -1 | 1): T[] {
  const to = from + dir;
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

const SIZE_OPTIONS = [{ value: "", label: "Any size" }, ...PET_SIZES.map((s) => ({ value: s.value, label: s.label }))];

export default function PackageForm({
  pkg,
  onClose,
  onSaved,
}: {
  pkg: PackageRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !pkg;
  const [form, setForm] = useState({
    id: pkg?.id ?? "",
    name: pkg?.name ?? "",
    short_description: pkg?.short_description ?? "",
    full_description: pkg?.full_description ?? "",
    pet_type: pkg?.pet_type ?? "dog",
    breed_restrictions: pkg?.breed_restrictions ?? "",
    pet_size: pkg?.pet_size ?? "",
    min_weight: pkg?.min_weight != null ? String(pkg.min_weight) : "",
    max_weight: pkg?.max_weight != null ? String(pkg.max_weight) : "",
    original_price: pkg?.original_price != null ? String(pkg.original_price) : "",
    discounted_price: pkg?.discounted_price != null ? String(pkg.discounted_price) : "",
    duration: pkg?.duration ?? "",
    washes: pkg?.washes ?? "",
    shampoo_details: pkg?.shampoo_details ?? "",
    conditioner_details: pkg?.conditioner_details ?? "",
    haircut_details: pkg?.haircut_details ?? "",
    coat_care: pkg?.coat_care ?? "",
    skin_care: pkg?.skin_care ?? "",
    drying_brushing: pkg?.drying_brushing ?? "",
    ear_cleaning: pkg?.ear_cleaning ?? "",
    nail_trimming: pkg?.nail_trimming ?? "",
    image_url: pkg?.image_url ?? "",
    featured: pkg?.featured ?? false,
    sort_order: pkg?.sort_order != null ? String(pkg.sort_order) : "100",
    active: pkg?.active ?? true,
  });
  const [treatments, setTreatments] = useState<string[]>(pkg?.treatments ?? []);
  const [newTreatment, setNewTreatment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, value: string | boolean) => setForm((p) => ({ ...p, [key]: value }));

  const addTreatment = () => {
    const value = newTreatment.trim();
    if (!value) return;
    setTreatments((p) => [...p, value]);
    setNewTreatment("");
  };
  const updateTreatment = (i: number, value: string) =>
    setTreatments((p) => p.map((t, idx) => (idx === i ? value : t)));
  const removeTreatment = (i: number) => setTreatments((p) => p.filter((_, idx) => idx !== i));

  const num = (v: string): number | null => (v.trim() === "" ? null : Number(v));

  const save = async () => {
    if (!supabase) return;
    setError("");
    if (!form.name.trim()) { setError("Please enter a package name."); return; }
    if (!form.original_price || Number(form.original_price) < 0) { setError("Please enter a valid original price."); return; }

    setSaving(true);
    const id = isNew ? `${slugify(form.name)}-${Math.random().toString(36).slice(2, 6)}` : form.id;
    const payload = {
      name: form.name.trim(),
      short_description: form.short_description.trim() || null,
      full_description: form.full_description.trim() || null,
      pet_type: form.pet_type,
      breed_restrictions: form.breed_restrictions.trim() || null,
      pet_size: form.pet_size || null,
      min_weight: num(form.min_weight),
      max_weight: num(form.max_weight),
      original_price: Number(form.original_price),
      discounted_price: num(form.discounted_price),
      duration: form.duration.trim() || null,
      washes: form.washes.trim() || null,
      shampoo_details: form.shampoo_details.trim() || null,
      conditioner_details: form.conditioner_details.trim() || null,
      haircut_details: form.haircut_details.trim() || null,
      coat_care: form.coat_care.trim() || null,
      skin_care: form.skin_care.trim() || null,
      drying_brushing: form.drying_brushing.trim() || null,
      ear_cleaning: form.ear_cleaning.trim() || null,
      nail_trimming: form.nail_trimming.trim() || null,
      treatments,
      image_url: form.image_url.trim() || null,
      featured: form.featured,
      sort_order: Number(form.sort_order) || 100,
      active: form.active,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isNew) {
        const { error: insErr } = await supabase.from("packages").insert({ id, ...payload });
        if (insErr) throw insErr;
      } else {
        const { error: updErr } = await supabase.from("packages").update(payload).eq("id", id);
        if (updErr) throw updErr;
      }
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the package.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      wide
      title={isNew ? "Add package" : `Edit ${pkg?.name}`}
      footer={
        <>
          <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
          <button type="button" onClick={save} disabled={saving} className={btnPrimary}>
            {saving ? "Saving…" : <><i className="ri-save-line" aria-hidden="true"></i> Save package</>}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {error && (
          <p className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
            <i className="ri-error-warning-line mt-0.5" aria-hidden="true"></i>{error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Package name"><input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} /></Field>
          <Field label="Pet category">
            <select value={form.pet_type} onChange={(e) => set("pet_type", e.target.value)} className={`${inputCls} cursor-pointer`}>
              {PET_TYPES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </Field>
          <Field label="Applicable size (optional)">
            <select value={form.pet_size} onChange={(e) => set("pet_size", e.target.value)} className={`${inputCls} cursor-pointer`}>
              {SIZE_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Estimated duration"><input value={form.duration} onChange={(e) => set("duration", e.target.value)} className={inputCls} placeholder="e.g. 90 min" /></Field>
          <Field label="Minimum weight (kg)"><input type="number" min="0" value={form.min_weight} onChange={(e) => set("min_weight", e.target.value)} className={inputCls} /></Field>
          <Field label="Maximum weight (kg)"><input type="number" min="0" value={form.max_weight} onChange={(e) => set("max_weight", e.target.value)} className={inputCls} /></Field>
          <Field label="Original price (AED)"><input type="number" min="0" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} className={inputCls} /></Field>
          <Field label="Discounted price (AED, optional)" hint="Leave blank for no discount."><input type="number" min="0" value={form.discounted_price} onChange={(e) => set("discounted_price", e.target.value)} className={inputCls} /></Field>
          <Field label="Breed restrictions (optional)"><input value={form.breed_restrictions} onChange={(e) => set("breed_restrictions", e.target.value)} className={inputCls} placeholder="e.g. not for double-coated breeds" /></Field>
          <Field label="Display order" hint="Lower shows first."><input type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} className={inputCls} /></Field>
        </div>

        <Field label="Short description" hint="A one-line summary shown on the package card.">
          <input value={form.short_description} onChange={(e) => set("short_description", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Full description">
          <textarea value={form.full_description} onChange={(e) => set("full_description", e.target.value)} rows={3} maxLength={800} className={`${inputCls} resize-none`}></textarea>
        </Field>

        <ImageUploader
          value={form.image_url}
          onChange={(url) => set("image_url", url)}
          label="Package image"
          folder="packages"
          height="h-40"
        />

        {/* Reorderable treatments */}
        <div className="rounded-xl bg-background-100 border border-background-200/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground-950">Included treatments</p>
              <p className="text-[11px] text-foreground-500">Double wash, shampoo, conditioner, combing… reorder with the arrows.</p>
            </div>
            <span className="text-xs font-semibold text-foreground-500">{treatments.length} items</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              value={newTreatment}
              onChange={(e) => setNewTreatment(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTreatment(); } }}
              placeholder="Add a treatment, e.g. Organic conditioner"
              className={inputCls}
            />
            <button type="button" onClick={addTreatment} className={`${btnGhost} shrink-0`}>
              <i className="ri-add-line" aria-hidden="true"></i> Add
            </button>
          </div>

          {treatments.length > 0 && (
            <div className="mt-3 space-y-2">
              {treatments.map((item, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-background-50 border border-background-200 p-2">
                  <span className="text-xs font-semibold text-foreground-500 w-5 text-center shrink-0">{i + 1}</span>
                  <input value={item} onChange={(e) => updateTreatment(i, e.target.value)} className={inputCls} />
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" disabled={i === 0} onClick={() => setTreatments((p) => move(p, i, -1))} aria-label="Move up" className="w-8 h-8 rounded-md bg-background-50 border border-background-200 text-foreground-700 disabled:opacity-40 cursor-pointer flex items-center justify-center">
                      <i className="ri-arrow-up-line text-xs" aria-hidden="true"></i>
                    </button>
                    <button type="button" disabled={i === treatments.length - 1} onClick={() => setTreatments((p) => move(p, i, 1))} aria-label="Move down" className="w-8 h-8 rounded-md bg-background-50 border border-background-200 text-foreground-700 disabled:opacity-40 cursor-pointer flex items-center justify-center">
                      <i className="ri-arrow-down-line text-xs" aria-hidden="true"></i>
                    </button>
                    <button type="button" onClick={() => removeTreatment(i)} aria-label="Remove" className={`${btnDanger} px-2.5 py-2`}>
                      <i className="ri-delete-bin-line text-xs" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Care details */}
        <div className="rounded-xl bg-background-100 border border-background-200/70 p-4">
          <p className="text-sm font-semibold text-foreground-950">Care details (optional)</p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Washes"><input value={form.washes} onChange={(e) => set("washes", e.target.value)} className={inputCls} placeholder="Double wash" /></Field>
            <Field label="Shampoo details"><input value={form.shampoo_details} onChange={(e) => set("shampoo_details", e.target.value)} className={inputCls} /></Field>
            <Field label="Conditioner details"><input value={form.conditioner_details} onChange={(e) => set("conditioner_details", e.target.value)} className={inputCls} /></Field>
            <Field label="Haircut / trimming"><input value={form.haircut_details} onChange={(e) => set("haircut_details", e.target.value)} className={inputCls} /></Field>
            <Field label="Coat care"><input value={form.coat_care} onChange={(e) => set("coat_care", e.target.value)} className={inputCls} /></Field>
            <Field label="Skin care"><input value={form.skin_care} onChange={(e) => set("skin_care", e.target.value)} className={inputCls} /></Field>
            <Field label="Drying & brushing"><input value={form.drying_brushing} onChange={(e) => set("drying_brushing", e.target.value)} className={inputCls} /></Field>
            <Field label="Ear cleaning"><input value={form.ear_cleaning} onChange={(e) => set("ear_cleaning", e.target.value)} className={inputCls} /></Field>
            <Field label="Nail trimming"><input value={form.nail_trimming} onChange={(e) => set("nail_trimming", e.target.value)} className={inputCls} /></Field>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="w-4 h-4 accent-[oklch(var(--primary-500))]" />
            <span className="text-sm text-foreground-900">Active (visible on the site)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-[oklch(var(--accent-500))]" />
            <span className="text-sm text-foreground-900">Featured (highlighted as popular)</span>
          </label>
        </div>
      </div>
    </Modal>
  );
}
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ServiceRow, SizePriceRow } from "@/lib/adminTypes";
import { Modal, Field, inputCls, btnPrimary, btnGhost, btnDanger } from "./AdminUi";
import ImageUploader from "./ImageUploader";

const CATEGORIES = ["dogs", "cats", "birds", "bunny", "medical", "addons"];
const PET_TYPES = [
  { value: "dog", label: "Dogs" },
  { value: "cat", label: "Cats" },
  { value: "bird", label: "Birds" },
  { value: "rabbit", label: "Rabbits" },
  { value: "other", label: "Other animals" },
  { value: "all", label: "All animals (add-on)" },
];
const SIZES = ["small", "medium", "large", "xl"];
const SIZE_LABELS: Record<string, string> = {
  small: "Small (9–13 kg)",
  medium: "Medium (13–22 kg)",
  large: "Large (22–40 kg)",
  xl: "XL (40 kg and up)",
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "service";
}

export default function ServiceForm({
  service,
  initialSizePrices,
  onClose,
  onSaved,
}: {
  service: ServiceRow | null;
  initialSizePrices: SizePriceRow[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !service;
  const [form, setForm] = useState({
    id: service?.id ?? "",
    name: service?.name ?? "",
    category: service?.category ?? "dogs",
    pet_type: service?.pet_type ?? "dog",
    price_aed: service?.price_aed != null ? String(service.price_aed) : "",
    duration: service?.duration ?? "",
    icon: service?.icon ?? "ri-scissors-cut-line",
    description: service?.description ?? "",
    sort_order: service?.sort_order != null ? String(service.sort_order) : "100",
    image_url: service?.image_url ?? "",
    active: service?.active ?? true,
  });
  const [sizePrices, setSizePrices] = useState<Array<{ size: string; price_aed: string }>>(
    initialSizePrices.map((r) => ({ size: r.size, price_aed: String(r.price_aed) })),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, value: string | boolean) => setForm((p) => ({ ...p, [key]: value }));

  const addSize = () => {
    const used = new Set(sizePrices.map((s) => s.size));
    const next = SIZES.find((s) => !used.has(s)) ?? "small";
    setSizePrices((p) => [...p, { size: next, price_aed: "" }]);
  };
  const removeSize = (i: number) => setSizePrices((p) => p.filter((_, idx) => idx !== i));
  const updateSize = (i: number, key: "size" | "price_aed", value: string) =>
    setSizePrices((p) => p.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));

  const save = async () => {
    if (!supabase) return;
    setError("");
    if (!form.name.trim()) { setError("Please enter a service name."); return; }
    if (!form.price_aed || Number(form.price_aed) < 0) { setError("Please enter a valid price."); return; }

    setSaving(true);
    const id = isNew ? `${slugify(form.name)}-${Math.random().toString(36).slice(2, 6)}` : form.id;
    const payload = {
      name: form.name.trim(),
      category: form.category,
      pet_type: form.pet_type,
      price_aed: Number(form.price_aed),
      duration: form.duration.trim() || null,
      icon: form.icon.trim() || null,
      description: form.description.trim() || null,
      sort_order: Number(form.sort_order) || 100,
      image_url: form.image_url.trim() || null,
      active: form.active,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isNew) {
        const { error: insErr } = await supabase.from("services").insert({ id, ...payload });
        if (insErr) throw insErr;
      } else {
        const { error: updErr } = await supabase.from("services").update(payload).eq("id", id);
        if (updErr) throw updErr;
      }

      // Replace size prices with the current set (de-duplicated by size so the
      // unique(service_id, size) constraint can never be violated).
      const { error: delErr } = await supabase.from("service_size_prices").delete().eq("service_id", id);
      if (delErr) throw delErr;
      const deduped = new Map<string, number>();
      sizePrices.forEach((r) => {
        if (r.price_aed !== "" && Number(r.price_aed) >= 0) deduped.set(r.size, Number(r.price_aed));
      });
      const rows = Array.from(deduped, ([size, price]) => ({ service_id: id, size, price_aed: price }));
      if (rows.length) {
        const { error: insRowsErr } = await supabase.from("service_size_prices").insert(rows);
        if (insRowsErr) throw insRowsErr;
      }
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the service.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      wide
      title={isNew ? "Add service" : `Edit ${service?.name}`}
      footer={
        <>
          <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
          <button type="button" onClick={save} disabled={saving} className={btnPrimary}>
            {saving ? "Saving…" : <><i className="ri-save-line" aria-hidden="true"></i> Save service</>}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {error && (
          <p className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
            <i className="ri-error-warning-line mt-0.5" aria-hidden="true"></i>{error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Service name">
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Category">
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className={`${inputCls} cursor-pointer`}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Pet type">
            <select value={form.pet_type} onChange={(e) => set("pet_type", e.target.value)} className={`${inputCls} cursor-pointer`}>
              {PET_TYPES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </Field>
          <Field label="Base price (AED)" hint="Used when no size price applies.">
            <input type="number" min="0" value={form.price_aed} onChange={(e) => set("price_aed", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Duration (optional)">
            <input value={form.duration} onChange={(e) => set("duration", e.target.value)} className={inputCls} placeholder="e.g. 60–90 min" />
          </Field>
          <Field label="Icon (Remix Icon class)">
            <input value={form.icon} onChange={(e) => set("icon", e.target.value)} className={inputCls} placeholder="ri-scissors-cut-line" />
          </Field>
          <Field label="Sort order" hint="Lower shows first.">
            <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} className={inputCls} />
          </Field>
        </div>

        <ImageUploader
          value={form.image_url}
          onChange={(url) => set("image_url", url)}
          label="Service image (optional)"
          folder="services"
          height="h-40"
        />

        <Field label="Description">
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} maxLength={500} className={`${inputCls} resize-none`}></textarea>
        </Field>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="w-4 h-4 accent-[oklch(var(--primary-500))]" />
          <span className="text-sm text-foreground-900">Active (visible on the site and bookable)</span>
        </label>

        {/* Size pricing */}
        <div className="rounded-xl bg-background-100 border border-background-200/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground-950">Size-based pricing</p>
              <p className="text-[11px] text-foreground-500">Add rows for grooms priced by pet size (dogs). Leave empty to use the base price.</p>
            </div>
            <button type="button" onClick={addSize} className={btnGhost}><i className="ri-add-line" aria-hidden="true"></i> Add size</button>
          </div>
          {sizePrices.length > 0 && (
            <div className="mt-3 space-y-2">
              {sizePrices.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select value={row.size} onChange={(e) => updateSize(i, "size", e.target.value)} className={`${inputCls} cursor-pointer sm:max-w-[220px]`}>
                    {SIZES.map((s) => <option key={s} value={s}>{SIZE_LABELS[s]}</option>)}
                  </select>
                  <input type="number" min="0" value={row.price_aed} onChange={(e) => updateSize(i, "price_aed", e.target.value)} placeholder="AED" className={inputCls} />
                  <button type="button" onClick={() => removeSize(i)} aria-label="Remove size" className={`${btnDanger} px-3`}>
                    <i className="ri-delete-bin-line" aria-hidden="true"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
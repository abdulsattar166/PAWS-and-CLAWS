import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { OfferRow, ServiceRow } from "@/lib/adminTypes";
import { Modal, Field, inputCls, btnPrimary, btnGhost } from "./AdminUi";

function toDateInput(value: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function OfferForm({
  offer,
  services,
  onClose,
  onSaved,
}: {
  offer: OfferRow | null;
  services: ServiceRow[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !offer;
  const [form, setForm] = useState({
    title: offer?.title ?? "",
    description: offer?.description ?? "",
    discount_type: offer?.discount_type ?? "percent",
    discount_value: offer?.discount_value != null ? String(offer.discount_value) : "",
    promo_code: offer?.promo_code ?? "",
    banner_text: offer?.banner_text ?? "",
    starts_at: toDateInput(offer?.starts_at ?? null),
    ends_at: toDateInput(offer?.ends_at ?? null),
    active: offer?.active ?? true,
  });
  const [serviceIds, setServiceIds] = useState<string[]>(offer?.service_ids ?? []);
  const [allServices, setAllServices] = useState((offer?.service_ids ?? []).length === 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const toggleService = (id: string) =>
    setServiceIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const save = async () => {
    if (!supabase) return;
    setError("");
    if (!form.title.trim()) { setError("Please enter an offer title."); return; }
    if (!form.discount_value || Number(form.discount_value) <= 0) { setError("Please enter a discount value greater than zero."); return; }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      service_ids: allServices ? [] : serviceIds,
      promo_code: form.promo_code.trim() || null,
      banner_text: form.banner_text.trim() || null,
      starts_at: form.starts_at ? new Date(`${form.starts_at}T00:00:00`).toISOString() : null,
      ends_at: form.ends_at ? new Date(`${form.ends_at}T23:59:59`).toISOString() : null,
      active: form.active,
      updated_at: new Date().toISOString(),
    };

    const { error: err } = isNew
      ? await supabase.from("offers").insert(payload)
      : await supabase.from("offers").update(payload).eq("id", offer!.id);
    setSaving(false);
    if (err) { setError(err.message); return; }
    onSaved();
    onClose();
  };

  const discountHint = form.discount_type === "percent" ? "% off the service price" : "AED off the service price";

  return (
    <Modal
      open
      onClose={onClose}
      wide
      title={isNew ? "Create offer" : `Edit ${offer?.title}`}
      footer={
        <>
          <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
          <button type="button" onClick={save} disabled={saving} className={btnPrimary}>
            {saving ? "Saving…" : <><i className="ri-save-line" aria-hidden="true"></i> Save offer</>}
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
          <Field label="Offer title">
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="e.g. Spring Grooming Sale" />
          </Field>
          <Field label="Promo code (optional)">
            <input value={form.promo_code} onChange={(e) => set("promo_code", e.target.value)} className={inputCls} placeholder="e.g. SPRING20" />
          </Field>
          <Field label="Discount type">
            <select value={form.discount_type} onChange={(e) => set("discount_type", e.target.value)} className={`${inputCls} cursor-pointer`}>
              <option value="percent">Percentage (%)</option>
              <option value="fixed">Fixed amount (AED)</option>
            </select>
          </Field>
          <Field label="Discount value" hint={discountHint}>
            <input type="number" min="0" value={form.discount_value} onChange={(e) => set("discount_value", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Starts on (optional)">
            <input type="date" value={form.starts_at} onChange={(e) => set("starts_at", e.target.value)} className={`${inputCls} cursor-pointer`} />
          </Field>
          <Field label="Expires on (optional)">
            <input type="date" value={form.ends_at} onChange={(e) => set("ends_at", e.target.value)} className={`${inputCls} cursor-pointer`} />
          </Field>
        </div>

        <Field label="Description (optional)">
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} maxLength={500} className={`${inputCls} resize-none`}></textarea>
        </Field>

        <Field label="Banner text (optional)" hint="Shown as a promotional banner on the home and services pages.">
          <input value={form.banner_text} onChange={(e) => set("banner_text", e.target.value)} className={inputCls} placeholder="e.g. 20% off all dog grooms this month!" />
        </Field>

        <div className="rounded-xl bg-background-100 border border-background-200/70 p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={allServices} onChange={(e) => setAllServices(e.target.checked)} className="w-4 h-4 accent-[oklch(var(--primary-500))]" />
            <span className="text-sm text-foreground-900">Applies to all services</span>
          </label>
          {!allServices && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto">
              {services.map((s) => (
                <label key={s.id} className="flex items-center gap-2.5 rounded-lg bg-background-50 border border-background-200/70 px-3 py-2 cursor-pointer">
                  <input type="checkbox" checked={serviceIds.includes(s.id)} onChange={() => toggleService(s.id)} className="w-4 h-4 accent-[oklch(var(--primary-500))]" />
                  <span className="text-sm text-foreground-900 truncate">{s.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="w-4 h-4 accent-[oklch(var(--primary-500))]" />
          <span className="text-sm text-foreground-900">Active</span>
        </label>
      </div>
    </Modal>
  );
}
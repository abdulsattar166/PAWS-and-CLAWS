import type { GuideItem, MedicalItem } from "@/lib/pageContent";
import { btnGhost, inputCls, labelCls } from "./AdminUi";
import { SaveBar, TextAreaField, TextField } from "./PageEditorFields";
import { usePageDraft } from "./usePageDraft";

function move<T>(arr: T[], from: number, dir: -1 | 1): T[] {
  const to = from + dir;
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function Toolbar({ index, total, onMove, onRemove }: { index: number; total: number; onMove: (dir: -1 | 1) => void; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button type="button" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move up" className="w-8 h-8 rounded-md bg-background-50 border border-background-200 text-foreground-700 disabled:opacity-40 cursor-pointer flex items-center justify-center">
        <i className="ri-arrow-up-line text-xs" aria-hidden="true"></i>
      </button>
      <button type="button" disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Move down" className="w-8 h-8 rounded-md bg-background-50 border border-background-200 text-foreground-700 disabled:opacity-40 cursor-pointer flex items-center justify-center">
        <i className="ri-arrow-down-line text-xs" aria-hidden="true"></i>
      </button>
      <button type="button" onClick={onRemove} aria-label="Remove" className="w-8 h-8 rounded-md bg-red-50 border border-red-200 text-red-700 cursor-pointer flex items-center justify-center">
        <i className="ri-delete-bin-line text-xs" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default function MedicalEditor() {
  const { draft, patch, save, saving, saved, error } = usePageDraft("medical");

  const updateItem = (i: number, p: Partial<MedicalItem>) =>
    patch({ items: draft.items.map((it, idx) => (idx === i ? { ...it, ...p } : it)) });
  const updateGuide = (i: number, p: Partial<GuideItem>) =>
    patch({ guideItems: draft.guideItems.map((it, idx) => (idx === i ? { ...it, ...p } : it)) });

  return (
    <div className="space-y-5 max-w-4xl admin-fade">
      <div className="rounded-2xl bg-background-50 border border-background-200/80 p-5 md:p-6 space-y-4">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-accent-100 text-accent-800 flex items-center justify-center shrink-0">
            <i className="ri-first-aid-kit-line text-xl" aria-hidden="true"></i>
          </span>
          <div>
            <h3 className="font-heading text-lg text-foreground-950">Section heading</h3>
            <p className="text-sm text-foreground-600">The title and intro shown above the medical treatments on the Services page.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Eyebrow label" value={draft.label} onChange={(v) => patch({ label: v })} />
          <TextField label="Heading" value={draft.heading} onChange={(v) => patch({ heading: v })} />
          <TextField label="Heading (italic tail)" value={draft.headingItalic} onChange={(v) => patch({ headingItalic: v })} />
        </div>
        <TextAreaField label="Intro paragraph" value={draft.intro} onChange={(v) => patch({ intro: v })} rows={3} />
      </div>

      {/* Medical treatments */}
      <div className="rounded-2xl bg-background-50 border border-background-200/80 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-heading text-lg text-foreground-950">Medical treatments</h3>
            <p className="text-sm text-foreground-600">Each treatment card — icon, name, price, tag and description.</p>
          </div>
          <button
            type="button"
            onClick={() => patch({ items: [...draft.items, { id: "", icon: "ri-first-aid-kit-line", name: "", price: "", note: "", description: "" }] })}
            className={`${btnGhost} px-3 py-2 text-xs`}
          >
            <i className="ri-add-line" aria-hidden="true"></i> Add treatment
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {draft.items.map((item, i) => (
            <div key={i} className="rounded-xl bg-background-100 border border-background-200 p-3 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-lg bg-accent-500 text-background-950 flex items-center justify-center">
                    <i className={item.icon || "ri-first-aid-kit-line"} aria-hidden="true"></i>
                  </span>
                  <input value={item.icon} onChange={(e) => updateItem(i, { icon: e.target.value })} placeholder="ri-bug-2-line" className={`${inputCls} w-40 text-xs`} />
                </div>
                <Toolbar index={i} total={draft.items.length} onMove={(dir) => patch({ items: move(draft.items, i, dir) })} onRemove={() => patch({ items: draft.items.filter((_, idx) => idx !== i) })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Name</label>
                  <input value={item.name} onChange={(e) => updateItem(i, { name: e.target.value })} className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Price</label>
                    <input value={item.price} onChange={(e) => updateItem(i, { price: e.target.value })} placeholder="AED 90" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Tag</label>
                    <input value={item.note} onChange={(e) => updateItem(i, { note: e.target.value })} placeholder="Extra" className={inputCls} />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea value={item.description} onChange={(e) => updateItem(i, { description: e.target.value })} rows={3} maxLength={600} className={`${inputCls} resize-none`}></textarea>
              </div>
              <div>
                <label className={labelCls}>Internal id <span className="font-normal text-foreground-400">(optional — for the booking system)</span></label>
                <input value={item.id} onChange={(e) => updateItem(i, { id: e.target.value })} placeholder="flea-tick-bath" className={`${inputCls} text-xs`} />
              </div>
            </div>
          ))}
          {draft.items.length === 0 && <p className="text-sm text-foreground-500 py-3">No treatments yet — add your first one above.</p>}
        </div>
      </div>

      {/* Special care guidance */}
      <div className="rounded-2xl bg-background-50 border border-background-200/80 p-5 md:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
              <i className="ri-heart-pulse-line text-xl" aria-hidden="true"></i>
            </span>
            <div>
              <h3 className="font-heading text-lg text-foreground-950">Special care guidance</h3>
              <p className="text-sm text-foreground-600">Practical advice for pets with medical or special-care needs.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => patch({ guideItems: [...draft.guideItems, { icon: "ri-heart-line", title: "", text: "" }] })}
            className={`${btnGhost} px-3 py-2 text-xs`}
          >
            <i className="ri-add-line" aria-hidden="true"></i> Add guidance
          </button>
        </div>
        <TextField label="Guidance heading" value={draft.guideTitle} onChange={(v) => patch({ guideTitle: v })} />
        <TextAreaField label="Guidance intro" value={draft.guideIntro} onChange={(v) => patch({ guideIntro: v })} rows={2} />

        <div className="space-y-3">
          {draft.guideItems.map((item, i) => (
            <div key={i} className="rounded-xl bg-background-100 border border-background-200 p-3 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-lg bg-background-50 border border-background-200 flex items-center justify-center">
                    <i className={item.icon || "ri-heart-line"} aria-hidden="true"></i>
                  </span>
                  <input value={item.icon} onChange={(e) => updateGuide(i, { icon: e.target.value })} placeholder="ri-alert-line" className={`${inputCls} w-40 text-xs`} />
                </div>
                <Toolbar index={i} total={draft.guideItems.length} onMove={(dir) => patch({ guideItems: move(draft.guideItems, i, dir) })} onRemove={() => patch({ guideItems: draft.guideItems.filter((_, idx) => idx !== i) })} />
              </div>
              <input value={item.title} onChange={(e) => updateGuide(i, { title: e.target.value })} placeholder="Guidance title" className={inputCls} />
              <textarea value={item.text} onChange={(e) => updateGuide(i, { text: e.target.value })} placeholder="Guidance text" rows={2} maxLength={500} className={`${inputCls} resize-none`}></textarea>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-2xl bg-background-50 border border-background-200/80 p-5 md:p-6 space-y-4">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-secondary-100 text-secondary-800 flex items-center justify-center shrink-0">
            <i className="ri-error-warning-line text-xl" aria-hidden="true"></i>
          </span>
          <div>
            <h3 className="font-heading text-lg text-foreground-950">Medical disclaimer</h3>
            <p className="text-sm text-foreground-600">Shown below the guidance to make clear that our baths support — but never replace — veterinary care.</p>
          </div>
        </div>
        <textarea value={draft.disclaimer} onChange={(e) => patch({ disclaimer: e.target.value })} rows={3} maxLength={600} className={`${inputCls} resize-none`}></textarea>
      </div>

      <SaveBar saving={saving} saved={saved} error={error} onSave={save} />
    </div>
  );
}
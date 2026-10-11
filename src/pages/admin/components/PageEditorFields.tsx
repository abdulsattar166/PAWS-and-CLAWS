/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { IconItem, JourneyItem, PageKey, SocialItem, StatItem, SlideItem } from "@/lib/pageContent";
import { btnGhost, btnPrimary, inputCls, labelCls } from "./AdminUi";
import ImageUploader from "./ImageUploader";

export async function persistPage(key: PageKey, value: unknown): Promise<string | null> {
  if (!supabase) return "Backend not configured.";
  const { error } = await supabase
    .from("pages")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  return error ? error.message : null;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
      {hint && <p className="mt-1 text-[11px] text-foreground-500">{hint}</p>}
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={2000}
        className={`${inputCls} resize-none`}
      ></textarea>
    </div>
  );
}

function GroupShell({
  title,
  desc,
  addLabel,
  onAdd,
  children,
}: {
  title: string;
  desc: string;
  addLabel: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-background-200 bg-background-100/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="font-heading text-sm text-foreground-950">{title}</h4>
          <p className="text-[11px] text-foreground-500">{desc}</p>
        </div>
        <button type="button" onClick={onAdd} className={`${btnGhost} px-3 py-2 text-xs`}>
          <i className="ri-add-line" aria-hidden="true"></i> {addLabel}
        </button>
      </div>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function ItemToolbar({
  index,
  total,
  onMove,
  onRemove,
}: {
  index: number;
  total: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button type="button" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move up" className="w-7 h-7 rounded-md bg-background-50 border border-background-200 text-foreground-700 disabled:opacity-40 cursor-pointer flex items-center justify-center">
        <i className="ri-arrow-up-line text-xs" aria-hidden="true"></i>
      </button>
      <button type="button" disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Move down" className="w-7 h-7 rounded-md bg-background-50 border border-background-200 text-foreground-700 disabled:opacity-40 cursor-pointer flex items-center justify-center">
        <i className="ri-arrow-down-line text-xs" aria-hidden="true"></i>
      </button>
      <button type="button" onClick={onRemove} aria-label="Remove" className="w-7 h-7 rounded-md bg-red-50 border border-red-200 text-red-700 cursor-pointer flex items-center justify-center">
        <i className="ri-delete-bin-line text-xs" aria-hidden="true"></i>
      </button>
    </div>
  );
}

function move<T>(arr: T[], from: number, dir: -1 | 1): T[] {
  const to = from + dir;
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function SlideListEditor({
  items,
  onChange,
  folder,
}: {
  items: SlideItem[];
  onChange: (v: SlideItem[]) => void;
  folder: string;
}) {
  const update = (i: number, patch: Partial<SlideItem>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  return (
    <GroupShell
      title="Hero slideshow images"
      desc="Upload the images shown in the page hero. Drag the order with the arrows."
      addLabel="Add slide"
      onAdd={() => onChange([...items, { image: "", alt: "" }])}
    >
      {items.map((item, i) => (
        <div key={i} className="rounded-lg bg-background-50 border border-background-200 p-3">
          <div className="flex items-start gap-3">
            <span className="text-xs font-semibold text-foreground-500 mt-1 shrink-0">#{i + 1}</span>
            <div className="flex-1 min-w-0 space-y-2">
              <ImageUploader
                value={item.image}
                onChange={(url) => update(i, { image: url })}
                alt={item.alt}
                onAltChange={(alt) => update(i, { alt })}
                label="Slide image"
                folder={folder}
                height="h-32"
              />
            </div>
            <ItemToolbar index={i} total={items.length} onMove={(dir) => onChange(move(items, i, dir))} onRemove={() => onChange(items.filter((_, idx) => idx !== i))} />
          </div>
        </div>
      ))}
    </GroupShell>
  );
}

export function StatListEditor({ items, onChange }: { items: StatItem[]; onChange: (v: StatItem[]) => void }) {
  const update = (i: number, patch: Partial<StatItem>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  return (
    <GroupShell title="Statistics" desc="The number cards shown on the page." addLabel="Add stat" onAdd={() => onChange([...items, { value: "", label: "" }])}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 rounded-lg bg-background-50 border border-background-200 p-2">
          <input value={item.value} onChange={(e) => update(i, { value: e.target.value })} placeholder="5+" className={`${inputCls} w-24`} />
          <input value={item.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="Label" className={inputCls} />
          <ItemToolbar index={i} total={items.length} onMove={(dir) => onChange(move(items, i, dir))} onRemove={() => onChange(items.filter((_, idx) => idx !== i))} />
        </div>
      ))}
    </GroupShell>
  );
}

export function IconListEditor({
  items,
  onChange,
  title,
  desc,
}: {
  items: IconItem[];
  onChange: (v: IconItem[]) => void;
  title: string;
  desc: string;
}) {
  const update = (i: number, patch: Partial<IconItem>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  return (
    <GroupShell title={title} desc={desc} addLabel="Add item" onAdd={() => onChange([...items, { icon: "ri-star-line", title: "", desc: "" }])}>
      {items.map((item, i) => (
        <div key={i} className="rounded-lg bg-background-50 border border-background-200 p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                <i className={item.icon} aria-hidden="true"></i>
              </span>
              <input
                value={item.icon}
                onChange={(e) => update(i, { icon: e.target.value })}
                placeholder="ri-star-line"
                className={`${inputCls} w-40 text-xs`}
              />
            </div>
            <ItemToolbar index={i} total={items.length} onMove={(dir) => onChange(move(items, i, dir))} onRemove={() => onChange(items.filter((_, idx) => idx !== i))} />
          </div>
          <input value={item.title} onChange={(e) => update(i, { title: e.target.value })} placeholder="Title" className={inputCls} />
          <textarea value={item.desc} onChange={(e) => update(i, { desc: e.target.value })} placeholder="Description" rows={2} maxLength={400} className={`${inputCls} resize-none`}></textarea>
        </div>
      ))}
    </GroupShell>
  );
}

export function SocialListEditor({ items, onChange }: { items: SocialItem[]; onChange: (v: SocialItem[]) => void }) {
  const update = (i: number, patch: Partial<SocialItem>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  return (
    <GroupShell title="Social links" desc="The social buttons shown on the Contact page." addLabel="Add link" onAdd={() => onChange([...items, { icon: "ri-link", label: "", href: "" }])}>
      {items.map((item, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg bg-background-50 border border-background-200 p-2">
          <input value={item.icon} onChange={(e) => update(i, { icon: e.target.value })} placeholder="ri-instagram-line" className={`${inputCls} w-40 text-xs`} />
          <input value={item.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="Label" className={`${inputCls} w-32`} />
          <input value={item.href} onChange={(e) => update(i, { href: e.target.value })} placeholder="https://…" className={`${inputCls} flex-1 min-w-[160px]`} />
          <ItemToolbar index={i} total={items.length} onMove={(dir) => onChange(move(items, i, dir))} onRemove={() => onChange(items.filter((_, idx) => idx !== i))} />
        </div>
      ))}
    </GroupShell>
  );
}

export function SaveBar({ saving, saved, error, onSave }: { saving: boolean; saved: boolean; error: string; onSave: () => void }) {
  return (
    <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-3 border-t border-background-200/70 bg-background-50/95 backdrop-blur px-1 py-3 mt-2">
      <button type="button" onClick={onSave} disabled={saving} className={btnPrimary}>
        {saving ? "Saving…" : <><i className="ri-save-line" aria-hidden="true"></i> Save page</>}
      </button>
      {saved && <span className="text-xs font-semibold text-accent-700">Saved — live on the website.</span>}
      {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
    </div>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg bg-background-50 border border-background-200 px-3.5 py-2.5 cursor-pointer">
      <span className="flex flex-col">
        <span className="text-sm text-foreground-900">{label}</span>
        {hint && <span className="text-[11px] text-foreground-500">{hint}</span>}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 shrink-0 accent-[oklch(var(--primary-500))]"
      />
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className={inputCls}
      />
      {hint && <p className="mt-1 text-[11px] text-foreground-500">{hint}</p>}
    </div>
  );
}

export function JourneyListEditor({
  items,
  onChange,
  title,
  desc,
}: {
  items: JourneyItem[];
  onChange: (v: JourneyItem[]) => void;
  title: string;
  desc: string;
}) {
  const update = (i: number, patch: Partial<JourneyItem>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  return (
    <GroupShell title={title} desc={desc} addLabel="Add milestone" onAdd={() => onChange([...items, { year: "", title: "", desc: "" }])}>
      {items.map((item, i) => (
        <div key={i} className="rounded-lg bg-background-50 border border-background-200 p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <i className="ri-history-line text-primary-600" aria-hidden="true"></i>
              <input value={item.year} onChange={(e) => update(i, { year: e.target.value })} placeholder="2026" className={`${inputCls} w-28`} />
            </span>
            <ItemToolbar index={i} total={items.length} onMove={(dir) => onChange(move(items, i, dir))} onRemove={() => onChange(items.filter((_, idx) => idx !== i))} />
          </div>
          <input value={item.title} onChange={(e) => update(i, { title: e.target.value })} placeholder="Milestone title" className={inputCls} />
          <textarea value={item.desc} onChange={(e) => update(i, { desc: e.target.value })} placeholder="What happened?" rows={2} maxLength={400} className={`${inputCls} resize-none`}></textarea>
        </div>
      ))}
    </GroupShell>
  );
}

export function StringListEditor({
  items,
  onChange,
  title,
  desc,
  placeholder,
  addLabel = "Add item",
}: {
  items: string[];
  onChange: (v: string[]) => void;
  title: string;
  desc: string;
  placeholder?: string;
  addLabel?: string;
}) {
  return (
    <GroupShell title={title} desc={desc} addLabel={addLabel} onAdd={() => onChange([...items, ""])}>
      {items.map((val, i) => (
        <div key={i} className="flex items-center gap-2 rounded-lg bg-background-50 border border-background-200 p-2">
          <input
            value={val}
            onChange={(e) => onChange(items.map((v, idx) => (idx === i ? e.target.value : v)))}
            placeholder={placeholder}
            className={inputCls}
          />
          <ItemToolbar index={i} total={items.length} onMove={(dir) => onChange(move(items, i, dir))} onRemove={() => onChange(items.filter((_, idx) => idx !== i))} />
        </div>
      ))}
    </GroupShell>
  );
}
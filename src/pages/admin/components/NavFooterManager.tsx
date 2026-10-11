import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSiteSettings, type FooterSettings, type NavLink, type NavigationSettings } from "@/hooks/useSiteSettings";
import { Card, Field, inputCls, labelCls, btnGhost, btnPrimary, Spinner } from "./AdminUi";

type Tab = "navigation" | "footer";

function move<T>(arr: T[], from: number, dir: -1 | 1): T[] {
  const to = from + dir;
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function RowToolbar({ index, total, onMove, onRemove }: { index: number; total: number; onMove: (dir: -1 | 1) => void; onRemove: () => void }) {
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

function LinkList({
  items,
  onChange,
  withIcon = true,
  addLabel,
  emptyIcon = "ri-link",
}: {
  items: NavLink[];
  onChange: (v: NavLink[]) => void;
  withIcon?: boolean;
  addLabel: string;
  emptyIcon?: string;
}) {
  const update = (i: number, patch: Partial<NavLink>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex flex-wrap sm:flex-nowrap items-center gap-2 rounded-lg bg-background-100 border border-background-200 p-2">
          {withIcon && (
            <span className="w-9 h-9 rounded-lg bg-background-50 border border-background-200 flex items-center justify-center shrink-0">
              <i className={item.icon || emptyIcon} aria-hidden="true"></i>
            </span>
          )}
          <input value={item.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="Label" className={`${inputCls} sm:w-44`} />
          <input value={item.href} onChange={(e) => update(i, { href: e.target.value })} placeholder="/page or https://…" className={`${inputCls} flex-1 min-w-[140px]`} />
          {withIcon && (
            <input value={item.icon} onChange={(e) => update(i, { icon: e.target.value })} placeholder="ri-link" className={`${inputCls} sm:w-36 text-xs`} />
          )}
          <RowToolbar index={i} total={items.length} onMove={(dir) => onChange(move(items, i, dir))} onRemove={() => onChange(items.filter((_, idx) => idx !== i))} />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { label: "", href: "", icon: withIcon ? emptyIcon : "" }])} className={`${btnGhost} px-3 py-2 text-xs`}>
        <i className="ri-add-line" aria-hidden="true"></i> {addLabel}
      </button>
    </div>
  );
}

export default function NavFooterManager() {
  const { settings, loading, reload } = useSiteSettings();
  const [tab, setTab] = useState<Tab>("navigation");
  const [nav, setNav] = useState<NavigationSettings>(settings.navigation);
  const [footer, setFooter] = useState<FooterSettings>(settings.footer);
  const [saving, setSaving] = useState("");
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setNav(settings.navigation);
    setFooter(settings.footer);
  }, [settings]);

  const persist = async (key: string, value: Record<string, unknown>) => {
    if (!supabase) return;
    setSaving(key);
    setSaved("");
    setError("");
    const { error: err } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    setSaving("");
    if (err) {
      setError(err.message);
      return;
    }
    setSaved(key);
    reload();
    setTimeout(() => setSaved(""), 2200);
  };

  if (loading) return <Spinner label="Loading navigation & footer…" />;

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="inline-flex items-center gap-1 p-1 rounded-full bg-background-100 border border-background-200/70">
        <button
          type="button"
          onClick={() => setTab("navigation")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${tab === "navigation" ? "bg-primary-500 text-foreground-50" : "text-foreground-700 hover:text-foreground-950"}`}
        >
          <i className="ri-menu-line" aria-hidden="true"></i> Navigation
        </button>
        <button
          type="button"
          onClick={() => setTab("footer")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${tab === "footer" ? "bg-primary-500 text-foreground-50" : "text-foreground-700 hover:text-foreground-950"}`}
        >
          <i className="ri-layout-bottom-line" aria-hidden="true"></i> Footer
        </button>
      </div>

      {tab === "navigation" ? (
        <Card className="p-5 md:p-6">
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
              <i className="ri-menu-line text-xl" aria-hidden="true"></i>
            </span>
            <div>
              <h3 className="font-heading text-lg text-foreground-950">Top navigation links</h3>
              <p className="text-sm text-foreground-600">The links shown in the site header and mobile menu. Reorder them with the arrows — the live site follows this order.</p>
            </div>
          </div>
          <div className="mt-5">
            <LinkList items={nav.links} onChange={(links) => setNav({ links })} addLabel="Add link" emptyIcon="ri-links-line" />
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button type="button" onClick={() => persist("navigation", { ...nav })} disabled={saving === "navigation"} className={btnPrimary}>
              {saving === "navigation" ? "Saving…" : <><i className="ri-save-line" aria-hidden="true"></i> Save navigation</>}
            </button>
            {saved === "navigation" && <span className="text-xs font-semibold text-accent-700">Saved — live on the site.</span>}
            {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
          </div>
        </Card>
      ) : (
        <div className="space-y-5">
          <Card className="p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-secondary-100 text-secondary-700 flex items-center justify-center shrink-0">
                <i className="ri-text" aria-hidden="true"></i>
              </span>
              <div>
                <h3 className="font-heading text-lg text-foreground-950">Footer intro</h3>
                <p className="text-sm text-foreground-600">The brand line and copyright shown at the bottom of every page.</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              <Field label="Brand tagline">
                <textarea value={footer.tagline} onChange={(e) => setFooter({ ...footer, tagline: e.target.value })} rows={2} maxLength={400} className={`${inputCls} resize-none`}></textarea>
              </Field>
              <Field label="Copyright line">
                <input value={footer.copyright} onChange={(e) => setFooter({ ...footer, copyright: e.target.value })} className={inputCls} />
              </Field>
            </div>
          </Card>

          <Card className="p-5 md:p-6">
            <h3 className="font-heading text-lg text-foreground-950">Explore column</h3>
            <p className="text-sm text-foreground-600">The list of quick links on the left of the footer.</p>
            <div className="mt-4 space-y-4">
              <Field label="Column heading"><input value={footer.exploreTitle} onChange={(e) => setFooter({ ...footer, exploreTitle: e.target.value })} className={inputCls} /></Field>
              <LinkList items={footer.exploreLinks} onChange={(exploreLinks) => setFooter({ ...footer, exploreLinks })} withIcon={false} addLabel="Add link" />
            </div>
          </Card>

          <Card className="p-5 md:p-6">
            <h3 className="font-heading text-lg text-foreground-950">Social links</h3>
            <p className="text-sm text-foreground-600">The social buttons beside the brand. Each needs an icon name (e.g. <span className="font-mono">ri-instagram-line</span>) and a full URL.</p>
            <div className="mt-4">
              <LinkList items={footer.socials} onChange={(socials) => setFooter({ ...footer, socials })} addLabel="Add social link" emptyIcon="ri-share-line" />
            </div>
          </Card>

          <Card className="p-5 md:p-6">
            <h3 className="font-heading text-lg text-foreground-950">Legal links</h3>
            <p className="text-sm text-foreground-600">The row of policy links in the footer's bottom bar.</p>
            <div className="mt-4 space-y-4">
              <Field label="Contact column heading" hint="The “Get in touch” column's details come from Website Settings → Contact details.">
                <input value={footer.contactTitle} onChange={(e) => setFooter({ ...footer, contactTitle: e.target.value })} className={inputCls} />
              </Field>
              <div>
                <label className={labelCls}>Legal links</label>
                <LinkList items={footer.legalLinks} onChange={(legalLinks) => setFooter({ ...footer, legalLinks })} withIcon={false} addLabel="Add legal link" />
              </div>
            </div>
          </Card>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => persist("footer", footer as unknown as Record<string, unknown>)} disabled={saving === "footer"} className={btnPrimary}>
              {saving === "footer" ? "Saving…" : <><i className="ri-save-line" aria-hidden="true"></i> Save footer</>}
            </button>
            {saved === "footer" && <span className="text-xs font-semibold text-accent-700">Saved — live on the site.</span>}
            {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
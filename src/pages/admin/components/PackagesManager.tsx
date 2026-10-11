import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { aed, type PackageRow } from "@/lib/adminTypes";
import { Card, EmptyState, ErrorState, Spinner, StatusPill, Modal, btnPrimary, btnGhost, btnDanger } from "./AdminUi";
import PackageForm from "./PackageForm";

type Filter = "all" | "active" | "inactive" | "featured";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
  { key: "featured", label: "Featured" },
];

export default function PackagesManager() {
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<PackageRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<PackageRow | null>(null);
  const [busyId, setBusyId] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const load = useCallback(async () => {
    if (!supabase) {
      setStatus("error");
      setError("Backend not configured.");
      return;
    }
    setStatus("loading");
    try {
      const { data, error: err } = await supabase
        .from("packages")
        .select("*")
        .order("sort_order", { ascending: true });
      if (err) throw err;
      setPackages((data ?? []) as PackageRow[]);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not load packages.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      packages.filter((p) => {
        if (filter === "active") return p.active;
        if (filter === "inactive") return !p.active;
        if (filter === "featured") return p.featured;
        return true;
      }),
    [packages, filter],
  );

  const counts = useMemo(
    () => ({
      all: packages.length,
      active: packages.filter((p) => p.active).length,
      inactive: packages.filter((p) => !p.active).length,
      featured: packages.filter((p) => p.featured).length,
    }),
    [packages],
  );

  const toggleActive = async (p: PackageRow) => {
    if (!supabase) return;
    setBusyId(p.id);
    const { error: err } = await supabase.from("packages").update({ active: !p.active }).eq("id", p.id);
    setBusyId("");
    if (!err) setPackages((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x)));
  };

  const toggleFeatured = async (p: PackageRow) => {
    if (!supabase) return;
    setBusyId(p.id);
    const { error: err } = await supabase.from("packages").update({ featured: !p.featured }).eq("id", p.id);
    setBusyId("");
    if (!err) setPackages((prev) => prev.map((x) => (x.id === p.id ? { ...x, featured: !x.featured } : x)));
  };

  // Reorder the whole list (only meaningful in the "all" view) and persist the
  // new sort_order for every row so the live site follows the same order.
  const reorder = async (index: number, dir: -1 | 1) => {
    if (!supabase) return;
    const to = index + dir;
    if (to < 0 || to >= packages.length) return;
    const next = [...packages];
    const [item] = next.splice(index, 1);
    next.splice(to, 0, item);
    const renumbered = next.map((p, i) => ({ ...p, sort_order: (i + 1) * 10 }));
    setPackages(renumbered);
    setBusyId(item.id);
    try {
      await Promise.all(
        renumbered.map((p) =>
          supabase.from("packages").update({ sort_order: p.sort_order }).eq("id", p.id),
        ),
      );
    } finally {
      setBusyId("");
    }
  };

  const doDelete = async () => {
    if (!supabase || !confirmDelete) return;
    setBusyId(confirmDelete.id);
    const { error: err } = await supabase.from("packages").delete().eq("id", confirmDelete.id);
    setBusyId("");
    if (!err) {
      setPackages((prev) => prev.filter((x) => x.id !== confirmDelete.id));
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap cursor-pointer ${filter === f.key ? "bg-primary-500 text-foreground-50 border-primary-500" : "bg-background-50 text-foreground-700 border-background-200 hover:border-primary-300"}`}
              >
                {f.label} ({counts[f.key]})
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setCreating(true)} className={btnPrimary}>
            <i className="ri-add-line" aria-hidden="true"></i> Add package
          </button>
        </div>
        {filter === "all" && packages.length > 1 && (
          <p className="mt-3 text-[11px] text-foreground-500">Use the arrows to reorder — the site follows this order.</p>
        )}
      </Card>

      <Card>
        {status === "loading" && <Spinner label="Loading packages…" />}
        {status === "error" && <ErrorState text={error} onRetry={load} />}
        {status === "ready" && filtered.length === 0 && (
          <EmptyState icon="ri-gift-line" title="No packages yet" text="Add your first grooming package to get started." />
        )}
        {status === "ready" && filtered.length > 0 && (
          <ul className="divide-y divide-background-200/70">
            {filtered.map((p) => {
              const fullIndex = packages.findIndex((x) => x.id === p.id);
              return (
                <li key={p.id} className="px-4 md:px-5 py-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-background-100 shrink-0 flex items-center justify-center">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <i className="ri-gift-line text-xl text-foreground-400" aria-hidden="true"></i>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground-950">{p.name}</span>
                        {p.featured && <StatusPill label="Featured" tone="ok" icon="ri-star-fill" />}
                        {p.active ? <StatusPill label="Active" tone="info" /> : <StatusPill label="Inactive" tone="bad" />}
                      </div>
                      <p className="mt-1 text-sm text-foreground-700">
                        {p.discounted_price != null && Number(p.discounted_price) > 0 ? (
                          <>
                            <span className="line-through text-foreground-400 mr-1.5">{aed(p.original_price)}</span>
                            <span className="font-semibold text-foreground-950">{aed(p.discounted_price)}</span>
                          </>
                        ) : (
                          aed(p.original_price)
                        )}
                        {p.pet_type ? ` · ${p.pet_type}` : ""}
                        {p.duration ? ` · ${p.duration}` : ""}
                        {p.treatments?.length ? ` · ${p.treatments.length} treatments` : ""}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {filter === "all" && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={fullIndex === 0 || busyId === p.id}
                            onClick={() => reorder(fullIndex, -1)}
                            aria-label="Move up"
                            className="w-9 h-9 rounded-lg bg-background-100 border border-background-200 text-foreground-700 disabled:opacity-40 cursor-pointer flex items-center justify-center"
                          >
                            <i className="ri-arrow-up-line" aria-hidden="true"></i>
                          </button>
                          <button
                            type="button"
                            disabled={fullIndex === packages.length - 1 || busyId === p.id}
                            onClick={() => reorder(fullIndex, 1)}
                            aria-label="Move down"
                            className="w-9 h-9 rounded-lg bg-background-100 border border-background-200 text-foreground-700 disabled:opacity-40 cursor-pointer flex items-center justify-center"
                          >
                            <i className="ri-arrow-down-line" aria-hidden="true"></i>
                          </button>
                        </div>
                      )}
                      <button type="button" onClick={() => toggleFeatured(p)} disabled={busyId === p.id} className={btnGhost} title="Toggle featured">
                        <i className={p.featured ? "ri-star-fill text-accent-500" : "ri-star-line"} aria-hidden="true"></i>
                        <span className="hidden lg:inline">{p.featured ? "Featured" : "Feature"}</span>
                      </button>
                      <button type="button" onClick={() => toggleActive(p)} disabled={busyId === p.id} className={btnGhost}>
                        <i className={p.active ? "ri-eye-off-line" : "ri-eye-line"} aria-hidden="true"></i>
                        <span className="hidden lg:inline">{p.active ? "Deactivate" : "Activate"}</span>
                      </button>
                      <button type="button" onClick={() => setEditing(p)} className={btnGhost}>
                        <i className="ri-edit-line" aria-hidden="true"></i> Edit
                      </button>
                      <button type="button" onClick={() => setConfirmDelete(p)} className={`${btnDanger} px-3`}>
                        <i className="ri-delete-bin-line" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {(creating || editing) && (
        <PackageForm
          pkg={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={load}
        />
      )}

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete package"
        footer={
          <>
            <button type="button" onClick={() => setConfirmDelete(null)} className={btnGhost}>Cancel</button>
            <button type="button" onClick={doDelete} disabled={busyId === confirmDelete?.id} className={btnDanger}>
              <i className="ri-delete-bin-line" aria-hidden="true"></i> Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-foreground-700">
          Delete <strong>{confirmDelete?.name}</strong>? This removes it from the site. This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
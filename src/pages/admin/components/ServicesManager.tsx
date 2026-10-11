import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { aed, type ServiceRow, type SizePriceRow } from "@/lib/adminTypes";
import { Card, EmptyState, ErrorState, Spinner, StatusPill, Modal, btnPrimary, btnGhost, btnDanger } from "./AdminUi";
import ServiceForm from "./ServiceForm";

export default function ServicesManager() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [sizePrices, setSizePrices] = useState<SizePriceRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<ServiceRow | null>(null);
  const [busyId, setBusyId] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");

  const load = useCallback(async () => {
    if (!supabase) {
      setStatus("error");
      setError("Backend not configured.");
      return;
    }
    setStatus("loading");
    try {
      const [svcRes, sizeRes] = await Promise.all([
        supabase.from("services").select("*").order("sort_order", { ascending: true }),
        supabase.from("service_size_prices").select("id, service_id, size, price_aed"),
      ]);
      if (svcRes.error) throw svcRes.error;
      setServices((svcRes.data ?? []) as ServiceRow[]);
      setSizePrices((sizeRes.data ?? []) as SizePriceRow[]);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not load services.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(
    () => Array.from(new Set(services.map((s) => s.category))).sort(),
    [services],
  );

  const filtered = useMemo(
    () => services.filter((s) => groupFilter === "all" || s.category === groupFilter),
    [services, groupFilter],
  );

  const sizesFor = (id: string) => sizePrices.filter((r) => r.service_id === id);

  const toggleActive = async (s: ServiceRow) => {
    if (!supabase) return;
    setBusyId(s.id);
    const { error: err } = await supabase.from("services").update({ active: !s.active }).eq("id", s.id);
    setBusyId("");
    if (!err) setServices((prev) => prev.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)));
  };

  const doDelete = async () => {
    if (!supabase || !confirmDelete) return;
    setBusyId(confirmDelete.id);
    await supabase.from("service_size_prices").delete().eq("service_id", confirmDelete.id);
    const { error: err } = await supabase.from("services").delete().eq("id", confirmDelete.id);
    setBusyId("");
    if (!err) {
      setServices((prev) => prev.filter((x) => x.id !== confirmDelete.id));
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setGroupFilter("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap cursor-pointer ${groupFilter === "all" ? "bg-primary-500 text-foreground-50 border-primary-500" : "bg-background-50 text-foreground-700 border-background-200 hover:border-primary-300"}`}
            >
              All ({services.length})
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setGroupFilter(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap cursor-pointer capitalize ${groupFilter === c ? "bg-primary-500 text-foreground-50 border-primary-500" : "bg-background-50 text-foreground-700 border-background-200 hover:border-primary-300"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setCreating(true)} className={btnPrimary}>
            <i className="ri-add-line" aria-hidden="true"></i> Add service
          </button>
        </div>
      </Card>

      <Card>
        {status === "loading" && <Spinner label="Loading services…" />}
        {status === "error" && <ErrorState text={error} onRetry={load} />}
        {status === "ready" && filtered.length === 0 && <EmptyState icon="ri-scissors-cut-line" title="No services yet" text="Add your first service to get started." />}
        {status === "ready" && filtered.length > 0 && (
          <ul className="divide-y divide-background-200/70">
            {filtered.map((s) => {
              const sizes = sizesFor(s.id);
              return (
                <li key={s.id} className="px-4 md:px-5 py-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground-950">{s.name}</span>
                        <StatusPill label={s.category} tone="neut" />
                        <StatusPill label={s.pet_type ?? "all"} tone="info" />
                        {s.active ? <StatusPill label="Active" tone="ok" /> : <StatusPill label="Inactive" tone="bad" />}
                      </div>
                      <p className="mt-1 text-sm text-foreground-700">
                        {aed(s.price_aed)}
                        {s.duration ? ` · ${s.duration}` : ""}
                        {sizes.length ? ` · sizes: ${sizes.map((r) => `${r.size} ${aed(r.price_aed)}`).join(", ")}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => toggleActive(s)} disabled={busyId === s.id} className={btnGhost}>
                        <i className={s.active ? "ri-eye-off-line" : "ri-eye-line"} aria-hidden="true"></i>
                        {s.active ? "Deactivate" : "Activate"}
                      </button>
                      <button type="button" onClick={() => setEditing(s)} className={btnGhost}>
                        <i className="ri-edit-line" aria-hidden="true"></i> Edit
                      </button>
                      <button type="button" onClick={() => setConfirmDelete(s)} className={`${btnDanger} px-3`}>
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
        <ServiceForm
          service={editing}
          initialSizePrices={editing ? sizesFor(editing.id) : []}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={load}
        />
      )}

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete service"
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
          Delete <strong>{confirmDelete?.name}</strong>? This removes it from the site and booking form. This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
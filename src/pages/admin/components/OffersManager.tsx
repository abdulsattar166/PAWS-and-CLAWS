import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { aed, formatDateOnly, type OfferRow, type ServiceRow } from "@/lib/adminTypes";
import { isOfferLive } from "@/lib/discounts";
import { Card, EmptyState, ErrorState, Spinner, StatusPill, Modal, btnPrimary, btnGhost, btnDanger } from "./AdminUi";
import OfferForm from "./OfferForm";

export default function OffersManager() {
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<OfferRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<OfferRow | null>(null);
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    if (!supabase) {
      setStatus("error");
      setError("Backend not configured.");
      return;
    }
    setStatus("loading");
    try {
      const [offerRes, svcRes] = await Promise.all([
        supabase.from("offers").select("*").order("created_at", { ascending: false }),
        supabase.from("services").select("*").order("name", { ascending: true }),
      ]);
      if (offerRes.error) throw offerRes.error;
      setOffers((offerRes.data ?? []) as OfferRow[]);
      setServices((svcRes.data ?? []) as ServiceRow[]);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not load offers.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleActive = async (o: OfferRow) => {
    if (!supabase) return;
    setBusyId(o.id);
    const { error: err } = await supabase.from("offers").update({ active: !o.active }).eq("id", o.id);
    setBusyId("");
    if (!err) setOffers((prev) => prev.map((x) => (x.id === o.id ? { ...x, active: !x.active } : x)));
  };

  const doDelete = async () => {
    if (!supabase || !confirmDelete) return;
    setBusyId(confirmDelete.id);
    const { error: err } = await supabase.from("offers").delete().eq("id", confirmDelete.id);
    setBusyId("");
    if (!err) {
      setOffers((prev) => prev.filter((x) => x.id !== confirmDelete.id));
      setConfirmDelete(null);
    }
  };

  const scopeLabel = (o: OfferRow) => {
    const ids = o.service_ids ?? [];
    return ids.length === 0
      ? "All services"
      : `${ids.length} service${ids.length > 1 ? "s" : ""}`;
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-5 flex items-center justify-between gap-3">
        <p className="text-sm text-foreground-700">Create promotions, apply discounts and show banners across the site.</p>
        <button type="button" onClick={() => setCreating(true)} className={btnPrimary}>
          <i className="ri-add-line" aria-hidden="true"></i> New offer
        </button>
      </Card>

      <Card>
        {status === "loading" && <Spinner label="Loading offers…" />}
        {status === "error" && <ErrorState text={error} onRetry={load} />}
        {status === "ready" && offers.length === 0 && <EmptyState icon="ri-price-tag-3-line" title="No offers yet" text="Create a promotion to attract more bookings." />}
        {status === "ready" && offers.length > 0 && (
          <ul className="divide-y divide-background-200/70">
            {offers.map((o) => {
              const live = isOfferLive(o);
              return (
                <li key={o.id} className="px-4 md:px-5 py-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground-950">{o.title}</span>
                        <StatusPill
                          label={o.discount_type === "percent" ? `${o.discount_value}% off` : `${aed(o.discount_value)} off`}
                          tone="ok"
                          icon="ri-price-tag-3-line"
                        />
                        {live ? <StatusPill label="Live now" tone="info" /> : <StatusPill label={o.active ? "Scheduled" : "Inactive"} tone="neut" />}
                      </div>
                      <p className="mt-1 text-sm text-foreground-700">
                        {scopeLabel(o)}
                        {o.promo_code ? ` · code ${o.promo_code}` : ""}
                        {o.ends_at ? ` · expires ${formatDateOnly(o.ends_at.slice(0, 10))}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => toggleActive(o)} disabled={busyId === o.id} className={btnGhost}>
                        <i className={o.active ? "ri-eye-off-line" : "ri-eye-line"} aria-hidden="true"></i>
                        {o.active ? "Disable" : "Enable"}
                      </button>
                      <button type="button" onClick={() => setEditing(o)} className={btnGhost}>
                        <i className="ri-edit-line" aria-hidden="true"></i> Edit
                      </button>
                      <button type="button" onClick={() => setConfirmDelete(o)} className={`${btnDanger} px-3`}>
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
        <OfferForm
          offer={editing}
          services={services}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={load}
        />
      )}

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete offer"
        footer={
          <>
            <button type="button" onClick={() => setConfirmDelete(null)} className={btnGhost}>Cancel</button>
            <button type="button" onClick={doDelete} disabled={busyId === confirmDelete?.id} className={btnDanger}>
              <i className="ri-delete-bin-line" aria-hidden="true"></i> Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-foreground-700">Delete <strong>{confirmDelete?.title}</strong>? Discounts will stop applying immediately.</p>
      </Modal>
    </div>
  );
}
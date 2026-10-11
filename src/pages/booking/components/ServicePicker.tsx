import type { ServiceItem } from "@/hooks/useServices";
import { PET_TYPE_ALL, resolveServicePrice, serviceHasSizePricing } from "@/hooks/useServices";
import { PET_TYPE_LABELS } from "@/lib/bookingOptions";

const aed = (n: number) => `AED ${Number(n).toFixed(0)}`;

interface ServicePickerProps {
  services: ServiceItem[];
  petType: string;
  petSize: string;
  selectedIds: string[];
  onToggle: (id: string) => void;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  t: (key: string) => string;
}

interface ServiceCardProps {
  service: ServiceItem;
  petSize: string;
  active: boolean;
  onToggle: (id: string) => void;
}

function ServiceCard({ service, petSize, active, onToggle }: ServiceCardProps) {
  const sized = serviceHasSizePricing(service);
  const price = resolveServicePrice(service, petSize);
  const showFrom = sized && !petSize;
  return (
    <button
      type="button"
      onClick={() => onToggle(service.id)}
      aria-pressed={active}
      className={`flex items-start justify-between gap-3 px-4 py-3 rounded-xl text-left border transition-all duration-300 cursor-pointer ${
        active
          ? "bg-accent-500/15 border-accent-500 text-foreground-950"
          : "bg-background-100 border-background-200/70 text-foreground-700 hover:border-accent-400 hover:text-foreground-950"
      }`}
    >
      <span className="flex items-start gap-2.5 min-w-0">
        <span
          className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
            active ? "bg-accent-500 text-background-950" : "border border-background-300"
          }`}
        >
          {active && <i className="ri-check-line text-[10px]" aria-hidden="true"></i>}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium truncate">{service.name}</span>
          {service.duration && (
            <span className="mt-0.5 flex items-center gap-1 text-[11px] text-foreground-500">
              <i className="ri-time-line" aria-hidden="true"></i>
              {service.duration}
            </span>
          )}
        </span>
      </span>
      <span className="text-sm font-semibold text-foreground-950 whitespace-nowrap">
        {showFrom && <span className="text-[11px] font-normal text-foreground-500">from </span>}
        {aed(price)}
      </span>
    </button>
  );
}

function Group({
  label,
  services,
  petSize,
  selectedIds,
  onToggle,
}: {
  label: string;
  services: ServiceItem[];
  petSize: string;
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  if (services.length === 0) return null;
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-foreground-500 font-semibold mb-2">{label}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {services.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            petSize={petSize}
            active={selectedIds.includes(s.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

export default function ServicePicker({
  services,
  petType,
  petSize,
  selectedIds,
  onToggle,
  loading,
  error,
  onRetry,
  t,
}: ServicePickerProps) {
  if (loading) {
    return (
      <div className="mt-2 flex items-center gap-3 rounded-xl bg-background-100 border border-background-200/70 px-4 py-6">
        <span className="w-5 h-5 rounded-full border-2 border-primary-500/25 border-t-primary-500 animate-spin"></span>
        <span className="text-sm text-foreground-600">{t("booking.services_loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-background-100 border border-background-200/70 px-4 py-4">
        <span className="text-sm text-foreground-600">{t("booking.services_error")}</span>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-500 text-foreground-50 text-xs font-semibold hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
        >
          <i className="ri-refresh-line" aria-hidden="true"></i> {t("booking.retry")}
        </button>
      </div>
    );
  }

  if (!petType) {
    return (
      <div className="mt-2 flex items-center gap-3 rounded-xl bg-background-100 border border-background-200/70 px-4 py-5">
        <i className="ri-arrow-down-circle-line text-accent-500 text-lg" aria-hidden="true"></i>
        <span className="text-sm text-foreground-600">{t("booking.pick_pet_type_first")}</span>
      </div>
    );
  }

  const isOther = petType === "other";
  const core = services.filter((s) => s.pet_type === petType);
  const addons = services.filter((s) => s.pet_type === PET_TYPE_ALL);

  if (core.length === 0 && addons.length === 0) {
    return (
      <div className="mt-2 rounded-xl bg-background-100 border border-background-200/70 px-4 py-5 text-sm text-foreground-600">
        {t("booking.no_services")}
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-4">
      {isOther && (
        <div className="flex items-start gap-3 rounded-xl bg-secondary-50 border border-secondary-200/70 px-4 py-5">
          <i className="ri-customer-service-2-line text-secondary-600 text-lg mt-0.5" aria-hidden="true"></i>
          <div>
            <p className="text-sm font-medium text-secondary-900">{t("booking.other_animals_title")}</p>
            <p className="mt-1 text-xs text-secondary-900/80 leading-relaxed">{t("booking.other_animals_note")}</p>
          </div>
        </div>
      )}
      <Group
        label={`${PET_TYPE_LABELS[petType] ?? ""} · ${t("booking.group_services")}`}
        services={core}
        petSize={petSize}
        selectedIds={selectedIds}
        onToggle={onToggle}
      />
      <Group
        label={t("booking.group_addons")}
        services={addons}
        petSize={petSize}
        selectedIds={selectedIds}
        onToggle={onToggle}
      />
    </div>
  );
}
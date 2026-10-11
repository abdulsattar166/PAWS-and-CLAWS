import type { ServiceItem } from "@/hooks/useServices";
import { resolveServicePrice } from "@/hooks/useServices";
import {
  PET_TYPE_LABELS,
  PET_SIZE_LABELS,
  formatAddress,
  hasLocation,
  mapsLink,
  type AddressFields,
  type LocationInfo,
} from "@/lib/bookingOptions";

const aed = (n: number) => `AED ${Number(n).toFixed(0)}`;

interface BookingSummaryPanelProps {
  services: ServiceItem[];
  petSize: string;
  total: number;
  subtotal?: number;
  discount?: number;
  discountLabel?: string;
  date: string;
  slot: string;
  pet: { name: string; type: string; breed: string; size: string };
  customer: { name: string; email: string; phone: string; whatsapp: string };
  address: AddressFields;
  location?: LocationInfo;
  health: string;
  notes: string;
  onEdit?: (targetId: string) => void;
  t: (key: string) => string;
}

function formatDate(value: string): string {
  if (!value) return "";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <span className="text-xs text-foreground-500 font-medium shrink-0">{label}</span>
      <span className="text-sm text-foreground-950 text-right break-words">{value}</span>
    </div>
  );
}

function Section({
  title,
  icon,
  editId,
  onEdit,
  editLabel,
  children,
}: {
  title: string;
  icon: string;
  editId?: string;
  onEdit?: (targetId: string) => void;
  editLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-background-50 border border-background-200/70 p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-foreground-600 font-semibold">
          <i className={`${icon} text-accent-500`} aria-hidden="true"></i>
          {title}
        </p>
        {editId && onEdit && editLabel && (
          <button
            type="button"
            onClick={() => onEdit(editId)}
            className="inline-flex items-center gap-1 rounded-full border border-background-200/70 bg-background-100 px-2.5 py-1 text-[11px] font-semibold text-foreground-800 hover:border-primary-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-pencil-line" aria-hidden="true"></i>
            {editLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export default function BookingSummaryPanel({
  services,
  petSize,
  total,
  subtotal,
  discount,
  discountLabel,
  date,
  slot,
  pet,
  customer,
  address,
  location,
  health,
  notes,
  onEdit,
  t,
}: BookingSummaryPanelProps) {
  const hasAnything =
    services.length > 0 || Boolean(date) || Boolean(slot) || Boolean(pet.name) || Boolean(customer.name);
  if (!hasAnything) return null;

  const shared = location ? hasLocation(location) : false;

  return (
    <div className="rounded-2xl bg-background-100 border border-background-200/70 p-5 md:p-6">
      <p className="text-sm font-semibold text-foreground-950 flex items-center gap-2 mb-4">
        <i className="ri-file-list-3-line text-accent-500" aria-hidden="true"></i>
        {t("booking.summary_title")}
      </p>

      <div className="space-y-3">
        {/* Pet */}
        {(pet.name || pet.type || pet.breed || pet.size || health) && (
          <Section title={t("booking.summary_pet")} icon="ri-heart-3-line" editId="sec-pet" onEdit={onEdit} editLabel={t("booking.edit")}>
            <Row label={t("booking.pet_name")} value={pet.name} />
            <Row label={t("booking.pet_type")} value={PET_TYPE_LABELS[pet.type] ?? pet.type} />
            <Row label={t("booking.pet_breed")} value={pet.breed} />
            <Row label={t("booking.pet_size")} value={PET_SIZE_LABELS[pet.size] ?? pet.size} />
          </Section>
        )}

        {/* Services + totals */}
        {services.length > 0 && (
          <Section title={t("booking.summary_services")} icon="ri-scissors-cut-line" editId="sec-services" onEdit={onEdit} editLabel={t("booking.edit")}>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-4">
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground-950">{s.name}</span>
                    {s.duration && (
                      <span className="mt-0.5 flex items-center gap-1 text-[11px] text-foreground-500">
                        <i className="ri-time-line" aria-hidden="true"></i>
                        {s.duration}
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-semibold text-foreground-950 whitespace-nowrap">
                    {aed(resolveServicePrice(s, petSize))}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-background-200/70 space-y-1.5">
              {typeof discount === "number" && discount > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground-600">{t("booking.summary_subtotal")}</span>
                    <span className="text-sm text-foreground-700">{aed(subtotal ?? total)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-accent-700">{discountLabel || t("booking.summary_discount")}</span>
                    <span className="text-sm font-semibold text-accent-700">- {aed(discount)}</span>
                  </div>
                </>
              ) : null}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground-950">{t("booking.final_total")}</span>
                <span className="font-heading text-lg text-foreground-950">{aed(total)}</span>
              </div>
            </div>
          </Section>
        )}

        {/* Appointment */}
        {(date || slot) && (
          <Section title={t("booking.summary_appointment")} icon="ri-calendar-line" editId="sec-arrival" onEdit={onEdit} editLabel={t("booking.edit")}>
            <Row label={t("booking.preferred_date")} value={formatDate(date)} />
            <Row label={t("booking.preferred_time")} value={slot} />
          </Section>
        )}

        {/* Customer */}
        {(customer.name || customer.email || customer.phone || customer.whatsapp) && (
          <Section title={t("booking.summary_customer")} icon="ri-user-line" editId="sec-info" onEdit={onEdit} editLabel={t("booking.edit")}>
            <Row label={t("booking.your_name")} value={customer.name} />
            <Row label={t("booking.your_email")} value={customer.email} />
            <Row label={t("booking.your_phone")} value={customer.phone} />
            <Row label={t("booking.summary_whatsapp")} value={customer.whatsapp} />
          </Section>
        )}

        {/* Service location */}
        <Section title={t("booking.summary_location")} icon="ri-map-pin-line" editId="sec-location" onEdit={onEdit} editLabel={t("booking.edit")}>
          <div className="flex items-start gap-2 rounded-lg bg-secondary-50 border border-secondary-200/60 px-3 py-2 mb-2">
            <i className="ri-truck-line text-secondary-600 text-sm mt-0.5" aria-hidden="true"></i>
            <p className="text-[11px] text-secondary-900/85 leading-relaxed">{t("booking.location_note")}</p>
          </div>
          <Row label={t("booking.addr_house")} value={address.house_number} />
          <Row label={t("booking.addr_street_no")} value={address.street_number} />
          <Row label={t("booking.addr_street_name")} value={address.street_name} />
          <Row label={t("booking.addr_area")} value={address.area} />
          <Row label={t("booking.addr_city")} value={address.city} />
          <Row label={t("booking.addr_province")} value={address.province} />
          <Row label={t("booking.addr_country")} value={address.country} />
          <Row label={t("booking.addr_postal")} value={address.postal_code} />
          <Row label={t("booking.summary_landmark")} value={address.landmark} />
          {shared && location ? (
            <div className="flex items-start justify-between gap-4 py-1">
              <span className="text-xs text-foreground-500 font-medium shrink-0">{t("booking.summary_live_location")}</span>
              <a
                href={mapsLink(location.lat as number, location.lng as number)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 underline underline-offset-4 cursor-pointer break-words text-right"
              >
                <i className="ri-map-pin-2-fill" aria-hidden="true"></i>
                {location.lat?.toFixed(5)}, {location.lng?.toFixed(5)}
              </a>
            </div>
          ) : (
            <Row label={t("booking.summary_live_location")} value={t("booking.summary_live_none")} />
          )}
          <Row label={t("booking.summary_notes")} value={notes} />
          {!formatAddress(address) && (
            <p className="text-xs text-foreground-500 italic">{t("booking.location_empty")}</p>
          )}
        </Section>

        {/* Health */}
        {health && (
          <Section title={t("booking.sec_health_title")} icon="ri-first-aid-kit-line" editId="sec-health" onEdit={onEdit} editLabel={t("booking.edit")}>
            <Row label={t("booking.summary_health")} value={health} />
          </Section>
        )}
      </div>
    </div>
  );
}
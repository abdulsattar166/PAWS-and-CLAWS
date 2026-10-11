/* eslint-disable react-refresh/only-export-components */
import { useTranslation } from "react-i18next";
import { PET_TYPE_LABELS, PET_SIZE_LABELS } from "@/lib/bookingOptions";
import { buildBookingIcs, downloadIcs, type CalendarEvent } from "@/lib/calendar";

export interface ReceiptBooking {
  ref: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  petName: string | null;
  petType?: string | null;
  petBreed?: string | null;
  petSize?: string | null;
  address?: string | null;
  date: string;
  timeSlot: string;
  services: Array<{ name: string; price: number }>;
  amount: number;
  currency: string;
  createdAt?: string | null;
  adminNote?: string | null;
  paymentStatus?: string | null;
  bookingStatus?: string | null;
  paymentScreenshotUrl?: string | null;
}

interface BookingReceiptProps {
  booking: ReceiptBooking;
  title: string;
  message: string;
  badgeIcon: string;
  badgeClass: string;
  showEmailNote?: boolean;
}

function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  if (!match) return value;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function petSummaryLine(booking: ReceiptBooking): string {
  return [
    booking.petName,
    PET_TYPE_LABELS[booking.petType ?? ""] ?? booking.petType,
    booking.petBreed,
    PET_SIZE_LABELS[booking.petSize ?? ""] ?? booking.petSize,
  ]
    .filter(Boolean)
    .join(" · ");
}

/** The printable receipt card (shared by the success page and the lookup page). */
export default function BookingReceipt({
  booking,
  title,
  message,
  badgeIcon,
  badgeClass,
  showEmailNote = false,
}: BookingReceiptProps) {
  const { t } = useTranslation();

  const createdAtLabel = booking.createdAt ? formatDate(booking.createdAt.slice(0, 10)) : "";
  const rows: Array<[string, string]> = [
    ...(createdAtLabel
      ? ([[t("find_booking.booking_date"), createdAtLabel]] as Array<[string, string]>)
      : []),
    [t("booking_success.ref"), booking.ref],
    [t("booking_success.service"), (booking.services ?? []).map((s) => s.name).join(", ") || "-"],
    [t("booking_success.date"), formatDate(booking.date)],
    [t("booking_success.time"), booking.timeSlot],
    [t("booking_success.customer"), booking.customerName],
    [t("booking_success.email"), booking.customerEmail ?? "-"],
    [t("booking_success.pet"), petSummaryLine(booking) || "-"],
    [t("booking_success.total"), `AED ${Number(booking.amount).toFixed(0)}`],
  ];

  return (
    <div id="booking-receipt" className="rounded-3xl bg-background-100 border border-background-200/70 p-8 md:p-10">
      <p className="print-only text-center text-xs uppercase tracking-[0.2em] text-foreground-600 mb-6">
        Paws and Claws Pets Grooming Salon LLC
      </p>
      <span className={`mx-auto w-16 h-16 rounded-full ${badgeClass} flex items-center justify-center`}>
        <i className={`${badgeIcon} text-3xl`} aria-hidden="true"></i>
      </span>
      <h1 className="mt-6 font-heading text-3xl md:text-4xl text-foreground-950">{title}</h1>
      <p className="mt-3 text-foreground-700">{message}</p>

      <dl className="mt-8 text-left divide-y divide-background-200/70">
        {rows.map(([label, value], i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-3">
            <dt className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold">{label}</dt>
            <dd className="text-sm text-foreground-950 font-medium text-right">{value}</dd>
          </div>
        ))}
      </dl>

      {booking.adminNote && (
        <div className="mt-6 rounded-2xl bg-secondary-50 border border-secondary-200/60 p-4 text-left">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-secondary-900 font-semibold">
            <i className="ri-megaphone-line" aria-hidden="true"></i>
            {t("find_booking.admin_update")}
          </p>
          <p className="mt-2 text-sm text-foreground-900 leading-relaxed">{booking.adminNote}</p>
        </div>
      )}

      {showEmailNote && <p className="mt-6 text-xs text-foreground-500">{t("booking_success.email_note")}</p>}
    </div>
  );
}

/** One-tap "Add to calendar (.ics)" button for a booking. */
export function AddToCalendarButton({
  booking,
  className,
}: {
  booking: ReceiptBooking;
  className?: string;
}) {
  const { t } = useTranslation();

  const handleClick = () => {
    const event: CalendarEvent = {
      ref: booking.ref,
      date: booking.date,
      timeSlot: booking.timeSlot,
      title: t("booking.calendar_title"),
      location: booking.address || t("booking.calendar_location"),
      descriptionLines: [
        `${t("booking_success.ref")}: ${booking.ref}`,
        `${t("booking_success.service")}: ${(booking.services ?? []).map((s) => s.name).join(", ") || "-"}`,
        `${t("booking_success.pet")}: ${petSummaryLine(booking) || "-"}`,
        `${t("booking_success.total")}: AED ${Number(booking.amount).toFixed(0)}`,
      ],
    };
    const content = buildBookingIcs(event);
    downloadIcs(`booking-${booking.ref}.ics`, content);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ??
        "inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background-100 border border-background-200/70 text-foreground-950 text-sm font-semibold hover:border-primary-300 transition-colors whitespace-nowrap cursor-pointer"
      }
    >
      <i className="ri-calendar-event-line" aria-hidden="true"></i>
      {t("booking.add_to_calendar")}
    </button>
  );
}
import { useTranslation } from "react-i18next";

interface StatusTimelineProps {
  status: string;
  paymentStatus: string;
}

const STEPS = [
  { key: "pending", icon: "ri-time-line" },
  { key: "payment_verified", icon: "ri-checkbox-circle-line" },
  { key: "approved", icon: "ri-shield-check-line" },
  { key: "in_progress", icon: "ri-scissors-line" },
  { key: "completed", icon: "ri-flag-line" },
] as const;

/** Maps the booking + payment status onto the 0-4 timeline position. */
function computeStep(status: string, paymentStatus: string): number {
  if (status === "completed") return 4;
  if (status === "in_progress") return 3;
  if (status === "confirmed" || status === "approved") return 2;
  if (paymentStatus === "paid" || paymentStatus === "verified") return 1;
  return 0;
}

export default function StatusTimeline({ status, paymentStatus }: StatusTimelineProps) {
  const { t } = useTranslation();
  const current = computeStep(status, paymentStatus);
  const isCancelled = status === "cancelled";
  const isRejected = status === "rejected" || status === "payment_failed";

  return (
    <div className="rounded-3xl bg-background-100 border border-background-200/70 p-6 md:p-8 text-left">
      <p className="text-xs uppercase tracking-[0.2em] text-foreground-500 font-semibold">
        {t("find_booking.timeline_title")}
      </p>

      <ol className="mt-6 flex flex-col md:flex-row md:items-start">
        {STEPS.map((step, i) => {
          const done = i < current;
          const active = i === current && !isCancelled && !isRejected;
          const circleCls = done
            ? "bg-accent-500 text-background-950 border-accent-500"
            : active
              ? "bg-primary-500 text-foreground-50 border-primary-500"
              : "bg-background-50 text-foreground-400 border-background-300";
          const labelCls = done
            ? "text-foreground-950"
            : active
              ? "text-primary-600"
              : "text-foreground-500";
          return (
            <li
              key={step.key}
              className="relative flex items-start gap-4 pb-8 last:pb-0 md:flex-1 md:flex-col md:items-center md:gap-3 md:pb-0"
            >
              {/* vertical connector (mobile) */}
              {i < STEPS.length - 1 && (
                <span
                  className={`md:hidden absolute left-5 top-10 bottom-0 w-0.5 ${done ? "bg-accent-500" : "bg-background-300"}`}
                  aria-hidden="true"
                ></span>
              )}
              {/* horizontal connector (desktop) */}
              {i < STEPS.length - 1 && (
                <span
                  className={`hidden md:block absolute top-5 left-1/2 w-full h-0.5 ${done ? "bg-accent-500" : "bg-background-300"}`}
                  aria-hidden="true"
                ></span>
              )}

              <span
                className={`relative z-10 shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${circleCls} ${active ? "animate-pulse" : ""}`}
              >
                <i className={`${step.icon} text-lg`} aria-hidden="true"></i>
              </span>

              <div className="md:w-full md:text-center pt-1.5 md:pt-0">
                <p className={`text-sm font-semibold ${labelCls}`}>{t(`find_booking.timeline_${step.key}`)}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {(isCancelled || isRejected) && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200/70 p-4">
          <span className="shrink-0 w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <i className={isRejected ? "ri-error-warning-line" : "ri-close-line"} aria-hidden="true"></i>
          </span>
          <div>
            <p className="text-sm font-semibold text-red-700">
              {isRejected ? t("find_booking.timeline_rejected_note") : t("find_booking.timeline_cancelled_note")}
            </p>
            <p className="mt-1 text-xs text-foreground-600">{t("find_booking.timeline_contact")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
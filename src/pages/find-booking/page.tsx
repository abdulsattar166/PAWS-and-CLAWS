import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import PageTransition from "@/components/base/PageTransition";
import { functionsBaseUrl, supabaseAnonKey } from "@/lib/supabase";
import { whatsappLink } from "@/lib/businessConfig";
import {
  buildWhatsAppSupportMessage,
  buildWhatsAppTrackMessage,
} from "@/lib/bookingMessage";
import BookingReceipt, {
  AddToCalendarButton,
  petSummaryLine,
  type ReceiptBooking,
} from "@/pages/booking/components/BookingReceipt";
import StatusTimeline from "@/pages/find-booking/components/StatusTimeline";

interface LookupResult {
  status: string;
  paymentStatus: string;
  booking: ReceiptBooking;
}

interface LookupResponse {
  ok?: boolean;
  status?: string;
  paymentStatus?: string;
  booking?: ReceiptBooking;
  error?: string;
}

type State = "idle" | "loading" | "found" | "notfound" | "verify_error" | "error";

function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  if (!match) return value;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const aed = (n: number) => `AED ${Number(n).toFixed(0)}`;

export default function FindBooking() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [ref, setRef] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);

  const statusMeta = (status: string, paymentStatus: string) => {
    if (status === "completed") {
      return { label: t("find_booking.status_completed"), icon: "ri-flag-line", cls: "bg-accent-500 text-background-950" };
    }
    if (status === "in_progress") {
      return { label: t("find_booking.status_in_progress"), icon: "ri-scissors-line", cls: "bg-primary-500 text-foreground-50" };
    }
    if (status === "cancelled") {
      return { label: t("find_booking.status_cancelled"), icon: "ri-close-line", cls: "bg-secondary-500 text-white" };
    }
    if (status === "rejected" || status === "payment_failed") {
      return { label: t("find_booking.booking_rejected"), icon: "ri-error-warning-line", cls: "bg-red-100 text-red-700" };
    }
    if (paymentStatus === "failed") {
      return { label: t("find_booking.payment_rejected"), icon: "ri-close-circle-line", cls: "bg-red-100 text-red-700" };
    }
    if (status === "confirmed") {
      return { label: t("find_booking.booking_approved"), icon: "ri-shield-check-line", cls: "bg-accent-500 text-background-950" };
    }
    if (paymentStatus === "paid") {
      return { label: t("find_booking.payment_verified"), icon: "ri-checkbox-circle-line", cls: "bg-accent-500 text-background-950" };
    }
    return { label: t("find_booking.status_review"), icon: "ri-time-line", cls: "bg-secondary-500 text-white" };
  };

  const paymentLabel = (p: string) => {
    switch (p) {
      case "paid": return t("find_booking.payment_verified");
      case "under_review": return t("find_booking.status_review");
      case "failed": return t("find_booking.payment_rejected");
      case "awaiting_transfer": return t("find_booking.status_awaiting");
      default: return p || "-";
    }
  };

  const bookingLabel = (s: string) => {
    switch (s) {
      case "confirmed": return t("find_booking.booking_approved");
      case "in_progress": return t("find_booking.status_in_progress");
      case "completed": return t("find_booking.status_completed");
      case "cancelled": return t("find_booking.status_cancelled");
      case "rejected": return t("find_booking.booking_rejected");
      case "payment_failed": return t("find_booking.payment_rejected");
      default: return t("find_booking.status_review");
    }
  };

  const runLookup = async (value: string, phoneValue: string) => {
    if (!value || !phoneValue) {
      setState("error");
      setErrorMsg(t("find_booking.empty_ref"));
      return;
    }

    setState("loading");
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch(`${functionsBaseUrl}/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ bookingRef: value, phone: phoneValue }),
      });

      let data: LookupResponse = {};
      try {
        data = (await res.json()) as LookupResponse;
      } catch {
        data = {};
      }

      if (res.ok && data.ok && data.booking) {
        setResult({
          status: data.status ?? "",
          paymentStatus: data.paymentStatus ?? "",
          booking: data.booking,
        });
        setState("found");
        return;
      }

      if (res.status === 404 || data.error === "not_found") {
        setState("notfound");
        return;
      }

      if (data.error === "verify_failed" || res.status === 403) {
        setState("verify_error");
        return;
      }

      setState("error");
      setErrorMsg(t("find_booking.error"));
    } catch {
      setState("error");
      setErrorMsg(t("find_booking.error"));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "loading") return;
    runLookup(ref.trim(), phone.trim());
  };

  // Pre-fill the reference when arriving from the success page. The customer
  // still has to confirm their phone number before details are shown.
  useEffect(() => {
    const initial = searchParams.get("ref");
    if (initial && initial.trim()) setRef(initial.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200/70 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all duration-300";

  return (
    <main className="min-h-screen bg-transparent text-foreground-950">
      <Navbar />
      <PageTransition>
        <section className="pt-28 md:pt-36 pb-20 md:pb-28 px-4 md:px-10 bg-background-50/92 min-h-[80vh]">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
                <span className="w-8 h-px bg-primary-500"></span>
                {t("find_booking.label")}
              </p>
              <h1 className="mt-4 font-heading text-4xl md:text-5xl text-foreground-950 leading-tight">
                {t("booking.track_spa_booking")}
              </h1>
              <p className="mt-4 text-foreground-700 leading-relaxed">{t("booking.track_spa_hint")}</p>
            </div>

            {/* Lookup form */}
            <form onSubmit={handleSubmit} className="mt-8 rounded-3xl bg-background-100 border border-background-200/70 p-6 md:p-8 space-y-4">
              <div>
                <label htmlFor="fb-ref" className="text-sm font-medium text-foreground-700">
                  {t("find_booking.ref_label")}
                </label>
                <div className="mt-1.5 relative">
                  <i className="ri-hashtag absolute left-4 top-1/2 -translate-y-1/2 text-foreground-500 text-base" aria-hidden="true"></i>
                  <input
                    id="fb-ref"
                    name="reference"
                    type="text"
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    placeholder={t("find_booking.ref_placeholder")}
                    autoComplete="off"
                    spellCheck={false}
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="fb-phone" className="text-sm font-medium text-foreground-700">
                  {t("find_booking.phone_label")}
                </label>
                <div className="mt-1.5 relative">
                  <i className="ri-phone-line absolute left-4 top-1/2 -translate-y-1/2 text-foreground-500 text-base" aria-hidden="true"></i>
                  <input
                    id="fb-phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("find_booking.phone_placeholder")}
                    autoComplete="off"
                    className={`${inputClass} pl-11`}
                  />
                </div>
                <p className="mt-1.5 text-xs text-foreground-500">{t("find_booking.verify_hint")}</p>
              </div>

              <button
                type="submit"
                disabled={state === "loading"}
                className="btn-pulse w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary-500 text-foreground-50 text-sm font-semibold hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
              >
                <i className="ri-search-line" aria-hidden="true"></i>
                {state === "loading" ? t("find_booking.searching") : t("booking.track_spa_booking")}
              </button>
            </form>

            {/* Results */}
            <div className="mt-8">
              {state === "loading" && (
                <div className="text-center py-8">
                  <span className="mx-auto w-12 h-12 rounded-full border-2 border-primary-500/25 border-t-primary-500 animate-spin block"></span>
                  <p className="mt-4 text-foreground-700 text-sm">{t("find_booking.searching")}</p>
                </div>
              )}

              {state === "notfound" && (
                <div className="rounded-3xl bg-background-100 border border-background-200/70 p-8 text-center">
                  <span className="mx-auto w-14 h-14 rounded-full bg-secondary-500/15 text-secondary-600 flex items-center justify-center">
                    <i className="ri-file-search-line text-2xl" aria-hidden="true"></i>
                  </span>
                  <h2 className="mt-5 font-heading text-2xl text-foreground-950">{t("find_booking.not_found_title")}</h2>
                  <p className="mt-3 text-sm text-foreground-700">{t("find_booking.not_found_text")}</p>
                </div>
              )}

              {state === "verify_error" && (
                <div className="rounded-3xl bg-background-100 border border-red-200/70 p-8 text-center">
                  <span className="mx-auto w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <i className="ri-lock-2-line text-2xl" aria-hidden="true"></i>
                  </span>
                  <h2 className="mt-5 font-heading text-2xl text-foreground-950">{t("find_booking.verify_title")}</h2>
                  <p className="mt-3 text-sm text-foreground-700">{t("find_booking.verify_error")}</p>
                </div>
              )}

              {state === "error" && (
                <div className="rounded-3xl bg-background-100 border border-background-200/70 p-8 text-center">
                  <span className="mx-auto w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <i className="ri-error-warning-line text-2xl" aria-hidden="true"></i>
                  </span>
                  <h2 className="mt-5 font-heading text-2xl text-foreground-950">{t("find_booking.error_title")}</h2>
                  <p className="mt-3 text-sm text-foreground-700">{errorMsg || t("find_booking.error")}</p>
                </div>
              )}

              {state === "found" && result && (
                <div className="text-center">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusMeta(result.status, result.paymentStatus).cls}`}>
                    <i className={statusMeta(result.status, result.paymentStatus).icon} aria-hidden="true"></i>
                    {statusMeta(result.status, result.paymentStatus).label}
                  </span>
                  <p className="mt-3 text-sm text-foreground-600">
                    {formatDate(result.booking.date)} · {result.booking.timeSlot}
                  </p>

                  <div className="mt-6">
                    <StatusTimeline status={result.status} paymentStatus={result.paymentStatus} />
                  </div>

                  {(result.paymentStatus === "under_review" || result.paymentStatus === "submitted") && (
                    <p className="mt-4 flex items-start gap-2 rounded-2xl bg-secondary-50 border border-secondary-200/60 p-4 text-left text-sm text-secondary-900 leading-relaxed">
                      <i className="ri-information-line mt-0.5" aria-hidden="true"></i>
                      <span>{t("find_booking.await_note")}</span>
                    </p>
                  )}
                  {result.paymentStatus === "paid" && result.status !== "confirmed" && result.status !== "completed" && (
                    <p className="mt-4 flex items-start gap-2 rounded-2xl bg-accent-100/70 border border-accent-300/60 p-4 text-left text-sm text-accent-900 leading-relaxed">
                      <i className="ri-checkbox-circle-line mt-0.5" aria-hidden="true"></i>
                      <span>{t("find_booking.verified_wait_note")}</span>
                    </p>
                  )}

                  <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                    <Detail label={t("find_booking.ref_display")} value={result.booking.ref} />
                    <Detail label={t("find_booking.customer_display")} value={result.booking.customerName} />
                    <Detail label={t("find_booking.pet_display")} value={petSummaryLine(result.booking) || "-"} />
                    <Detail label={t("find_booking.services_display")} value={(result.booking.services ?? []).map((s) => s.name).join(", ") || "-"} />
                    <Detail label={t("find_booking.arrival_display")} value={`${formatDate(result.booking.date)} · ${result.booking.timeSlot}`} />
                    <Detail label={t("find_booking.total_display")} value={aed(result.booking.amount)} />
                    <Detail
                      label={t("find_booking.screenshot_display")}
                      value={result.booking.paymentScreenshotUrl ? t("find_booking.screenshot_submitted") : t("find_booking.screenshot_not_submitted")}
                    />
                    <Detail label={t("find_booking.payment_status")} value={paymentLabel(result.paymentStatus)} />
                    <Detail label={t("find_booking.booking_status")} value={bookingLabel(result.status)} />
                  </dl>

                  <div className="mt-6">
                    <BookingReceipt
                      booking={result.booking}
                      title={t("find_booking.result_title")}
                      message={t("find_booking.result_message")}
                      badgeIcon={statusMeta(result.status, result.paymentStatus).icon}
                      badgeClass={statusMeta(result.status, result.paymentStatus).cls}
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="btn-pulse inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-500 text-background-950 text-sm font-semibold hover:bg-accent-400 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-printer-line" aria-hidden="true"></i>
                      {t("find_booking.print")}
                    </button>
                    <AddToCalendarButton booking={result.booking} />
                    <Link
                      to="/booking"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background-100 border border-background-200/70 text-foreground-950 text-sm font-semibold hover:border-primary-300 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-calendar-check-line" aria-hidden="true"></i>
                      {t("nav.book_now")}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Need help + WhatsApp support */}
            <div className="mt-12 rounded-3xl bg-background-100 border border-background-200/70 p-6 md:p-8 text-center">
              <p className="font-heading text-xl text-foreground-950">{t("find_booking.need_help_title")}</p>
              <p className="mt-2 text-sm text-foreground-700 leading-relaxed">{t("find_booking.need_help_text")}</p>
              <a
                href={
                  result
                    ? whatsappLink(
                        buildWhatsAppSupportMessage({
                          ref: result.booking.ref,
                          customerName: result.booking.customerName,
                          services: result.booking.services,
                          amount: result.booking.amount,
                          date: result.booking.date,
                          slot: result.booking.timeSlot,
                          status: statusMeta(result.status, result.paymentStatus).label,
                        }),
                      )
                    : whatsappLink(buildWhatsAppTrackMessage(ref.trim()))
                }
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:brightness-95 transition-all whitespace-nowrap cursor-pointer"
              >
                <i className="ri-whatsapp-line" aria-hidden="true"></i>
                {t("find_booking.contact_wa_cta")}
              </a>
            </div>
          </div>
        </section>
      </PageTransition>
      <Footer />
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background-100 border border-background-200/70 px-4 py-3">
      <dt className="text-[11px] uppercase tracking-[0.14em] text-foreground-500 font-semibold">{label}</dt>
      <dd className="mt-1 text-sm text-foreground-950 break-words">{value}</dd>
    </div>
  );
}
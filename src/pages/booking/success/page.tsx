import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import PageTransition from "@/components/base/PageTransition";
import { functionsBaseUrl, supabaseAnonKey } from "@/lib/supabase";
import BookingReceipt, {
  AddToCalendarButton,
  type ReceiptBooking,
} from "@/pages/booking/components/BookingReceipt";

type State = "loading" | "confirmed" | "pending" | "error";

export default function BookingSuccess() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id") || "";
  const [state, setState] = useState<State>("loading");
  const [booking, setBooking] = useState<ReceiptBooking | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!sessionId) {
        setState("error");
        return;
      }
      try {
        const res = await fetch(`${functionsBaseUrl}/verify-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.ok) {
          setBooking(data.booking as ReceiptBooking);
          setState(data.paymentStatus === "paid" ? "confirmed" : "pending");
        } else {
          setState("error");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-transparent text-foreground-950">
      <Navbar />
      <PageTransition>
        <section className="py-20 md:py-28 px-4 md:px-10 bg-background-50/92 min-h-[70vh]">
          <div className="max-w-2xl mx-auto text-center">
            {state === "loading" && (
              <>
                <span className="mx-auto w-12 h-12 rounded-full border-2 border-primary-500/25 border-t-primary-500 animate-spin block"></span>
                <p className="mt-6 text-foreground-700">{t("booking_success.verifying")}</p>
              </>
            )}

            {state === "confirmed" && booking && (
              <BookingReceipt
                booking={booking}
                title={t("booking_success.title")}
                message={t("booking_success.message")}
                badgeIcon="ri-check-line"
                badgeClass="bg-accent-500 text-background-950"
                showEmailNote
              />
            )}

            {state === "pending" && booking && (
              <div className="rounded-3xl bg-background-100 border border-background-200/70 p-8 md:p-10">
                <span className="mx-auto w-16 h-16 rounded-full bg-secondary-500 text-white flex items-center justify-center">
                  <i className="ri-time-line text-3xl" aria-hidden="true"></i>
                </span>
                <h1 className="mt-6 font-heading text-3xl text-foreground-950">{t("booking_success.pending_title")}</h1>
                <p className="mt-3 text-foreground-700">{t("booking_success.pending_text")}</p>
                <p className="mt-4 text-sm text-foreground-950">
                  {t("booking_success.ref")}: <strong>{booking.ref}</strong>
                </p>
              </div>
            )}

            {state === "error" && (
              <div className="rounded-3xl bg-background-100 border border-background-200/70 p-8 md:p-10">
                <span className="mx-auto w-16 h-16 rounded-full bg-primary-500/10 text-primary-600 flex items-center justify-center">
                  <i className="ri-error-warning-line text-3xl" aria-hidden="true"></i>
                </span>
                <h1 className="mt-6 font-heading text-3xl text-foreground-950">{t("booking_success.error_title")}</h1>
                <p className="mt-3 text-foreground-700">{t("booking_success.error_text")}</p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {state === "confirmed" && booking && (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-pulse inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-500 text-background-950 text-sm font-semibold hover:bg-accent-400 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-printer-line" aria-hidden="true"></i>
                  {t("booking_success.print")}
                </button>
              )}
              {state === "confirmed" && booking && (
                <AddToCalendarButton
                  booking={booking}
                  className="btn-pulse inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background-100 border border-background-200/70 text-foreground-950 text-sm font-semibold hover:border-primary-300 transition-colors whitespace-nowrap cursor-pointer"
                />
              )}
              {state === "confirmed" && booking && (
                <Link
                  to="/find-booking"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background-100 border border-background-200/70 text-foreground-950 text-sm font-semibold hover:border-primary-300 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-search-line" aria-hidden="true"></i>
                  {t("nav.find_booking")}
                </Link>
              )}
              <Link
                to="/"
                className="btn-pulse inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-500 text-foreground-50 text-sm font-semibold hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-home-line" aria-hidden="true"></i>
                {t("booking_success.home")}
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background-100 border border-background-200/70 text-foreground-950 text-sm font-semibold hover:border-primary-300 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-customer-service-2-line" aria-hidden="true"></i>
                {t("booking_success.contact")}
              </Link>
            </div>
          </div>
        </section>
      </PageTransition>
      <Footer />
    </main>
  );
}
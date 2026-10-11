import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import PageTransition from "@/components/base/PageTransition";
import { functionsBaseUrl, supabaseAnonKey } from "@/lib/supabase";

export default function BookingCancelled() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const bookingRef = params.get("ref") || "";

  // Release the reserved slot so someone else can take it.
  useEffect(() => {
    if (!bookingRef) return;
    fetch(`${functionsBaseUrl}/cancel-booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ bookingRef }),
    }).catch(() => {
      /* non-blocking */
    });
  }, [bookingRef]);

  return (
    <main className="min-h-screen bg-transparent text-foreground-950">
      <Navbar />
      <PageTransition>
        <section className="py-20 md:py-28 px-4 md:px-10 bg-background-50/92 min-h-[70vh]">
          <div className="max-w-xl mx-auto text-center">
            <span className="mx-auto w-16 h-16 rounded-full bg-secondary-500/15 text-secondary-600 flex items-center justify-center">
              <i className="ri-close-circle-line text-3xl" aria-hidden="true"></i>
            </span>
            <h1 className="mt-6 font-heading text-3xl md:text-4xl text-foreground-950">{t("booking_cancelled.title")}</h1>
            <p className="mt-3 text-foreground-700">{t("booking_cancelled.text")}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/contact"
                className="btn-pulse inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-500 text-foreground-50 text-sm font-semibold hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-calendar-check-line" aria-hidden="true"></i>
                {t("booking_cancelled.retry")}
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background-100 border border-background-200/70 text-foreground-950 text-sm font-semibold hover:border-primary-300 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-home-line" aria-hidden="true"></i>
                {t("booking_success.home")}
              </Link>
            </div>
          </div>
        </section>
      </PageTransition>
      <Footer />
    </main>
  );
}
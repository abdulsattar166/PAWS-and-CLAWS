import { useTranslation } from "react-i18next";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import PageTransition from "@/components/base/PageTransition";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-transparent text-foreground-950">
      <Navbar />
      <PageTransition>
        {/* Hero */}
        <section className="relative pt-28 pb-16 md:pt-48 md:pb-28 px-4 md:px-10 overflow-hidden bg-background-900">
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-white/70 font-semibold flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-px bg-white/50"></span>
              LEGAL
            </p>
            <h1 className="font-heading text-2xl md:text-5xl text-white leading-tight">{t("privacy_page.title")}</h1>
            <p className="mt-4 text-white/80 text-sm">{t("privacy_page.last_updated")}</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-14 md:py-24 px-4 md:px-10 bg-background-50/92">
          <div className="max-w-3xl mx-auto">
            <p className="text-foreground-700 leading-relaxed">{t("privacy_page.intro")}</p>

            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="mt-10">
                <h2 className="font-heading text-2xl text-foreground-950">{t(`privacy_page.section${n}_title`)}</h2>
                <p className="mt-3 text-foreground-700 leading-relaxed">{t(`privacy_page.section${n}_text`)}</p>
              </div>
            ))}
          </div>
        </section>
      </PageTransition>
      <Footer />
    </main>
  );
}
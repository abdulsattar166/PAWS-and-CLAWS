import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

export default function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const formData = new FormData(e.currentTarget);
      const honeypot = (formData.get("phone_alt") as string || "").trim();
      if (honeypot) {
        setStatus("success");
        setEmail("");
        return;
      }

      if (!supabase) {
        setStatus("error");
        setErrorMsg(t("newsletter.error"));
        return;
      }

      const value = email.trim().toLowerCase();
      const { error } = await supabase.from("newsletter_subscribers").insert({ email: value });

      // A duplicate simply means they are already subscribed — treat as success.
      if (error && error.code !== "23505") {
        setStatus("error");
        setErrorMsg(error.message || t("newsletter.error"));
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg(t("newsletter.error"));
    }
  };

  return (
    <section className="animated-gradient bg-gradient-to-r from-accent-500 via-primary-400 to-accent-500 py-14 md:py-24 px-4 md:px-10 newsletter-section">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-heading text-4xl md:text-5xl text-background-950 leading-tight">
          {t("newsletter.heading")}
        </h2>
        <p className="mt-4 text-background-900 leading-relaxed">
          {t("newsletter.subtitle")}
        </p>

        <form
          onSubmit={handleSubmit}
          data-readdy-form
          className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
        >
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("newsletter.placeholder")}
            required
            className="flex-1 w-full sm:w-auto px-5 py-3.5 rounded-full bg-background-50 text-foreground-950 placeholder:text-foreground-500 text-sm border-none outline-none focus:ring-2 focus:ring-accent-400 transition-shadow duration-300"
          />
          <input
            type="text"
            name="phone_alt"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            readOnly
            className="field-secondary-note"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-pulse sheen w-full sm:w-auto px-8 py-3.5 rounded-full bg-background-900 text-white font-semibold text-sm hover:bg-background-800 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
          >
            {status === "loading" ? "..." : t("newsletter.cta")}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-sm text-background-950 animate-fade-up">{t("newsletter.success")}</p>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-background-950">{errorMsg}</p>
        )}
      </div>
    </section>
  );
}
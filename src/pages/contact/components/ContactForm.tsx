import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface ContactFormProps {
  t: (key: string) => string;
}

export default function ContactForm({ t }: ContactFormProps) {
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");
    setFormError("");

    try {
      const fd = new FormData(e.currentTarget);
      const honeypot = (fd.get("phone_alt") as string || "").trim();
      if (honeypot) {
        setFormStatus("success");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        return;
      }

      if (!supabase) {
        setFormStatus("error");
        setFormError(t("contact_page.error"));
        return;
      }

      const { error } = await supabase.from("contact_messages").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        subject: formData.subject.trim() || null,
        message: formData.message.trim(),
      });

      if (error) {
        setFormStatus("error");
        setFormError(error.message || t("contact_page.error"));
        return;
      }
      setFormStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setFormStatus("error");
      setFormError(t("contact_page.error"));
    }
  };

  return (
    <form onSubmit={handleSubmit} data-readdy-form className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="c-name" className="text-sm font-medium text-foreground-700">{t("contact_page.name")}</label>
          <input id="c-name" type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1.5 w-full px-4 py-3 rounded-xl bg-background-100 border border-background-200/70 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all duration-300" />
        </div>
        <div>
          <label htmlFor="c-email" className="text-sm font-medium text-foreground-700">{t("contact_page.email")}</label>
          <input id="c-email" type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1.5 w-full px-4 py-3 rounded-xl bg-background-100 border border-background-200/70 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all duration-300" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="c-phone" className="text-sm font-medium text-foreground-700">{t("contact_page.phone")}</label>
          <input id="c-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1.5 w-full px-4 py-3 rounded-xl bg-background-100 border border-background-200/70 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all duration-300" />
        </div>
        <div>
          <label htmlFor="c-subject" className="text-sm font-medium text-foreground-700">{t("contact_page.subject")}</label>
          <input id="c-subject" type="text" name="subject" value={formData.subject} onChange={handleChange} className="mt-1.5 w-full px-4 py-3 rounded-xl bg-background-100 border border-background-200/70 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all duration-300" />
        </div>
      </div>
      <div>
        <label htmlFor="c-message" className="text-sm font-medium text-foreground-700">{t("contact_page.message")}</label>
        <textarea id="c-message" name="message" value={formData.message} onChange={handleChange} required maxLength={500} rows={5} className="mt-1.5 w-full px-4 py-3 rounded-xl bg-background-100 border border-background-200/70 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 resize-none transition-all duration-300"></textarea>
      </div>
      <input type="text" name="phone_alt" tabIndex={-1} autoComplete="off" aria-hidden="true" readOnly className="field-secondary-note" />
      <button type="submit" disabled={formStatus === "loading"} className="btn-pulse w-full py-3.5 rounded-full bg-primary-500 text-foreground-50 font-semibold text-sm hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60">
        {formStatus === "loading" ? "..." : t("contact_page.submit")}
      </button>
      {formStatus === "success" && <p className="text-sm text-foreground-700 text-center animate-fade-up">{t("contact_page.success")}</p>}
      {formStatus === "error" && <p className="text-sm text-red-600 text-center">{formError}</p>}
    </form>
  );
}
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSiteSettings, type ContactSettings, type BankSettings, type HomeSettings } from "@/hooks/useSiteSettings";
import { Card, Field, inputCls, btnPrimary } from "./AdminUi";

function SectionCard({
  icon,
  title,
  desc,
  children,
  onSave,
  saving,
  saved,
  error,
}: {
  icon: string;
  title: string;
  desc: string;
  children: React.ReactNode;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  error: string;
}) {
  return (
    <Card className="p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
          <i className={`${icon} text-xl`} aria-hidden="true"></i>
        </span>
        <div>
          <h3 className="font-heading text-lg text-foreground-950">{title}</h3>
          <p className="text-sm text-foreground-600">{desc}</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
      <div className="mt-5 flex items-center gap-3">
        <button type="button" onClick={onSave} disabled={saving} className={btnPrimary}>
          {saving ? "Saving…" : <><i className="ri-save-line" aria-hidden="true"></i> Save changes</>}
        </button>
        {saved && <span className="text-xs font-semibold text-accent-700">Saved — live on the site.</span>}
        {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
      </div>
    </Card>
  );
}

export default function ContentManager() {
  const { settings, reload } = useSiteSettings();
  const [contact, setContact] = useState<ContactSettings>(settings.contact);
  const [bank, setBank] = useState<BankSettings>(settings.bank);
  const [home, setHome] = useState<HomeSettings>(settings.home);
  const [busy, setBusy] = useState("");
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setContact(settings.contact);
    setBank(settings.bank);
    setHome(settings.home);
  }, [settings]);

  const persist = async (key: string, value: Record<string, unknown>) => {
    if (!supabase) return;
    setBusy(key);
    setError("");
    setSaved("");
    const { error: err } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    setBusy("");
    if (err) {
      setError(err.message);
      return;
    }
    setSaved(key);
    reload();
    setTimeout(() => setSaved(""), 2200);
  };

  return (
    <div className="space-y-6">
      <SectionCard
        icon="ri-contacts-line"
        title="Contact details"
        desc="Shown on the contact page, footer and floating buttons across the site."
        onSave={() => persist("contact", { ...contact })}
        saving={busy === "contact"}
        saved={saved === "contact"}
        error={error}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone number"><input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className={inputCls} /></Field>
          <Field label="WhatsApp number (display)"><input value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} className={inputCls} /></Field>
          <Field label="WhatsApp number (international, digits only)" hint="Used to build wa.me links, e.g. 971557033165">
            <input value={contact.whatsappNumber} onChange={(e) => setContact({ ...contact, whatsappNumber: e.target.value.replace(/[^0-9]/g, "") })} className={inputCls} />
          </Field>
          <Field label="Admin WhatsApp for booking alerts" hint="New bookings are sent to this number as a WhatsApp copy, e.g. 971557033165">
            <input value={contact.adminWhatsapp} onChange={(e) => setContact({ ...contact, adminWhatsapp: e.target.value.replace(/[^0-9]/g, "") })} className={inputCls} />
          </Field>
          <Field label="Email address"><input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={inputCls} /></Field>
          <Field label="Business address"><input value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} className={inputCls} /></Field>
          <Field label="Opening hours"><input value={contact.hours} onChange={(e) => setContact({ ...contact, hours: e.target.value })} className={inputCls} /></Field>
        </div>
      </SectionCard>

      <SectionCard
        icon="ri-bank-line"
        title="Bank transfer details"
        desc="Shown to customers on the payment step of the booking flow."
        onSave={() => persist("bank", { ...bank })}
        saving={busy === "bank"}
        saved={saved === "bank"}
        error={error}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Bank name"><input value={bank.bankName} onChange={(e) => setBank({ ...bank, bankName: e.target.value })} className={inputCls} /></Field>
          <Field label="Account holder name"><input value={bank.accountHolder} onChange={(e) => setBank({ ...bank, accountHolder: e.target.value })} className={inputCls} /></Field>
          <Field label="Account number"><input value={bank.accountNumber} onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })} className={inputCls} /></Field>
          <Field label="IBAN"><input value={bank.iban} onChange={(e) => setBank({ ...bank, iban: e.target.value })} className={inputCls} /></Field>
          <Field label="SWIFT / BIC"><input value={bank.swift} onChange={(e) => setBank({ ...bank, swift: e.target.value })} className={inputCls} /></Field>
          <Field label="Currency"><input value={bank.currency} onChange={(e) => setBank({ ...bank, currency: e.target.value })} className={inputCls} /></Field>
        </div>
      </SectionCard>

      <SectionCard
        icon="ri-home-4-line"
        title="Home page content"
        desc="Headline, subtitle and an optional promotional banner."
        onSave={() => persist("home", { ...home })}
        saving={busy === "home"}
        saved={saved === "home"}
        error={error}
      >
        <Field label="Hero headline"><input value={home.heroTitle} onChange={(e) => setHome({ ...home, heroTitle: e.target.value })} className={inputCls} /></Field>
        <Field label="Hero subtitle"><textarea value={home.heroSubtitle} onChange={(e) => setHome({ ...home, heroSubtitle: e.target.value })} rows={2} maxLength={500} className={`${inputCls} resize-none`}></textarea></Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <Field label="Promotional banner text" hint="Leave blank to hide the banner.">
            <input value={home.bannerText} onChange={(e) => setHome({ ...home, bannerText: e.target.value })} className={inputCls} />
          </Field>
          <label className="flex items-center gap-3 cursor-pointer mt-6">
            <input type="checkbox" checked={home.bannerActive} onChange={(e) => setHome({ ...home, bannerActive: e.target.checked })} className="w-4 h-4 accent-[oklch(var(--primary-500))]" />
            <span className="text-sm text-foreground-900">Show banner on the site</span>
          </label>
        </div>
      </SectionCard>
    </div>
  );
}
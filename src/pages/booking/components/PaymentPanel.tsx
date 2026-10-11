import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { functionsBaseUrl, supabaseAnonKey } from "@/lib/supabase";
import {
  buildWhatsAppPaymentMessage,
  buildWhatsAppBookingDetails,
  type PaymentBookingInfo,
} from "@/lib/bookingMessage";

const aed = (n: number) => `AED ${Number(n).toFixed(0)}`;

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface PaymentPanelProps {
  info: PaymentBookingInfo;
  t: (key: string) => string;
  onReset: () => void;
}

interface BankRow {
  label: string;
  value: string;
  copyable?: boolean;
}

type Step = "pay" | "upload" | "done";

export default function PaymentPanel({ info, t, onReset }: PaymentPanelProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("pay");
  const [ref, setRef] = useState(info.ref || "");
  const [paymentStatus, setPaymentStatus] = useState("under_review");
  const [bookingStatus, setBookingStatus] = useState("pending_payment");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [trackRef, setTrackRef] = useState("");
  const [dragging, setDragging] = useState(false);

  const { settings } = useSiteSettings();
  const bank = settings.bank;

  const live: PaymentBookingInfo = useMemo(() => ({ ...info, ref }), [info, ref]);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("");
    }
  };

  const bankRows: BankRow[] = [
    { label: t("booking.bank_name"), value: bank.bankName },
    { label: t("booking.bank_holder"), value: bank.accountHolder },
    { label: t("booking.bank_account"), value: bank.accountNumber, copyable: true },
    { label: t("booking.bank_iban"), value: bank.iban, copyable: true },
    { label: t("booking.bank_swift"), value: bank.swift, copyable: true },
    { label: t("booking.bank_currency"), value: bank.currency },
  ];

  const waScreenshot = `https://wa.me/${settings.contact.whatsappNumber}?text=${encodeURIComponent(buildWhatsAppPaymentMessage(live))}`;
  const waFast = `https://wa.me/${settings.contact.whatsappNumber}?text=${encodeURIComponent(buildWhatsAppBookingDetails(live))}`;
  // Alternative-payment enquiry — the customer reviews and sends this themselves.
  const altPaymentMessage =
    "Hello Paws & Claws team, I would like to know about alternative payment methods for my booking. Please assist me.";
  const waAltPayment = `https://wa.me/${settings.contact.whatsappNumber}?text=${encodeURIComponent(altPaymentMessage)}`;

  const goUpload = () => {
    setStep("upload");
    if (typeof window !== "undefined") window.scrollTo({ top: 200, behavior: "smooth" });
  };

  // Upload the bank-transfer screenshot and attach it to the booking record.
  const handleFile = async (file: File | null | undefined) => {
    if (!file || uploading) return;
    setUploadError("");
    if (!ALLOWED_TYPES.includes((file.type || "").toLowerCase())) {
      setUploadError(t("booking.upload_invalid_type"));
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError(t("booking.upload_too_large"));
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("bookingId", info.bookingId);
      fd.append("file", file);
      const res = await fetch(`${functionsBaseUrl}/submit-payment-proof`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
        body: fd,
      });
      let data: Record<string, unknown> = {};
      try {
        data = (await res.json()) as Record<string, unknown>;
      } catch {
        data = {};
      }
      if (!res.ok || data.ok === false) {
        setUploadError(t("booking.upload_error"));
        return;
      }
      setScreenshotUrl((data.screenshotUrl as string) ?? "");
      setUploaded(true);
    } catch {
      setUploadError(t("booking.upload_error"));
    } finally {
      setUploading(false);
    }
  };

  // "Confirm Order": finalize the submission and generate the tracking ID.
  const handleConfirmOrder = async () => {
    if (confirming) return;
    if (!uploaded) {
      setError(t("booking.upload_required"));
      return;
    }
    setError("");
    setConfirming(true);
    try {
      const res = await fetch(`${functionsBaseUrl}/confirm-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ bookingId: info.bookingId }),
      });
      let data: Record<string, unknown> = {};
      try {
        data = (await res.json()) as Record<string, unknown>;
      } catch {
        data = {};
      }
      if (!res.ok || data.ok === false) {
        setError(t("booking.confirm_order_error"));
        return;
      }
      const booking = (data.booking ?? {}) as Record<string, unknown>;
      const finalRef = (data.bookingRef as string) ?? (booking.ref as string) ?? ref;
      setRef(finalRef);
      setTrackRef(finalRef);
      setPaymentStatus((booking.paymentStatus as string) ?? "under_review");
      setBookingStatus((booking.bookingStatus as string) ?? "pending_payment");
      setStep("done");
      if (typeof window !== "undefined") window.scrollTo({ top: 200, behavior: "smooth" });
    } catch {
      setError(t("booking.confirm_order_error"));
    } finally {
      setConfirming(false);
    }
  };

  const handleTrack = () => {
    const value = trackRef.trim();
    if (!value) return;
    navigate(`/find-booking?ref=${encodeURIComponent(value)}`);
  };

  return (
    <div className="space-y-6 text-left animate-fade-up">
      {/* Stepper */}
      <ol className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
        {(["pay", "upload", "done"] as Step[]).map((s, i) => {
          const labels = [t("booking.step_pay"), t("booking.step_screenshot"), t("booking.step_done")];
          const activeIndex = step === "pay" ? 0 : step === "upload" ? 1 : 2;
          const isDone = i < activeIndex;
          const isActive = i === activeIndex;
          return (
            <li key={s} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  isDone || isActive ? "bg-primary-500 text-foreground-50" : "bg-background-200 text-foreground-500"
                }`}
              >
                {isDone ? <i className="ri-check-line" aria-hidden="true"></i> : i + 1}
              </span>
              <span className={isActive ? "text-foreground-950" : "text-foreground-500"}>{labels[i]}</span>
              {i < 2 && <span className="mx-1 h-px w-4 bg-background-300" aria-hidden="true"></span>}
            </li>
          );
        })}
      </ol>

      {/* STEP 1 — Pay (no reference ID shown at this stage) */}
      {step === "pay" && (
        <>
          <div className="rounded-2xl bg-background-100 border border-background-200/70 p-5 md:p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground-950 mb-4">
              <i className="ri-scissors-cut-line text-accent-500" aria-hidden="true"></i>
              {t("booking.services_breakdown")}
            </p>
            <ul className="space-y-2.5">
              {info.services.map((s, i) => (
                <li key={i} className="flex items-start justify-between gap-4">
                  <span className="text-sm text-foreground-950">{s.name}</span>
                  <span className="text-sm font-semibold text-foreground-950 whitespace-nowrap">{aed(s.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-background-200/70 space-y-2">
              {typeof info.discount === "number" && info.discount > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground-600">{t("booking.summary_subtotal")}</span>
                    <span className="text-sm text-foreground-700">{aed(info.subtotal ?? 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-accent-700">{info.discountLabel || t("booking.summary_discount")}</span>
                    <span className="text-sm font-semibold text-accent-700">- {aed(info.discount)}</span>
                  </div>
                </>
              ) : null}
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-semibold text-foreground-950">{t("booking.amount_payable")}</span>
                <span className="font-heading text-2xl text-foreground-950">{aed(info.amount)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-background-100 border border-background-200/70 p-5 md:p-6">
            <p className="flex items-center gap-2 font-heading text-lg text-foreground-950">
              <i className="ri-bank-line text-accent-500" aria-hidden="true"></i>
              {t("booking.pay_bank_instruction_title")}
            </p>
            <p className="mt-2 text-sm text-foreground-700 leading-relaxed">{t("booking.pay_bank_instruction_text")}</p>

            <dl className="mt-4 divide-y divide-background-200/60">
              {bankRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 py-3">
                  <dt className="text-xs uppercase tracking-[0.12em] text-foreground-500 font-semibold shrink-0">
                    {row.label}
                  </dt>
                  <dd className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-foreground-950 font-medium text-right break-all">{row.value}</span>
                    {row.copyable && (
                      <button
                        type="button"
                        onClick={() => copy(row.label, row.value)}
                        aria-label={`Copy ${row.label}`}
                        className="shrink-0 inline-flex items-center gap-1 rounded-md border border-background-200/70 bg-background-50 px-2 py-1 text-[11px] font-semibold text-foreground-700 hover:border-accent-400 hover:text-foreground-950 transition-colors cursor-pointer"
                      >
                        <i className={copied === row.label ? "ri-check-line" : "ri-file-copy-line"} aria-hidden="true"></i>
                        {copied === row.label ? t("booking.copied") : t("booking.copy")}
                      </button>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 pt-5 border-t border-background-200/70">
              <p className="flex items-center gap-2 font-heading text-base text-foreground-950">
                <i className="ri-question-answer-line text-accent-500" aria-hidden="true"></i>
                {t("booking.alt_payment_title")}
              </p>
              <p className="mt-2 text-sm text-foreground-700 leading-relaxed">{t("booking.alt_payment_text")}</p>
              <p className="mt-3 text-sm font-semibold text-foreground-950">
                {t("booking.alt_payment_wa_label")}{" "}
                <a
                  href={waAltPayment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#128C4A] hover:underline cursor-pointer whitespace-nowrap"
                >
                  {settings.contact.whatsapp}
                </a>
              </p>
              <a
                href={waAltPayment}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white whitespace-nowrap cursor-pointer transition-all hover:brightness-95"
              >
                <i className="ri-whatsapp-line text-lg" aria-hidden="true"></i>
                {t("booking.alt_payment_wa_cta")}
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={goUpload}
            className="btn-pulse w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-primary-500 px-6 py-4 text-base font-semibold text-foreground-50 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-arrow-right-circle-line" aria-hidden="true"></i>
            {t("booking.confirm_payment_cta")}
          </button>
        </>
      )}

      {/* STEP 2 — Upload the payment screenshot */}
      {step === "upload" && (
        <>
          <div className="rounded-2xl bg-background-100 border border-background-200/70 p-5 md:p-6">
            <p className="flex items-center gap-2 font-heading text-xl md:text-2xl text-foreground-950">
              <i className="ri-image-add-line text-accent-500" aria-hidden="true"></i>
              {t("booking.upload_section_title")}
            </p>
            <p className="mt-2 text-sm text-foreground-700 leading-relaxed">{t("booking.upload_section_hint")}</p>

            {uploaded && screenshotUrl ? (
              <div className="mt-5 space-y-3">
                <div className="overflow-hidden rounded-xl border border-background-200/70 bg-background-50">
                  <img
                    src={screenshotUrl}
                    alt={t("booking.upload_preview")}
                    className="max-h-72 w-full object-contain"
                  />
                </div>
                <p className="flex items-center gap-2 text-sm font-semibold text-accent-700">
                  <i className="ri-checkbox-circle-line" aria-hidden="true"></i>
                  {t("booking.upload_success")}
                </p>
                <label className="inline-flex items-center gap-2 rounded-full border border-background-200/70 bg-background-50 px-4 py-2 text-xs font-semibold text-foreground-800 hover:border-primary-300 cursor-pointer">
                  <i className="ri-refresh-line" aria-hidden="true"></i>
                  {t("booking.upload_replace")}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      handleFile(f);
                    }}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  handleFile(e.dataTransfer.files?.[0]);
                }}
                className={`mt-5 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-background-50 px-6 py-10 text-center cursor-pointer transition-colors ${
                  dragging ? "border-accent-500 bg-accent-500/5" : "border-background-300 hover:border-accent-400"
                }`}
              >
                <span className="w-12 h-12 rounded-full bg-accent-500/15 text-accent-600 flex items-center justify-center">
                  <i className={uploading ? "ri-loader-4-line animate-spin text-xl" : "ri-upload-cloud-2-line text-xl"} aria-hidden="true"></i>
                </span>
                <span className="text-sm font-semibold text-foreground-950">
                  {uploading ? t("booking.uploading") : t("booking.upload_choose")}
                </span>
                <span className="text-xs text-foreground-500">{t("booking.upload_formats")}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    handleFile(f);
                  }}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}

            {uploadError && <p className="mt-3 text-sm text-red-600">{uploadError}</p>}
          </div>

          {/* Alternative: send via WhatsApp */}
          <div className="rounded-2xl bg-background-100 border border-background-200/70 p-5 md:p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground-950">
              <i className="ri-whatsapp-line text-[#25D366]" aria-hidden="true"></i>
              {t("booking.upload_wa_alt_title")}
            </p>
            <p className="mt-1 text-xs text-foreground-600 leading-relaxed">{t("booking.upload_wa_alt_text")}</p>
            <a
              href={waScreenshot}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white whitespace-nowrap cursor-pointer transition-all hover:brightness-95"
            >
              <i className="ri-whatsapp-line text-lg" aria-hidden="true"></i>
              {t("booking.upload_wa_cta")}
            </a>
            <p className="mt-2 text-[11px] text-foreground-500 leading-relaxed">{settings.contact.whatsapp}</p>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="button"
            onClick={handleConfirmOrder}
            disabled={confirming || !uploaded}
            className="btn-pulse w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-primary-500 px-6 py-4 text-base font-semibold text-foreground-50 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
          >
            <i className={confirming ? "ri-loader-4-line animate-spin" : "ri-check-double-line"} aria-hidden="true"></i>
            {confirming ? t("booking.submitting_booking") : t("booking.submit_booking")}
          </button>
        </>
      )}

      {/* STEP 3 — Order submitted + tracking */}
      {step === "done" && (
        <>
          <div className="rounded-3xl bg-background-100 border border-background-200/70 p-6 md:p-8 text-center">
            <span className="mx-auto w-16 h-16 rounded-full bg-accent-500 text-background-950 flex items-center justify-center">
              <i className="ri-check-double-line text-3xl" aria-hidden="true"></i>
            </span>
            <h2 className="mt-5 font-heading text-2xl md:text-3xl text-foreground-950 leading-tight">
              {t("booking.booked_title")}
            </h2>
            <p className="mt-3 text-sm text-foreground-700 leading-relaxed max-w-xl mx-auto">{t("booking.booked_notice")}</p>

            <dl className="mt-6 text-left divide-y divide-background-200/70">
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold">{t("booking.booked_ref_label")}</dt>
                <dd className="font-heading text-base text-foreground-950">{ref}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold">{t("booking.your_name")}</dt>
                <dd className="text-sm text-foreground-950 font-medium text-right">{info.customerName}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold">{t("booking.pet_name")}</dt>
                <dd className="text-sm text-foreground-950 font-medium text-right">{info.petName}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold">{t("booking.summary_services")}</dt>
                <dd className="text-sm text-foreground-950 font-medium text-right">
                  {info.services.map((s) => s.name).join(", ")}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold">{t("booking.summary_appointment")}</dt>
                <dd className="text-sm text-foreground-950 font-medium text-right">{info.date} · {info.slot}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold">{t("booking.amount_payable")}</dt>
                <dd className="font-heading text-lg text-foreground-950">{aed(info.amount)}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold">{t("booking.order_payment_status_label")}</dt>
                <dd>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-100 text-secondary-900 px-3 py-1 text-xs font-semibold">
                    <i className="ri-time-line" aria-hidden="true"></i>
                    {paymentStatus === "paid" ? t("booking.booked_payment_paid") : t("booking.order_payment_pending")}
                  </span>
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-xs uppercase tracking-[0.14em] text-foreground-500 font-semibold">{t("booking.booked_status_label")}</dt>
                <dd>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 text-accent-900 px-3 py-1 text-xs font-semibold">
                    <i className="ri-calendar-check-line" aria-hidden="true"></i>
                    {bookingStatus === "confirmed"
                      ? t("booking.booked_status_approved")
                      : bookingStatus === "completed"
                        ? t("booking.booked_status_completed")
                        : t("booking.booked_status_pending")}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Track your booking */}
          <div className="rounded-2xl bg-background-100 border border-background-200/70 p-5 md:p-6">
            <p className="flex items-center gap-2 font-heading text-lg text-foreground-950">
              <i className="ri-route-line text-accent-500" aria-hidden="true"></i>
              {t("booking.track_spa_booking")}
            </p>
            <p className="mt-1 text-sm text-foreground-700 leading-relaxed">{t("booking.track_spa_hint")}</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
                placeholder={t("booking.track_order_placeholder")}
                className="flex-1 px-4 py-3 rounded-xl bg-background-50 border border-background-200/70 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all duration-300"
              />
              <button
                type="button"
                onClick={handleTrack}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-foreground-50 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-search-line" aria-hidden="true"></i>
                {t("booking.track_spa_booking")}
              </button>
            </div>
          </div>

          {/* WhatsApp — send full booking details */}
          <div className="rounded-2xl bg-background-100 border border-background-200/70 p-5 md:p-6 space-y-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground-950">
              <i className="ri-whatsapp-line text-[#25D366]" aria-hidden="true"></i>
              {t("booking.send_wa_details")}
            </p>
            <p className="text-xs text-foreground-600 leading-relaxed">{t("booking.send_wa_details_note")}</p>
            <a
              href={waFast}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-4 text-base font-semibold text-white whitespace-nowrap cursor-pointer transition-all hover:brightness-95 animate-whatsapp-blink"
            >
              <i className="ri-whatsapp-line text-xl" aria-hidden="true"></i>
              {t("booking.send_wa_details")}
            </a>
            <a
              href={waScreenshot}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-full border border-[#25D366]/40 bg-background-50 px-6 py-3 text-sm font-semibold text-[#128C4A] whitespace-nowrap cursor-pointer transition-all hover:border-[#25D366]"
            >
              <i className="ri-image-line" aria-hidden="true"></i>
              {t("booking.upload_wa_cta")}
            </a>
            <p className="text-[11px] text-foreground-500 leading-relaxed">{t("booking.track_spa_wa_note")}</p>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-background-200/70 bg-background-100 px-6 py-3 text-sm font-semibold text-foreground-950 hover:border-primary-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-refresh-line" aria-hidden="true"></i>
            {t("booking.new_booking")}
          </button>
        </>
      )}
    </div>
  );
}
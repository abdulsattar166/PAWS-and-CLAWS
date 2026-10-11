import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { bookingSlots } from "@/mocks/pawsAndClaws";
import {
  useServices,
  servicesForPetType,
  resolveServicePrice,
  serviceHasSizePricing,
} from "@/hooks/useServices";
import { useAvailability } from "@/hooks/useAvailability";
import { useOffers } from "@/hooks/useOffers";
import { computeDiscounts } from "@/lib/discounts";
import { functionsBaseUrl, supabaseAnonKey } from "@/lib/supabase";
import { getDubaiNow, isSlotPast, hasFutureSlot } from "@/lib/bookingTime";
import {
  PET_TYPES,
  PET_SIZES,
  PET_BREEDS,
  EMPTY_ADDRESS,
  EMPTY_LOCATION,
  REQUIRED_ADDRESS_KEYS,
  type AddressFields,
  type LocationInfo,
} from "@/lib/bookingOptions";
import { type PaymentBookingInfo } from "@/lib/bookingMessage";
import ServicePicker from "./ServicePicker";
import AddressFieldsInput from "./AddressFieldsInput";
import LiveLocationInput from "./LiveLocationInput";
import BookingSummaryPanel from "./BookingSummaryPanel";
import PaymentPanel from "./PaymentPanel";

interface BookingFormProps {
  t: (key: string) => string;
}

const aed = (n: number) => `AED ${Number(n).toFixed(0)}`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM = {
  pet_name: "",
  pet_type: "",
  pet_breed: "",
  pet_size: "",
  name: "",
  email: "",
  phone: "",
  whatsapp: "",
  notes: "",
  health: "",
};

function SectionShell({
  id,
  index,
  title,
  hint,
  children,
}: {
  id: string;
  index: number;
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-2xl bg-background-100 border border-background-200/70 p-5 md:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-primary-500 text-foreground-50 flex items-center justify-center text-sm font-semibold shrink-0">
          {index}
        </span>
        <h3 className="font-heading text-lg text-foreground-950">{title}</h3>
      </div>
      <p className="mt-1.5 ml-11 text-xs text-foreground-500 leading-relaxed">{hint}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function BookingForm({ t }: BookingFormProps) {
  const { services, status: servicesStatus, reload: reloadServices } = useServices();

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [step, setStep] = useState<"form" | "review">("form");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [address, setAddress] = useState<AddressFields>({ ...EMPTY_ADDRESS });
  const [location, setLocation] = useState<LocationInfo>({ ...EMPTY_LOCATION });
  const [payment, setPayment] = useState<PaymentBookingInfo | null>(null);
  const honeyRef = useRef<HTMLInputElement>(null);

  const { bookedSlots, status: availStatus, reload: reloadAvailability } = useAvailability(date);
  const { offers } = useOffers();

  // Clear the chosen slot if it gets booked by someone else or has passed.
  useEffect(() => {
    if (slot && (bookedSlots.includes(slot) || isSlotPast(date, slot))) setSlot("");
  }, [bookedSlots, slot, date]);

  // Services that apply to the chosen pet type (own type + universal add-ons).
  const availableServices = useMemo(
    () => servicesForPetType(services, form.pet_type),
    [services, form.pet_type],
  );

  const selectedServices = useMemo(
    () => availableServices.filter((s) => selectedServiceIds.includes(s.id)),
    [availableServices, selectedServiceIds],
  );

  const needsSize = useMemo(
    () => selectedServices.some(serviceHasSizePricing),
    [selectedServices],
  );

  const total = useMemo(
    () => selectedServices.reduce((sum, s) => sum + resolveServicePrice(s, form.pet_size), 0),
    [selectedServices, form.pet_size],
  );

  const discountInfo = useMemo(() => {
    const lines = selectedServices.map((s) => ({
      id: s.id,
      name: s.name,
      price: resolveServicePrice(s, form.pet_size),
    }));
    return computeDiscounts(lines, offers);
  }, [selectedServices, form.pet_size, offers]);

  const finalTotal = discountInfo.finalTotal;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePetType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // Services are type-specific — clear any picks that no longer apply.
    setSelectedServiceIds([]);
    setForm((prev) => ({ ...prev, pet_type: value, pet_size: "" }));
  };

  const handleAddress = (field: keyof AddressFields, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const scrollToSection = (id: string) => {
    if (typeof document === "undefined") return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetForm = () => {
    setPayment(null);
    setSelectedServiceIds([]);
    setDate("");
    setSlot("");
    setStep("form");
    setForm({ ...EMPTY_FORM });
    setAddress({ ...EMPTY_ADDRESS });
    setLocation({ ...EMPTY_LOCATION });
    setStatus("idle");
    setError("");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const missingAddressKeys = REQUIRED_ADDRESS_KEYS.filter((k) => !address[k].trim());

  // Validate every required field, then show the review step.
  const goReview = () => {
    if (status === "loading") return;
    const msg =
      selectedServiceIds.length === 0
        ? t("booking.err_services")
        : needsSize && !form.pet_size
          ? t("booking.err_size")
          : !form.pet_name.trim() || !form.pet_type
            ? t("booking.err_required")
            : !slot
              ? t("booking.err_slot")
              : isSlotPast(date, slot)
                ? t("booking.err_slot_past")
                : !form.name.trim()
                  ? t("booking.err_required")
                  : !EMAIL_RE.test(form.email.trim())
                    ? t("booking.err_email")
                    : form.phone.replace(/\D/g, "").length < 7
                      ? t("booking.err_phone")
                      : missingAddressKeys.length > 0
                        ? t("booking.err_address")
                        : "";

    if (msg) {
      setStatus("error");
      setError(msg);
      if (selectedServiceIds.length === 0) scrollToSection("sec-services");
      else if (!slot || isSlotPast(date, slot)) scrollToSection("sec-arrival");
      else if (missingAddressKeys.length > 0) scrollToSection("sec-location");
      else if (!form.name.trim() || !EMAIL_RE.test(form.email.trim()) || form.phone.replace(/\D/g, "").length < 7)
        scrollToSection("sec-info");
      return;
    }

    setStatus("idle");
    setError("");
    setStep("review");
    if (typeof window !== "undefined") window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Spam honeypot — silently ignore bots.
    if (honeyRef.current?.value.trim()) return;
    goReview();
  };

  // Called from the review step: create the booking, then show the payment page.
  const submitBooking = async () => {
    if (status === "loading") return;
    setError("");
    setStatus("loading");

    const whatsapp = form.whatsapp.trim() || form.phone.trim();

    const payload = {
      pet: {
        name: form.pet_name,
        type: form.pet_type,
        breed: form.pet_breed,
        size: form.pet_size,
      },
      serviceIds: selectedServiceIds,
      preferredDate: date,
      timeSlot: slot,
      customer: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        whatsapp,
      },
      address: { ...address },
      location: { lat: location.lat, lng: location.lng, sharedAt: location.sharedAt },
      completeAddress: "",
      notes: form.notes,
      health: form.health,
      paymentMethod: "bank_transfer",
    };

    try {
      const res = await fetch(`${functionsBaseUrl}/create-booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(payload),
      });

      let data: Record<string, unknown> = {};
      try {
        data = (await res.json()) as Record<string, unknown>;
      } catch {
        data = {};
      }

      if (!res.ok || data.ok === false) {
        if (data.error === "slot_taken") {
          setError(t("booking.slot_taken"));
          reloadAvailability();
        } else if (data.error === "slot_past" || data.error === "invalid_date") {
          setError(t("booking.err_slot_past"));
          reloadAvailability();
        } else if (data.error === "invalid_service") {
          setError(t("booking.err_service_mismatch"));
        } else {
          setError(t("booking.create_error"));
        }
        setStatus("error");
        return;
      }

      // Booking saved on the server — show the bank transfer + upload step.
      const serverServices = Array.isArray(data.services)
        ? (data.services as Array<{ name: string; price: number }>)
        : selectedServices.map((s) => ({ name: s.name, price: resolveServicePrice(s, form.pet_size) }));
      const amount = typeof data.amount === "number" ? (data.amount as number) : finalTotal;
      const subtotal = typeof data.subtotal === "number" ? (data.subtotal as number) : discountInfo.originalTotal;
      const discount = typeof data.discount === "number" ? (data.discount as number) : discountInfo.discountTotal;

      setPayment({
        bookingId: (data.bookingId as string) ?? "",
        ref: "",
        amount,
        subtotal,
        discount,
        discountLabel: discountInfo.appliedOffers.join(", ") || undefined,
        currency: (data.currency as string) ?? "AED",
        services: serverServices,
        petName: form.pet_name,
        petType: form.pet_type,
        petBreed: form.pet_breed,
        petSize: form.pet_size,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        customerWhatsapp: whatsapp,
        date,
        slot,
        address: { ...address },
        lat: location.lat,
        lng: location.lng,
        completeAddress: "",
      });
      setStatus("idle");
      if (typeof window !== "undefined") window.scrollTo({ top: 200, behavior: "smooth" });
    } catch {
      setStatus("error");
      setError(t("booking.create_error"));
    }
  };

  // Payment step — booking is saved, now show bank transfer + upload.
  if (payment) {
    return <PaymentPanel info={payment} t={t} onReset={resetForm} />;
  }

  // Review step — full summary with per-section Edit before payment.
  if (step === "review") {
    return (
      <div className="space-y-6 animate-fade-up">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-accent-500 font-semibold flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-primary-500"></span>
            {t("booking.summary_title")}
          </p>
          <h2 className="mt-3 font-heading text-2xl md:text-3xl text-foreground-950">{t("booking.summary_title")}</h2>
          <p className="mt-2 text-sm text-foreground-700 leading-relaxed">{t("booking.review_intro")}</p>
        </div>

        <BookingSummaryPanel
          services={selectedServices}
          petSize={form.pet_size}
          total={finalTotal}
          subtotal={discountInfo.originalTotal}
          discount={discountInfo.discountTotal}
          discountLabel={discountInfo.appliedOffers.join(", ") || undefined}
          date={date}
          slot={slot}
          pet={{ name: form.pet_name, type: form.pet_type, breed: form.pet_breed, size: form.pet_size }}
          customer={{ name: form.name, email: form.email, phone: form.phone, whatsapp: form.whatsapp }}
          address={address}
          location={location}
          health={form.health}
          notes={form.notes}
          onEdit={(id) => {
            setStep("form");
            setTimeout(() => scrollToSection(id), 60);
          }}
          t={t}
        />

        {status === "error" && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setError("");
              setStep("form");
              if (typeof window !== "undefined") window.scrollTo({ top: 120, behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-background-200/70 bg-background-100 px-6 py-3.5 text-sm font-semibold text-foreground-950 hover:border-primary-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-arrow-left-line" aria-hidden="true"></i>
            {t("booking.back_to_form")}
          </button>
          <button
            type="button"
            onClick={submitBooking}
            disabled={status === "loading"}
            className="btn-pulse flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-6 py-3.5 text-sm font-semibold text-foreground-50 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
          >
            {status === "loading" ? t("booking.processing") : t("booking.pay_continue")}
            {status !== "loading" && <i className="ri-arrow-right-line" aria-hidden="true"></i>}
          </button>
        </div>
      </div>
    );
  }

  const slotsLocked = !date || availStatus === "error";
  const dubaiNow = getDubaiNow();
  const todayStr = dubaiNow.dateString;
  const noSlotsLeftToday = Boolean(date) && date === todayStr && !hasFutureSlot(date, bookingSlots, dubaiNow);
  const inputClass =
    "mt-1.5 w-full px-4 py-3 rounded-xl bg-background-50 border border-background-200/70 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all duration-300";
  const labelClass = "text-sm font-medium text-foreground-700";

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* 1. Pet Information */}
      <SectionShell id="sec-pet" index={1} title={t("booking.sec_pet_title")} hint={t("booking.sec_pet_hint")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="b-pet-name" className={labelClass}>{t("booking.pet_name")}</label>
            <input id="b-pet-name" type="text" name="pet_name" value={form.pet_name} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="b-pet-type" className={labelClass}>{t("booking.pet_type")}</label>
            <select id="b-pet-type" name="pet_type" value={form.pet_type} onChange={handlePetType} required className={`${inputClass} cursor-pointer`}>
              <option value="">Select...</option>
              {PET_TYPES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
          <div>
            <label htmlFor="b-breed" className={labelClass}>{t("booking.pet_breed")}</label>
            <input
              id="b-breed"
              type="text"
              name="pet_breed"
              list="breed-options"
              value={form.pet_breed}
              onChange={handleChange}
              className={inputClass}
            />
            <datalist id="breed-options">
              {(PET_BREEDS[form.pet_type] ?? []).map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>
          {form.pet_type === "dog" && (
            <div>
              <label htmlFor="b-size" className={labelClass}>{t("booking.pet_size")}</label>
              <select
                id="b-size"
                name="pet_size"
                value={form.pet_size}
                onChange={handleChange}
                required={needsSize}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Select...</option>
                {PET_SIZES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </SectionShell>

      {/* 2. Select Services */}
      <SectionShell id="sec-services" index={2} title={t("booking.sec_services_title")} hint={t("booking.sec_services_hint")}>
        <div className="flex items-center justify-between gap-3">
          <label className={labelClass}>{t("booking.service_select")}</label>
          {selectedServiceIds.length > 0 && (
            <span className="text-xs font-semibold text-accent-600">
              {t("booking.total_label")}: {aed(finalTotal)}
            </span>
          )}
        </div>
        <ServicePicker
          services={availableServices}
          petType={form.pet_type}
          petSize={form.pet_size}
          selectedIds={selectedServiceIds}
          onToggle={toggleService}
          loading={servicesStatus === "loading"}
          error={servicesStatus === "error"}
          onRetry={reloadServices}
          t={t}
        />
        {discountInfo.discountTotal > 0 && (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-accent-500/12 border border-accent-300/60 px-4 py-3 text-xs font-semibold text-accent-700">
            <i className="ri-coupon-3-line text-base" aria-hidden="true"></i>
            {discountInfo.appliedOffers.join(", ")} — {" "}
            {t("booking.summary_discount")}: - {aed(discountInfo.discountTotal)}
          </p>
        )}
      </SectionShell>

      {/* 3. Choose Your Arrival Window */}
      <SectionShell id="sec-arrival" index={3} title={t("booking.sec_arrival_title")} hint={t("booking.sec_arrival_hint")}>
        <div>
          <label htmlFor="b-date" className={labelClass}>{t("booking.preferred_date")}</label>
          <input
            id="b-date"
            type="date"
            name="preferred_date"
            value={date}
            min={todayStr}
            onChange={(e) => setDate(e.target.value)}
            required
            className={`${inputClass} cursor-pointer`}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {bookingSlots.map((s) => {
            const booked = bookedSlots.includes(s);
            const past = isSlotPast(date, s, dubaiNow);
            const active = slot === s;
            const disabled = booked || past || slotsLocked;
            const label = booked ? t("booking.slot_booked") : past ? t("booking.slot_passed") : "";
            return (
              <button
                type="button"
                key={s}
                disabled={disabled}
                onClick={() => setSlot(active ? "" : s)}
                aria-pressed={active}
                title={label || undefined}
                className={`relative px-3 py-2.5 rounded-xl text-xs font-medium leading-tight border transition-all duration-300 ${
                  booked
                    ? "bg-background-200/70 border-background-200/70 text-foreground-400 cursor-not-allowed line-through"
                    : past || disabled
                      ? "bg-background-50 border-background-200/70 text-foreground-400 cursor-not-allowed"
                      : active
                        ? "bg-accent-500 border-accent-500 text-background-950 cursor-pointer"
                        : "bg-background-50 border-background-200/70 text-foreground-700 hover:border-accent-400 hover:text-foreground-950 cursor-pointer"
                }`}
              >
                {s}
                {label && <span className="block text-[10px] font-semibold no-underline">{label}</span>}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-foreground-500">
          {availStatus === "loading"
            ? t("booking.avail_loading")
            : !date
              ? t("booking.err_slot_date")
              : noSlotsLeftToday
                ? t("booking.no_slots_today")
                : availStatus === "error"
                  ? t("booking.avail_error")
                  : t("booking.slots_hint")}
        </p>
      </SectionShell>

      {/* 4. Your Information */}
      <SectionShell id="sec-info" index={4} title={t("booking.sec_info_title")} hint={t("booking.sec_info_hint")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="b-name" className={labelClass}>{t("booking.your_name")}</label>
            <input id="b-name" type="text" name="name" value={form.name} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="b-email" className={labelClass}>{t("booking.your_email")}</label>
            <input id="b-email" type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
          <div>
            <label htmlFor="b-phone" className={labelClass}>{t("booking.your_phone")}</label>
            <input id="b-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="b-whatsapp" className={labelClass}>{t("booking.your_whatsapp")}</label>
            <input id="b-whatsapp" type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} className={inputClass} />
            <p className="mt-1 text-[11px] text-foreground-500">{t("booking.whatsapp_optional")}</p>
          </div>
        </div>
      </SectionShell>

      {/* 5. Service Location */}
      <SectionShell id="sec-location" index={5} title={t("booking.sec_location_title")} hint={t("booking.sec_location_hint")}>
        <div className="space-y-6">
          <LiveLocationInput value={location} onChange={setLocation} t={t} />
          <AddressFieldsInput
            value={address}
            onChange={handleAddress}
            inputClass={inputClass}
            labelClass={labelClass}
            t={t}
          />
          <div>
            <label htmlFor="b-notes" className={labelClass}>{t("booking.notes_optional")}</label>
            <textarea
              id="b-notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              maxLength={500}
              rows={3}
              className={`${inputClass} resize-none`}
            ></textarea>
          </div>
        </div>
      </SectionShell>

      {/* 6. Pet Health and Medical Information */}
      <SectionShell id="sec-health" index={6} title={t("booking.sec_health_title")} hint={t("booking.sec_health_hint")}>
        <label htmlFor="b-health" className={labelClass}>{t("booking.health_label")}</label>
        <p className="mt-1 text-xs text-foreground-500">{t("booking.health_q")}</p>
        <textarea
          id="b-health"
          name="health"
          value={form.health}
          onChange={handleChange}
          maxLength={500}
          rows={3}
          className={`${inputClass} resize-none`}
        ></textarea>
      </SectionShell>

      <input
        ref={honeyRef}
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
        className="btn-pulse w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary-500 text-foreground-50 font-semibold text-sm hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
      >
        {t("booking.continue_to_summary")}
        <i className="ri-arrow-right-line" aria-hidden="true"></i>
      </button>

      {status === "error" && <p className="text-sm text-red-600 text-center">{error}</p>}
    </form>
  );
}
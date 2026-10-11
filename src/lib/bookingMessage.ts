// Builds the pre-filled WhatsApp messages the customer uses to send their bank
// transfer proof, request confirmation and ask for help. Everything the team
// needs to verify the payment and locate the pet is included.

import {
  PET_TYPE_LABELS,
  PET_SIZE_LABELS,
  formatAddress,
  hasLocation,
  mapsLink,
  type AddressFields,
} from "@/lib/bookingOptions";

export interface PaymentBookingInfo {
  bookingId: string;
  ref: string;
  amount: number;
  subtotal?: number;
  discount?: number;
  discountLabel?: string;
  currency: string;
  services: Array<{ name: string; price: number }>;
  petName: string;
  petType: string;
  petBreed: string;
  petSize: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerWhatsapp?: string;
  date: string;
  slot: string;
  address: AddressFields;
  lat: number | null;
  lng: number | null;
  completeAddress: string;
}

function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  if (!match) return value;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const money = (n: number) => `AED ${Number(n).toFixed(0)}`;

function petLine(b: PaymentBookingInfo): string {
  const bits = [
    PET_TYPE_LABELS[b.petType] ?? b.petType,
    b.petBreed,
    b.petSize ? PET_SIZE_LABELS[b.petSize] ?? b.petSize : "",
  ].filter(Boolean);
  return `${b.petName}${bits.length ? " — " + bits.join(" · ") : ""}`;
}

function fullAddressLine(b: PaymentBookingInfo): string {
  const composed = formatAddress(b.address);
  const extra = b.completeAddress?.trim();
  if (extra && composed) return `${composed} | ${extra}`;
  return extra || composed || "-";
}

function locationLine(b: PaymentBookingInfo): string {
  const loc = { lat: b.lat, lng: b.lng, sharedAt: null };
  if (hasLocation(loc)) return mapsLink(b.lat as number, b.lng as number);
  return "Not shared";
}

function whatsappLine(b: PaymentBookingInfo): string {
  return b.customerWhatsapp?.trim() || b.customerPhone || "-";
}

/** Payment-confirmation message (send bank transfer screenshot). */
export function buildWhatsAppPaymentMessage(b: PaymentBookingInfo): string {
  const lines: string[] = ["*PAYMENT CONFIRMATION — Paws and Claws*"];
  if (b.ref) lines.push(`Booking Reference: ${b.ref}`);
  lines.push(`Customer: ${b.customerName}`);
  if (b.customerPhone) lines.push(`Phone: ${b.customerPhone}`);
  if (whatsappLine(b) !== "-") lines.push(`WhatsApp: ${whatsappLine(b)}`);
  if (b.customerEmail) lines.push(`Email: ${b.customerEmail}`);

  lines.push("");
  lines.push(`*Pet:* ${petLine(b)}`);

  lines.push("");
  lines.push("*Selected services:*");
  b.services.forEach((s) => lines.push(`• ${s.name} — ${money(s.price)}`));
  lines.push(`*Total amount: ${money(b.amount)}*`);

  lines.push("");
  lines.push(`*Arrival window:* ${formatDate(b.date)} · ${b.slot}`);
  lines.push(`*Service address:* ${fullAddressLine(b)}`);

  lines.push("");
  lines.push(
    `I have transferred ${money(b.amount)} to your bank account. My bank transfer receipt screenshot is attached for your verification.`,
  );

  return lines.join("\n");
}

/**
 * Full booking-details message used by the "Send Booking Details on WhatsApp"
 * button after the booking is submitted — asks the team to verify the payment
 * and approve the booking. Every value is filled in dynamically.
 */
export function buildWhatsAppBookingDetails(b: PaymentBookingInfo): string {
  const lines: string[] = [
    "Hello, I have submitted my pet spa booking and would like to request confirmation.",
    "",
    `Booking Reference ID: ${b.ref || "Pending"}`,
    `Customer Name: ${b.customerName}`,
    `Phone Number: ${b.customerPhone}`,
    `WhatsApp Number: ${whatsappLine(b)}`,
    `Pet Name: ${b.petName}`,
    `Pet Type: ${(PET_TYPE_LABELS[b.petType] ?? b.petType) || "-"}`,
    `Breed: ${b.petBreed || "-"}`,
  ];

  lines.push("");
  lines.push("Selected Services:");
  b.services.forEach((s) => lines.push(`• ${s.name} — ${money(s.price)}`));

  if (typeof b.discount === "number" && b.discount > 0) {
    lines.push(`Discount: ${b.discountLabel || "Applied"} — - ${money(b.discount)}`);
  }
  lines.push(`Total Amount: ${money(b.amount)}`);

  lines.push("");
  lines.push(`Arrival Date and Time: ${formatDate(b.date)} · ${b.slot}`);
  lines.push(`Home Service Address: ${fullAddressLine(b)}`);
  if (b.address?.landmark) lines.push(`Landmark / Additional Directions: ${b.address.landmark}`);
  lines.push(`Live Location: ${locationLine(b)}`);
  lines.push("Payment Screenshot: Uploaded on the website.");
  lines.push("Current Status: Pending Payment Verification.");

  lines.push("");
  lines.push("Please review my payment and approve my booking. Thank you.");

  return lines.join("\n");
}

/** Tracking message from the customer asking for a status update. */
export function buildWhatsAppTrackMessage(ref: string): string {
  const lines: string[] = ["Hello, I would like to check the status of my pet spa booking."];
  if (ref) lines.push(`Booking Reference ID: ${ref}`);
  lines.push("", "Please confirm my payment verification status and provide an update on my booking.");
  return lines.join("\n");
}

export interface SupportMessageInput {
  ref: string;
  customerName?: string;
  services?: Array<{ name: string; price: number }>;
  amount?: number;
  date?: string;
  slot?: string;
  status?: string;
}

/** Support message used by the tracking page's "Contact Us on WhatsApp" button. */
export function buildWhatsAppSupportMessage(input: SupportMessageInput): string {
  const lines: string[] = ["Hello, I need help with my pet spa booking."];
  if (input.ref) lines.push(`Booking Reference ID: ${input.ref}`);
  if (input.customerName) lines.push(`Customer Name: ${input.customerName}`);
  if (input.services && input.services.length > 0) {
    lines.push(`Selected Services: ${input.services.map((s) => s.name).join(", ")}`);
  }
  if (typeof input.amount === "number") lines.push(`Total Amount: ${money(input.amount)}`);
  if (input.date) lines.push(`Arrival Window: ${formatDate(input.date)}${input.slot ? " · " + input.slot : ""}`);
  lines.push(`Current Status: ${input.status || "Pending Payment Verification"}`);
  lines.push("", "Please review my booking in the Admin Panel and assist me. Thank you.");
  return lines.join("\n");
}
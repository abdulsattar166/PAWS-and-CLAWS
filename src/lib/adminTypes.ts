// Shared row shapes for the Admin Panel (mirror the Supabase tables).

export interface BookingServiceLine {
  id?: string;
  name: string;
  price: number;
}

export interface BookingRow {
  id: string;
  booking_ref: string;
  pet_name: string | null;
  pet_type: string | null;
  pet_breed: string | null;
  pet_size: string | null;
  services: BookingServiceLine[];
  service_total: number;
  preferred_date: string;
  time_slot: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_whatsapp: string | null;
  customer_address: string | null;
  addr_house_number: string | null;
  addr_street_number: string | null;
  addr_street_name: string | null;
  addr_area: string | null;
  addr_city: string | null;
  addr_province: string | null;
  addr_country: string | null;
  addr_postal_code: string | null;
  addr_landmark: string | null;
  special_notes: string | null;
  health_info: string | null;
  complete_address: string | null;
  customer_lat: number | null;
  customer_lng: number | null;
  location_shared_at: string | null;
  payment_screenshot_url: string | null;
  amount: number;
  currency: string;
  booking_status: string;
  payment_status: string;
  payment_method: string | null;
  payment_ref: string | null;
  admin_status: string;
  admin_note: string | null;
  hold_expires_at: string | null;
  paid_at: string | null;
  whatsapp_status: string | null;
  whatsapp_sent_at: string | null;
  whatsapp_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceRow {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price_aed: number;
  duration: string | null;
  icon: string | null;
  sort_order: number;
  active: boolean;
  pet_type: string | null;
  image_url: string | null;
}

export interface SizePriceRow {
  id: string;
  service_id: string;
  size: string;
  price_aed: number;
}

export interface PackageRow {
  id: string;
  name: string;
  short_description: string | null;
  full_description: string | null;
  pet_type: string;
  breed_restrictions: string | null;
  pet_size: string | null;
  min_weight: number | null;
  max_weight: number | null;
  original_price: number;
  discounted_price: number | null;
  duration: string | null;
  washes: string | null;
  shampoo_details: string | null;
  conditioner_details: string | null;
  haircut_details: string | null;
  coat_care: string | null;
  skin_care: string | null;
  drying_brushing: string | null;
  ear_cleaning: string | null;
  nail_trimming: string | null;
  treatments: string[];
  image_url: string | null;
  featured: boolean;
  sort_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PetCategoryRow {
  id: string;
  label: string;
  singular: string | null;
  icon: string | null;
  sort_order: number;
  active: boolean;
  created_at?: string;
}

export interface GalleryCategoryRow {
  id: string;
  label: string;
  sort_order: number;
  active: boolean;
  created_at?: string;
}

export interface GalleryImageRow {
  id: string;
  title: string;
  caption: string | null;
  alt: string | null;
  category_id: string | null;
  image_url: string;
  featured: boolean;
  sort_order: number;
  active: boolean;
  created_at?: string;
}

export interface ReviewRow {
  id: string;
  customer_name: string;
  review_text: string;
  rating: number;
  review_date: string | null;
  image_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at?: string;
}

export interface OfferRow {
  id: string;
  title: string;
  description: string | null;
  discount_type: "percent" | "fixed";
  discount_value: number;
  service_ids: string[];
  promo_code: string | null;
  banner_text: string | null;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  status: "draft" | "published";
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettingRow {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

export type BookingStatusFilter =
  | "all"
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled";

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: "Unpaid",
  awaiting_transfer: "Awaiting transfer",
  under_review: "Under review",
  paid: "Paid",
  failed: "Failed",
};

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  pending_payment: "Pending Approval",
  confirmed: "Booking Approved",
  in_progress: "Service in Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
  payment_failed: "Payment failed",
};

export const ADMIN_STATUS_LABELS: Record<string, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
};

/** Format a numeric/string money value as AED. */
export function aed(value: number | string): string {
  return `AED ${Number(value ?? 0).toFixed(0)}`;
}

/**
 * Customer-facing reference for admin display. Bookings that were never
 * confirmed by the customer still carry an internal placeholder (INT-…),
 * which we hide behind a friendly label.
 */
export function displayBookingRef(ref: string | null): string {
  if (!ref || ref.startsWith("INT-")) return "Pending";
  return ref;
}

/** Format an ISO timestamp for display. */
export function formatDateTime(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format a plain YYYY-MM-DD date for display. */
export function formatDateOnly(value: string | null): string {
  if (!value) return "—";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * WhatsApp approval message the administrator sends to the customer (used both
 * by the automatic sender and the "open WhatsApp manually" fallback).
 */
export function buildCustomerApprovalMessage(b: BookingRow): string {
  const services = (b.services ?? []).map((s) => s.name).join(", ") || "-";
  return [
    "*Paws and Claws — Booking Approved ✅*",
    "",
    `Hi ${b.customer_name}, great news — your booking request has been approved!`,
    "",
    `Booking reference: ${b.booking_ref ?? "-"}`,
    `Pet: ${b.pet_name ?? "-"}`,
    `Service: ${services}`,
    `Date: ${formatDateOnly(b.preferred_date)}`,
    `Time slot: ${b.time_slot}`,
    b.customer_address ? `Location: ${b.customer_address}` : "",
    `Total: ${aed(b.amount)}`,
    "",
    "Our mobile grooming van will arrive in the time window above. Reply here if anything changes.",
    "Thank you for choosing Paws and Claws!",
  ]
    .filter(Boolean)
    .join("\n");
}
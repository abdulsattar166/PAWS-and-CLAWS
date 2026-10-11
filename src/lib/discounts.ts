// Discount engine shared by the booking form (display) and the create-booking
// edge function (authoritative re-calculation). An offer applies to a service
// when its service_ids list is empty (all services) or contains the service id.

export interface DiscountOffer {
  id: string;
  title: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  service_ids: string[];
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
}

export interface PricedLine {
  id?: string;
  name: string;
  price: number;
}

export interface DiscountResult {
  originalTotal: number;
  discountTotal: number;
  finalTotal: number;
  appliedOffers: string[];
}

/** True when the offer is currently live (active + within its date window). */
export function isOfferLive(offer: DiscountOffer, now: Date = new Date()): boolean {
  if (!offer.active) return false;
  if (offer.starts_at && new Date(offer.starts_at) > now) return false;
  if (offer.ends_at && new Date(offer.ends_at) < now) return false;
  return true;
}

/** Discount amount for a single line, choosing the best live offer that applies. */
function bestDiscountForLine(line: PricedLine, offers: DiscountOffer[]): number {
  let best = 0;
  offers.forEach((offer) => {
    const applies = offer.service_ids.length === 0 || (line.id ? offer.service_ids.includes(line.id) : false);
    if (!applies) return;
    const value = Number(offer.discount_value);
    const amount =
      offer.discount_type === "percent"
        ? (line.price * value) / 100
        : Math.min(value, line.price);
    if (amount > best) best = amount;
  });
  return Math.max(0, best);
}

/** Compute the discount and final payable total for a set of priced lines. */
export function computeDiscounts(lines: PricedLine[], offers: DiscountOffer[], now: Date = new Date()): DiscountResult {
  const live = offers.filter((o) => isOfferLive(o, now));
  const originalTotal = lines.reduce((sum, l) => sum + Number(l.price), 0);
  let discountTotal = 0;
  const applied = new Set<string>();
  lines.forEach((line) => {
    const d = bestDiscountForLine(line, live);
    if (d > 0) {
      discountTotal += d;
      live.forEach((o) => {
        const applies = o.service_ids.length === 0 || (line.id ? o.service_ids.includes(line.id) : false);
        if (applies) applied.add(o.title);
      });
    }
  });
  const finalTotal = Math.max(0, originalTotal - discountTotal);
  return {
    originalTotal,
    discountTotal: Math.round(discountTotal * 100) / 100,
    finalTotal: Math.round(finalTotal * 100) / 100,
    appliedOffers: Array.from(applied),
  };
}

/** Map OfferRow-like records to the discount engine shape (tolerant of types). */
export function toDiscountOffers(rows: Array<Record<string, unknown>>): DiscountOffer[] {
  return rows.map((r) => ({
    id: String(r.id ?? ""),
    title: String(r.title ?? ""),
    discount_type: (r.discount_type === "fixed" ? "fixed" : "percent") as "percent" | "fixed",
    discount_value: Number(r.discount_value ?? 0),
    service_ids: Array.isArray(r.service_ids) ? (r.service_ids as string[]) : [],
    active: Boolean(r.active),
    starts_at: (r.starts_at as string) ?? null,
    ends_at: (r.ends_at as string) ?? null,
  }));
}
// Timezone-aware booking time helpers.
//
// The business operates in the UAE, so arrival windows must be validated in
// Asia/Dubai time (a constant UTC+4 — the UAE never observes daylight saving),
// regardless of the customer's own device timezone. The same rules are
// enforced again on the server when the booking is created.

export const BUSINESS_TIMEZONE = "Asia/Dubai";

const DUBAI_OFFSET_MINUTES = 4 * 60;

export interface DubaiNow {
  year: number;
  month: number; // 1-12
  day: number;
  hours: number; // 0-23
  minutes: number;
  /** minutes elapsed since midnight, Dubai time */
  minuteOfDay: number;
  /** YYYY-MM-DD in Dubai */
  dateString: string;
}

/** "Now" expressed in the business timezone. */
export function getDubaiNow(base: Date = new Date()): DubaiNow {
  const shifted = new Date(base.getTime() + DUBAI_OFFSET_MINUTES * 60 * 1000);
  const year = shifted.getUTCFullYear();
  const month = shifted.getUTCMonth() + 1;
  const day = shifted.getUTCDate();
  const hours = shifted.getUTCHours();
  const minutes = shifted.getUTCMinutes();
  return {
    year,
    month,
    day,
    hours,
    minutes,
    minuteOfDay: hours * 60 + minutes,
    dateString: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
}

/** Today's date (YYYY-MM-DD) in the business timezone. */
export function getTodayDateString(base: Date = new Date()): string {
  return getDubaiNow(base).dateString;
}

/** Parse the START of an arrival window, e.g. "9:30 AM – 11:30 AM" → 570. */
export function parseSlotStartMinutes(slot: string): number | null {
  const match = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(slot ?? "");
  if (!match) return null;
  let hours = Number(match[1]) % 12;
  const minutes = Number(match[2]);
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + minutes;
}

/**
 * True when the arrival window has already started (or passed) relative to
 * "now" in the business timezone. Future dates are never in the past.
 */
export function isSlotPast(
  dateString: string,
  slot: string,
  now: DubaiNow = getDubaiNow(),
): boolean {
  if (!dateString) return false;
  if (dateString < now.dateString) return true;
  if (dateString > now.dateString) return false;
  const start = parseSlotStartMinutes(slot);
  if (start == null) return false;
  return start <= now.minuteOfDay;
}

/** True when at least one of the given slots is still in the future. */
export function hasFutureSlot(
  dateString: string,
  slots: string[],
  now: DubaiNow = getDubaiNow(),
): boolean {
  return slots.some((s) => !isSlotPast(dateString, s, now));
}
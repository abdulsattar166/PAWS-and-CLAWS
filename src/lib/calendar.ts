// Builds a standards-compliant .ics calendar file for a booking so the
// customer can add their appointment to Google / Apple / Outlook in one tap.
//
// The UAE (Asia/Dubai) does not observe daylight saving, so it is a constant
// UTC+4 year-round. We emit UTC timestamps (trailing "Z") which every major
// calendar app understands without needing a VTIMEZONE block.

const UAE_UTC_OFFSET_HOURS = 4;

export interface CalendarEvent {
  ref: string;
  /** Preferred date as YYYY-MM-DD. */
  date: string;
  /** Arrival window, e.g. "9:30 AM – 11:30 AM". */
  timeSlot: string;
  title: string;
  location?: string;
  descriptionLines?: string[];
}

interface DateParts {
  y: number;
  m: number;
  d: number;
}

interface Clock {
  h: number;
  min: number;
}

function parseDateParts(date: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
}

function parseClock(text: string): Clock | null {
  const match = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(text);
  if (!match) return null;
  let h = Number(match[1]) % 12;
  const min = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM") h += 12;
  return { h, min };
}

function splitSlot(slot: string): [string, string] {
  const parts = slot.split(/[–—-]/);
  return [parts[0]?.trim() ?? "", parts[1]?.trim() ?? ""];
}

function toUtcStamp(parts: DateParts, clock: Clock): string {
  // Convert UAE wall-clock time into the equivalent UTC instant.
  const ms = Date.UTC(parts.y, parts.m - 1, parts.d, clock.h - UAE_UTC_OFFSET_HOURS, clock.min, 0);
  const dt = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;
}

function nowStamp(): string {
  const dt = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}${pad(dt.getUTCSeconds())}Z`;
}

function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// RFC 5545 requires content lines to be folded at 75 octets. Most parsers are
// lenient, but folding keeps us safe across every calendar client.
function foldLine(line: string, limit = 74): string {
  if (line.length <= limit) return line;
  const chunks: string[] = [line.slice(0, limit)];
  let rest = line.slice(limit);
  while (rest.length > 0) {
    chunks.push(` ${rest.slice(0, limit - 1)}`);
    rest = rest.slice(limit - 1);
  }
  return chunks.join("\r\n");
}

/** Build the .ics text for a booking. Returns "" if the date/slot can't be parsed. */
export function buildBookingIcs(event: CalendarEvent): string {
  const dateParts = parseDateParts(event.date);
  const [startText, endText] = splitSlot(event.timeSlot);
  const start = parseClock(startText);
  let end = parseClock(endText);
  if (start && !end) end = { h: start.h + 2, min: start.min };
  if (!dateParts || !start || !end) return "";

  const dtStart = toUtcStamp(dateParts, start);
  const dtEnd = toUtcStamp(dateParts, end);

  const description = (event.descriptionLines ?? []).filter(Boolean).join("\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Paws and Claws Pets Grooming Salon//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeIcs(`${event.ref}@pawsandclaws`)}`,
    `DTSTAMP:${nowStamp()}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    event.location ? `LOCATION:${escapeIcs(event.location)}` : "",
    description ? `DESCRIPTION:${escapeIcs(description)}` : "",
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs("Reminder: pet grooming appointment")}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.map((line) => foldLine(line)).join("\r\n");
}

/** Trigger a browser download of the .ics file. */
export function downloadIcs(filename: string, content: string): void {
  if (!content) return;
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  BOOKING_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  aed,
  displayBookingRef,
  formatDateOnly,
  formatDateTime,
  type BookingRow,
} from "@/lib/adminTypes";
import { Card, EmptyState, ErrorState, StatusPill } from "./AdminUi";
import StatCard from "./StatCard";
import { CHART_COLORS, DonutChart, RankBarChart, TrendChart, type NamedValue, type TrendPoint } from "./charts";

const RECENT_FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "completed", label: "Completed" },
  { key: "rejected", label: "Rejected" },
  { key: "cancelled", label: "Cancelled" },
] as const;

type RecentFilter = (typeof RECENT_FILTERS)[number]["key"];

function matchRecent(b: BookingRow, filter: RecentFilter): boolean {
  switch (filter) {
    case "pending":
      return b.admin_status === "pending";
    case "approved":
      return b.admin_status === "approved";
    case "completed":
      return b.booking_status === "completed";
    case "rejected":
      return b.admin_status === "rejected";
    case "cancelled":
      return b.booking_status === "cancelled";
    default:
      return true;
  }
}

function paymentTone(status: string): "neut" | "warn" | "ok" | "bad" {
  if (status === "paid") return "ok";
  if (status === "under_review" || status === "awaiting_transfer") return "warn";
  if (status === "failed") return "bad";
  return "neut";
}

function SectionHeading({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
        <i className={`${icon} text-lg`} aria-hidden="true"></i>
      </span>
      <div>
        <h2 className="font-heading text-lg text-foreground-950 leading-none">{title}</h2>
        <p className="text-xs text-foreground-600 mt-1">{desc}</p>
      </div>
    </div>
  );
}

function DashSkeleton() {
  return (
    <div className="space-y-8">
      {[0, 1, 2].map((section) => (
        <div key={section} className="space-y-3">
          <div className="skeleton h-5 w-44"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-2xl"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ onGoTo }: { onGoTo: (tab: string) => void }) {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [counts, setCounts] = useState({ services: 0, posts: 0, offers: 0, gallery: 0, reviews: 0 });
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [recentFilter, setRecentFilter] = useState<RecentFilter>("all");

  const load = useCallback(async () => {
    if (!supabase) {
      setStatus("error");
      setError("Backend not configured.");
      return;
    }
    setStatus("loading");
    try {
      const [bookingsRes, servicesRes, postsRes, offersRes, galleryRes, reviewsRes] = await Promise.all([
        supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(500),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("offers").select("id", { count: "exact", head: true }).eq("active", true),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }).eq("active", true),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("published", true),
      ]);
      if (bookingsRes.error) throw bookingsRes.error;
      setBookings((bookingsRes.data ?? []) as BookingRow[]);
      setCounts({
        services: servicesRes.count ?? 0,
        posts: postsRes.count ?? 0,
        offers: offersRes.count ?? 0,
        gallery: galleryRes.count ?? 0,
        reviews: reviewsRes.count ?? 0,
      });
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not load dashboard data.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const bookingStats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.admin_status === "pending").length,
      approved: bookings.filter((b) => b.admin_status === "approved").length,
      completed: bookings.filter((b) => b.booking_status === "completed").length,
      rejectedCancelled: bookings.filter((b) => b.admin_status === "rejected" || b.booking_status === "cancelled").length,
    };
  }, [bookings]);

  const paymentStats = useMemo(() => {
    const pending = bookings.filter((b) => b.payment_status !== "paid" && b.payment_status !== "failed");
    const verified = bookings.filter((b) => b.payment_status === "paid");
    return {
      pending: pending.length,
      verified: verified.length,
      revenue: verified.reduce((sum, b) => sum + Number(b.amount ?? 0), 0),
      outstanding: pending.reduce((sum, b) => sum + Number(b.amount ?? 0), 0),
    };
  }, [bookings]);

  const statusData: NamedValue[] = useMemo(
    () => [
      { name: "Pending", value: bookingStats.pending },
      { name: "Approved", value: bookingStats.approved },
      { name: "Completed", value: bookingStats.completed },
      { name: "Cancelled", value: bookings.filter((b) => b.booking_status === "cancelled").length },
      { name: "Rejected", value: bookings.filter((b) => b.admin_status === "rejected").length },
    ],
    [bookings, bookingStats],
  );

  const overTime: TrendPoint[] = useMemo(() => {
    const points: TrendPoint[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      points.push({
        label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        value: bookings.filter((b) => (b.created_at ?? "").slice(0, 10) === key).length,
      });
    }
    return points;
  }, [bookings]);

  const revenueOverTime: TrendPoint[] = useMemo(() => {
    const points: TrendPoint[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const sum = bookings
        .filter((b) => b.payment_status === "paid" && (b.paid_at ?? b.created_at ?? "").slice(0, 10) === key)
        .reduce((acc, b) => acc + Number(b.amount ?? 0), 0);
      points.push({ label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), value: sum });
    }
    return points;
  }, [bookings]);

  const popularServices: NamedValue[] = useMemo(() => {
    const map = new Map<string, number>();
    bookings.forEach((b) => {
      (b.services ?? []).forEach((s) => {
        if (s?.name) map.set(s.name, (map.get(s.name) ?? 0) + 1);
      });
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [bookings]);

  const recent = useMemo(
    () => bookings.filter((b) => matchRecent(b, recentFilter)).slice(0, 8),
    [bookings, recentFilter],
  );

  if (status === "loading") {
    return (
      <div className="admin-fade">
        <DashSkeleton />
      </div>
    );
  }

  if (status === "error") {
    return (
      <Card>
        <ErrorState text={error} onRetry={load} />
      </Card>
    );
  }

  return (
    <div className="space-y-8 admin-fade">
      {/* Bookings */}
      <section className="space-y-4">
        <SectionHeading icon="ri-calendar-check-line" title="Bookings" desc="Everything happening across your bookings." />
        <div className="admin-stagger grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
          <StatCard label="Total bookings" value={bookingStats.total} icon="ri-calendar-line" onClick={() => onGoTo("bookings")} />
          <StatCard label="New / pending" value={bookingStats.pending} icon="ri-time-line" tone="text-secondary-900" onClick={() => onGoTo("bookings")} />
          <StatCard label="Approved" value={bookingStats.approved} icon="ri-check-double-line" tone="text-accent-700" onClick={() => onGoTo("bookings")} />
          <StatCard label="Completed" value={bookingStats.completed} icon="ri-flag-2-line" tone="text-accent-700" onClick={() => onGoTo("bookings")} />
          <StatCard label="Rejected / cancelled" value={bookingStats.rejectedCancelled} icon="ri-close-circle-line" tone="text-foreground-700" onClick={() => onGoTo("bookings")} />
        </div>
      </section>

      {/* Payments */}
      <section className="space-y-4">
        <SectionHeading icon="ri-bank-card-line" title="Payments" desc="Only admin-verified payments count as revenue." />
        <div className="admin-stagger grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard label="Verified revenue" value={paymentStats.revenue} icon="ri-money-dollar-circle-line" tone="text-primary-700" format={(n) => aed(n)} />
          <StatCard label="Pending payments" value={paymentStats.pending} icon="ri-hourglass-line" tone="text-secondary-900" onClick={() => onGoTo("bookings")} />
          <StatCard label="Outstanding amount" value={paymentStats.outstanding} icon="ri-wallet-3-line" format={(n) => aed(n)} onClick={() => onGoTo("bookings")} />
          <StatCard label="Verified payments" value={paymentStats.verified} icon="ri-verified-badge-line" tone="text-accent-700" onClick={() => onGoTo("bookings")} />
        </div>
      </section>

      {/* Website content */}
      <section className="space-y-4">
        <SectionHeading icon="ri-layout-4-line" title="Website content" desc="What's live on your website right now." />
        <div className="admin-stagger grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
          <StatCard label="Total services" value={counts.services} icon="ri-scissors-cut-line" onClick={() => onGoTo("services")} />
          <StatCard label="Active offers" value={counts.offers} icon="ri-price-tag-3-line" tone="text-accent-700" onClick={() => onGoTo("offers")} />
          <StatCard label="Published posts" value={counts.posts} icon="ri-article-line" onClick={() => onGoTo("blog")} />
          <StatCard label="Gallery images" value={counts.gallery} icon="ri-image-2-line" onClick={() => onGoTo("gallery")} />
          <StatCard label="Website reviews" value={counts.reviews} icon="ri-star-line" tone="text-accent-700" onClick={() => onGoTo("reviews")} />
        </div>
      </section>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5">
        <Card className="p-5">
          <h3 className="font-heading text-lg text-foreground-950">Bookings by status</h3>
          <p className="text-xs text-foreground-500">All bookings, live</p>
          <div className="mt-4">
            <DonutChart data={statusData} />
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-heading text-lg text-foreground-950">Bookings over time</h3>
          <p className="text-xs text-foreground-500">Last 14 days</p>
          <div className="mt-2">
            <TrendChart data={overTime} />
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-heading text-lg text-foreground-950">Verified revenue over time</h3>
          <p className="text-xs text-foreground-500">Last 14 days · paid bookings only</p>
          <div className="mt-2">
            <TrendChart data={revenueOverTime} color={CHART_COLORS[1]} currency />
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-heading text-lg text-foreground-950">Most popular services</h3>
          <p className="text-xs text-foreground-500">By number of bookings</p>
          <div className="mt-4">
            <RankBarChart data={popularServices} />
          </div>
        </Card>
      </div>

      {/* Recent bookings */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-5 py-4 border-b border-background-200/70">
          <h3 className="font-heading text-lg text-foreground-950">Recent bookings</h3>
          <div className="flex flex-wrap gap-1.5">
            {RECENT_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setRecentFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap cursor-pointer transition-colors ${
                  recentFilter === f.key
                    ? "bg-primary-500 text-foreground-50 border-primary-500"
                    : "bg-background-50 text-foreground-700 border-background-200 hover:border-primary-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {recent.length === 0 ? (
          <EmptyState icon="ri-inbox-line" title="No bookings here" text="Try another filter to see more." />
        ) : (
          <ul className="divide-y divide-background-200/70">
            {recent.map((b) => {
              const services = (b.services ?? []).map((s) => s.name).filter(Boolean).join(", ");
              return (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => onGoTo("bookings")}
                    className="w-full text-left px-5 py-4 hover:bg-background-100/70 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
                      <div className="md:w-44 min-w-0">
                        <span className="font-heading text-base text-foreground-950">{displayBookingRef(b.booking_ref)}</span>
                        <p className="text-xs text-foreground-500">{formatDateTime(b.created_at)}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground-900 truncate">
                          {b.customer_name} · {b.pet_name ?? "Pet"}
                        </p>
                        <p className="text-xs text-foreground-500 truncate">{services || "—"}</p>
                      </div>
                      <div className="hidden lg:block md:w-32">
                        <p className="text-sm text-foreground-900">{formatDateOnly(b.preferred_date)}</p>
                        <p className="text-xs text-foreground-500 truncate">{b.time_slot}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill label={PAYMENT_STATUS_LABELS[b.payment_status] ?? b.payment_status} tone={paymentTone(b.payment_status)} />
                        <StatusPill label={BOOKING_STATUS_LABELS[b.booking_status] ?? b.booking_status} tone="info" />
                      </div>
                      <span className="font-heading text-base text-foreground-950 whitespace-nowrap lg:w-20 lg:text-right">
                        {aed(b.amount)}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="px-5 py-3 border-t border-background-200/70">
          <button
            type="button"
            onClick={() => onGoTo("bookings")}
            className="text-sm font-semibold text-primary-700 hover:text-primary-600 cursor-pointer"
          >
            View all bookings →
          </button>
        </div>
      </Card>
    </div>
  );
}
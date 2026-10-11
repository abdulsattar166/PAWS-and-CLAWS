import type { AdminNavItem } from "@/pages/admin/adminNav";

/**
 * Friendly placeholder shown for sections that are part of the full plan but
 * not delivered yet. Keeps the navigation complete and honest while each
 * phase is rolled out.
 */
export default function ComingSoon({ item }: { item: AdminNavItem }) {
  return (
    <div className="admin-rise rounded-2xl bg-background-50 border border-background-200/70 px-6 py-12 md:py-16 text-center">
      <span className="mx-auto w-16 h-16 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
        <i className={`${item.icon} text-3xl`} aria-hidden="true"></i>
      </span>
      <h2 className="mt-5 font-heading text-2xl text-foreground-950">{item.label}</h2>
      <p className="mt-2 max-w-md mx-auto text-sm text-foreground-600 leading-relaxed">{item.desc}</p>
      {item.soonNote && (
        <p className="mt-4 max-w-lg mx-auto text-sm text-foreground-700 leading-relaxed">{item.soonNote}</p>
      )}
      {item.soonPhase && (
        <span className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-100 text-secondary-900 text-xs font-semibold">
          <i className="ri-rocket-2-line" aria-hidden="true"></i>
          Arriving in {item.soonPhase}
        </span>
      )}
    </div>
  );
}
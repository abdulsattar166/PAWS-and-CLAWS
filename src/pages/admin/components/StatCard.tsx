import { useCountUp } from "@/hooks/useCountUp";

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  tone?: string;
  format?: (n: number) => string;
  onClick?: () => void;
}

/**
 * Animated dashboard statistic card. The number counts up smoothly and the
 * card becomes actionable (a real button) when an onClick is supplied.
 */
export default function StatCard({ label, value, icon, tone = "text-foreground-950", format, onClick }: StatCardProps) {
  const animated = useCountUp(value);
  const display = format ? format(animated) : Math.round(animated).toLocaleString();

  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] uppercase tracking-[0.12em] text-foreground-500 font-semibold leading-tight">{label}</span>
        <i className={`${icon} text-lg text-foreground-400 shrink-0`} aria-hidden="true"></i>
      </div>
      <p className={`mt-2 font-heading text-2xl md:text-3xl ${tone}`}>{display}</p>
    </>
  );

  const base = "rounded-2xl bg-background-50 border border-background-200/70 p-4 h-full transition-colors";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} text-left cursor-pointer hover:border-primary-300`}>
        {body}
      </button>
    );
  }

  return <div className={base}>{body}</div>;
}
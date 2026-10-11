import type { ReactNode } from "react";

// ---- Shared class strings -------------------------------------------------
export const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg bg-background-50 border border-background-200 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all duration-200";
export const labelCls = "block text-xs font-semibold text-foreground-600 mb-1";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-500 text-foreground-50 text-sm font-semibold hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-background-100 border border-background-200 text-foreground-900 text-sm font-semibold hover:border-primary-300 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60";
export const btnDanger =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60";
export const btnAccent =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent-500 text-background-950 text-sm font-semibold hover:bg-accent-400 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-background-50 border border-background-200/80 ${className}`}>
      {children}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-foreground-500">{hint}</p>}
    </div>
  );
}

const TONES: Record<string, string> = {
  neut: "bg-background-100 text-foreground-700 border-background-200",
  warn: "bg-secondary-100 text-secondary-900 border-secondary-200",
  ok: "bg-accent-100 text-accent-900 border-accent-200",
  info: "bg-primary-100 text-primary-700 border-primary-200",
  bad: "bg-red-50 text-red-700 border-red-200",
};

export function StatusPill({ label, tone = "neut", icon }: { label: string; tone?: keyof typeof TONES; icon?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold whitespace-nowrap ${TONES[tone]}`}>
      {icon && <i className={icon} aria-hidden="true"></i>}
      {label}
    </span>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <span className="w-9 h-9 rounded-full border-2 border-primary-500/25 border-t-primary-500 animate-spin block"></span>
      {label && <p className="text-sm text-foreground-600">{label}</p>}
    </div>
  );
}

export function EmptyState({ icon, title, text }: { icon: string; title: string; text?: string }) {
  return (
    <div className="text-center py-12">
      <span className="mx-auto w-14 h-14 rounded-full bg-background-100 text-foreground-500 flex items-center justify-center">
        <i className={`${icon} text-2xl`} aria-hidden="true"></i>
      </span>
      <p className="mt-4 font-semibold text-foreground-950">{title}</p>
      {text && <p className="mt-1 text-sm text-foreground-600">{text}</p>}
    </div>
  );
}

export function ErrorState({ text, onRetry }: { text: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-12">
      <span className="mx-auto w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
        <i className="ri-error-warning-line text-2xl" aria-hidden="true"></i>
      </span>
      <p className="mt-4 font-semibold text-foreground-950">Something went wrong</p>
      <p className="mt-1 text-sm text-foreground-600">{text}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={`${btnGhost} mt-4`}>
          <i className="ri-refresh-line" aria-hidden="true"></i> Retry
        </button>
      )}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-foreground-950/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>
      <div className={`relative w-full ${wide ? "max-w-3xl" : "max-w-xl"} bg-background-50 rounded-2xl border border-background-200 my-4 md:my-0`}>
        <div className="flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-b border-background-200/80">
          <h3 className="font-heading text-lg text-foreground-950">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-background-100 text-foreground-700 hover:text-foreground-950 cursor-pointer"
          >
            <i className="ri-close-line text-lg" aria-hidden="true"></i>
          </button>
        </div>
        <div className="px-5 md:px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-3 px-5 md:px-6 py-4 border-t border-background-200/80">{footer}</div>}
      </div>
    </div>
  );
}
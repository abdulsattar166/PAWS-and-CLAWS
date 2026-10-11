import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-background-100 text-center px-4">
      <h1 className="absolute bottom-0 text-9xl md:text-[12rem] font-black text-background-200/60 select-none pointer-events-none z-0">
        404
      </h1>
      <div className="relative z-10 max-w-md">
        <span className="mx-auto w-14 h-14 rounded-2xl bg-primary-500 text-foreground-50 flex items-center justify-center">
          <i className="ri-map-pin-2-line text-2xl" aria-hidden="true"></i>
        </span>
        <h1 className="mt-5 font-heading text-2xl md:text-3xl text-foreground-950">Page not found</h1>
        <p className="mt-3 text-sm md:text-base text-foreground-600 leading-relaxed">
          We couldn&apos;t find the page you were looking for. It may have moved or no longer exists.
        </p>
        <p className="mt-2 text-xs text-foreground-400 font-mono break-all">{location.pathname}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-foreground-50 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-home-4-line" aria-hidden="true"></i> Back to home
          </Link>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 rounded-full border border-background-200 bg-background-50 px-6 py-3 text-sm font-semibold text-foreground-950 hover:border-primary-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-calendar-check-line" aria-hidden="true"></i> Book a groom
          </Link>
        </div>
      </div>
    </main>
  );
}

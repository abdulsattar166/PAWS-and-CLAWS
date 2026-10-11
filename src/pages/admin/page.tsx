import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLogin from "./components/AdminLogin";
import AdminSidebar from "./components/AdminSidebar";
import ComingSoon from "./components/ComingSoon";
import Dashboard from "./components/Dashboard";
import BookingsManager from "./components/BookingsManager";
import ServicesTabs from "./components/ServicesTabs";
import PackagesManager from "./components/PackagesManager";
import OffersManager from "./components/OffersManager";
import BlogManager from "./components/BlogManager";
import ContentManager from "./components/ContentManager";
import PageEditor from "./components/PageEditor";
import AdminProfile from "./components/AdminProfile";
import GlobalSearch from "./components/GlobalSearch";
import GalleryManager from "./components/GalleryManager";
import ReviewsManager from "./components/ReviewsManager";
import GoogleReviewsManager from "./components/GoogleReviewsManager";
import NavFooterManager from "./components/NavFooterManager";
import MedicalEditor from "./components/MedicalEditor";
import PaymentsManager from "./components/PaymentsManager";
import MessagesManager from "./components/MessagesManager";
import { ADMIN_NAV_FLAT } from "./adminNav";
import type { PageKey } from "@/lib/pageContent";
import { btnGhost } from "./components/AdminUi";

const SOON_KEYS: string[] = [];
const PAGE_KEYS: PageKey[] = ["home", "about", "contact"];

export default function Admin() {
  const auth = useAdminAuth();
  const [tab, setTab] = useState("overview");
  const [bookingRef, setBookingRef] = useState<string | undefined>(undefined);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("pc_admin_sidebar_collapsed") === "1";
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("pc_admin_sidebar_collapsed", collapsed ? "1" : "0");
    } catch {
      /* storage unavailable — non-critical */
    }
  }, [collapsed]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const active = ADMIN_NAV_FLAT.find((n) => n.key === tab) ?? ADMIN_NAV_FLAT[0];

  const goTo = (next: string, ref?: string) => {
    setBookingRef(ref);
    setTab(next);
    setMobileOpen(false);
  };

  if (auth.checking) {
    return (
      <main className="min-h-screen bg-background-100 flex items-center justify-center">
        <span className="w-10 h-10 rounded-full border-2 border-primary-500/25 border-t-primary-500 animate-spin block"></span>
      </main>
    );
  }

  if (!auth.session) {
    return <AdminLogin auth={auth} />;
  }

  if (!auth.isAdmin) {
    return (
      <main className="min-h-screen bg-background-100 flex items-center justify-center px-4">
        <div className="max-w-md text-center rounded-2xl bg-background-50 border border-background-200/80 p-8">
          <span className="mx-auto w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <i className="ri-lock-line text-2xl" aria-hidden="true"></i>
          </span>
          <h1 className="mt-4 font-heading text-2xl text-foreground-950">Access denied</h1>
          <p className="mt-2 text-sm text-foreground-600">
            This account ({auth.session.user.email}) is signed in but is not an administrator.
          </p>
          <button type="button" onClick={auth.signOut} className={`${btnGhost} mt-5`}>
            <i className="ri-logout-box-line" aria-hidden="true"></i> Sign out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-100 text-foreground-950">
      <div className="flex min-h-screen">
        <AdminSidebar
          active={tab}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onSelect={goTo}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          onCloseMobile={() => setMobileOpen(false)}
          onLogout={auth.signOut}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          <header className="sticky top-0 z-[90] flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3.5 border-b border-background-200/70 bg-background-100/85 backdrop-blur">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-background-50 border border-background-200 text-foreground-900 cursor-pointer shrink-0"
            >
              <i className="ri-menu-line text-xl" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle sidebar"
              className="hidden lg:flex w-10 h-10 items-center justify-center rounded-lg bg-background-50 border border-background-200 text-foreground-900 cursor-pointer shrink-0"
            >
              <i className={`${collapsed ? "ri-menu-line" : "ri-menu-2-line"} text-xl`} aria-hidden="true"></i>
            </button>

            <div className="min-w-0 hidden xl:block">
              <h1 className="font-heading text-lg text-foreground-950 truncate">{active.label}</h1>
              <p className="text-xs text-foreground-600 truncate">{active.desc}</p>
            </div>

            <div className="flex-1 hidden md:flex justify-center">
              <GlobalSearch onGoTo={goTo} />
            </div>

            <span className="hidden 2xl:inline text-xs text-foreground-500 truncate max-w-[150px] shrink-0">{auth.session.user.email}</span>
            <Link to="/" className={`${btnGhost} px-3 shrink-0`}>
              <i className="ri-external-link-line" aria-hidden="true"></i>
              <span className="hidden sm:inline">View site</span>
            </Link>
            <button type="button" onClick={auth.signOut} className={`${btnGhost} px-3 shrink-0`}>
              <i className="ri-logout-box-line" aria-hidden="true"></i>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </header>

          {/* Mobile search row */}
          <div className="md:hidden px-4 pt-3">
            <GlobalSearch onGoTo={goTo} />
          </div>

          <div className="px-4 md:px-8 py-6 md:py-8">
            {tab === "overview" && <Dashboard onGoTo={goTo} />}
            {tab === "bookings" && <BookingsManager openRef={bookingRef} />}
            {tab === "payments" && <PaymentsManager />}
            {tab === "messages" && <MessagesManager />}
            {tab === "services" && <ServicesTabs />}
            {tab === "packages" && <PackagesManager />}
            {tab === "offers" && <OffersManager />}
            {tab === "blog" && <BlogManager />}
            {tab === "settings" && <ContentManager />}
            {tab === "navfooter" && <NavFooterManager />}
            {tab === "gallery" && <GalleryManager />}
            {tab === "reviews" && <ReviewsManager />}
            {tab === "googleReviews" && <GoogleReviewsManager />}
            {tab === "medical" && <MedicalEditor />}
            {PAGE_KEYS.includes(tab as PageKey) && <PageEditor key={tab} initial={tab as PageKey} />}
            {tab === "profile" && <AdminProfile />}
            {SOON_KEYS.includes(tab) && <ComingSoon item={active} />}
          </div>
        </div>
      </div>
    </main>
  );
}
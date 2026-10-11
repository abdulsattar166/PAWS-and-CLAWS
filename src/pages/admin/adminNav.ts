// Central navigation map for the Admin Panel.
//
// Sections that are not built yet carry a `soon` flag plus the rollout phase,
// so the shell can present the complete information architecture while each
// phase is delivered — the full navigation exists, nothing is a dead link.

export interface AdminNavItem {
  key: string;
  label: string;
  icon: string;
  desc: string;
  soon?: boolean;
  soonPhase?: string;
  soonNote?: string;
}

export interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        key: "overview",
        label: "Dashboard",
        icon: "ri-dashboard-3-line",
        desc: "A real-time look at bookings, payments and your website.",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        key: "bookings",
        label: "Bookings Management",
        icon: "ri-calendar-check-line",
        desc: "Review every booking, verify payments and update service status.",
      },
      {
        key: "payments",
        label: "Payments Management",
        icon: "ri-bank-card-line",
        desc: "Verify bank transfers and reconcile payments.",
      },
      {
        key: "messages",
        label: "Messages & Subscribers",
        icon: "ri-mail-line",
        desc: "Read contact messages and newsletter sign-ups.",
      },
    ],
  },
  {
    title: "Catalog",
    items: [
      {
        key: "services",
        label: "Services Management",
        icon: "ri-scissors-cut-line",
        desc: "Manage services, pet categories, prices and availability.",
      },
      {
        key: "packages",
        label: "Packages Management",
        icon: "ri-gift-line",
        desc: "Build and edit grooming packages treatment by treatment.",
      },
      {
        key: "offers",
        label: "Offers & Discounts",
        icon: "ri-price-tag-3-line",
        desc: "Create promotions and discount campaigns.",
      },
    ],
  },
  {
    title: "Website Content",
    items: [
      {
        key: "home",
        label: "Home Page",
        icon: "ri-home-4-line",
        desc: "Edit every section of the Home page.",
      },
      {
        key: "about",
        label: "About Page",
        icon: "ri-information-line",
        desc: "Edit every section of the About page.",
      },
      {
        key: "contact",
        label: "Contact Page",
        icon: "ri-contacts-book-2-line",
        desc: "Edit the Contact page content and details.",
      },
      {
        key: "blog",
        label: "Blog Management",
        icon: "ri-article-line",
        desc: "Write, publish and manage articles.",
      },
      {
        key: "gallery",
        label: "Gallery Management",
        icon: "ri-image-2-line",
        desc: "Upload and organise every gallery image.",
      },
      {
        key: "reviews",
        label: "Reviews Management",
        icon: "ri-star-line",
        desc: "Manage testimonials and connect Google reviews.",
      },
      {
        key: "googleReviews",
        label: "Google Reviews",
        icon: "ri-google-fill",
        desc: "Connect your Google Business Profile and manage genuine Google reviews.",
      },
      {
        key: "medical",
        label: "Medical & Special Care",
        icon: "ri-first-aid-kit-line",
        desc: "Edit special-care content and guidance.",
      },
    ],
  },
  {
    title: "Site Configuration",
    items: [
      {
        key: "navfooter",
        label: "Navigation & Footer",
        icon: "ri-layout-top-line",
        desc: "Manage nav links and footer content.",
      },
      {
        key: "settings",
        label: "Website Settings",
        icon: "ri-settings-3-line",
        desc: "Business details, contact points and global content.",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        key: "profile",
        label: "Admin Profile",
        icon: "ri-user-settings-line",
        desc: "Manage your admin account and security.",
      },
      {
        key: "logout",
        label: "Logout",
        icon: "ri-logout-box-line",
        desc: "Sign out of the Admin Panel.",
      },
    ],
  },
];

export const ADMIN_NAV_FLAT: AdminNavItem[] = ADMIN_NAV.flatMap((g) => g.items);
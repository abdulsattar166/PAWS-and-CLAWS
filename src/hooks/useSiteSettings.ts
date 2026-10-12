import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BANK_DETAILS, BUSINESS, SOCIAL_LINKS } from "@/lib/businessConfig";
import { googleDemoReviews } from "@/mocks/googleDemoReviews";

export interface ContactSettings {
  phone: string;
  whatsapp: string;
  whatsappNumber: string;
  /** WhatsApp number that receives new-booking alerts (digits only). */
  adminWhatsapp: string;
  email: string;
  address: string;
  hours: string;
}

export interface BankSettings {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  iban: string;
  swift: string;
  currency: string;
}

export interface HomeSettings {
  heroTitle: string;
  heroSubtitle: string;
  bannerText: string;
  bannerActive: boolean;
}

/** A single editable link used by the top navigation and the footer. */
export interface NavLink {
  label: string;
  href: string;
  icon: string;
}

export interface NavigationSettings {
  links: NavLink[];
}

export interface FooterSettings {
  tagline: string;
  exploreTitle: string;
  exploreLinks: NavLink[];
  contactTitle: string;
  legalLinks: NavLink[];
  socials: NavLink[];
  copyright: string;
}

export interface GoogleDemoReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
}

/**
 * Configuration for the Google Business Profile reviews integration. Genuine
 * reviews themselves are never stored here — only the connection options, the
 * display preferences, and the temporary (removable) demo entries used to
 * preview the design before the live integration is switched on.
 */
export interface GoogleReviewsSettings {
  enabled: boolean;
  layout: "carousel" | "grid";
  maxCount: number;
  placeId: string;
  profileUrl: string;
  mapsUrl: string;
  showDemo: boolean;
  demoReviews: GoogleDemoReview[];
  lastSync: string | null;
  lastStatus: "ok" | "error" | "unconfigured" | "never";
}

export interface SiteSettings {
  contact: ContactSettings;
  bank: BankSettings;
  home: HomeSettings;
  navigation: NavigationSettings;
  footer: FooterSettings;
  googleReviews: GoogleReviewsSettings;
}

const DEFAULT_NAVIGATION: NavigationSettings = {
  links: [
    { label: "Home", href: "/", icon: "ri-home-4-line" },
    { label: "About Us", href: "/about", icon: "ri-information-line" },
    { label: "Services", href: "/services", icon: "ri-scissors-cut-line" },
    { label: "Blog", href: "/blog", icon: "ri-article-line" },
    { label: "Gallery", href: "/gallery", icon: "ri-gallery-line" },
    { label: "Contact", href: "/contact", icon: "ri-phone-line" },
  ],
};

const DEFAULT_FOOTER: FooterSettings = {
  tagline: "Bringing calm, cage-free grooming to pets across the UAE, one happy tail at a time.",
  exploreTitle: "Explore",
  exploreLinks: [
    { label: "Home", href: "/", icon: "ri-home-4-line" },
    { label: "About Us", href: "/about", icon: "ri-information-line" },
    { label: "Services", href: "/services", icon: "ri-scissors-cut-line" },
    { label: "Booking", href: "/booking", icon: "ri-calendar-check-line" },
    { label: "Gallery", href: "/gallery", icon: "ri-gallery-line" },
    { label: "Blog", href: "/blog", icon: "ri-article-line" },
    { label: "Find my booking", href: "/find-booking", icon: "ri-search-line" },
    { label: "Track Your Order", href: "/find-booking", icon: "ri-route-line" },
  ],
  contactTitle: "Get in touch",
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy", icon: "" },
    { label: "Booking Policies", href: "/booking-policies", icon: "" },
    { label: "Terms of Service", href: "#", icon: "" },
    { label: "Trade licence", href: "#", icon: "" },
  ],
  socials: [
    { label: "Instagram", href: SOCIAL_LINKS.instagram, icon: "ri-instagram-line" },
    { label: "Facebook", href: SOCIAL_LINKS.facebook, icon: "ri-facebook-fill" },
    { label: "TikTok", href: SOCIAL_LINKS.tiktok, icon: "ri-tiktok-line" },
    { label: "Snapchat", href: SOCIAL_LINKS.snapchat, icon: "ri-snapchat-line" },
    { label: "WhatsApp", href: `https://wa.me/${BUSINESS.whatsappNumber}`, icon: "ri-whatsapp-line" },
  ],
  copyright: "© 2026 Paws and Claws Pets Grooming Salon LLC. All rights reserved.",
};

const DEFAULT_GOOGLE_REVIEWS: GoogleReviewsSettings = {
  enabled: true,
  layout: "carousel",
  maxCount: 6,
  placeId: "",
  profileUrl: "https://share.google/lbJzPyeVQPUyaQVIr",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Paws+and+Claws+Pets+Grooming+Salon+Abu+Dhabi",
  showDemo: true,
  demoReviews: googleDemoReviews,
  lastSync: null,
  lastStatus: "never",
};

export const FALLBACK_SETTINGS: SiteSettings = {
  contact: {
    phone: BUSINESS.phone,
    whatsapp: BUSINESS.whatsapp,
    whatsappNumber: BUSINESS.whatsappNumber,
    adminWhatsapp: BUSINESS.whatsappNumber,
    email: BUSINESS.email,
    address: "Abu Dhabi & Al Ain",
    hours: "Daily 8:00 AM – 8:00 PM",
  },
  bank: { ...BANK_DETAILS },
  home: {
    heroTitle: "Premium Mobile Pet Grooming in Al Ain",
    heroSubtitle: "Gentle, salon-quality grooming for your dog or cat — delivered right to your doorstep.",
    bannerText: "",
    bannerActive: false,
  },
  navigation: DEFAULT_NAVIGATION,
  footer: DEFAULT_FOOTER,
  googleReviews: DEFAULT_GOOGLE_REVIEWS,
};

function merge(settings: {
  contact?: Partial<ContactSettings>;
  bank?: Partial<BankSettings>;
  home?: Partial<HomeSettings>;
  navigation?: Partial<NavigationSettings>;
  footer?: Partial<FooterSettings>;
  googleReviews?: Partial<GoogleReviewsSettings>;
}): SiteSettings {
  return {
    contact: { ...FALLBACK_SETTINGS.contact, ...(settings.contact ?? {}) },
    bank: { ...FALLBACK_SETTINGS.bank, ...(settings.bank ?? {}) },
    home: { ...FALLBACK_SETTINGS.home, ...(settings.home ?? {}) },
    navigation: {
      ...DEFAULT_NAVIGATION,
      ...(settings.navigation ?? {}),
      links:
        settings.navigation?.links && settings.navigation.links.length
          ? settings.navigation.links
          : DEFAULT_NAVIGATION.links,
    },
    footer: { ...DEFAULT_FOOTER, ...(settings.footer ?? {}) },
    googleReviews: { ...DEFAULT_GOOGLE_REVIEWS, ...(settings.googleReviews ?? {}) },
  };
}

/**
 * Reads the editable site settings (contact, bank, home, navigation, footer)
 * from the database. Falls back to the built-in defaults when a key is missing
 * so the public site never renders blank.
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");
      if (error) throw error;
      const map: Record<string, unknown> = {};
      (data ?? []).forEach((row) => {
        const r = row as { key: string; value: Record<string, unknown> };
        map[r.key] = r.value;
      });
      setSettings(
        merge({
          contact: map.contact as Partial<ContactSettings> | undefined,
          bank: map.bank as Partial<BankSettings> | undefined,
          home: map.home as Partial<HomeSettings> | undefined,
          navigation: map.navigation as Partial<NavigationSettings> | undefined,
          footer: map.footer as Partial<FooterSettings> | undefined,
          googleReviews: map.google_reviews as Partial<GoogleReviewsSettings> | undefined,
        }),
      );
    } catch {
      setSettings(FALLBACK_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { settings, loading, reload: load };
}
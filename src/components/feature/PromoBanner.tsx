import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useOffers } from "@/hooks/useOffers";

/**
 * Promotional banner shown on key pages. Prefers an active offer's banner text,
 * falling back to the home banner set in the Admin Panel. Renders nothing when
 * there is no live promotion.
 */
export default function PromoBanner({ className = "" }: { className?: string }) {
  const { settings } = useSiteSettings();
  const { offers } = useOffers();

  const offerText = offers.find((o) => (o.banner_text ?? "").trim())?.banner_text?.trim();
  const homeText = settings.home.bannerActive ? settings.home.bannerText.trim() : "";
  const text = offerText || homeText;
  if (!text) return null;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-2xl bg-accent-500 px-4 py-3 text-center text-sm font-semibold text-background-950">
        <i className="ri-price-tag-3-line text-base" aria-hidden="true"></i>
        <span>{text}</span>
      </div>
    </div>
  );
}
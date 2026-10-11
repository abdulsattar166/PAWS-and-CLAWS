import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "@/components/feature/Logo";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Footer() {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
  const { footer, contact } = settings;

  const socials = footer.socials ?? [];
  const exploreLinks = footer.exploreLinks ?? [];
  const legalLinks = footer.legalLinks ?? [];

  return (
    <footer className="bg-background-950 text-foreground-700 pt-14 md:pt-20 pb-8 md:pb-10 px-4 md:px-10 safe-bottom">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-14 mb-10 md:mb-14">
          <div className="md:col-span-2">
            <Link to="/">
              <Logo variant="light" />
            </Link>
            <p className="mt-6 text-foreground-600 leading-relaxed max-w-md">
              Paws and Claws Pets Grooming Salon LLC — {footer.tagline}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="btn-pulse w-10 h-10 rounded-full bg-white/10 hover:bg-accent-500 hover:text-background-950 text-foreground-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <i className={s.icon} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent-500 font-semibold mb-5">{footer.exploreTitle}</p>
            <ul className="space-y-3 text-sm">
              {exploreLinks.map((link, i) => (
                <li key={`${link.href}-${i}`}>
                  <Link to={link.href} className="hover:text-accent-500 cursor-pointer">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent-500 font-semibold mb-5">{footer.contactTitle}</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <i className="ri-phone-line mt-0.5" aria-hidden="true"></i>
                <a href={contact.phone.replace(/\s/g, "") ? `tel:${contact.phone.replace(/\s/g, "")}` : "#"} className="hover:text-accent-500 cursor-pointer">{contact.phone}</a>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-whatsapp-line mt-0.5" aria-hidden="true"></i>
                <a href={`https://wa.me/${contact.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent-500 cursor-pointer">{contact.whatsapp}</a>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-mail-line mt-0.5" aria-hidden="true"></i>
                <a href={`mailto:${contact.email}`} className="hover:text-accent-500 cursor-pointer break-all">{contact.email}</a>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-map-pin-line mt-0.5" aria-hidden="true"></i>
                <span>{contact.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-time-line mt-0.5" aria-hidden="true"></i>
                <span>{contact.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-600">
          <p>{footer.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {legalLinks.map((link, i) => (
              <Link key={`${link.href}-${i}`} to={link.href} className="hover:text-accent-500 cursor-pointer whitespace-nowrap">{link.label}</Link>
            ))}
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-foreground-100 font-semibold hover:bg-accent-500 hover:text-background-950 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-lock-line text-sm" aria-hidden="true"></i>
              {t("footer.management")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
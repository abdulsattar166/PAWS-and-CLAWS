import { useTranslation } from "react-i18next";

interface LanguageSwitcherProps {
  scrolled: boolean;
}

export default function LanguageSwitcher({ scrolled }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();

  const toggle = () => {
    const next = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap cursor-pointer ${
        scrolled
          ? "border-foreground-700/50 text-foreground-800 hover:border-accent-400 hover:text-accent-500"
          : "border-foreground-900/40 text-foreground-900 hover:border-secondary-300 hover:text-secondary-300"
      }`}
    >
      {t("lang.switch")}
    </button>
  );
}
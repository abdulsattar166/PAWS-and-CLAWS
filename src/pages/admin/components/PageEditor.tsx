import { useEffect, useState } from "react";
import type { PageKey } from "@/lib/pageContent";
import HomeEditor from "./HomeEditor";
import AboutEditor from "./AboutEditor";
import ContactEditor from "./ContactEditor";

const TABS: { key: PageKey; label: string; icon: string }[] = [
  { key: "home", label: "Home Page", icon: "ri-home-4-line" },
  { key: "about", label: "About Page", icon: "ri-information-line" },
  { key: "contact", label: "Contact Page", icon: "ri-contacts-book-2-line" },
];

export default function PageEditor({ initial = "home" }: { initial?: PageKey }) {
  const [tab, setTab] = useState<PageKey>(initial);

  useEffect(() => {
    setTab(initial);
  }, [initial]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-1.5 rounded-full bg-background-100 border border-background-200/70 p-1 w-fit max-w-full">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              tab === t.key ? "bg-primary-500 text-foreground-50" : "text-foreground-700 hover:bg-background-50"
            }`}
          >
            <i className={t.icon} aria-hidden="true"></i>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "home" && <HomeEditor />}
      {tab === "about" && <AboutEditor />}
      {tab === "contact" && <ContactEditor />}
    </div>
  );
}
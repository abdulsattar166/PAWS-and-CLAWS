import { useState } from "react";
import ServicesManager from "./ServicesManager";
import PetCategoriesManager from "./PetCategoriesManager";

type Tab = "services" | "categories";

/**
 * Groups the Services list and the configurable Pet Categories into one
 * "Services Management" destination, so both live together as the brief
 * describes.
 */
export default function ServicesTabs() {
  const [tab, setTab] = useState<Tab>("services");

  return (
    <div className="space-y-5">
      <div className="inline-flex items-center gap-1 p-1 rounded-full bg-background-100 border border-background-200/70">
        <button
          type="button"
          onClick={() => setTab("services")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${tab === "services" ? "bg-primary-500 text-foreground-50" : "text-foreground-700 hover:text-foreground-950"}`}
        >
          <i className="ri-scissors-cut-line" aria-hidden="true"></i> Services
        </button>
        <button
          type="button"
          onClick={() => setTab("categories")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${tab === "categories" ? "bg-primary-500 text-foreground-50" : "text-foreground-700 hover:text-foreground-950"}`}
        >
          <i className="ri-price-tag-3-line" aria-hidden="true"></i> Pet Categories
        </button>
      </div>

      {tab === "services" ? <ServicesManager /> : <PetCategoriesManager />}
    </div>
  );
}
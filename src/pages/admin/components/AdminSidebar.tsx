import { ADMIN_NAV, type AdminNavItem } from "@/pages/admin/adminNav";

interface AdminSidebarProps {
  active: string;
  collapsed: boolean;
  mobileOpen: boolean;
  onSelect: (key: string) => void;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onLogout: () => void;
}

/**
 * Responsive Admin sidebar.
 * - Desktop (lg+): static rail, collapsible to an icon-only width.
 * - Mobile/tablet: off-canvas drawer that slides in over a dimmed overlay.
 */
export default function AdminSidebar({
  active,
  collapsed,
  mobileOpen,
  onSelect,
  onToggleCollapse,
  onCloseMobile,
  onLogout,
}: AdminSidebarProps) {
  const handle = (item: AdminNavItem) => {
    if (item.key === "logout") {
      onLogout();
      return;
    }
    onSelect(item.key);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-foreground-950/60 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onCloseMobile}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-background-50 border-r border-background-200/70 transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:bottom-auto lg:z-20 lg:h-screen lg:shrink-0 lg:translate-x-0 ${
          collapsed ? "lg:w-[84px]" : "lg:w-72"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Brand */}
        <div className={`flex items-center gap-3 h-16 px-4 border-b border-background-200/60 shrink-0 ${collapsed ? "lg:justify-center lg:px-0" : ""}`}>
          <span className="w-10 h-10 rounded-xl bg-primary-500 text-foreground-50 flex items-center justify-center shrink-0">
            <i className="ri-shield-keyhole-line text-xl" aria-hidden="true"></i>
          </span>
          <div className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}>
            <p className="font-heading text-base leading-none text-foreground-950 whitespace-nowrap">Paws &amp; Claws</p>
            <p className="text-[11px] text-foreground-500 mt-1 whitespace-nowrap">Admin Panel</p>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-background-100 text-foreground-700 cursor-pointer"
          >
            <i className="ri-close-line text-lg" aria-hidden="true"></i>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {ADMIN_NAV.map((group) => (
            <div key={group.title} className="mb-1">
              <p className={`px-3 pt-3 pb-1.5 text-[10px] uppercase tracking-[0.16em] text-foreground-500 font-semibold ${collapsed ? "lg:hidden" : ""}`}>
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = item.key === active;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      title={item.label}
                      onClick={() => handle(item)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        collapsed ? "lg:justify-center lg:gap-0 lg:px-0" : ""
                      } ${
                        isActive
                          ? "bg-primary-500 text-foreground-50"
                          : "text-foreground-700 hover:bg-background-100 hover:text-foreground-950"
                      }`}
                    >
                      <i className={`${item.icon} text-lg shrink-0`} aria-hidden="true"></i>
                      <span className={`flex-1 truncate ${collapsed ? "lg:hidden" : ""}`}>{item.label}</span>
                      {item.soon && (
                        <span
                          className={`shrink-0 w-1.5 h-1.5 rounded-full bg-accent-500 ${collapsed ? "lg:hidden" : ""}`}
                          aria-hidden="true"
                        ></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse control (desktop only) */}
        <div className="shrink-0 border-t border-background-200/60 p-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground-700 hover:bg-background-100 cursor-pointer transition-colors ${
              collapsed ? "lg:justify-center lg:gap-0 lg:px-0" : ""
            }`}
          >
            <i className={`${collapsed ? "ri-arrow-right-s-line" : "ri-arrow-left-s-line"} text-lg shrink-0`} aria-hidden="true"></i>
            <span className={collapsed ? "lg:hidden" : ""}>Collapse</span>
          </button>
        </div>
      </aside>
    </>
  );
}
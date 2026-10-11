import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Central scroll controller for the whole app.
 * - Every new page opens from the very top (scroll position reset to 0).
 * - Hash links (e.g. /contact#booking) scroll precisely to their target section.
 * - Prevents the browser/router from restoring the previous scroll position.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    const pathChanged = prevPathname.current !== pathname;
    prevPathname.current = pathname;

    if (hash) {
      // Landing on a new page with a hash: reset to top first, then glide to the section.
      if (pathChanged) {
        window.scrollTo(0, 0);
      }
      const id = hash.replace("#", "");
      const timer = window.setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          // Offset for the fixed navbar so the target sits at the top of the viewport.
          const navOffset = 84;
          const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
      }, 120);
      return () => window.clearTimeout(timer);
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
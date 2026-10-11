import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { PageContentMap, PageKey } from "@/lib/pageContent";

/**
 * Reads the editable content for a single marketing page from the `pages`
 * table. Only the fields the administrator has actually saved are returned —
 * anything missing falls back to the built-in defaults at the call site, so
 * the live site never renders blank.
 */
export function usePageContent<K extends PageKey>(key: K) {
  const [content, setContent] = useState<Partial<PageContentMap[K]>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      const row = data as { value?: Partial<PageContentMap[K]> } | null;
      setContent(row?.value ?? {});
    } catch {
      setContent({});
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    load();
  }, [load]);

  return { content, loading, reload: load };
}
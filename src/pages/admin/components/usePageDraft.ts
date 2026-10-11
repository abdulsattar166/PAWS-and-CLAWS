import { useEffect, useState } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import { PAGE_DEFAULTS, type PageContentMap, type PageKey } from "@/lib/pageContent";
import { persistPage } from "./PageEditorFields";

/**
 * Local draft state for a page editor. Loads the saved content, merges it over
 * the built-in defaults (so every field is present and editable), and saves the
 * whole object back to the `pages` table.
 */
export function usePageDraft<K extends PageKey>(key: K) {
  const { content } = usePageContent(key);
  const [draft, setDraft] = useState<PageContentMap[K]>(() => PAGE_DEFAULTS[key]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Deep-merge the nested `sections` visibility map so a partially-saved
    // object can never leave a section toggle undefined.
    const def = PAGE_DEFAULTS[key] as unknown as Record<string, unknown>;
    const saved = content as Record<string, unknown>;
    const merged: Record<string, unknown> = { ...def, ...saved };
    const defSections = def.sections as Record<string, boolean> | undefined;
    if (defSections) {
      const savedSections = (saved.sections ?? {}) as Record<string, boolean>;
      merged.sections = { ...defSections, ...savedSections };
    }
    setDraft(merged as unknown as PageContentMap[K]);
  }, [content, key]);

  const patch = (p: Partial<PageContentMap[K]>) => setDraft((d) => ({ ...d, ...p }));

  const save = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    const err = await persistPage(key, draft);
    setSaving(false);
    if (err) {
      setError(err);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return { draft, patch, save, saving, saved, error };
}
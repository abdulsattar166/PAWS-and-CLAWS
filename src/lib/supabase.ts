import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_PUBLIC_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export const isBackendConfigured = Boolean(url && anonKey);

// Single shared client instance for the whole app (never create more than one).
export const supabase: SupabaseClient | null = isBackendConfigured
  ? createClient(url as string, anonKey as string)
  : null;

export const functionsBaseUrl = url ? `${url}/functions/v1` : "";

export const supabaseAnonKey = anonKey ?? "";

// Base path prefix (accounts for the app being served under a sub-path).
export const basePathPrefix = (() => {
  const base = __BASE_PATH__.split("/").filter(Boolean).join("/");
  return base ? `/${base}` : "";
})();
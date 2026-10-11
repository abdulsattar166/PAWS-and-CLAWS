import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface AdminAuthState {
  session: Session | null;
  checking: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

/**
 * Admin authentication. Login is real Supabase Auth (email + password);
 * membership is verified against the `admin_users` table (enforced again by RLS
 * on every table, so the client check is only a UX gate).
 */
export function useAdminAuth(): AdminAuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const verifyAdmin = useCallback(async (userId: string) => {
    if (!supabase) {
      setIsAdmin(false);
      return;
    }
    try {
      const { data } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();
      setIsAdmin(Boolean(data));
    } catch {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session);
        setChecking(false);
        if (data.session?.user?.id) verifyAdmin(data.session.user.id);
      })
      .catch(() => {
        if (active) setChecking(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user?.id) {
        verifyAdmin(nextSession.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [verifyAdmin]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return { ok: false, error: "Backend not configured." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setIsAdmin(false);
  }, []);

  return { session, checking, isAdmin, signIn, signOut };
}
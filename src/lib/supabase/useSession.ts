"use client";

import { useEffect, useState } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./client";
import { isSupabaseConfigured } from "./config";

export function useSupabaseSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const t = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(t);
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    (async () => {
      try {
        const result = await Promise.race([
          supabase.auth.getUser(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error("offline")), 3000)),
        ]);
        setUser(result.data.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading, isConfigured: isSupabaseConfigured };
}

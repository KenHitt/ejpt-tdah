import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { EMPTY_PROGRESS, ProgressState } from "./state";

/** Carga el snapshot de progreso del usuario autenticado desde Supabase. */
export async function loadSupabaseProgress(userId: string): Promise<ProgressState | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("progress_snapshots")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return { ...EMPTY_PROGRESS, ...(data.data as Partial<ProgressState>), checklists: (data.data as Partial<ProgressState>).checklists ?? {} };
}

/** Guarda (upsert) el snapshot completo de progreso en Supabase. */
export async function saveSupabaseProgress(userId: string, state: ProgressState): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("progress_snapshots")
    .upsert({ user_id: userId, data: state }, { onConflict: "user_id" });

  return !error;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SimulacroAttempt, StudySessionLog, SubtopicFailure } from "@/lib/types";
import { StuckNote, TrainerAttempt } from "@/lib/trainer/types";
import { useSupabaseSession } from "@/lib/supabase/useSession";
import { EMPTY_PROGRESS, ProgressState } from "./state";
import { loadLocalProgress, saveLocalProgress, mergeProgress } from "./localBackend";
import { loadSupabaseProgress, saveSupabaseProgress } from "./supabaseBackend";

interface ProgressContextValue {
  state: ProgressState;
  ready: boolean;
  syncMode: "local" | "cloud";
  toggleBlockComplete: (blockId: string, completed: boolean) => void;
  reportFailure: (subtopicId: string) => SubtopicFailure;
  resolveFailure: (subtopicId: string) => void;
  addAttempt: (attempt: SimulacroAttempt) => void;
  addSession: (session: StudySessionLog) => void;
  markFullSimulacroFailedToday: () => void;
  canTakeFullSimulacroToday: () => boolean;
  ensurePlanStarted: () => void;
  resetAll: () => void;
  toggleChecklistItem: (blockId: string, index: number, checked: boolean) => void;
  importState: (next: ProgressState) => void;
  recordTrainerAttempt: (attempt: Omit<TrainerAttempt, "id" | "at">) => void;
  recordHintLevel: (key: string, level: number) => void;
  recordStuck: (note: Omit<StuckNote, "id" | "at">) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: sessionLoading, isConfigured } = useSupabaseSession();
  const [state, setState] = useState<ProgressState>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);
  const hydratedRef = useRef(false);

  const syncMode: "local" | "cloud" = isConfigured && user ? "cloud" : "local";

  // Hidratación inicial: local primero (rápido), luego Supabase si aplica (fuente de verdad).
  useEffect(() => {
    if (sessionLoading) return;

    let cancelled = false;
    (async () => {
      const local = loadLocalProgress();
      if (!cancelled) {
        setState(local);
        setReady(true);
      }

      if (isConfigured && user && typeof navigator !== "undefined" && navigator.onLine) {
        const cloud = await Promise.race([
          loadSupabaseProgress(user.id),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000)),
        ]);
        if (!cancelled && cloud) {
          const merged = mergeProgress(local, cloud);
          setState(merged);
          saveLocalProgress(merged);
          saveSupabaseProgress(user.id, merged);
        }
      }
      hydratedRef.current = true;
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionLoading, isConfigured, user?.id]);

  // Persistencia: local siempre, Supabase con debounce si hay sesión.
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!hydratedRef.current) return;
    saveLocalProgress(state);

    if (isConfigured && user && typeof navigator !== "undefined" && navigator.onLine) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveSupabaseProgress(user.id, state);
      }, 800);
    }
  }, [state, isConfigured, user]);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const toggleBlockComplete = useCallback((blockId: string, completed: boolean) => {
    setState((prev) => ({
      ...prev,
      blockStatus: { ...prev.blockStatus, [blockId]: completed ? "completed" : "pending" },
    }));
  }, []);

  const reportFailure = useCallback((subtopicId: string): SubtopicFailure => {
    const prev = stateRef.current;
    const existing = prev.failures[subtopicId];
    const failCount = (existing?.failCount ?? 0) + 1;
    const remediationAttempts = existing?.remediationAttempts ?? 0;
    const status: SubtopicFailure["status"] =
      remediationAttempts >= 1 && existing?.status === "remediating" ? "critical-risk" : "remediating";
    const result: SubtopicFailure = {
      subtopicId,
      failCount,
      lastFailedAt: new Date().toISOString(),
      status,
      remediationAttempts,
    };
    const next = { ...prev, failures: { ...prev.failures, [subtopicId]: result } };
    stateRef.current = next;
    setState(next);
    return result;
  }, []);

  const resolveFailure = useCallback((subtopicId: string) => {
    setState((prev) => {
      const existing = prev.failures[subtopicId];
      if (!existing) return prev;
      return {
        ...prev,
        failures: {
          ...prev.failures,
          [subtopicId]: { ...existing, status: "resolved", remediationAttempts: existing.remediationAttempts + 1 },
        },
      };
    });
  }, []);

  const addAttempt = useCallback((attempt: SimulacroAttempt) => {
    setState((prev) => ({ ...prev, attempts: [...prev.attempts, attempt] }));
  }, []);

  const addSession = useCallback((session: StudySessionLog) => {
    setState((prev) => ({ ...prev, sessions: [...prev.sessions, session] }));
  }, []);

  const markFullSimulacroFailedToday = useCallback(() => {
    setState((prev) => ({ ...prev, lastFailedFullSimulacroAt: new Date().toISOString() }));
  }, []);

  const canTakeFullSimulacroToday = useCallback(() => {
    if (!state.lastFailedFullSimulacroAt) return true;
    const last = new Date(state.lastFailedFullSimulacroAt);
    const now = new Date();
    return last.toDateString() !== now.toDateString();
  }, [state.lastFailedFullSimulacroAt]);

  const ensurePlanStarted = useCallback(() => {
    setState((prev) => (prev.planStartedAt ? prev : { ...prev, planStartedAt: new Date().toISOString() }));
  }, []);

  const resetAll = useCallback(() => {
    setState(EMPTY_PROGRESS);
  }, []);

  const toggleChecklistItem = useCallback((blockId: string, index: number, checked: boolean) => {
    setState((prev) => ({
      ...prev,
      checklists: {
        ...(prev.checklists ?? {}),
        [blockId]: { ...((prev.checklists ?? {})[blockId] ?? {}), [String(index)]: checked },
      },
    }));
  }, []);

  const importState = useCallback((next: ProgressState) => {
    setState({
      ...EMPTY_PROGRESS,
      ...next,
      checklists: next.checklists ?? {},
      trainer: next.trainer ?? EMPTY_PROGRESS.trainer,
    });
  }, []);

  const recordTrainerAttempt = useCallback((attempt: Omit<TrainerAttempt, "id" | "at">) => {
    setState((prev) => ({
      ...prev,
      trainer: {
        ...(prev.trainer ?? EMPTY_PROGRESS.trainer),
        attempts: [
          ...(prev.trainer?.attempts ?? []),
          { ...attempt, id: `ta:${Date.now()}`, at: new Date().toISOString() },
        ].slice(-800),
      },
    }));
  }, []);

  const recordHintLevel = useCallback((key: string, level: number) => {
    setState((prev) => {
      const t = prev.trainer ?? EMPTY_PROGRESS.trainer;
      const prevLevel = t.hintLevelByKey[key] ?? 0;
      return {
        ...prev,
        trainer: {
          ...t,
          hintLevelByKey: { ...t.hintLevelByKey, [key]: Math.max(prevLevel, level) },
        },
      };
    });
  }, []);

  const recordStuck = useCallback((note: Omit<StuckNote, "id" | "at">) => {
    setState((prev) => {
      const t = prev.trainer ?? EMPTY_PROGRESS.trainer;
      return {
        ...prev,
        trainer: {
          ...t,
          stuckNotes: [
            ...t.stuckNotes,
            { ...note, id: `st:${Date.now()}`, at: new Date().toISOString() },
          ].slice(-80),
        },
      };
    });
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      ready,
      syncMode,
      toggleBlockComplete,
      reportFailure,
      resolveFailure,
      addAttempt,
      addSession,
      markFullSimulacroFailedToday,
      canTakeFullSimulacroToday,
      ensurePlanStarted,
      resetAll,
      toggleChecklistItem,
      importState,
      recordTrainerAttempt,
      recordHintLevel,
      recordStuck,
    }),
    [
      state,
      ready,
      syncMode,
      toggleBlockComplete,
      reportFailure,
      resolveFailure,
      addAttempt,
      addSession,
      markFullSimulacroFailedToday,
      canTakeFullSimulacroToday,
      ensurePlanStarted,
      resetAll,
      toggleChecklistItem,
      importState,
      recordTrainerAttempt,
      recordHintLevel,
      recordStuck,
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress debe usarse dentro de <ProgressProvider>");
  return ctx;
}

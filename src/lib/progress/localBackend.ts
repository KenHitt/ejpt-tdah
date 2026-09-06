import { EMPTY_PROGRESS, ProgressState, PROGRESS_STORAGE_KEY } from "./state";

export function loadLocalProgress(): ProgressState {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...EMPTY_PROGRESS,
      ...parsed,
      checklists: parsed.checklists ?? {},
      trainer: parsed.trainer
        ? {
            ...EMPTY_PROGRESS.trainer,
            ...parsed.trainer,
            reasoningRuns: parsed.trainer.reasoningRuns ?? [],
            labHud: parsed.trainer.labHud ?? EMPTY_PROGRESS.trainer.labHud,
          }
        : EMPTY_PROGRESS.trainer,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveLocalProgress(state: ProgressState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Almacenamiento local lleno o no disponible: no bloquear la app por esto.
  }
}

function volume(s: ProgressState): number {
  return (
    Object.keys(s.blockStatus).length +
    s.attempts.length +
    s.sessions.length +
    Object.keys(s.failures).length +
    Object.keys(s.checklists ?? {}).length
  );
}

/** Si la nube está vacía y el local tiene datos, no borres el avance del portátil. */
export function mergeProgress(local: ProgressState, cloud: ProgressState | null): ProgressState {
  if (!cloud) return local;
  const lv = volume(local);
  const cv = volume(cloud);
  if (cv === 0 && lv > 0) return { ...EMPTY_PROGRESS, ...local };
  if (lv === 0 && cv > 0) return { ...EMPTY_PROGRESS, ...cloud };
  return {
    ...EMPTY_PROGRESS,
    ...cloud,
    ...local,
    blockStatus: { ...cloud.blockStatus, ...local.blockStatus },
    failures: { ...cloud.failures, ...local.failures },
    checklists: { ...(cloud.checklists ?? {}), ...(local.checklists ?? {}) },
    trainer: {
      attempts: [...(cloud.trainer?.attempts ?? []), ...(local.trainer?.attempts ?? [])].slice(-500),
      hintLevelByKey: { ...(cloud.trainer?.hintLevelByKey ?? {}), ...(local.trainer?.hintLevelByKey ?? {}) },
      stuckNotes: [...(cloud.trainer?.stuckNotes ?? []), ...(local.trainer?.stuckNotes ?? [])].slice(-100),
      reasoningRuns: [...(cloud.trainer?.reasoningRuns ?? []), ...(local.trainer?.reasoningRuns ?? [])].slice(-40),
      labHud: local.trainer?.labHud ?? cloud.trainer?.labHud ?? EMPTY_PROGRESS.trainer.labHud,
    },
    attempts: local.attempts.length >= cloud.attempts.length ? local.attempts : cloud.attempts,
    sessions: local.sessions.length >= cloud.sessions.length ? local.sessions : cloud.sessions,
    planStartedAt: local.planStartedAt ?? cloud.planStartedAt,
    lastFailedFullSimulacroAt: local.lastFailedFullSimulacroAt ?? cloud.lastFailedFullSimulacroAt,
  };
}

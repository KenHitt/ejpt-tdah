import { SimulacroAttempt, StudySessionLog, SubtopicFailure } from "@/lib/types";
import { EMPTY_TRAINER, TrainerState } from "@/lib/trainer/types";

export type BlockStatus = "pending" | "completed";

export interface ProgressState {
  /** Estado de cada bloque de estudio (id de bloque -> estado) */
  blockStatus: Record<string, BlockStatus>;
  /** Fallos por sub-tema exacto, para el ciclo de remediación (regla fija #9) */
  failures: Record<string, SubtopicFailure>;
  /** Historial de intentos de simulacro/skill-check */
  attempts: SimulacroAttempt[];
  /** Registro de sesiones de estudio (para el diagnóstico honesto de ritmo) */
  sessions: StudySessionLog[];
  /** Fecha ISO del último simulacro COMPLETO reprobado (para el cooldown de 1 día) */
  lastFailedFullSimulacroAt?: string;
  /** Fecha ISO de inicio del plan de 3 meses (para calcular deadline) */
  planStartedAt?: string;
  /** Checklists de cierre por bloque (sobreviven al reinicio) */
  checklists: Record<string, Record<string, boolean>>;
  /** Capa P0 entrenador (no pisa el progreso de bloques) */
  trainer: TrainerState;
}

export const EMPTY_PROGRESS: ProgressState = {
  blockStatus: {},
  failures: {},
  attempts: [],
  sessions: [],
  checklists: {},
  trainer: EMPTY_TRAINER,
};

export const PROGRESS_STORAGE_KEY = "ejpt-progress-v1";

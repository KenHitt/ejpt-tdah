import { FailKind, SkillKind } from "@/lib/types";

export interface TrainerAttempt {
  id: string;
  exerciseId: string;
  correct: boolean;
  at: string;
  hintsUsed: number;
  failKind?: FailKind;
  skillKind?: SkillKind;
  retries?: number;
  durationMs?: number;
  domain?: string;
}

export interface StuckNote {
  id: string;
  blockId: string;
  at: string;
  maxHintLevel: number;
  notes: Record<string, string>;
}

export interface ReasoningRun {
  id: string;
  scenarioId: string;
  score: number;
  at: string;
}

export interface TrainerState {
  attempts: TrainerAttempt[];
  hintLevelByKey: Record<string, number>;
  stuckNotes: StuckNote[];
  reasoningRuns: ReasoningRun[];
}

export const EMPTY_TRAINER: TrainerState = {
  attempts: [],
  hintLevelByKey: {},
  stuckNotes: [],
  reasoningRuns: [],
};

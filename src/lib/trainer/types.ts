export interface TrainerAttempt {
  id: string;
  exerciseId: string;
  correct: boolean;
  at: string;
  hintsUsed: number;
}

export interface StuckNote {
  id: string;
  blockId: string;
  at: string;
  maxHintLevel: number;
  notes: Record<string, string>;
}

export interface TrainerState {
  attempts: TrainerAttempt[];
  hintLevelByKey: Record<string, number>;
  stuckNotes: StuckNote[];
}

export const EMPTY_TRAINER: TrainerState = {
  attempts: [],
  hintLevelByKey: {},
  stuckNotes: [],
};

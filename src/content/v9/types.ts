import { EnergyMode } from "@/content/v6/types";

/** Estados académicos V9. No sustituyen MasteryStatus V6; se derivan de él + evidencia. */
export type AcademicState =
  | "NOT_STARTED"
  | "EXPOSED"
  | "LEARNING"
  | "PRACTICING"
  | "COMPETENT"
  | "TRANSFER_READY"
  | "MASTERED"
  | "NEEDS_REVIEW"
  | "BLOCKED";

export type CompetencyDim =
  | "knowledge"
  | "execution"
  | "interpretation"
  | "reasoning"
  | "decision"
  | "transfer"
  | "retention";

export type FailureClass =
  | "KNOWLEDGE_FAILURE"
  | "COMMAND_RECALL_FAILURE"
  | "INTERPRETATION_FAILURE"
  | "REASONING_FAILURE"
  | "DECISION_FAILURE"
  | "EXECUTION_FAILURE"
  | "METHODOLOGY_FAILURE"
  | "TIME_MANAGEMENT_FAILURE"
  | "RETENTION_FAILURE";

export type RecKind = "primary" | "quick" | "weakness" | "progression" | "stretch";

export type TimeBudget = 5 | 10 | 15 | 30 | 45 | 60 | 90;

export function budgetFromEnergy(energy: EnergyMode): TimeBudget {
  if (energy === "low") return 10;
  if (energy === "high") return 90;
  return 30;
}

export interface ScoredRec {
  kind: RecKind;
  titleEs: string;
  whyBullets: string[];
  href: string;
  durationMin: number;
  skillId?: string;
  dimension?: CompetencyDim;
  priority: "high" | "medium" | "low";
  relevance: "high" | "medium" | "low";
  score: number;
  goalEs: string;
}

export interface GateStatus {
  skillId: string;
  pass: boolean;
  checks: { label: string; ok: boolean | null; note: string }[];
}

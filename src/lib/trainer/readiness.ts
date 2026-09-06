import { ProgressState } from "@/lib/progress/state";
import {
  consecutiveFullMocks,
  criticalSkillScore,
  domainScores,
  FULL_MACHINE_GATES,
  skillPercents,
} from "@/lib/trainer/competency";
import { CRITICAL_SKILL_PERCENT, MASTERED_PERCENT } from "@/lib/trainer/bands";
import { getSubtopic } from "@/content/subtopics";

export const READINESS_DISCLAIMER =
  "Este es un criterio interno de preparación diseñado para reducir las brechas antes del examen. No representa los criterios oficiales de aprobación de INE.";

export type GateRow = { id: string; labelEs: string; ok: boolean; detail: string };

export function evaluateReadiness(state: ProgressState) {
  const skills = skillPercents(state);
  const domains = domainScores(state);
  const crit = criticalSkillScore(state);
  const mocks = consecutiveFullMocks(state);
  const machinesOk = FULL_MACHINE_GATES.filter((m) => state.blockStatus[m.blockId] === "completed").length >= 3;
  const criticalOpen = Object.values(state.failures).filter((f) => f.status === "critical-risk");
  const reasoningRuns = state.trainer?.reasoningRuns ?? [];
  const lastReason = reasoningRuns.at(-1);
  const reasonOk = lastReason !== undefined && lastReason.score >= MASTERED_PERCENT;

  const overallPieces = [skills.recall, skills.reasoning, skills.machines].filter((n): n is number => n !== null);
  const overall = overallPieces.length ? Math.round(overallPieces.reduce((a, b) => a + b, 0) / overallPieces.length) : null;

  const rows: GateRow[] = [
    {
      id: "overall",
      labelEs: "Overall",
      ok: overall !== null && overall >= MASTERED_PERCENT,
      detail: overall === null ? "sin datos" : `${overall}%`,
    },
    ...domains
      .filter((d) => d.score !== null)
      .map((d) => ({
      id: `dom:${d.id}`,
      labelEs: d.labelEs,
      ok: d.score !== null && d.score >= MASTERED_PERCENT && !d.critical,
      detail: d.score === null ? "sin datos" : `${d.score}%`,
    })),
    {
      id: "critical-skills",
      labelEs: "Critical skills",
      ok: crit !== null && crit >= CRITICAL_SKILL_PERCENT,
      detail: crit === null ? "sin datos" : `${crit}%`,
    },
    {
      id: "mocks",
      labelEs: "3 simulacros consecutivos ≥85%",
      ok: mocks.ok,
      detail: mocks.last3.length ? mocks.last3.map((s) => `${s}%`).join(" · ") : "sin 3 simulacros",
    },
    {
      id: "machines",
      labelEs: "3 máquinas completas",
      ok: machinesOk,
      detail: `${FULL_MACHINE_GATES.filter((m) => state.blockStatus[m.blockId] === "completed").length}/3 (${FULL_MACHINE_GATES.map((m) => m.labelEs).join(", ")})`,
    },
    {
      id: "no-critical",
      labelEs: "Sin debilidades críticas pendientes",
      ok: criticalOpen.length === 0,
      detail: criticalOpen.length ? criticalOpen.map((f) => getSubtopic(f.subtopicId)?.nameEs ?? f.subtopicId).join(", ") : "ninguna",
    },
    {
      id: "reasoning-mode",
      labelEs: "Metodología sin comandos (Exam Reasoning)",
      ok: reasonOk,
      detail: lastReason ? `${lastReason.score}%` : "sin intento",
    },
  ];

  const blockers = rows.filter((r) => !r.ok);
  return {
    ready: blockers.length === 0,
    overall,
    rows,
    blockers,
    disclaimer: READINESS_DISCLAIMER,
  };
}

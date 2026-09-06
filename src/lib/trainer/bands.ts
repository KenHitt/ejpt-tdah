/** Umbrales internos de la plataforma. No son los criterios oficiales de INE. */

export const LEARNING_PASS_PERCENT = 70;
export const MASTERED_PERCENT = 85;
export const CRITICAL_SKILL_PERCENT = 90;

export type ScoreBand = "below" | "learning-pass" | "mastered" | "critical-skill";

export function scoreBand(score: number): ScoreBand {
  if (score >= CRITICAL_SKILL_PERCENT) return "critical-skill";
  if (score >= MASTERED_PERCENT) return "mastered";
  if (score >= LEARNING_PASS_PERCENT) return "learning-pass";
  return "below";
}

export function bandLabelEs(score: number): string {
  const b = scoreBand(score);
  if (b === "critical-skill") return "Critical Skill (interno ≥90%)";
  if (b === "mastered") return "Mastered (interno ≥85%)";
  if (b === "learning-pass") return "Learning Pass (interno ≥70%): puedes seguir, con lagunas registradas";
  return "Por debajo de Learning Pass";
}

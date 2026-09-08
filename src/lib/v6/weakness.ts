import { CourseState } from "@/lib/course/storage";
import { ProgressState } from "@/lib/progress/state";
import { TrainerAttempt } from "@/lib/trainer/types";
import { V6_SKILLS, getSkill } from "@/content/v6/skills";
import { getPhase } from "@/content/v6/phases";
import { skillStatus } from "@/lib/v6/mastery";

/**
 * Sección 18 — Weakness Engine.
 * FailKind almacenado sigue siendo memory|reasoning|technical (no se cambia el
 * tipo central: se usa en decenas de archivos de contenido). Esta capa
 * traduce esos 3 valores + heurísticas a las 5 categorías pedagógicas del
 * spec para el DISPLAY, sin inventar datos que no existen.
 */
export type DisplayFailureType = "knowledge" | "command_memory" | "reasoning" | "practical" | "careless";

export const FAILURE_LABEL: Record<DisplayFailureType, string> = {
  knowledge: "Knowledge gap",
  command_memory: "Command memory",
  reasoning: "Reasoning",
  practical: "Practical execution",
  careless: "Careless error",
};

function attemptsFor(attempts: TrainerAttempt[], subtopicIds: string[]) {
  return attempts.filter((a) => subtopicIds.some((s) => a.domain === s || a.exerciseId.includes(s)));
}

export interface SkillWeakness {
  skillId: string;
  titleEs: string;
  priority: "high" | "medium";
  signals: string[];
  mainIssueEs: string;
  href: string;
  score: number;
}

/** Solo skills con señal real de fallo. No fabrica debilidades. */
export function skillWeaknesses(course: CourseState, progress: ProgressState): SkillWeakness[] {
  const attempts = progress.trainer?.attempts ?? [];
  const out: SkillWeakness[] = [];

  for (const skill of V6_SKILLS) {
    const status = skillStatus(skill.id, course, progress);
    if (status !== "WEAK" && status !== "PRACTICING") continue;

    const subFails = skill.subtopicIds.reduce((n, id) => n + (progress.failures[id]?.failCount ?? 0), 0);
    const mine = attemptsFor(attempts, skill.subtopicIds);
    const wrong = mine.filter((a) => !a.correct);
    const counts = { memory: 0, reasoning: 0, technical: 0 };
    for (const a of wrong) {
      if (a.failKind) counts[a.failKind] += 1;
    }
    const phase = getPhase(skill.phaseId);
    const failedExam = phase?.weekIds.some((w) => {
      const ex = course.exams[`w${w}`];
      return ex && ex.pct < 70;
    });
    const labMissing = skill.lessonIds.some((id) => course.lessons[id] && !course.lessons[id].labDone);

    const signals: string[] = [];
    if (wrong.length > 0) signals.push(`${wrong.length} incorrect decision${wrong.length === 1 ? "" : "s"}`);
    if (labMissing) signals.push("1 lab not verified");
    if (failedExam) signals.push("1 failed assessment");
    if (subFails > 0 && wrong.length === 0) signals.push(`${subFails} recall failure(s)`);

    if (!signals.length) continue;

    const dominant = (Object.entries(counts) as [keyof typeof counts, number][]).sort((a, b) => b[1] - a[1])[0];
    let mainIssue: DisplayFailureType = "knowledge";
    if (dominant && dominant[1] > 0) {
      mainIssue = dominant[0] === "reasoning" ? "reasoning" : dominant[0] === "memory" ? "command_memory" : "practical";
    } else if (wrong.length === 1 && mine.filter((a) => a.correct).length >= 3) {
      mainIssue = "careless";
    }

    const score = subFails * 2 + wrong.length * 2 + (failedExam ? 3 : 0) + (labMissing ? 1 : 0);
    const priority: SkillWeakness["priority"] = score >= 5 ? "high" : "medium";

    out.push({
      skillId: skill.id,
      titleEs: skill.titleEs,
      priority,
      signals,
      mainIssueEs: `${skill.titleEs} — ${FAILURE_LABEL[mainIssue]}`,
      href: `/master/${skill.id}`,
      score,
    });
  }

  return out.sort((a, b) => b.score - a.score).slice(0, 4);
}

export function dominantFailureLabel(progress: ProgressState): string | null {
  const attempts = progress.trainer?.attempts ?? [];
  const recent = attempts.slice(-15).filter((a) => !a.correct);
  if (recent.length < 2) return null;
  const counts = { memory: 0, reasoning: 0, technical: 0 };
  for (const a of recent) {
    if (a.failKind) counts[a.failKind] += 1;
  }
  const top = (Object.entries(counts) as [keyof typeof counts, number][]).sort((a, b) => b[1] - a[1])[0];
  if (!top || top[1] === 0) return null;
  const type: DisplayFailureType = top[0] === "reasoning" ? "reasoning" : top[0] === "memory" ? "command_memory" : "practical";
  return FAILURE_LABEL[type];
}

export { getSkill };

import { CourseState } from "@/lib/course/storage";
import { ProgressState } from "@/lib/progress/state";
import { getSkill } from "@/content/v6/skills";
import { drillsForSkill } from "@/content/v8/drills";
import { dueCommands } from "@/lib/trainer/adaptive";
import { independenceStats, hasTransferEvidence } from "@/lib/v9/competency";
import { V8_MACHINES } from "@/content/v8/operations";

export interface SkillEvidence {
  theory: boolean;
  quiz: boolean;
  guided: boolean;
  independent: boolean;
  decision: boolean;
  transfer: boolean;
  boss: boolean;
  retentionDue: boolean;
  independentSuccesses: number;
  failedDecisions: number;
  hintsUsed: number;
  avgSolveMs: number | undefined;
}

export function evidenceForSkill(skillId: string, course: CourseState, progress: ProgressState): SkillEvidence {
  const skill = getSkill(skillId);
  const empty: SkillEvidence = {
    theory: false,
    quiz: false,
    guided: false,
    independent: false,
    decision: false,
    transfer: false,
    boss: false,
    retentionDue: false,
    independentSuccesses: 0,
    failedDecisions: 0,
    hintsUsed: 0,
    avgSolveMs: undefined,
  };
  if (!skill) return empty;
  const done = skill.lessonIds.filter((id) => course.lessons[id]);
  const attempts = (progress.trainer?.attempts ?? []).filter((a) =>
    skill.subtopicIds.some((s) => a.domain === s || a.exerciseId.includes(s))
  );
  const timed = attempts.filter((a) => a.durationMs && a.durationMs > 0);
  const drills = drillsForSkill(skillId);
  return {
    theory: done.length > 0,
    quiz: done.some((id) => (course.lessons[id]?.quizPct ?? 0) >= 70),
    guided: done.some((id) => course.lessons[id]?.examplesDone),
    independent: done.some((id) => course.lessons[id]?.labDone),
    decision: drills.length > 0 && attempts.some((a) => a.skillKind === "reasoning" || drills.some((d) => a.exerciseId.includes(d.id))),
    transfer: hasTransferEvidence(skillId, course),
    boss: Boolean(skill.boss.href && (course.exams[`op:${skill.boss.href.split("/").pop()}`] || done.length === skill.lessonIds.length)),
    retentionDue: dueCommands(progress).some((c) => skill.subtopicIds.includes(c.subtopicId)),
    independentSuccesses: independenceStats(skillId, progress).attempts
      ? attempts.filter((a) => a.correct && (a.hintsUsed ?? 0) === 0).length
      : 0,
    failedDecisions: attempts.filter((a) => !a.correct && (a.skillKind === "reasoning" || a.failKind === "reasoning")).length,
    hintsUsed: attempts.reduce((n, a) => n + (a.hintsUsed ?? 0), 0),
    avgSolveMs: timed.length ? Math.round(timed.reduce((n, a) => n + (a.durationMs ?? 0), 0) / timed.length) : undefined,
  };
}

export function machineEvidenceNote(opId: string, course: CourseState) {
  const pct = course.exams[`op:${opId}`]?.pct;
  if (pct === undefined) return "Not enough data yet";
  return `Last tabletop score ${pct}% (internal, not INE).`;
}

export function relatedMachines(skillId: string) {
  return V8_MACHINES.filter((m) => m.skillIds.includes(skillId));
}

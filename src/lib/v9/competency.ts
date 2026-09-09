import { CourseState } from "@/lib/course/storage";
import { ProgressState } from "@/lib/progress/state";
import { getSkill, V6_SKILLS } from "@/content/v6/skills";
import { AcademicState, CompetencyDim } from "@/content/v9/types";
import { dueCommands } from "@/lib/trainer/adaptive";
import { prereqsMet, skillBreakdown, skillStatus } from "@/lib/v6/mastery";
import { V8_MACHINES, V8_BOSSES } from "@/content/v8/operations";

export interface CompetencyProfile {
  skillId: string;
  state: AcademicState;
  dims: Record<CompetencyDim, number | undefined>;
  hasData: boolean;
  weakestDim: CompetencyDim | null;
}

export interface IndependenceEvidence {
  independentSuccess: number | undefined;
  hintDependency: number | undefined;
  walkthroughDependency: number | undefined;
  attempts: number;
  retries: number;
}

export function academicState(skillId: string, course: CourseState, progress: ProgressState): AcademicState {
  const v6 = skillStatus(skillId, course, progress);
  const skill = getSkill(skillId);
  if (!skill) return "NOT_STARTED";
  if (v6 === "LOCKED") return "BLOCKED";

  const done = skill.lessonIds.filter((id) => course.lessons[id]);
  const indep = independenceStats(skillId, progress);
  const transferOk = hasTransferEvidence(skillId, course);
  const weakOpen = skill.subtopicIds.some((sid) => {
    const f = progress.failures[sid];
    return f && f.status !== "resolved";
  });
  const srsDue = dueCommands(progress).some((c) => skill.subtopicIds.includes(c.subtopicId));

  const drilled = (progress.trainer?.attempts ?? []).some((a) =>
    skill.subtopicIds.some((s) => a.domain === s || a.exerciseId.includes(s) || a.exerciseId.includes(skillId))
  );
  if (done.length === 0 && !drilled) return "NOT_STARTED";
  if (weakOpen || (srsDue && v6 === "WEAK")) return "NEEDS_REVIEW";
  if (v6 === "AVAILABLE") {
    if (drilled) return "PRACTICING";
    return done.length ? "EXPOSED" : "NOT_STARTED";
  }
  if (v6 === "IN_PROGRESS") return done.length <= 1 ? "EXPOSED" : "LEARNING";
  if (v6 === "WEAK") return "NEEDS_REVIEW";
  if (v6 === "PRACTICING") return "PRACTICING";

  const highIndep = (indep.independentSuccess ?? 0) >= 70 && (indep.hintDependency ?? 100) <= 30;
  if (v6 === "MASTERED") {
    if (srsDue) return "NEEDS_REVIEW";
    if (highIndep && transferOk) return "MASTERED";
    if (transferOk) return "TRANSFER_READY";
    return "COMPETENT";
  }
  if (v6 === "READY") {
    if (transferOk && highIndep) return "TRANSFER_READY";
    return "COMPETENT";
  }
  return "LEARNING";
}

export function independenceStats(skillId: string, progress: ProgressState): IndependenceEvidence {
  const skill = getSkill(skillId);
  const attempts = (progress.trainer?.attempts ?? []).filter((a) => {
    if (!skill) return false;
    return skill.subtopicIds.some((s) => a.domain === s || a.exerciseId.includes(s) || a.exerciseId.includes(skillId));
  });
  const ok = attempts.filter((a) => a.correct);
  const retries = attempts.reduce((n, a) => n + (a.retries ?? 0), 0);
  const hints = Object.entries(progress.trainer?.hintLevelByKey ?? {}).filter(([k, lvl]) => {
    if (!skill) return false;
    return lvl > 0 && (k.includes(skillId) || skill.subtopicIds.some((s) => k.includes(s)));
  });
  const walk = hints.filter(([, lvl]) => lvl >= 5).length;

  return {
    attempts: attempts.length,
    retries,
    independentSuccess: ok.length >= 3 ? Math.round((ok.filter((a) => (a.hintsUsed ?? 0) === 0).length / ok.length) * 100) : undefined,
    hintDependency:
      ok.length >= 3 ? Math.round((ok.filter((a) => (a.hintsUsed ?? 0) > 0).length / ok.length) * 100) : undefined,
    walkthroughDependency: hints.length >= 2 ? Math.round((walk / hints.length) * 100) : undefined,
  };
}

export function hasTransferEvidence(skillId: string, course: CourseState): boolean {
  const ops = [...V8_MACHINES, ...V8_BOSSES].filter((m) => m.skillIds.includes(skillId) || m.hideSkills);
  return ops.some((m) => (course.exams[`op:${m.id}`]?.pct ?? 0) >= 70);
}

export function calculateCompetency(skillId: string, course: CourseState, progress: ProgressState): CompetencyProfile {
  const b = skillBreakdown(skillId, course, progress);
  const skill = getSkill(skillId);
  const attempts = (progress.trainer?.attempts ?? []).filter((a) =>
    skill?.subtopicIds.some((s) => a.domain === s || a.exerciseId.includes(s))
  );
  const decisionPool = attempts.filter((a) => a.skillKind === "reasoning" || a.failKind === "reasoning");
  const decision =
    decisionPool.length >= 2
      ? Math.round((decisionPool.filter((a) => a.correct).length / decisionPool.length) * 100)
      : undefined;

  const due = skill ? dueCommands(progress).filter((c) => skill.subtopicIds.includes(c.subtopicId)) : [];
  const recallOk = skill
    ? (progress.trainer?.attempts ?? []).filter(
        (a) => a.correct && a.failKind === "memory" && skill.subtopicIds.some((s) => a.exerciseId.includes(s))
      ).length
    : 0;
  const retention =
    due.length > 0 ? Math.max(20, 80 - due.length * 10) : recallOk >= 2 || (b.commandMemory ?? 0) >= 70 ? b.commandMemory : undefined;

  const opScore = skill
    ? [...V8_MACHINES, ...V8_BOSSES]
        .filter((m) => m.skillIds.includes(skillId))
        .map((m) => course.exams[`op:${m.id}`]?.pct)
        .filter((n): n is number => typeof n === "number")
    : [];
  const transfer = opScore.length ? Math.round(opScore.reduce((a, n) => a + n, 0) / opScore.length) : undefined;

  const dims: Record<CompetencyDim, number | undefined> = {
    knowledge: b.knowledge,
    execution: b.practical,
    interpretation: b.reasoning ?? b.commandMemory,
    reasoning: b.reasoning,
    decision,
    transfer,
    retention,
  };

  const withVal = (Object.entries(dims) as [CompetencyDim, number | undefined][]).filter(
    (e): e is [CompetencyDim, number] => e[1] !== undefined
  );
  const weakestDim = withVal.length ? withVal.sort((a, b) => a[1] - b[1])[0][0] : null;

  return {
    skillId,
    state: academicState(skillId, course, progress),
    dims,
    hasData: b.hasData || decision !== undefined || transfer !== undefined,
    weakestDim,
  };
}

export function weakestCriticalSkill(course: CourseState, progress: ProgressState): { id: string; titleEs: string; dim: CompetencyDim } | null {
  const rows = V6_SKILLS.map((s) => ({ s, c: calculateCompetency(s.id, course, progress) })).filter(
    (r) => r.c.hasData && r.c.weakestDim && (r.c.dims[r.c.weakestDim] ?? 100) < 65
  );
  if (!rows.length) return null;
  rows.sort((a, b) => (a.c.dims[a.c.weakestDim!] ?? 100) - (b.c.dims[b.c.weakestDim!] ?? 100));
  const top = rows[0];
  return { id: top.s.id, titleEs: top.s.titleEs, dim: top.c.weakestDim! };
}

export function readyToAdvanceSkill(course: CourseState, progress: ProgressState): { id: string; titleEs: string } | null {
  const row = V6_SKILLS.find((s) => {
    const st = academicState(s.id, course, progress);
    return st === "COMPETENT" || st === "TRANSFER_READY" || st === "MASTERED";
  });
  return row ? { id: row.id, titleEs: row.titleEs } : null;
}

export function blockedByPrereq(skillId: string, course: CourseState, progress: ProgressState): string | null {
  const skill = getSkill(skillId);
  if (!skill) return null;
  if (prereqsMet(skillId, course, progress)) return null;
  return skill.prereqIds.find((id) => {
    const st = academicState(id, course, progress);
    return st === "BLOCKED" || st === "NOT_STARTED" || st === "NEEDS_REVIEW";
  }) ?? skill.prereqIds[0] ?? null;
}

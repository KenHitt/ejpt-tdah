import { CourseState } from "@/lib/course/storage";
import { ProgressState } from "@/lib/progress/state";
import { V6_SKILLS, getSkill } from "@/content/v6/skills";
import { MasteryStatus } from "@/content/v6/types";
import { dueCommands } from "@/lib/trainer/adaptive";

export function prereqsMet(skillId: string, course: CourseState, progress: ProgressState): boolean {
  const skill = getSkill(skillId);
  if (!skill) return true;
  return skill.prereqIds.every((id) => {
    const st = skillStatus(id, course, progress);
    return st === "READY" || st === "MASTERED" || st === "PRACTICING" || st === "IN_PROGRESS" || st === "WEAK";
  });
}

/** Lab is the only hard gate: first 4 lab jornadas. */
export function labCheckpointDone(course: CourseState) {
  return ["c00-d1", "c00-d2", "c00-d3", "c00-d4"].every((id) => course.lessons[id]);
}

export function skillStatus(skillId: string, course: CourseState, progress: ProgressState): MasteryStatus {
  const skill = getSkill(skillId);
  if (!skill) return "AVAILABLE";

  if (skillId !== "lab" && !labCheckpointDone(course) && skill.prereqIds.includes("lab")) {
    const any = skill.lessonIds.some((id) => course.lessons[id]);
    if (!any) return "LOCKED";
  }

  const weak = skill.subtopicIds.some((sid) => {
    const f = progress.failures[sid];
    return f && f.status !== "resolved";
  });

  const lessons = skill.lessonIds;
  const done = lessons.filter((id) => course.lessons[id]);
  const quizOk = done.filter((id) => (course.lessons[id]?.quizPct ?? 0) >= 70).length;
  const labOk = done.filter((id) => course.lessons[id]?.labDone).length;

  const attempts = progress.trainer?.attempts ?? [];
  const subAttempts = attempts.filter((a) => skill.subtopicIds.some((s) => a.domain === s || a.exerciseId.includes(s)));
  const decisionOk = subAttempts.filter((a) => a.correct && a.skillKind === "reasoning").length;
  const srsDue = dueCommands(progress).some((c) => skill.subtopicIds.includes(c.subtopicId));

  if (done.length === 0) {
    if (skill.prereqIds.length && !prereqsMet(skillId, course, progress)) return "LOCKED";
    return "AVAILABLE";
  }
  if (weak) return "WEAK";
  if (done.length < lessons.length) return "IN_PROGRESS";
  if (quizOk < lessons.length || labOk < Math.ceil(lessons.length * 0.6)) return "PRACTICING";
  if (srsDue || (skill.recallCategories.length > 0 && decisionOk === 0 && skill.trainHrefs.some((h) => h.includes("decision")))) {
    return "READY";
  }
  if (quizOk === lessons.length && labOk >= Math.ceil(lessons.length * 0.6) && !weak) {
    return decisionOk > 0 || skill.trainHrefs.length === 0 ? "MASTERED" : "READY";
  }
  return "PRACTICING";
}

export function phaseProgress(phaseSkillIds: string[], course: CourseState, progress: ProgressState) {
  const statuses = phaseSkillIds.map((id) => skillStatus(id, course, progress));
  const weight = { LOCKED: 0, AVAILABLE: 0, IN_PROGRESS: 35, PRACTICING: 55, WEAK: 40, READY: 85, MASTERED: 100 };
  if (!statuses.length) return 0;
  return Math.round(statuses.reduce((n, s) => n + weight[s], 0) / statuses.length);
}

export function profileBars(course: CourseState, progress: ProgressState) {
  const groups: Record<string, string[]> = {
    NETWORKING: ["networking"],
    LINUX: ["linux"],
    RECON: ["recon", "nmap"],
    ENUMERATION: ["enumeration", "smb", "http-enum", "ssh-ftp"],
    WEB: ["web", "sqli", "xss", "lfi"],
    EXPLOITATION: ["metasploit", "exploitation", "vuln"],
    PRIVESC: ["privesc-linux", "privesc-windows"],
    PIVOTING: ["pivoting"],
    WINDOWS: ["privesc-windows"],
  };
  const weight = { LOCKED: 0, AVAILABLE: 5, IN_PROGRESS: 30, PRACTICING: 50, WEAK: 35, READY: 80, MASTERED: 95 };
  const bars = Object.entries(groups).map(([label, ids]) => {
    const avg = Math.round(ids.reduce((n, id) => n + weight[skillStatus(id, course, progress)], 0) / ids.length);
    return { label, pct: avg };
  });

  const attempts = progress.trainer?.attempts ?? [];
  const mem = attempts.filter((a) => a.failKind === "memory");
  const rea = attempts.filter((a) => a.failKind === "reasoning");
  const memPct = mem.length ? Math.round((mem.filter((a) => a.correct).length / mem.length) * 100) : 0;
  const reaPct = rea.length ? Math.round((rea.filter((a) => a.correct).length / rea.length) * 100) : 0;
  bars.push({ label: "COMMAND MEMORY", pct: mem.length ? memPct : 0 });
  bars.push({ label: "REASONING", pct: rea.length ? reaPct : 0 });
  return bars;
}

export interface SkillBreakdown {
  knowledge?: number;
  commandMemory?: number;
  reasoning?: number;
  practical?: number;
  independence?: number;
  overall: number;
  mainWeaknessEs: string | null;
  hasData: boolean;
}

/**
 * Sección 17/55 — performance profile por skill, derivado de actividad real.
 * Cualquier métrica sin datos suficientes queda undefined (la UI debe decir
 * "Not enough data yet", nunca inventar un número).
 */
export function skillBreakdown(skillId: string, course: CourseState, progress: ProgressState): SkillBreakdown {
  const skill = getSkill(skillId);
  const overall = { LOCKED: 0, AVAILABLE: 5, IN_PROGRESS: 30, PRACTICING: 50, WEAK: 35, READY: 80, MASTERED: 95 }[
    skillStatus(skillId, course, progress)
  ];
  if (!skill) return { overall, mainWeaknessEs: null, hasData: false };

  const doneLessons = skill.lessonIds.filter((id) => course.lessons[id]);
  const knowledge = doneLessons.length
    ? Math.round(doneLessons.reduce((n, id) => n + (course.lessons[id]?.quizPct ?? 0), 0) / doneLessons.length)
    : undefined;

  const attempts = (progress.trainer?.attempts ?? []).filter((a) =>
    skill.subtopicIds.some((s) => a.domain === s || a.exerciseId.includes(s))
  );
  const byKind = (k: "memory" | "reasoning" | "technical") => {
    const mine = attempts.filter((a) => a.failKind === k || (a.correct && a.skillKind === (k === "reasoning" ? "reasoning" : undefined)));
    if (!mine.length) return undefined;
    return Math.round((mine.filter((a) => a.correct).length / mine.length) * 100);
  };
  const commandMemory = byKind("memory");
  const reasoning = byKind("reasoning");
  const practical = doneLessons.length
    ? Math.round((doneLessons.filter((id) => course.lessons[id]?.labDone).length / doneLessons.length) * 100)
    : undefined;

  const withHints = attempts.filter((a) => a.correct);
  const independence = withHints.length
    ? Math.round((withHints.filter((a) => a.hintsUsed === 0).length / withHints.length) * 100)
    : undefined;

  const metrics: [string, number | undefined][] = [
    ["Knowledge", knowledge],
    ["Command memory", commandMemory],
    ["Reasoning", reasoning],
    ["Practical", practical],
    ["Independence", independence],
  ];
  const withValue = metrics.filter((m): m is [string, number] => m[1] !== undefined);
  const weakest = withValue.length ? withValue.sort((a, b) => a[1] - b[1])[0] : null;

  return {
    knowledge,
    commandMemory,
    reasoning,
    practical,
    independence,
    overall,
    mainWeaknessEs: weakest ? `Your main weakness is ${weakest[0].toLowerCase()}.` : null,
    hasData: withValue.length > 0,
  };
}

export function ejptReadiness(course: CourseState, progress: ProgressState) {
  const core = ["lab", "networking", "linux", "nmap", "enumeration", "metasploit", "web", "sqli", "chains", "reporting"];
  const avg = Math.round(core.reduce((n, id) => n + (phaseProgress([id], course, progress) as number), 0) / core.length);
  return avg;
}

export function redTeamFoundation(course: CourseState, progress: ProgressState) {
  const extra = ["pivoting", "privesc-windows", "privesc-linux", "post", "vuln"];
  return Math.round(extra.reduce((n, id) => n + phaseProgress([id], course, progress), 0) / extra.length);
}

export { V6_SKILLS };

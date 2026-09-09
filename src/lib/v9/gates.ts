import { CourseState } from "@/lib/course/storage";
import { ProgressState } from "@/lib/progress/state";
import { GateStatus } from "@/content/v9/types";
import { getSkill } from "@/content/v6/skills";
import { drillsForSkill } from "@/content/v8/drills";
import { skillBreakdown, skillStatus } from "@/lib/v6/mastery";
import { independenceStats } from "@/lib/v9/competency";

/**
 * Gate académico (advisory). No oculta contenido.
 * null en un check = not enough data yet.
 */
export function moduleGate(skillId: string, course: CourseState, progress: ProgressState): GateStatus | null {
  const skill = getSkill(skillId);
  if (!skill) return null;
  const b = skillBreakdown(skillId, course, progress);
  const done = skill.lessonIds.filter((id) => course.lessons[id]);
  const quizAvg = done.length
    ? Math.round(done.reduce((n, id) => n + (course.lessons[id]?.quizPct ?? 0), 0) / done.length)
    : null;
  const guided = done.length ? done.filter((id) => course.lessons[id]?.examplesDone || course.lessons[id]?.labDone).length > 0 : false;
  const independent = done.length ? done.filter((id) => course.lessons[id]?.labDone).length >= Math.ceil(skill.lessonIds.length * 0.5) : false;
  const drills = drillsForSkill(skillId);
  const attempts = progress.trainer?.attempts ?? [];
  const drillAttempts = attempts.filter((a) => drills.some((d) => a.exerciseId.includes(d.id)));
  const drillPct =
    drillAttempts.length >= 2
      ? Math.round((drillAttempts.filter((a) => a.correct).length / drillAttempts.length) * 100)
      : null;
  const indep = independenceStats(skillId, progress);
  const st = skillStatus(skillId, course, progress);

  const checks: GateStatus["checks"] = [
    {
      label: "Knowledge ≥ 80%",
      ok: b.knowledge === undefined ? null : b.knowledge >= 80,
      note: b.knowledge === undefined ? "Not enough data yet" : `${b.knowledge}%`,
    },
    {
      label: "Quiz ≥ 80%",
      ok: quizAvg === null ? null : quizAvg >= 80,
      note: quizAvg === null ? "Not enough data yet" : `${quizAvg}%`,
    },
    {
      label: "Guided lab",
      ok: done.length === 0 ? null : guided,
      note: done.length === 0 ? "Not enough data yet" : guided ? "PASS" : "pending",
    },
    {
      label: "Independent lab",
      ok: done.length === 0 ? null : independent,
      note: independent ? "PASS" : "pending",
    },
    {
      label: "Decision drill ≥ 80%",
      ok: drillPct === null ? (drills.length ? null : true) : drillPct >= 80,
      note: drills.length === 0 ? "no drill mapped (content still available)" : drillPct === null ? "Not enough data yet" : `${drillPct}%`,
    },
    {
      label: "Independence (hints)",
      ok: indep.independentSuccess === undefined ? null : indep.independentSuccess >= 60,
      note: indep.independentSuccess === undefined ? "Not enough data yet" : `${indep.independentSuccess}% independent`,
    },
  ];

  const decided = checks.filter((c) => c.ok !== null);
  const pass = decided.length >= 3 && decided.every((c) => c.ok) && st !== "WEAK";
  return { skillId, pass, checks };
}

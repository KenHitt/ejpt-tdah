import { HUB_REPOS } from "@/content/github-hub";
import { ACADEMY_WORKSHOPS } from "@/content/academy/workshops";
import { LEARN_ARTICLES } from "@/content/learn-articles";
import { COURSE_LESSONS, COURSE_WEEKS } from "@/content/course";
import { ContentDepth } from "@/content/v6/types";
import { getSkill, skillBySubtopic, skillForLearn, skillForLesson, skillForWorkshop } from "@/content/v6/skills";
import { getPhase } from "@/content/v6/phases";

export const WORKSHOP_DEEP_MIN = 40;

export function workshopWhen(workshopId: string) {
  const skill = skillForWorkshop(workshopId);
  const repo = HUB_REPOS.find((r) => r.id === workshopId);
  const ws = ACADEMY_WORKSHOPS.find((w) => w.id === workshopId);
  const weeks = ws?.weeks ?? repo?.weeks ?? [];
  const modules = weeks.map((n) => COURSE_WEEKS.find((w) => w.week === n)?.titleEs ?? `M${n + 1}`);
  const prereqTitles = (skill?.prereqIds ?? []).map((id) => getSkill(id)?.titleEs ?? id);
  const scanMin = repo?.min ?? 12;
  return {
    skill,
    relatedSkillTitle: skill?.titleEs ?? "Complementario",
    prereqTitles,
    recommendedAfter: skill ? `${skill.titleEs} (fundamentos)` : "Lab checkpoint",
    usedBy: modules.length ? modules.join(" · ") : "Extensión libre",
    type: "Deep Dive" as const,
    scanMin,
    deepMin: WORKSHOP_DEEP_MIN,
  };
}

export function learnDepth(articleId: string): ContentDepth {
  const a = LEARN_ARTICLES.find((x) => x.id === articleId);
  if (!a) return "QUICK";
  const len = (a.what + a.why + a.how).length;
  if (len > 1400) return "DEEP";
  return "QUICK";
}

export function learnMeta(articleId: string) {
  const skill = skillForLearn(articleId);
  const depth = learnDepth(articleId);
  const minutes = depth === "DEEP" ? 12 : 5;
  return {
    skill,
    depth,
    minutes,
    whenEs: skill
      ? `Repaso rápido de ${skill.titleEs}. No sustituye la jornada.`
      : "Ficha de biblioteca. Úsala para SRS o un hueco, no como ruta paralela.",
  };
}

export function lessonLinkedSkill(lessonId: string) {
  const lesson = COURSE_LESSONS.find((l) => l.id === lessonId);
  return (lesson ? skillBySubtopic(lesson.subtopicId) : undefined) ?? skillForLesson(lessonId);
}

export function phaseTitle(phaseId: string) {
  return getPhase(phaseId)?.titleEs ?? phaseId;
}

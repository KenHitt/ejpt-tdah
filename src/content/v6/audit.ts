import { V6_SKILLS } from "@/content/v6/skills";
import { COURSE_LESSONS } from "@/content/course";
import { LEARN_ARTICLES } from "@/content/learn-articles";
import { ACADEMY_WORKSHOPS } from "@/content/academy/workshops";
import { CycleFlags } from "@/content/v6/types";

function existsLesson(id: string) {
  return COURSE_LESSONS.some((l) => l.id === id);
}
function existsLearn(id: string) {
  return LEARN_ARTICLES.some((a) => a.id === id);
}
function existsWs(id: string) {
  return ACADEMY_WORKSHOPS.some((w) => w.id === id);
}

export interface SkillAudit {
  skillId: string;
  titleEs: string;
  flags: CycleFlags;
  missing: string[];
  lessonOk: number;
  lessonTotal: number;
}

export function auditSkill(skillId: string): SkillAudit | null {
  const s = V6_SKILLS.find((x) => x.id === skillId);
  if (!s) return null;
  const lessons = s.lessonIds.filter(existsLesson);
  const learns = s.learnIds.filter(existsLearn);
  const lessonObjs = COURSE_LESSONS.filter((l) => lessons.includes(l.id));
  const hasLesson = lessons.length > 0;
  const hasQuiz = lessonObjs.some((l) => l.quiz.length >= 4);
  const hasExample = lessonObjs.some((l) => l.examples.length > 0);
  const hasLab = lessonObjs.some((l) => l.labSteps.length > 0);
  const hasDecision = s.trainHrefs.some((h) => h.includes("decision") || h.includes("whats-next") || h.includes("train"));
  const hasChallenge = s.trainHrefs.some((h) => h.includes("15min") || h.includes("arcade") || h.includes("examen"));
  const hasAssess = Boolean(s.boss.href);
  const hasSrs = s.recallCategories.length > 0;

  const flags: CycleFlags = {
    theory: hasLesson || learns.length > 0,
    quiz: hasQuiz,
    guided: hasExample,
    independent: hasLab,
    lab: hasLab,
    decision: hasDecision,
    challenge: hasChallenge || hasAssess,
    assessment: hasAssess,
    srs: hasSrs,
  };

  const missing: string[] = [];
  if (!flags.theory) missing.push("teoría");
  if (!flags.quiz) missing.push("examen corto");
  if (!flags.guided) missing.push("ejemplo guiado");
  if (!flags.lab) missing.push("lab");
  if (!flags.decision) missing.push("decision drill");
  if (!flags.srs) missing.push("SRS/recall");
  s.lessonIds.filter((id) => !existsLesson(id)).forEach((id) => missing.push(`jornada rota: ${id}`));
  s.learnIds.filter((id) => !existsLearn(id)).forEach((id) => missing.push(`ficha ausente: ${id}`));
  s.workshopIds.filter((id) => !existsWs(id)).forEach((id) => missing.push(`taller ausente: ${id}`));

  return {
    skillId: s.id,
    titleEs: s.titleEs,
    flags,
    missing,
    lessonOk: lessons.length,
    lessonTotal: s.lessonIds.length,
  };
}

export function auditAll() {
  return V6_SKILLS.map((s) => auditSkill(s.id)!);
}

import { CourseSection } from "@/content/course/types";

export interface AcademyTerm {
  term: string;
  aliases: string[];
  def: string;
  purpose: string;
  href?: string;
}

export interface LessonGuide {
  lessonId: string;
  learnGoal?: string;
  whyMatters?: string;
  terms?: { term: string; def: string; purpose?: string; href?: string }[];
  prereqLearnIds?: string[];
  prereqLessonIds?: string[];
  commands?: { fragment: string; what: string; when: string; expect: string }[];
  prep?: string[];
  checkpoints?: { h: string; p: string }[];
  lost?: string[];
  verify?: string[];
  errors?: { symptom: string; fix: string }[];
  extraRead?: CourseSection[];
  labBefore?: string[];
  decisionHref?: string;
  independentHint?: string;
}

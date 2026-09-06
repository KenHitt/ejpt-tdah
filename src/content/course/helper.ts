import { CourseLesson, CourseQuizItem, CourseSection } from "@/content/course/types";

export function Q(q: string, options: string[], correct: number, why: string): CourseQuizItem {
  return { q, options, correct, why };
}

export function S(h: string, p: string): CourseSection {
  return { h, p };
}

export function lesson(
  id: string,
  week: number,
  day: number,
  track: string,
  titleEs: string,
  minutes: number,
  subtopicId: string,
  read: CourseSection[],
  quiz: CourseQuizItem[],
  labTitle: string,
  labSteps: string[],
  pep: string
): CourseLesson {
  return {
    id,
    week,
    day,
    track,
    titleEs,
    minutes,
    subtopicId,
    read,
    quiz,
    labTitle,
    labSteps,
    pep,
  };
}

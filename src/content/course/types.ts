export interface CourseQuizItem {
  q: string;
  options: string[];
  /** Índice 0-based de la opción correcta */
  correct: number;
  why: string;
}

export interface CourseSection {
  h: string;
  p: string;
}

export interface CourseLesson {
  id: string;
  week: number;
  day: number;
  track: string;
  titleEs: string;
  minutes: number;
  subtopicId: string;
  read: CourseSection[];
  quiz: CourseQuizItem[];
  labTitle: string;
  labSteps: string[];
  pep: string;
}

export interface CourseWeekMeta {
  week: number;
  monthLabel: string;
  titleEs: string;
  goalEs: string;
}

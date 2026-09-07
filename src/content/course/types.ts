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

export interface CourseExampleStep {
  do: string;
  why: string;
}

export interface CourseExample {
  title: string;
  scene: string;
  steps: CourseExampleStep[];
  expected: string;
  stop: string;
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
  /** Teoría extra (jornada amplia). Se fusiona en enrich. */
  theoryExtra?: CourseSection[];
  /** Ejemplos guiados: yo lo hago, luego tú. */
  examples?: CourseExample[];
  /** Pista de aislamiento del lab de práctica. */
  practiceHint?: string;
}

export type EnrichedLesson = CourseLesson & {
  examples: CourseExample[];
  tallerIds: string[];
  theoryExtra: CourseSection[];
  jornadaHours: number;
  practiceHint: string;
};

export interface CourseWeekMeta {
  week: number;
  monthLabel: string;
  titleEs: string;
  goalEs: string;
}

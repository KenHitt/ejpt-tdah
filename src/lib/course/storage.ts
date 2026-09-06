export const COURSE_STORAGE_KEY = "ejpt-course-v1";

export interface LessonRecord {
  at: string;
  quizPct: number;
  labDone: boolean;
}

export interface CourseState {
  startedAt?: string;
  lastDay?: string;
  streak: number;
  lessons: Record<string, LessonRecord>;
  exams: Record<string, { at: string; pct: number }>;
}

export const EMPTY_COURSE: CourseState = {
  streak: 0,
  lessons: {},
  exams: {},
};

export function loadCourse(): CourseState {
  if (typeof window === "undefined") return EMPTY_COURSE;
  try {
    const raw = window.localStorage.getItem(COURSE_STORAGE_KEY);
    if (!raw) return EMPTY_COURSE;
    const parsed = JSON.parse(raw) as Partial<CourseState>;
    return {
      streak: parsed.streak ?? 0,
      lessons: parsed.lessons ?? {},
      exams: parsed.exams ?? {},
      startedAt: parsed.startedAt,
      lastDay: parsed.lastDay,
    };
  } catch {
    return EMPTY_COURSE;
  }
}

export function saveCourse(state: CourseState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(state));
}

export function todayISO(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function bumpStreak(prev: CourseState, now = new Date()): Pick<CourseState, "streak" | "lastDay" | "startedAt"> {
  const today = todayISO(now);
  const startedAt = prev.startedAt ?? now.toISOString();
  if (prev.lastDay === today) {
    return { streak: Math.max(prev.streak, 1), lastDay: today, startedAt };
  }
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  const yesterday = todayISO(y);
  const streak = prev.lastDay === yesterday ? prev.streak + 1 : 1;
  return { streak, lastDay: today, startedAt };
}

export function dayOfPlan(startedAt: string | undefined, now = new Date()): number {
  if (!startedAt) return 1;
  const a = new Date(startedAt.slice(0, 10) + "T12:00:00");
  const b = new Date(todayISO(now) + "T12:00:00");
  return Math.max(1, Math.floor((b.getTime() - a.getTime()) / 86400000) + 1);
}

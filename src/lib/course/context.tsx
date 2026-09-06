"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  bumpStreak,
  CourseState,
  dayOfPlan,
  EMPTY_COURSE,
  LessonRecord,
  loadCourse,
  saveCourse,
} from "@/lib/course/storage";

interface CourseCtx {
  ready: boolean;
  state: CourseState;
  dayNumber: number;
  markLesson: (id: string, rec: LessonRecord) => void;
  markExam: (weekId: string, pct: number) => void;
  isLessonDone: (id: string) => boolean;
}

const Ctx = createContext<CourseCtx | null>(null);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CourseState>(EMPTY_COURSE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hidratar localStorage (clave aparte de ejpt-progress-v1).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load localStorage after mount
    setState(loadCourse());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveCourse(state);
  }, [state, ready]);

  const markLesson = useCallback((id: string, rec: LessonRecord) => {
    setState((prev) => ({
      ...prev,
      ...bumpStreak(prev),
      lessons: { ...prev.lessons, [id]: rec },
    }));
  }, []);

  const markExam = useCallback((weekId: string, pct: number) => {
    setState((prev) => ({
      ...prev,
      ...bumpStreak(prev),
      exams: { ...prev.exams, [weekId]: { at: new Date().toISOString(), pct } },
    }));
  }, []);

  const isLessonDone = useCallback((id: string) => Boolean(state.lessons[id]), [state.lessons]);

  const value = useMemo(
    () => ({
      ready,
      state,
      dayNumber: dayOfPlan(state.startedAt),
      markLesson,
      markExam,
      isLessonDone,
    }),
    [ready, state, markLesson, markExam, isLessonDone]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCourse() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCourse fuera de CourseProvider");
  return v;
}

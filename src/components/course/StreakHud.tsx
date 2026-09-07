"use client";

import { pepForStreak } from "@/content/course";
import { useCourse } from "@/lib/course/context";

export function StreakHud({
  totalLessons,
  doneCount,
  hoursDone,
  hoursTotal,
}: {
  totalLessons: number;
  doneCount: number;
  hoursDone?: number;
  hoursTotal?: number;
}) {
  const { state, dayNumber } = useCourse();
  const pct = totalLessons ? Math.round((doneCount / totalLessons) * 100) : 0;
  return (
    <div className="rounded-xl border border-emerald-900/50 bg-slate-900/60 p-4 font-mono text-xs">
      <p className="text-emerald-400">
        DÍA {Math.min(dayNumber, 90)} / 90 · RACHA {state.streak} · JORNADAS {doneCount}/{totalLessons} ({pct}%)
        {hoursDone !== undefined && hoursTotal !== undefined ? ` · ${hoursDone}/${hoursTotal} h` : ""}
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded bg-slate-800">
        <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-slate-400">{pepForStreak(state.streak)}</p>
    </div>
  );
}

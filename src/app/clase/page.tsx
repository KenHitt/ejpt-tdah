"use client";

import Link from "next/link";
import { COURSE_LESSONS, COURSE_WEEKS, lessonsForWeek, nextIncomplete } from "@/content/course";
import { StreakHud } from "@/components/course/StreakHud";
import { useCourse } from "@/lib/course/context";

export default function ClaseHomePage() {
  const { state } = useCourse();
  const doneCount = Object.keys(state.lessons).length;
  const next = nextIncomplete(state.lessons);
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <p className="font-mono text-xs text-emerald-400">CLASE · 13 semanas · 78 lecciones cortas</p>
      <h1 className="text-2xl font-bold text-white">Curso 3 meses</h1>
      <p className="text-sm text-slate-300">
        Leer → marcar examen de 5 → lab. Una clase. Cerebro rápido: si te aburres, GITHUB con timer, no 40 pestañas.
      </p>
      <StreakHud totalLessons={COURSE_LESSONS.length} doneCount={doneCount} />
      <Link href="/hub" className="block text-center font-mono text-sm text-red-400 underline">
        GITHUB · SCAN / DEEP / RABBIT (timer 12 min)
      </Link>
      <Link
        href={`/clase/${next.id}`}
        className="block rounded-xl bg-red-600 py-4 text-center text-lg font-bold text-white hover:bg-red-500"
      >
        HOY · {next.titleEs}
      </Link>
      <ul className="space-y-3">
        {COURSE_WEEKS.map((w) => {
          const ls = lessonsForWeek(w.week);
          const n = ls.filter((l) => state.lessons[l.id]).length;
          const ex = state.exams[`w${w.week}`];
          return (
            <li key={w.week} className="rounded-lg border border-slate-800 p-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-mono text-[10px] text-emerald-500">
                  {w.monthLabel} · S{w.week}
                </p>
                <p className="text-[10px] text-slate-500">
                  {n}/{ls.length} clases{ex ? ` · examen ${ex.pct}%` : ""}
                </p>
              </div>
              <p className="text-white">{w.titleEs}</p>
              <p className="text-xs text-slate-500">{w.goalEs}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ls.map((l) => (
                  <Link
                    key={l.id}
                    href={`/clase/${l.id}`}
                    className={`rounded px-2 py-1 font-mono text-[10px] ${
                      state.lessons[l.id] ? "bg-emerald-950 text-emerald-400" : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    D{l.day}
                  </Link>
                ))}
                <Link href={`/clase/examen/w${w.week}`} className="rounded bg-amber-950 px-2 py-1 font-mono text-[10px] text-amber-300">
                  EXAMEN
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-slate-600">
        El plan /focus y LEARN siguen ahí. CLASE es la pista diaria de 12–18 min. Labs: solo tus VMs y localhost.
      </p>
    </div>
  );
}

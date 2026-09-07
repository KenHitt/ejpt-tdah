"use client";

import Link from "next/link";
import { COURSE_LESSONS, COURSE_WEEKS, lessonsForWeek, nextIncomplete } from "@/content/course";
import { ACADEMY_HOURS, ACADEMY_STATS, hoursFromLessons } from "@/content/academy/program";
import { StreakHud } from "@/components/course/StreakHud";
import { useCourse } from "@/lib/course/context";

export default function AcademiaPage() {
  const { state } = useCourse();
  const doneCount = Object.keys(state.lessons).length;
  const next = nextIncomplete(state.lessons);
  const hoursDone = hoursFromLessons(doneCount);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">Academia</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Ruta del bootcamp</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {ACADEMY_STATS.modules} módulos · {ACADEMY_STATS.jornadas} jornadas de {ACADEMY_STATS.jornadaHours} h ·{" "}
          {Math.round(ACADEMY_HOURS.total)} horas en total (núcleo + talleres + biblioteca).
        </p>
        <p className="mt-2 text-sm text-slate-400">
          En cada jornada: teoría → examen corto → ejemplos → <strong className="text-slate-200">tú</strong> practicas
          en VirtualBox → taller de estudio escrito. Día 7: descanso o repetición.
        </p>
      </div>

      <StreakHud
        totalLessons={COURSE_LESSONS.length}
        doneCount={doneCount}
        hoursDone={hoursDone}
        hoursTotal={ACADEMY_HOURS.jornadas}
      />

      <Link
        href={`/clase/${next.id}`}
        className="block rounded-xl bg-emerald-600 py-4 text-center text-lg font-bold text-white hover:bg-emerald-500"
      >
        Continuar · {next.titleEs}
      </Link>

      <ol className="space-y-3">
        {COURSE_WEEKS.map((w, i) => {
          const ls = lessonsForWeek(w.week);
          const n = ls.filter((l) => state.lessons[l.id]).length;
          const ex = state.exams[`w${w.week}`];
          const current = next.week === w.week;
          return (
            <li
              key={w.week}
              className={`rounded-xl border p-4 ${
                current ? "border-emerald-600 bg-emerald-950/20" : "border-slate-800 bg-slate-900/30"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-medium text-emerald-400">
                  Módulo {i + 1} · {w.monthLabel}
                </p>
                <p className="text-[11px] text-slate-500">
                  {n}/{ls.length} · {ls.length * 10} h
                  {ex ? ` · examen ${ex.pct}%` : ""}
                </p>
              </div>
              <p className="mt-1 text-lg font-semibold text-white">{w.titleEs}</p>
              <p className="text-sm text-slate-400">{w.goalEs}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ls.map((l) => (
                  <Link
                    key={l.id}
                    href={`/clase/${l.id}`}
                    className={`rounded-full px-2.5 py-1 text-[11px] ${
                      state.lessons[l.id]
                        ? "bg-emerald-950 text-emerald-400"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                    title={l.titleEs}
                  >
                    {l.day}
                  </Link>
                ))}
                <Link
                  href={`/clase/examen/w${w.week}`}
                  className="rounded-full bg-amber-950 px-2.5 py-1 text-[11px] text-amber-300"
                >
                  Examen
                </Link>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/talleres" className="rounded-xl border border-slate-800 p-4 text-sm text-slate-300 hover:border-emerald-700">
          <p className="font-semibold text-white">Talleres de extensión</p>
          <p className="mt-1 text-slate-400">{ACADEMY_STATS.talleres} estudios · {ACADEMY_HOURS.talleres} h. Material propio, no enlaces sueltos.</p>
        </Link>
        <Link href="/learn" className="rounded-xl border border-slate-800 p-4 text-sm text-slate-300 hover:border-emerald-700">
          <p className="font-semibold text-white">Biblioteca</p>
          <p className="mt-1 text-slate-400">{ACADEMY_STATS.fichas} fichas · {ACADEMY_HOURS.biblioteca} h de repaso puntual.</p>
        </Link>
      </div>
    </div>
  );
}

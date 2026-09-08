"use client";

import Link from "next/link";
import { COURSE_LESSONS, COURSE_WEEKS, lessonsForWeek, nextIncomplete } from "@/content/course";
import { V6_PHASES } from "@/content/v6/phases";
import { HONEST_HOURS } from "@/content/v6/hours";
import { labCheckpointDone, phaseProgress } from "@/lib/v6/mastery";
import { useCourse } from "@/lib/course/context";
import { useProgress } from "@/lib/progress/context";
import { StreakHud } from "@/components/course/StreakHud";
import { hoursFromLessons } from "@/content/academy/program";

export default function AcademiaPage() {
  const { state } = useCourse();
  const { state: progress } = useProgress();
  const doneCount = Object.keys(state.lessons).length;
  const next = nextIncomplete(state.lessons);
  const hoursDone = hoursFromLessons(doneCount);
  const labOk = labCheckpointDone(state);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber-400">Mi ruta eJPT</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Academy</h1>
        <p className="mt-2 text-sm text-slate-300">
          Una ruta. El contenido futuro se puede consultar; lo recomendado ahora está marcado. Day 7 = descanso o
          catch-up.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Capacidad estimada de jornadas ~{HONEST_HOURS.jornadaEstimated} h · catálogo completo ~{HONEST_HOURS.allCatalogEstimated}{" "}
          h (estimado). No son horas garantizadas de reloj.
        </p>
      </div>

      <StreakHud
        totalLessons={COURSE_LESSONS.length}
        doneCount={doneCount}
        hoursDone={hoursDone}
        hoursTotal={HONEST_HOURS.jornadaEstimated}
      />

      <Link
        href={`/clase/${next.id}`}
        className="block rounded-xl bg-amber-500 py-4 text-center text-lg font-bold text-black hover:bg-amber-400"
      >
        Continuar · {next.titleEs}
      </Link>
      {!labOk && (
        <p className="text-sm text-amber-200">
          Lab checkpoint incompleto. Recomendado: Fase 0 antes de recon.{" "}
          <Link href="/laboratorio" className="underline">
            Laboratorio
          </Link>
        </p>
      )}

      <ol className="space-y-3">
        {V6_PHASES.map((p) => {
          const pct = phaseProgress(p.skillIds, state, progress);
          const current = p.weekIds.includes(next.week);
          const lockedLook = !labOk && p.n > 0;
          return (
            <li
              key={p.id}
              className={`rounded-xl border p-4 ${
                current ? "border-amber-600 bg-amber-950/20" : "border-slate-800 bg-slate-900/30"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-medium text-amber-400">
                  Fase {p.n} {lockedLook ? "· visible / no recomendada aún" : ""}
                </p>
                <p className="text-[11px] text-slate-500">{pct}%</p>
              </div>
              <p className="mt-1 text-lg font-semibold text-white">{p.titleEs}</p>
              <p className="text-sm text-slate-400">{p.goalEs}</p>
              <p className="mt-1 text-xs italic text-slate-500">{p.thinkEs}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded bg-slate-800">
                <div className="h-full bg-amber-500" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.skillIds.map((sid) => (
                  <Link
                    key={sid}
                    href={`/master/${sid}`}
                    className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:text-amber-300"
                  >
                    Master {sid}
                  </Link>
                ))}
                <Link href={p.boss.href} className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] text-amber-300">
                  Boss
                </Link>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="text-sm text-slate-500">
        <Link href="/auditoria" className="text-amber-400 hover:underline">
          Auditoría de ciclo
        </Link>
        {" · "}
        contenido futuro visible; LOCKED = no recomendado ahora.
      </p>

      <h2 className="text-lg font-semibold text-white">Jornadas (contenido principal)</h2>
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
                current ? "border-amber-600/50" : "border-slate-800"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs text-slate-500">
                  Módulo {i + 1} · {w.monthLabel}
                </p>
                <p className="text-[11px] text-slate-500">
                  {n}/{ls.length}
                  {ex ? ` · examen ${ex.pct}%` : ""}
                </p>
              </div>
              <p className="font-semibold text-white">{w.titleEs}</p>
              <p className="text-sm text-slate-400">{w.goalEs}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ls.map((l) => (
                  <Link
                    key={l.id}
                    href={`/clase/${l.id}`}
                    className={`rounded-full px-2.5 py-1 text-[11px] ${
                      state.lessons[l.id] ? "bg-emerald-950 text-emerald-400" : "bg-slate-800 text-slate-300"
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
    </div>
  );
}

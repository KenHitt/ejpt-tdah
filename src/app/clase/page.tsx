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
import { PRIMARY_BUTTON, progressBarClass, statusBadgeClass, statusLabelEn } from "@/lib/design/tokens";
import { ModuleCard } from "@/components/cards";

/**
 * Academy = "¿qué debo aprender?" Progressive disclosure (V7 sección 4/5):
 * cada fase se ve resumida; se expande con <details> nativo. Solo la fase
 * actual arranca abierta. No se oculta contenido, solo su profundidad inicial.
 */
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
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-red-400">Academy</p>
        <h1 className="mt-2 text-3xl font-bold text-white">What am I learning?</h1>
        <p className="mt-2 text-sm text-slate-300">
          One path, organized in phases and modules. Future content stays visible for reference; what&apos;s
          recommended now is marked. Day 7 = rest or catch-up.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Estimated jornada capacity ~{HONEST_HOURS.jornadaEstimated} h · full catalog ~{HONEST_HOURS.allCatalogEstimated}{" "}
          h (estimated). Not a guaranteed clock time.
        </p>
      </div>

      <StreakHud
        totalLessons={COURSE_LESSONS.length}
        doneCount={doneCount}
        hoursDone={hoursDone}
        hoursTotal={HONEST_HOURS.jornadaEstimated}
      />

      <Link href={`/clase/${next.id}`} className={PRIMARY_BUTTON}>
        CONTINUE · {next.titleEs}
      </Link>
      {!labOk && (
        <p className="text-sm text-amber-200">
          Lab checkpoint incomplete. Recommended: Phase 0 before recon.{" "}
          <Link href="/laboratorio" className="underline">
            Lab
          </Link>
        </p>
      )}

      <ol className="space-y-3">
        {V6_PHASES.map((p) => {
          const pct = phaseProgress(p.skillIds, state, progress);
          const current = p.weekIds.includes(next.week);
          const lockedLook = !labOk && p.n > 0;
          const status = pct >= 95 ? "mastered" : pct > 0 ? "in_progress" : current ? "recommended" : lockedLook ? "locked" : "available";
          const weeksInPhase = COURSE_WEEKS.filter((w) => p.weekIds.includes(w.week));
          const lessonCount = weeksInPhase.reduce((n, w) => n + lessonsForWeek(w.week).length, 0);

          return (
            <li key={p.id}>
              <details open={current} className="group rounded-xl border border-slate-800 bg-slate-900/30 open:border-red-700/60">
                <summary className="cursor-pointer list-none p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-red-400">
                        Phase {p.n} {lockedLook ? "· visible / not recommended yet" : ""}
                      </p>
                      <p className="mt-0.5 text-lg font-semibold text-white">{p.titleEs}</p>
                      <p className="text-sm text-slate-400">{p.subtitleEs}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadgeClass(status)}`}>
                      {statusLabelEn(status)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{p.goalEs}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded bg-slate-800">
                    <div className={`h-full ${progressBarClass(pct)}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">
                    {pct}% · {lessonCount} lessons
                  </p>
                </summary>

                <div className="border-t border-slate-800 p-4 pt-3">
                  <p className="text-xs italic text-slate-500">{p.thinkEs}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.skillIds.map((sid) => (
                      <Link
                        key={sid}
                        href={`/master/${sid}`}
                        className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:text-red-300"
                      >
                        Master {sid}
                      </Link>
                    ))}
                    <Link href={p.boss.href} className="rounded-full bg-red-950 px-2.5 py-1 text-[11px] text-red-300">
                      Boss · {p.boss.titleEs}
                    </Link>
                  </div>

                  <div className="mt-4 space-y-3">
                    {weeksInPhase.map((w) => {
                      const ls = lessonsForWeek(w.week);
                      const n = ls.filter((l) => state.lessons[l.id]).length;
                      const ex = state.exams[`w${w.week}`];
                      const currentWeek = next.week === w.week;
                      const modulePct = ls.length ? Math.round((n / ls.length) * 100) : 0;
                      const moduleStatus = modulePct === 100 ? "mastered" : modulePct > 0 ? "in_progress" : currentWeek ? "recommended" : "available";
                      return (
                        <ModuleCard
                          key={w.week}
                          phaseLabel={`Module ${w.week + 1} · ${w.monthLabel}`}
                          titleEs={w.titleEs}
                          descriptionEs={w.goalEs}
                          pct={modulePct}
                          lessons={ls.length}
                          assessments={1}
                          status={moduleStatus}
                          href={`/clase/${ls.find((l) => !state.lessons[l.id])?.id ?? ls[0]?.id ?? ""}`}
                          ctaLabel={ex ? `CONTINUE · exam ${ex.pct}%` : "CONTINUE"}
                        >
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
                              Module test
                            </Link>
                          </div>
                        </ModuleCard>
                      );
                    })}
                  </div>
                </div>
              </details>
            </li>
          );
        })}
      </ol>

      <p className="text-sm text-slate-500">
        <Link href="/auditoria" className="text-red-400 hover:underline">
          Content audit
        </Link>
        {" · "}
        future content stays visible; LOCKED = not recommended now.
      </p>
    </div>
  );
}

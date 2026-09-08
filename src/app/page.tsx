"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { useCourse } from "@/lib/course/context";
import { useProgress } from "@/lib/progress/context";
import { pickOperation, failKindAdvice } from "@/lib/v6/operation";
import { ejptReadiness, labCheckpointDone, profileBars, redTeamFoundation } from "@/lib/v6/mastery";
import { loadEnergy, saveEnergy, subscribeEnergy } from "@/lib/v6/energy";
import { EnergyMode } from "@/content/v6/types";
import { EnergyToggle } from "@/components/v6/EnergyToggle";
import { HONEST_HOURS, completedLessonHours } from "@/content/v6/hours";
import { ACADEMY_NAME } from "@/content/academy/program";

export default function MissionControlPage() {
  const { state: course, dayNumber, ready: courseReady } = useCourse();
  const { state: progress } = useProgress();
  const energy = useSyncExternalStore(subscribeEnergy, loadEnergy, (): EnergyMode => "normal");

  const op = useMemo(
    () => pickOperation(course, progress, energy, dayNumber),
    [course, progress, energy, dayNumber]
  );
  const advice = useMemo(() => failKindAdvice(progress), [progress]);
  const doneIds = Object.keys(course.lessons);
  const doneH = completedLessonHours(doneIds);
  const remain = Math.max(0, Math.round((HONEST_HOURS.jornadaEstimated - doneH) * 10) / 10);
  const ejpt = ejptReadiness(course, progress);
  const rtf = redTeamFoundation(course, progress);
  const bars = profileBars(course, progress);
  const labOk = labCheckpointDone(course);

  if (!courseReady) {
    return <p className="font-mono text-sm text-slate-500">Cargando operación…</p>;
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber-400">Mission control</p>
        <h1 className="mt-1 text-3xl font-bold text-white">{ACADEMY_NAME}</h1>
        <p className="mt-1 text-sm text-slate-400">Una operación. El resto es opcional.</p>
      </div>

      <EnergyToggle
        value={energy}
        onChange={(v) => {
          saveEnergy(v);
        }}
      />

      <section className="rounded-2xl border-2 border-amber-600/80 bg-slate-950 p-6">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-400">Your current operation</p>
        <p className="mt-3 font-mono text-xs text-slate-400">{op.phaseLabel}</p>
        <p className="font-mono text-xs text-slate-500">{op.dayLabel}</p>
        <h2 className="mt-2 text-2xl font-bold text-white">{op.titleEs}</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="text-[10px] uppercase text-slate-500">Objective</dt>
            <dd className="text-slate-200">{op.objectiveEs}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase text-slate-500">Why</dt>
            <dd className="text-slate-400">{op.whyEs}</dd>
          </div>
          <div className="flex flex-wrap gap-6 font-mono text-xs">
            <span className="text-amber-300">
              Progress {op.stepsDone}/{op.stepsTotal}
            </span>
            <span className="text-slate-400">{op.estimatedLabel}</span>
            <span className="text-slate-500">Difficulty {"★".repeat(op.difficulty)}</span>
          </div>
        </dl>
        <Link
          href={op.href}
          className="mt-6 block rounded-xl bg-amber-500 py-4 text-center text-lg font-bold text-black hover:bg-amber-400"
        >
          Continue operation
        </Link>
        {!labOk && (
          <p className="mt-3 text-xs text-amber-200">Lab checkpoint pendiente: ping, vboxnet, snapshot, alcance.</p>
        )}
      </section>

      {advice && (
        <p className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300">{advice}</p>
      )}

      <section className="space-y-2">
        <p className="text-[11px] uppercase tracking-wide text-slate-500">Next</p>
        <Link href={op.nextHref} className="block rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-300">
          {op.nextTitleEs}
        </Link>
        <p className="text-[11px] uppercase tracking-wide text-slate-600">Optional</p>
        <div className="flex flex-col gap-1">
          {op.optional.map((o) => (
            <Link key={o.href} href={o.href} className="text-sm text-slate-500 hover:text-amber-300">
              {o.label}
              <span className="ml-2 text-xs text-slate-600">{o.why}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-slate-800 p-3">
          <p className="text-[10px] uppercase text-slate-500">eJPT readiness (interno)</p>
          <p className="text-2xl font-bold text-white">{ejpt}%</p>
          <p className="text-[11px] text-slate-500">Criterio de academia. No es INE.</p>
        </div>
        <div className="rounded-xl border border-slate-800 p-3">
          <p className="text-[10px] uppercase text-slate-500">Red team foundation</p>
          <p className="text-2xl font-bold text-white">{rtf}%</p>
          <p className="text-[11px] text-slate-500">Más allá del mínimo eJPT.</p>
        </div>
      </section>

      <section>
        <p className="mb-2 text-[11px] uppercase text-slate-500">Horas (estimado, no inflado)</p>
        <p className="text-sm text-slate-300">
          Completadas {doneH} h · restantes ~{remain} h de jornadas · catálogo ~{HONEST_HOURS.allCatalogEstimated} h
        </p>
        <p className="text-[11px] text-slate-600">
          Promedio ~{HONEST_HOURS.avgJornadaMin} min/jornada. El lab puede alargarse. No son 10 h fijas por día.
        </p>
      </section>

      <section className="space-y-2">
        <p className="text-[11px] uppercase text-slate-500">Profile (actividad real)</p>
        {bars.map((b) => (
          <div key={b.label}>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{b.label}</span>
              <span>{b.pct}%</span>
            </div>
            <div className="mt-0.5 h-1.5 overflow-hidden rounded bg-slate-800">
              <div className="h-full bg-amber-500" style={{ width: `${b.pct}%` }} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { useCourse } from "@/lib/course/context";
import { useProgress } from "@/lib/progress/context";
import { pickOperation, failKindAdvice } from "@/lib/v6/operation";
import { labCheckpointDone } from "@/lib/v6/mastery";
import { loadEnergy, saveEnergy, subscribeEnergy } from "@/lib/v6/energy";
import { EnergyMode } from "@/content/v6/types";
import { EnergyToggle } from "@/components/v6/EnergyToggle";
import { MissionCard } from "@/components/cards";
import { OnboardingIntro } from "@/components/v6/OnboardingIntro";
import { ACADEMY_NAME } from "@/content/academy/program";

/**
 * Mission Control = "¿qué hago ahora?". Nada de analíticas aquí (V7 sección 41,
 * 6): eso vive en Dashboard (/progreso). Una sola acción principal.
 */
export default function MissionControlPage() {
  const { state: course, dayNumber, ready: courseReady } = useCourse();
  const { state: progress } = useProgress();
  const energy = useSyncExternalStore(subscribeEnergy, loadEnergy, (): EnergyMode => "normal");

  const op = useMemo(
    () => pickOperation(course, progress, energy, dayNumber),
    [course, progress, energy, dayNumber]
  );
  const advice = useMemo(() => failKindAdvice(progress), [progress]);
  const labOk = labCheckpointDone(course);

  if (!courseReady) {
    return <p className="font-mono text-sm text-slate-500">Loading operation…</p>;
  }

  const isNew = Object.keys(course.lessons).length === 0;

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-red-400">Mission control</p>
        <h1 className="mt-1 text-3xl font-bold text-white">{ACADEMY_NAME}</h1>
        <p className="mt-1 text-sm text-slate-400">What should I do now? One operation. Everything else is optional.</p>
      </div>

      {isNew && <OnboardingIntro firstLessonHref={op.href} />}

      <EnergyToggle
        value={energy}
        onChange={(v) => {
          saveEnergy(v);
        }}
      />

      <MissionCard
        phaseLabel={op.phaseLabel}
        dayLabel={op.dayLabel}
        titleEs={op.titleEs}
        objectiveEs={op.objectiveEs}
        whyEs={op.whyEs}
        stepsDone={op.stepsDone}
        stepsTotal={op.stepsTotal}
        estimatedLabel={op.estimatedLabel}
        difficulty={op.difficulty}
        href={op.href}
        extra={
          !labOk ? (
            <p className="mt-3 text-xs text-amber-200">Lab checkpoint pending: ping, vboxnet, snapshot, scope.</p>
          ) : undefined
        }
      />

      {advice && <p className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300">{advice}</p>}

      <section className="space-y-2">
        <p className="text-[11px] uppercase tracking-wide text-slate-500">Next</p>
        <Link href={op.nextHref} className="block rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-300">
          {op.nextTitleEs}
        </Link>
        <p className="text-[11px] uppercase tracking-wide text-slate-600">Short session</p>
        <div className="flex flex-col gap-1">
          {op.optional.map((o) => (
            <Link key={o.href} href={o.href} className="text-sm text-slate-500 hover:text-red-400">
              {o.label}
              <span className="ml-2 text-xs text-slate-600">{o.why}</span>
            </Link>
          ))}
        </div>
      </section>

      <Link href="/progreso" className="block text-center text-sm text-slate-500 hover:text-red-400">
        How am I doing? → Dashboard
      </Link>
    </div>
  );
}

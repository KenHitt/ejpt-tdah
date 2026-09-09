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
import { calculateRecommendation } from "@/lib/v9/recommend";
import { AcademyOverview } from "@/components/v91/AcademyOverview";

/**
 * Home = academia + "qué hago ahora". El overview es estático (catálogo real).
 * La operación no bloquea toda la página si el progreso aún hidrata.
 */
export default function MissionControlPage() {
  const { state: course, dayNumber, ready: courseReady } = useCourse();
  const { state: progress } = useProgress();
  const energy = useSyncExternalStore(subscribeEnergy, loadEnergy, (): EnergyMode => "normal");

  const op = useMemo(
    () => pickOperation(course, progress, energy, dayNumber),
    [course, progress, energy, dayNumber]
  );
  const board = useMemo(() => calculateRecommendation(course, progress, energy), [course, progress, energy]);
  const advice = useMemo(() => failKindAdvice(progress), [progress]);
  const labOk = labCheckpointDone(course);
  const useAdvisor = board.primary.score >= 65;
  const href = useAdvisor ? board.primary.href : op.href;
  const titleEs = useAdvisor ? board.primary.titleEs : op.titleEs;
  const whyEs = useAdvisor ? board.primary.whyBullets.join(" ") : op.whyEs;
  const objectiveEs = useAdvisor ? board.primary.goalEs : op.objectiveEs;
  const estimatedLabel = useAdvisor ? `~${board.primary.durationMin} min (estimado)` : op.estimatedLabel;
  const isNew = courseReady && Object.keys(course.lessons).length === 0;

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <AcademyOverview />

      {isNew && <OnboardingIntro firstLessonHref={href} />}

      <EnergyToggle
        value={energy}
        onChange={(v) => {
          saveEnergy(v);
        }}
      />

      <p className="text-[11px] uppercase tracking-wide text-red-400">What should I do now?</p>

      {courseReady ? (
        <MissionCard
          phaseLabel={op.phaseLabel}
          dayLabel={op.dayLabel}
          titleEs={titleEs}
          objectiveEs={objectiveEs}
          whyEs={whyEs}
          stepsDone={op.stepsDone}
          stepsTotal={op.stepsTotal}
          estimatedLabel={estimatedLabel}
          difficulty={op.difficulty}
          href={href}
          extra={
            !labOk ? (
              <p className="mt-3 text-xs text-amber-200">Lab checkpoint pending: ping, vboxnet, snapshot, scope.</p>
            ) : useAdvisor ? (
              <p className="mt-3 text-xs text-slate-500">
                Afterward: {board.advisor.afterEs} {board.primary.skillId ? `Improves ${board.primary.skillId}.` : ""}
              </p>
            ) : undefined
          }
        />
      ) : (
        <p className="rounded-xl border border-slate-800 p-4 text-sm text-slate-500">
          Cargando tu operación guardada… El programa de arriba ya es usable.
        </p>
      )}

      {advice && <p className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300">{advice}</p>}

      <section className="space-y-2">
        <p className="text-[11px] uppercase tracking-wide text-slate-500">Next</p>
        <Link href={op.nextHref} className="block rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-300">
          {op.nextTitleEs}
        </Link>
        <p className="text-[11px] uppercase tracking-wide text-slate-600">If you have 5 / 15 / 60 min</p>
        <div className="flex flex-col gap-1">
          {board.timeSlots.map((s) => (
            <Link key={s.budget} href={s.rec.href} className="text-sm text-slate-500 hover:text-red-400">
              {s.budget} min → {s.rec.titleEs}
              <span className="ml-2 text-xs text-slate-600">{s.rec.whyBullets[0]}</span>
            </Link>
          ))}
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

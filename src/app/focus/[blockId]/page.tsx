"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getBlockById } from "@/content/curriculum";
import { useProgress } from "@/lib/progress/context";
import { FocusTimer } from "@/components/trainer/FocusTimer";
import { StuckPanel } from "@/components/trainer/StuckPanel";
import { DrillPractice } from "@/components/DrillPractice";
import { Checklist } from "@/components/Checklist";

export default function FocusPage() {
  const params = useParams<{ blockId: string }>();
  const router = useRouter();
  const block = getBlockById(params.blockId);
  const { toggleBlockComplete, state } = useProgress();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [drillsDone, setDrillsDone] = useState(false);

  if (!block) {
    return (
      <p className="text-slate-400">
        Bloque no encontrado.{" "}
        <Link href="/" className="text-emerald-400 underline">
          Hoy
        </Link>
      </p>
    );
  }

  const steps = block.practiceSteps ?? [];
  const stepsDone = steps.length === 0 || step >= steps.length;
  const canFinish = (block.drills?.length ? drillsDone : stepsDone) || state.blockStatus[block.id] === "completed";

  if (!started) {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-8 text-center">
        <p className="font-mono text-xs text-emerald-400">AHORA · FOCUS MODE</p>
        <h1 className="text-2xl font-bold text-white">{block.title}</h1>
        {block.titleEn && <p className="font-mono text-sm text-emerald-400">{block.titleEn}</p>}
        <p className="text-sm text-slate-300">{block.objective}</p>
        {block.objectiveEn && <p className="font-mono text-xs text-emerald-300">{block.objectiveEn}</p>}
        <p className="text-slate-500">Tiempo recomendado: {block.durationMin} min</p>
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="w-full rounded-md bg-emerald-600 py-3 text-lg font-semibold text-white hover:bg-emerald-500"
        >
          EMPEZAR
        </button>
        <Link href={`/plan/${block.id}`} className="block text-xs text-slate-500 underline">
          Ver teoría completa (sale de Focus)
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 py-4">
      <div className="rounded-lg border border-emerald-800/60 bg-slate-950 p-5 text-center">
        <p className="text-xs font-semibold tracking-widest text-emerald-500">FOCUS MODE</p>
        <h1 className="mt-2 text-xl font-bold text-white">{block.title}</h1>
        <div className="mt-4">
          <FocusTimer durationMin={block.durationMin} />
        </div>
        <p className="mt-4 text-sm text-slate-300">{block.objective}</p>
      </div>

      {!stepsDone && (
        <div className="rounded-lg border border-slate-800 p-4">
          <p className="text-xs text-slate-500">
            Paso {step + 1}/{steps.length} (un paso a la vez)
          </p>
          <p className="mt-2 font-mono text-sm text-emerald-300">{steps[step]}</p>
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="mt-3 rounded-md bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700"
          >
            Hecho → siguiente
          </button>
        </div>
      )}

      {stepsDone && block.drills && block.drills.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-purple-400">Active recall</p>
          <DrillPractice drills={block.drills} onAllPassed={() => setDrillsDone(true)} />
        </div>
      )}

      {stepsDone && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-slate-400">Checklist</p>
          <Checklist items={block.closingChecklist} storageKey={block.id} />
        </div>
      )}

      <StuckPanel blockId={block.id} subtopics={block.subtopics} />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!canFinish && !!block.drills?.length}
          onClick={() => {
            toggleBlockComplete(block.id, true);
            router.push("/");
          }}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-40"
        >
          Terminé
        </button>
        <Link href="/" className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-300">
          Salir de Focus
        </Link>
      </div>
      {block.drills?.length && !drillsDone ? (
        <p className="text-xs text-amber-400">Terminé se activa cuando aciertas los recall de este bloque.</p>
      ) : null}
    </div>
  );
}

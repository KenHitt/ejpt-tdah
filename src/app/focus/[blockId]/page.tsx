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
import { GuidedLabRunner } from "@/components/trainer/GuidedLabRunner";
import { DecisionDrillRunner } from "@/components/trainer/DecisionDrillRunner";
import { SafetyNote } from "@/components/SafetyNote";
import { RedTeamHud } from "@/components/trainer/RedTeamHud";
import { KillChain } from "@/components/trainer/KillChain";
import { difficultyStars, inferPhase, operationLabel, operationNumber, stars } from "@/lib/trainer/operation";

export default function FocusPage() {
  const params = useParams<{ blockId: string }>();
  const router = useRouter();
  const block = getBlockById(params.blockId);
  const { toggleBlockComplete, state } = useProgress();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [guidedDone, setGuidedDone] = useState(false);
  const [decisionDone, setDecisionDone] = useState(false);
  const [drillsDone, setDrillsDone] = useState(false);

  if (!block) {
    return (
      <p className="text-slate-400">
        Bloque no encontrado.{" "}
        <Link href="/" className="text-emerald-400 underline">
          OPERATE
        </Link>
      </p>
    );
  }

  const n = operationNumber(block.id);
  const guided = block.guidedLab ?? [];
  const decisions = block.decisionDrills ?? [];
  const steps = guided.length ? [] : (block.practiceSteps ?? []);
  const stepsDone = steps.length === 0 || step >= steps.length;
  const guidedOk = guided.length === 0 || guidedDone;
  const decisionOk = decisions.length === 0 || decisionDone;
  const showDrills = guidedOk && stepsDone && decisionOk;
  const canFinish =
    (block.drills?.length ? drillsDone : showDrills) || state.blockStatus[block.id] === "completed";
  const totalParts = (guided.length ? guided.length : steps.length) || 1;
  const part = guided.length ? 1 : Math.min(steps.length, step + 1);

  if (!started) {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-8 text-center">
        <p className="font-mono text-xs text-emerald-400">{operationLabel(n)}</p>
        <h1 className="text-2xl font-bold text-white">{block.title}</h1>
        <p className="text-sm text-slate-300">{block.objective}</p>
        <p className="font-mono text-xs text-amber-300">{stars(difficultyStars(block))}</p>
        <p className="font-mono text-emerald-400">TIME {block.durationMin}:00</p>
        <p className="font-mono text-[10px] text-slate-500">PHASE {inferPhase(block).toUpperCase()}</p>
        <SafetyNote />
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="w-full rounded-md bg-emerald-600 py-3 text-lg font-semibold text-white hover:bg-emerald-500"
        >
          START OPERATION
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 py-2">
      <div className="rounded-lg border border-emerald-800/60 bg-slate-950 p-4">
        <p className="font-mono text-[10px] text-emerald-500">{operationLabel(n)}</p>
        <h1 className="text-lg font-bold text-white">{block.title}</h1>
        <p className="mt-1 text-xs text-slate-400">{block.objective}</p>
        <div className="mt-3">
          <FocusTimer durationMin={block.durationMin} />
        </div>
        <p className="mt-2 font-mono text-xs text-slate-500">
          STEP {guided.length ? "GUIDED" : `${part} / ${totalParts}`}
        </p>
      </div>

      {block.type === "practice" && (
        <>
          <RedTeamHud block={block} />
          <KillChain />
        </>
      )}

      {guided.length > 0 && !guidedDone && (
        <GuidedLabRunner steps={guided} troubleshooting={block.troubleshooting} onAllPassed={() => setGuidedDone(true)} />
      )}

      {guidedOk && !stepsDone && (
        <div className="rounded-lg border border-slate-800 p-4">
          <p className="font-mono text-xs text-slate-500">
            STEP {step + 1}/{steps.length}
          </p>
          <p className="mt-2 font-mono text-sm text-emerald-300">{steps[step]}</p>
          <SafetyNote compact />
          <button type="button" onClick={() => setStep((s) => s + 1)} className="mt-3 rounded-md bg-slate-800 px-3 py-2 text-sm text-white">
            Hecho →
          </button>
        </div>
      )}

      {guidedOk && stepsDone && decisions.length > 0 && !decisionDone && (
        <DecisionDrillRunner scenarios={decisions} onAllPassed={() => setDecisionDone(true)} />
      )}

      {showDrills && block.drills && block.drills.length > 0 && (
        <DrillPractice drills={block.drills} onAllPassed={() => setDrillsDone(true)} />
      )}

      {showDrills && <Checklist items={block.closingChecklist} storageKey={block.id} />}

      <div className="flex flex-wrap gap-2">
        <StuckPanel blockId={block.id} subtopics={block.subtopics} />
        <Link href="/" className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-300">
          EXIT
        </Link>
        <button
          type="button"
          disabled={!canFinish && !!block.drills?.length}
          onClick={() => {
            toggleBlockComplete(block.id, true);
            router.push("/");
          }}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          Terminé
        </button>
      </div>
    </div>
  );
}

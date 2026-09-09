"use client";

import Link from "next/link";
import { WEEK1_DECISION_DRILLS, EXTRA_DECISION_DRILLS, V8_ALL_DRILLS } from "@/content/decision-drills";
import { DecisionDrillRunner } from "@/components/trainer/DecisionDrillRunner";

export default function DecisionsPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link href="/train" className="text-xs text-slate-500">
        ← TRAIN
      </Link>
      <h1 className="text-xl font-bold text-white">DECISION DRILLS</h1>
      <p className="text-sm text-slate-400">
        Prioridad + porqué. Incluye el pack V8 (Linux, web chains, privesc, pivot, reporting…). TRY AGAIN si la letra
        es posible pero mala metodología.
      </p>
      <DecisionDrillRunner
        scenarios={[...WEEK1_DECISION_DRILLS, ...EXTRA_DECISION_DRILLS, ...V8_ALL_DRILLS]}
        onAllPassed={() => undefined}
      />
    </div>
  );
}

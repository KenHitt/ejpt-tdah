"use client";

import { useState } from "react";
import Link from "next/link";
import { WEEK1_DECISION_DRILLS } from "@/content/decision-drills";
import { DecisionDrillRunner } from "@/components/trainer/DecisionDrillRunner";
import { listWeaknesses } from "@/lib/trainer/adaptive";
import { useProgress } from "@/lib/progress/context";
import { bandLabelEs } from "@/lib/trainer/bands";

export default function FifteenPage() {
  const { state } = useProgress();
  const [score, setScore] = useState<number | null>(null);
  const weak = listWeaknesses(state)[0];
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link href="/train" className="text-xs text-slate-500">
        ← TRAIN
      </Link>
      <h1 className="text-xl font-bold text-white">15-MIN CHALLENGE</h1>
      {score === null ? (
        <DecisionDrillRunner scenarios={WEEK1_DECISION_DRILLS} onAllPassed={setScore} />
      ) : (
        <div className="space-y-2 text-sm">
          <p className="text-3xl font-bold text-white">{score}%</p>
          <p className="text-emerald-300">DECISION QUALITY · {bandLabelEs(score)}</p>
          {weak && <p className="text-amber-300">WEAKNESS · {weak.labelEs}</p>}
        </div>
      )}
    </div>
  );
}

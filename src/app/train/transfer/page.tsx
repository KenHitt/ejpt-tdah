"use client";

import Link from "next/link";
import { V9_ALL_DRILLS } from "@/content/v9/drills";
import { DecisionDrillRunner } from "@/components/trainer/DecisionDrillRunner";

export default function TransferLabsPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link href="/train" className="text-xs text-slate-500">
        ← TRAIN
      </Link>
      <h1 className="text-xl font-bold text-white">TRANSFER LABS</h1>
      <p className="text-sm text-slate-400">
        Same skill, different host/shares/CIDR/app. Checks concept vs memorized procedure. Complements Decision
        Drills — does not replace them.
      </p>
      <DecisionDrillRunner scenarios={V9_ALL_DRILLS} onAllPassed={() => undefined} />
    </div>
  );
}

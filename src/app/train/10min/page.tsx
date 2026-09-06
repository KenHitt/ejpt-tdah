"use client";

import { useState } from "react";
import Link from "next/link";
import { TEN_MIN_PACK } from "@/content/micro-training";
import { MicroRunner } from "@/components/trainer/MicroRunner";

export default function TenMinPage() {
  const [score, setScore] = useState<number | null>(null);
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link href="/train" className="text-xs text-slate-500">
        ← TRAIN
      </Link>
      <h1 className="text-xl font-bold text-white">10-MIN MISSION</h1>
      <p className="text-xs text-slate-500">Sin VM. Ideal en el móvil.</p>
      {score === null ? <MicroRunner items={TEN_MIN_PACK} onDone={setScore} /> : <p className="text-emerald-300">SCORE {score}%</p>}
    </div>
  );
}

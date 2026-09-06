"use client";

import { useState } from "react";
import Link from "next/link";
import { MICRO_BANK } from "@/content/micro-training";
import { MicroRunner } from "@/components/trainer/MicroRunner";

function todayPack() {
  const start = new Date().getDate() % MICRO_BANK.length;
  return [...MICRO_BANK.slice(start), ...MICRO_BANK.slice(0, start)].slice(0, 4);
}

export default function FiveMinPage() {
  const [pack] = useState(todayPack);
  const [score, setScore] = useState<number | null>(null);
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link href="/train" className="text-xs text-slate-500">
        ← TRAIN
      </Link>
      <h1 className="text-xl font-bold text-white">5-MIN TRAINING</h1>
      {score === null ? (
        <MicroRunner items={pack} onDone={setScore} />
      ) : (
        <p className="text-emerald-300">SCORE {score}% · cierra la web o otra ronda.</p>
      )}
    </div>
  );
}

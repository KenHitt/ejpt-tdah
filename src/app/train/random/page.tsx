"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/progress/context";
import { randomOperationHref } from "@/lib/v8/recommend";
import { PRIMARY_BUTTON } from "@/lib/design/tokens";

export default function RandomOperationPage() {
  const { state } = useProgress();
  const href = useMemo(() => randomOperationHref(state), [state]);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link href="/train" className="text-xs text-slate-500">
        ← Training Gym
      </Link>
      <h1 className="text-2xl font-bold text-white">Random operation</h1>
      <p className="text-sm text-slate-400">
        Weighted toward real weaknesses when they exist. Not a lottery of skills you already mastered.
      </p>
      <Link href={href} className={PRIMARY_BUTTON}>
        START
      </Link>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NMAP_NEXT_STEP } from "@/content/decision-drills";
import { PromptCheckCard } from "@/components/trainer/PromptCheckCard";

export default function NmapRushPage() {
  const [left, setLeft] = useState(30);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link href="/train/arcade" className="text-xs text-slate-500">
        ← ARCADE
      </Link>
      <p className="font-mono text-3xl text-red-400">{left}s</p>
      <pre className="rounded bg-black p-3 font-mono text-xs text-emerald-200">{`22/tcp open ssh
80/tcp open http
139/tcp open netbios
445/tcp open microsoft-ds`}</pre>
      <p className="text-sm">Pick your first enumeration target. Then explain why.</p>
      {left === 0 && !done && <p className="text-amber-300">Tiempo. Igual responde; se registra precisión.</p>}
      <PromptCheckCard check={NMAP_NEXT_STEP.checks[0]} exerciseId="arcade:nmap-rush" onPassed={() => setDone(true)} />
    </div>
  );
}

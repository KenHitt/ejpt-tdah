"use client";

import Link from "next/link";
import { PRIMARY_BUTTON } from "@/lib/design/tokens";

/** Sesión de 10 min: recall + interpretación + decisión. No arcade aleatorio. */
export default function EmergencySessionPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href="/train" className="text-xs text-slate-500">
        ← TRAIN
      </Link>
      <p className="text-[11px] uppercase tracking-wide text-red-400">Emergency session</p>
      <h1 className="text-2xl font-bold text-white">10-min training</h1>
      <p className="text-sm text-slate-400">
        Only have ten minutes? This is a fixed sequence, not a random topic. Each piece records evidence.
      </p>
      <ol className="space-y-3 text-sm">
        <li className="rounded-lg border border-slate-800 p-4">
          <p className="font-mono text-[11px] text-slate-500">2 min · recall</p>
          <p className="text-white">Produce a due command without the cheat sheet.</p>
          <Link href="/memory" className="mt-2 inline-block text-red-400">
            Open Review →
          </Link>
        </li>
        <li className="rounded-lg border border-slate-800 p-4">
          <p className="font-mono text-[11px] text-slate-500">3 min · interpretation</p>
          <p className="text-white">Read a short output. Name the service, not the exploit.</p>
          <Link href="/train/5min" className="mt-2 inline-block text-red-400">
            Open Quick Fire →
          </Link>
        </li>
        <li className="rounded-lg border border-slate-800 p-4">
          <p className="font-mono text-[11px] text-slate-500">5 min · decision</p>
          <p className="text-white">Choose the next step and justify it. Letter + why.</p>
          <Link href="/train/decisions" className="mt-2 inline-block text-red-400">
            Open Decision drill →
          </Link>
        </li>
      </ol>
      <Link href="/train/decisions" className={PRIMARY_BUTTON}>
        START WITH DECISION IF SHORT ON TIME
      </Link>
    </div>
  );
}

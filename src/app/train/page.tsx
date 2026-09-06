"use client";

import Link from "next/link";

export default function TrainHubPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <p className="font-mono text-xs text-emerald-400">TRAIN · práctica, no roadmap</p>
      <h1 className="text-2xl font-bold text-white">Train</h1>
      <p className="text-sm text-slate-400">Tiempos muertos o concentración. Una cosa. El arcade no sustituye el lab.</p>
      <ul className="space-y-2">
        {[
          ["/train/5min", "5-MIN TRAINING", "celular / cola"],
          ["/train/10min", "10-MIN MISSION", "sin VM"],
          ["/train/15min", "15-MIN CHALLENGE", "varias decisiones"],
          ["/train/decisions", "DECISION DRILLS", "prioridad + porqué"],
          ["/train/whats-next", "WHAT'S NEXT?", "árbol de ataque"],
          ["/train/arcade", "RED TEAM ARCADE", "ligero, opcional"],
        ].map(([href, t, s]) => (
          <li key={href}>
            <Link href={href} className="block rounded-lg border border-slate-800 p-4 hover:border-emerald-600">
              <p className="font-semibold text-white">{t}</p>
              <p className="text-xs text-slate-500">{s}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

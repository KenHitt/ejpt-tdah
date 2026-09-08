"use client";

import Link from "next/link";
import { trainRecommendation, failKindAdvice } from "@/lib/v6/operation";
import { useProgress } from "@/lib/progress/context";
import { listWeaknesses } from "@/lib/trainer/adaptive";

const MODES = [
  ["/train/5min", "5-MIN TRAINING", "Recall / interpretación. Celular."],
  ["/train/10min", "10-MIN MISSION", "Mini escenario, sin VM."],
  ["/train/15min", "15-MIN CHALLENGE", "Varias decisiones."],
  ["/train/decisions", "DECISION DRILLS", "Prioridad + porqué."],
  ["/train/whats-next", "WHAT'S NEXT?", "Árbol de ataque."],
  ["/train/arcade", "RED TEAM ARCADE", "Ligero. No sustituye el lab."],
];

export default function TrainHubPage() {
  const { state } = useProgress();
  const rec = trainRecommendation(state);
  const advice = failKindAdvice(state);
  const weak = listWeaknesses(state).slice(0, 3);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <p className="font-mono text-xs text-amber-400">TRAIN · conectado al skill graph</p>
      <h1 className="text-2xl font-bold text-white">Train</h1>
      <p className="text-sm text-slate-400">
        Practica huecos de la ruta. Energy Mode no cambia el currículo; solo el tamaño de la sesión.
      </p>

      <section className="rounded-xl border-2 border-amber-600/70 p-4">
        <p className="text-[11px] uppercase text-amber-400">Recommended now</p>
        <p className="mt-1 text-lg font-semibold text-white">{rec.title}</p>
        <p className="text-sm text-slate-400">{rec.why}</p>
        <Link href={rec.href} className="mt-3 block rounded-lg bg-amber-500 py-3 text-center font-bold text-black">
          Empezar
        </Link>
      </section>

      {advice && <p className="text-sm text-slate-300">{advice}</p>}

      {weak.length > 0 && (
        <ul className="space-y-1 text-sm">
          {weak.map((w) => (
            <li key={w.id}>
              <Link href={w.href} className="text-slate-400 hover:text-amber-300">
                {w.severity}: {w.labelEs}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <ul className="space-y-2">
        {MODES.map(([href, t, s]) => (
          <li key={href}>
            <Link
              href={href}
              className={`block rounded-lg border p-4 hover:border-amber-600 ${
                href === rec.href ? "border-amber-600" : "border-slate-800"
              }`}
            >
              <p className="font-semibold text-white">{t}</p>
              <p className="text-xs text-slate-500">{s}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import Link from "next/link";
import { trainRecommendation, failKindAdvice } from "@/lib/v6/operation";
import { useProgress } from "@/lib/progress/context";
import { listWeaknesses } from "@/lib/trainer/adaptive";
import { PRIMARY_BUTTON } from "@/lib/design/tokens";
import { ChallengeCard } from "@/components/cards";

/** V7 sección 33 — Training Gym. Mismos hrefs de siempre, nombres pedagógicos. */
const MODES = [
  ["/train/5min", "QUICK FIRE", "~5 min", "Recall / interpretación. Celular."],
  ["/train/10min", "MICRO OP", "~10 min", "Mini escenario, sin VM."],
  ["/train/15min", "DECISION LAB", "~15 min", "Varias decisiones seguidas."],
  ["/train/decisions", "DECISION DRILLS", "Variable", "Prioridad + porqué."],
  ["/train/whats-next", "ATTACK PATH", "Variable", "What's next? Árbol de ataque."],
  ["/train/arcade", "FREE PLAY", "Ligero", "Escenario aleatorio. No sustituye el lab."],
  ["/train/random", "RANDOM OPERATION", "Variable", "Escenario sesgado a tus weaknesses reales."],
  ["/operaciones", "MACHINES", "30–60 min", "Operaciones internas (mesa). No reemplazan VirtualBox."],
] as const;

export default function TrainHubPage() {
  const { state } = useProgress();
  const rec = trainRecommendation(state);
  const advice = failKindAdvice(state);
  const weak = listWeaknesses(state).slice(0, 3);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <p className="font-mono text-xs text-red-400">TRAINING GYM · conectado al skill graph</p>
      <h1 className="text-2xl font-bold text-white">Training Gym</h1>
      <p className="text-sm text-slate-400">
        Short, focused reps tied to real weaknesses. Energy Mode doesn&apos;t change the curriculum, only session
        size.
      </p>

      <section className="rounded-xl border-2 border-red-700/70 bg-slate-950 p-4">
        <p className="text-[11px] uppercase text-red-400">Recommended now</p>
        <p className="mt-1 text-lg font-semibold text-white">{rec.title}</p>
        <p className="text-sm text-slate-400">{rec.why}</p>
        <Link href={rec.href} className={`${PRIMARY_BUTTON} mt-3`}>
          Empezar
        </Link>
      </section>

      {advice && <p className="text-sm text-slate-300">{advice}</p>}

      {weak.length > 0 && (
        <ul className="space-y-1 text-sm">
          {weak.map((w) => (
            <li key={w.id}>
              <Link href={w.href} className="text-slate-400 hover:text-red-300">
                {w.severity}: {w.labelEs}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <ul className="space-y-2">
        {MODES.map(([href, t, estimatedLabel, descriptionEs]) => (
          <li key={href}>
            <ChallengeCard
              titleEs={t}
              descriptionEs={descriptionEs}
              estimatedLabel={estimatedLabel}
              status={href === rec.href ? "recommended" : "available"}
              href={href}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

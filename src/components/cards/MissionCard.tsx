import Link from "next/link";
import { ReactNode } from "react";
import { PRIMARY_BUTTON, SURFACE_ACTIVE } from "@/lib/design/tokens";

export interface MissionCardProps {
  phaseLabel: string;
  dayLabel: string;
  titleEs: string;
  objectiveEs: string;
  whyEs?: string;
  stepsDone: number;
  stepsTotal: number;
  estimatedLabel: string;
  difficulty: number;
  href: string;
  ctaLabel?: string;
  extra?: ReactNode;
}

/** Operación única en Mission Control. Una sola CTA (sección 6/7/38). */
export function MissionCard({
  phaseLabel,
  dayLabel,
  titleEs,
  objectiveEs,
  whyEs,
  stepsDone,
  stepsTotal,
  estimatedLabel,
  difficulty,
  href,
  ctaLabel = "CONTINUE OPERATION",
  extra,
}: MissionCardProps) {
  const pct = stepsTotal ? Math.round((stepsDone / stepsTotal) * 100) : 0;
  return (
    <section className={`${SURFACE_ACTIVE} p-6`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-red-400">Current operation</p>
      <p className="mt-3 font-mono text-xs text-slate-400">{phaseLabel}</p>
      <p className="font-mono text-xs text-slate-500">{dayLabel}</p>
      <h2 className="mt-2 text-2xl font-bold text-white">{titleEs}</h2>
      <p className="mt-2 text-sm text-slate-300">{objectiveEs}</p>
      {whyEs && <p className="mt-1 text-sm text-slate-500">{whyEs}</p>}

      <div className="mt-4">
        <div className="h-1.5 overflow-hidden rounded bg-slate-800">
          <div className="h-full bg-red-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-slate-400">
          <span>
            Progress {stepsDone}/{stepsTotal}
          </span>
          <span>{estimatedLabel}</span>
          <span>Difficulty {"●".repeat(difficulty)}{"○".repeat(Math.max(0, 5 - difficulty))}</span>
        </div>
      </div>

      <Link href={href} className={`${PRIMARY_BUTTON} mt-6`}>
        {ctaLabel}
      </Link>
      {extra}
    </section>
  );
}

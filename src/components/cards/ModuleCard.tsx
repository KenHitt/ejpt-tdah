import Link from "next/link";
import { ReactNode } from "react";
import { progressBarClass, statusBadgeClass, statusLabelEn, SURFACE } from "@/lib/design/tokens";

export interface ModuleCardProps {
  phaseLabel: string;
  titleEs: string;
  subtitleEs?: string;
  descriptionEs: string;
  pct: number;
  lessons: number;
  labs?: number;
  challenges?: number;
  assessments?: number;
  prerequisiteEs?: string;
  status: string;
  href: string;
  ctaLabel?: string;
  children?: ReactNode;
}

/** Card de módulo/fase de Academy (sección 12). Progressive disclosure: resumen, no toda la profundidad. */
export function ModuleCard({
  phaseLabel,
  titleEs,
  subtitleEs,
  descriptionEs,
  pct,
  lessons,
  labs,
  challenges,
  assessments,
  prerequisiteEs,
  status,
  href,
  ctaLabel = "CONTINUE",
  children,
}: ModuleCardProps) {
  return (
    <div className={`${SURFACE} p-4`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-red-400">{phaseLabel}</p>
          <h3 className="mt-0.5 text-lg font-bold text-white">{titleEs}</h3>
          {subtitleEs && <p className="text-sm text-slate-400">{subtitleEs}</p>}
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadgeClass(status)}`}>
          {statusLabelEn(status)}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-400">{descriptionEs}</p>

      <div className="mt-3 h-1.5 overflow-hidden rounded bg-slate-800">
        <div className={`h-full ${progressBarClass(pct)}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-[11px] text-slate-500">{pct}%</p>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-slate-500">
        <span>{lessons} lessons</span>
        {typeof labs === "number" && <span>{labs} labs</span>}
        {typeof challenges === "number" && <span>{challenges} challenges</span>}
        {typeof assessments === "number" && <span>{assessments} assessment</span>}
      </div>

      {prerequisiteEs && (
        <p className="mt-2 text-[11px] text-slate-600">
          <span className="uppercase text-slate-500">Prerequisite</span> · {prerequisiteEs}
        </p>
      )}

      {children}

      <Link
        href={href}
        className="mt-4 block rounded-lg border border-red-700 py-2 text-center text-sm font-semibold text-red-300 hover:bg-red-500/10"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

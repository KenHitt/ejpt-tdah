import Link from "next/link";
import { progressBarClass, statusBadgeClass, statusLabelEn, SURFACE } from "@/lib/design/tokens";

export interface SkillCardProps {
  titleEs: string;
  pct: number;
  status: string;
  knowledge?: number;
  reasoning?: number;
  practical?: number;
  weaknessEs?: string;
  href: string;
}

/** Card de skill individual (sección 13). */
export function SkillCard({ titleEs, pct, status, knowledge, reasoning, practical, weaknessEs, href }: SkillCardProps) {
  return (
    <div className={`${SURFACE} p-4`}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-base font-bold uppercase tracking-wide text-white">{titleEs}</h3>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadgeClass(status)}`}>
          {statusLabelEn(status)}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded bg-slate-800">
        <div className={`h-full ${progressBarClass(pct)}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-[11px] text-slate-500">{pct}%</p>

      {(knowledge !== undefined || reasoning !== undefined || practical !== undefined) && (
        <dl className="mt-3 space-y-1 text-[11px] text-slate-400">
          {knowledge !== undefined && (
            <div className="flex justify-between">
              <dt>Knowledge</dt>
              <dd>{knowledge}%</dd>
            </div>
          )}
          {reasoning !== undefined && (
            <div className="flex justify-between">
              <dt>Reasoning</dt>
              <dd>{reasoning}%</dd>
            </div>
          )}
          {practical !== undefined && (
            <div className="flex justify-between">
              <dt>Practical</dt>
              <dd>{practical}%</dd>
            </div>
          )}
        </dl>
      )}

      {weaknessEs && (
        <p className="mt-2 text-[11px] text-red-300">
          <span className="uppercase text-red-500">Recent weakness</span> · {weaknessEs}
        </p>
      )}

      <Link
        href={href}
        className="mt-3 block rounded-lg border border-red-700 py-1.5 text-center text-xs font-semibold text-red-300 hover:bg-red-500/10"
      >
        REVIEW
      </Link>
    </div>
  );
}

import { progressBarClass, SURFACE } from "@/lib/design/tokens";

export interface ProgressCardProps {
  label: string;
  value: string;
  pct?: number;
  hint?: string;
}

/** Stat cards del Dashboard top section (sección 15). */
export function ProgressCard({ label, value, pct, hint }: ProgressCardProps) {
  return (
    <div className={`${SURFACE} p-4`}>
      <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      {pct !== undefined && (
        <div className="mt-2 h-1.5 overflow-hidden rounded bg-slate-800">
          <div className={`h-full ${progressBarClass(pct)}`} style={{ width: `${pct}%` }} />
        </div>
      )}
      {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

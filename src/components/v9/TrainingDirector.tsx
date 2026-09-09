import Link from "next/link";
import { PRIMARY_BUTTON, SURFACE } from "@/lib/design/tokens";
import { AdvisorBoard } from "@/lib/v9/recommend";
import { TimeBudget } from "@/content/v9/types";

export function TrainingDirector({
  board,
  budget,
  onBudget,
}: {
  board: AdvisorBoard;
  budget?: TimeBudget;
  onBudget?: (b: TimeBudget) => void;
}) {
  const p = board.primary;
  return (
    <section className="space-y-4">
      <div className="rounded-xl border-2 border-red-700 bg-slate-950 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-400">Your training director</p>
        <p className="mt-2 text-xl font-bold text-white">{p.titleEs}</p>
        <p className="mt-1 font-mono text-[11px] text-slate-500">
          ~{p.durationMin} min
          {p.skillId ? ` · ${p.skillId}` : ""}
          {p.dimension ? ` · ${p.dimension}` : ""}
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-wide text-slate-500">Why this?</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-300">
          {p.whyBullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-slate-400">
          <span className="text-slate-500">Goal: </span>
          {p.goalEs}
        </p>
        <p className="mt-2 text-sm text-slate-500">{board.advisor.afterEs}</p>
        <Link href={p.href} className={`${PRIMARY_BUTTON} mt-4`}>
          START {p.durationMin}-MIN ACTIVITY
        </Link>
      </div>

      {onBudget && (
        <div className="flex flex-wrap gap-2">
          {([5, 15, 60] as TimeBudget[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => onBudget(b)}
              className={`rounded-full border px-3 py-1 text-xs ${
                budget === b ? "border-red-600 text-red-300" : "border-slate-700 text-slate-400"
              }`}
            >
              If you have {b} min
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {board.quick && <Mini label="Quick win" rec={board.quick} />}
        {board.weakness && <Mini label="Weakness repair" rec={board.weakness} />}
        {board.stretch && <Mini label="Stretch" rec={board.stretch} />}
      </div>
    </section>
  );
}

function Mini({ label, rec }: { label: string; rec: AdvisorBoard["primary"] }) {
  return (
    <Link href={rec.href} className={`${SURFACE} block p-4 hover:border-red-700`}>
      <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-white">{rec.titleEs}</p>
      <p className="mt-1 font-mono text-[11px] text-slate-500">~{rec.durationMin} min</p>
      <p className="mt-1 text-xs text-slate-500">{rec.whyBullets[0]}</p>
    </Link>
  );
}

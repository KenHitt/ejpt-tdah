"use client";

import Link from "next/link";
import { CURRICULUM, globalWeekIndex } from "@/content/curriculum";
import { useProgress } from "@/lib/progress/context";
import { StudyBlock } from "@/lib/types";

const TYPE_LABEL: Record<StudyBlock["type"], string> = {
  theory: "Teoría",
  practice: "Práctica",
  drill: "Drill",
  checkpoint: "Checkpoint",
  simulacro: "Simulacro",
};

const TYPE_COLOR: Record<StudyBlock["type"], string> = {
  theory: "bg-sky-500/10 text-sky-300",
  practice: "bg-emerald-500/10 text-emerald-300",
  drill: "bg-purple-500/10 text-purple-300",
  checkpoint: "bg-amber-500/10 text-amber-300",
  simulacro: "bg-red-500/10 text-red-300",
};

export default function PlanPage() {
  const { state, toggleBlockComplete } = useProgress();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Plan completo — eJPT en 3 meses</h1>
        <p className="mt-1 text-sm text-slate-400">
          12 semanas, bloques de 45-50 min, un objetivo verificable por bloque. Marca cada bloque cuando lo termines.
        </p>
      </div>

      {CURRICULUM.map((month) => {
        const monthBlocks = month.weeks.flatMap((w) => w.blocks);
        const monthDone = monthBlocks.filter((b) => state.blockStatus[b.id] === "completed").length;

        return (
          <section key={month.id} className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-slate-800 pb-2">
              <h2 className="text-lg font-semibold text-white">{month.title}</h2>
              <span className="text-xs text-slate-500">
                {monthDone}/{monthBlocks.length} bloques
              </span>
            </div>
            <p className="text-sm text-slate-400">{month.summary}</p>

            <div className="space-y-6">
              {month.weeks.map((week) => {
                const gWeek = globalWeekIndex(week.id);
                return (
                  <div key={week.id} className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
                    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-emerald-400">
                        {week.title}{" "}
                        {gWeek > 0 ? (
                          <span className="text-slate-500">(semana global {gWeek})</span>
                        ) : (
                          <span className="text-slate-500">(laboratorio, no cuenta en el calendario de examen)</span>
                        )}
                      </h3>
                    </div>
                    <p className="mb-3 text-sm text-slate-400">{week.goal}</p>

                    <ul className="space-y-2">
                      {week.blocks.map((block) => {
                        const completed = state.blockStatus[block.id] === "completed";
                        return (
                          <li
                            key={block.id}
                            className="flex items-start gap-3 rounded-md border border-slate-800 bg-slate-950/50 p-3"
                          >
                            <input
                              type="checkbox"
                              checked={completed}
                              onChange={(e) => toggleBlockComplete(block.id, e.target.checked)}
                              className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                            />
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <Link
                                  href={`/plan/${block.id}`}
                                  className={`font-medium hover:underline ${completed ? "text-slate-500 line-through" : "text-white"}`}
                                >
                                  {block.title}
                                </Link>
                                <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLOR[block.type]}`}>
                                  {TYPE_LABEL[block.type]}
                                </span>
                                <span className="text-[11px] text-slate-500">{block.durationMin} min</span>
                              </div>
                              <p className="mt-0.5 text-xs text-slate-400">{block.objective}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

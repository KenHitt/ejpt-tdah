"use client";

import Link from "next/link";
import { COMMAND_BANK, commandsByCategory } from "@/content/command-bank";
import { useProgress } from "@/lib/progress/context";
import { isCommandDue } from "@/lib/trainer/adaptive";

export default function MemoryPage() {
  const grouped = commandsByCategory();
  const { state } = useProgress();
  const attempts = state.trainer?.attempts ?? [];
  const dueIds = new Set(COMMAND_BANK.filter((c) => isCommandDue(state, c.id)).map((c) => c.id));

  const errors = (id: string) => attempts.filter((a) => a.exerciseId.startsWith(id) && !a.correct).length;
  const ok = (id: string) => attempts.filter((a) => a.exerciseId.startsWith(id) && a.correct).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs text-emerald-400">COMMAND MEMORY · not a cheat sheet</p>
        <h1 className="text-2xl font-bold text-white">Flash Drill</h1>
        <p className="mt-1 text-sm text-slate-400">
          No leas la lista. Elige un comando y prodúcelo: herramienta → flag → comando completo → concepto. Los marcados
          REPASAR están vencidos (SRS).
        </p>
      </div>
      {Array.from(grouped.entries()).map(([cat, cards]) => {
        const sorted = [...cards].sort((a, b) => Number(dueIds.has(b.id)) - Number(dueIds.has(a.id)));
        return (
          <section key={cat}>
            <h2 className="mb-2 font-mono text-sm text-emerald-400">{cat}</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {sorted.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/memory/${c.id}`}
                    className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:border-emerald-600 ${
                      dueIds.has(c.id) ? "border-amber-700 bg-amber-500/5" : "border-slate-800 bg-slate-900/40"
                    }`}
                  >
                    <span className="font-mono text-emerald-300">{c.fragment}</span>
                    <span className="text-xs text-slate-500">
                      {dueIds.has(c.id) ? "REPASAR · " : ""}
                      {ok(c.id)} ok / {errors(c.id)} fail
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

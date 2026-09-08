"use client";

import Link from "next/link";
import { COMMAND_BANK, commandsByCategory } from "@/content/command-bank";
import { useProgress } from "@/lib/progress/context";
import { dueCommands, isCommandDue, listWeaknesses } from "@/lib/trainer/adaptive";
import { failKindAdvice } from "@/lib/v6/operation";

export default function MemoryPage() {
  const grouped = commandsByCategory();
  const { state } = useProgress();
  const attempts = state.trainer?.attempts ?? [];
  const dueIds = new Set(COMMAND_BANK.filter((c) => isCommandDue(state, c.id)).map((c) => c.id));
  const due = dueCommands(state);
  const failedRecently = COMMAND_BANK.filter((c) => {
    const mine = attempts.filter((a) => a.exerciseId.startsWith(c.id) && !a.correct);
    return mine.length > 0;
  }).slice(0, 8);
  const advice = failKindAdvice(state);
  const weak = listWeaknesses(state).filter((w) => w.severity !== "review").slice(0, 3);

  const errors = (id: string) => attempts.filter((a) => a.exerciseId.startsWith(id) && !a.correct).length;
  const ok = (id: string) => attempts.filter((a) => a.exerciseId.startsWith(id) && a.correct).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs text-red-400">REVIEW · SRS, no lista aleatoria</p>
        <h1 className="text-2xl font-bold text-white">Recall</h1>
        <p className="mt-1 text-sm text-slate-400">
          Prioridad: errores recientes → conceptos débiles → comandos vencidos. No leas la lista como cheat sheet.
        </p>
        {advice && <p className="mt-2 text-sm text-amber-200">{advice}</p>}
        <Link href="/train" className="mt-3 inline-block rounded-full border border-red-700 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/10">
          Open Training Gym →
        </Link>
      </div>

      {due.length > 0 && (
        <section>
          <h2 className="mb-2 font-mono text-sm text-amber-400">Vencidos ahora ({due.length})</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {due.slice(0, 8).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/memory/${c.id}`}
                  className="flex items-center justify-between rounded-md border border-amber-700 bg-amber-500/5 px-3 py-2 text-sm"
                >
                  <span className="font-mono text-amber-200">{c.fragment}</span>
                  <span className="text-xs text-slate-500">REPASAR</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {failedRecently.length > 0 && (
        <section>
          <h2 className="mb-2 font-mono text-sm text-red-400">Fallos recientes</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {failedRecently.map((c) => (
              <li key={c.id}>
                <Link href={`/memory/${c.id}`} className="block rounded-md border border-slate-800 px-3 py-2 text-sm text-slate-300">
                  {c.fragment} · {errors(c.id)} fail
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {weak.length > 0 && (
        <ul className="text-sm text-slate-400">
          {weak.map((w) => (
            <li key={w.id}>
              <Link href={w.href} className="hover:text-amber-300">
                Hueco: {w.labelEs}
              </Link>
            </li>
          ))}
        </ul>
      )}

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

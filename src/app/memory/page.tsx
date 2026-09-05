"use client";

import Link from "next/link";
import { commandsByCategory } from "@/content/command-bank";
import { useProgress } from "@/lib/progress/context";

export default function MemoryPage() {
  const grouped = commandsByCategory();
  const { state } = useProgress();
  const attempts = state.trainer?.attempts ?? [];

  const errors = (id: string) => attempts.filter((a) => a.exerciseId.startsWith(id) && !a.correct).length;
  const ok = (id: string) => attempts.filter((a) => a.exerciseId.startsWith(id) && a.correct).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs text-emerald-400">COMMAND MEMORY · not a cheat sheet</p>
        <h1 className="text-2xl font-bold text-white">Flash Drill</h1>
        <p className="mt-1 text-sm text-slate-400">
          No leas la lista. Elige un comando y prodúcelo: herramienta → flag → comando completo → concepto.
        </p>
      </div>
      {Array.from(grouped.entries()).map(([cat, cards]) => (
        <section key={cat}>
          <h2 className="mb-2 font-mono text-sm text-emerald-400">{cat}</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {cards.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/memory/${c.id}`}
                  className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm hover:border-emerald-600"
                >
                  <span className="font-mono text-emerald-300">{c.fragment}</span>
                  <span className="text-xs text-slate-500">
                    {ok(c.id)} ok / {errors(c.id)} fail
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

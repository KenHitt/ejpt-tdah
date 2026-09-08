"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LEARN_ARTICLES } from "@/content/learn-articles";
import { V6_SKILLS } from "@/content/v6/skills";
import { ACADEMY_WORKSHOPS } from "@/content/academy/workshops";
import { learnMeta } from "@/content/v6/relations";
import { HONEST_HOURS } from "@/content/v6/hours";

type DepthFilter = "ALL" | "QUICK" | "DEEP" | "MASTERCLASS";

export default function LearnIndexPage() {
  const [depth, setDepth] = useState<DepthFilter>("QUICK");
  const tracks = Array.from(new Set(LEARN_ARTICLES.map((a) => a.track)));
  const fichas = useMemo(() => {
    if (depth === "ALL" || depth === "QUICK") return LEARN_ARTICLES;
    if (depth === "DEEP") return LEARN_ARTICLES.filter((a) => learnMeta(a.id).depth === "DEEP");
    return [];
  }, [depth]);

  const quick = LEARN_ARTICLES.filter((a) => learnMeta(a.id).depth === "QUICK");
  const deepFichas = LEARN_ARTICLES.filter((a) => learnMeta(a.id).depth === "DEEP");

  return (
    <div className="space-y-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-red-400">Reference</p>
      <h1 className="mt-2 text-2xl font-bold text-white">Reference</h1>
      <p className="text-sm text-slate-400">
        Quick lookup, not the main path. {LEARN_ARTICLES.length} fichas · ~{HONEST_HOURS.fichasEstimated} h estimadas.
        Repaso 2–12 min. Ampliar superficie no garantiza el aprobado de INE.
      </p>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["QUICK", `Quick · 2–5 min (${quick.length})`],
            ["DEEP", `Deep dive · fichas largas (${deepFichas.length})`],
            ["MASTERCLASS", `Masterclass · skills (${V6_SKILLS.length})`],
            ["ALL", "Todas las fichas"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setDepth(id)}
            className={`rounded-full px-3 py-1 text-[11px] ${
              depth === id ? "bg-red-600 text-white" : "border border-slate-700 text-slate-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {depth === "MASTERCLASS" ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {V6_SKILLS.map((s) => (
            <li key={s.id}>
              <Link href={`/master/${s.id}`} className="block rounded-md border border-slate-800 p-3 hover:border-red-600">
                <p className="text-[10px] uppercase text-slate-500">{s.track}</p>
                <p className="text-white">{s.titleEs}</p>
                <p className="text-xs text-slate-500">60–120 min si haces el ciclo completo (estimado)</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <>
          {depth === "DEEP" && (
            <section>
              <h2 className="mb-2 font-mono text-xs text-red-500">Deep Dives (~40 min)</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {ACADEMY_WORKSHOPS.slice(0, 12).map((w) => (
                  <li key={w.id}>
                    <Link href={`/talleres/${w.id}`} className="block rounded-md border border-slate-800 p-3 hover:border-red-600">
                      <p className="text-white">{w.titleEs}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/talleres" className="mt-2 inline-block text-sm text-red-400">
                Ver los {ACADEMY_WORKSHOPS.length} Deep Dives →
              </Link>
            </section>
          )}
          {tracks.map((t) => {
            const items = (depth === "ALL" ? LEARN_ARTICLES : fichas).filter((a) => a.track === t);
            if (!items.length) return null;
            return (
              <section key={t}>
                <h2 className="mb-2 font-mono text-xs text-red-500">{t}</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {items.map((a) => {
                    const meta = learnMeta(a.id);
                    return (
                      <li key={a.id}>
                        <Link href={`/learn/${a.id}`} className="block rounded-md border border-slate-800 p-3 hover:border-red-600">
                          <p className="text-white">{a.titleEs}</p>
                          <p className="text-[11px] text-slate-500">
                            {meta.depth} · ~{meta.minutes} min
                            {meta.skill ? ` · ${meta.skill.titleEs}` : ""}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </>
      )}
      <Link href="/teoria" className="text-sm text-red-400 underline">
        Teoría por bloque (offline) →
      </Link>
    </div>
  );
}

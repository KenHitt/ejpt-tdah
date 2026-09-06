"use client";

import { useState } from "react";
import { WorkshopSection } from "@/lib/types";

export function WorkshopView({ sections }: { sections: WorkshopSection[] }) {
  const [open, setOpen] = useState<string | null>(sections[0]?.id ?? null);

  if (!sections.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-sky-400">Taller (un apartado a la vez)</p>
      <p className="text-xs text-slate-500">
        Leer no marca el bloque. Focus = pasos + recall. Esto explica el porqué.
      </p>
      {sections.map((s, i) => {
        const isOpen = open === s.id;
        return (
          <article key={s.id} className="rounded-lg border border-slate-800 bg-slate-950/60">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : s.id)}
              className="flex w-full items-start justify-between gap-2 px-3 py-2 text-left"
            >
              <span className="text-sm font-medium text-white">
                {s.titleEs}
                {s.optional ? (
                  <span className="ml-2 font-mono text-[10px] text-amber-400">ADVANCED / OPTIONAL</span>
                ) : null}
              </span>
              <span className="font-mono text-xs text-slate-500">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div className="space-y-3 border-t border-slate-800 px-3 py-3 text-sm leading-relaxed text-slate-300">
                {s.titleEn && <p className="font-mono text-xs text-emerald-400">{s.titleEn}</p>}
                {s.bodyEs.split("\n\n").map((p, idx) => (
                  <p key={idx} className="whitespace-pre-wrap">
                    {p}
                  </p>
                ))}
                {s.ejptForEs && (
                  <p className="rounded-md border border-sky-800/40 bg-sky-500/5 p-2 text-sky-100">{s.ejptForEs}</p>
                )}
                {s.diagram && (
                  <pre className="overflow-x-auto rounded-md border border-emerald-900/40 bg-slate-950 p-3 font-mono text-[11px] leading-snug text-emerald-200">
                    {s.diagram}
                  </pre>
                )}
                <p className="font-mono text-[10px] text-slate-600">
                  {i + 1}/{sections.length}
                </p>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

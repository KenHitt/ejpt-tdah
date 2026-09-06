"use client";

import { useMemo, useState } from "react";
import { CURRICULUM } from "@/content/curriculum";
import { StudyBlock } from "@/lib/types";
import { OfflinePackButton } from "@/components/OfflinePackButton";
import { GlossaryTable } from "@/components/GlossaryTable";
import { ComparisonTable } from "@/components/ComparisonTable";
import { WorkshopView } from "@/components/WorkshopView";
import { TroubleshootingList } from "@/components/TroubleshootingList";

export default function TeoriaPage() {
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const months = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return CURRICULUM;
    return CURRICULUM.map((m) => ({
      ...m,
      weeks: m.weeks
        .map((w) => ({
          ...w,
          blocks: w.blocks.filter(
            (b) =>
              b.title.toLowerCase().includes(needle) ||
              b.objective.toLowerCase().includes(needle) ||
              (b.theoryEs ?? "").toLowerCase().includes(needle) ||
              (b.titleEn ?? "").toLowerCase().includes(needle)
          ),
        }))
        .filter((w) => w.blocks.length > 0),
    })).filter((m) => m.weeks.length > 0);
  }, [q]);

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs text-emerald-400">TEORÍA · funciona sin datos</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Repaso en el móvil</h1>
        <p className="mt-1 text-sm text-slate-400">
          Un bloque a la vez. Con WiFi pulsa <strong>Guardar en este teléfono</strong>, luego en el móvil: Compartir →
          Añadir a pantalla de inicio. El progreso de Kali sigue en el PC (localStorage distinto).
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <OfflinePackButton />
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar bloque (SMB, LHOST, Nmap…)"
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
      />

      {months.map((month) => (
        <section key={month.id} className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-300">{month.title}</h2>
          {month.weeks.map((week) => (
            <div key={week.id}>
              <p className="mb-2 font-mono text-xs text-emerald-500">{week.title}</p>
              <ul className="space-y-2">
                {week.blocks.map((block) => (
                  <li key={block.id}>
                    <button
                      type="button"
                      onClick={() => setOpenId((id) => (id === block.id ? null : block.id))}
                      className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-left hover:border-emerald-700"
                    >
                      <span className="text-sm font-medium text-white">{block.title}</span>
                      <span className="mt-0.5 block text-xs text-slate-500">{block.objective}</span>
                    </button>
                    {openId === block.id ? <TheoryBody block={block} /> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function TheoryBody({ block }: { block: StudyBlock }) {
  return (
    <div className="mt-2 space-y-4 rounded-md border border-emerald-900/40 bg-slate-900/50 p-4 text-sm">
      {block.titleEn && <p className="font-mono text-xs text-emerald-400">{block.titleEn}</p>}
      {block.objectiveEn && <p className="font-mono text-xs text-emerald-300/80">{block.objectiveEn}</p>}

      {block.theoryEs && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-400">Por qué</p>
          <p className="mt-1 leading-relaxed text-slate-200">{block.theoryEs}</p>
        </div>
      )}
      {block.theoryEn && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">Exam English</p>
          <p className="mt-1 font-mono text-xs leading-relaxed text-emerald-200/90">{block.theoryEn}</p>
        </div>
      )}
      {block.examPhrases && block.examPhrases.length > 0 && (
        <ul className="space-y-1 font-mono text-xs text-amber-200">
          {block.examPhrases.map((p) => (
            <li key={p}>· {p}</li>
          ))}
        </ul>
      )}
      {block.workshop && block.workshop.length > 0 && <WorkshopView sections={block.workshop} />}
      {block.troubleshooting && block.troubleshooting.length > 0 && (
        <TroubleshootingList items={block.troubleshooting} />
      )}
      {block.comparisonTable && <ComparisonTable table={block.comparisonTable} />}
      {block.glossary && block.glossary.length > 0 && <GlossaryTable entries={block.glossary} />}
      {block.practiceSteps && block.practiceSteps.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Pasos (lectura)</p>
          <ol className="mt-1 list-decimal space-y-1 pl-5 text-slate-300">
            {block.practiceSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getBlockById, getWeekById, globalWeekIndex } from "@/content/curriculum";
import { getSubtopic } from "@/content/subtopics";
import { useProgress } from "@/lib/progress/context";
import { Checklist } from "@/components/Checklist";
import { GlossaryTable } from "@/components/GlossaryTable";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ResourceList } from "@/components/ResourceList";
import { DrillPractice } from "@/components/DrillPractice";
import { useState } from "react";

export default function BlockDetailPage() {
  const params = useParams<{ blockId: string }>();
  const router = useRouter();
  const block = getBlockById(params.blockId);
  const { state, toggleBlockComplete, reportFailure } = useProgress();
  const [reportedFor, setReportedFor] = useState<string | null>(null);

  if (!block) {
    return (
      <div className="text-slate-400">
        Bloque no encontrado. <Link href="/plan" className="text-emerald-400 underline">Volver al plan</Link>
      </div>
    );
  }

  const week = getWeekById(block.weekId);
  const gWeek = week ? globalWeekIndex(week.id) : undefined;
  const completed = state.blockStatus[block.id] === "completed";

  const handleReportFailure = (subtopicId: string) => {
    reportFailure(subtopicId);
    setReportedFor(subtopicId);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/plan" className="text-xs text-slate-500 hover:text-emerald-400">
            ← Volver al plan
          </Link>
          <Link href={`/focus/${block.id}`} className="text-xs font-semibold text-emerald-400 hover:underline">
            EMPEZAR Focus Mode →
          </Link>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-white">{block.title}</h1>
          {block.titleEn && <span className="font-mono text-sm text-emerald-400">{block.titleEn}</span>}
          <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">{block.durationMin} min</span>
          {gWeek ? <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">Exam week {gWeek}/12</span> : null}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          TDAH: este bloque termina en {block.durationMin} min. No abras Plan ni otro tema. Terminal de Kali (SO del PC) + esta
          pestaña.
        </p>
      </div>

      <div className="rounded-lg border border-emerald-700/50 bg-emerald-500/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">Goal / Objetivo (1 línea)</p>
        <p className="mt-1 text-base text-white">{block.objective}</p>
        {block.objectiveEn && <p className="mt-2 font-mono text-sm text-emerald-300">{block.objectiveEn}</p>}
      </div>

      {block.examPhrases && block.examPhrases.length > 0 && (
        <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">Exam English — frases que verás en eJPT</p>
          <ul className="mt-2 space-y-1 font-mono text-sm text-emerald-300">
            {block.examPhrases.map((p) => (
              <li key={p}>· {p}</li>
            ))}
          </ul>
        </div>
      )}

      {(block.theoryEs || block.theoryEn) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {block.theoryEs && (
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-sky-400">Por qué (español, corto)</h2>
              <p className="text-sm leading-relaxed text-slate-300">{block.theoryEs}</p>
            </div>
          )}
          {block.theoryEn && (
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-400">Why (English — exam reading)</h2>
              <p className="text-sm leading-relaxed text-emerald-200/90">{block.theoryEn}</p>
            </div>
          )}
        </div>
      )}

      {block.comparisonTable && (
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">Tabla comparativa</h2>
          <ComparisonTable table={block.comparisonTable} />
        </div>
      )}

      {block.practiceSteps && block.practiceSteps.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-400">
            Do this now / Haz esto ahora (comandos en inglés)
          </h2>
          <ol className="space-y-1.5">
            {block.practiceSteps.map((step, i) => (
              <li key={i} className="rounded-md bg-slate-900/50 px-3 py-2 text-sm text-slate-200">
                <span className="mr-2 font-mono text-emerald-500">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {block.drills && block.drills.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-purple-400">
            Ejercicios de fijación (escribe de memoria)
          </h2>
          <DrillPractice drills={block.drills} />
        </div>
      )}

      {block.glossary && block.glossary.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">Glosario bilingüe del bloque</h2>
          <GlossaryTable entries={block.glossary} />
        </div>
      )}

      {block.resources && block.resources.length > 0 && <ResourceList resources={block.resources} />}
      {block.extraResources && block.extraResources.length > 0 && (
        <ResourceList resources={block.extraResources} title="Recursos extra (si terminas antes de tiempo)" />
      )}

      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">Checklist de cierre</h2>
        <Checklist items={block.closingChecklist} storageKey={block.id} />
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-800 pt-4">
        <button
          onClick={() => toggleBlockComplete(block.id, !completed)}
          className={`rounded-md px-4 py-2 text-sm font-semibold ${
            completed ? "bg-slate-800 text-slate-300" : "bg-emerald-600 text-white hover:bg-emerald-500"
          }`}
        >
          {completed ? "✔ Bloque marcado como completado" : "Marcar bloque como completado"}
        </button>

        {block.subtopics.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">¿Fallaste algo de este bloque?</span>
            {block.subtopics.map((id) => {
              const sub = getSubtopic(id);
              return (
                <button
                  key={id}
                  onClick={() => handleReportFailure(id)}
                  className="rounded-md border border-red-800/60 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20"
                >
                  Reportar fallo: {sub?.nameEs ?? id}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {reportedFor && (
        <div className="rounded-lg border border-amber-700/60 bg-amber-500/10 p-4 text-sm text-amber-200">
          Fallo registrado en <strong>{getSubtopic(reportedFor)?.nameEs}</strong>. Regla fija #9: no sigas al siguiente bloque del plan
          todavía —{" "}
          <button onClick={() => router.push(`/remediation/${reportedFor}`)} className="font-semibold underline">
            ve al repaso dirigido ahora →
          </button>
        </div>
      )}
    </div>
  );
}

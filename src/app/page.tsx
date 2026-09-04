"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAllBlocks, TOTAL_BLOCKS, computeCurrentGlobalWeek } from "@/content/curriculum";
import { KNOWN_GAPS } from "@/content/subtopics";
import { useProgress } from "@/lib/progress/context";
import { diagnosePace, PLAN_TOTAL_DAYS } from "@/lib/regime";

export default function DashboardPage() {
  const { state, ensurePlanStarted } = useProgress();

  const completedCount = Object.values(state.blockStatus).filter((s) => s === "completed").length;
  const nextBlock = useMemo(() => getAllBlocks().find((b) => state.blockStatus[b.id] !== "completed"), [state.blockStatus]);
  const currentGlobalWeek = computeCurrentGlobalWeek(state.blockStatus);
  const diagnosis = diagnosePace(state.sessions, state.planStartedAt);

  const [daysLeft, setDaysLeft] = useState(PLAN_TOTAL_DAYS);
  useEffect(() => {
    const planStartedAt = state.planStartedAt;
    const timer = setTimeout(() => {
      if (!planStartedAt) {
        setDaysLeft(PLAN_TOTAL_DAYS);
        return;
      }
      setDaysLeft(Math.max(0, PLAN_TOTAL_DAYS - Math.floor((Date.now() - new Date(planStartedAt).getTime()) / 86_400_000)));
    }, 0);
    return () => clearTimeout(timer);
  }, [state.planStartedAt]);

  const criticalRisks = Object.values(state.failures).filter((f) => f.status === "critical-risk");

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-emerald-800/50 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
        <h1 className="text-2xl font-bold text-white">Objetivo: eJPT aprobado en 3 meses, al primer intento</h1>
        <p className="mt-1 text-sm text-slate-300">Compromiso fijo, no meta flexible. Semana global actual: {currentGlobalWeek}/12.</p>

        {!state.planStartedAt ? (
          <button
            onClick={ensurePlanStarted}
            className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Marcar HOY como el día 1 de mi plan de 3 meses
          </button>
        ) : (
          <p className="mt-3 font-mono text-lg text-emerald-400">
            {daysLeft} días restantes de 90 · empezaste el {new Date(state.planStartedAt).toLocaleDateString("es-ES")}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MiniStat label="Bloques completados" value={`${completedCount} / ${TOTAL_BLOCKS}`} />
        <MiniStat label="Déficit horas (vs. plan)" value={`${diagnosis.deficitHours} h`} danger={!diagnosis.onTrack} />
        <MiniStat label="Puntos críticos de riesgo" value={String(criticalRisks.length)} danger={criticalRisks.length > 0} />
      </div>

      {!diagnosis.onTrack && state.planStartedAt && (
        <div className="rounded-lg border border-red-700 bg-red-500/10 p-4 text-sm text-red-200">
          Diagnóstico honesto: vas {diagnosis.deficitHours}h por debajo de lo esperado.{" "}
          <Link href="/progreso" className="font-semibold underline">
            Ver el detalle y ajustar →
          </Link>
        </div>
      )}

      {criticalRisks.length > 0 && (
        <div className="rounded-lg border-2 border-red-600 bg-red-500/10 p-4 text-sm text-red-200">
          Tienes {criticalRisks.length} sub-tema(s) marcados como punto crítico de riesgo (fallaron 2 veces tras el repaso).{" "}
          <Link href="/progreso" className="font-semibold underline">
            Revisar ahora →
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Siguiente bloque</h2>
          {nextBlock ? (
            <>
              <p className="mt-2 text-lg font-semibold text-white">{nextBlock.title}</p>
              <p className="mt-1 text-sm text-slate-400">{nextBlock.objective}</p>
              <Link
                href={`/plan/${nextBlock.id}`}
                className="mt-3 inline-block rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Empezar bloque ({nextBlock.durationMin} min) →
              </Link>
            </>
          ) : (
            <p className="mt-2 text-emerald-400">¡Completaste todos los bloques del plan! Toca repasar y presentar el examen.</p>
          )}
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Tus huecos declarados</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {KNOWN_GAPS.map((g) => {
              const failure = state.failures[g.id];
              const done =
                getAllBlocks()
                  .filter((b) => b.subtopics.includes(g.id))
                  .every((b) => state.blockStatus[b.id] === "completed") && failure?.status !== "critical-risk";
              return (
                <li key={g.id} className="flex items-center justify-between gap-2">
                  <span className="text-slate-300">{g.nameEs}</span>
                  <span className={done ? "text-emerald-400" : "text-amber-400"}>{done ? "✔ cerrado" : "pendiente"}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/plan" className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-emerald-600">
          Ver plan completo
        </Link>
        <Link href="/simulacro" className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-emerald-600">
          Ir a simulacros
        </Link>
        <Link href="/glosario" className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-emerald-600">
          Glosario bilingüe
        </Link>
      </div>
    </div>
  );
}

function MiniStat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${danger ? "border-red-700 bg-red-500/10" : "border-slate-800 bg-slate-900/40"}`}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
    </div>
  );
}

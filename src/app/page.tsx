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
  const labDone = ["m0-w0-b1", "m0-w0-b2"].every((id) => state.blockStatus[id] === "completed");

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
    <div className="space-y-6">
      <p className="text-sm">
        <Link href="/como-usar" className="font-mono text-emerald-400 underline">
          First time here? Read HOW THIS SITE WORKS (2 min) →
        </Link>
      </p>

      <div className="rounded-xl border border-emerald-800/50 bg-gradient-to-br from-emerald-500/10 to-transparent p-5">
        <p className="font-mono text-xs text-emerald-400">TODAY · one block · then stop</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Haz UNA cosa (45–50 min). Cierra la web.</h1>
        <p className="mt-2 text-sm text-slate-400">
          Kali = SO de este PC. VirtualBox = solo las víctimas. El examen eJPT está en inglés: cada bloque muestra ES + EN.
        </p>
        {state.planStartedAt ? (
          <p className="mt-2 font-mono text-emerald-400">
            {daysLeft}/90 days left · exam-week {currentGlobalWeek}/12 · {completedCount}/{TOTAL_BLOCKS} blocks
          </p>
        ) : (
          <button
            onClick={ensurePlanStarted}
            className="mt-3 rounded-md bg-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
          >
            Start 90-day clock / arrancar reloj 90 días
          </button>
        )}
      </div>

      {!labDone && (
        <div className="rounded-lg border border-amber-700/50 bg-amber-500/5 p-4 text-sm text-amber-100">
          <p className="font-semibold">Todavía no hay lab → no abras Nmap del Mes 1.</p>
          <p className="mt-1 text-amber-200/80">
            Orden: vboxnet0 → import Metasploitable 2 → ping desde Kali host.{" "}
            <Link href="/plan/m0-w0-b1" className="underline">
              Bloque 1 del lab ahora →
            </Link>
          </p>
        </div>
      )}

      <div className="rounded-lg border-2 border-emerald-600 bg-slate-900 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">Do this now / Siguiente (único botón)</p>
        {nextBlock ? (
          <>
            <p className="mt-2 text-xl font-bold text-white">{nextBlock.title}</p>
            {nextBlock.titleEn && <p className="font-mono text-sm text-emerald-400">{nextBlock.titleEn}</p>}
            <p className="mt-1 text-sm text-slate-300">{nextBlock.objective}</p>
            {nextBlock.objectiveEn && <p className="mt-1 font-mono text-xs text-emerald-300">{nextBlock.objectiveEn}</p>}
            <Link
              href={`/plan/${nextBlock.id}`}
              className="mt-4 inline-block rounded-md bg-emerald-600 px-5 py-3 text-base font-semibold text-white hover:bg-emerald-500"
            >
              Start {nextBlock.durationMin} min block →
            </Link>
          </>
        ) : (
          <p className="mt-2 text-emerald-400">Plan completo. Toca simulacro final y examen INE.</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MiniStat label="Blocks done" value={`${completedCount}/${TOTAL_BLOCKS}`} />
        <MiniStat label="Hours deficit" value={`${diagnosis.deficitHours} h`} danger={!diagnosis.onTrack} />
        <MiniStat label="Critical topics" value={String(criticalRisks.length)} danger={criticalRisks.length > 0} />
      </div>

      {!diagnosis.onTrack && state.planStartedAt && (
        <p className="text-sm text-red-300">
          Déficit {diagnosis.deficitHours}h.{" "}
          <Link href="/progreso" className="underline">
            Números en Horas →
          </Link>
        </p>
      )}

      {criticalRisks.length > 0 && (
        <p className="text-sm text-red-300">
          Subtema crítico (falló 2 veces). No avances.{" "}
          <Link href="/progreso" className="underline">
            Ver cuál →
          </Link>
        </p>
      )}

      <div className="rounded-lg border border-slate-800 p-4">
        <p className="text-xs font-semibold uppercase text-slate-400">Your gaps / tus huecos</p>
        <ul className="mt-2 space-y-1 text-sm">
          {KNOWN_GAPS.map((g) => {
            const failure = state.failures[g.id];
            const done =
              getAllBlocks()
                .filter((b) => b.subtopics.includes(g.id))
                .every((b) => state.blockStatus[b.id] === "completed") && failure?.status !== "critical-risk";
            return (
              <li key={g.id} className="flex justify-between gap-2">
                <span>
                  <span className="text-slate-200">{g.nameEs}</span>
                  <span className="ml-2 font-mono text-xs text-emerald-500">{g.nameEn}</span>
                </span>
                <span className={done ? "text-emerald-400" : "text-amber-400"}>{done ? "done" : "open"}</span>
              </li>
            );
          })}
        </ul>
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

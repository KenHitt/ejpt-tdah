"use client";

import Link from "next/link";
import { CURRICULUM, computeCurrentGlobalWeek, globalWeekIndex } from "@/content/curriculum";
import { useProgress } from "@/lib/progress/context";

export default function SimulacroHubPage() {
  const { state, canTakeFullSimulacroToday } = useProgress();
  const currentGlobalWeek = computeCurrentGlobalWeek(state.blockStatus);

  const fullAttempts = state.attempts.filter((a) => a.id.startsWith("full:"));
  const nextFullNumber = fullAttempts.length + 1;
  const canFull = canTakeFullSimulacroToday();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Simulacros y Skill-checks</h1>
        <p className="mt-1 text-sm text-slate-400">
          Simulacros internos de la academia. 70% es Learning Pass (seguir con lagunas), no dominio. Mastered interno = 85%.
          Exam Reasoning = metodología sin comandos. <strong className="text-slate-200">No representan una garantía de
          aprobar el examen oficial de INE</strong> ni copian sus criterios.
        </p>
      </div>

      <section className="rounded-lg border border-purple-800/50 bg-purple-500/5 p-5">
        <h2 className="text-lg font-semibold text-white">Exam Reasoning Mode</h2>
        <p className="mt-1 text-sm text-slate-400">
          No comandos, no pistas, no te dicen la herramienta. Explicas metodología. Criterio interno, no INE.
        </p>
        <Link href="/simulacro/reasoning" className="mt-3 inline-block rounded-md bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600">
          Abrir Reasoning Mode →
        </Link>
      </section>

      <section className="rounded-lg border border-red-800/50 bg-red-500/5 p-5">
        <h2 className="text-lg font-semibold text-white">Simulacro Completo #{nextFullNumber}</h2>
        <p className="mt-1 text-sm text-slate-400">
          15 preguntas aleatorias de TODO lo cubierto hasta tu semana global actual ({currentGlobalWeek}). 20 minutos. 70% =
          Learning Pass (no dominio).
        </p>
        {!canFull && (
          <p className="mt-2 text-sm text-amber-300">
            Reprobaste un simulacro completo hoy. Regla fija: el siguiente simulacro completo va hasta tu próxima sesión de estudio.
          </p>
        )}
        <Link
          href="/simulacro/full"
          className={`mt-3 inline-block rounded-md px-4 py-2 text-sm font-semibold ${
            canFull ? "bg-red-600 text-white hover:bg-red-500" : "bg-slate-800 text-slate-500"
          }`}
          aria-disabled={!canFull}
          onClick={(e) => {
            if (!canFull) e.preventDefault();
          }}
        >
          {canFull ? "Empezar Simulacro Completo →" : "Bloqueado hasta la próxima sesión"}
        </Link>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Skill-checks por semana</h2>
        <div className="space-y-4">
          {CURRICULUM.map((month) => (
            <div key={month.id}>
              <p className="mb-2 text-sm font-semibold text-slate-400">{month.title}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {month.weeks.map((week) => {
                  const gWeek = globalWeekIndex(week.id);
                  const attempt = [...state.attempts].reverse().find((a) => a.id.startsWith(`skillcheck:${week.id}:`));
                  return (
                    <Link
                      key={week.id}
                      href={`/simulacro/skillcheck/${week.id}`}
                      className="flex items-center justify-between gap-2 rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2.5 text-sm hover:border-emerald-700"
                    >
                      <span className="text-slate-200">
                        Semana {gWeek} — {week.title.replace(/^Semana \d+ — /, "")}
                      </span>
                      {attempt && (
                        <span className={`text-xs font-semibold ${attempt.passed ? "text-emerald-400" : "text-red-400"}`}>
                          {attempt.score}%
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { computeCurrentGlobalWeek } from "@/content/curriculum";
import { pickFullSimulacroQuestions, GradedAttempt, FULL_SIMULACRO_DURATION_SEC } from "@/lib/simulacro";
import { useProgress } from "@/lib/progress/context";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { QuizResult } from "@/components/quiz/QuizResult";

export default function FullSimulacroPage() {
  const { state, addAttempt, markFullSimulacroFailedToday, canTakeFullSimulacroToday, reportFailure } = useProgress();
  const [started, setStarted] = useState(false);
  const [graded, setGraded] = useState<GradedAttempt | null>(null);

  const currentGlobalWeek = computeCurrentGlobalWeek(state.blockStatus);
  const questions = useMemo(() => pickFullSimulacroQuestions(currentGlobalWeek), [currentGlobalWeek]);
  const allowedToday = canTakeFullSimulacroToday();
  const fullAttempts = state.attempts.filter((a) => a.id.startsWith("full:"));

  const handleFinish = (result: GradedAttempt, answers: Record<string, string | string[]>) => {
    setGraded(result);
    addAttempt({
      id: `full:${fullAttempts.length + 1}:${Date.now()}`,
      userId: "local",
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      durationSec: FULL_SIMULACRO_DURATION_SEC,
      questionIds: questions.map((q) => q.id),
      answers,
      score: result.score,
      passed: result.passed,
    });
    if (!result.passed) {
      markFullSimulacroFailedToday();
      result.failedSubtopics.forEach((id) => reportFailure(id));
    }
  };

  if (!allowedToday && !graded) {
    return (
      <div className="rounded-lg border border-amber-700/60 bg-amber-500/10 p-5 text-sm text-amber-200">
        <p className="font-semibold">Simulacro completo bloqueado por hoy.</p>
        <p className="mt-1">
          Regla fija #10: si repruebas un simulacro completo, no se te da otro el mismo día. Vuelve en tu próxima sesión de estudio
          después de repasar los sub-temas fallados.
        </p>
        <Link href="/plan" className="mt-3 inline-block text-emerald-400 underline">
          Ir al plan de repaso →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/simulacro" className="text-xs text-slate-500 hover:text-emerald-400">
          ← Volver a Simulacros
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">Simulacro Completo #{fullAttempts.length + 1}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {questions.length} preguntas · 20 minutos cronometrados · umbral 70% · temario acumulado hasta semana global {currentGlobalWeek}.
        </p>
      </div>

      {!started && !graded && (
        <div className="rounded-lg border border-red-800/50 bg-red-500/5 p-5">
          <p className="text-sm text-slate-200">
            Antes de empezar: confirma que tienes 20 minutos SIN interrupciones. El cronómetro no se detiene una vez iniciado.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="mt-3 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Estoy listo → Iniciar cronómetro
          </button>
        </div>
      )}

      {started && !graded && (
        <QuizRunner
          title="Simulacro Completo eJPT"
          questions={questions}
          durationSec={FULL_SIMULACRO_DURATION_SEC}
          onFinish={handleFinish}
        />
      )}

      {graded && <QuizResult graded={graded} questions={questions} isFullSimulacro cooldownBlocked={!graded.passed} />}
    </div>
  );
}

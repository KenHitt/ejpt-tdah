"use client";

import { useState } from "react";
import Link from "next/link";
import { EXAM_REASONING_INTRO, EXAM_REASONING_SCENARIOS } from "@/content/exam-reasoning";
import { DecisionDrillRunner } from "@/components/trainer/DecisionDrillRunner";
import { useProgress } from "@/lib/progress/context";
import { MASTERED_PERCENT, LEARNING_PASS_PERCENT, bandLabelEs } from "@/lib/trainer/bands";

export default function ExamReasoningPage() {
  const { recordReasoningRun, state } = useProgress();
  const [started, setStarted] = useState(false);
  const [doneScore, setDoneScore] = useState<number | null>(null);

  const last = state.trainer?.reasoningRuns?.at(-1);

  const finish = (score: number) => {
    recordReasoningRun({ scenarioId: "exam-reasoning-pack", score });
    setDoneScore(score);
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link href="/simulacro" className="text-xs text-slate-500 hover:text-emerald-400">
        ← Examen
      </Link>
      <h1 className="text-2xl font-bold text-white">Exam Reasoning Mode</h1>
      <pre className="whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-200">
        {EXAM_REASONING_INTRO}
      </pre>
      {last && (
        <p className="text-sm text-slate-400">
          Último intento interno: {last.score}% — {bandLabelEs(last.score)}
        </p>
      )}

      {!started && doneScore === null && (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
          Empezar escenarios
        </button>
      )}

      {started && doneScore === null && (
        <DecisionDrillRunner scenarios={EXAM_REASONING_SCENARIOS} onAllPassed={finish} />
      )}

      {doneScore !== null && (
        <div className="rounded-lg border border-emerald-800 p-4 text-sm text-slate-200">
          <p className="text-2xl font-bold">{doneScore}%</p>
          <p className="mt-1">{bandLabelEs(doneScore)}</p>
          <p className="mt-2">Sesión de metodología cerrada. No es nota INE.</p>
          <p className="mt-2 text-xs text-slate-500">
            Learning Pass ≥{LEARNING_PASS_PERCENT}% · Mastered ≥{MASTERED_PERCENT}% (interno).
          </p>
          <Link href="/" className="mt-3 inline-block text-emerald-400 underline">
            Hoy
          </Link>
        </div>
      )}
    </div>
  );
}

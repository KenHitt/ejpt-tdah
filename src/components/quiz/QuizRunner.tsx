"use client";

import { useState } from "react";
import { QuizQuestion } from "@/lib/types";
import { GradedAttempt, gradeAttempt } from "@/lib/simulacro";
import { useCountdown, TimerBadge } from "./Timer";

interface QuizRunnerProps {
  title: string;
  questions: QuizQuestion[];
  durationSec?: number;
  onFinish: (graded: GradedAttempt, answers: Record<string, string | string[]>) => void;
}

export function QuizRunner({ title, questions, durationSec, onFinish }: QuizRunnerProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const graded = gradeAttempt(questions, answers);
    onFinish(graded, answers);
  };

  const secondsLeft = useCountdown(durationSec ?? 999999, () => {
    if (durationSec) handleSubmit();
  });

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
        <div>
          <h2 className="font-semibold text-white">{title}</h2>
          <p className="text-xs text-slate-400">
            {answeredCount}/{questions.length} respondidas
          </p>
        </div>
        {durationSec ? <TimerBadge secondsLeft={secondsLeft} /> : null}
      </div>

      <ol className="space-y-4">
        {questions.map((q, i) => (
          <li key={q.id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <p className="mb-1 text-xs font-semibold text-slate-500">Pregunta {i + 1}</p>
            <p className="mb-1 font-mono text-sm text-emerald-300">{q.promptEn}</p>
            <p className="mb-3 text-sm text-slate-400">{q.promptEs}</p>

            {q.type === "single" && q.options && (
              <div className="space-y-2">
                {q.options.map((opt, idx) => (
                  <label key={idx} className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
                    <input
                      type="radio"
                      name={q.id}
                      value={String(idx)}
                      disabled={submitted}
                      checked={answers[q.id] === String(idx)}
                      onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: String(idx) }))}
                      className="h-4 w-4 border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === "command" && (
              <input
                disabled={submitted}
                value={(answers[q.id] as string) ?? ""}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                placeholder="Escribe el comando exacto..."
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-emerald-300 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            )}
          </li>
        ))}
      </ol>

      <button
        onClick={handleSubmit}
        disabled={submitted}
        className="w-full rounded-md bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
      >
        {submitted ? "Calificando..." : "Entregar y calificar"}
      </button>
    </div>
  );
}

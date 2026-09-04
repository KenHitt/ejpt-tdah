"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getWeekById, globalWeekIndex } from "@/content/curriculum";
import { pickSkillCheckQuestions, GradedAttempt } from "@/lib/simulacro";
import { useProgress } from "@/lib/progress/context";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { QuizResult } from "@/components/quiz/QuizResult";
import { QuizQuestion } from "@/lib/types";

export default function SkillCheckPage() {
  const params = useParams<{ weekId: string }>();
  const week = getWeekById(params.weekId);
  const { addAttempt, reportFailure } = useProgress();
  const [graded, setGraded] = useState<GradedAttempt | null>(null);

  const subtopicIds = useMemo(() => Array.from(new Set(week?.blocks.flatMap((b) => b.subtopics) ?? [])), [week]);
  const questions = useMemo<QuizQuestion[]>(() => pickSkillCheckQuestions(subtopicIds, 5), [subtopicIds]);

  if (!week) {
    return (
      <div className="text-slate-400">
        Semana no encontrada. <Link href="/simulacro" className="text-emerald-400 underline">Volver</Link>
      </div>
    );
  }

  const handleFinish = (result: GradedAttempt, answers: Record<string, string | string[]>) => {
    setGraded(result);
    addAttempt({
      id: `skillcheck:${week.id}:${Date.now()}`,
      userId: "local",
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      durationSec: 0,
      questionIds: questions.map((q) => q.id),
      answers,
      score: result.score,
      passed: result.passed,
    });
    if (!result.passed) {
      result.failedSubtopics.forEach((id) => reportFailure(id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/simulacro" className="text-xs text-slate-500 hover:text-emerald-400">
          ← Volver a Simulacros
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Skill-check — Semana {globalWeekIndex(week.id)}: {week.title.replace(/^Semana \d+ — /, "")}
        </h1>
        <p className="mt-1 text-sm text-slate-400">Umbral de aprobación: 70%. Sin tiempo límite (no es un simulacro completo).</p>
      </div>

      {!graded && questions.length > 0 && (
        <QuizRunner title="Skill-check de semana" questions={questions} onFinish={handleFinish} />
      )}

      {questions.length === 0 && (
        <p className="text-sm text-amber-300">
          Todavía no hay suficientes preguntas cargadas para esta semana en el banco de quizzes. Continúa con el checklist de cierre
          del bloque final de la semana en el plan.
        </p>
      )}

      {graded && <QuizResult graded={graded} questions={questions} />}
    </div>
  );
}

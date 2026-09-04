"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getSubtopic } from "@/content/subtopics";
import { getBlocksForSubtopic, getAlternateResources } from "@/lib/remediation";
import { pickSkillCheckQuestions, GradedAttempt } from "@/lib/simulacro";
import { useProgress } from "@/lib/progress/context";
import { DrillPractice } from "@/components/DrillPractice";
import { ResourceList } from "@/components/ResourceList";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { QuizResult } from "@/components/quiz/QuizResult";
import { QuizQuestion } from "@/lib/types";

type Stage = "review" | "quiz" | "result";

export default function RemediationPage() {
  const params = useParams<{ subtopicId: string }>();
  const router = useRouter();
  const subtopicId = params.subtopicId;
  const sub = getSubtopic(subtopicId);
  const { state, resolveFailure, reportFailure } = useProgress();
  const [stage, setStage] = useState<Stage>("review");
  const [graded, setGraded] = useState<GradedAttempt | null>(null);

  const blocks = useMemo(() => getBlocksForSubtopic(subtopicId), [subtopicId]);
  const allDrills = useMemo(() => blocks.flatMap((b) => b.drills ?? []), [blocks]);
  const quizQuestions = useMemo<QuizQuestion[]>(() => pickSkillCheckQuestions([subtopicId], 4), [subtopicId]);

  const failure = state.failures[subtopicId];
  const isCriticalRisk = failure?.status === "critical-risk";

  if (!sub) {
    return (
      <div className="text-slate-400">
        Sub-tema no encontrado. <Link href="/plan" className="text-emerald-400 underline">Volver al plan</Link>
      </div>
    );
  }

  const handleQuizFinish = (result: GradedAttempt) => {
    setGraded(result);
    setStage("result");
    if (result.passed) {
      resolveFailure(subtopicId);
    } else {
      reportFailure(subtopicId); // segundo fallo consecutivo -> se marca critical-risk dentro del context
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/plan" className="text-xs text-slate-500 hover:text-emerald-400">
          ← Volver al plan
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">Repaso dirigido: {sub.nameEs}</h1>
        <p className="text-sm text-slate-400 font-mono">{sub.nameEn}</p>
      </div>

      <div className="rounded-lg border border-amber-700/50 bg-amber-500/5 p-4 text-sm text-amber-200">
        Regla fija #9: no avances al siguiente tema del plan hasta confirmar (con el mini skill-check de abajo) que este sub-tema exacto
        quedó firme. {failure && <>Fallos registrados hasta ahora en este sub-tema: <strong>{failure.failCount}</strong>.</>}
      </div>

      {isCriticalRisk && (
        <div className="rounded-lg border-2 border-red-600 bg-red-500/10 p-4">
          <p className="text-sm font-bold text-red-400">⚠ PUNTO CRÍTICO DE RIESGO PARA EL EXAMEN</p>
          <p className="mt-1 text-sm text-red-200">
            Este sub-tema falló 2 veces seguidas incluso después del repaso. Repetir el mismo enfoque no está funcionando — prueba un
            recurso o método DISTINTO antes de intentar de nuevo:
          </p>
          <div className="mt-3">
            <ResourceList resources={getAlternateResources(subtopicId)} title="Método alternativo sugerido" />
          </div>
        </div>
      )}

      {stage === "review" && (
        <div className="space-y-5">
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-sky-400">Teoría mínima (repaso, no repetición)</h2>
            {blocks.map((b) => (
              <p key={b.id} className="mb-2 text-sm leading-relaxed text-slate-300">
                {b.theoryEs}
              </p>
            ))}
          </div>

          {allDrills.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-purple-400">
                Ejercicios de fijación nuevos (distintos, mismo proceso)
              </h2>
              <DrillPractice drills={allDrills} />
            </div>
          )}

          <button
            onClick={() => setStage("quiz")}
            className="w-full rounded-md bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-500"
          >
            Ya practiqué → Tomar mini skill-check ({quizQuestions.length} preguntas)
          </button>
        </div>
      )}

      {stage === "quiz" && quizQuestions.length > 0 && (
        <QuizRunner title={`Skill-check: ${sub.nameEs}`} questions={quizQuestions} onFinish={handleQuizFinish} />
      )}

      {stage === "result" && graded && (
        <div className="space-y-4">
          <QuizResult graded={graded} questions={quizQuestions} />
          {graded.passed ? (
            <button
              onClick={() => router.push("/plan")}
              className="w-full rounded-md bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-500"
            >
              ✔ Confirmado — volver al plan original
            </button>
          ) : (
            <button
              onClick={() => {
                setStage("review");
                setGraded(null);
              }}
              className="w-full rounded-md bg-amber-600 px-4 py-3 font-semibold text-white hover:bg-amber-500"
            >
              Repetir el repaso dirigido (con enfoque distinto si es 2do fallo)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

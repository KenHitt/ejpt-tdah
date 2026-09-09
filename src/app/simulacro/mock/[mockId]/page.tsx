"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getMock, pickMockQuestions } from "@/content/v8/mocks";
import { useProgress } from "@/lib/progress/context";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { QuizResult } from "@/components/quiz/QuizResult";
import { GradedAttempt } from "@/lib/simulacro";
import { AfterActionReview } from "@/components/v8/AfterActionReview";

export default function InternalMockPage() {
  const params = useParams<{ mockId: string }>();
  const mock = getMock(params.mockId);
  const { addAttempt, reportFailure } = useProgress();
  const [started, setStarted] = useState(false);
  const [graded, setGraded] = useState<GradedAttempt | null>(null);
  const questions = useMemo(() => (mock ? pickMockQuestions(mock) : []), [mock]);

  if (!mock) {
    return (
      <Link href="/simulacro" className="text-red-400">
        Exam
      </Link>
    );
  }

  const handleFinish = (result: GradedAttempt, answers: Record<string, string | string[]>) => {
    setGraded(result);
    addAttempt({
      id: `mock:${mock.id}:${Date.now()}`,
      userId: "local",
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      durationSec: mock.durationSec,
      questionIds: questions.map((q) => q.id),
      answers,
      score: result.score,
      passed: result.passed,
    });
    if (!result.passed) result.failedSubtopics.forEach((id) => reportFailure(id));
  };

  return (
    <div className="space-y-6">
      <Link href="/simulacro" className="text-xs text-slate-500 hover:text-red-400">
        ← Exam
      </Link>
      <h1 className="text-2xl font-bold text-white">{mock.titleEs}</h1>
      <p className="text-sm text-slate-400">
        {mock.descriptionEs} Internal readiness. Not INE. 70% = Learning Pass (gaps remain).
      </p>

      {!started && !graded && (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="rounded-xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-500"
        >
          START ASSESSMENT
        </button>
      )}

      {started && !graded && (
        <QuizRunner title={mock.titleEs} questions={questions} durationSec={mock.durationSec} onFinish={handleFinish} />
      )}

      {graded && (
        <>
          <QuizResult graded={graded} questions={questions} />
          <AfterActionReview
            score={graded.score}
            correctLabel={`${graded.results.filter((r) => r.correct).length} / ${graded.results.length}`}
            reviewEs={
              graded.failedSubtopics.length
                ? `Weak areas recorded. Review → practice → reassess.`
                : "No failed subtopics this run."
            }
            nextHref={graded.failedSubtopics[0] ? `/remediation/${graded.failedSubtopics[0]}` : "/memory"}
            nextLabel="REVIEW WEAK AREAS"
          />
        </>
      )}
    </div>
  );
}

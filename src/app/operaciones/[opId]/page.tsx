"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getMachine } from "@/content/v8/operations";
import { DecisionDrillRunner } from "@/components/trainer/DecisionDrillRunner";
import { AfterActionReview } from "@/components/v8/AfterActionReview";
import { useCourse } from "@/lib/course/context";
import { useProgress } from "@/lib/progress/context";
import { recommendAfterActivity } from "@/lib/v8/recommend";

export default function OperacionPage() {
  const params = useParams<{ opId: string }>();
  const op = getMachine(params.opId);
  const { markExam, state: course } = useCourse();
  const { state: progress } = useProgress();
  const [score, setScore] = useState<number | null>(null);
  const rec = useMemo(() => recommendAfterActivity(course, progress), [course, progress]);

  if (!op) {
    return (
      <Link href="/operaciones" className="text-red-400">
        Operations
      </Link>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <p className="text-xs text-slate-600">
        <Link href="/operaciones" className="hover:text-red-400">
          Operations
        </Link>
        {" → "}
        <span className="text-slate-400">{op.titleEs}</span>
      </p>
      <p className="text-[11px] uppercase tracking-wide text-red-400">{op.kind === "boss" ? "Boss" : "Machine"}</p>
      <h1 className="text-2xl font-bold text-white">{op.titleEs}</h1>
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-[10px] uppercase text-slate-500">Objective</dt>
          <dd>{op.objectiveEs}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase text-slate-500">Rules</dt>
          <dd className="text-slate-400">Solo lab autorizado. Puedes decidir no explotar todavía.</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase text-slate-500">Ladder</dt>
          <dd>L{op.ladder} · tabletop</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase text-slate-500">Time (estimated)</dt>
          <dd className="font-mono text-slate-400">~{op.estimatedMin} min</dd>
        </div>
        {op.expectedEvidenceEs && (
          <div>
            <dt className="text-[10px] uppercase text-slate-500">Expected evidence (you produce it)</dt>
            <dd className="text-slate-400">{op.expectedEvidenceEs}</dd>
          </div>
        )}
        {!op.hideSkills && (
          <div>
            <dt className="text-[10px] uppercase text-slate-500">Skills (practice, not a spoiler list on bosses)</dt>
            <dd className="text-slate-400">{op.skillIds.join(" · ")}</dd>
          </div>
        )}
      </dl>

      {score === null ? (
        <DecisionDrillRunner
          scenarios={op.scenarios}
          onAllPassed={(pct) => {
            setScore(pct);
            markExam(`op:${op.id}`, pct);
          }}
        />
      ) : (
        <AfterActionReview
          score={score}
          wellEs={score >= 70 ? "Priorizaste evidencia sobre recetas." : undefined}
          reviewEs={score < 70 ? "Repite el drill de la skill débil. No marques MASTERED." : "Siguiente: otra máquina o Review."}
          skillsUsed={op.hideSkills ? undefined : op.skillIds}
          nextHref={rec.href}
          nextLabel={rec.titleEs}
        />
      )}
    </div>
  );
}

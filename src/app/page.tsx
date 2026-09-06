"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getBlockById } from "@/content/curriculum";
import { useProgress } from "@/lib/progress/context";
import { pickNextPractice } from "@/lib/trainer/adaptive";
import { difficultyStars, operationFromNext, operationLabel, stars } from "@/lib/trainer/operation";
import { evaluateReadiness } from "@/lib/trainer/readiness";
import { listWeaknesses } from "@/lib/trainer/adaptive";

export default function DashboardPage() {
  const { state } = useProgress();
  const next = useMemo(() => pickNextPractice(state), [state]);
  const { n, block } = operationFromNext(next);
  const opName = next.kind === "remediate" ? "REMEDIATION" : next.kind === "review" ? "FLASH DRILL" : next.kind === "exam" ? "EXAM" : operationLabel(n || 1);
  const title = block?.title ?? next.titleEs;
  const objective = block?.objective ?? next.reasonEs;
  const time = block ? `${block.durationMin}:00` : next.durationHint;
  const diff = block ? difficultyStars(block) : 2;
  const [brief, setBrief] = useState(false);
  const readiness = useMemo(() => evaluateReadiness(state), [state]);
  const weaknesses = useMemo(() => listWeaknesses(state), [state]);
  const blockObj = next.href.includes("/focus/") ? getBlockById(next.href.split("/focus/")[1] ?? "") : undefined;

  return (
    <div className="mx-auto max-w-lg space-y-8 py-4">
      <p className="font-mono text-[10px] tracking-[0.2em] text-emerald-500">MISSION CONTROL · AHORA</p>

      <section className="rounded-2xl border-2 border-emerald-500 bg-slate-950 p-6">
        <p className="font-mono text-xs text-emerald-400">TODAY&apos;S OPERATION</p>
        <p className="mt-4 font-mono text-sm text-emerald-300">{opName}</p>
        <h1 className="mt-1 text-3xl font-bold text-white">{title}</h1>
        <dl className="mt-6 space-y-3 font-mono text-sm">
          <div>
            <dt className="text-[10px] text-slate-500">OBJECTIVE</dt>
            <dd className="text-slate-200">{objective}</dd>
          </div>
          <div>
            <dt className="text-[10px] text-slate-500">TIME</dt>
            <dd className="text-emerald-300">{time}</dd>
          </div>
          <div>
            <dt className="text-[10px] text-slate-500">DIFFICULTY</dt>
            <dd className="text-amber-300">{stars(diff)}</dd>
          </div>
          <div>
            <dt className="text-[10px] text-slate-500">STATUS</dt>
            <dd className="text-emerald-400">READY</dd>
          </div>
        </dl>
        <Link
          href={next.href}
          className="mt-8 block w-full rounded-md bg-red-600 py-4 text-center text-lg font-bold tracking-wide text-white hover:bg-red-500"
        >
          START OPERATION
        </Link>
        {blockObj?.titleEn && <p className="mt-2 font-mono text-[10px] text-emerald-700">{blockObj.titleEn}</p>}
      </section>

      <div className="text-center">
        <p className="font-mono text-xs text-slate-600">OR</p>
        <div className="mt-2 flex flex-col gap-2">
          <Link href="/hub" className="font-mono text-sm text-red-400 underline">
            GITHUB HUB (12 min)
          </Link>
          <Link href="/clase" className="font-mono text-sm text-emerald-400 underline">
            CLASE DE HOY (3 meses)
          </Link>
          <Link href="/train/5min" className="font-mono text-sm text-slate-400 underline">
            5 MIN TRAINING
          </Link>
        </div>
      </div>

      <button type="button" onClick={() => setBrief((b) => !b)} className="w-full text-left font-mono text-[10px] text-slate-600">
        {brief ? "−" : "+"} briefing (readiness / gaps) · no es la misión
      </button>
      {brief && (
        <div className="space-y-2 text-xs text-slate-400">
          <p>{readiness.ready ? "READINESS interno: READY" : `NO READY · ${readiness.blockers[0]?.labelEs ?? ""}`}</p>
          <p className="text-[10px] text-slate-600">{readiness.disclaimer}</p>
          {weaknesses[0] && (
            <Link href={weaknesses[0].href} className="text-amber-400">
              gap: {weaknesses[0].labelEs}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

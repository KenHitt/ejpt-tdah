"use client";

import { useState } from "react";
import Link from "next/link";
import { PromptCheck } from "@/lib/types";
import { gradePrompt } from "@/lib/trainer/grade";
import { useProgress } from "@/lib/progress/context";
import { classifyPromptFailure, FAILURE_LABEL_ES } from "@/lib/v9/diagnose";
import { remediationPath } from "@/lib/v9/remediation";
import { V6_SKILLS } from "@/content/v6/skills";
import { useConceptReview } from "@/components/v93/useConceptReview";
import { stillStuckCopy } from "@/lib/v93/review-for-question";

function defaultHints(check: PromptCheck): [string, string, string, string, string] {
  return [
    "Relee el escenario: ¿qué evidencia hay ya?",
    "Piensa en metodología, no en un comando famoso.",
    "¿Qué familia de herramienta encaja con el puerto o el síntoma?",
    check.betterApproachEs?.slice(0, 90) || "Acota el next step a una sola superficie.",
    check.betterApproachEs || check.explanationEs || "Elige la opción que usa evidencia, no una receta.",
  ];
}

export function PromptCheckCard({
  check,
  exerciseId,
  onPassed,
  onResult,
  onChoice,
}: {
  check: PromptCheck;
  exerciseId: string;
  onPassed: () => void;
  onResult?: (ok: boolean) => void;
  onChoice?: (choiceId?: string) => void;
}) {
  const { recordTrainerAttempt, reportFailure, state } = useProgress();
  const [text, setText] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [choice, setChoice] = useState<string | undefined>();
  const [justify, setJustify] = useState("");
  const [phase, setPhase] = useState<"ask" | "explain" | "passed">("ask");
  const [note, setNote] = useState("");
  const [fails, setFails] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);

  const hints = check.hints ?? defaultHints(check);
  const pedagogy = classifyPromptFailure(check.failKind, Boolean(check.choices?.length), check.pedagogy);
  const skillId =
    V6_SKILLS.find((s) => s.id === check.domain)?.id ??
    V6_SKILLS.find((s) => s.subtopicIds.includes(check.subtopicId))?.id;
  const rem = skillId ? remediationPath(skillId, pedagogy)[0] : undefined;
  const review = useConceptReview(
    {
      prompt: check.promptEs,
      extra: `${check.promptEn ?? ""} ${check.choices?.map((c) => c.textEs).join(" ") ?? ""}`,
      subtopicId: check.subtopicId,
      failKind: check.failKind,
      pedagogy,
    },
    exerciseId
  );
  const openedReview = (state.trainer?.conceptReviews ?? []).some((r) => r.exerciseId === exerciseId);

  const lastAnswerEs =
    check.choices?.length ? check.choices.find((c) => c.id === choice)?.textEs ?? "—" : text.trim() || "—";

  const submit = () => {
    const result = gradePrompt(check, text, choice, justify);
    recordTrainerAttempt({
      exerciseId,
      correct: result.ok,
      hintsUsed: hintLevel,
      failKind: result.ok ? undefined : check.failKind,
      skillKind: check.failKind === "memory" ? "recall" : "reasoning",
      retries: fails,
      domain: check.domain ?? check.subtopicId,
      durationMs: Date.now() - startedAt,
    });
    onResult?.(result.ok);
    if (result.ok) {
      onChoice?.(choice);
      setPhase("passed");
      setNote(result.noteEs);
      onPassed();
      return;
    }
    if (check.subtopicId) reportFailure(check.subtopicId);
    setFails((n) => n + 1);
    setNote(result.noteEs);
    setPhase("explain");
  };

  const retry = () => {
    setChoice(undefined);
    setText("");
    setJustify("");
    setPhase("ask");
  };

  const FAIL_KIND_LABEL: Record<string, string> = {
    memory: "COMMAND MEMORY",
    reasoning: "REASONING",
    technical: "PRACTICAL",
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-200">{check.promptEs}</p>
      {check.promptEn && <p className="font-mono text-xs text-emerald-400">{check.promptEn}</p>}

      {phase === "explain" && (
        <div className="rounded-md border border-red-800/60 bg-red-500/10 p-4 text-sm text-red-100">
          <p className="font-bold uppercase tracking-wide text-red-300">Not quite</p>
          <p className="mt-2 text-[11px] uppercase text-slate-400">Your answer</p>
          <p className="text-slate-200">{lastAnswerEs}</p>
          <p className="mt-2 text-[11px] uppercase text-slate-400">Why it is not the best choice</p>
          <p className="whitespace-pre-wrap text-red-100">{note}</p>
          {check.whatMissedEs && (
            <>
              <p className="mt-2 text-[11px] uppercase text-slate-400">What you missed</p>
              <p className="text-slate-200">{check.whatMissedEs}</p>
            </>
          )}
          {check.evidenceEs && (
            <>
              <p className="mt-2 text-[11px] uppercase text-slate-400">Evidence from the scenario</p>
              <p className="text-slate-200">{check.evidenceEs}</p>
            </>
          )}
          {check.betterApproachEs && (
            <>
              <p className="mt-2 text-[11px] uppercase text-slate-400">Better approach</p>
              <p className="text-slate-200">{check.betterApproachEs}</p>
            </>
          )}
          <p className="mt-2 font-mono text-[11px] uppercase text-amber-300">
            Failure type · {FAILURE_LABEL_ES[pedagogy]} ({FAIL_KIND_LABEL[check.failKind] ?? "REASONING"})
          </p>
          <p className="mt-1 text-xs text-slate-400">
            El problema no es necesariamente recordar un comando. Tipo pedagógico: {FAILURE_LABEL_ES[pedagogy]}.
          </p>
          {rem && (
            <p className="mt-2 text-sm">
              Remediation:{" "}
              <Link href={rem.href} className="text-red-300 underline">
                {rem.min} min · {rem.titleEs}
              </Link>
            </p>
          )}
          <p className="mt-3 text-sm text-amber-100">{stillStuckCopy(review.lesson)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {review.button}
            <button
              type="button"
              onClick={retry}
              className="rounded-md bg-red-700 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
            >
              RETRY
            </button>
          </div>
        </div>
      )}

      {phase === "passed" && (
        <div className="rounded-md border border-emerald-800/50 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          <p className="font-bold uppercase tracking-wide text-emerald-300">Correct · good decision</p>
          <p className="mt-2 text-[11px] uppercase text-emerald-400/80">Why</p>
          <p className="whitespace-pre-wrap">{note}</p>
          {hintLevel > 0 && (
            <p className="mt-2 text-xs text-slate-400">Hints used: {hintLevel}/5 — counts toward independence, not a penalty for learning.</p>
          )}
          {openedReview && review.lesson.transferEs && (
            <p className="mt-3 text-sm text-slate-200">
              <span className="text-emerald-300">Transfer. </span>
              {review.lesson.transferEs}
            </p>
          )}
        </div>
      )}

      {phase === "ask" && (
        <>
          {check.choices?.length ? (
            <ul className="space-y-1">
              {check.choices.map((c) => (
                <li key={c.id}>
                  <label className="flex cursor-pointer gap-2 rounded-md border border-slate-800 p-2 text-sm hover:border-emerald-700">
                    <input type="radio" name={check.id} checked={choice === c.id} onChange={() => setChoice(c.id)} />
                    <span>{c.textEs}</span>
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-emerald-300"
              placeholder="Escribe con tus palabras / tu IP real…"
            />
          )}
          {check.justifyPromptEs && (
            <textarea
              value={justify}
              onChange={(e) => setJustify(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              placeholder={check.justifyPromptEs}
            />
          )}
          {hintLevel > 0 && (
            <div className="rounded-md border border-slate-800 p-3 text-xs text-slate-300">
              <p className="uppercase text-slate-500">Hint {hintLevel}</p>
              <p className="mt-1">{hints[hintLevel - 1]}</p>
              {hintLevel >= 5 && check.walkthroughEs && (
                <p className="mt-2 text-amber-200">Walkthrough: {check.walkthroughEs}</p>
              )}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={submit} className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500">
              Verificar
            </button>
            {review.button}
            <button
              type="button"
              onClick={() => setHintLevel((n) => Math.min(5, n + 1))}
              className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-400 hover:border-amber-600"
            >
              {hintLevel >= 5 ? "Hints maxed (walkthrough)" : `Hint ${hintLevel + 1}/5`}
            </button>
          </div>
        </>
      )}
      {review.modal}
    </div>
  );
}

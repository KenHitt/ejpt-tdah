"use client";

import { useState } from "react";
import { PromptCheck } from "@/lib/types";
import { gradePrompt } from "@/lib/trainer/grade";
import { useProgress } from "@/lib/progress/context";

export function PromptCheckCard({
  check,
  exerciseId,
  onPassed,
  onResult,
}: {
  check: PromptCheck;
  exerciseId: string;
  onPassed: () => void;
  onResult?: (ok: boolean) => void;
}) {
  const { recordTrainerAttempt, reportFailure } = useProgress();
  const [text, setText] = useState("");
  const [choice, setChoice] = useState<string | undefined>();
  const [justify, setJustify] = useState("");
  const [phase, setPhase] = useState<"ask" | "explain" | "passed">("ask");
  const [note, setNote] = useState("");
  const [fails, setFails] = useState(0);

  const submit = () => {
    const result = gradePrompt(check, text, choice, justify);
    recordTrainerAttempt({
      exerciseId,
      correct: result.ok,
      hintsUsed: 0,
      failKind: result.ok ? undefined : check.failKind,
      skillKind: check.failKind === "memory" ? "recall" : "reasoning",
      retries: fails,
      domain: check.domain ?? check.subtopicId,
    });
    onResult?.(result.ok);
    if (result.ok) {
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

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-200">{check.promptEs}</p>
      {check.promptEn && <p className="font-mono text-xs text-emerald-400">{check.promptEn}</p>}

      {phase === "explain" && (
        <div className="rounded-md border border-red-800/60 bg-red-500/10 p-3 text-sm text-red-100">
          <p className="font-semibold">
            {check.failKind === "memory"
              ? "FAIL DE MEMORIA"
              : check.failKind === "technical"
                ? "FAIL TÉCNICO"
                : "FAIL DE RAZONAMIENTO"}
          </p>
          <p className="mt-1 whitespace-pre-wrap">{note}</p>
          <p className="mt-2 font-mono text-xs text-amber-300">EXPLICAR → REPETIR → VOLVER A COMPROBAR</p>
        </div>
      )}

      {phase === "passed" && (
        <p className="rounded-md border border-emerald-800/50 bg-emerald-500/10 p-3 text-sm text-emerald-200">{note}</p>
      )}

      {phase !== "passed" && (
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
          <button type="button" onClick={submit} className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500">
            Verificar
          </button>
        </>
      )}
    </div>
  );
}

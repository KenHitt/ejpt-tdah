"use client";

import { useState } from "react";
import { answersMatch, flagMatch, keywordsMatch } from "@/lib/trainer/normalize";
import { useProgress } from "@/lib/progress/context";

type Mode = "exact" | "keywords" | "flag";

interface RecallCardProps {
  exerciseId: string;
  questionEs: string;
  questionEn?: string;
  expected: string;
  explanationEs: string;
  /** Cómo construir la respuesta de ESTA pregunta (sin ser un spoiler vacío). */
  howToEs?: string;
  mode?: Mode;
  keywords?: string[];
  subtopicId?: string;
  mandatoryRepeat?: boolean;
  /** Tras N fallos, muestra la respuesta exacta. El usuario igual debe teclearla. */
  revealAnswerAfter?: number;
  onPassed?: () => void;
}

export function RecallCard({
  exerciseId,
  questionEs,
  questionEn,
  expected,
  explanationEs,
  howToEs,
  mode = "exact",
  keywords,
  subtopicId,
  mandatoryRepeat = true,
  revealAnswerAfter,
  onPassed,
}: RecallCardProps) {
  const { recordTrainerAttempt, reportFailure } = useProgress();
  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<"ask" | "explain" | "passed">("ask");
  const [fails, setFails] = useState(0);
  const [lastWrong, setLastWrong] = useState("");

  const check = () => {
    const ok =
      mode === "keywords" && keywords?.length
        ? keywordsMatch(value, keywords)
        : mode === "flag"
          ? flagMatch(value, expected)
          : answersMatch(value, expected);
    recordTrainerAttempt({
      exerciseId,
      correct: ok,
      hintsUsed: 0,
      failKind: ok ? undefined : "memory",
      skillKind: "recall",
      retries: fails,
      domain: subtopicId,
    });
    if (ok) {
      setPhase("passed");
      onPassed?.();
      return;
    }
    if (subtopicId) reportFailure(subtopicId);
    setLastWrong(value.trim() || "(vacío)");
    setFails((n) => n + 1);
    setPhase("explain");
    setValue("");
  };

  const showAnswer =
    revealAnswerAfter !== undefined && fails >= revealAnswerAfter && mandatoryRepeat;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <p className="text-sm text-slate-200">{questionEs}</p>
      {questionEn && <p className="mt-1 font-mono text-xs text-emerald-400">{questionEn}</p>}

      {phase === "explain" && (
        <div className="mt-3 space-y-2 rounded-md border border-red-800/60 bg-red-500/10 p-3 text-sm text-red-100">
          <p className="font-semibold">Incorrecto</p>
          {lastWrong && (
            <p className="text-xs text-red-200/80">
              Escribiste: <span className="font-mono text-red-100">{lastWrong}</span>
            </p>
          )}
          <p className="text-red-50/90">{explanationEs}</p>
          {howToEs && (
            <div className="rounded-md border border-amber-800/50 bg-slate-950/60 p-2 text-amber-100">
              <p className="font-mono text-[10px] uppercase tracking-wide text-amber-400">Cómo acertar</p>
              <p className="mt-1 whitespace-pre-wrap">{howToEs}</p>
            </div>
          )}
          {showAnswer && (
            <div className="rounded-md border border-emerald-800/60 bg-emerald-950/50 p-2 text-emerald-100">
              <p className="font-mono text-[10px] uppercase tracking-wide text-emerald-400">
                Respuesta a copiar de memoria (escríbela tú)
              </p>
              <p className="mt-1 font-mono text-sm text-emerald-300">{expected}</p>
            </div>
          )}
          {mandatoryRepeat && (
            <p className="font-mono text-xs text-amber-300">
              REPEAT: vuelve a escribirla abajo. No avanzas hasta que coincida.
            </p>
          )}
        </div>
      )}

      {phase !== "passed" && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder="type from memory..."
            className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-emerald-300 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={check}
            className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Verificar
          </button>
        </div>
      )}

      {phase === "passed" && <p className="mt-3 text-sm text-emerald-400">Correcto. Siguiente.</p>}
    </div>
  );
}

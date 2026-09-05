"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { COMMAND_BANK, type CommandCard } from "@/content/command-bank";
import { RecallCard } from "@/components/trainer/RecallCard";
import { useProgress } from "@/lib/progress/context";

function stageHelp(card: CommandCard, stage: number) {
  if (stage === 0) {
    return {
      howToEs: `Escribe SOLO el nombre de la herramienta, en minúsculas.\nSin flags, sin IP, sin la frase de la pregunta.\nAquí la herramienta es: ${card.toolAnswer}`,
      expected: card.toolAnswer,
      mode: "exact" as const,
    };
  }
  if (stage === 1) {
    return {
      howToEs: `Escribe SOLO el flag o parámetro (casi siempre empieza por -).\nNo pongas todavía el comando completo ni la IP.\nEn este drill: ${card.paramAnswer}`,
      expected: card.paramAnswer,
      mode: "flag" as const,
    };
  }
  if (stage === 2) {
    return {
      howToEs: `Una sola línea, minúsculas, con la IP/URL del enunciado.\nOrden típico: herramienta → flags → objetivo.\nComando exacto: ${card.fullAnswer}`,
      expected: card.fullAnswer,
      mode: "exact" as const,
    };
  }
  return {
    howToEs: `Responde con palabras (español o inglés), no con el comando.\nTu texto debe incluir: ${card.conceptKeywords.join(", ")}.`,
    expected: `menciona: ${card.conceptKeywords.join(", ")}`,
    mode: "keywords" as const,
    keywords: card.conceptKeywords,
  };
}

export default function FlashDrillPage() {
  const params = useParams<{ commandId: string }>();
  const card = COMMAND_BANK.find((c) => c.id === params.commandId);
  const { recordHintLevel } = useProgress();
  const [stage, setStage] = useState(0);
  const [hint, setHint] = useState(0);

  if (!card) {
    return (
      <Link href="/memory" className="text-emerald-400 underline">
        Command Memory
      </Link>
    );
  }

  const askHint = () => {
    const n = Math.min(5, hint + 1);
    setHint(n);
    recordHintLevel(`flash:${card.id}`, n);
  };

  const help = stageHelp(card, stage);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link href="/memory" className="text-xs text-slate-500 hover:text-emerald-400">
        ← Memory
      </Link>
      <p className="font-mono text-xs text-emerald-400">
        FLASH DRILL · {card.category} · stage {stage + 1}/4
      </p>
      <h1 className="text-xl font-bold text-white">
        {stage >= 3 ? card.fragment : "Produce el comando. No lo mires."}
      </h1>

      <RecallCard
        key={`${card.id}:${stage}`}
        exerciseId={`${card.id}:${["tool", "param", "full", "concept"][stage]}`}
        questionEs={
          [card.toolQuestionEs, card.paramQuestionEs, card.fullQuestionEs, card.conceptQuestionEs][stage]
        }
        questionEn={
          [card.toolQuestionEn, card.paramQuestionEn, card.fullQuestionEn, card.conceptQuestionEn][stage]
        }
        expected={help.expected}
        explanationEs={card.explanationEs}
        howToEs={help.howToEs}
        mode={help.mode}
        keywords={"keywords" in help ? help.keywords : undefined}
        subtopicId={card.subtopicId}
        revealAnswerAfter={1}
        onPassed={() => {
          if (stage < 3) setStage((s) => s + 1);
        }}
      />

      <button type="button" onClick={askHint} className="text-xs text-amber-400 underline">
        Pista extra {Math.min(5, hint + 1)}/5
      </button>
      {hint > 0 && (
        <ol className="space-y-1 text-sm text-slate-400">
          {card.hints.slice(0, hint).map((h, i) => (
            <li key={i}>
              <span className="font-mono text-amber-500">{i + 1}.</span> {h}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

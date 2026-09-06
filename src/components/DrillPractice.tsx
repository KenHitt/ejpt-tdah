"use client";

import { useMemo, useRef, useState } from "react";
import { DrillItem } from "@/lib/types";
import { RecallCard } from "@/components/trainer/RecallCard";

export function DrillPractice({
  drills,
  onAllPassed,
}: {
  drills: DrillItem[];
  onAllPassed?: () => void;
}) {
  const doneRef = useRef<Record<string, boolean>>({});
  const [commandOk, setCommandOk] = useState<Record<string, boolean>>({});

  const items = useMemo(() => drills ?? [], [drills]);
  if (!items.length) return null;

  const mark = (id: string) => {
    doneRef.current = { ...doneRef.current, [id]: true };
    if (onAllPassed && items.every((d) => doneRef.current[d.id])) onAllPassed();
  };

  return (
    <div className="space-y-4">
      {items.map((d, i) => (
        <div key={d.id} className="space-y-2">
          <p className="font-mono text-xs text-purple-400">Recall #{i + 1}</p>
          <RecallCard
            exerciseId={d.id}
            questionEs={d.promptEs}
            questionEn={d.promptEn}
            expected={d.answer}
            explanationEs={
              d.explanation ??
              "Ese comando no encaja con el objetivo. Distingue: ¿buscas hosts vivos, versiones, rutas HTTP o credenciales? Vuelve a escribirlo."
            }
            howToEs={d.howToEs}
            mode={d.answerKeywords?.length ? "keywords" : "exact"}
            keywords={d.answerKeywords}
            subtopicId={d.subtopicId}
            mandatoryRepeat={d.mandatoryRepeat !== false}
            onPassed={() => {
              setCommandOk((c) => ({ ...c, [d.id]: true }));
              if (!d.conceptQuestion || !d.conceptAnswer) mark(d.id);
            }}
          />
          {commandOk[d.id] && d.conceptQuestion && d.conceptAnswer && (
            <RecallCard
              exerciseId={`${d.id}:concept`}
              questionEs={d.conceptQuestion}
              expected={d.conceptAnswer}
              explanationEs="El comando salió, el concepto no. Di qué hace el flag/herramienta, no copies el comando otra vez."
              mode="keywords"
              keywords={d.conceptAnswer.split(/\s+/).filter(Boolean)}
              subtopicId={d.subtopicId}
              mandatoryRepeat
              onPassed={() => mark(d.id)}
            />
          )}
        </div>
      ))}
      <p className="text-xs text-slate-500">
        Si fallas: explicación conceptual → repetir. No hay spoiler del comando hasta que aciertes (o Hint 4 en Estoy
        atascado).
      </p>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { DecisionScenario } from "@/lib/types";
import { PromptCheckCard } from "@/components/trainer/PromptCheckCard";
import { SafetyNote } from "@/components/SafetyNote";

export function DecisionDrillRunner({
  scenarios,
  onAllPassed,
}: {
  scenarios: DecisionScenario[];
  onAllPassed: (score: number) => void;
}) {
  const [si, setSi] = useState(0);
  const [ci, setCi] = useState(0);
  const [ok, setOk] = useState(false);
  const hits = useRef(0);
  const tries = useRef(0);

  const scenario = scenarios[si];
  if (!scenario) return null;
  const check = scenario.checks[ci];

  const afterPass = () => {
    setOk(true);
  };

  const next = () => {
    setOk(false);
    if (ci + 1 < scenario.checks.length) {
      setCi((n) => n + 1);
      return;
    }
    if (si + 1 < scenarios.length) {
      setSi((n) => n + 1);
      setCi(0);
      return;
    }
    onAllPassed(tries.current > 0 ? Math.round((hits.current / tries.current) * 100) : 0);
  };

  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] text-purple-400">
        DECISIÓN · escenario {si + 1}/{scenarios.length} · pregunta {ci + 1}/{scenario.checks.length}
      </p>
      <h2 className="text-lg font-bold text-white">{scenario.titleEs}</h2>
      <SafetyNote compact />
      <p className="whitespace-pre-wrap text-sm text-slate-300">{scenario.setupEs}</p>
      {scenario.output && (
        <pre className="overflow-x-auto rounded-md bg-black p-3 font-mono text-xs text-emerald-200">{scenario.output}</pre>
      )}
      {check && (
        <PromptCheckCard
          key={`${scenario.id}:${check.id}`}
          check={check}
          exerciseId={`decision:${scenario.id}:${check.id}`}
          onPassed={afterPass}
          onResult={(good) => {
            tries.current += 1;
            if (good) hits.current += 1;
          }}
        />
      )}
      {ok && (
        <button type="button" onClick={next} className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">
          Siguiente
        </button>
      )}
    </div>
  );
}

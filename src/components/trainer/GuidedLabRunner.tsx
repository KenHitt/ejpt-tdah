"use client";

import { useState } from "react";
import { GuidedStep, TroubleItem } from "@/lib/types";
import { PromptCheckCard } from "@/components/trainer/PromptCheckCard";
import { SafetyNote } from "@/components/SafetyNote";
import { useConceptReview } from "@/components/v93/useConceptReview";

function LabConcept({ title, body, id }: { title: string; body: string; id: string }) {
  const review = useConceptReview({ prompt: `${title} ${body}` }, `lab:${id}`);
  return (
    <div>
      {review.button}
      {review.modal}
    </div>
  );
}

const KIND_ES: Record<GuidedStep["kind"], string> = {
  concept: "CONCEPTO",
  action: "ACCIÓN",
  result: "RESULTADO",
  question: "PREGUNTA",
  decision: "DECISIÓN",
  checkpoint: "CHECKPOINT",
  trouble: "SI ALGO NO FUNCIONA",
};

export function GuidedLabRunner({
  steps,
  troubleshooting,
  onAllPassed,
}: {
  steps: GuidedStep[];
  troubleshooting?: TroubleItem[];
  onAllPassed: () => void;
}) {
  const [i, setI] = useState(0);
  const [locked, setLocked] = useState(false);
  const [troubleOpen, setTroubleOpen] = useState(false);
  const [troubleId, setTroubleId] = useState<string | null>(null);

  const step = steps[i];
  if (!step) return null;

  const needsCheck = Boolean(step.check);
  const canAdvance = !needsCheck || locked;

  const next = () => {
    if (i + 1 >= steps.length) {
      onAllPassed();
      return;
    }
    setLocked(false);
    setI((n) => n + 1);
  };

  const caseItem = troubleshooting?.find((t) => t.id === troubleId) ?? troubleshooting?.find((t) => t.id === step.troubleId);

  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] tracking-wide text-emerald-500">
        {KIND_ES[step.kind]} · {i + 1}/{steps.length} · una misión
      </p>
      <h2 className="text-lg font-bold text-white">{step.titleEs}</h2>
      {step.bodyEs && <p className="whitespace-pre-wrap text-sm text-slate-300">{step.bodyEs}</p>}
      {step.ejptForEs && (
        <p className="rounded-md border border-sky-800/50 bg-sky-500/5 p-3 text-sm text-sky-100">{step.ejptForEs}</p>
      )}
      {step.diagram && (
        <pre className="overflow-x-auto rounded-md border border-emerald-900/40 bg-slate-950 p-3 font-mono text-[11px] text-emerald-200">
          {step.diagram}
        </pre>
      )}
      {step.commandShow && (
        <pre className="overflow-x-auto rounded-md bg-black p-3 font-mono text-sm text-emerald-300">{step.commandShow}</pre>
      )}
      {step.lookForEs && (
        <p className="text-xs text-slate-400">
          Qué buscar (no es la respuesta del checkpoint): {step.lookForEs}
        </p>
      )}
      {step.kind === "action" && <SafetyNote compact />}

      {step.check && (
        <PromptCheckCard
          key={step.id}
          check={step.check}
          exerciseId={`guided:${step.id}`}
          onPassed={() => setLocked(true)}
        />
      )}
      {!step.check && (
        <LabConcept title={step.titleEs} body={step.bodyEs ?? ""} id={step.id} />
      )}

      {step.kind === "trouble" && !step.check && (
        <p className="text-xs text-slate-500">Si este caso no es el tuyo, continúa. No adivines el arreglo.</p>
      )}

      <div className="flex flex-wrap gap-2">
        {canAdvance && (
          <button type="button" onClick={next} className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
            {i + 1 >= steps.length ? "Checkpoint hecho" : "Siguiente"}
          </button>
        )}
        {troubleshooting && troubleshooting.length > 0 && (
          <button
            type="button"
            onClick={() => setTroubleOpen((v) => !v)}
            className="rounded-md border border-amber-700 px-3 py-2 text-sm text-amber-200"
          >
            Si algo no funciona
          </button>
        )}
      </div>

      {troubleOpen && troubleshooting && (
        <div className="rounded-lg border border-amber-800/50 bg-slate-950 p-3 text-sm">
          <p className="mb-2 text-xs text-amber-400">Elige un caso. Luego vuelve al paso.</p>
          <ul className="space-y-1">
            {troubleshooting.map((t) => (
              <li key={t.id}>
                <button type="button" className="text-left text-emerald-400 underline" onClick={() => setTroubleId(t.id)}>
                  {t.symptom}
                </button>
              </li>
            ))}
          </ul>
          {caseItem && (
            <div className="mt-3 space-y-1 text-slate-300">
              <p>
                <span className="text-slate-500">Causa:</span> {caseItem.cause}
              </p>
              <p>
                <span className="text-slate-500">Diagnóstico:</span> {caseItem.diagnose}
              </p>
              {caseItem.command && <pre className="font-mono text-xs text-emerald-300">{caseItem.command}</pre>}
              <p>
                <span className="text-slate-500">Arreglo:</span> {caseItem.fix}
              </p>
              <p>
                <span className="text-slate-500">Verificar:</span> {caseItem.verify}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

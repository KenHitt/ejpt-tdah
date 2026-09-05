"use client";

import { useState } from "react";
import { DrillItem } from "@/lib/types";

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function DrillRow({ drill, index }: { drill: DrillItem; index: number }) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);
  const [showHint, setShowHint] = useState(false);

  const verify = () => {
    setChecked(normalize(value) === normalize(drill.answer));
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
      <p className="mb-2 text-sm text-slate-200">
        <span className="mr-1 font-mono text-emerald-400">#{index + 1}</span>
        {drill.promptEs}
      </p>
      {drill.promptEn && <p className="mb-2 font-mono text-xs text-emerald-400">{drill.promptEn}</p>}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(null);
          }}
          placeholder="type the exact command..."
          className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-emerald-300 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
        />
        <button
          onClick={verify}
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Verificar / Check
        </button>
      </div>
      {checked !== null && (
        <p className={`mt-2 text-sm ${checked ? "text-emerald-400" : "text-red-400"}`}>
          {checked ? "✔ Correcto. Repite en el siguiente escenario." : "✘ No coincide. Revisa sintaxis exacta (flags, orden, mayúsculas)."}
        </p>
      )}
      {!checked && drill.hint && (
        <button onClick={() => setShowHint((s) => !s)} className="mt-1 text-xs text-slate-500 underline">
          {showHint ? "Ocultar pista" : "Ver pista"}
        </button>
      )}
      {showHint && drill.hint && <p className="mt-1 text-xs text-slate-400">{drill.hint}</p>}
      {checked === false && (
        <details className="mt-2 text-xs text-slate-500">
          <summary className="cursor-pointer">Ver respuesta esperada</summary>
          <code className="mt-1 block rounded bg-slate-950 px-2 py-1 font-mono text-emerald-400">{drill.answer}</code>
        </details>
      )}
    </div>
  );
}

export function DrillPractice({ drills }: { drills: DrillItem[] }) {
  if (!drills?.length) return null;
  return (
    <div className="space-y-3">
      {drills.map((d, i) => (
        <DrillRow key={d.id} drill={d} index={i} />
      ))}
      <p className="text-xs text-slate-500">
        Regla de fijación: no marques este bloque como dominado hasta escribir cada comando correctamente al menos 2 veces en escenarios distintos.
      </p>
    </div>
  );
}

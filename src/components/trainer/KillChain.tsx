"use client";

import { useProgress } from "@/lib/progress/context";
import { KILL_CHAIN } from "@/lib/trainer/operation";
import { KillPhase } from "@/lib/types";

export function KillChain() {
  const { state, updateLabHud } = useProgress();
  const phase = state.trainer?.labHud?.phase ?? "recon";

  return (
    <div className="rounded-lg border border-slate-800 p-3 text-sm">
      <p className="font-mono text-[10px] text-slate-500">KILL CHAIN · no es una receta. Tú marcas la fase.</p>
      <div className="mt-2 flex flex-wrap items-center gap-1 font-mono text-xs">
        {KILL_CHAIN.map((p, i) => (
          <span key={p.id} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => updateLabHud({ phase: p.id as KillPhase })}
              className={`rounded px-2 py-1 ${
                phase === p.id ? "bg-emerald-600 text-white" : "border border-slate-700 text-slate-400"
              }`}
            >
              {p.label}
            </button>
            {i < KILL_CHAIN.length - 1 ? <span className="text-slate-600">↓</span> : null}
          </span>
        ))}
      </div>
      <label className="mt-3 block text-xs text-slate-400">
        What did you discover?
        <textarea
          value={state.trainer?.labHud?.discovered ?? ""}
          onChange={(e) => updateLabHud({ discovered: e.target.value })}
          rows={2}
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-200"
          placeholder="Puertos, shares, rutas… no un CVE inventado"
        />
      </label>
      <label className="mt-2 block text-xs text-slate-400">
        What would you do next?
        <textarea
          value={state.trainer?.labHud?.nextMove ?? ""}
          onChange={(e) => updateLabHud({ nextMove: e.target.value })}
          rows={2}
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-200"
          placeholder="Una acción. No 'explotar todo'."
        />
      </label>
    </div>
  );
}

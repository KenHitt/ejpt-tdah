"use client";

import { useProgress } from "@/lib/progress/context";
import { hudBar, inferPhase, KILL_CHAIN, phaseIndex } from "@/lib/trainer/operation";
import { StudyBlock } from "@/lib/types";

function show(v: string): string {
  const t = v.trim();
  return t ? t : "UNKNOWN";
}

export function RedTeamHud({ block }: { block?: StudyBlock }) {
  const { state, updateLabHud } = useProgress();
  const hud = state.trainer?.labHud;
  const phase = hud?.phase ?? (block ? inferPhase(block) : "recon");
  const idx = phaseIndex(phase);

  return (
    <div className="rounded-lg border-2 border-red-800 bg-black p-3 font-mono text-[11px] text-emerald-300">
      <p className="text-[10px] tracking-widest text-red-400">OPERATION HUD · no inventes IPs</p>
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
        <dt className="text-slate-400">PHASE</dt>
        <dd>{phase.toUpperCase()}</dd>
        <dt className="text-slate-400">LHOST</dt>
        <dd className={hud?.lhost ? "" : "text-amber-400"}>{show(hud?.lhost ?? "")}</dd>
        <dt className="text-slate-400">RHOST</dt>
        <dd className={hud?.rhost ? "" : "text-amber-400"}>{show(hud?.rhost ?? "")}</dd>
        <dt className="text-slate-400">SERVICES</dt>
        <dd>{show(hud?.services ?? "")}</dd>
      </dl>
      <div className="mt-2 space-y-0.5 text-emerald-400">
        {KILL_CHAIN.map((p, i) => (
          <p key={p.id}>
            {p.label.padEnd(8, " ")} {hudBar(i < idx ? 10 : i === idx ? 6 : 0)}
          </p>
        ))}
      </div>
      <div className="mt-2 grid gap-1">
        <input
          placeholder="LHOST (la que viste en ip addr)"
          value={hud?.lhost ?? ""}
          onChange={(e) => updateLabHud({ lhost: e.target.value })}
          className="rounded border border-slate-800 bg-slate-950 px-2 py-1 text-emerald-200"
        />
        <input
          placeholder="RHOST (UNKNOWN hasta que la descubras)"
          value={hud?.rhost ?? ""}
          onChange={(e) => updateLabHud({ rhost: e.target.value })}
          className="rounded border border-slate-800 bg-slate-950 px-2 py-1 text-emerald-200"
        />
        <input
          placeholder="SERVICES (? hasta el scan)"
          value={hud?.services ?? ""}
          onChange={(e) => updateLabHud({ services: e.target.value })}
          className="rounded border border-slate-800 bg-slate-950 px-2 py-1 text-emerald-200"
        />
      </div>
    </div>
  );
}

"use client";

import { EnergyMode } from "@/content/v6/types";

const MODES: { id: EnergyMode; label: string; hint: string }[] = [
  { id: "low", label: "Low energy", hint: "5–15 min" },
  { id: "normal", label: "Normal", hint: "operación" },
  { id: "high", label: "High focus", hint: "lab / boss" },
];

export function EnergyToggle({
  value,
  onChange,
}: {
  value: EnergyMode;
  onChange: (v: EnergyMode) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Energía de hoy">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          className={`rounded-full px-3 py-1.5 text-[11px] ${
            value === m.id ? "bg-red-600 text-white font-semibold" : "border border-slate-700 text-slate-400"
          }`}
        >
          {m.label}
          <span className="ml-1 opacity-70">{m.hint}</span>
        </button>
      ))}
    </div>
  );
}

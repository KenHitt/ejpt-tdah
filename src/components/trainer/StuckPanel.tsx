"use client";

import { useState } from "react";
import { hintsForSubtopics } from "@/content/stuck-hints";
import { useProgress } from "@/lib/progress/context";

const FIELDS = [
  ["ip", "IP"],
  ["ports", "Puertos / open ports"],
  ["services", "Servicios"],
  ["versions", "Versiones"],
  ["users", "Usuarios"],
  ["suspects", "Vulnerabilidades sospechadas"],
  ["tried", "Qué probé"],
  ["happened", "Qué ocurrió"],
  ["notTried", "Qué todavía NO he probado"],
] as const;

const LABELS = [
  "HINT 1 · pregunta conceptual",
  "HINT 2 · recuerda lo que ya encontraste",
  "HINT 3 · categoría de herramienta",
  "HINT 4 · sugerir comando",
  "HINT 5 · procedimiento",
];

export function StuckPanel({ blockId, subtopics }: { blockId: string; subtopics: string[] }) {
  const { recordHintLevel, recordStuck } = useProgress();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [gate, setGate] = useState(false);
  const [level, setLevel] = useState(0);
  const hints = hintsForSubtopics(subtopics);
  const key = `stuck:${blockId}`;

  const continueTrying = () => {
    recordStuck({ blockId, maxHintLevel: level, notes });
    setOpen(false);
  };

  const askHint = () => {
    const filled = notes.tried || notes.ports || notes.happened;
    if (!filled) {
      setGate(true);
      return;
    }
    setGate(false);
    const next = Math.min(5, level + 1);
    setLevel(next);
    recordHintLevel(key, next);
    if (next >= 1) recordStuck({ blockId, maxHintLevel: next, notes });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-amber-700/60 bg-amber-500/10 px-4 py-2 text-sm text-amber-200 hover:bg-amber-500/20"
      >
        I&apos;M STUCK
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-amber-800/50 bg-slate-950 p-4 text-sm">
      <p className="font-semibold text-amber-300">Antes de una pista: ¿qué evidencia tienes?</p>
      <p className="mt-1 text-xs text-slate-500">No es un write-up. Rellena algo real.</p>
      <div className="mt-3 grid gap-2">
        {FIELDS.map(([id, label]) => (
          <label key={id} className="text-xs text-slate-400">
            {label}
            <textarea
              value={notes[id] ?? ""}
              onChange={(e) => setNotes((n) => ({ ...n, [id]: e.target.value }))}
              rows={id === "tried" || id === "happened" || id === "notTried" ? 2 : 1}
              className="mt-0.5 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-200"
            />
          </label>
        ))}
      </div>
      {gate && (
        <p className="mt-2 text-xs text-red-300">
          Escribe al menos puertos, qué probaste o qué ocurrió. Si no, sigue intentando.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={continueTrying}
          className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-semibold text-white"
        >
          Continuar intentando
        </button>
        <button type="button" onClick={askHint} className="rounded-md border border-amber-600 px-3 py-2 text-xs text-amber-200">
          Pedir pista (nivel {Math.min(5, level + 1)}/5)
        </button>
      </div>
      {level > 0 && (
        <ol className="mt-3 space-y-2">
          {hints.slice(0, level).map((h, i) => (
            <li key={i} className="rounded-md border border-slate-800 bg-slate-900/80 p-2 text-slate-300">
              <span className="font-mono text-[10px] text-amber-400">
                HINT {i + 1} · {LABELS[i]}
              </span>
              <p className="mt-1">{h}</p>
            </li>
          ))}
        </ol>
      )}
      {level >= 5 && (
        <p className="mt-2 font-mono text-xs text-red-300">RETRY REQUIRED · vuelve a hacerlo sin mirar las pistas.</p>
      )}
      {level > 0 && <p className="mt-2 font-mono text-[10px] text-amber-500">HINTS USED {level}</p>}
    </div>
  );
}

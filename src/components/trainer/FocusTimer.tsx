"use client";

import { useEffect, useState } from "react";

export function FocusTimer({ durationMin }: { durationMin: number }) {
  const total = durationMin * 60;
  const [left, setLeft] = useState(total);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [paused]);

  const m = Math.floor(left / 60);
  const s = left % 60;
  const critical = left > 0 && left <= 60;

  return (
    <div className="flex items-center justify-center gap-3">
      <span className={`font-mono text-4xl font-bold ${critical ? "text-red-400" : "text-emerald-400"}`}>
        {m}:{s.toString().padStart(2, "0")}
      </span>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="rounded-md border border-slate-600 px-3 py-1 text-xs text-slate-300 hover:border-emerald-500"
      >
        {paused ? "RESUME" : "PAUSE"}
      </button>
    </div>
  );
}

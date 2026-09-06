"use client";

import { useState } from "react";
import { CourseQuizItem } from "@/content/course/types";

export function ClickQuiz({
  items,
  onGraded,
}: {
  items: CourseQuizItem[];
  onGraded: (pct: number) => void;
}) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  const grade = () => {
    let ok = 0;
    items.forEach((it, i) => {
      if (picked[i] === it.correct) ok += 1;
    });
    const p = Math.round((ok / items.length) * 100);
    setPct(p);
    setDone(true);
    onGraded(p);
  };

  return (
    <div className="space-y-4">
      {items.map((it, i) => {
        const sel = picked[i];
        return (
          <div key={i} className="rounded-lg border-2 border-slate-600 p-3">
            <p className="text-base font-medium text-white">
              {i + 1}. {it.q}
            </p>
            <div className="mt-2 space-y-2">
              {it.options.map((opt, j) => {
                const show = done;
                const isCorrect = j === it.correct;
                const isSel = sel === j;
                let cls = "border-slate-500 hover:border-red-400";
                if (show && isCorrect) cls = "border-emerald-400 bg-emerald-950";
                else if (show && isSel && !isCorrect) cls = "border-red-500 bg-red-950";
                else if (!show && isSel) cls = "border-red-500 bg-red-950/50";
                return (
                  <button
                    key={j}
                    type="button"
                    disabled={done}
                    onClick={() => setPicked((p) => ({ ...p, [i]: j }))}
                    className={`rt-hit block w-full rounded-md border-2 px-3 py-3 text-left text-sm text-white ${cls}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {done && (
              <p className="mt-2 text-sm text-amber-200">{it.why}</p>
            )}
          </div>
        );
      })}
      {!done ? (
        <button
          type="button"
          disabled={Object.keys(picked).length < items.length}
          onClick={grade}
          className="rt-hit w-full rounded-md bg-red-600 py-4 font-semibold text-white hover:bg-red-500 disabled:opacity-40"
        >
          Entregar y calificar
        </button>
      ) : (
        <p className="text-center text-2xl font-bold text-white">{pct}%</p>
      )}
    </div>
  );
}

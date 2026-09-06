"use client";

import { useState } from "react";
import { MicroItem } from "@/content/micro-training";
import { PromptCheckCard } from "@/components/trainer/PromptCheckCard";
import { SafetyNote } from "@/components/SafetyNote";

export function MicroRunner({
  items,
  onDone,
}: {
  items: MicroItem[];
  onDone?: (score: number) => void;
}) {
  const [i, setI] = useState(0);
  const [ok, setOk] = useState(false);
  const [hits, setHits] = useState(0);
  const [tries, setTries] = useState(0);
  const item = items[i];
  if (!item) return null;

  return (
    <div className="space-y-3">
      <p className="font-mono text-[10px] text-emerald-500">
        {item.kind.toUpperCase()} · {i + 1}/{items.length}
      </p>
      <h2 className="text-lg font-bold text-white">{item.titleEs}</h2>
      <SafetyNote compact />
      {item.setupEs && <p className="text-sm text-slate-300">{item.setupEs}</p>}
      {item.output && <pre className="rounded bg-black p-3 font-mono text-xs text-emerald-200">{item.output}</pre>}
      <PromptCheckCard
        key={item.id}
        check={item.check}
        exerciseId={`micro:${item.id}`}
        onPassed={() => setOk(true)}
        onResult={(good) => {
          setTries((n) => n + 1);
          if (good) setHits((n) => n + 1);
        }}
      />
      {ok && (
        <button
          type="button"
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white"
          onClick={() => {
            setOk(false);
            if (i + 1 < items.length) setI(i + 1);
            else onDone?.(tries ? Math.round((hits / tries) * 100) : 100);
          }}
        >
          NEXT
        </button>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { WHATS_NEXT, WHATS_NEXT_START } from "@/content/whats-next";
import { PromptCheckCard } from "@/components/trainer/PromptCheckCard";
import { SafetyNote } from "@/components/SafetyNote";

export default function WhatsNextPage() {
  const [id, setId] = useState(WHATS_NEXT_START);
  const [ok, setOk] = useState(false);
  const [choice, setChoice] = useState<string | undefined>();
  const node = WHATS_NEXT[id];

  if (id === "end" || !node) {
    return (
      <div className="mx-auto max-w-lg space-y-3">
        <p className="text-emerald-300">Cadena cerrada. No era una receta: tus decisiones cambiaron el output.</p>
        <Link href="/train" className="text-emerald-400 underline">
          TRAIN
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link href="/train" className="text-xs text-slate-500">
        ← TRAIN
      </Link>
      <h1 className="text-xl font-bold text-white">WHAT&apos;S NEXT?</h1>
      <SafetyNote compact />
      <p className="whitespace-pre-wrap text-sm text-slate-300">{node.setupEs}</p>
      {node.output && <pre className="rounded bg-black p-3 font-mono text-xs text-emerald-200">{node.output}</pre>}
      <PromptCheckCard
        key={node.id}
        check={node.check}
        exerciseId={`whats:${node.id}`}
        onPassed={() => setOk(true)}
        onChoice={setChoice}
      />
      {node.check.choices && (
        <p className="text-[11px] text-slate-500">La situación cambia según la opción correcta que defiendas.</p>
      )}
      {ok && (
        <button
          type="button"
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white"
          onClick={() => {
            const picked =
              choice ??
              node.check.choices?.find((c) => c.ok)?.id ??
              Object.keys(node.nextByChoice)[0];
            const next = node.nextByChoice[picked] ?? "end";
            setChoice(undefined);
            setOk(false);
            setId(next);
          }}
        >
          NEW RESULT →
        </button>
      )}
    </div>
  );
}

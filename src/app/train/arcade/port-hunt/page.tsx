"use client";

import { useState } from "react";
import Link from "next/link";
import { PORT_HUNT } from "@/content/arcade";
import { keywordsMatch } from "@/lib/trainer/normalize";
import { useProgress } from "@/lib/progress/context";

export default function PortHuntPage() {
  const { recordTrainerAttempt } = useProgress();
  const [i, setI] = useState(0);
  const [svc, setSvc] = useState("");
  const [why, setWhy] = useState("");
  const [tool, setTool] = useState("");
  const [msg, setMsg] = useState("");
  const [deck] = useState(PORT_HUNT);
  const p = deck[i % deck.length];

  const check = () => {
    const ok = keywordsMatch(svc, p.keywords) || keywordsMatch(tool, p.keywords);
    recordTrainerAttempt({
      exerciseId: `arcade:port:${p.port}`,
      correct: ok,
      hintsUsed: 0,
      skillKind: "reasoning",
      failKind: ok ? undefined : "reasoning",
      domain: "net-basic",
    });
    setMsg(
      ok
        ? `${p.service} / ${p.proto}. ${p.why}. Tool: ${p.tool}`
        : "WRONG PRIORITY o servicio. TRY AGAIN."
    );
    if (ok) {
      setSvc("");
      setWhy("");
      setTool("");
      setI((n) => n + 1);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link href="/train/arcade" className="text-xs text-slate-500">
        ← ARCADE
      </Link>
      <h1 className="font-mono text-5xl font-bold text-emerald-400">{p.port}</h1>
      <p className="text-sm text-slate-400">Servicio · protocolo · por qué · herramienta</p>
      <input value={svc} onChange={(e) => setSvc(e.target.value)} placeholder="servicio / proto" className="w-full rounded border border-slate-700 bg-slate-950 p-2 font-mono text-sm" />
      <input value={why} onChange={(e) => setWhy(e.target.value)} placeholder="por qué le importa a un pentester" className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-sm" />
      <input value={tool} onChange={(e) => setTool(e.target.value)} placeholder="herramienta de enum" className="w-full rounded border border-slate-700 bg-slate-950 p-2 font-mono text-sm" />
      <button type="button" onClick={check} className="rounded-md bg-emerald-600 px-4 py-2 text-white">
        NEXT
      </button>
      {msg && <p className="text-sm text-amber-200">{msg}</p>}
    </div>
  );
}

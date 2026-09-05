"use client";

import { useEffect, useState } from "react";
import { downloadOfflinePack } from "@/lib/offline/pack";

export function OfflinePackButton({ compact }: { compact?: boolean }) {
  const [online, setOnline] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pct, setPct] = useState<number | null>(null);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const run = async () => {
    setBusy(true);
    setMsg(null);
    setPct(0);
    try {
      const { ok, fail } = await downloadOfflinePack((done, total) => {
        setPct(Math.round((done / total) * 100));
      });
      setMsg(fail ? `Guardado (${ok} ok, ${fail} fallos). Abre Teoría sin datos.` : `Listo: ${ok} páginas en este teléfono.`);
    } catch {
      setMsg("No se pudo guardar. Entra con WiFi y reintenta.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={compact ? "text-xs" : "space-y-2"}>
      <p className={`font-mono ${online ? "text-emerald-500" : "text-amber-400"}`}>
        {online ? "ONLINE" : "OFFLINE · progreso en este teléfono"}
      </p>
      <button
        type="button"
        disabled={busy || !online}
        onClick={run}
        className="rounded-md border border-emerald-700 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-40"
      >
        {busy ? `Guardando… ${pct ?? 0}%` : "Guardar en este teléfono"}
      </button>
      {msg && <p className="mt-1 text-xs text-slate-400">{msg}</p>}
    </div>
  );
}

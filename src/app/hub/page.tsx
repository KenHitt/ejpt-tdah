"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HUB_REPOS, HUB_TRACKS, HubLayer, HubTrack } from "@/content/github-hub";

const HUB_KEY = "ejpt-hub-v1";
const LAYERS: HubLayer[] = ["SCAN", "DEEP", "RABBIT"];

function loadSeen(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(HUB_KEY) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

export default function HubPage() {
  return (
    <Suspense fallback={<p className="font-mono text-red-400">HUB…</p>}>
      <HubInner />
    </Suspense>
  );
}

function HubInner() {
  const sp = useSearchParams();
  const wParam = sp.get("w");
  const wInit = wParam !== null && wParam !== "" && !Number.isNaN(Number(wParam)) ? Number(wParam) : "ALL";
  const [track, setTrack] = useState<HubTrack | "ALL">("ALL");
  const [layer, setLayer] = useState<HubLayer | "ALL">("ALL");
  const [week, setWeek] = useState<number | "ALL">(wInit);
  const [seen, setSeen] = useState<Record<string, string>>({});
  const [timerId, setTimerId] = useState<string | null>(null);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hub pins
    setSeen(loadSeen());
  }, []);

  useEffect(() => {
    if (!timerId || left <= 0) return;
    const t = window.setInterval(() => setLeft((s) => s - 1), 1000);
    return () => window.clearInterval(t);
  }, [timerId, left]);

  const list = useMemo(() => {
    return HUB_REPOS.filter((r) => {
      if (track !== "ALL" && r.track !== track) return false;
      if (layer !== "ALL" && r.layer !== layer) return false;
      if (week !== "ALL" && !r.weeks.includes(week)) return false;
      return true;
    });
  }, [track, layer, week]);

  const mark = (id: string) => {
    const next = { ...seen, [id]: new Date().toISOString() };
    setSeen(next);
    window.localStorage.setItem(HUB_KEY, JSON.stringify(next));
  };

  const startTimer = (id: string, min: number) => {
    setTimerId(id);
    setLeft(min * 60);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <p className="font-mono text-xs tracking-widest text-red-400">GITHUB HUB · RED TEAM LIBRARY</p>
      <h1 className="text-3xl font-bold text-white">Repos, no pestañas infinitas</h1>
      <div className="space-y-3 rounded-xl border border-red-900/60 bg-black/40 p-4 text-sm leading-relaxed text-slate-200">
        <p className="font-mono text-[10px] text-amber-400">TDAH × ALTAS CAPACIDADES</p>
        <p>
          Cerebro rápido + atención que se va: el enemigo es el <strong className="text-white">hoyo sin timer</strong>, no
          la dificultad. SCAN = ojeada. DEEP = mecanismo. RABBIT = 8–15 min y paras aunque duela.
        </p>
        <p>
          No te hablo como si fueras lento. Te pongo densidad y un corte. Una ficha. Un repo. El lab manda; GitHub es
          munición.
        </p>
      </div>

      {timerId && left > 0 && (
        <p className="rounded-md border border-amber-500 bg-amber-950 px-3 py-2 font-mono text-lg text-amber-300">
          TIMER {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")} · {timerId}
        </p>
      )}
      {timerId && left === 0 && (
        <p className="rounded-md border border-red-500 bg-red-950 px-3 py-2 font-mono text-red-300">
          STOP. Cierra el repo. Vuelve a CLASE o marca visto.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" className={chip(track === "ALL")} onClick={() => setTrack("ALL")}>
          TRACK*
        </button>
        {HUB_TRACKS.map((t) => (
          <button key={t} type="button" className={chip(track === t)} onClick={() => setTrack(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={chip(layer === "ALL")} onClick={() => setLayer("ALL")}>
          LAYER*
        </button>
        {LAYERS.map((l) => (
          <button key={l} type="button" className={chip(layer === l)} onClick={() => setLayer(l)}>
            {l}
          </button>
        ))}
        <span className="mx-2 font-mono text-[10px] text-slate-500">SEMANA</span>
        <button type="button" className={chip(week === "ALL")} onClick={() => setWeek("ALL")}>
          *
        </button>
        {Array.from({ length: 13 }, (_, i) => (
          <button key={i} type="button" className={chip(week === i)} onClick={() => setWeek(i)}>
            {i}
          </button>
        ))}
      </div>

      <p className="font-mono text-xs text-slate-400">
        {list.length} repos · {Object.keys(seen).length} marcados · {HUB_REPOS.length} en catálogo
      </p>

      <ul className="space-y-3">
        {list.map((r) => (
          <li key={r.id} className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm text-red-400 underline decoration-red-900 hover:text-red-300"
              >
                {r.name}
              </a>
              <p className="font-mono text-[10px] text-amber-300">
                {r.layer} · {r.track} · {r.min}m · S{r.weeks.join(",")}
              </p>
            </div>
            <p className="mt-2 text-sm text-white">{r.scan}</p>
            <p className="mt-1 text-sm text-slate-300">
              <span className="font-mono text-[10px] text-emerald-400">GIFTED · </span>
              {r.gifted}
            </p>
            <p className="mt-1 text-sm text-slate-200">
              <span className="font-mono text-[10px] text-amber-400">PROTOCOLO · </span>
              {r.protocol}
            </p>
            <p className="mt-1 text-xs text-red-300/90">{r.safety}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => startTimer(r.id, r.min)}
                className="rt-hit rounded-md border border-amber-500 px-3 py-2 font-mono text-xs text-amber-200"
              >
                TIMER {r.min}m
              </button>
              <button
                type="button"
                onClick={() => mark(r.id)}
                className={`rt-hit rounded-md px-3 py-2 font-mono text-xs ${
                  seen[r.id] ? "bg-emerald-700 text-white" : "border border-slate-500 text-slate-200"
                }`}
              >
                {seen[r.id] ? "VISTO" : "MARCAR VISTO"}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Link href="/clase" className="inline-block text-sm text-emerald-400 underline">
        Volver a CLASE (el lab gana)
      </Link>
    </div>
  );
}

function chip(on: boolean) {
  return `rt-hit rounded-md px-3 py-1.5 font-mono text-[10px] ${
    on ? "bg-red-600 text-white" : "border border-slate-600 text-slate-200"
  }`;
}

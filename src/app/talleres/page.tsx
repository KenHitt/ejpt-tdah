"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ACADEMY_HOURS, ACADEMY_STATS } from "@/content/academy/program";
import { ACADEMY_WORKSHOPS, WORKSHOP_TRACKS, HubTrack } from "@/content/academy/workshops";

export default function TalleresPage() {
  const [track, setTrack] = useState<HubTrack | "ALL">("ALL");
  const list = useMemo(
    () => (track === "ALL" ? ACADEMY_WORKSHOPS : ACADEMY_WORKSHOPS.filter((w) => w.track === track)),
    [track]
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">Extensión</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Talleres de estudio</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {ACADEMY_STATS.talleres} talleres · {ACADEMY_HOURS.talleres} h. Cada uno es una clase escrita: mecanismo,
          ejemplo y práctica en tu lab. Esto es la extensión del bootcamp, no una lista de enlaces.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip on={track === "ALL"} onClick={() => setTrack("ALL")}>
          Todos
        </Chip>
        {WORKSHOP_TRACKS.map((t) => (
          <Chip key={t} on={track === t} onClick={() => setTrack(t)}>
            {t}
          </Chip>
        ))}
      </div>

      <p className="text-xs text-slate-500">{list.length} talleres en esta vista</p>

      <ul className="space-y-2">
        {list.map((w) => (
          <li key={w.id}>
            <Link
              href={`/talleres/${w.id}`}
              className="block rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 hover:border-emerald-700"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-white">{w.titleEs}</p>
                <p className="font-mono text-[10px] text-emerald-400">
                  {w.hours} h · {w.track} · M{w.weeks.map((n) => n + 1).join(",")}
                </p>
              </div>
              <p className="mt-1 text-sm text-slate-400">{w.theory[1]?.p ?? w.theory[0]?.p}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-[11px] font-medium ${
        on ? "bg-emerald-600 text-white" : "border border-slate-700 text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ACADEMY_STATS } from "@/content/academy/program";
import { ACADEMY_WORKSHOPS, WORKSHOP_TRACKS, HubTrack } from "@/content/academy/workshops";
import { HONEST_HOURS } from "@/content/v6/hours";
import { workshopWhen } from "@/content/v6/relations";
import { skillStatus } from "@/lib/v6/mastery";
import { statusClass, statusLabel } from "@/lib/v6/status-ui";
import { useCourse } from "@/lib/course/context";
import { useProgress } from "@/lib/progress/context";

export default function TalleresPage() {
  const [track, setTrack] = useState<HubTrack | "ALL">("ALL");
  const { state: course } = useCourse();
  const { state: progress } = useProgress();
  const list = useMemo(
    () => (track === "ALL" ? ACADEMY_WORKSHOPS : ACADEMY_WORKSHOPS.filter((w) => w.track === track)),
    [track]
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-red-400">Deep Dives</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Deep Dives</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {ACADEMY_STATS.talleres} deep dives · ~{HONEST_HOURS.talleresEstimated} h estimadas (~40 min cada uno, no 2.5
          h). Profundizan un skill de la ruta. No son una segunda academia ni un requisito para avanzar.
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
        {list.map((w) => {
          const meta = workshopWhen(w.id);
          const st = meta.skill ? skillStatus(meta.skill.id, course, progress) : "AVAILABLE";
          return (
            <li key={w.id}>
              <Link
                href={`/talleres/${w.id}`}
                className="block rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 hover:border-red-700"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium text-white">{w.titleEs}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${statusClass(st)}`}>{statusLabel(st)}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Related skill: {meta.relatedSkillTitle} · After: {meta.recommendedAfter}
                </p>
                <p className="text-[11px] text-slate-500">
                  Used by: {meta.usedBy} · Type: {meta.type} · ~{meta.deepMin} min (estimado) · scan ~{meta.scanMin} min
                </p>
                {meta.prereqTitles.length > 0 && (
                  <p className="text-[11px] text-slate-600">Prerequisites: {meta.prereqTitles.join(", ")}</p>
                )}
                <p className="mt-1 text-sm text-slate-400">{w.theory[1]?.p ?? w.theory[0]?.p}</p>
              </Link>
            </li>
          );
        })}
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
        on ? "bg-red-600 text-white" : "border border-slate-700 text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

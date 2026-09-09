"use client";

import Link from "next/link";
import { V6_SKILLS, getSkill } from "@/content/v6/skills";
import { useCourse } from "@/lib/course/context";
import { useProgress } from "@/lib/progress/context";
import { calculateCompetency } from "@/lib/v9/competency";
import { academicState } from "@/lib/v9/competency";
import { statusClass, statusLabel } from "@/lib/v6/status-ui";
import { progressBarClass } from "@/lib/design/tokens";

const CHAIN = ["networking", "nmap", "enumeration", "vuln", "exploitation", "post", "privesc-linux"];
const DIMS = ["knowledge", "execution", "interpretation", "decision", "transfer", "retention"] as const;

export default function SkillMapPage() {
  const { state: course } = useCourse();
  const { state: progress } = useProgress();

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-red-400">Skill map</p>
      <h1 className="text-3xl font-bold text-white">Dependencies</h1>
      <p className="text-sm text-slate-400">
        Prerequisites and competency dimensions. Completed ≠ mastered. Bars show Insufficient evidence when empty.
      </p>

      <ol className="space-y-1 font-mono text-sm text-slate-300">
        {CHAIN.map((id, i) => {
          const s = getSkill(id);
          return (
            <li key={id}>
              {i > 0 && <p className="pl-4 text-slate-600">↓</p>}
              <Link href={`/master/${id}`} className="text-red-300 hover:underline">
                {s?.titleEs ?? id}
              </Link>
            </li>
          );
        })}
      </ol>

      <section className="space-y-2 text-sm">
        <h2 className="font-semibold text-white">Web branch</h2>
        <p className="font-mono text-slate-400">HTTP enum → Web → SQLi / XSS / LFI</p>
        <p>
          {["http-enum", "web", "sqli", "xss", "lfi"].map((id, i) => (
            <span key={id}>
              {i > 0 ? " · " : ""}
              <Link href={`/master/${id}`} className="text-red-400">
                {getSkill(id)?.titleEs ?? id}
              </Link>
            </span>
          ))}
        </p>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="font-semibold text-white">SMB / Windows branch</h2>
        <p>
          {["smb", "privesc-windows"].map((id, i) => (
            <span key={id}>
              {i > 0 ? " · " : ""}
              <Link href={`/master/${id}`} className="text-red-400">
                {getSkill(id)?.titleEs ?? id}
              </Link>
            </span>
          ))}
        </p>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="font-semibold text-white">Internal</h2>
        <p>
          {["networking", "pivoting"].map((id, i) => (
            <span key={id}>
              {i > 0 ? " · " : ""}
              <Link href={`/master/${id}`} className="text-red-400">
                {getSkill(id)?.titleEs ?? id}
              </Link>
            </span>
          ))}
        </p>
      </section>

      <ul className="space-y-2">
        {V6_SKILLS.map((s) => {
          const c = calculateCompetency(s.id, course, progress);
          const st = academicState(s.id, course, progress);
          return (
            <li key={s.id} className="rounded-lg border border-slate-800 p-3">
              <div className="flex items-baseline justify-between gap-2">
                <Link href={`/master/${s.id}`} className="font-semibold text-white hover:text-red-400">
                  {s.titleEs}
                </Link>
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${statusClass(st)}`}>{statusLabel(st)}</span>
              </div>
              <p className="text-[11px] text-slate-500">Why: {s.whyEs}</p>
              <p className="text-[11px] text-slate-500">
                Prerequisites: {s.prereqIds.length ? s.prereqIds.map((id) => getSkill(id)?.titleEs ?? id).join(", ") : "—"}
              </p>
              <dl className="mt-2 space-y-1">
                {DIMS.map((d) => {
                  const pct = c.dims[d];
                  return (
                    <div key={d}>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <dt className="capitalize">{d}</dt>
                        <dd>{pct === undefined ? "Insufficient evidence" : `${pct}%`}</dd>
                      </div>
                      <div className="h-1 overflow-hidden rounded bg-slate-800">
                        <div className={`h-full ${progressBarClass(pct ?? 0)}`} style={{ width: `${pct ?? 0}%` }} />
                      </div>
                    </div>
                  );
                })}
              </dl>
              <p className="mt-2 text-[11px] text-slate-600">
                Leads to:{" "}
                {V6_SKILLS.filter((x) => x.prereqIds.includes(s.id))
                  .map((x) => x.titleEs)
                  .join(", ") || "—"}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

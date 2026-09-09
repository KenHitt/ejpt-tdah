"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getSkill, skillsRequiring, V6_SKILLS } from "@/content/v6/skills";
import { getPhase } from "@/content/v6/phases";
import { auditSkill } from "@/content/v6/audit";
import { PrereqBanner } from "@/components/v6/PrereqBanner";
import { skillBreakdown, skillStatus } from "@/lib/v6/mastery";
import { statusClass, statusLabel } from "@/lib/v6/status-ui";
import { useCourse } from "@/lib/course/context";
import { useProgress } from "@/lib/progress/context";
import { CycleFlags } from "@/content/v6/types";
import { PRIMARY_BUTTON, progressBarClass } from "@/lib/design/tokens";
import { drillsForSkill } from "@/content/v8/drills";
import { outcomesFor } from "@/content/v9/outcomes";
import { academicState, calculateCompetency, independenceStats } from "@/lib/v9/competency";
import { moduleGate } from "@/lib/v9/gates";
import { diagnoseFailure } from "@/lib/v9/diagnose";
import { remediationPath } from "@/lib/v9/remediation";
import { evidenceForSkill } from "@/lib/v9/evidence";

const CYCLE: { key: keyof CycleFlags; label: string }[] = [
  { key: "theory", label: "Theory" },
  { key: "quiz", label: "Short exam" },
  { key: "guided", label: "Guided example" },
  { key: "independent", label: "Independent" },
  { key: "lab", label: "VirtualBox lab" },
  { key: "decision", label: "Decision drill" },
  { key: "challenge", label: "Challenge" },
  { key: "assessment", label: "Final assessment" },
  { key: "srs", label: "SRS" },
];

export default function MasterSkillPage() {
  const params = useParams<{ skillId: string }>();
  const skill = getSkill(params.skillId);
  const { state: course } = useCourse();
  const { state: progress } = useProgress();

  if (!skill) {
    return (
      <div className="space-y-3">
        <p className="text-slate-400">Skill no encontrado.</p>
        <ul className="space-y-1">
          {V6_SKILLS.map((s) => (
            <li key={s.id}>
              <Link href={`/master/${s.id}`} className="text-red-400">
                {s.titleEs}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const phase = getPhase(skill.phaseId);
  const status = skillStatus(skill.id, course, progress);
  const academic = academicState(skill.id, course, progress);
  const audit = auditSkill(skill.id);
  const nextSkills = skillsRequiring(skill.id);
  const firstLesson = skill.lessonIds[0];
  const breakdown = skillBreakdown(skill.id, course, progress);
  const outcomes = outcomesFor(skill.id);
  const competency = calculateCompetency(skill.id, course, progress);
  const gate = moduleGate(skill.id, course, progress);
  const dx = diagnoseFailure(skill.id, course, progress);
  const rem = dx ? remediationPath(skill.id, dx.failure) : [];
  const evidence = evidenceForSkill(skill.id, course, progress);
  const indep = independenceStats(skill.id, progress);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link href="/clase" className="text-xs text-slate-500 hover:text-red-400">
        ← Academy
      </Link>
      <p className="text-[11px] uppercase tracking-wide text-red-400">Master this skill</p>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-3xl font-bold text-white">{skill.titleEs}</h1>
        <span className={`rounded-full px-2 py-0.5 text-[11px] ${statusClass(academic)}`}>{statusLabel(academic)}</span>
      </div>
      <p className="text-sm text-slate-300">{skill.whyEs}</p>
      <p className="text-xs text-slate-500">
        {phase ? `Fase ${phase.n} · ${phase.titleEs}` : ""} · {skill.track === "ejpt-prep" ? "eJPT prep" : "Red team foundation"}
        · V6 {statusLabel(status)} ≠ completed. Academic: {statusLabel(academic)}.
      </p>

      {outcomes && (
        <section className="rounded-xl border border-slate-800 p-4">
          <p className="text-[11px] uppercase text-slate-500">Learning outcomes</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
            {outcomes.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>
      )}

      <PrereqBanner skillId={skill.id} />

      {skill.prereqIds.length > 0 && (
        <p className="text-sm text-slate-400">
          Prerequisites:{" "}
          {skill.prereqIds.map((id, i) => (
            <span key={id}>
              {i > 0 ? ", " : ""}
              <Link href={`/master/${id}`} className="text-red-400">
                {getSkill(id)?.titleEs ?? id}
              </Link>
            </span>
          ))}
        </p>
      )}

      <section className="rounded-xl border border-slate-800 p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] uppercase text-slate-500">Curriculum proxy (not mastery)</p>
          <p className="text-lg font-bold text-white">{breakdown.overall}%</p>
        </div>
        {!breakdown.hasData ? (
          <p className="mt-2 text-sm text-slate-500">Not enough data yet — complete a lesson or drill on this skill.</p>
        ) : (
          <>
            <dl className="mt-2 space-y-2 text-sm">
              {(
                [
                  ["Knowledge", breakdown.knowledge],
                  ["Command memory", breakdown.commandMemory],
                  ["Reasoning", breakdown.reasoning],
                  ["Practical", breakdown.practical],
                  ["Independence", breakdown.independence],
                ] as [string, number | undefined][]
              ).map(([label, pct]) => (
                <div key={label}>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <dt>{label}</dt>
                    <dd>{pct === undefined ? "—" : `${pct}%`}</dd>
                  </div>
                  <div className="mt-0.5 h-1.5 overflow-hidden rounded bg-slate-800">
                    <div className={`h-full ${progressBarClass(pct ?? 0)}`} style={{ width: `${pct ?? 0}%` }} />
                  </div>
                </div>
              ))}
            </dl>
            {breakdown.mainWeaknessEs && <p className="mt-3 text-sm text-red-300">{breakdown.mainWeaknessEs}</p>}
          </>
        )}
      </section>

      <section className="rounded-xl border border-slate-800 p-4">
        <p className="text-[11px] uppercase text-slate-500">Competency dimensions</p>
        {!competency.hasData ? (
          <p className="mt-2 text-sm text-slate-500">Not enough data yet.</p>
        ) : (
          <dl className="mt-2 space-y-2 text-sm">
            {(Object.entries(competency.dims) as [string, number | undefined][]).map(([label, pct]) => (
              <div key={label} className="flex justify-between text-[11px] text-slate-400">
                <dt className="capitalize">{label}</dt>
                <dd>{pct === undefined ? "Not enough data yet" : `${pct}%`}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="mt-3 font-mono text-[11px] text-slate-500">
          Independent {indep.independentSuccess === undefined ? "—" : `${indep.independentSuccess}%`} · Hint dep{" "}
          {indep.hintDependency === undefined ? "—" : `${indep.hintDependency}%`} · Walkthrough{" "}
          {indep.walkthroughDependency === undefined ? "—" : `${indep.walkthroughDependency}%`}
        </p>
      </section>

      {gate && (
        <section className="rounded-xl border border-slate-800 p-4">
          <p className="text-[11px] uppercase text-slate-500">Module gate (advisory)</p>
          <p className="mt-1 text-sm text-white">{gate.pass ? "PASS" : "NOT YET — diagnose → remediate → retry"}</p>
          <ul className="mt-2 space-y-1 font-mono text-xs text-slate-400">
            {gate.checks.map((c) => (
              <li key={c.label} className="flex justify-between gap-2">
                <span>{c.label}</span>
                <span className={c.ok === true ? "text-emerald-400" : c.ok === false ? "text-amber-300" : "text-slate-600"}>
                  {c.note}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dx && (
        <section className="rounded-xl border border-amber-900/50 p-4">
          <p className="text-[11px] uppercase text-amber-300">Diagnosis</p>
          <p className="mt-1 text-sm text-white">{dx.failure.replaceAll("_", " ")}</p>
          <p className="mt-1 text-sm text-slate-400">{dx.evidenceEs}</p>
          <p className="mt-1 text-xs text-slate-500">{dx.notThisEs}</p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
            {rem.map((s) => (
              <li key={s.href + s.titleEs}>
                <Link href={s.href} className="text-red-400">
                  {s.min} min · {s.titleEs}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="rounded-xl border border-slate-800 p-4 text-sm text-slate-400">
        <p className="text-[11px] uppercase text-slate-500">Evidence</p>
        <p className="mt-2">
          Independent successes {evidence.independentSuccesses} · Failed decisions {evidence.failedDecisions} · Hints{" "}
          {evidence.hintsUsed}
          {evidence.avgSolveMs ? ` · avg ${Math.round(evidence.avgSolveMs / 60000)}m` : ""}
        </p>
        <p className="mt-1 text-xs">
          Transfer {evidence.transfer ? "recorded" : "unproven"} · Retention due {evidence.retentionDue ? "yes" : "no"}
        </p>
      </section>

      <section className="rounded-xl border border-slate-800 p-4">
        <ul className="mt-2 space-y-1 font-mono text-sm">
          {CYCLE.map((c) => (
            <li key={c.key} className="flex justify-between">
              <span className="text-slate-300">{c.label}</span>
              <span className={audit?.flags[c.key] ? "text-emerald-400" : "text-slate-600"}>
                {audit?.flags[c.key] ? "✓" : "—"}
              </span>
            </li>
          ))}
        </ul>
        {audit && audit.missing.length > 0 && (
          <p className="mt-3 text-xs text-amber-200">Huecos de contenido: {audit.missing.join(", ")}</p>
        )}
      </section>

      <ol className="space-y-2 text-sm">
        {firstLesson && <Li href={`/clase/${firstLesson}`} label="Theory + quiz + guided + lab" />}
        {skill.learnIds[0] && <Li href={`/learn/${skill.learnIds[0]}`} label="Quick review" />}
        {skill.workshopIds[0] && <Li href={`/talleres/${skill.workshopIds[0]}`} label="Deep dive workshop" />}
        {[...new Set(skill.trainHrefs.filter((h) => h !== `/clase/${firstLesson}`))].map((h) => (
          <Li
            key={h}
            href={h}
            label={h.includes("decision") ? "Decision drills" : h.includes("memory") ? "SRS" : "Practice"}
          />
        ))}
        <Li href={skill.boss.href} label={`Boss · ${skill.boss.titleEs}`} />
        {drillsForSkill(skill.id).length > 0 && (
          <Li href="/train/decisions" label={`Decision pack (${drillsForSkill(skill.id).length})`} />
        )}
        <Li href="/train/transfer" label="Transfer variants" />
        <Li href="/operaciones" label="Internal machines / bosses" />
        <Li href="/mapa" label="Where this leads (skill map)" />
      </ol>

      {firstLesson && status !== "LOCKED" && (
        <Link href={`/clase/${firstLesson}`} className={PRIMARY_BUTTON}>
          Continue this skill
        </Link>
      )}

      {nextSkills.length > 0 && (
        <p className="text-sm text-slate-500">
          Después:{" "}
          {nextSkills.map((s, i) => (
            <span key={s.id}>
              {i > 0 ? " · " : ""}
              <Link href={`/master/${s.id}`} className="text-slate-300 hover:text-red-400">
                {s.titleEs}
              </Link>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

function Li({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="text-slate-300 hover:text-red-400">
        → {label}
      </Link>
    </li>
  );
}

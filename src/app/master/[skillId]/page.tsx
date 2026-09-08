"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getSkill, skillsRequiring, V6_SKILLS } from "@/content/v6/skills";
import { getPhase } from "@/content/v6/phases";
import { auditSkill } from "@/content/v6/audit";
import { PrereqBanner } from "@/components/v6/PrereqBanner";
import { skillStatus } from "@/lib/v6/mastery";
import { statusClass, statusLabel } from "@/lib/v6/status-ui";
import { useCourse } from "@/lib/course/context";
import { useProgress } from "@/lib/progress/context";
import { CycleFlags } from "@/content/v6/types";

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
              <Link href={`/master/${s.id}`} className="text-amber-400">
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
  const audit = auditSkill(skill.id);
  const nextSkills = skillsRequiring(skill.id);
  const firstLesson = skill.lessonIds[0];

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link href="/clase" className="text-xs text-slate-500 hover:text-amber-400">
        ← Academy
      </Link>
      <p className="text-[11px] uppercase tracking-wide text-amber-400">Master this skill</p>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-3xl font-bold text-white">{skill.titleEs}</h1>
        <span className={`rounded-full px-2 py-0.5 text-[11px] ${statusClass(status)}`}>{statusLabel(status)}</span>
      </div>
      <p className="text-sm text-slate-300">{skill.whyEs}</p>
      <p className="text-xs text-slate-500">
        {phase ? `Fase ${phase.n} · ${phase.titleEs}` : ""} · {skill.track === "ejpt-prep" ? "eJPT prep" : "Red team foundation"}
      </p>

      <PrereqBanner skillId={skill.id} />

      {skill.prereqIds.length > 0 && (
        <p className="text-sm text-slate-400">
          Prerequisites:{" "}
          {skill.prereqIds.map((id, i) => (
            <span key={id}>
              {i > 0 ? ", " : ""}
              <Link href={`/master/${id}`} className="text-amber-400">
                {getSkill(id)?.titleEs ?? id}
              </Link>
            </span>
          ))}
        </p>
      )}

      <section className="rounded-xl border border-slate-800 p-4">
        <p className="text-[11px] uppercase text-slate-500">Learning cycle</p>
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
      </ol>

      {firstLesson && status !== "LOCKED" && (
        <Link href={`/clase/${firstLesson}`} className="block rounded-xl bg-amber-500 py-3 text-center font-bold text-black">
          Continue this skill
        </Link>
      )}

      {nextSkills.length > 0 && (
        <p className="text-sm text-slate-500">
          Después:{" "}
          {nextSkills.map((s, i) => (
            <span key={s.id}>
              {i > 0 ? " · " : ""}
              <Link href={`/master/${s.id}`} className="text-slate-300 hover:text-amber-400">
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
      <Link href={href} className="text-slate-300 hover:text-amber-400">
        → {label}
      </Link>
    </li>
  );
}

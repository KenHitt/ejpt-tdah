import Link from "next/link";
import { auditAll } from "@/content/v6/audit";
import { V6_PHASES } from "@/content/v6/phases";
import { HONEST_HOURS } from "@/content/v6/hours";
import { COURSE_LESSONS } from "@/content/course";
import { ACADEMY_WORKSHOPS } from "@/content/academy/workshops";
import { LEARN_ARTICLES } from "@/content/learn-articles";
import { CycleFlags } from "@/content/v6/types";
import { EJPT_OBJECTIVE_MATRIX } from "@/content/v8/ejpt-matrix";
import { V8_ALL_DRILLS } from "@/content/v8/drills";
import { SRS_V8 } from "@/content/v8/srs-extra";
import { COMMAND_BANK } from "@/content/command-bank";
import { V8_MACHINES, V8_BOSSES } from "@/content/v8/operations";
import { V8_MOCKS } from "@/content/v8/mocks";
import { V6_SKILLS } from "@/content/v6/skills";

const FLAG_LABEL: { key: keyof CycleFlags; label: string }[] = [
  { key: "theory", label: "Teoría" },
  { key: "quiz", label: "Quiz" },
  { key: "guided", label: "Guiado" },
  { key: "independent", label: "Indep." },
  { key: "lab", label: "Lab" },
  { key: "decision", label: "Decisión" },
  { key: "challenge", label: "Challenge" },
  { key: "assessment", label: "Assess" },
  { key: "srs", label: "SRS" },
];

export default function AuditoriaPage() {
  const rows = auditAll();
  const incomplete = rows.filter((r) => r.missing.length > 0);
  const withDecision = rows.filter((r) => r.flags.decision).length;
  const withSrs = rows.filter((r) => r.flags.srs).length;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-red-400">Content quality audit</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Auditoría interna</h1>
        <p className="mt-2 text-sm text-slate-400">
          Coverage se calcula de flags reales (teoría, quiz, lab, drills, SRS…). Completar una página ≠ dominio. Horas:
          estimadas.
        </p>
      </div>

      <section className="grid gap-3 text-sm sm:grid-cols-2">
        <Stat label="Fases" value={String(V6_PHASES.length)} />
        <Stat label="Skills" value={String(rows.length)} />
        <Stat label="Jornadas" value={String(COURSE_LESSONS.length)} />
        <Stat label="Deep dives" value={String(ACADEMY_WORKSHOPS.length)} />
        <Stat label="Fichas" value={String(LEARN_ARTICLES.length)} />
        <Stat label="Skills con huecos" value={String(incomplete.length)} />
        <Stat label="Skills con Decision Drill" value={`${withDecision}/${rows.length}`} />
        <Stat label="Skills con SRS" value={`${withSrs}/${rows.length}`} />
        <Stat label="Decision drills V8 pack" value={String(V8_ALL_DRILLS.length)} />
        <Stat label="SRS cards (total)" value={String(COMMAND_BANK.length)} />
        <Stat label="SRS V8 added" value={String(SRS_V8.length)} />
        <Stat label="Internal machines" value={String(V8_MACHINES.length)} />
        <Stat label="Bosses" value={String(V8_BOSSES.length)} />
        <Stat label="Internal mocks" value={String(V8_MOCKS.length)} />
        <Stat label="Ruta principal (est.)" value={`${HONEST_HOURS.primaryEstimated} h`} />
        <Stat label="Catálogo (est.)" value={`${HONEST_HOURS.allCatalogEstimated} h`} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Coverage por skill</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr className="text-slate-500">
                <th className="pb-2 pr-2">Skill</th>
                <th className="pb-2 pr-2">%</th>
                {FLAG_LABEL.map((f) => (
                  <th key={f.key} className="pb-2 pr-2">
                    {f.label}
                  </th>
                ))}
                <th className="pb-2">Missing</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.skillId} className="border-t border-slate-800">
                  <td className="py-2 pr-2">
                    <Link href={`/master/${r.skillId}`} className="text-red-400">
                      {r.titleEs}
                    </Link>
                    <span className="ml-1 text-slate-600">
                      {r.lessonOk}/{r.lessonTotal}
                    </span>
                  </td>
                  <td className="pr-2 font-mono text-slate-300">{r.coverage}%</td>
                  {FLAG_LABEL.map((f) => (
                    <td key={f.key} className={r.flags[f.key] ? "text-emerald-400" : "text-slate-600"}>
                      {r.flags[f.key] ? "✓" : "—"}
                    </td>
                  ))}
                  <td className="text-amber-200">{r.missing.join(", ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">eJPT domain matrix (internal)</h2>
        <p className="mb-2 text-xs text-slate-500">Official INE domains mapped to academy evidence. Not an INE guarantee.</p>
        <ul className="space-y-3 text-sm">
          {EJPT_OBJECTIVE_MATRIX.map((row) => (
            <li key={row.domain} className="rounded-lg border border-slate-800 p-3">
              <p className="font-semibold text-white">{row.domain}</p>
              <p className="text-slate-400">{row.official}</p>
              <p className="mt-1 text-[11px] text-slate-500">
                Skills: {row.skillIds.map((id) => V6_SKILLS.find((s) => s.id === id)?.titleEs ?? id).join(" · ")}
              </p>
              <p className="text-[11px] text-slate-500">Evidence: {row.evidence.join(" · ")}</p>
              <p className={row.gap ? "text-red-400" : "text-emerald-400"}>{row.gap ? "GAP" : "COVERED (academy)"}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 p-3">
      <p className="text-[10px] uppercase text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

import Link from "next/link";
import { auditAll } from "@/content/v6/audit";
import { V6_PHASES } from "@/content/v6/phases";
import { HONEST_HOURS } from "@/content/v6/hours";
import { COURSE_LESSONS } from "@/content/course";
import { ACADEMY_WORKSHOPS } from "@/content/academy/workshops";
import { LEARN_ARTICLES } from "@/content/learn-articles";
import { CycleFlags } from "@/content/v6/types";

const FLAG_LABEL: { key: keyof CycleFlags; label: string }[] = [
  { key: "theory", label: "Teoría" },
  { key: "quiz", label: "Quiz" },
  { key: "guided", label: "Guiado" },
  { key: "lab", label: "Lab" },
  { key: "decision", label: "Decisión" },
  { key: "challenge", label: "Challenge" },
  { key: "assessment", label: "Assess" },
  { key: "srs", label: "SRS" },
];

export default function AuditoriaPage() {
  const rows = auditAll();
  const incomplete = rows.filter((r) => r.missing.length > 0);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">Content quality audit</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Auditoría interna</h1>
        <p className="mt-2 text-sm text-slate-400">
          No oculta deficiencias. Completar una página ≠ dominio. Horas: estimadas, no infladas.
        </p>
      </div>

      <section className="grid gap-3 text-sm sm:grid-cols-2">
        <Stat label="Fases" value={String(V6_PHASES.length)} />
        <Stat label="Skills" value={String(rows.length)} />
        <Stat label="Jornadas" value={String(COURSE_LESSONS.length)} />
        <Stat label="Talleres" value={String(ACADEMY_WORKSHOPS.length)} />
        <Stat label="Fichas" value={String(LEARN_ARTICLES.length)} />
        <Stat label="Skills con huecos" value={String(incomplete.length)} />
        <Stat label="Ruta principal (est.)" value={`${HONEST_HOURS.primaryEstimated} h`} />
        <Stat label="Catálogo (est.)" value={`${HONEST_HOURS.allCatalogEstimated} h`} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Ciclo por skill</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="text-slate-500">
                <th className="pb-2 pr-2">Skill</th>
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
                    <Link href={`/master/${r.skillId}`} className="text-amber-400">
                      {r.titleEs}
                    </Link>
                    <span className="ml-1 text-slate-600">
                      {r.lessonOk}/{r.lessonTotal}
                    </span>
                  </td>
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

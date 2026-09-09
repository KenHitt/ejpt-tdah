import Link from "next/link";
import { ACADEMY_NAME, ACADEMY_STATS } from "@/content/academy/program";
import { V6_PHASES } from "@/content/v6/phases";
import { V6_SKILLS } from "@/content/v6/skills";
import { HONEST_HOURS } from "@/content/v6/hours";
import { V8_ALL_DRILLS } from "@/content/v8/drills";
import { COMMAND_BANK } from "@/content/command-bank";
import { COURSE_LESSONS } from "@/content/course";
import { V8_MACHINES } from "@/content/v8/operations";

/** Comunicación de academia (V9.1). Datos reales del catálogo. Sin claims médicos. */
export function AcademyOverview() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-red-400">eJPT Academy</p>
        <h1 className="mt-1 text-3xl font-bold text-white">{ACADEMY_NAME}</h1>
        <p className="mt-2 text-sm text-slate-300">
          Entrenamiento práctico orientado a competencia para pentesting junior. Objetivo: demostrar habilidad en las
          áreas que evalúa eJPT — no memorizar páginas.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Diseñada para reducir carga cognitiva con sesiones cortas, estructuradas y activas. No es INE ni una
          probabilidad de aprobar.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <Stat label="Fases" value={String(V6_PHASES.length)} />
        <Stat label="Skills" value={String(V6_SKILLS.length)} />
        <Stat label="Jornadas" value={String(COURSE_LESSONS.length)} />
        <Stat label="Módulos" value={String(ACADEMY_STATS.modules)} />
        <Stat label="Talleres" value={String(ACADEMY_STATS.talleres)} />
        <Stat label="Fichas" value={String(ACADEMY_STATS.fichas)} />
        <Stat label="Decision drills" value={String(V8_ALL_DRILLS.length)} />
        <Stat label="SRS cards" value={String(COMMAND_BANK.length)} />
        <Stat label="Machines" value={String(V8_MACHINES.length)} />
        <Stat label="Ruta est." value={`${HONEST_HOURS.primaryEstimated} h`} />
      </dl>

      <div>
        <p className="text-[11px] uppercase tracking-wide text-slate-500">Metodología</p>
        <p className="mt-1 font-mono text-xs text-slate-300">LEARN → PRACTICE → DECIDE → EXECUTE → TRANSFER → REVIEW</p>
        <p className="mt-2 text-sm text-slate-400">
          No estudias únicamente leyendo. Hay práctica activa, recuperación de memoria, Decision Drills,
          laboratorios VirtualBox, transferencia a escenarios distintos, recomendaciones según evidencia y evaluación.
          Completed ≠ mastered.
        </p>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wide text-slate-500">Roadmap</p>
        <ol className="mt-2 space-y-1 font-mono text-xs text-slate-400">
          {V6_PHASES.map((p, i) => (
            <li key={p.id}>
              {i > 0 ? "↓ " : ""}
              Phase {p.n} — {p.titleEs}
            </li>
          ))}
        </ol>
      </div>

      <p className="text-xs text-slate-600">
        VirtualBox Host-Only. Alcance escrito.{" "}
        <Link href="/como-usar" className="text-slate-400 hover:text-red-400">
          Cómo usar
        </Link>
        {" · "}
        <Link href="/mapa" className="text-slate-400 hover:text-red-400">
          Skill map
        </Link>
      </p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 px-2 py-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-mono text-slate-200">{value}</dd>
    </div>
  );
}

"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { COURSE_LESSONS, nextIncomplete } from "@/content/course";
import { useCourse } from "@/lib/course/context";
import { ACADEMY_NAME } from "@/content/academy/program";
import { HONEST_HOURS } from "@/content/v6/hours";

export default function ComoUsarPage() {
  const { state } = useCourse();
  const next = nextIncomplete(state.lessons);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">Cómo usar</p>
        <h1 className="mt-2 text-2xl font-bold text-white">{ACADEMY_NAME}: una operación, no un feed</h1>
        <p className="mt-2 text-sm text-slate-400">
          Entra por Mission Control y pulsa Continue operation. No elijas entre 20 caminos. Lab solo en tus VMs. Ruta
          principal ~{HONEST_HOURS.primaryEstimated} h estimadas; catálogo ~{HONEST_HOURS.allCatalogEstimated} h. INE
          certifica; aquí estudias.
        </p>
      </div>

      <ol className="space-y-4">
        <HowStep n={1} title="Mission Control → Continue operation">
          <Link href="/" className="text-amber-400 underline">
            Home
          </Link>{" "}
          te dice qué hacer ahora. Energía baja = sesión corta; la ruta no cambia.
          <Link href={`/clase/${next.id}`} className="mt-2 block text-amber-400 underline">
            Ahora: {next.titleEs}
          </Link>
        </HowStep>
        <HowStep n={2} title="Think → enumerate → decide → act → verify → document">
          Cada jornada pregunta algo. El comando es la consecuencia, no el temario.
        </HowStep>
        <HowStep n={3} title="Ciclo de la jornada">
          Teoría → examen corto ≥70% → ejemplos → tu práctica en VirtualBox → taller de profundización.
        </HowStep>
        <HowStep n={4} title="Si falla un fundamento">
          Verás PREREQUISITE MISSING. El contenido futuro sigue visible; lo recomendado es el fundamento.
        </HowStep>
        <HowStep n={5} title="Library / Workshops / Train / Review">
          Secundarios. Library = 2–12 min. Talleres = deep dive. Train y Recall atacan huecos, no otra ruta.
        </HowStep>
        <HowStep n={6} title="Día 7">
          Descanso, catch-up o skill débil. No hace falta contenido nuevo todos los días.
        </HowStep>
      </ol>

      <div className="rounded-xl border border-slate-800 p-4 text-sm text-slate-300">
        <p className="font-semibold text-white">Barra</p>
        <ul className="mt-2 space-y-1 text-slate-400">
          <li>
            <strong className="text-slate-200">Mission</strong> — qué hago ahora.
          </li>
          <li>
            <strong className="text-slate-200">Academy</strong> — {COURSE_LESSONS.length} jornadas en 14 fases.
          </li>
          <li>
            <strong className="text-slate-200">Lab</strong> — checkpoint VirtualBox / Host-Only.
          </li>
          <li>
            <strong className="text-slate-200">Train / Review / Exam</strong> — práctica, SRS, simulacros internos.
          </li>
          <li>
            <strong className="text-slate-200">Library / Workshops / Sources</strong> — secundario.
          </li>
        </ul>
      </div>
    </div>
  );
}

function HowStep({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <p className="text-xs font-semibold text-amber-400">Paso {n}</p>
      <p className="font-semibold text-white">{title}</p>
      <div className="mt-2 text-sm text-slate-300">{children}</div>
    </li>
  );
}

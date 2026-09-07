"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { COURSE_LESSONS, nextIncomplete } from "@/content/course";
import { useCourse } from "@/lib/course/context";
import { ACADEMY_HOURS, ACADEMY_NAME } from "@/content/academy/program";

export default function ComoUsarPage() {
  const { state } = useCourse();
  const next = nextIncomplete(state.lessons);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">Cómo usar</p>
        <h1 className="mt-2 text-2xl font-bold text-white">{ACADEMY_NAME} es un bootcamp, no un feed</h1>
        <p className="mt-2 text-sm text-slate-400">
          Una jornada al día (o el trozo que aguantes). Orden fijo. Lab solo en tus VMs. {Math.round(ACADEMY_HOURS.total)}{" "}
          horas planificadas; INE certifica, aquí estudias.
        </p>
      </div>

      <ol className="space-y-4">
        <HowStep n={1} title="Hoy → Seguir jornada">
          Entra por <Link href="/" className="text-emerald-400 underline">Hoy</Link>. No abras Academia entera.
          <Link href={`/clase/${next.id}`} className="mt-2 block text-emerald-400 underline">
            Ahora: {next.titleEs}
          </Link>
        </HowStep>
        <HowStep n={2} title="Lee la teoría (amplia)">
          Primero el texto de la clase, luego la ampliación del módulo. Sin esto el examen corto no sirve.
        </HowStep>
        <HowStep n={3} title="Examen corto ≥70%">
          Cinco preguntas. Si fallas, relee. No pases a ejemplos fingiendo.
        </HowStep>
        <HowStep n={4} title="Ejemplos paso a paso">
          Yo lo hago, tú miras (o sigues). Anota el esperado.
        </HowStep>
        <HowStep n={5} title="Tú practicas en VirtualBox">
          Kali es el SO de este PC. VirtualBox solo corre víctimas (Host-Only). Tapa los ejemplos. Nunca la Wi‑Fi de casa.
        </HowStep>
        <HowStep n={6} title="Taller de estudio">
          Clase escrita del tema (mecanismo + un experimento). La extensión larga está en{" "}
          <Link href="/talleres" className="text-emerald-400 underline">
            Talleres
          </Link>
          .
        </HowStep>
      </ol>

      <div className="rounded-xl border border-slate-800 p-4 text-sm text-slate-300">
        <p className="font-semibold text-white">Barra</p>
        <ul className="mt-2 space-y-1 text-slate-400">
          <li>
            <strong className="text-slate-200">Hoy</strong> — continuar el bootcamp.
          </li>
          <li>
            <strong className="text-slate-200">Academia</strong> — {COURSE_LESSONS.length} jornadas en 13 módulos.
          </li>
          <li>
            <strong className="text-slate-200">Lab</strong> — montar VirtualBox / DVWA.
          </li>
          <li>
            <strong className="text-slate-200">Talleres</strong> — extensión escrita ({ACADEMY_HOURS.talleres} h).
          </li>
          <li>
            <strong className="text-slate-200">Práctica</strong> — drills y focus cortos.
          </li>
          <li>
            <strong className="text-slate-200">Exámenes</strong> — semanales y simulacros.
          </li>
          <li>
            <strong className="text-slate-200">Progreso</strong> — horas y backup.
          </li>
        </ul>
      </div>
    </div>
  );
}

function HowStep({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <p className="text-xs font-semibold text-emerald-400">Paso {n}</p>
      <p className="font-semibold text-white">{title}</p>
      <div className="mt-2 text-sm text-slate-300">{children}</div>
    </li>
  );
}

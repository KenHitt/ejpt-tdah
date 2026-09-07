"use client";

import Link from "next/link";
import { COURSE_LESSONS, COURSE_WEEKS, lessonsForWeek, nextIncomplete } from "@/content/course";
import { ACADEMY_HOURS, ACADEMY_NAME, ACADEMY_STATS, ACADEMY_TAGLINE, hoursFromLessons } from "@/content/academy/program";
import { useCourse } from "@/lib/course/context";

export default function CampusHomePage() {
  const { state } = useCourse();
  const doneCount = Object.keys(state.lessons).length;
  const next = nextIncomplete(state.lessons);
  const weekMeta = COURSE_WEEKS.find((w) => w.week === next.week);
  const weekLessons = lessonsForWeek(next.week);
  const weekDone = weekLessons.filter((l) => state.lessons[l.id]).length;
  const hoursDone = hoursFromLessons(doneCount);
  const pct = Math.round((doneCount / COURSE_LESSONS.length) * 100);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">Bootcamp</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">{ACADEMY_NAME}</h1>
        <p className="mt-2 text-slate-300">{ACADEMY_TAGLINE}</p>
      </div>

      <section className="rounded-2xl border border-emerald-700/60 bg-gradient-to-br from-emerald-950/80 to-slate-950 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">Continuar</p>
        <p className="mt-2 font-mono text-[11px] text-slate-400">
          Módulo {next.week + 1}/{ACADEMY_STATS.modules}
          {weekMeta ? ` · ${weekMeta.titleEs}` : ""} · jornada {weekDone}/{weekLessons.length}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-white">{next.titleEs}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Teoría → examen corto → ejemplos paso a paso → tú en VirtualBox → taller de estudio escrito.
        </p>
        <Link
          href={`/clase/${next.id}`}
          className="mt-6 block rounded-xl bg-emerald-600 py-4 text-center text-lg font-bold text-white hover:bg-emerald-500"
        >
          Seguir jornada
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="Planificado" value={`${Math.round(ACADEMY_HOURS.total)} h`} hint={`${ACADEMY_HOURS.nucleo} h núcleo`} />
        <Stat label="Hechas" value={`${hoursDone} h`} hint={`${doneCount}/${COURSE_LESSONS.length} jornadas · ${pct}%`} />
        <Stat label="Racha" value={`${state.streak} d`} hint="Una jornada bien cerrada" />
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <CampusCard href="/clase" title="Academia" body="13 módulos, 78 jornadas de 10 h. La ruta principal del bootcamp." />
        <CampusCard href="/laboratorio" title="Laboratorio" body="Kali en este PC. VirtualBox = víctimas Host-Only. DVWA en localhost." />
        <CampusCard href="/talleres" title="Talleres" body={`${ACADEMY_STATS.talleres} estudios escritos (Nmap, SMB, web, post…). Extensión del núcleo.`} />
        <CampusCard href="/simulacro" title="Exámenes" body="Examen semanal, skill-checks y simulacros cronometrados." />
      </section>

      <p className="text-center text-xs text-slate-600">
        Núcleo {ACADEMY_HOURS.nucleo} h · talleres {ACADEMY_HOURS.talleres} h · biblioteca {ACADEMY_HOURS.biblioteca} h.
        Esta academia no es INE: aquí estudias; ellos certifican.
      </p>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function CampusCard({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href} className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 hover:border-emerald-700">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{body}</p>
    </Link>
  );
}

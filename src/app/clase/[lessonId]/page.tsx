"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { COURSE_LESSONS, COURSE_WEEKS, getLesson } from "@/content/course";
import { getWorkshop } from "@/content/academy/workshops";
import { ClickQuiz } from "@/components/course/ClickQuiz";
import { TallerBlock } from "@/components/course/TallerBlock";
import { WorkedExample } from "@/components/course/WorkedExample";
import { PrereqBanner } from "@/components/v6/PrereqBanner";
import { useCourse } from "@/lib/course/context";
import { estimateLessonBreakdown } from "@/content/v6/hours";
import { lessonLinkedSkill, workshopWhen } from "@/content/v6/relations";
import { getPhase } from "@/content/v6/phases";

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const lesson = getLesson(params.lessonId);
  const { markLesson, state } = useCourse();
  const rec = state.lessons[params.lessonId];
  const [quizPct, setQuizPct] = useState<number | null>(rec?.quizPct ?? null);
  const [labDone, setLabDone] = useState(Boolean(rec?.labDone));
  const [examplesDone, setExamplesDone] = useState(Boolean(rec?.examplesDone));
  const [tallerDone, setTallerDone] = useState(Boolean(rec?.tallerDone || rec?.githubDone));

  const idx = useMemo(() => COURSE_LESSONS.findIndex((l) => l.id === params.lessonId), [params.lessonId]);
  const prev = idx > 0 ? COURSE_LESSONS[idx - 1] : null;
  const next = idx >= 0 && idx < COURSE_LESSONS.length - 1 ? COURSE_LESSONS[idx + 1] : null;
  const moduleMeta = COURSE_WEEKS.find((w) => w.week === lesson?.week);
  const skill = lesson ? lessonLinkedSkill(lesson.id) : undefined;
  const phase = skill ? getPhase(skill.phaseId) : undefined;
  const breakdown = lesson ? estimateLessonBreakdown(lesson) : null;

  const talleres = useMemo(() => {
    if (!lesson) return [];
    return lesson.tallerIds.map((id) => getWorkshop(id)).filter((w): w is NonNullable<typeof w> => Boolean(w));
  }, [lesson]);

  if (!lesson || !breakdown) {
    return (
      <Link href="/clase" className="text-emerald-400">
        Academia
      </Link>
    );
  }

  const canMark = quizPct !== null && quizPct >= 70 && examplesDone && labDone && tallerDone;
  const phases = [
    { id: "teoria", label: "1. Teoría", detail: `~${breakdown.theory} min` },
    { id: "examen", label: "2. Examen corto", detail: `~${breakdown.quiz} min` },
    { id: "ejemplos", label: "3. Ejemplos", detail: `~${breakdown.guided} min` },
    { id: "practica", label: "4. Práctica", detail: `~${breakdown.lab} min` },
    { id: "taller", label: "5. Taller", detail: `~${breakdown.taller} min` },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link href="/clase" className="text-xs text-slate-500 hover:text-amber-400">
          ← Academia
        </Link>
        <p className="mt-2 text-xs font-medium text-amber-400">
          {phase ? `Fase ${phase.n} · ${phase.titleEs}` : `Módulo ${(lesson.week + 1).toString().padStart(2, "0")}`} ·{" "}
          {moduleMeta?.titleEs} · jornada {lesson.day} · ~{breakdown.total} min (estimado)
        </p>
        <h1 className="mt-1 text-3xl font-bold text-white">{lesson.titleEs}</h1>
        {skill && <p className="mt-2 text-sm text-slate-300">{skill.whyEs}</p>}
        {skill && (
          <Link href={`/master/${skill.id}`} className="mt-2 inline-block text-xs text-amber-400 hover:underline">
            Master this skill · {skill.titleEs}
          </Link>
        )}
      </div>

      <PrereqBanner skillId={skill?.id} />

      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {phases.map((p) => (
          <li key={p.id} className="rounded-lg border border-slate-800 px-2 py-2 text-center">
            <p className="text-[10px] font-medium text-slate-400">{p.label}</p>
            <p className="text-[11px] text-amber-300">{p.detail}</p>
          </li>
        ))}
      </ol>
      <p className="text-[11px] text-slate-500">Tiempos estimados según el material de esta jornada, no 10 h fijas.</p>

      <section className="space-y-3">
        <Phase n={1} title="Teoría" time={`~${breakdown.theory} min`} />
        {lesson.read.map((s) => (
          <article key={s.h} className="rounded-xl border border-slate-700 p-4">
            <p className="text-xs font-semibold text-red-400">{s.h}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-100">{s.p}</p>
          </article>
        ))}
        {lesson.theoryExtra.map((s) => (
          <article key={s.h} className="rounded-xl border border-sky-900/50 bg-sky-500/5 p-4">
            <p className="text-xs font-semibold text-sky-400">Ampliación · {s.h}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-100">{s.p}</p>
          </article>
        ))}
      </section>

      <section className="space-y-2">
        <Phase n={2} title="Examen corto" time={`~${breakdown.quiz} min`} />
        <p className="text-sm text-slate-400">Después de la teoría. ≥70% para cerrar la jornada.</p>
        <ClickQuiz key={lesson.id} items={lesson.quiz} onGraded={setQuizPct} />
      </section>

      <section className="space-y-3">
        <Phase n={3} title="Ejemplos paso a paso" time={`~${breakdown.guided} min`} />
        <p className="text-sm text-slate-400">Síguelos. La fase 4 es cuando lo haces tú sin mirar.</p>
        {lesson.examples.map((ex, i) => (
          <WorkedExample key={ex.title} example={ex} index={i} />
        ))}
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={examplesDone} onChange={(e) => setExamplesDone(e.target.checked)} />
          Seguí los ejemplos (o los reescribí en papel)
        </label>
      </section>

      <section className="rounded-xl border-2 border-amber-800 p-4">
        <Phase n={4} title={`Tú practicas · ${lesson.labTitle}`} time={`~${breakdown.lab} min (estimado)`} />
        <p className="mt-2 text-sm text-slate-300">{lesson.practiceHint}</p>
        <p className="mt-2 text-xs text-amber-200">
          Tapa los ejemplos. Host-Only, DVWA localhost, o VPN INE. Nunca Wi‑Fi de casa. El lab puede alargarse.
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-200">
          {lesson.labSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={labDone} onChange={(e) => setLabDone(e.target.checked)} />
          Hice yo la práctica (o el equivalente de papel)
        </label>
      </section>

      <section className="space-y-3">
        <Phase n={5} title="Taller de profundización" time={`~${breakdown.taller} min`} />
        <p className="text-sm text-slate-400">
          Extensión de esta jornada, no una segunda ruta. Si quieres más del mismo tema, abre Talleres.
        </p>
        {talleres.map((w) => {
          const meta = workshopWhen(w.id);
          return (
            <div key={w.id} className="space-y-2">
              <p className="text-[11px] text-slate-500">
                Related skill: {meta.relatedSkillTitle} · After: {meta.recommendedAfter} · ~{meta.deepMin} min
              </p>
              <TallerBlock workshop={w} />
            </div>
          );
        })}
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={tallerDone} onChange={(e) => setTallerDone(e.target.checked)} />
          Completé el taller (teoría + un experimento de lab)
        </label>
      </section>

      <button
        type="button"
        disabled={!canMark}
        onClick={() =>
          markLesson(lesson.id, {
            at: new Date().toISOString(),
            quizPct: quizPct ?? 0,
            labDone: true,
            examplesDone: true,
            tallerDone: true,
          })
        }
        className="w-full rounded-xl bg-amber-500 py-3 font-bold text-black hover:bg-amber-400 disabled:opacity-40"
      >
        {rec ? "Actualizar jornada" : "Marcar jornada completa"}
      </button>
      {!canMark && (
        <p className="text-center text-xs text-slate-500">
          Cierra: examen ≥70%, ejemplos, tu práctica y el taller.
        </p>
      )}
      {rec && <p className="text-center text-sm text-emerald-300">{lesson.pep}</p>}
      <div className="flex justify-between text-sm">
        {prev ? (
          <Link href={`/clase/${prev.id}`} className="text-slate-400">
            ← {prev.titleEs}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/clase/${next.id}`} className="text-amber-400">
            {next.titleEs} →
          </Link>
        ) : (
          <Link href={`/clase/examen/w${lesson.week}`} className="text-amber-300">
            Examen del módulo →
          </Link>
        )}
      </div>
    </div>
  );
}

function Phase({ n, title, time }: { n: number; title: string; time: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      <span className="text-amber-400">{n}</span> · {title} · {time}
    </p>
  );
}

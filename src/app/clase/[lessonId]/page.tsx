"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { COURSE_LESSONS, getLesson } from "@/content/course";
import { ClickQuiz } from "@/components/course/ClickQuiz";
import { useCourse } from "@/lib/course/context";

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const lesson = getLesson(params.lessonId);
  const { markLesson, state } = useCourse();
  const [quizPct, setQuizPct] = useState<number | null>(state.lessons[params.lessonId]?.quizPct ?? null);
  const [labDone, setLabDone] = useState(Boolean(state.lessons[params.lessonId]?.labDone));
  const rec = state.lessons[params.lessonId];

  const idx = useMemo(() => COURSE_LESSONS.findIndex((l) => l.id === params.lessonId), [params.lessonId]);
  const prev = idx > 0 ? COURSE_LESSONS[idx - 1] : null;
  const next = idx >= 0 && idx < COURSE_LESSONS.length - 1 ? COURSE_LESSONS[idx + 1] : null;

  if (!lesson) {
    return (
      <Link href="/clase" className="text-emerald-400">
        CLASE
      </Link>
    );
  }

  const canMark = quizPct !== null && quizPct >= 70 && labDone;

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <Link href="/clase" className="text-xs text-slate-500">
        ← CLASE
      </Link>
      <p className="font-mono text-[10px] text-red-400">
        S{lesson.week} · DÍA {lesson.day} · {lesson.minutes} MIN · {lesson.track}
      </p>
      <h1 className="text-2xl font-bold text-white">{lesson.titleEs}</h1>
      <Link href={`/hub?w=${lesson.week}`} className="font-mono text-[11px] text-amber-300 underline">
        Hoyo GitHub de esta semana (timer)
      </Link>
      {lesson.read.map((s) => (
        <section key={s.h} className="rounded-md border-2 border-slate-600 p-3">
          <p className="font-mono text-[10px] text-red-400">{s.h}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-100">{s.p}</p>
        </section>
      ))}
      <section className="space-y-2">
        <p className="font-mono text-[10px] text-amber-400">EXAMEN DE CLASE · marca una</p>
        <ClickQuiz key={lesson.id} items={lesson.quiz} onGraded={setQuizPct} />
      </section>
      <section className="rounded-md border border-slate-800 p-3">
        <p className="font-mono text-[10px] text-emerald-400">LAB · {lesson.labTitle}</p>
        <p className="mt-1 text-[11px] text-slate-500">
          Solo VirtualBox Host-Only, DVWA en localhost, o el rango VPN de INE. Nunca Wi‑Fi de casa ni terceros.
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-slate-200">
          {lesson.labSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={labDone} onChange={(e) => setLabDone(e.target.checked)} />
          Hice el lab (o el equivalente de papel si el lab no aplica hoy)
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
          })
        }
        className="w-full rounded-md bg-red-600 py-3 font-bold text-white hover:bg-red-500 disabled:opacity-40"
      >
        {rec ? "Ya marcada · actualizar" : "Marcar clase completa"}
      </button>
      {!canMark && (
        <p className="text-center text-xs text-slate-500">Necesitas ≥70% en el examen de 5 y el check del lab.</p>
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
          <Link href={`/clase/${next.id}`} className="text-emerald-400">
            {next.titleEs} →
          </Link>
        ) : (
          <Link href={`/clase/examen/w${lesson.week}`} className="text-amber-300">
            Examen semanal →
          </Link>
        )}
      </div>
    </div>
  );
}

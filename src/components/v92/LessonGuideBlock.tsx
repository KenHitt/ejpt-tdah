import Link from "next/link";
import { COURSE_LESSONS } from "@/content/course";
import { LEARN_ARTICLES } from "@/content/learn-articles";
import { LessonGuide } from "@/content/v92/types";

export function LessonGuideBlock({ guide }: { guide: LessonGuide }) {
  const learn = (guide.prereqLearnIds ?? [])
    .map((id) => LEARN_ARTICLES.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const prevLessons = (guide.prereqLessonIds ?? [])
    .map((id) => COURSE_LESSONS.find((x) => x.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <div className="space-y-3 rounded-xl border border-red-900/50 bg-red-500/5 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-red-400">Guía de la jornada · no sustituye la teoría</p>
      {guide.learnGoal && (
        <p className="text-sm text-slate-100">
          <span className="text-red-300">Qué vas a aprender. </span>
          {guide.learnGoal}
        </p>
      )}
      {guide.whyMatters && (
        <p className="text-sm text-slate-100">
          <span className="text-red-300">Por qué importa. </span>
          {guide.whyMatters}
        </p>
      )}

      {(learn.length > 0 || prevLessons.length > 0) && (
        <div>
          <p className="text-xs font-semibold text-slate-400">Antes de continuar</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-200">
            {prevLessons.map((l) => (
              <li key={l.id}>
                <Link href={`/clase/${l.id}`} className="text-red-400 hover:underline">
                  {l.titleEs}
                </Link>
              </li>
            ))}
            {learn.map((a) => (
              <li key={a.id}>
                <Link href={`/learn/${a.id}`} className="text-red-400 hover:underline">
                  {a.titleEs}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!!guide.terms?.length && (
        <div>
          <p className="text-xs font-semibold text-slate-400">Términos de esta jornada</p>
          <ul className="mt-2 space-y-2">
            {guide.terms.map((t) => (
              <li key={t.term} className="rounded-lg border border-slate-800 p-2">
                <p className="text-sm font-medium text-white">{t.term}</p>
                <p className="text-sm text-slate-200">{t.def}</p>
                {t.purpose && <p className="mt-1 text-xs text-slate-400">Para qué: {t.purpose}</p>}
                {t.href && (
                  <Link href={t.href} className="text-xs text-red-400 hover:underline">
                    Más profundidad
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!!guide.commands?.length && (
        <div>
          <p className="text-xs font-semibold text-slate-400">Comandos: qué / cuándo / qué esperar</p>
          <ul className="mt-2 space-y-2">
            {guide.commands.map((c) => (
              <li key={c.fragment} className="rounded-lg border border-slate-800 p-2 font-mono text-[13px]">
                <p className="text-emerald-300">{c.fragment}</p>
                <p className="mt-1 font-sans text-sm text-slate-200">{c.what}</p>
                <p className="font-sans text-xs text-slate-400">Cuándo: {c.when}</p>
                <p className="font-sans text-xs text-slate-400">Esperado: {c.expect}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!!guide.checkpoints?.length && (
        <ol className="space-y-1 text-sm text-slate-200">
          {guide.checkpoints.map((c, i) => (
            <li key={c.h}>
              <span className="text-red-400">Checkpoint {i + 1} · {c.h}.</span> {c.p}
            </li>
          ))}
        </ol>
      )}

      {!!guide.lost?.length && (
        <div className="rounded-lg border border-amber-900/60 p-3">
          <p className="text-xs font-semibold text-amber-300">¿Te perdiste?</p>
          <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-slate-200">
            {guide.lost.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
        </div>
      )}

      {!!guide.errors?.length && (
        <div>
          <p className="text-xs font-semibold text-slate-400">Errores comunes</p>
          <ul className="mt-1 space-y-1 text-sm text-slate-200">
            {guide.errors.map((e) => (
              <li key={e.symptom}>
                <span className="text-amber-200">{e.symptom}.</span> {e.fix}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3 text-xs">
        {guide.decisionHref && (
          <Link href={guide.decisionHref} className="text-red-400 hover:underline">
            Decision drill
          </Link>
        )}
        <Link href="/memory" className="text-slate-400 hover:underline">
          SRS / memoria
        </Link>
        <Link href="/glosario" className="text-slate-400 hover:underline">
          Glosario
        </Link>
      </div>
    </div>
  );
}

export function LabBeforeBlock({ guide }: { guide: LessonGuide }) {
  if (!guide.labBefore?.length && !guide.verify?.length && !guide.prep?.length) return null;
  return (
    <div className="mb-3 space-y-2 rounded-lg border border-amber-800/80 bg-amber-500/5 p-3">
      <p className="text-xs font-semibold text-amber-200">Antes del laboratorio</p>
      {!!guide.prep?.length && (
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-200">
          {guide.prep.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      {!!guide.labBefore?.length && (
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-200">
          {guide.labBefore.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      )}
      {!!guide.verify?.length && (
        <p className="text-sm text-slate-300">
          <span className="text-amber-200">Cómo verifico. </span>
          {guide.verify.join(" ")}
        </p>
      )}
      {guide.independentHint && (
        <p className="text-sm text-slate-400">
          <span className="text-amber-200">Después (menos ayuda). </span>
          {guide.independentHint}
        </p>
      )}
    </div>
  );
}

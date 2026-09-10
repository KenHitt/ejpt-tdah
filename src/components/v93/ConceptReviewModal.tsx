"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { ConceptLesson, DIAGNOSIS_LABEL } from "@/content/v93/concept-reviews";

export function ConceptReviewModal({
  lesson,
  onClose,
  showExample,
  onToggleExample,
}: {
  lesson: ConceptLesson | null;
  onClose: () => void;
  showExample?: boolean;
  onToggleExample?: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (lesson && !d.open) d.showModal();
    if (!lesson && d.open) d.close();
    document.body.style.overflow = lesson ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lesson]);

  const dismiss = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 m-auto max-h-[90vh] w-[min(36rem,calc(100%-1.5rem))] overflow-hidden rounded-xl border border-slate-700 bg-slate-950 p-0 text-slate-100 shadow-2xl backdrop:bg-black/75"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) dismiss();
      }}
    >
      {lesson && (
        <div className="flex max-h-[90vh] flex-col">
          <header className="border-b border-slate-800 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-red-400">
              Revisión contextual · no es la respuesta
            </p>
            <h2 id={titleId} className="text-lg font-semibold text-white">
              {lesson.titleEs}
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">Diagnóstico: {DIAGNOSIS_LABEL[lesson.diagnosis]}</p>
          </header>
          <div className="space-y-3 overflow-y-auto px-4 py-4 text-sm">
            <Block k="¿Qué necesitas saber?" p={lesson.needToKnow} />
            <Block k="¿Qué es?" p={lesson.what} />
            <Block k="¿Para qué sirve?" p={lesson.purpose} />
            <Block k="¿Por qué importa aquí?" p={lesson.whyHere} />
            <Block k="¿Cómo funciona?" p={lesson.how} />
            {lesson.example && (
              <div className="rounded-lg border border-slate-800 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-400">Ejemplo</p>
                <pre className="mt-1 overflow-x-auto font-mono text-[13px] text-emerald-300">{lesson.example}</pre>
                {lesson.exampleExplain && <p className="mt-2 text-slate-300">{lesson.exampleExplain}</p>}
              </div>
            )}
            {lesson.observe && <Block k="¿Qué deberías observar?" p={lesson.observe} />}
            {showExample && lesson.applied && <Block k="Ejemplo aplicado" p={lesson.applied} />}
            <div className="rounded-lg border border-amber-900/50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-300">Recuerda</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-200">
                {lesson.remember.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-slate-500">Esto no dice qué letra marcar. Vuelve y decide tú.</p>
            {lesson.deepenHref && (
              <p className="text-xs text-slate-500">
                Si hace falta más profundidad, cierra el examen si está cronometrado y usa{" "}
                <Link href={lesson.deepenHref} className="text-red-400 hover:underline">
                  Profundizar
                </Link>
                .
              </p>
            )}
          </div>
          <footer className="flex flex-wrap gap-2 border-t border-slate-800 px-4 py-3">
            {lesson.applied && onToggleExample && (
              <button
                type="button"
                onClick={onToggleExample}
                className="rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:border-red-600"
              >
                {showExample ? "Ocultar ejemplo extra" : "Ver ejemplo"}
              </button>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              Volver a la pregunta
            </button>
          </footer>
        </div>
      )}
    </dialog>
  );
}

function Block({ k, p }: { k: string; p: string }) {
  return (
    <section>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-400">{k}</p>
      <p className="mt-1 text-slate-200">{p}</p>
    </section>
  );
}

export function RevisarConceptoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-red-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-red-300 hover:bg-red-500/10"
    >
      Revisar concepto
    </button>
  );
}

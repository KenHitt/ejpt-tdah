import Link from "next/link";
import { SOURCE_CATALOG } from "@/content/v6/sources";
import { getSkill } from "@/content/v6/skills";
import { ACADEMY_WORKSHOPS } from "@/content/academy/workshops";

export default function FuentesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-red-400">Sources &amp; Provenance</p>
      <h1 className="text-3xl font-bold text-white">Sources &amp; Provenance</h1>
      <p className="text-sm text-slate-400">
        Cada recurso externo alimenta un taller escrito. El estudio ocurre en Talleres / jornadas, no en 40 pestañas.
        Respeta la licencia del autor. No copies dumps de examen.
      </p>
      <ul className="space-y-2">
        {SOURCE_CATALOG.map((s) => {
          const ws = ACADEMY_WORKSHOPS.find((w) => w.id === s.relatedWorkshopId);
          return (
            <li key={s.id} className="rounded-xl border border-slate-800 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-white">{s.titleEs}</p>
                <p className="font-mono text-[10px] text-slate-500">
                  {s.type} · {s.difficulty} · {s.topic}
                </p>
              </div>
              <p className="mt-1 text-sm text-slate-400">{s.whySelected}</p>
              <p className="mt-1 text-[11px] text-slate-500">
                License: {s.license} · Last reviewed: {s.lastReviewed}
              </p>
              {s.relatedSkills.length > 0 && (
                <p className="mt-1 text-[11px] text-slate-500">
                  Related skills:{" "}
                  {s.relatedSkills.map((id, i) => (
                    <span key={id}>
                      {i > 0 ? ", " : ""}
                      <Link href={`/master/${id}`} className="text-red-400">
                        {getSkill(id)?.titleEs ?? id}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                {ws && (
                  <Link href={`/talleres/${ws.id}`} className="text-red-400">
                    Estudiar en el Deep Dive
                  </Link>
                )}
                <a href={s.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-300">
                  Repositorio (atribución)
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

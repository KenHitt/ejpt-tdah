import { AcademyWorkshop } from "@/content/academy/workshops";
import { WorkedExample } from "@/components/course/WorkedExample";

export function TallerBlock({ workshop }: { workshop: AcademyWorkshop }) {
  return (
    <article className="space-y-4 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
        Taller · ~{workshop.hours} h · {workshop.track}
      </p>
      <h3 className="text-lg font-semibold text-white">{workshop.titleEs}</h3>
      {workshop.theory.map((s) => (
        <div key={s.h} className="rounded-md border border-slate-800 p-3">
          <p className="text-xs font-semibold text-sky-400">{s.h}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-200">{s.p}</p>
        </div>
      ))}
      <WorkedExample example={workshop.example} index={0} />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-400">Ahora tú · en el laboratorio</p>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-200">
          {workshop.practice.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>
      <p className="rounded-md border border-amber-800/50 bg-amber-500/5 p-3 text-sm leading-relaxed text-amber-100">
        {workshop.safety}
      </p>
    </article>
  );
}

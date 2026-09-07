import { AcademyWorkshop } from "@/content/academy/workshops";
import { WorkedExample } from "@/components/course/WorkedExample";

export function TallerBlock({ workshop }: { workshop: AcademyWorkshop }) {
  return (
    <article className="space-y-3 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
      <p className="font-mono text-[10px] text-emerald-400">
        TALLER · {workshop.hours} h · {workshop.track}
      </p>
      <h3 className="text-lg font-semibold text-white">{workshop.titleEs}</h3>
      {workshop.theory.map((s) => (
        <div key={s.h}>
          <p className="font-mono text-[10px] text-sky-400">{s.h}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-200">{s.p}</p>
        </div>
      ))}
      <WorkedExample example={workshop.example} index={0} />
      <div>
        <p className="font-mono text-[10px] text-emerald-400">AHORA TÚ · en el lab</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-200">
          {workshop.practice.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>
      <p className="rounded-md border border-amber-800/50 bg-amber-500/5 p-2 text-xs text-amber-100">{workshop.safety}</p>
    </article>
  );
}

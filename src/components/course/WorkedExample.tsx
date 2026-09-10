import { CourseExample } from "@/content/course/types";

export function WorkedExample({ example, index }: { example: CourseExample; index: number }) {
  return (
    <article className="rounded-lg border-2 border-sky-800/70 bg-slate-950/80 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-400">
        Ejemplo {index + 1} · síguelo antes de practicar tú
      </p>
      <h3 className="mt-1 text-base font-semibold text-white">{example.title}</h3>
      <div className="mt-3 rounded-md border border-slate-800 bg-slate-900/60 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Situación</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-200">{example.scene}</p>
      </div>
      <ol className="mt-4 list-decimal space-y-4 pl-5">
        {example.steps.map((s, i) => (
          <li key={`${i}-${s.do.slice(0, 40)}`} className="text-sm text-slate-100">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Qué haces</p>
            <p className="font-medium leading-relaxed text-white">{s.do}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Por qué</p>
            <p className="leading-relaxed text-slate-300">{s.why}</p>
          </li>
        ))}
      </ol>
      <p className="mt-3 rounded-md border border-emerald-800/50 bg-emerald-500/5 p-3 text-sm leading-relaxed text-emerald-100">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-400">Al terminar deberías poder </span>
        {example.expected}
      </p>
      <p className="mt-2 rounded-md border border-red-800/50 bg-red-500/5 p-3 text-sm leading-relaxed text-red-100">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-red-400">No hagas esto </span>
        {example.stop}
      </p>
    </article>
  );
}

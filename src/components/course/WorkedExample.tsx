import { CourseExample } from "@/content/course/types";

export function WorkedExample({ example, index }: { example: CourseExample; index: number }) {
  return (
    <article className="rounded-lg border-2 border-sky-800/70 bg-slate-950/80 p-4">
      <p className="font-mono text-[10px] text-sky-400">
        EJEMPLO {index + 1} · SÍGUELO ANTES DE PRACTICAR TÚ
      </p>
      <h3 className="mt-1 text-base font-semibold text-white">{example.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{example.scene}</p>
      <ol className="mt-3 list-decimal space-y-3 pl-5">
        {example.steps.map((s) => (
          <li key={s.do} className="text-sm text-slate-100">
            <p className="font-medium text-white">{s.do}</p>
            <p className="mt-0.5 text-slate-400">{s.why}</p>
          </li>
        ))}
      </ol>
      <p className="mt-3 rounded-md border border-emerald-800/50 bg-emerald-500/5 p-2 text-sm text-emerald-100">
        <span className="font-mono text-[10px] text-emerald-400">ESPERADO · </span>
        {example.expected}
      </p>
      <p className="mt-2 rounded-md border border-red-800/50 bg-red-500/5 p-2 text-sm text-red-100">
        <span className="font-mono text-[10px] text-red-400">STOP · </span>
        {example.stop}
      </p>
    </article>
  );
}

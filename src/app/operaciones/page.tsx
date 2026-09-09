"use client";

import Link from "next/link";
import { allOperations } from "@/content/v8/operations";
import { useCourse } from "@/lib/course/context";
import { LabCard, BossCard } from "@/components/cards";
import { PRIMARY_BUTTON } from "@/lib/design/tokens";

export default function OperacionesPage() {
  const { state } = useCourse();
  const machines = allOperations().filter((m) => m.kind === "machine");
  const bosses = allOperations().filter((m) => m.kind === "boss");
  const next = machines.find((m) => !state.exams[`op:${m.id}`]) ?? machines[0];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-red-400">Operations</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Internal machines</h1>
        <p className="mt-2 text-sm text-slate-400">
          Educational tabletop machines. They do not replace VirtualBox. You decide the next step — including not
          exploiting yet. Scope: your lab only.
        </p>
      </div>

      {next && (
        <LabCard
          titleEs={next.titleEs}
          objectiveEs={next.objectiveEs}
          href={`/operaciones/${next.id}`}
          relatedLessonEs="Red Team operation (guided reasoning)"
        />
      )}

      <Link href={`/operaciones/${next.id}`} className={PRIMARY_BUTTON}>
        START OPERATION
      </Link>

      <ol className="space-y-2">
        {machines.map((m) => {
          const done = state.exams[`op:${m.id}`];
          return (
            <li key={m.id}>
              <Link
                href={`/operaciones/${m.id}`}
                className="block rounded-xl border border-slate-800 p-4 hover:border-red-700"
              >
                <div className="flex justify-between gap-2">
                  <p className="font-semibold text-white">{m.titleEs}</p>
                  <span className="font-mono text-[11px] text-slate-500">
                    {done ? `${done.pct}%` : `~${m.estimatedMin} min`}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{m.objectiveEs}</p>
              </Link>
            </li>
          );
        })}
      </ol>

      <h2 className="text-lg font-semibold text-white">Bosses</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {bosses.map((b) => (
          <BossCard
            key={b.id}
            titleEs={b.titleEs}
            descriptionEs={b.objectiveEs}
            estimatedLabel={`~${b.estimatedMin} min`}
            href={`/operaciones/${b.id}`}
            status={state.exams[`op:${b.id}`] ? "completed" : "available"}
          />
        ))}
      </div>
    </div>
  );
}

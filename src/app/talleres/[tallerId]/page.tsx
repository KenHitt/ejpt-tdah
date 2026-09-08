"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ACADEMY_WORKSHOPS, getWorkshop } from "@/content/academy/workshops";
import { TallerBlock } from "@/components/course/TallerBlock";
import { PrereqBanner } from "@/components/v6/PrereqBanner";
import { workshopWhen } from "@/content/v6/relations";
import { skillStatus } from "@/lib/v6/mastery";
import { statusClass, statusLabel } from "@/lib/v6/status-ui";
import { useCourse } from "@/lib/course/context";
import { useProgress } from "@/lib/progress/context";

export default function TallerPage() {
  const params = useParams<{ tallerId: string }>();
  const workshop = getWorkshop(params.tallerId);
  const idx = ACADEMY_WORKSHOPS.findIndex((w) => w.id === params.tallerId);
  const prev = idx > 0 ? ACADEMY_WORKSHOPS[idx - 1] : null;
  const next = idx >= 0 && idx < ACADEMY_WORKSHOPS.length - 1 ? ACADEMY_WORKSHOPS[idx + 1] : null;
  const { state: course } = useCourse();
  const { state: progress } = useProgress();

  if (!workshop) {
    return (
      <Link href="/talleres" className="text-red-400">
        Deep Dives
      </Link>
    );
  }

  const meta = workshopWhen(workshop.id);
  const st = meta.skill ? skillStatus(meta.skill.id, course, progress) : "AVAILABLE";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p className="text-xs text-slate-600">
        <Link href="/learn" className="hover:text-red-400">
          Reference
        </Link>
        {" → "}
        <Link href="/talleres" className="hover:text-red-400">
          Deep Dives
        </Link>
        {" → "}
        <span className="text-slate-400">{workshop.titleEs}</span>
      </p>
      <p className="text-[11px] uppercase tracking-wide text-red-400">Deep dive</p>
      <h1 className="text-2xl font-bold text-white">{workshop.titleEs}</h1>
      <dl className="grid gap-2 rounded-xl border border-slate-800 p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-[10px] uppercase text-slate-500">Related skill</dt>
          <dd>
            {meta.skill ? (
              <Link href={`/master/${meta.skill.id}`} className="text-red-300">
                {meta.relatedSkillTitle}
              </Link>
            ) : (
              meta.relatedSkillTitle
            )}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase text-slate-500">When to study</dt>
          <dd className="text-slate-300">Después de {meta.recommendedAfter}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase text-slate-500">Prerequisites</dt>
          <dd className="text-slate-300">{meta.prereqTitles.length ? meta.prereqTitles.join(", ") : "Ninguno extra"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase text-slate-500">Used by</dt>
          <dd className="text-slate-300">{meta.usedBy}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase text-slate-500">Time</dt>
          <dd className="text-slate-300">
            ~{meta.deepMin} min deep (estimado) · scan ~{meta.scanMin} min
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase text-slate-500">Status</dt>
          <dd>
            <span className={`rounded-full px-2 py-0.5 text-[10px] ${statusClass(st)}`}>{statusLabel(st)}</span>
          </dd>
        </div>
      </dl>
      <PrereqBanner skillId={meta.skill?.id} />
      <TallerBlock workshop={workshop} />
      <p className="text-sm text-slate-400">
        Cuando termines, vuelve a la operación en Mission Control. Lab: solo tus VMs y localhost.
      </p>
      <div className="flex justify-between text-sm">
        {prev ? (
          <Link href={`/talleres/${prev.id}`} className="text-slate-400">
            ← {prev.titleEs}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/talleres/${next.id}`} className="text-red-400">
            {next.titleEs} →
          </Link>
        ) : (
          <Link href="/" className="text-red-400">
            Mission Control →
          </Link>
        )}
      </div>
    </div>
  );
}

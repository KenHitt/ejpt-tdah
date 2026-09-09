import Link from "next/link";
import { SURFACE, statusBadgeClass, statusLabelEn } from "@/lib/design/tokens";

export function BossCard({
  titleEs,
  descriptionEs,
  estimatedLabel,
  href,
  status = "available",
}: {
  titleEs: string;
  descriptionEs: string;
  estimatedLabel: string;
  href: string;
  status?: string;
}) {
  return (
    <Link href={href} className={`block ${SURFACE} p-4 hover:border-red-700`}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-red-400">Boss</p>
        <span className={`rounded-full px-2 py-0.5 text-[10px] ${statusBadgeClass(status)}`}>{statusLabelEn(status)}</span>
      </div>
      <p className="mt-1 font-bold text-white">{titleEs}</p>
      <p className="mt-1 text-sm text-slate-400">{descriptionEs}</p>
      <p className="mt-1 font-mono text-[11px] text-slate-500">{estimatedLabel} · skills not spoilered</p>
    </Link>
  );
}

export function LessonCard({
  titleEs,
  descriptionEs,
  href,
  status,
  timeLabel,
}: {
  titleEs: string;
  descriptionEs: string;
  href: string;
  status: string;
  timeLabel?: string;
}) {
  return (
    <Link href={href} className={`block ${SURFACE} p-3 hover:border-red-700`}>
      <p className="font-semibold text-white">{titleEs}</p>
      <p className="mt-1 text-sm text-slate-400">{descriptionEs}</p>
      <p className="mt-1 font-mono text-[11px] text-slate-500">
        {statusLabelEn(status)}
        {timeLabel ? ` · ${timeLabel}` : ""}
      </p>
    </Link>
  );
}

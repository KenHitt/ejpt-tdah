import Link from "next/link";
import { PRIMARY_BUTTON, SURFACE } from "@/lib/design/tokens";

export interface AssessmentCardProps {
  titleEs: string;
  descriptionEs: string;
  questionCount?: number;
  durationLabel?: string;
  disclaimerEs?: string;
  href: string;
  ctaLabel?: string;
}

/** Quiz / module test / mock exam (sección 26). */
export function AssessmentCard({
  titleEs,
  descriptionEs,
  questionCount,
  durationLabel,
  disclaimerEs,
  href,
  ctaLabel = "START ASSESSMENT",
}: AssessmentCardProps) {
  return (
    <div className={`${SURFACE} p-4`}>
      <p className="text-lg font-bold text-white">{titleEs}</p>
      <p className="mt-1 text-sm text-slate-400">{descriptionEs}</p>
      <div className="mt-2 flex flex-wrap gap-x-4 font-mono text-[11px] text-slate-500">
        {questionCount !== undefined && <span>{questionCount} questions</span>}
        {durationLabel && <span>{durationLabel}</span>}
      </div>
      {disclaimerEs && <p className="mt-2 text-[11px] text-amber-300">{disclaimerEs}</p>}
      <Link href={href} className={`${PRIMARY_BUTTON} mt-4`}>
        {ctaLabel}
      </Link>
    </div>
  );
}

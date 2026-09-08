import Link from "next/link";
import { SURFACE, statusBadgeClass, statusLabelEn } from "@/lib/design/tokens";

export interface ChallengeCardProps {
  titleEs: string;
  descriptionEs: string;
  estimatedLabel: string;
  status: string;
  href: string;
}

/** Decision drill / timed challenge (sección 8/33). */
export function ChallengeCard({ titleEs, descriptionEs, estimatedLabel, status, href }: ChallengeCardProps) {
  return (
    <Link href={href} className={`block ${SURFACE} p-4 hover:border-red-700`}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-semibold text-white">{titleEs}</p>
        <span className={`rounded-full px-2 py-0.5 text-[10px] ${statusBadgeClass(status)}`}>{statusLabelEn(status)}</span>
      </div>
      <p className="mt-1 text-sm text-slate-400">{descriptionEs}</p>
      <p className="mt-1 font-mono text-[11px] text-slate-500">{estimatedLabel}</p>
    </Link>
  );
}

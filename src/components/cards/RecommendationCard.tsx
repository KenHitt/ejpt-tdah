import Link from "next/link";
import { PRIMARY_BUTTON } from "@/lib/design/tokens";

export interface RecommendationCardProps {
  titleEs: string;
  whyEs: string;
  whyBullets?: string[];
  estimatedLabel: string;
  href: string;
  ctaLabel?: string;
}

/** Recomendación única al final del Dashboard / Review (sección 56). */
export function RecommendationCard({
  titleEs,
  whyEs,
  whyBullets,
  estimatedLabel,
  href,
  ctaLabel = "START REVIEW",
}: RecommendationCardProps) {
  return (
    <section className="rounded-xl border-2 border-red-700 bg-slate-950 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-red-400">Recommended next step</p>
      <p className="mt-2 text-lg font-bold text-white">{titleEs}</p>
      {whyBullets?.length ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
          {whyBullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-slate-400">{whyEs}</p>
      )}
      <p className="mt-1 font-mono text-[11px] text-slate-500">{estimatedLabel}</p>
      <Link href={href} className={`${PRIMARY_BUTTON} mt-4`}>
        {ctaLabel}
      </Link>
    </section>
  );
}

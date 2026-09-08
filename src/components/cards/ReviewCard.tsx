import Link from "next/link";
import { SURFACE, WARNING } from "@/lib/design/tokens";

export interface ReviewCardProps {
  titleEs: string;
  reasonEs: string;
  priority: "high" | "medium" | "low";
  estimatedMin?: number;
  href: string;
}

const PRIORITY_LABEL: Record<ReviewCardProps["priority"], string> = {
  high: "PRIORITY REVIEW",
  medium: "REVIEW DUE",
  low: "QUICK REVIEW",
};

/** Card de item de repaso, generado por errores reales (sección 20). */
export function ReviewCard({ titleEs, reasonEs, priority, estimatedMin, href }: ReviewCardProps) {
  return (
    <Link href={href} className={`block ${SURFACE} p-4 hover:border-red-700`}>
      <div className="flex items-baseline justify-between gap-2">
        <p className={`text-[10px] font-semibold uppercase tracking-wide ${priority === "high" ? "text-red-400" : WARNING.text}`}>
          {PRIORITY_LABEL[priority]}
        </p>
        {estimatedMin && <span className="font-mono text-[11px] text-slate-500">~{estimatedMin} min</span>}
      </div>
      <p className="mt-1 font-semibold text-white">{titleEs}</p>
      <p className="mt-1 text-sm text-slate-400">{reasonEs}</p>
    </Link>
  );
}

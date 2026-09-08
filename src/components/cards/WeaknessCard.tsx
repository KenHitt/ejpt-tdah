import Link from "next/link";
import { CRITICAL, WARNING } from "@/lib/design/tokens";

export interface WeaknessCardProps {
  titleEs: string;
  priority: "high" | "medium";
  signals: string[];
  mainIssueEs: string;
  href: string;
}

/** "AREAS TO IMPROVE" en Dashboard (sección 19). */
export function WeaknessCard({ titleEs, priority, signals, mainIssueEs, href }: WeaknessCardProps) {
  const tone = priority === "high" ? CRITICAL : WARNING;
  return (
    <div className={`rounded-xl border p-4 ${tone.border} ${tone.soft}`}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-bold text-white">{titleEs}</p>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${tone.text}`}>
          {priority === "high" ? "High priority" : "Medium priority"}
        </span>
      </div>
      <ul className="mt-2 space-y-0.5 text-sm text-slate-300">
        {signals.map((s) => (
          <li key={s}>· {s}</li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] text-slate-400">
        <span className="uppercase text-slate-500">Main issue</span> · {mainIssueEs}
      </p>
      <Link href={href} className={`mt-3 block rounded-lg py-2 text-center text-sm font-bold text-white bg-red-600 hover:bg-red-500`}>
        REVIEW NOW
      </Link>
    </div>
  );
}

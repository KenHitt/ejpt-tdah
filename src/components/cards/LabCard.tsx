import Link from "next/link";
import { SURFACE } from "@/lib/design/tokens";

export interface LabCardProps {
  titleEs: string;
  relatedLessonEs?: string;
  objectiveEs: string;
  href: string;
  status?: "available" | "done" | "pending";
}

/** Lab conectado a Academy (sección 37). */
export function LabCard({ titleEs, relatedLessonEs, objectiveEs, href, status = "available" }: LabCardProps) {
  return (
    <div className={`${SURFACE} p-4`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-red-400">
        {status === "done" ? "Lab complete" : "Current lab"}
      </p>
      <p className="mt-1 text-lg font-bold text-white">{titleEs}</p>
      {relatedLessonEs && (
        <p className="mt-1 text-[11px] text-slate-500">
          <span className="uppercase">Related lesson</span> · {relatedLessonEs}
        </p>
      )}
      <p className="mt-2 text-sm text-slate-400">{objectiveEs}</p>
      <Link href={href} className="mt-3 block rounded-lg bg-red-600 py-2 text-center text-sm font-bold text-white hover:bg-red-500">
        {status === "done" ? "CONTINUE" : "OPEN LAB"}
      </Link>
    </div>
  );
}

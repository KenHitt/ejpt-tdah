"use client";

import Link from "next/link";
import { getSkill } from "@/content/v6/skills";
import { skillStatus } from "@/lib/v6/mastery";
import { useCourse } from "@/lib/course/context";
import { useProgress } from "@/lib/progress/context";
import { StayLink } from "@/components/v92/LessonStaySheet";

export function PrereqBanner({ skillId, stayInLesson }: { skillId?: string; stayInLesson?: boolean }) {
  const { state: course } = useCourse();
  const { state: progress } = useProgress();
  const skill = skillId ? getSkill(skillId) : undefined;
  if (!skill?.prereqIds.length) return null;

  const missing = skill.prereqIds.filter((id) => skillStatus(id, course, progress) === "LOCKED");
  if (!missing.length) return null;

  const first = getSkill(missing[0]);
  const href = first?.lessonIds[0] ? `/clase/${first.lessonIds[0]}` : `/master/${missing[0]}`;

  return (
    <div className="rounded-xl border border-amber-700/70 bg-amber-950/30 p-4 text-sm">
      <p className="font-semibold text-amber-300">PREREQUISITE MISSING</p>
      <p className="mt-1 text-slate-300">
        {skill.titleEs} pide {missing.map((id) => getSkill(id)?.titleEs ?? id).join(", ")}. El contenido sigue visible;
        no es lo recomendado ahora.
      </p>
      {stayInLesson ? (
        <StayLink href={href} className="mt-2 inline-block text-amber-400 underline">
          Ver fundamento (aquí) → {first?.titleEs ?? missing[0]}
        </StayLink>
      ) : (
        <Link href={href} className="mt-2 inline-block text-amber-400 underline">
          Ir al fundamento → {first?.titleEs ?? missing[0]}
        </Link>
      )}
    </div>
  );
}

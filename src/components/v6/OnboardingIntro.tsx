import Link from "next/link";
import { PRIMARY_BUTTON } from "@/lib/design/tokens";

/**
 * V7 sección 48 — Onboarding breve para usuarios nuevos. Se muestra solo
 * cuando no hay ninguna jornada completada; no repite 15 instrucciones.
 */
export function OnboardingIntro({ firstLessonHref }: { firstLessonHref: string }) {
  return (
    <section className="rounded-2xl border-2 border-red-700/60 bg-slate-950 p-6 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-red-400">Welcome to eJPT Academy</p>
      <p className="mt-3 text-sm text-slate-300">This system trains you through:</p>
      <p className="mt-2 font-mono text-xs text-slate-400">LEARN → PRACTICE → DECIDE → EXECUTE → TRANSFER → REVIEW</p>
      <p className="mt-4 text-lg font-bold text-white">Your first mission: Lab Setup</p>
      <Link href={firstLessonHref} className={`${PRIMARY_BUTTON} mt-4`}>
        START
      </Link>
    </section>
  );
}

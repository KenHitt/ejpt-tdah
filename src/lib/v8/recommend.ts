import { ProgressState } from "@/lib/progress/state";
import { CourseState } from "@/lib/course/storage";
import { listWeaknesses } from "@/lib/trainer/adaptive";
import { skillWeaknesses } from "@/lib/v6/weakness";
import { drillsForSkill } from "@/content/v8/drills";

export interface NextRec {
  titleEs: string;
  whyEs: string;
  href: string;
  estimatedLabel: string;
}

/**
 * Tras una actividad: review / speed / independent retry / guided / mixed.
 * No inventa skills débiles sin evidencia.
 */
export function recommendAfterActivity(course: CourseState, progress: ProgressState): NextRec {
  const weak = skillWeaknesses(course, progress)[0];
  const list = listWeaknesses(progress);
  const critical = list.find((w) => w.severity === "critical") ?? list[0];
  const hints = Object.values(progress.trainer?.hintLevelByKey ?? {}).reduce((n, v) => n + v, 0);
  const recent = (progress.trainer?.attempts ?? []).slice(-8);
  const recentWrong = recent.filter((a) => !a.correct).length;
  const recentOkHints = recent.filter((a) => a.correct && (a.hintsUsed ?? 0) > 0).length;

  if (critical) {
    return {
      titleEs: critical.labelEs,
      whyEs: `Repeated / open weakness: ${critical.whyEs}`,
      href: critical.href,
      estimatedLabel: "~15 min review",
    };
  }
  if (weak) {
    const drill = drillsForSkill(weak.skillId)[0];
    return {
      titleEs: `${weak.titleEs} decision drill`,
      whyEs: weak.mainIssueEs,
      href: drill ? `/train/decisions` : `/master/${weak.skillId}`,
      estimatedLabel: "~15 min",
    };
  }
  if (recentOkHints >= 2) {
    return {
      titleEs: "Independent retry",
      whyEs: "Acertaste con pistas. Repite sin HINT 5.",
      href: "/train/5min",
      estimatedLabel: "5–10 min",
    };
  }
  if (hints >= 8) {
    return {
      titleEs: "Guided lesson of the current skill",
      whyEs: "Alto uso de pistas. Vuelve a la jornada, no al spoiler.",
      href: "/",
      estimatedLabel: "~20 min",
    };
  }
  if (recentWrong === 0 && recent.length >= 4) {
    return {
      titleEs: "Mixed scenario / machine",
      whyEs: "Señales fuertes recientes. Mezcla skills (Operations).",
      href: "/operaciones",
      estimatedLabel: "30–60 min",
    };
  }
  return {
    titleEs: "SRS due or 5-min drill",
    whyEs: "Sin huecos abiertos: mantenimiento.",
    href: "/memory",
    estimatedLabel: "5 min",
  };
}

export function randomOperationHref(progress: ProgressState): string {
  const w = listWeaknesses(progress)[0];
  if (w?.href) return w.href;
  const ops = ["/operaciones/m01", "/operaciones/m02", "/operaciones/m04", "/train/whats-next", "/train/decisions"];
  return ops[Math.floor(Math.random() * ops.length)];
}

import { CourseState } from "@/lib/course/storage";
import { ProgressState } from "@/lib/progress/state";
import { COMMAND_BANK } from "@/content/command-bank";
import { dueCommands, listWeaknesses } from "@/lib/trainer/adaptive";
import { diagnoseFailure } from "@/lib/v9/diagnose";
import { V6_SKILLS } from "@/content/v6/skills";
import { skillWeaknesses } from "@/lib/v6/weakness";

export interface ReviewQueueItem {
  titleEs: string;
  reasonEs: string;
  priority: "high" | "medium" | "low";
  estimatedMin: number;
  href: string;
}

export function calculateReviewPriority(course: CourseState, progress: ProgressState): ReviewQueueItem[] {
  const items: ReviewQueueItem[] = [];
  const due = dueCommands(progress);
  const attempts = progress.trainer?.attempts ?? [];

  for (const w of listWeaknesses(progress).filter((x) => x.severity === "critical")) {
    const skill = V6_SKILLS.find((s) => s.subtopicIds.includes(w.id) || w.href.includes(s.id));
    const dx = skill ? diagnoseFailure(skill.id, course, progress) : null;
    items.push({
      titleEs: w.labelEs,
      reasonEs: dx ? `${dx.failure.replaceAll("_", " ")} · ${dx.evidenceEs}` : w.whyEs,
      priority: "high",
      estimatedMin: 12,
      href: w.href,
    });
  }

  for (const sw of skillWeaknesses(course, progress).slice(0, 3)) {
    items.push({
      titleEs: sw.titleEs,
      reasonEs: sw.mainIssueEs,
      priority: "high",
      estimatedMin: 12,
      href: sw.href,
    });
  }

  for (const c of due.slice(0, 8)) {
    const fails = attempts.filter((a) => a.exerciseId.startsWith(c.id) && !a.correct).length;
    items.push({
      titleEs: c.fragment,
      reasonEs:
        fails > 0
          ? `Due now. Previous recall was weak (${fails} miss(es)). Prerequisite for current practice.`
          : `Due now — interval elapsed without practice.`,
      priority: fails > 0 ? "high" : "medium",
      estimatedMin: 4,
      href: `/memory/${c.id}`,
    });
  }

  const failedCards = COMMAND_BANK.filter((c) => attempts.some((a) => a.exerciseId.startsWith(c.id) && !a.correct)).slice(0, 6);
  for (const c of failedCards) {
    if (items.some((i) => i.href === `/memory/${c.id}`)) continue;
    items.push({
      titleEs: c.fragment,
      reasonEs: "Recent miss — still in the queue. Retry is expected.",
      priority: "low",
      estimatedMin: 4,
      href: `/memory/${c.id}`,
    });
  }

  const seen = new Set<string>();
  return items.filter((i) => {
    if (seen.has(i.href)) return false;
    seen.add(i.href);
    return true;
  });
}

export function reviewWhyToday(progress: ProgressState): string[] {
  const due = dueCommands(progress);
  const weak = listWeaknesses(progress);
  const why: string[] = [];
  if (due.length) why.push(`You have ${due.length} item(s) past their recall interval.`);
  if (weak.some((w) => w.severity === "critical")) why.push("A critical weakness is still open.");
  if (weak.some((w) => w.severity === "open")) why.push("Recent practice left an open gap.");
  if (!why.length) why.push("No urgent forgetting signal — optional maintenance.");
  return why;
}

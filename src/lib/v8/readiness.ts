import { CourseState } from "@/lib/course/storage";
import { ProgressState } from "@/lib/progress/state";
import { ejptReadiness, labCheckpointDone, profileBars } from "@/lib/v6/mastery";

export type ReadinessBand =
  | "NOT READY"
  | "FOUNDATION"
  | "DEVELOPING"
  | "PRACTICING"
  | "READY TO MOCK"
  | "MOCK READY"
  | "EXAM READY";

export function readinessBand(course: CourseState, progress: ProgressState): ReadinessBand {
  const lab = labCheckpointDone(course);
  const score = ejptReadiness(course, progress);
  const mocks = progress.attempts.filter((a) => a.id.startsWith("mock:") || a.id.startsWith("full:"));
  const passedMock = mocks.some((a) => (a.score ?? 0) >= 70);

  if (!lab) return "NOT READY";
  if (score < 25) return "FOUNDATION";
  if (score < 45) return "DEVELOPING";
  if (score < 60) return "PRACTICING";
  if (!passedMock) return "READY TO MOCK";
  if (score < 75) return "MOCK READY";
  return "EXAM READY";
}

export function speedScore(progress: ProgressState): number | undefined {
  const timed = (progress.trainer?.attempts ?? []).filter((a) => typeof a.durationMs === "number" && a.durationMs > 0);
  if (timed.length < 5) return undefined;
  const okFast = timed.filter((a) => a.correct && a.durationMs! < 45_000).length;
  return Math.round((okFast / timed.length) * 100);
}

export function independenceFromHints(progress: ProgressState): number | undefined {
  const attempts = progress.trainer?.attempts ?? [];
  const ok = attempts.filter((a) => a.correct);
  if (ok.length < 3) return undefined;
  return Math.round((ok.filter((a) => (a.hintsUsed ?? 0) === 0).length / ok.length) * 100);
}

export function readinessBreakdown(course: CourseState, progress: ProgressState) {
  const bars = profileBars(course, progress);
  const knowledge = bars.find((b) => b.label === "NETWORKING")?.pct;
  const command = bars.find((b) => b.label === "COMMAND MEMORY")?.pct;
  const reasoning = bars.find((b) => b.label === "REASONING")?.pct;
  const practical = bars.find((b) => b.label === "LINUX")?.pct;
  return {
    overall: ejptReadiness(course, progress),
    band: readinessBand(course, progress),
    knowledge,
    commandMemory: command,
    reasoning,
    practical,
    independence: independenceFromHints(progress),
    speed: speedScore(progress),
  };
}

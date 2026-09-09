import { CourseState } from "@/lib/course/storage";
import { ProgressState } from "@/lib/progress/state";
import { calculateCompetency } from "@/lib/v9/competency";
import { EJPT_OBJECTIVE_MATRIX } from "@/content/v8/ejpt-matrix";
import { phaseProgress, skillStatus } from "@/lib/v6/mastery";

export type EvidenceBand = "NOT ENOUGH DATA" | "DEVELOPING" | "PRACTICING" | "STRONG";

function band(n: number | undefined): EvidenceBand {
  if (n === undefined) return "NOT ENOUGH DATA";
  if (n < 50) return "DEVELOPING";
  if (n < 75) return "PRACTICING";
  return "STRONG";
}

export function calculateReadiness(course: CourseState, progress: ProgressState) {
  const dims = {
    knowledge: avgDim(course, progress, "knowledge"),
    execution: avgDim(course, progress, "execution"),
    decision: avgDim(course, progress, "decision"),
    transfer: avgDim(course, progress, "transfer"),
    retention: avgDim(course, progress, "retention"),
  };
  const known = Object.values(dims).filter((v) => v !== undefined) as number[];
  const overallBand: EvidenceBand =
    known.length < 2 ? "NOT ENOUGH DATA" : band(Math.round(known.reduce((a, b) => a + b, 0) / known.length));

  const domains = EJPT_OBJECTIVE_MATRIX.map((row) => {
    const any = row.skillIds.some((id) => {
      const st = skillStatus(id, course, progress);
      return st !== "LOCKED" && st !== "AVAILABLE";
    });
    return {
      domain: row.domain,
      pct: any ? phaseProgress(row.skillIds, course, progress) : null,
    };
  });

  return {
    dims: {
      knowledge: band(dims.knowledge),
      execution: band(dims.execution),
      decision: band(dims.decision),
      transfer: band(dims.transfer),
      retention: band(dims.retention),
    },
    overallBand,
    domains,
    disclaimer: "Training readiness based on observed evidence. Not a probability of passing INE.",
  };
}

function avgDim(course: CourseState, progress: ProgressState, dim: "knowledge" | "execution" | "decision" | "transfer" | "retention") {
  const vals = ["lab", "networking", "linux", "nmap", "enumeration", "web", "exploitation", "reporting"]
    .map((id) => calculateCompetency(id, course, progress).dims[dim])
    .filter((n): n is number => n !== undefined);
  if (!vals.length) return undefined;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

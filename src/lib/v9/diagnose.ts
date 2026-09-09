import { CourseState } from "@/lib/course/storage";
import { ProgressState } from "@/lib/progress/state";
import { FailureClass } from "@/content/v9/types";
import { getSkill, V6_SKILLS } from "@/content/v6/skills";
import { dueCommands } from "@/lib/trainer/adaptive";
import { skillBreakdown } from "@/lib/v6/mastery";

export interface Diagnosis {
  skillId: string;
  failure: FailureClass;
  evidenceEs: string;
  notThisEs: string;
}

function skillIdFromAttempt(exerciseId: string, domain?: string): string | undefined {
  const hit = V6_SKILLS.find((s) => skillMatches(s.id, domain, exerciseId));
  return hit?.id;
}

function skillMatches(skillId: string, domain: string | undefined, exerciseId: string) {
  const skill = getSkill(skillId);
  if (!skill) return false;
  return skill.subtopicIds.some((s) => domain === s || exerciseId.includes(s) || exerciseId.includes(skillId));
}

/** Tipo de fallo a partir de actividad real. Sin datos: null. */
export function diagnoseFailure(skillId: string, course: CourseState, progress: ProgressState): Diagnosis | null {
  const skill = getSkill(skillId);
  if (!skill) return null;
  const attempts = (progress.trainer?.attempts ?? []).filter((a) =>
    skill.subtopicIds.some((s) => a.domain === s || a.exerciseId.includes(s) || a.exerciseId.includes(skillId))
  );
  const recent = attempts.slice(-8);
  const bad = recent.filter((a) => !a.correct);
  const b = skillBreakdown(skillId, course, progress);
  const due = dueCommands(progress).filter((c) => skill.subtopicIds.includes(c.subtopicId));
  const quizLow = skill.lessonIds.some((id) => course.lessons[id] && (course.lessons[id]?.quizPct ?? 0) < 80);
  const labsMissing = skill.lessonIds.filter((id) => course.lessons[id] && !course.lessons[id]?.labDone).length;

  if (due.length >= 2 && (!bad.length || bad.every((a) => !a.failKind || a.failKind === "memory"))) {
    return {
      skillId,
      failure: "RETENTION_FAILURE",
      evidenceEs: `${due.length} SRS items due for this skill.`,
      notThisEs: "Not a full theory restart — spaced recall.",
    };
  }

  if (bad.length >= 2) {
    const counts = { memory: 0, reasoning: 0, technical: 0 };
    for (const a of bad) {
      if (a.failKind) counts[a.failKind] += 1;
    }
    const top = (Object.entries(counts) as ["memory" | "reasoning" | "technical", number][]).sort((a, b) => b[1] - a[1])[0];
    if (top && top[1] > 0) {
      if (top[0] === "memory") {
        return {
          skillId,
          failure: "COMMAND_RECALL_FAILURE",
          evidenceEs: "Recent misses tagged as command memory.",
          notThisEs: "Do not replay the entire module theory.",
        };
      }
      if (top[0] === "technical") {
        return {
          skillId,
          failure: "EXECUTION_FAILURE",
          evidenceEs: "Technical / lab-config misses (LHOST, NIC, tool wiring).",
          notThisEs: "Not a decision-theory problem if the packet never left.",
        };
      }
      const hints = recent.filter((a) => (a.hintsUsed ?? 0) > 0).length;
      if ((b.practical ?? 0) >= 70 && (b.reasoning ?? 100) < 70) {
        return {
          skillId,
          failure: "DECISION_FAILURE",
          evidenceEs: "Execution proxy is stronger than reasoning on recent drills.",
          notThisEs: "Do not redo the whole tool module if execution is already competent.",
        };
      }
      return {
        skillId,
        failure: hints >= 3 ? "INTERPRETATION_FAILURE" : "REASONING_FAILURE",
        evidenceEs: hints >= 3 ? "Correct answers still needed hints — interpretation gap." : "Reasoning misses on recent drills.",
        notThisEs: "Remediation should be drills, not a 60-min lecture.",
      };
    }
  }

  if (quizLow && (b.knowledge ?? 100) < 80) {
    return {
      skillId,
      failure: "KNOWLEDGE_FAILURE",
      evidenceEs: "Quiz below 80% on at least one completed lesson.",
      notThisEs: "If labs already pass, keep practice short.",
    };
  }

  if (labsMissing >= 1) {
    return {
      skillId,
      failure: "EXECUTION_FAILURE",
      evidenceEs: "Lesson opened without lab checkpoint.",
      notThisEs: "Not a memory card problem.",
    };
  }

  const timed = recent.filter((a) => typeof a.durationMs === "number" && a.durationMs > 90_000 && !a.correct);
  if (timed.length >= 2) {
    return {
      skillId,
      failure: "TIME_MANAGEMENT_FAILURE",
      evidenceEs: "Slow incorrect attempts (>90s) more than once.",
      notThisEs: "Triage: smaller surface, not more tools.",
    };
  }

  if (skillId === "chains" && bad.length) {
    return {
      skillId,
      failure: "METHODOLOGY_FAILURE",
      evidenceEs: "Attack-path misses.",
      notThisEs: "Not a single-tool syntax issue.",
    };
  }

  return null;
}

export function diagnoseRecent(course: CourseState, progress: ProgressState): Diagnosis | null {
  const last = [...(progress.trainer?.attempts ?? [])].reverse().find((a) => !a.correct);
  if (last) {
    const id = skillIdFromAttempt(last.exerciseId, last.domain);
    if (id) return diagnoseFailure(id, course, progress);
  }
  const open = Object.entries(progress.failures).find(([, f]) => f.status !== "resolved");
  if (open) {
    const skill = V6_SKILLS.find((s) => s.subtopicIds.includes(open[0]));
    if (skill) return diagnoseFailure(skill.id, course, progress);
  }
  return null;
}

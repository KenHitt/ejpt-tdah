import { COURSE_LESSONS } from "@/content/course";
import { EnrichedLesson } from "@/content/course/types";
import { guideById } from "@/content/v92/guides";
import { termsMatching } from "@/content/v92/terms";

export type DepthGrade = "ready" | "needs-example" | "needs-explanation" | "insufficient-context";

export interface LessonDepthAudit {
  lessonId: string;
  titleEs: string;
  week: number;
  day: number;
  grade: DepthGrade;
  originalGrade: DepthGrade;
  issues: string[];
  unexplainedTerms: string[];
  hasCustomGuide: boolean;
}

const LAB_CMD = /\b(nmap|gobuster|hydra|smbclient|msfconsole|sqlmap|searchsploit|linpeas)\b/i;

function originalBlob(l: EnrichedLesson) {
  return [...l.read.map((s) => `${s.h}\n${s.p}`), l.titleEs, l.labTitle, ...l.labSteps].join("\n");
}

function readBlob(l: EnrichedLesson) {
  return l.read.map((s) => `${s.h}\n${s.p}`).join("\n");
}

function unexplainedInSource(l: EnrichedLesson) {
  const read = readBlob(l);
  const lab = `${l.labTitle}\n${l.labSteps.join("\n")}`;
  const inLabOrTitle = termsMatching(`${l.titleEs}\n${lab}`);
  return inLabOrTitle.filter((t) => {
    const mentioned = read.toLowerCase().includes(t.term.toLowerCase());
    const defined = mentioned && /qué es|para qué|se usa|significa|\bes una?\b/i.test(read);
    return !defined;
  });
}

function gradeFromIssues(issues: string[], unexplained: string[]): DepthGrade {
  const jump = issues.some((i) => i.startsWith("lab-jump"));
  if (jump && unexplained.length >= 2) return "insufficient-context";
  if (unexplained.length > 0) return "needs-explanation";
  if (issues.some((i) => i.startsWith("no-cmd"))) return "needs-example";
  return "ready";
}

export function auditLessonDepth(l: EnrichedLesson): LessonDepthAudit {
  const unexplained = unexplainedInSource(l);
  const issues: string[] = [];
  const read = readBlob(l);
  const lab = l.labSteps.join(" ");
  const custom = guideById(l.id);

  if (LAB_CMD.test(lab) && !LAB_CMD.test(read) && l.read.length <= 4) {
    issues.push("lab-jump: el laboratorio nombra una tool que la teoría no explica");
  }
  if (LAB_CMD.test(lab) && !/-\w{1,3}\b/.test(read) && !custom?.commands?.length) {
    issues.push("no-cmd: hay comando de lab sin flags explicados en la teoría original");
  }
  if (l.labSteps.length > 0 && !/ip |Host-Only|localhost|DVWA|vboxnet|ping/i.test(read) && l.week <= 2) {
    issues.push("lab-jump: poca preparación de red/IP en la teoría original");
  }
  if (unexplained.length) {
    issues.push(`términos sin definición previa: ${unexplained.map((t) => t.term).join(", ")}`);
  }

  const originalGrade = gradeFromIssues(issues, unexplained.map((t) => t.term));
  const g = l.guide;
  const covered = new Set((g?.terms ?? []).map((t) => t.term.toLowerCase()));
  const still = unexplained.filter((t) => !covered.has(t.term.toLowerCase()));
  const hasCmdHelp = (g?.commands?.length ?? 0) > 0 || !LAB_CMD.test(originalBlob(l));
  const after: DepthGrade =
    still.length === 0 && hasCmdHelp && (g?.prep?.length ?? 0) > 0 && (g?.lost?.length ?? 0) > 0
      ? "ready"
      : still.length
        ? "needs-explanation"
        : !hasCmdHelp
          ? "needs-example"
          : "ready";

  return {
    lessonId: l.id,
    titleEs: l.titleEs,
    week: l.week,
    day: l.day,
    grade: after,
    originalGrade,
    issues,
    unexplainedTerms: unexplained.map((t) => t.term),
    hasCustomGuide: Boolean(custom),
  };
}

export function auditAllLessons() {
  return COURSE_LESSONS.map(auditLessonDepth);
}

export function depthCounts(rows = auditAllLessons()) {
  const empty = { ready: 0, "needs-example": 0, "needs-explanation": 0, "insufficient-context": 0 };
  return rows.reduce((acc, r) => {
    acc[r.grade] += 1;
    return acc;
  }, { ...empty } as Record<DepthGrade, number>);
}

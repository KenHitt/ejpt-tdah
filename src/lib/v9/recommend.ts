import { CourseState } from "@/lib/course/storage";
import { ProgressState } from "@/lib/progress/state";
import { EnergyMode } from "@/content/v6/types";
import { RecKind, ScoredRec, TimeBudget, budgetFromEnergy } from "@/content/v9/types";
import { nextIncomplete } from "@/content/course";
import { getSkill, V6_SKILLS } from "@/content/v6/skills";
import { dueCommands, listWeaknesses } from "@/lib/trainer/adaptive";
import { labCheckpointDone, skillStatus } from "@/lib/v6/mastery";
import { skillWeaknesses } from "@/lib/v6/weakness";
import { drillsForSkill } from "@/content/v8/drills";
import { V8_MACHINES, V8_BOSSES } from "@/content/v8/operations";
import { EJPT_OBJECTIVE_MATRIX } from "@/content/v8/ejpt-matrix";
import { phaseProgress } from "@/lib/v6/mastery";
import { academicState, blockedByPrereq, calculateCompetency, independenceStats, weakestCriticalSkill } from "@/lib/v9/competency";
import { diagnoseFailure, diagnoseRecent } from "@/lib/v9/diagnose";
import { remediationPath } from "@/lib/v9/remediation";
import { estimateLessonMinutes } from "@/content/v6/hours";
import { getLesson } from "@/content/course";

export interface AdvisorBoard {
  primary: ScoredRec;
  quick?: ScoredRec;
  weakness?: ScoredRec;
  progression?: ScoredRec;
  stretch?: ScoredRec;
  advisor: { priorityEs: string; whyEs: string; afterEs: string };
  highlights: {
    weakestCritical?: string;
    mostUrgent?: string;
    needsRetention?: string;
    readyToAdvance?: string;
  };
  domainReadiness: { domain: string; pct: number | null; note: string }[];
  timeSlots: { budget: TimeBudget; rec: ScoredRec }[];
}

const HIGH_RELEVANCE = new Set([
  "lab",
  "networking",
  "linux",
  "nmap",
  "enumeration",
  "smb",
  "http-enum",
  "web",
  "sqli",
  "metasploit",
  "exploitation",
  "reporting",
]);

function mk(
  partial: Omit<ScoredRec, "kind" | "priority" | "relevance" | "score"> & {
    kind?: RecKind;
    score: number;
    priority?: ScoredRec["priority"];
    relevance?: ScoredRec["relevance"];
  }
): ScoredRec {
  return {
    kind: partial.kind ?? "primary",
    priority: partial.priority ?? (partial.score >= 70 ? "high" : partial.score >= 45 ? "medium" : "low"),
    relevance: partial.relevance ?? "medium",
    ...partial,
  };
}

function durationFits(min: number, budget: TimeBudget) {
  if (budget <= 10) return min <= 12;
  if (budget <= 15) return min <= 20;
  if (budget <= 30) return min <= 40;
  if (budget <= 45) return min <= 55;
  return true;
}

function candidates(course: CourseState, progress: ProgressState): ScoredRec[] {
  const out: ScoredRec[] = [];
  const nextLesson = nextIncomplete(course.lessons);
  const lesson = getLesson(nextLesson.id);
  const lessonMin = lesson ? Math.min(90, estimateLessonMinutes(lesson)) : 40;
  const skill = lesson ? V6_SKILLS.find((s) => s.lessonIds.includes(nextLesson.id)) : undefined;

  if (!labCheckpointDone(course)) {
    out.push(
      mk({
        titleEs: "Lab checkpoint",
        whyBullets: [
          "Prerequisite for every offensive skill.",
          "Ping, vboxnet, snapshot and written scope are still open.",
          "Curriculum does not advance while this gate is red.",
        ],
        href: "/clase/c00-d1",
        durationMin: 25,
        skillId: "lab",
        dimension: "execution",
        goalEs: "Prove connectivity and isolation before recon.",
        score: 96,
        relevance: "high",
        kind: "progression",
      })
    );
  }

  const critical = listWeaknesses(progress).find((w) => w.severity === "critical") ?? listWeaknesses(progress)[0];
  if (critical) {
    const sid = V6_SKILLS.find((s) => s.subtopicIds.some((id) => critical.href.includes(id) || critical.id === id))?.id;
    const dx = sid ? diagnoseFailure(sid, course, progress) : diagnoseRecent(course, progress);
    const steps = dx ? remediationPath(sid ?? "nmap", dx.failure) : [];
    out.push(
      mk({
        titleEs: critical.labelEs,
        whyBullets: [critical.whyEs, dx ? `Diagnosis: ${dx.failure.replaceAll("_", " ")}.` : "Open weakness from trainer evidence.", dx?.notThisEs ?? "Retries are normal — we score the trend."],
        href: steps[0]?.href ?? critical.href,
        durationMin: steps[0]?.min ?? 15,
        skillId: sid,
        dimension: dx?.failure === "DECISION_FAILURE" ? "decision" : dx?.failure === "RETENTION_FAILURE" ? "retention" : "reasoning",
        goalEs: steps[0]?.titleEs ?? "Close the diagnosed gap, then retry.",
        score: critical.severity === "critical" ? 92 : 78,
        relevance: "high",
        kind: "weakness",
      })
    );
  }

  const sw = skillWeaknesses(course, progress)[0];
  if (sw) {
    const drill = drillsForSkill(sw.skillId)[0];
    const comp = calculateCompetency(sw.skillId, course, progress);
    out.push(
      mk({
        titleEs: `${sw.titleEs} — ${comp.weakestDim === "decision" ? "Decision drill" : "repair"}`,
        whyBullets: [sw.mainIssueEs, comp.weakestDim ? `Weakest observed dimension: ${comp.weakestDim}.` : "Skill marked weak from lessons/drills.", "This is repair, not a random topic."],
        href: drill ? "/train/decisions" : `/master/${sw.skillId}`,
        durationMin: 12,
        skillId: sw.skillId,
        dimension: comp.weakestDim ?? "reasoning",
        goalEs: "Fix the weak dimension, then retry the gate.",
        score: 80,
        kind: "weakness",
        relevance: HIGH_RELEVANCE.has(sw.skillId) ? "high" : "medium",
      })
    );
  }

  const due = dueCommands(progress);
  if (due[0]) {
    out.push(
      mk({
        titleEs: `SRS · ${due[0].fragment}`,
        whyBullets: [
          `You have ${due.length} due recall item(s).`,
          "Previous interval elapsed — forgetting risk, not a new module.",
          "These items are prerequisites for current practice.",
        ],
        href: `/memory/${due[0].id}`,
        durationMin: 6,
        dimension: "retention",
        goalEs: "Produce the command without a cheat sheet.",
        score: 70 + Math.min(15, due.length),
        kind: "quick",
        relevance: "high",
      })
    );
  }

  const blocked = skill ? blockedByPrereq(skill.id, course, progress) : null;
  if (blocked) {
    const pre = getSkill(blocked);
    out.push(
      mk({
        titleEs: `Prerequisite: ${pre?.titleEs ?? blocked}`,
        whyBullets: ["A required skill is still weak or unstarted.", "Recommendation engine respects the skill graph.", "Do not jump to the advanced lesson yet."],
        href: pre?.lessonIds[0] ? `/clase/${pre.lessonIds[0]}` : `/master/${blocked}`,
        durationMin: 20,
        skillId: blocked,
        goalEs: "Unlock the current module honestly.",
        score: 88,
        kind: "progression",
        relevance: "high",
      })
    );
  }

  if (lesson) {
    out.push(
      mk({
        titleEs: nextLesson.titleEs,
        whyBullets: [
          "Next incomplete jornada in the official path.",
          skill ? `Improves ${skill.titleEs}.` : "Curriculum position.",
          "Not a random lesson — it is the current module gate.",
        ],
        href: `/clase/${nextLesson.id}`,
        durationMin: Math.min(lessonMin, 60),
        skillId: skill?.id,
        dimension: "knowledge",
        goalEs: nextLesson.labTitle || "Complete the observable outcomes of this jornada.",
        score: labCheckpointDone(course) ? 55 : 40,
        kind: "progression",
        relevance: skill && HIGH_RELEVANCE.has(skill.id) ? "high" : "medium",
      })
    );
  }

  for (const s of V6_SKILLS) {
    const st = academicState(s.id, course, progress);
    const comp = calculateCompetency(s.id, course, progress);
    const indep = independenceStats(s.id, progress);
    if (st === "COMPETENT" && !comp.dims.transfer && durationFits(35, 60)) {
      const machine = V8_MACHINES.find((m) => m.skillIds.includes(s.id));
      if (machine && (course.exams[`op:${machine.id}`]?.pct ?? 0) < 70) {
        out.push(
          mk({
            titleEs: `${machine.titleEs} (transfer)`,
            whyBullets: [
              `Execution on ${s.titleEs} looks competent; transfer is unproven.`,
              "Variant scenario — not the same screenshot as the lesson.",
              `~${machine.estimatedMin} min tabletop. Does not replace VirtualBox.`,
            ],
            href: `/operaciones/${machine.id}`,
            durationMin: machine.estimatedMin,
            skillId: s.id,
            dimension: "transfer",
            goalEs: "Apply the skill on a different target description.",
            score: 62,
            kind: "stretch",
            relevance: HIGH_RELEVANCE.has(s.id) ? "high" : "medium",
          })
        );
      }
    }
    if ((indep.hintDependency ?? 0) >= 40 && (indep.independentSuccess ?? 100) < 70 && indep.attempts >= 3) {
      out.push(
        mk({
          titleEs: `${s.titleEs} — independent retry`,
          whyBullets: [
            `Hint dependency ${indep.hintDependency}% — status stays PRACTICING, not MASTERED.`,
            "Retry without HINT 5.",
            "A second win after a miss is useful evidence.",
          ],
          href: s.trainHrefs[0] ?? "/train/5min",
          durationMin: 10,
          skillId: s.id,
          dimension: "execution",
          goalEs: "Independent success without walkthrough.",
          score: 68,
          kind: "weakness",
        })
      );
    }
  }

  const hints = Object.values(progress.trainer?.hintLevelByKey ?? {}).reduce((n, v) => n + v, 0);
  const recent = (progress.trainer?.attempts ?? []).slice(-8);
  if (recent.length >= 4 && recent.every((a) => a.correct) && hints < 4) {
    const stretch = V8_MACHINES.find((m) => (course.exams[`op:${m.id}`]?.pct ?? 0) < 70) ?? V8_BOSSES[0];
    out.push(
      mk({
        titleEs: stretch.titleEs,
        whyBullets: [
          "Recent attempts succeeded with low hint use.",
          "Difficulty can increase — still tabletop, not a CTF dump.",
          "Boss/machine checks transfer, not completion checkboxes.",
        ],
        href: `/operaciones/${stretch.id}`,
        durationMin: stretch.estimatedMin,
        dimension: "transfer",
        goalEs: "Operate without a skill spoiler list.",
        score: 58,
        kind: "stretch",
      })
    );
  }

  out.push(
    mk({
      titleEs: "5-min training",
      whyBullets: ["Fits a 5-minute window.", "Records recall/interpretation evidence."],
      href: "/train/5min",
      durationMin: 5,
      dimension: "retention",
      goalEs: "Micro evidence, not a new module.",
      score: 30,
      kind: "quick",
    })
  );

  out.push(
    mk({
      titleEs: "10-min emergency session",
      whyBullets: ["Recall + interpretation + one decision.", "Energy mode compatible.", "Still logged as evidence."],
      href: "/train/emergency",
      durationMin: 10,
      goalEs: "Leave with one diagnosis, not a random arcade round.",
      score: 35,
      kind: "quick",
    })
  );

  return out;
}

function pickBest(list: ScoredRec[], budget: TimeBudget, used: Set<string>): ScoredRec {
  const fit = list.filter((r) => !used.has(r.href) && durationFits(r.durationMin, budget)).sort((a, b) => b.score - a.score);
  if (fit[0]) return fit[0];
  const any = list.filter((r) => !used.has(r.href)).sort((a, b) => b.score - a.score);
  return any[0] ?? list[0];
}

export function calculateRecommendation(
  course: CourseState,
  progress: ProgressState,
  energy: EnergyMode,
  budget?: TimeBudget
): AdvisorBoard {
  const t = budget ?? budgetFromEnergy(energy);
  const all = candidates(course, progress);
  const used = new Set<string>();
  const primary = pickBest(all, t, used);
  used.add(primary.href);
  const quick = pickBest(
    all.filter((r) => r.kind === "quick" || r.durationMin <= 10),
    10,
    used
  );
  if (quick) used.add(quick.href);
  const weakness = pickBest(
    all.filter((r) => r.kind === "weakness"),
    t,
    used
  );
  if (weakness) used.add(weakness.href);
  const progression = pickBest(
    all.filter((r) => r.kind === "progression"),
    t,
    used
  );
  if (progression) used.add(progression.href);
  const stretch = pickBest(
    all.filter((r) => r.kind === "stretch"),
    energy === "low" ? 15 : 90,
    used
  );

  const weak = weakestCriticalSkill(course, progress);
  const due = dueCommands(progress);
  const dx = diagnoseRecent(course, progress);
  const ready = V6_SKILLS.find((s) => {
    const st = academicState(s.id, course, progress);
    return st === "TRANSFER_READY" || st === "COMPETENT";
  });

  const domainReadiness = EJPT_OBJECTIVE_MATRIX.map((row) => {
    const started = row.skillIds.some((id) => skillStatus(id, course, progress) !== "AVAILABLE" && skillStatus(id, course, progress) !== "LOCKED");
    if (!started) return { domain: row.domain, pct: null as number | null, note: "Not enough data yet" };
    return { domain: row.domain, pct: phaseProgress(row.skillIds, course, progress), note: "Training readiness from observed evidence — not P(pass INE)." };
  });

  const after = weakness && weakness.href !== primary.href ? weakness.titleEs : progression?.titleEs ?? "Review queue";

  return {
    primary: { ...primary, kind: "primary" },
    quick: quick?.href === primary.href ? undefined : quick,
    weakness: weakness?.href === primary.href ? undefined : weakness,
    progression: progression?.href === primary.href ? undefined : progression,
    stretch,
    advisor: {
      priorityEs: primary.titleEs,
      whyEs: primary.whyBullets[0] ?? "Evidence-driven next activity.",
      afterEs: `Después: ${after}.`,
    },
    highlights: {
      weakestCritical: weak ? `${weak.titleEs} (${weak.dim})` : undefined,
      mostUrgent: dx ? `${dx.skillId} · ${dx.failure.replaceAll("_", " ")}` : criticalLabel(progress),
      needsRetention: due.length ? `${due.length} SRS due` : undefined,
      readyToAdvance: ready ? ready.titleEs : undefined,
    },
    domainReadiness,
    timeSlots: ([5, 15, 60] as TimeBudget[]).map((b) => ({
      budget: b,
      rec: pickBest(all, b, new Set()),
    })),
  };
}

function criticalLabel(progress: ProgressState): string | undefined {
  const w = listWeaknesses(progress)[0];
  return w?.labelEs;
}

export function recommendMachine(course: CourseState, progress: ProgressState, budget: TimeBudget) {
  const board = calculateRecommendation(course, progress, budget >= 60 ? "high" : budget <= 15 ? "low" : "normal", budget);
  const weak = skillWeaknesses(course, progress)[0];
  const match = V8_MACHINES.find((m) => (weak ? m.skillIds.includes(weak.skillId) : true) && durationFits(m.estimatedMin, budget) && (course.exams[`op:${m.id}`]?.pct ?? 0) < 70);
  if (!match) return null;
  return {
    machine: match,
    whyEs: weak
      ? `Your ${weak.titleEs} still needs practice (${weak.mainIssueEs}). This L${match.n} machine trains that surface without spoiling the path.`
      : board.primary.whyBullets[0],
  };
}

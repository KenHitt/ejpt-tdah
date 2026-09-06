import { ProgressState } from "@/lib/progress/state";
import { SUBTOPICS } from "@/content/subtopics";
import { TrainerAttempt } from "@/lib/trainer/types";
import { MASTERED_PERCENT } from "@/lib/trainer/bands";

export const CRITICAL_SUBTOPICS = [
  "nmap-basic",
  "nmap-versioning",
  "enum4linux",
  "smb-manual",
  "gobuster-dir",
  "msf-lhost-lport",
  "msf-search-use",
  "msf-options",
  "reverse-vs-bind",
  "net-basic",
  "net-pivoting",
  "privesc-linux",
  "tool-selection",
];

export const FULL_MACHINE_GATES = [
  { id: "ms2", labelEs: "Metasploitable 2 (flujo)", blockId: "m1-w4-b4" },
  { id: "kioptrix", labelEs: "Kioptrix / Linux e2e", blockId: "m1-w4-b3" },
  { id: "dvwa", labelEs: "DVWA SQLi", blockId: "m2-w5-b1" },
];

function pct(ok: number, total: number): number | null {
  if (total === 0) return null;
  return Math.round((ok / total) * 100);
}

function attemptsOf(state: ProgressState, kind: TrainerAttempt["skillKind"]) {
  return (state.trainer?.attempts ?? []).filter((a) => (a.skillKind ?? "recall") === kind);
}

export function skillPercents(state: ProgressState) {
  const recall = attemptsOf(state, "recall");
  const reasoning = attemptsOf(state, "reasoning");
  const machinesDone = FULL_MACHINE_GATES.filter((m) => state.blockStatus[m.blockId] === "completed").length;
  return {
    recall: pct(recall.filter((a) => a.correct).length, recall.length),
    reasoning: pct(reasoning.filter((a) => a.correct).length, reasoning.length),
    machines: pct(machinesDone, FULL_MACHINE_GATES.length),
    machinesDone,
    machinesTotal: FULL_MACHINE_GATES.length,
  };
}

export function domainScores(state: ProgressState): { id: string; labelEs: string; score: number | null; weak: boolean; critical: boolean }[] {
  const cats = Array.from(new Set(SUBTOPICS.map((s) => s.category)));
  const attempts = state.trainer?.attempts ?? [];
  const hints = state.trainer?.hintLevelByKey ?? {};
  return cats.map((cat) => {
    const subs = SUBTOPICS.filter((s) => s.category === cat).map((s) => s.id);
    const mine = attempts.filter(
      (a) => subs.includes(a.domain ?? "") || subs.some((id) => a.exerciseId.includes(id))
    );
    const bySub = attempts.filter((a) => subs.some((id) => a.exerciseId.includes(id) || a.domain === id));
    const pool = bySub.length ? bySub : mine;
    const fails = pool.filter((a) => !a.correct);
    const oks = pool.filter((a) => a.correct);
    const hintPenalty = subs.reduce((n, id) => n + (hints[id] ?? 0) + (hints[`block:${id}`] ? 1 : 0), 0);
    const retryPenalty = fails.length;
    const reasoningFails = fails.filter((a) => a.failKind === "reasoning").length;
    const raw = pct(oks.length, oks.length + fails.length);
    let score = raw;
    if (score !== null) {
      score = Math.max(0, score - Math.min(25, hintPenalty * 2 + retryPenalty + reasoningFails * 4));
    }
    const openFail = subs.some((id) => {
      const f = state.failures[id];
      return f && f.status !== "resolved";
    });
    const critical = subs.some((id) => state.failures[id]?.status === "critical-risk") || (score !== null && score < 70);
    return {
      id: cat,
      labelEs: cat,
      score,
      weak: (score !== null && score < MASTERED_PERCENT) || openFail,
      critical: critical || (score !== null && score < 70),
    };
  }).filter((d) => d.score !== null || SUBTOPICS.filter((s) => s.category === d.id).some((s) => state.failures[s.id]));
}

export function criticalSkillScore(state: ProgressState): number | null {
  const attempts = state.trainer?.attempts ?? [];
  const mine = attempts.filter((a) => CRITICAL_SUBTOPICS.some((id) => a.exerciseId.includes(id) || a.domain === id));
  return pct(mine.filter((a) => a.correct).length, mine.length);
}

export function consecutiveFullMocks(state: ProgressState): { last3: number[]; ok: boolean } {
  const full = state.attempts
    .filter((a) => a.id.startsWith("full:") && typeof a.score === "number")
    .sort((a, b) => (a.finishedAt ?? a.startedAt).localeCompare(b.finishedAt ?? b.startedAt));
  const last3 = full.slice(-3).map((a) => a.score as number);
  const ok = last3.length >= 3 && last3.every((s) => s >= MASTERED_PERCENT);
  return { last3, ok };
}

export function competencyMessage(state: ProgressState): string {
  const s = skillPercents(state);
  const r = s.recall ?? 0;
  const g = s.reasoning ?? 0;
  const m = s.machines ?? 0;
  if (s.recall === null && s.reasoning === null) return "Aún no hay suficientes intentos para separar memoria y razonamiento.";
  if (r >= 85 && g < 80) {
    return "Memorizas bien los comandos, pero todavía necesitas mejorar la toma de decisiones práctica.";
  }
  if (g >= 85 && r < 75) {
    return "Razonas el siguiente paso, pero el recall de sintaxis todavía falla.";
  }
  if (m < 70 && (r >= 85 || g >= 85)) {
    return "Hay práctica de recall/razonamiento, pero faltan máquinas completas (recon → evidencia).";
  }
  return "Tres métricas distintas: Command Memory, Practical Reasoning y Full Machines. Ninguna sustituye a las otras.";
}

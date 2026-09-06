import { ProgressState } from "@/lib/progress/state";
import { getAllBlocks } from "@/content/curriculum";
import { COMMAND_BANK } from "@/content/command-bank";
import { getSubtopic } from "@/content/subtopics";
import { TrainerAttempt } from "@/lib/trainer/types";

export type NextPractice = {
  kind: "gate" | "remediate" | "review" | "block" | "exam";
  href: string;
  titleEs: string;
  titleEn?: string;
  reasonEs: string;
  ctaEs: string;
  durationHint: string;
};

export type WeakItem = {
  id: string;
  labelEs: string;
  whyEs: string;
  href: string;
  severity: "critical" | "open" | "review";
};

const GATE_LAB = ["m0-w0-b1", "m0-w0-b2"];
const GATE_LINUX = ["m0-w0-b6", "m0-w0-b7"];
const GATE_NET = ["m0-w0-b8", "m0-w0-b9"];

function completed(state: ProgressState, ids: string[]) {
  return ids.every((id) => state.blockStatus[id] === "completed");
}

function attemptsForCard(attempts: TrainerAttempt[], cardId: string) {
  return attempts.filter((a) => a.exerciseId.startsWith(`${cardId}:`) || a.exerciseId === cardId);
}

function lastAttempt(attempts: TrainerAttempt[]) {
  if (!attempts.length) return undefined;
  return [...attempts].sort((a, b) => a.at.localeCompare(b.at)).at(-1);
}

function subtopicSeen(state: ProgressState, subtopicId: string) {
  if (state.failures[subtopicId]) return true;
  return getAllBlocks().some((b) => b.subtopics.includes(subtopicId) && state.blockStatus[b.id] === "completed");
}

/** Intervalo corto: fallo reciente → ahora; acierto → 1 día (8h si falló ≥2 veces ese comando). */
export function isCommandDue(state: ProgressState, cardId: string, now = Date.now()): boolean {
  const card = COMMAND_BANK.find((c) => c.id === cardId);
  if (!card || !subtopicSeen(state, card.subtopicId)) return false;
  const mine = attemptsForCard(state.trainer?.attempts ?? [], cardId);
  const last = lastAttempt(mine);
  if (!last) return false;
  if (!last.correct) return true;
  const fails = mine.filter((a) => !a.correct).length;
  const waitMs = (fails >= 2 ? 8 : 24) * 60 * 60 * 1000;
  return now - new Date(last.at).getTime() >= waitMs;
}

export function dueCommands(state: ProgressState, now = Date.now()) {
  return COMMAND_BANK.filter((c) => isCommandDue(state, c.id, now));
}

export function listWeaknesses(state: ProgressState): WeakItem[] {
  const items: WeakItem[] = [];
  for (const f of Object.values(state.failures)) {
    if (f.status === "resolved") continue;
    const sub = getSubtopic(f.subtopicId);
    items.push({
      id: f.subtopicId,
      labelEs: sub?.nameEs ?? f.subtopicId,
      whyEs:
        f.status === "critical-risk"
          ? `Crítico · ${f.failCount} fallos. No abras tema nuevo.`
          : `En remediación · ${f.failCount} fallo(s).`,
      href: `/remediation/${f.subtopicId}`,
      severity: f.status === "critical-risk" ? "critical" : "open",
    });
  }
  for (const c of COMMAND_BANK) {
    const mine = attemptsForCard(state.trainer?.attempts ?? [], c.id);
    const fails = mine.filter((a) => !a.correct).length;
    const oks = mine.filter((a) => a.correct).length;
    if (fails === 0) continue;
    if (fails <= oks && !isCommandDue(state, c.id)) continue;
    if (items.some((i) => i.id === `cmd:${c.id}`)) continue;
    items.push({
      id: `cmd:${c.id}`,
      labelEs: c.fragment,
      whyEs: `${fails} fallo(s) de recall · ${oks} ok`,
      href: `/memory/${c.id}`,
      severity: "review",
    });
  }
  const order = { critical: 0, open: 1, review: 2 };
  return items.sort((a, b) => order[a.severity] - order[b.severity]).slice(0, 8);
}

export function pickNextPractice(state: ProgressState, now = Date.now()): NextPractice {
  const blocks = getAllBlocks();
  const nextBlock = blocks.find((b) => state.blockStatus[b.id] !== "completed");

  if (!completed(state, GATE_LAB)) {
    const b = blocks.find((x) => x.id === "m0-w0-b1") ?? nextBlock;
    return {
      kind: "gate",
      href: `/focus/${b?.id ?? "m0-w0-b1"}`,
      titleEs: b?.title ?? "Lab Host-Only",
      titleEn: b?.titleEn,
      reasonEs: "Sin lab (vboxnet0 + ping) no hay Nmap ni Metasploit. Una cosa: el bloque 1.",
      ctaEs: "EMPEZAR",
      durationHint: `${b?.durationMin ?? 50} min · Focus`,
    };
  }
  if (!completed(state, GATE_LINUX)) {
    const b = blocks.find((x) => x.id === "m0-w0-b6") ?? nextBlock;
    return {
      kind: "gate",
      href: `/focus/m0-w0-b6`,
      titleEs: b?.title ?? "Linux mínimo",
      titleEn: b?.titleEn,
      reasonEs: "Hay ping, falta Linux mínimo. No abras Nmap del Mes 1.",
      ctaEs: "EMPEZAR",
      durationHint: `${b?.durationMin ?? 45} min · Focus`,
    };
  }
  if (!completed(state, GATE_NET)) {
    return {
      kind: "gate",
      href: "/focus/m0-w0-b8",
      titleEs: blocks.find((x) => x.id === "m0-w0-b8")?.title ?? "Redes mínimas",
      titleEn: blocks.find((x) => x.id === "m0-w0-b8")?.titleEn,
      reasonEs: "Linux OK. Falta IPv4/CIDR/puertos. LHOST será vboxnet0.",
      ctaEs: "EMPEZAR",
      durationHint: "45 min · Focus",
    };
  }

  const failures = Object.values(state.failures).filter((f) => f.status !== "resolved");
  const critical = failures.filter((f) => f.status === "critical-risk").sort((a, b) => b.failCount - a.failCount)[0];
  if (critical) {
    const sub = getSubtopic(critical.subtopicId);
    return {
      kind: "remediate",
      href: `/remediation/${critical.subtopicId}`,
      titleEs: sub?.nameEs ?? critical.subtopicId,
      titleEn: sub?.nameEn,
      reasonEs: "Subtema crítico (falló tras repaso). Cierra esto antes de un bloque nuevo. No promete aprobar el eJPT: solo evita agujeros.",
      ctaEs: "REMEDIAR",
      durationHint: "20–40 min · drills + skill-check",
    };
  }
  const remediating = failures.filter((f) => f.failCount >= 2).sort((a, b) => b.failCount - a.failCount)[0];
  if (remediating) {
    const sub = getSubtopic(remediating.subtopicId);
    return {
      kind: "remediate",
      href: `/remediation/${remediating.subtopicId}`,
      titleEs: sub?.nameEs ?? remediating.subtopicId,
      titleEn: sub?.nameEn,
      reasonEs: "Hay un fallo de recall/quiz en este subtema. Repasa ahora; el plan lineal puede esperar 20 min.",
      ctaEs: "REPASAR",
      durationHint: "20–40 min · remediación",
    };
  }

  const due = dueCommands(state, now)[0];
  if (due) {
    return {
      kind: "review",
      href: `/memory/${due.id}`,
      titleEs: `Recall: ${due.fragment}`,
      titleEn: due.fullQuestionEn,
      reasonEs: "SRS corto: este comando toca otra vez (fallo reciente o ya pasó el intervalo). 4 etapas, no el taller entero.",
      ctaEs: "FLASH DRILL",
      durationHint: "5–10 min · Command Memory",
    };
  }

  if (nextBlock) {
    return {
      kind: "block",
      href: `/focus/${nextBlock.id}`,
      titleEs: nextBlock.title,
      titleEn: nextBlock.titleEn,
      reasonEs: "Sin fallos abiertos ni recall vencido. Siguiente bloque del plan. Una sesión, luego cierra la web.",
      ctaEs: "EMPEZAR",
      durationHint: `${nextBlock.durationMin} min · Focus`,
    };
  }

  return {
    kind: "exam",
    href: "/simulacro",
    titleEs: "Simulacro / skill-check",
    reasonEs: "Plan de bloques completo. No es ‘aprobarás sí o sí’: mide el 70% con reloj.",
    ctaEs: "SIMULACRO",
    durationHint: "20 min · 15 preguntas",
  };
}

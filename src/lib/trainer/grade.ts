import { PromptCheck } from "@/lib/types";
import { keywordsMatch, normalizeAnswer } from "@/lib/trainer/normalize";

const IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)$/;

export function isIpv4(s: string): boolean {
  return IPV4.test(s.trim());
}

export function isLabIpv4(s: string): boolean {
  const t = s.trim();
  if (!isIpv4(t)) return false;
  if (t.startsWith("127.")) return false;
  if (t === "0.0.0.0" || t === "255.255.255.255") return false;
  const [a, b] = t.split(".").map(Number);
  if (a === 10) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

function shapeOk(shape: PromptCheck["shape"], given: string): boolean {
  const g = given.trim();
  if (shape === "ipv4") return isIpv4(g);
  if (shape === "ipv4-lab") return isLabIpv4(g);
  if (shape === "cidr") {
    const n = normalizeAnswer(g);
    return n.includes("/24") || n.includes("255.255.255.0") || /\d+\.\d+\.\d+\.0\/\d+/.test(n) || n.includes("24 bits");
  }
  if (shape === "iface") {
    const n = normalizeAnswer(g);
    return n.includes("vboxnet") || n.includes("host-only") || n.includes("host only");
  }
  return false;
}

export function gradePrompt(
  check: PromptCheck,
  given: string,
  choiceId?: string,
  justify?: string
): { ok: boolean; noteEs: string } {
  if (check.choices?.length) {
    const chosen = check.choices.find((c) => c.id === choiceId);
    if (!chosen) return { ok: false, noteEs: "Elige una opción antes de continuar." };
    if (!chosen.ok) {
      return { ok: false, noteEs: chosen.whyWrongEs ?? check.explanationEs };
    }
    if (check.justifyKeywords?.length) {
      const j = justify ?? "";
      const hits = check.justifyKeywords.filter((k) => normalizeAnswer(j).includes(normalizeAnswer(k))).length;
      const need = Math.min(2, check.justifyKeywords.length);
      if (hits < need) {
        return {
          ok: false,
          noteEs:
            "La opción puede ser razonable, pero el porqué no demuestra metodología. " +
            (check.explanationEs ?? "Explica prioridad (qué servicio, qué herramienta, por qué no brute-force a ciegas)."),
        };
      }
    }
    return { ok: true, noteEs: chosen.whyRightEs ?? check.explanationEs };
  }

  if (check.shape) {
    if (!shapeOk(check.shape, given)) {
      return { ok: false, noteEs: check.explanationEs };
    }
    if (check.keywords?.length && !keywordsMatch(given, check.keywords)) {
      /* shape ya basta */
    }
    return { ok: true, noteEs: check.explanationEs };
  }

  if (check.keywordAny?.length) {
    const ok = check.keywordAny.some((group) => keywordsMatch(given, group));
    return { ok, noteEs: check.explanationEs };
  }

  if (check.keywords?.length) {
    return { ok: keywordsMatch(given, check.keywords), noteEs: check.explanationEs };
  }

  return { ok: given.trim().length > 3, noteEs: check.explanationEs };
}

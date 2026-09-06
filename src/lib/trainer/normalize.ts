export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

export function answersMatch(given: string, expected: string): boolean {
  return normalizeAnswer(given) === normalizeAnswer(expected);
}

/** Flag stage: "-sn", "sn", or a command that contains the flag as a token. */
export function flagMatch(given: string, expected: string): boolean {
  const e = normalizeAnswer(expected);
  const compactE = e.replace(/\s+/g, "");
  const g = normalizeAnswer(given);
  const compactG = g.replace(/\s+/g, "");
  if (compactG === compactE) return true;
  if (compactG === compactE.replace(/^-/, "")) return true;
  const tokens = g.split(" ");
  return tokens.includes(e) || tokens.includes(e.replace(/^-/, "")) || tokens.includes(`-${e.replace(/^-/, "")}`);
}

/** Concept recall: all keywords must appear in the given text (order-free). */
export function keywordsMatch(given: string, keywords: string[]): boolean {
  const g = normalizeAnswer(given);
  return keywords.every((k) => g.includes(normalizeAnswer(k)));
}

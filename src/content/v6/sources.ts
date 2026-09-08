import { HUB_REPOS } from "@/content/github-hub";
import { SourceMeta } from "@/content/v6/types";
import { ACADEMY_WORKSHOPS } from "@/content/academy/workshops";
import { skillForWorkshop, V6_SKILLS } from "@/content/v6/skills";

const TYPE: Record<string, SourceMeta["type"]> = {
  NOTES: "notes",
  NMAP: "tool",
  ENUM: "tool",
  WEB: "tool",
  MSF: "tool",
  POST: "tool",
  WORDLIST: "wordlist",
  LAB: "lab",
  MAP: "wiki",
};

const DIFF: Record<string, SourceMeta["difficulty"]> = {
  SCAN: "intro",
  DEEP: "core",
  RABBIT: "deep",
};

/** Fuentes externas con metadata. El estudio ocurre en Talleres, no en una lista de links. */
export const SOURCE_CATALOG: SourceMeta[] = HUB_REPOS.map((r) => {
  const ws = ACADEMY_WORKSHOPS.find((w) => w.id === r.id);
  return {
    id: r.id,
    titleEs: ws?.titleEs ?? r.name,
    url: r.url,
    type: TYPE[r.track] ?? "tool",
    topic: r.track,
    difficulty: DIFF[r.layer] ?? "core",
    license: "Ver el repositorio (licencia del autor). Uso educativo; no copiar dumps de examen.",
    whySelected: r.gifted,
    lastReviewed: "2026-09-08",
    relatedSkills: (() => {
      const fromSkill = V6_SKILLS.filter((s) => s.workshopIds.includes(r.id)).map((s) => s.id);
      const fallback = skillForWorkshop(r.id)?.id;
      return fromSkill.length ? fromSkill : fallback ? [fallback] : [];
    })(),
    relatedWorkshopId: r.id,
  };
});

export function getSource(id: string) {
  return SOURCE_CATALOG.find((s) => s.id === id);
}

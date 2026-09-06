import { KillPhase } from "@/lib/types";
import { getAllBlocks, getBlockById } from "@/content/curriculum";
import { NextPractice } from "@/lib/trainer/adaptive";
import { StudyBlock } from "@/lib/types";

export const KILL_CHAIN: { id: KillPhase; label: string }[] = [
  { id: "recon", label: "RECON" },
  { id: "enum", label: "ENUM" },
  { id: "vuln", label: "VULN" },
  { id: "exploit", label: "EXPLOIT" },
  { id: "access", label: "ACCESS" },
  { id: "privesc", label: "PRIVESC" },
  { id: "post", label: "POST" },
];

export function operationNumber(blockId: string): number {
  const i = getAllBlocks().findIndex((b) => b.id === blockId);
  return i >= 0 ? i + 1 : 0;
}

export function operationLabel(n: number): string {
  return `OPERATION ${String(n).padStart(2, "0")}`;
}

export function difficultyStars(block: StudyBlock): number {
  if (block.type === "simulacro") return 5;
  if (block.type === "practice") return 3;
  if (block.type === "drill" || block.type === "checkpoint") return 2;
  return 1;
}

export function inferPhase(block: StudyBlock): KillPhase {
  const s = block.subtopics.join(" ");
  if (s.includes("privesc")) return "privesc";
  if (s.includes("msf-sysinfo") || s.includes("post-")) return "post";
  if (s.includes("exploit") || s.includes("msf-") || s.includes("reverse")) return "exploit";
  if (s.includes("enum") || s.includes("gobuster") || s.includes("hydra") || s.includes("smb") || s.includes("ftp"))
    return "enum";
  if (s.includes("nmap") || s.includes("passive") || s.includes("lab-vbox") || s.includes("net-basic")) return "recon";
  if (s.includes("web")) return "enum";
  return "recon";
}

export function stars(n: number): string {
  return "★".repeat(n) + "☆".repeat(Math.max(0, 5 - n));
}

export function operationFromNext(next: NextPractice): { n: number; block?: StudyBlock } {
  const match = next.href.match(/\/focus\/([^/?]+)/);
  const id = match?.[1];
  const block = id ? getBlockById(id) : undefined;
  return { n: id ? operationNumber(id) : 0, block };
}

export function hudBar(filled: number): string {
  const f = Math.max(0, Math.min(10, filled));
  return "█".repeat(f) + "░".repeat(10 - f);
}

export function phaseIndex(p: KillPhase): number {
  return KILL_CHAIN.findIndex((x) => x.id === p);
}

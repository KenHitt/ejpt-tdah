import { StudyMonth } from "@/lib/types";
import { labWeek } from "./lab-week";
import { month1Week1 } from "./month1-week1";
import { month1Week2 } from "./month1-week2";
import { month1Week3 } from "./month1-week3";
import { month1Week4 } from "./month1-week4";
import { month2Week5 } from "./month2-week5";
import { month2Week6 } from "./month2-week6";
import { month2Week7 } from "./month2-week7";
import { month2Week8 } from "./month2-week8";
import { month3Week9 } from "./month3-week9";
import { month3Week10 } from "./month3-week10";
import { month3Week11 } from "./month3-week11";
import { month3Week12 } from "./month3-week12";

export const CURRICULUM: StudyMonth[] = [
  {
    id: "m0",
    title: "Semana 0 — Laboratorio local (obligatorio antes de practicar)",
    summary:
      "Kali es el SO del PC. VirtualBox solo corre las VMs víctimas (Host-Only). Sin VPN THM/HTB. No cuenta como semana de examen.",
    weeks: [labWeek],
  },
  {
    id: "m1",
    title: "Mes 1 — Fundamentos aplicados + cierre de huecos declarados",
    summary:
      "Recon/Nmap, enumeración (SMB/Web/credenciales) con foco en resolver la confusión Gobuster/Hydra/enum4linux, y Metasploit completo (search->use->set->exploit->post). Sin simulacros completos todavía, solo skill-checks cortos. Targets: Metasploitable 2 y Kioptrix 1.",
    weeks: [month1Week1, month1Week2, month1Week3, month1Week4],
  },
  {
    id: "m2",
    title: "Mes 2 — Web, Redes y Post-Explotación + Simulacros #1 y #2",
    summary:
      "SQLi, XSS, LFI/RFI, auth bypass, ARP spoofing/MITM, pivoting, privesc Linux/Windows. Arrancan los simulacros completos cronometrados (15 preguntas / 20 min / 70%) acumulando todo lo visto. Web: DVWA en Docker.",
    weeks: [month2Week5, month2Week6, month2Week7, month2Week8],
  },
  {
    id: "m3",
    title: "Mes 3 — Integración total, reporting y examen",
    summary:
      "Máquinas completas cronometradas (Kioptrix / VulnHub), reporting estilo eJPT, logística real del examen, y Simulacros #3, #4 y Final. Última semana sin contenido nuevo (solo consolidación).",
    weeks: [month3Week9, month3Week10, month3Week11, month3Week12],
  },
];

export function getAllWeeks() {
  return CURRICULUM.flatMap((m) => m.weeks);
}

export function getAllBlocks() {
  return getAllWeeks().flatMap((w) => w.blocks);
}

export function getBlockById(id: string) {
  return getAllBlocks().find((b) => b.id === id);
}

export function getWeekById(id: string) {
  return getAllWeeks().find((w) => w.id === id);
}

export function getMonthById(id: string) {
  return CURRICULUM.find((m) => m.id === id);
}

/** Semanas que cuentan para el pool de simulacros (1-12). Excluye laboratorio m0. */
export function getExamWeeks() {
  return getAllWeeks().filter((w) => w.monthId !== "m0");
}

/** Índice global de semana (1-12). Lab m0 no entra. */
export function globalWeekIndex(weekId: string): number {
  if (weekId === "m0-w0") return 0;
  const idx = getExamWeeks().findIndex((w) => w.id === weekId);
  return idx + 1;
}

export const TOTAL_BLOCKS = getAllBlocks().length;

export function computeCurrentGlobalWeek(blockStatus: Record<string, string>): number {
  const weeks = getExamWeeks();
  let maxWeek = 1;
  weeks.forEach((w, idx) => {
    const anyCompleted = w.blocks.some((b) => blockStatus[b.id] === "completed");
    if (anyCompleted) maxWeek = Math.max(maxWeek, idx + 1);
  });
  return maxWeek;
}

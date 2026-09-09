import { QuizQuestion } from "@/lib/types";
import { QUIZ_BANK, questionsForSubtopic } from "@/content/quizbank";

export interface InternalMock {
  id: string;
  titleEs: string;
  level: "fundamental" | "intermediate" | "mixed" | "timed" | "final";
  descriptionEs: string;
  durationSec: number;
  count: number;
  subtopicIds: string[];
}

/** Internal readiness assessments. No son el examen INE. */
export const V8_MOCKS: InternalMock[] = [
  {
    id: "mock-01",
    titleEs: "MOCK 01 — Fundamental",
    level: "fundamental",
    descriptionEs: "Lab, Linux, networking, recon. Internal readiness.",
    durationSec: 15 * 60,
    count: 12,
    subtopicIds: ["lab-vbox", "linux-basic", "net-basic", "nmap-basic"],
  },
  {
    id: "mock-02",
    titleEs: "MOCK 02 — Intermediate",
    level: "intermediate",
    descriptionEs: "Enum, SMB, HTTP, Metasploit options.",
    durationSec: 18 * 60,
    count: 12,
    subtopicIds: ["enum4linux", "gobuster-dir", "msf-options", "msf-lhost-lport", "tool-selection"],
  },
  {
    id: "mock-03",
    titleEs: "MOCK 03 — Mixed",
    level: "mixed",
    descriptionEs: "Web + exploitation + post. Dominios mezclados.",
    durationSec: 20 * 60,
    count: 15,
    subtopicIds: ["web-sqli", "web-xss", "web-lfi-rfi", "exploit-linux", "msf-sysinfo"],
  },
  {
    id: "mock-04",
    titleEs: "MOCK 04 — Timed",
    level: "timed",
    descriptionEs: "Reloj. Misma dificultad mixta. 70% = Learning Pass interno.",
    durationSec: 20 * 60,
    count: 15,
    subtopicIds: ["nmap-basic", "tool-selection", "web-sqli", "privesc-linux", "net-pivoting"],
  },
  {
    id: "mock-05",
    titleEs: "MOCK 05 — Final boss (interno)",
    level: "final",
    descriptionEs: "Acumulativo. No representa los criterios oficiales de INE.",
    durationSec: 25 * 60,
    count: 18,
    subtopicIds: [
      "lab-vbox",
      "nmap-basic",
      "tool-selection",
      "web-sqli",
      "msf-lhost-lport",
      "privesc-linux",
      "reporting",
      "exam-logistics",
    ],
  },
];

export const V8_EXTRA_QUIZ: QuizQuestion[] = [
  {
    id: "v8-win-1",
    subtopicId: "privesc-windows",
    type: "single",
    globalWeek: 8,
    promptEn: "whoami /priv is primarily used to:",
    promptEs: "whoami /priv sirve principalmente para:",
    options: [
      "Exploit a named pipe automatically",
      "Inspect the current token privileges",
      "Dump NTDS.dit",
      "Replace BloodHound",
    ],
    correctAnswer: "1",
    explanationEs: "Es enumeración del token. Un privilegio (p. ej. SeImpersonate) cambia la hipótesis, no lanza el exploit.",
  },
  {
    id: "v8-pivot-1",
    subtopicId: "net-pivoting",
    type: "single",
    globalWeek: 7,
    promptEn: "You need a pivot when:",
    promptEs: "Necesitas pivot cuando:",
    options: [
      "Kali already pings the target on vboxnet",
      "A compromised host can reach a network Kali cannot",
      "You want a louder nmap -T5",
      "SSH is closed",
    ],
    correctAnswer: "1",
    explanationEs: "Reachability. Si Kali ya ve el host, no es pivot. Dual-homed + timeout desde Kali = candidato.",
  },
  {
    id: "v8-osint-1",
    subtopicId: "passive-recon",
    type: "single",
    globalWeek: 1,
    promptEn: "Passive public information is most useful to:",
    promptEs: "La información pública pasiva sirve sobre todo para:",
    options: [
      "Replace Host-Only nmap",
      "Adjust strategy (tech, usernames) inside scope",
      "Authorize scanning the Internet",
      "Skip enumeration",
    ],
    correctAnswer: "1",
    explanationEs: "OSINT cambia hipótesis. No es autorización de ataque ni sustituye el lab.",
  },
  {
    id: "v8-mod-1",
    subtopicId: "msf-lhost-lport",
    type: "single",
    globalWeek: 4,
    promptEn: "In a reverse payload template, LHOST must be:",
    promptEs: "En un template reverse, LHOST debe ser:",
    options: [
      "The victim IP",
      "Your attacker IP on the lab NIC",
      "8.8.8.8",
      "Always 127.0.0.1",
    ],
    correctAnswer: "1",
    explanationEs: "La víctima llama a ti. Mide vboxnet. RHOST es el objetivo.",
  },
  {
    id: "v8-chain-1",
    subtopicId: "full-chain",
    type: "single",
    globalWeek: 9,
    promptEn: "Open ports 80, 445 and 22. Lowest-risk next step?",
    promptEs: "Puertos 80, 445 y 22. ¿Siguiente paso de menor riesgo?",
    options: [
      "SSH brute force with no username",
      "Enumerate one surface (SMB or HTTP) or gather versions",
      "Random public exploit from the first Google hit",
      "Stop and submit the exam",
    ],
    correctAnswer: "1",
    explanationEs: "open ≠ explotado. Enum o -sV. Hydra SSH sin user es ruido.",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickMockQuestions(mock: InternalMock): QuizQuestion[] {
  const pool = [
    ...mock.subtopicIds.flatMap((id) => questionsForSubtopic(id)),
    ...V8_EXTRA_QUIZ.filter((q) => mock.subtopicIds.includes(q.subtopicId)),
  ];
  const unique = Array.from(new Map(pool.map((q) => [q.id, q])).values());
  const source = unique.length >= mock.count ? unique : [...unique, ...shuffle(QUIZ_BANK)];
  return shuffle(source).slice(0, Math.min(mock.count, source.length));
}

export function getMock(id: string) {
  return V8_MOCKS.find((m) => m.id === id);
}

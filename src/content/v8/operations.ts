import { DecisionScenario } from "@/lib/types";
import {
  ATTACK_CHAIN_SRS,
  EXPLOIT_MOD_DRILL,
  LFI_NOT_RCE_DRILL,
  LINUX_PERM_DRILL,
  LINUX_PRIVESC_DRILL,
  MSF_LHOST_DRILL,
  OSINT_STRATEGY_DRILL,
  PIVOT_TOPOLOGY_DRILL,
  POST_LOOT_DRILL,
  SQLI_MANUAL_DRILL,
  VULN_MATCH_DRILL,
  WEB_CHAIN_LOGIN_DRILL,
  WIN_PRIVESC_DRILL,
} from "@/content/v8/drills";
import { EXTRA_DECISION_DRILLS, NMAP_INTERPRET_DRILL, NMAP_NEXT_STEP } from "@/content/decision-drills";

export interface InternalMachine {
  id: string;
  n: number;
  titleEs: string;
  kind: "machine" | "boss";
  objectiveEs: string;
  estimatedMin: number;
  skillIds: string[];
  /** Skills combinadas; no se listan en la UI de misión como spoilers del boss. */
  hideSkills?: boolean;
  scenarios: DecisionScenario[];
}

/** Máquinas educativas internas (mesa + razonamiento). No sustituyen VirtualBox. */
export const V8_MACHINES: InternalMachine[] = [
  {
    id: "m01",
    n: 1,
    titleEs: "Machine 01 — Recon",
    kind: "machine",
    objectiveEs: "Identificar superficie a partir de un output. No explotar.",
    estimatedMin: 25,
    skillIds: ["recon", "nmap"],
    scenarios: [NMAP_INTERPRET_DRILL, OSINT_STRATEGY_DRILL],
  },
  {
    id: "m02",
    n: 2,
    titleEs: "Machine 02 — Enumeration",
    kind: "machine",
    objectiveEs: "Priorizar servicios y elegir herramienta. No lanzar cinco tools a la vez.",
    estimatedMin: 30,
    skillIds: ["enumeration", "nmap"],
    scenarios: [NMAP_NEXT_STEP, ...EXTRA_DECISION_DRILLS],
  },
  {
    id: "m03",
    n: 3,
    titleEs: "Machine 03 — SMB",
    kind: "machine",
    objectiveEs: "De 445/139 a un plan de enum (users/shares). Acceso = hipótesis, no un exe.",
    estimatedMin: 30,
    skillIds: ["smb", "enumeration"],
    scenarios: [NMAP_NEXT_STEP],
  },
  {
    id: "m04",
    n: 4,
    titleEs: "Machine 04 — Web",
    kind: "machine",
    objectiveEs: "Cadena HTTP → dirs → login/upload → parámetro. Vuln = siguiente pregunta.",
    estimatedMin: 35,
    skillIds: ["http-enum", "web", "sqli"],
    scenarios: [WEB_CHAIN_LOGIN_DRILL, SQLI_MANUAL_DRILL],
  },
  {
    id: "m05",
    n: 5,
    titleEs: "Machine 05 — Exploitation",
    kind: "machine",
    objectiveEs: "De versión a candidato y de options a session (LHOST). Verificar acceso, no 'run a ciegas'.",
    estimatedMin: 40,
    skillIds: ["vuln", "metasploit", "exploit-mod"],
    scenarios: [VULN_MATCH_DRILL, MSF_LHOST_DRILL, EXPLOIT_MOD_DRILL],
  },
  {
    id: "m06",
    n: 6,
    titleEs: "Machine 06 — Linux PrivEsc",
    kind: "machine",
    objectiveEs: "Interpretar denied, sudo y SUID. LinPEAS no razona el examen.",
    estimatedMin: 35,
    skillIds: ["linux", "privesc-linux"],
    scenarios: [LINUX_PERM_DRILL, LINUX_PRIVESC_DRILL],
  },
  {
    id: "m07",
    n: 7,
    titleEs: "Machine 07 — Windows PrivEsc",
    kind: "machine",
    objectiveEs: "Users, grupos, privilegios, servicios. Modelo mental, no el PC de la familia.",
    estimatedMin: 35,
    skillIds: ["privesc-windows"],
    scenarios: [WIN_PRIVESC_DRILL],
  },
  {
    id: "m08",
    n: 8,
    titleEs: "Machine 08 — Pivoting",
    kind: "machine",
    objectiveEs: "Descubrir qué red es alcanzable desde cada host. Forward/SOCKS como concepto.",
    estimatedMin: 40,
    skillIds: ["pivoting", "networking"],
    scenarios: [PIVOT_TOPOLOGY_DRILL],
  },
  {
    id: "m09",
    n: 9,
    titleEs: "Machine 09 — Full chain",
    kind: "machine",
    objectiveEs: "Recon → enum → hipótesis → acceso conceptual → post. Tú decides si NO explotar aún.",
    estimatedMin: 50,
    skillIds: ["chains", "enumeration", "web", "exploitation"],
    scenarios: [ATTACK_CHAIN_SRS, POST_LOOT_DRILL, LFI_NOT_RCE_DRILL],
  },
  {
    id: "m10",
    n: 10,
    titleEs: "Machine 10 — Boss",
    kind: "boss",
    objectiveEs: "Operación mixta. No se te dice qué skill usar. TIME + reglas de lab.",
    estimatedMin: 60,
    skillIds: ["nmap", "enumeration", "web", "exploitation", "privesc-linux"],
    hideSkills: true,
    scenarios: [NMAP_INTERPRET_DRILL, WEB_CHAIN_LOGIN_DRILL, LINUX_PRIVESC_DRILL, PIVOT_TOPOLOGY_DRILL],
  },
];

export const V8_BOSSES: InternalMachine[] = [
  {
    id: "boss-01",
    n: 1,
    titleEs: "Boss 01 — Recon + enum + web + exploitation",
    kind: "boss",
    objectiveEs: "Una superficie mixta. Descubre el camino. No hay checklist de skills.",
    estimatedMin: 55,
    skillIds: ["recon", "enumeration", "web", "exploitation"],
    hideSkills: true,
    scenarios: [NMAP_NEXT_STEP, WEB_CHAIN_LOGIN_DRILL, VULN_MATCH_DRILL],
  },
  {
    id: "boss-02",
    n: 2,
    titleEs: "Boss 02 — SMB + creds + Windows + privesc",
    kind: "boss",
    objectiveEs: "Credenciales y Windows. El nombre de la técnica no aparece en el título de la misión.",
    estimatedMin: 50,
    skillIds: ["smb", "post", "privesc-windows"],
    hideSkills: true,
    scenarios: [NMAP_NEXT_STEP, POST_LOOT_DRILL, WIN_PRIVESC_DRILL],
  },
  {
    id: "boss-03",
    n: 3,
    titleEs: "Boss 03 — Pivot + internal enum + exploitation",
    kind: "boss",
    objectiveEs: "Topología primero. Si Kali ya ve el host, no inventes pivot.",
    estimatedMin: 55,
    skillIds: ["pivoting", "enumeration", "exploit-mod"],
    hideSkills: true,
    scenarios: [PIVOT_TOPOLOGY_DRILL, VULN_MATCH_DRILL, MSF_LHOST_DRILL],
  },
];

export function getMachine(id: string) {
  return [...V8_MACHINES, ...V8_BOSSES].find((m) => m.id === id);
}

export function allOperations() {
  return [...V8_MACHINES, ...V8_BOSSES];
}

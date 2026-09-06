import { DecisionScenario } from "@/lib/types";

export const EXAM_REASONING_INTRO = `EXAM REASONING MODE

No recibirás comandos.
No recibirás pistas.
No recibirás la herramienta que debes utilizar.

Tendrás que explicar tu metodología.

Criterio interno de la plataforma (no es el examen INE).
Utiliza el razonamiento solo sobre labs/objetivos autorizados.`;

export const EXAM_REASONING_SCENARIOS: DecisionScenario[] = [
  {
    id: "er-box15",
    titleEs: "Escenario 1 — primer vistazo",
    setupEs: `TARGET: 10.10.10.15  (rango de examen simulado; en tu casa NO lo escanees: razona el output dado)

Nmap:
21/tcp open ftp
22/tcp open ssh
80/tcp open http
445/tcp open smb`,
    checks: [
      {
        id: "first",
        promptEs: "1. ¿Qué haces primero?",
        keywordAny: [["enum"], ["version"], ["sV"], ["document"], ["anot"], ["prioriz"]],
        explanationEs:
          "No Hydra a ciegas ni exploits. Anotar, completar versiones si faltan, priorizar superficie (SMB/HTTP/FTP).",
        failKind: "reasoning",
        subtopicId: "nmap-basic",
        domain: "scanning",
        critical: true,
      },
      {
        id: "prio",
        promptEs: "2. ¿Qué servicio priorizas y 3. qué enumeras?",
        keywordAny: [["smb"], ["http"], ["ftp"], ["share"], ["dir"], ["anon"]],
        explanationEs: "SMB (shares/users) o HTTP (rutas) o FTP anonymous. SSH no es el primer enum de directorios.",
        failKind: "reasoning",
        subtopicId: "tool-selection",
        domain: "enumeration",
        critical: true,
      },
      {
        id: "info",
        promptEs: "4. ¿Qué información buscas?",
        keywordAny: [["usuario"], ["version"], ["share"], ["ruta"], ["credencial"], ["banner"]],
        explanationEs: "Usuarios, shares, rutas, banners, versiones — inputs para el SIGUIENTE paso, no un PoC.",
        failKind: "reasoning",
        subtopicId: "tool-selection",
        domain: "enumeration",
      },
      {
        id: "tools",
        promptEs: "5. ¿Qué herramientas considerarías (nombres de familia, no un payload)?",
        keywordAny: [["enum4linux"], ["smb"], ["gobuster"], ["ftp"], ["nmap"], ["hydra"]],
        explanationEs:
          "Familias: enum SMB, dirbust web, FTP anon, Nmap más profundo. Hydra solo con usuario. Metasploit cuando haya versión coincidente, no antes.",
        failKind: "reasoning",
        subtopicId: "tool-selection",
        domain: "enumeration",
      },
      {
        id: "pivot",
        promptEs: "6. ¿Qué resultado cambiaría tu estrategia?",
        keywordAny: [["anon"], ["write"], ["login"], ["403"], ["version"], ["filtr"], ["nada"]],
        explanationEs:
          "Ejemplos: FTP anonymous; share WRITE; form de login (entonces Hydra); 445 filtrado (cambia a 80); versión concreta (entonces search/msf, no al azar).",
        failKind: "reasoning",
        subtopicId: "full-chain",
        domain: "exploitation",
      },
      {
        id: "next",
        promptEs: "7. ¿Cuál sería tu siguiente movimiento?",
        keywordAny: [["enum"], ["document"], ["smb"], ["http"], ["version"]],
        explanationEs: "Una acción de enum o de completar recon. Evidence empieza ya (notas), no al final.",
        failKind: "reasoning",
        subtopicId: "reporting",
        domain: "reporting",
      },
    ],
  },
  {
    id: "er-shell",
    titleEs: "Escenario 2 — ya hay sesión",
    setupEs: `Misma máquina. Tienes una sesión de bajo privilegio en Linux. No te dicen el comando que usaste.`,
    checks: [
      {
        id: "post",
        promptEs: "¿Qué haces en post-explotación y qué evidencia guardas?",
        keywordAny: [["whoami"], ["id"], ["sysinfo"], ["hostname"], ["anot"]],
        explanationEs: "Identidad y SO primero. Notas = evidence. No hashdump SAM en Linux.",
        failKind: "reasoning",
        subtopicId: "msf-sysinfo",
        domain: "post-exploitation",
        critical: true,
      },
      {
        id: "privesc",
        promptEs: "¿Cuándo pasarías a privilege escalation?",
        keywordAny: [["no root"], ["uid"], ["bajo"], ["user"], ["privileg"]],
        explanationEs: "Si no eres root/SYSTEM y el objetivo lo pide. Si ya eres root, documenta y no inventes un kernel exploit.",
        failKind: "reasoning",
        subtopicId: "privesc-linux",
        domain: "post-exploitation",
        critical: true,
      },
    ],
  },
];

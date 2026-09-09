import { DecisionScenario } from "@/lib/types";

const LAB = "Solo contra tu lab autorizado (Host-Only / DVWA local / alcance escrito).";

function mc(
  id: string,
  promptEs: string,
  choices: DecisionScenario["checks"][0]["choices"],
  extra: Partial<DecisionScenario["checks"][0]> = {}
): DecisionScenario["checks"][0] {
  const ok = choices?.find((c) => c.ok);
  return {
    id,
    promptEs,
    choices,
    explanationEs: ok?.whyRightEs ?? extra.explanationEs ?? "",
    failKind: extra.failKind ?? "reasoning",
    subtopicId: extra.subtopicId ?? "tool-selection",
    domain: extra.domain,
    critical: extra.critical,
    justifyPromptEs: extra.justifyPromptEs,
    justifyKeywords: extra.justifyKeywords,
    whatMissedEs: extra.whatMissedEs,
    betterApproachEs: extra.betterApproachEs,
    evidenceEs: extra.evidenceEs,
    hints: extra.hints,
    walkthroughEs: extra.walkthroughEs,
    pedagogy: extra.pedagogy,
  };
}

export const NET_OPEN_NOT_VULN: DecisionScenario = {
  id: "v91-net-open-not-vuln",
  titleEs: "Networking — open ≠ vulnerable",
  setupEs: `${LAB}\n\nNmap: 22/tcp open ssh. No hay versión. El brief pide acceso, no un inventario.`,
  checks: [
    mc(
      "next",
      "¿Qué significa 22 open para tu next step?",
      [
        {
          id: "a",
          textEs: "A. SSH está explotado. Lanza un exploit de OpenSSH al azar.",
          whyWrongEs: "Open es un servicio escuchando, no un CVE. Sin versión ni match, es lotería.",
        },
        {
          id: "b",
          textEs: "B. Hay un listener SSH. Siguiente: versionar/banner y decidir enum (users/keys), no 'explotar el 22'.",
          ok: true,
          whyRightEs: "Puerto open = pregunta. La decisión es cómo enumerar, no un payload.",
        },
        {
          id: "c",
          textEs: "C. Ignora 22 porque 'eJPT es solo HTTP'.",
          whyWrongEs: "SSH es superficie típica. Prioriza, no borres.",
        },
      ],
      {
        subtopicId: "net-basic",
        domain: "networking",
        pedagogy: "DECISION_FAILURE",
        evidenceEs: "22/tcp open, sin versión.",
        whatMissedEs: "Open describe estado del puerto, no impacto.",
        betterApproachEs: "Versiona. Luego users/keys/creds reutilizadas — no un exploit ciego.",
        hints: [
          "¿Qué pregunta responde 'open'?",
          "¿Ya sabes la versión o solo el puerto?",
          "Nmap -sV / banner, no searchsploit todavía.",
          "22/tcp open ssh → listener, no shell.",
          "Elige B: inventario accionable, no exploit.",
        ],
        walkthroughEs: "open ≠ vulnerable. Versiona SSH y enumera. No lances un CVE por el número de puerto.",
      }
    ),
  ],
};

export const SSH_FTP_PRIORITY: DecisionScenario = {
  id: "v91-ssh-ftp-priority",
  titleEs: "SSH/FTP — Hydra no es el primer movimiento",
  setupEs: `${LAB}\n\n21/tcp ftp, 22/tcp ssh. Banner FTP: vsftpd. No hay usuario. Objetivo: hallar creds o files, no DoS.`,
  checks: [
    mc(
      "first",
      "¿Siguiente prioridad?",
      [
        {
          id: "a",
          textEs: "A. hydra -l root -P rockyou.txt ssh://… porque 22 está open.",
          whyWrongEs: "Sin usuario confirmado y sin política, es ruido y puede lockear. Hydra necesita un user.",
        },
        {
          id: "b",
          textEs: "B. FTP: anonymous / banner / listado. SSH: banner y users de otras superficies (SMB/web) antes de brute.",
          ok: true,
          whyRightEs: "Anonymous y banners cambian el plan. Brute es last resort con usuario.",
        },
        {
          id: "c",
          textEs: "C. sqlmap contra 21 porque 'inyección'.",
          whyWrongEs: "FTP no es un parámetro HTTP.",
        },
      ],
      {
        subtopicId: "ftp-ssh-enum",
        domain: "ssh-ftp",
        pedagogy: "DECISION_FAILURE",
        evidenceEs: "21+22 open, sin user.",
        whatMissedEs: "Hydra no inventa el username.",
        betterApproachEs: "FTP anonymous → loot. SSH con user de enum, no root a ciegas.",
        hints: [
          "¿Tienes un username?",
          "FTP a menudo habla sin creds.",
          "ftp anonymous / banner vs Hydra.",
          "Prueba anonymous; no -l root.",
          "Elige B.",
        ],
      }
    ),
  ],
};

export const EXPLOIT_VERIFY: DecisionScenario = {
  id: "v91-exploit-verify",
  titleEs: "Exploitation — verificar acceso",
  setupEs: `${LAB}\n\nLanzaste un módulo. La consola no muestra meterpreter. El objetivo era acceso, no 'run'.`,
  checks: [
    mc(
      "verify",
      "¿Cómo interpretas el resultado?",
      [
        {
          id: "a",
          textEs: "A. Éxito: el módulo terminó sin traceback.",
          whyWrongEs: "Sin sesión no hay acceso. El teatro del run no es evidencia.",
        },
        {
          id: "b",
          textEs: "B. Sin sesión: revisa LHOST/NIC, payload reverse vs bind, y si el match de versión era hipótesis.",
          ok: true,
          whyRightEs: "Verificar = sysinfo/id/shell. Diagnostica opciones antes de otro CVE.",
        },
        {
          id: "c",
          textEs: "C. Cambia a un kernel exploit porque 'hay que privesc'.",
          whyWrongEs: "Todavía no hay user. PrivEsc no aplica.",
        },
      ],
      {
        subtopicId: "reverse-vs-bind",
        domain: "exploitation",
        pedagogy: "INTERPRETATION_FAILURE",
        evidenceEs: "Run sin sesión.",
        whatMissedEs: "Éxito = acceso observable.",
        betterApproachEs: "show options → LHOST en vboxnet → sessions. Metasploit no es caja negra.",
        hints: [
          "¿Tienes una sesión?",
          "Reverse necesita que la víctima alcance TU LHOST.",
          "Revisa NIC del lab, no otro exploit.",
          "sessions -l / sysinfo.",
          "Elige B.",
        ],
      }
    ),
  ],
};

export const GOBUSTER_TRANSFER: DecisionScenario = {
  id: "v91-gobuster-transfer",
  titleEs: "HTTP transfer — otra app, otras extensiones",
  setupEs: `${LAB}\n\nNo es DVWA. 80/tcp. Dirbuster con .php no encuentra nada. Ves 403 en /admin y 200 en /api/health (JSON).`,
  checks: [
    mc(
      "next",
      "¿Qué haces?",
      [
        {
          id: "a",
          textEs: "A. Repetir exactamente gobuster -x php como en el taller.",
          whyWrongEs: "Memorizaste DVWA. Esta app habla JSON y 403 en /admin.",
        },
        {
          id: "b",
          textEs: "B. Adaptar: otras extensiones/wordlists, interpretar 403 como hallazgo, enumerar /api y parámetros. Luego hipótesis.",
          ok: true,
          whyRightEs: "Transfer: unknown app → discover → identify. 403 no es el fin.",
        },
        {
          id: "c",
          textEs: "C. sqlmap -u DVWA porque el módulo SQLi está completed.",
          whyWrongEs: "Completed ≠ este endpoint es SQLi.",
        },
      ],
      {
        subtopicId: "gobuster-dir",
        domain: "http-enum",
        pedagogy: "DECISION_FAILURE",
        evidenceEs: "403 /admin, JSON /api/health.",
        whatMissedEs: "La metodología se transfiere; las extensiones no.",
        betterApproachEs: "Cambia wordlist/ext. Trata 403 y /api como superficie.",
        hints: [
          "¿Es la misma aplicación que el ejemplo?",
          "403 es información.",
          "API JSON ≠ login.php.",
          "Enumera /api y params.",
          "Elige B.",
        ],
      }
    ),
  ],
};

export const REPORT_FIELDS: DecisionScenario = {
  id: "v91-report-fields",
  titleEs: "Reporting — campos de un hallazgo",
  setupEs: `${LAB}\n\nEncontraste SQLi en /item?id=1 en 192.168.56.20. El brief pide un finding, no un ensayo.`,
  checks: [
    mc(
      "fields",
      "¿Qué debe incluir el finding técnico?",
      [
        {
          id: "a",
          textEs: "A. Solo 'la web es insegura' y un emoji.",
          whyWrongEs: "No hay asset, no hay repro, no hay evidencia.",
        },
        {
          id: "b",
          textEs: "B. Asset, vuln, descripción, pasos de repro, evidencia (request/output), impacto, severidad y remediation. Executive summary aparte, corto.",
          ok: true,
          whyRightEs: "Finding = reproducible. El resumen ejecutivo no sustituye los pasos.",
        },
        {
          id: "c",
          textEs: "C. Pegar todo sqlmap -v 6 sin filtrar.",
          whyWrongEs: "Ruido. Extrae el string que responde la pregunta.",
        },
      ],
      {
        subtopicId: "reporting",
        domain: "reporting",
        pedagogy: "KNOWLEDGE_FAILURE",
        evidenceEs: "SQLi en id=1.",
        whatMissedEs: "Estructura del finding vs narrativa.",
        betterApproachEs: "Plantilla: asset → vuln → repro → evidencia → impacto → fix.",
        hints: [
          "¿Un tercero podría reproducirlo?",
          "Falta el activo afectado.",
          "Campos: asset, repro, evidencia.",
          "No un dump de tool.",
          "Elige B.",
        ],
      }
    ),
  ],
};

export const MANUAL_POC_READ: DecisionScenario = {
  id: "v91-manual-poc-read",
  titleEs: "Exploit modification — leer el PoC",
  setupEs: `${LAB}\n\nVes un template con rhost = 'CHANGE_ME', path = '/cgi-bin/x', payload URL-encoded. No es un 0-day que debas escribir.`,
  checks: [
    mc(
      "read",
      "¿Qué haces primero?",
      [
        {
          id: "a",
          textEs: "A. python exploit.py y rezar.",
          whyWrongEs: "Sin sustituir IPs del lab, el PoC habla con CHANGE_ME.",
        },
        {
          id: "b",
          textEs: "B. Identificar parámetros (RHOST/LHOST/LPORT/PATH), sustituir por IPs medidas, entender por qué fallaría (path/versión), y solo entonces ejecutar en lab.",
          ok: true,
          whyRightEs: "Metasploit y el PoC son herramientas. Tú rellenas el contexto medido.",
        },
        {
          id: "c",
          textEs: "C. Publicar el PoC contra Internet para 'probar'.",
          whyWrongEs: "Fuera de alcance. Delito.",
        },
      ],
      {
        subtopicId: "msf-lhost-lport",
        domain: "exploit-mod",
        pedagogy: "METHODOLOGY_FAILURE",
        evidenceEs: "CHANGE_ME en el template.",
        whatMissedEs: "Leer antes de run.",
        betterApproachEs: "Lista variables → IPs de ip addr → path del banner.",
        hints: [
          "¿Qué strings son placeholders?",
          "Mide LHOST en vboxnet.",
          "RHOST/LHOST/PATH.",
          "Sustituye CHANGE_ME.",
          "Elige B.",
        ],
      }
    ),
  ],
};

export const V91_ALL_DRILLS: DecisionScenario[] = [
  NET_OPEN_NOT_VULN,
  SSH_FTP_PRIORITY,
  EXPLOIT_VERIFY,
  GOBUSTER_TRANSFER,
  REPORT_FIELDS,
  MANUAL_POC_READ,
];

export const V91_DRILLS_BY_SKILL: Record<string, DecisionScenario[]> = {
  networking: [NET_OPEN_NOT_VULN],
  "ssh-ftp": [SSH_FTP_PRIORITY],
  exploitation: [EXPLOIT_VERIFY],
  "http-enum": [GOBUSTER_TRANSFER],
  web: [GOBUSTER_TRANSFER],
  reporting: [REPORT_FIELDS],
  "exploit-mod": [MANUAL_POC_READ],
};

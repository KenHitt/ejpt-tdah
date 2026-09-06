import { DecisionScenario } from "@/lib/types";

const SAFETY = "Solo contra tu lab autorizado (Host-Only / DVWA local).";

export const NMAP_INTERPRET_DRILL: DecisionScenario = {
  id: "nmap-ms2-classic",
  titleEs: "Interpretar un resultado Nmap",
  setupEs:
    SAFETY +
    "\n\nSupón que ESTE es el output de TU Metasploitable (si el tuyo difiere, razona el tuyo igual). No recibes el comando que debes lanzar ahora.",
  output: `21/tcp   open  ftp
22/tcp   open  ssh
80/tcp   open  http
139/tcp  open  netbios-ssn
445/tcp  open  microsoft-ds`,
  checks: [
    {
      id: "obs",
      promptEs: "¿Qué observas?",
      keywordAny: [["ftp"], ["ssh"], ["http"], ["smb"], ["cinco"], ["varios"], ["open"]],
      explanationEs:
        "Cinco TCP open: FTP, SSH, HTTP, SMB (139/445). No es un único servicio. open ≠ explotado. No hay versiones aquí (faltaría -sV).",
      failKind: "reasoning",
      subtopicId: "nmap-basic",
      domain: "nmap-basic",
    },
    {
      id: "first",
      promptEs: "¿Qué servicios investigarías primero y por qué? (prioridad, no 'todos a la vez')",
      justifyPromptEs: "Por qué ese orden (una frase).",
      keywordAny: [
        ["smb"],
        ["445"],
        ["http"],
        ["80"],
        ["ftp"],
        ["anon"],
      ],
      explanationEs:
        "Una prioridad razonable: SMB (139/445) o HTTP (80) o FTP anonymous — superficie de enum clara. SSH (22) suele ser más lento (creds) y no es el primer 'directorio'. No hay una única letra mágica; el porqué importa.",
      failKind: "reasoning",
      subtopicId: "tool-selection",
      domain: "enumeration",
    },
    {
      id: "tool",
      promptEs: "¿Qué herramienta usarías para ESA prioridad?",
      keywordAny: [
        ["enum4linux"],
        ["smbclient"],
        ["smbmap"],
        ["gobuster"],
        ["ftp"],
        ["curl"],
      ],
      explanationEs:
        "445 → enum4linux/smbclient. 80 → curl/Gobuster. 21 → FTP anonymous/banner. 22 → banner/SSH, Hydra SOLO con usuario conocido. No Metasploit aleatorio.",
      failKind: "reasoning",
      subtopicId: "tool-selection",
      domain: "enumeration",
      critical: true,
    },
    {
      id: "next",
      promptEs: "¿Cuál sería tu siguiente paso concreto (una acción)?",
      keywordAny: [
        ["enum"],
        ["smb"],
        ["gobuster"],
        ["dir"],
        ["anonymous"],
        ["-sV"],
        ["version"],
      ],
      explanationEs:
        "Siguiente = enumerar ESE servicio o completar -sV si este output no tiene VERSION. No 'buscar exploits al azar'.",
      failKind: "reasoning",
      subtopicId: "nmap-basic",
      domain: "enumeration",
    },
  ],
};

export const NMAP_NEXT_STEP: DecisionScenario = {
  id: "nmap-next-step",
  titleEs: "¿Cuál es tu siguiente movimiento?",
  setupEs:
    "Encontraste en el lab (autorizado):\n21 FTP · 22 SSH · 80 HTTP · 445 SMB\n\nElige y JUSTIFICA. Una opción plausible puede ser mala metodología.",
  checks: [
    {
      id: "choice",
      promptEs: "Siguiente movimiento",
      choices: [
        {
          id: "a",
          textEs: "A. Ejecutar Hydra inmediatamente contra SSH.",
          whyWrongEs:
            "Hydra contra SSH sin usuario y sin enum es ruido de reloj y puede tirar el guest. 22 open ≠ 'brute ya'. Primero enum de superficie (SMB/HTTP/FTP) y un usuario si existe.",
        },
        {
          id: "b",
          textEs: "B. Enumerar HTTP.",
          ok: true,
          whyRightEs:
            "80 open → superficie web (rutas, forms). Gobuster/curl. No es la única buena; debe ir con un porqué (contenido oculto, no shell).",
        },
        {
          id: "c",
          textEs: "C. Ejecutar enumeración SMB.",
          ok: true,
          whyRightEs:
            "445/139 → enum4linux/smbclient. Usuarios y shares cambian el resto del box. Prioridad sólida en eJPT/MS2.",
        },
        {
          id: "d",
          textEs: "D. Buscar exploits aleatoriamente.",
          whyWrongEs:
            "Sin versión (-sV) y sin enum, searchsploit/msf search es lotería. El flujo es recon → enum → identificar → entonces módulo que coincida.",
        },
        {
          id: "e",
          textEs: "E. Hacer un escaneo más profundo (-sV / -sC / -p- si aún no).",
          ok: true,
          whyRightEs:
            "Si este output es solo puertos sin VERSION, profundizar es correcto ANTES de explotar. No sustituye enum de un servicio ya claro.",
        },
      ],
      justifyPromptEs: "¿Por qué esa opción y por qué no Hydra/exploits al azar?",
      justifyKeywords: ["enum", "version", "smb", "http", "ftp", "usuario", "prioridad", "sV", "-sv", "ruta", "share"],
      explanationEs:
        "B, C o E pueden ser Learning Pass según el porqué. A y D son fallo de razonamiento aunque 'el comando existiría'.",
      failKind: "reasoning",
      subtopicId: "tool-selection",
      domain: "enumeration",
      critical: true,
    },
  ],
};

export const ATTACK_PATH_DRILL: DecisionScenario = {
  id: "attack-path",
  titleEs: "Cadena: ¿por qué pasas al siguiente paso?",
  setupEs:
    "Cadena mental (no la marques como checklist vacía):\nRecon → Discovery → Enumeration → Vulnerability identification → Exploitation → Initial access → Post-exploitation → Privilege escalation → Evidence\n\nEn TU lab Host-Only. No inventes un CVE.",
  checks: [
    {
      id: "why-enum",
      promptEs: "Tienes hosts vivos y puertos. ¿Por qué NO saltas a Exploitation?",
      keywordAny: [["enum"], ["version"], ["servicio"], ["identificar"], ["sin adivinar"]],
      explanationEs:
        "Exploitation necesita un servicio+versión (o hallazgo de enum). Saltar = exploits aleatorios. Discovery ≠ acceso inicial.",
      failKind: "reasoning",
      subtopicId: "full-chain",
      domain: "exploitation",
    },
    {
      id: "why-post",
      promptEs: "Hay sesión (initial access). ¿Qué buscas en post-explotación ANTES de privesc, y por qué?",
      keywordAny: [["whoami"], ["sysinfo"], ["id"], ["evidencia"], ["usuario"], ["contexto"]],
      explanationEs:
        "sysinfo/getuid/whoami: quién eres y en qué SO. Privesc sin contexto es otro salto. Evidence = anotar, no 'ya gané'.",
      failKind: "reasoning",
      subtopicId: "msf-sysinfo",
      domain: "post-exploitation",
    },
    {
      id: "why-next",
      promptEs: "¿Por qué pasarías a privilege escalation (o por qué NO, en MS2 Linux como msfadmin)?",
      keywordAny: [["root"], ["privileg"], ["uid"], ["no hace falta"], ["ya"], ["msfadmin"]],
      explanationEs:
        "Si ya eres root, documenta evidencia y para. Si eres user bajo, entonces privesc. MS2 a menudo te deja en un contexto concreto: míralo, no asumas.",
      failKind: "reasoning",
      subtopicId: "privesc-linux",
      domain: "post-exploitation",
    },
  ],
};

export const WEEK1_DECISION_DRILLS: DecisionScenario[] = [NMAP_INTERPRET_DRILL, NMAP_NEXT_STEP];
export const WEEK4_DECISION_DRILLS: DecisionScenario[] = [ATTACK_PATH_DRILL];

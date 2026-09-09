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

/** Decisión de superficie SMB — no sustituye NMAP_NEXT_STEP. */
export const SMB_PRIORITY_DRILL: DecisionScenario = {
  id: "v9-smb-priority",
  titleEs: "SMB — qué enumerar primero",
  setupEs: `${LAB}\n\nNmap: 21 ftp, 22 ssh, 80 http, 139/445 microsoft-ds. No hay versiones. Objetivo: hallar creds o shares, no 'explotar el box'.`,
  checks: [
    mc(
      "first",
      "¿Qué investigas primero y por qué?",
      [
        {
          id: "a",
          textEs: "A. Hydra contra SSH root porque 22 está open.",
          whyWrongEs: "Open ≠ creds. Sin usuario, brute force es ruido y puede lockear.",
        },
        {
          id: "b",
          textEs: "B. Enumeración SMB (users/shares/null) porque 139/445 son una superficie de identidad típica.",
          ok: true,
          whyRightEs: "SMB suele revelar users/shares que cambian el resto del plan. No sustituye HTTP; es prioridad de identidad.",
        },
        {
          id: "c",
          textEs: "C. sqlmap contra el puerto 80 sin directorios ni parámetros.",
          whyWrongEs: "80 open no es SQLi. Falta HTTP enum.",
        },
      ],
      {
        subtopicId: "smb-manual",
        domain: "smb",
        justifyPromptEs: "¿Por qué esa superficie cambia el next step?",
        evidenceEs: "139/445 open, sin versión.",
        whatMissedEs: "Priorizar identidad (SMB) vs brute SSH ciego.",
        betterApproachEs: "SMB enum → anotar users/shares → luego HTTP o FTP con contexto.",
      }
    ),
  ],
};

export const SMB_TRANSFER_DRILL: DecisionScenario = {
  id: "v9-smb-transfer",
  titleEs: "SMB transfer — otro host, otros shares",
  setupEs: `${LAB}\n\nHost: FILE01. Shares: IPC$, ADMIN$, public (READ), finance (ACCESS DENIED). Objetivo: datos de negocio, no SYSTEM.`,
  checks: [
    mc(
      "next",
      "¿Siguiente paso metodológico?",
      [
        {
          id: "a",
          textEs: "A. Insistir en ADMIN$ porque el nombre suena a privilegio.",
          whyWrongEs: "Denied en ADMIN$ es esperado para un user bajo. No es el objetivo de negocio.",
        },
        {
          id: "b",
          textEs: "B. Listar y leer 'public', anotar denied en finance, buscar creds/usuarios que expliquen el denied.",
          ok: true,
          whyRightEs: "Transfer: mismo protocolo, distinta política. Lees lo permitido y usas el denied como hallazgo.",
        },
        {
          id: "c",
          textEs: "C. Repetir el mismo enum4linux del tutorial aunque el hostname sea FILE01.",
          whyWrongEs: "Memorizar el procedimiento del lab A no es transfer. Adapta objetivo y shares reales.",
        },
      ],
      {
        subtopicId: "smb-manual",
        domain: "smb",
        evidenceEs: "public READ, finance DENIED.",
        whatMissedEs: "Denied es evidencia, no un error de herramienta.",
        betterApproachEs: "Loot public → correlacionar users → no forzar ADMIN$.",
      }
    ),
  ],
};

export const NMAP_TRANSFER_DRILL: DecisionScenario = {
  id: "v9-nmap-transfer",
  titleEs: "Nmap transfer — otro CIDR, mismo método",
  setupEs: `${LAB}\n\nBrief: 10.10.10.0/28 (no /24). Un host up: 10.10.10.8. Ports: 22, 8080. No 80, no 445.`,
  checks: [
    mc(
      "scan",
      "¿Qué NO haces?",
      [
        {
          id: "a",
          textEs: "A. nmap -sn 10.0.0.0/8 'por si hay más'.",
          ok: true,
          whyRightEs: "Fuera de alcance. El método (discovery → ports → versions) se transfiere; el rango no.",
        },
        {
          id: "b",
          textEs: "B. Versionar 22 y 8080 en 10.10.10.8 y enumerar HTTP en 8080.",
          whyWrongEs: "Esto SÍ es el método correcto — la pregunta era qué NO hacer.",
        },
        {
          id: "c",
          textEs: "C. Copiar flags de un writeup de Metasploitable 2.",
          whyWrongEs: "También incorrecto, pero A viola alcance de forma más grave.",
        },
      ],
      {
        subtopicId: "nmap-basic",
        domain: "nmap",
        failKind: "reasoning",
        evidenceEs: "Alcance /28, un host, 22+8080.",
        whatMissedEs: "Transfer = mismo razonamiento, distinto mapa.",
        betterApproachEs: "Respeta CIDR. Versiona lo que hay, no lo que 'suele haber'.",
      }
    ),
  ],
};

export const ENUM_WHEN_DRILL: DecisionScenario = {
  id: "v9-enum-when",
  titleEs: "Enumeration — cuándo parar de escanear",
  setupEs: `${LAB}\n\nYa tienes: hosts, top ports, banners en 80 y 445. El reloj corre.`,
  checks: [
    mc(
      "stop",
      "¿Siguiente movimiento?",
      [
        {
          id: "a",
          textEs: "A. -p- en todos los hosts antes de tocar un servicio.",
          whyWrongEs: "Full port en masa puede ser útil después; ahora ya hay superficie accionable.",
        },
        {
          id: "b",
          textEs: "B. Enumerar HTTP y SMB con hipótesis (dirs, users/shares) y volver a -p- si te quedas sin pistas.",
          ok: true,
          whyRightEs: "La enum sirve para decidir. No es un checklist infinito de flags.",
        },
        {
          id: "c",
          textEs: "C. Lanzar exploits de searchsploit con el banner aproximado.",
          whyWrongEs: "Banner ≈ versión. Falta validar.",
        },
      ],
      {
        subtopicId: "tool-selection",
        domain: "enumeration",
        evidenceEs: "Banners 80 y 445 ya existen.",
        whatMissedEs: "Escanear no es el objetivo; decidir sí.",
        betterApproachEs: "Servicio con hipótesis → si vacío, amplía scan.",
      }
    ),
  ],
};

export const PIVOT_WHEN_DRILL: DecisionScenario = {
  id: "v9-pivot-when",
  titleEs: "Pivoting — cuándo pivotar",
  setupEs: `${LAB}\n\nKali 192.168.56.101 ve 192.168.56.20 (acceso user). Desde la víctima: ping a 10.1.1.5 responde. Kali no rutea 10.1.1.0/24.`,
  checks: [
    mc(
      "when",
      "¿Pivotas ahora?",
      [
        {
          id: "a",
          textEs: "A. No. Vuelvo a nmap el mismo /24 de vboxnet.",
          whyWrongEs: "Esa red ya la ves. El hueco es la 10.1.1.0/24.",
        },
        {
          id: "b",
          textEs: "B. Sí: Kali no alcanza 10.1.1.5; el pivot (route/SOCKS/forward) es para esa red, no por deporte.",
          ok: true,
          whyRightEs: "Pivot = conectividad que tú no tienes. No es un módulo que se 'completa'.",
        },
        {
          id: "c",
          textEs: "C. Sí, siempre después de meterpreter, aunque el target sea el mismo /24.",
          whyWrongEs: "Si ya ves el host, el pivot no añade alcance.",
        },
      ],
      {
        subtopicId: "net-pivoting",
        domain: "pivoting",
        evidenceEs: "Víctima ve 10.1.1.5; Kali no.",
        whatMissedEs: "La pregunta es CUÁNDO, no el flag de meterpreter.",
        betterApproachEs: "Dibuja qué IP ve quién. Luego -L / SOCKS / route.",
      }
    ),
  ],
};

export const HTTP_TRANSFER_DRILL: DecisionScenario = {
  id: "v9-http-transfer",
  titleEs: "HTTP transfer — app distinta",
  setupEs: `${LAB}\n\n80/tcp. Título: 'Inventory Portal'. No es DVWA. Login en /account, no /login.php.`,
  checks: [
    mc(
      "path",
      "¿Cómo atacas?",
      [
        {
          id: "a",
          textEs: "A. sqlmap -u DVWA como en el taller.",
          whyWrongEs: "Memorizaste la app, no HTTP. Rutas y parámetros son otros.",
        },
        {
          id: "b",
          textEs: "B. Descubrir dirs/params de ESTA app, probar auth y un parámetro a mano, luego tool si hay evidencia.",
          ok: true,
          whyRightEs: "Transfer: unknown app → discover → identify → validate.",
        },
        {
          id: "c",
          textEs: "C. XSS en todos los campos porque el módulo de XSS está 'completado'.",
          whyWrongEs: "Completed ≠ el sink existe aquí.",
        },
      ],
      {
        subtopicId: "gobuster-dir",
        domain: "http-enum",
        evidenceEs: "App distinta, ruta /account.",
        whatMissedEs: "No reutilizar el mapa de DVWA.",
        betterApproachEs: "Enum de esta superficie, luego hipótesis.",
      }
    ),
  ],
};

export const WIN_ENUM_DRILL: DecisionScenario = {
  id: "v9-win-enum",
  titleEs: "Windows enum — antes del nombre de la técnica",
  setupEs: `${LAB}\n\nShell user en Windows de laboratorio (no el PC familiar). Objetivo: entender el contexto.`,
  checks: [
    mc(
      "first",
      "¿Primera evidencia?",
      [
        {
          id: "a",
          textEs: "A. Descargar un 'potato' porque el blog lo dice.",
          whyWrongEs: "Sin whoami /priv es teatro.",
        },
        {
          id: "b",
          textEs: "B. whoami /all, users/grupos, servicios y shares. Anotar privilegios y quién administra.",
          ok: true,
          whyRightEs: "Fundamento eJPT: users, groups, services, permissions, shares. Luego hipótesis.",
        },
        {
          id: "c",
          textEs: "C. BloodHound aunque no hay dominio en alcance.",
          whyWrongEs: "AD completo no es eJPT. Alcance primero.",
        },
      ],
      {
        subtopicId: "privesc-windows",
        domain: "privesc-windows",
        evidenceEs: "Acceso user, lab Windows.",
        whatMissedEs: "Enum local antes de la técnica famosa.",
        betterApproachEs: "Token → grupos → servicios/shares → hipótesis.",
      }
    ),
  ],
};

export const V9_ALL_DRILLS: DecisionScenario[] = [
  SMB_PRIORITY_DRILL,
  SMB_TRANSFER_DRILL,
  NMAP_TRANSFER_DRILL,
  ENUM_WHEN_DRILL,
  PIVOT_WHEN_DRILL,
  HTTP_TRANSFER_DRILL,
  WIN_ENUM_DRILL,
];

export const V9_DRILLS_BY_SKILL: Record<string, DecisionScenario[]> = {
  smb: [SMB_PRIORITY_DRILL, SMB_TRANSFER_DRILL],
  nmap: [NMAP_TRANSFER_DRILL],
  enumeration: [ENUM_WHEN_DRILL],
  pivoting: [PIVOT_WHEN_DRILL],
  "http-enum": [HTTP_TRANSFER_DRILL],
  web: [HTTP_TRANSFER_DRILL],
  "privesc-windows": [WIN_ENUM_DRILL],
};

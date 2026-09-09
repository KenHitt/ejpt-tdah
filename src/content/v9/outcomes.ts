/** Objetivos observables. No "aprender X". */

export interface OutcomeBlock {
  skillId: string;
  titleEs: string;
  outcomes: string[];
}

export const SKILL_OUTCOMES: OutcomeBlock[] = [
  {
    skillId: "lab",
    titleEs: "Laboratorio",
    outcomes: [
      "Identificar LHOST en la NIC del lab (no wlan0 ni loopback).",
      "Demostrar ping a la víctima Host-Only y escribir el alcance.",
      "Justificar por qué Bridged es inadecuado para MS2 en casa.",
    ],
  },
  {
    skillId: "networking",
    titleEs: "Networking",
    outcomes: [
      "Decidir si dos IPs están en la misma /24.",
      "Explicar open ≠ vulnerable.",
      "Elegir LHOST a partir de ip addr / ip route, no de un tutorial.",
    ],
  },
  {
    skillId: "linux",
    titleEs: "Linux",
    outcomes: [
      "Interpretar Permission denied como hallazgo, no como error de UI.",
      "Usar id / sudo -l / FS para contexto antes de un kernel exploit.",
    ],
  },
  {
    skillId: "recon",
    titleEs: "Reconnaissance",
    outcomes: [
      "Separar discovery de versioning.",
      "Decir qué se sabe y qué no se sabe tras un scan incompleto.",
    ],
  },
  {
    skillId: "nmap",
    titleEs: "Nmap",
    outcomes: [
      "Elegir -sn vs -p- vs -sV según la pregunta.",
      "Interpretar un output y seleccionar la siguiente técnica de enumeración.",
      "Justificar por qué no se lanza un exploit con solo puertos open.",
    ],
  },
  {
    skillId: "enumeration",
    titleEs: "Enumeration",
    outcomes: [
      "Priorizar una superficie cuando hay varios puertos.",
      "Asociar puerto → familia de herramienta (no mezclar Gobuster/Hydra/enum4linux).",
    ],
  },
  {
    skillId: "smb",
    titleEs: "SMB",
    outcomes: [
      "Reconocer 139/445 como enum de users/shares, no como Hydra SSH.",
      "Decidir el siguiente paso tras un listado de shares.",
    ],
  },
  {
    skillId: "http-enum",
    titleEs: "HTTP enumeration",
    outcomes: [
      "Elegir dirs/params cuando solo hay 80/tcp.",
      "Interpretar 403 como hallazgo, no como fin de la superficie.",
    ],
  },
  {
    skillId: "ssh-ftp",
    titleEs: "SSH / FTP",
    outcomes: [
      "No lanzar Hydra sin usuario.",
      "Probar FTP anonymous / banner antes de creds a ciegas.",
    ],
  },
  {
    skillId: "vuln",
    titleEs: "Vulnerability analysis",
    outcomes: [
      "Tratar un hit de searchsploit cercano como hipótesis, no como confirmación.",
      "Explicar false positive de versión.",
    ],
  },
  {
    skillId: "metasploit",
    titleEs: "Metasploit",
    outcomes: [
      "Completar show options antes de run.",
      "Diagnosticar sesión ausente por LHOST en la NIC incorrecta.",
    ],
  },
  {
    skillId: "exploitation",
    titleEs: "Exploitation",
    outcomes: [
      "Elegir reverse vs bind según conectividad.",
      "Verificar acceso (sysinfo/id) antes de declarar éxito.",
    ],
  },
  {
    skillId: "exploit-mod",
    titleEs: "Exploit modification",
    outcomes: [
      "Identificar RHOST/LHOST/LPORT/PATH en una plantilla.",
      "Sustituir CHANGE_ME por IPs medidas en el lab.",
    ],
  },
  {
    skillId: "web",
    titleEs: "Web fundamentals",
    outcomes: [
      "Seguir HTTP → dirs → login/upload → parámetro antes de una tool.",
      "Distinguir authn vs authz.",
    ],
  },
  {
    skillId: "sqli",
    titleEs: "SQL injection",
    outcomes: [
      "Probar el parámetro a mano antes de sqlmap ciego.",
      "Reconocer que 80 open ≠ SQLi.",
    ],
  },
  {
    skillId: "xss",
    titleEs: "XSS",
    outcomes: [
      "Clasificar el sink (HTML vs SQL) antes del payload.",
    ],
  },
  {
    skillId: "lfi",
    titleEs: "LFI / RFI",
    outcomes: [
      "Afirmar LFI al leer passwd sin llamar RCE.",
      "Distinguir traversal local de include remoto.",
    ],
  },
  {
    skillId: "privesc-linux",
    titleEs: "PrivEsc Linux",
    outcomes: [
      "Priorizar sudo NOPASSWD claro frente a un dump de LinPEAS.",
      "Verificar un vector (GTFO) en lugar de 20 SUID a ciegas.",
    ],
  },
  {
    skillId: "privesc-windows",
    titleEs: "PrivEsc Windows",
    outcomes: [
      "Leer whoami /priv antes de nombrar una técnica.",
      "Enumerar users/grupos/servicios en lab, no el PC familiar.",
    ],
  },
  {
    skillId: "post",
    titleEs: "Post-exploitation",
    outcomes: [
      "Elegir loot que cambia el next step (creds, keys), no ruido.",
      "Anotar strings exactos estilo cuestionario.",
    ],
  },
  {
    skillId: "pivoting",
    titleEs: "Pivoting",
    outcomes: [
      "Decidir CUÁNDO pivotar (Kali no alcanza el target).",
      "Distinguir -L, -D/SOCKS y 'nmap otra vez el mismo /24'.",
    ],
  },
  {
    skillId: "chains",
    titleEs: "Attack chains",
    outcomes: [
      "Integrar recon→enum→hipótesis sin receta fija.",
      "Decidir no explotar todavía si falta evidencia.",
    ],
  },
  {
    skillId: "reporting",
    titleEs: "Reporting",
    outcomes: [
      "Entregar el valor exacto observado, no un ensayo.",
    ],
  },
  {
    skillId: "exam-prep",
    titleEs: "eJPT prep (interna)",
    outcomes: [
      "Hacer triage de reloj sin dumps.",
      "Respetar alcance e integridad.",
    ],
  },
  {
    skillId: "osint",
    titleEs: "Public information",
    outcomes: [
      "Explicar qué dato público cambiaría la estrategia in-scope.",
      "No usar OSINT como autorización de Internet.",
    ],
  },
];

export function outcomesFor(skillId: string) {
  return SKILL_OUTCOMES.find((o) => o.skillId === skillId);
}

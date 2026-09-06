import { PromptCheck } from "@/lib/types";

export interface MicroItem {
  id: string;
  kind: string;
  titleEs: string;
  setupEs?: string;
  output?: string;
  check: PromptCheck;
}

export const MICRO_BANK: MicroItem[] = [
  {
    id: "m-sv",
    kind: "command",
    titleEs: "Command memory",
    check: {
      id: "m-sv",
      promptEs: "Escribe el comando Nmap para detección de versión (una IP de ejemplo 10.10.10.15).",
      keywords: ["nmap", "-sv"],
      explanationEs: "nmap -sV <IP>. -sn no da versiones.",
      failKind: "memory",
      subtopicId: "nmap-versioning",
    },
  },
  {
    id: "m-445",
    kind: "port",
    titleEs: "Port identification",
    check: {
      id: "m-445",
      promptEs: "Puerto 445 → ¿qué servicio/categoría?",
      keywordAny: [["smb"], ["microsoft-ds"], ["cifs"]],
      explanationEs: "445/tcp = SMB. No Gobuster.",
      failKind: "memory",
      subtopicId: "net-basic",
    },
  },
  {
    id: "m-smb-tool",
    kind: "tool",
    titleEs: "Tool selection",
    check: {
      id: "m-smb-tool",
      promptEs: "Encontraste SMB. ¿Qué herramienta usarías primero?",
      keywordAny: [["enum4linux"], ["smbclient"], ["smbmap"]],
      explanationEs: "enum4linux / smbclient / smbmap. No Hydra a ciegas.",
      failKind: "reasoning",
      subtopicId: "enum4linux",
    },
  },
  {
    id: "m-out",
    kind: "output",
    titleEs: "Output interpretation",
    setupEs: "¿Qué observas?",
    output: "21/tcp open ftp\n80/tcp open http\n445/tcp open microsoft-ds",
    check: {
      id: "m-out",
      promptEs: "What do you notice?",
      keywordAny: [["ftp"], ["http"], ["smb"], ["tres"], ["open"]],
      explanationEs: "Tres superficies distintas. Prioriza enum, no exploits.",
      failKind: "reasoning",
      subtopicId: "nmap-basic",
    },
  },
  {
    id: "m-next80",
    kind: "next",
    titleEs: "Next step",
    output: "80/tcp open http",
    check: {
      id: "m-next80",
      promptEs: "What's your next action?",
      keywordAny: [["gobuster"], ["curl"], ["dir"], ["enum"], ["http"]],
      explanationEs: "HTTP → enumerar rutas/tecnología. No Hydra SSH.",
      failKind: "reasoning",
      subtopicId: "gobuster-dir",
    },
  },
  {
    id: "m-redir",
    kind: "linux",
    titleEs: "Linux",
    check: {
      id: "m-redir",
      promptEs: "¿Qué hace `2>/dev/null`?",
      keywordAny: [["stderr"], ["error"], ["silen"], ["dev/null"]],
      explanationEs: "Redirige stderr a /dev/null (oculta errores). No es un exploit.",
      failKind: "memory",
      subtopicId: "linux-basic",
    },
  },
  {
    id: "m-24",
    kind: "net",
    titleEs: "Networking",
    check: {
      id: "m-24",
      promptEs: "What does /24 mean?",
      keywordAny: [["24"], ["mascara"], ["bits"], ["255.255.255.0"]],
      explanationEs: "24 bits de red. No son 24 hosts.",
      failKind: "reasoning",
      subtopicId: "net-basic",
    },
  },
  {
    id: "m-rhosts",
    kind: "msf",
    titleEs: "Metasploit",
    check: {
      id: "m-rhosts",
      promptEs: "What is RHOSTS?",
      keywordAny: [["victima"], ["remote"], ["target"], ["objetivo"]],
      explanationEs: "Remote host(s) = víctima. No es LHOST (tú / vboxnet).",
      failKind: "memory",
      subtopicId: "msf-lhost-lport",
    },
  },
  {
    id: "m-403",
    kind: "web",
    titleEs: "Web",
    check: {
      id: "m-403",
      promptEs: "What does a 403 response tell you?",
      keywordAny: [["existe"], ["forbid"], ["prohib"], ["no listar"], ["denied"]],
      explanationEs: "El recurso existe; no te dejan verlo. 403 ≠ 404.",
      failKind: "reasoning",
      subtopicId: "gobuster-dir",
    },
  },
  {
    id: "m-gob-vs-hydra",
    kind: "tool",
    titleEs: "Gobuster vs Hydra",
    check: {
      id: "m-gob-vs-hydra",
      promptEs: "80 open, no login form aún. ¿Hydra o Gobuster primero?",
      keywordAny: [["gobuster"], ["dir"], ["enum"], ["ruta"]],
      explanationEs: "Sin usuario/form, Hydra no tiene dónde pegar. HTTP → rutas (Gobuster/curl).",
      failKind: "reasoning",
      subtopicId: "gobuster-dir",
    },
  },
  {
    id: "m-dns-port",
    kind: "port",
    titleEs: "DNS port",
    check: {
      id: "m-dns-port",
      promptEs: "Puerto típico de DNS?",
      keywords: ["53"],
      explanationEs: "53/udp (y TCP para AXFR grandes). No es 80.",
      failKind: "memory",
      subtopicId: "net-basic",
    },
  },
  {
    id: "m-lhost",
    kind: "msf",
    titleEs: "LHOST",
    check: {
      id: "m-lhost",
      promptEs: "Reverse en Host-Only: LHOST es ¿qué interfaz/red?",
      keywordAny: [["vboxnet"], ["lab"], ["host-only"], ["kali"], ["atacante"]],
      explanationEs: "La IP de Kali en vboxnet (ip addr), no wlan0 ni 127.0.0.1.",
      failKind: "reasoning",
      subtopicId: "msf-lhost-lport",
    },
  },
  {
    id: "m-sqli-when",
    kind: "web",
    titleEs: "SQLi cuándo",
    check: {
      id: "m-sqli-when",
      promptEs: "¿SQLi es el primer paso con 80 open y cero enum?",
      keywordAny: [["no"], ["enum"], ["param"]],
      explanationEs: "Primero rutas/params. SQLi necesita un parámetro que hable con una DB.",
      failKind: "reasoning",
      subtopicId: "gobuster-dir",
    },
  },
  {
    id: "m-enum4-when",
    kind: "tool",
    titleEs: "enum4linux cuándo",
    check: {
      id: "m-enum4-when",
      promptEs: "¿enum4linux va contra HTTP o contra SMB?",
      keywordAny: [["smb"], ["445"], ["139"]],
      explanationEs: "SMB/NetBIOS. HTTP → Gobuster/curl.",
      failKind: "memory",
      subtopicId: "enum4linux",
    },
  },
  {
    id: "m-arp-scope",
    kind: "net",
    titleEs: "ARP alcance",
    check: {
      id: "m-arp-scope",
      promptEs: "¿ARP cruza routers hacia Internet?",
      keywordAny: [["no"]],
      explanationEs: "ARP es L2, misma LAN. Para otra subnet: routing/pivot.",
      failKind: "reasoning",
      subtopicId: "net-basic",
    },
  },
];

export const TEN_MIN_PACK: MicroItem[] = [
  ...MICRO_BANK.slice(0, 4),
  {
    id: "t-hydra",
    kind: "decision",
    titleEs: "Hydra decision",
    check: {
      id: "t-hydra",
      promptEs: "22 open, no username. ¿Hydra ya?",
      keywordAny: [["no"], ["enum"], ["user"]],
      explanationEs: "Sin usuario, Hydra es ruido. Enumera SMB/FTP/web primero.",
      failKind: "reasoning",
      subtopicId: "hydra-bruteforce",
    },
  },
  {
    id: "t-rev",
    kind: "shell",
    titleEs: "Reverse shell",
    check: {
      id: "t-rev",
      promptEs: "En reverse: ¿quién inicia la conexión TCP?",
      keywordAny: [["victima"], ["target"], ["rhost"]],
      explanationEs: "La víctima llama a LHOST:LPORT. Por eso LHOST = tu vboxnet.",
      failKind: "reasoning",
      subtopicId: "reverse-vs-bind",
    },
  },
];

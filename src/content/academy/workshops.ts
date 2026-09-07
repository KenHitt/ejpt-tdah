import { CourseExample, CourseSection } from "@/content/course/types";
import { HUB_REPOS, HubRepo, HubTrack } from "@/content/github-hub";

export type { HubTrack };

export const TALLER_HOURS = 2.5;

export interface AcademyWorkshop {
  id: string;
  titleEs: string;
  track: HubTrack;
  weeks: number[];
  hours: number;
  theory: CourseSection[];
  example: CourseExample;
  practice: string[];
  safety: string;
}

const TITLES: Record<string, string> = {
  "ejpt-angelist": "Mapa mental eJPTv2: orden, no biblia",
  "ejpt-neil": "Índice por servicio: un puerto, una ficha",
  "ejpt-dragkob": "Cheat de curso vs tu método",
  nmap: "Nmap a fondo: flags, NSE y alcance",
  msf: "Metasploit: módulo, datastore y match",
  gobuster: "Gobuster: fuerza bruta de rutas HTTP",
  hydra: "Hydra: dos ejes (user × password)",
  enum4linux: "enum4linux y la capa SMB",
  sqlmap: "sqlmap: gramática SQL, no oráculo",
  seclists: "Wordlists: elegir el espacio de búsqueda",
  peass: "LinPEAS/WinPEAS: señales, no root automático",
  linenum: "LinEnum: el mismo mapa, otra UX",
  dvwa: "DVWA: dojo web en localhost",
  ms3: "Otra víctima, el mismo método (MS3)",
  ffuf: "ffuf: filtrar por código y tamaño",
  httpx: "httpx: de hosts a superficies HTTP",
  nuclei: "Nuclei: plantillas ≠ vulnerable",
  impacket: "Impacket: SMB y el cable en Python",
  john: "John: hashes offline, no Hydra",
  hashcat: "Hashcat: el mismo problema, otro coste",
  gtfo: "GTFOBins: sudo -l une el nombre al how",
  lolbas: "LOLBAS: living-off-the-land Windows",
  payloads: "Clases de bug web, no enciclopedia",
  hacktricks: "Una pregunta de ataque, no la wiki",
  "awesome-pt": "Taxonomía de tools: elegir una",
  "secret-knowledge": "Networking de apoyo, con corte",
  "owasp-cheats": "El bug al revés: prevención OWASP",
  ippsec: "Patrones de caja, no el vídeo entero",
  exploitdb: "searchsploit: query + leer",
  nikto: "Nikto: hipótesis, luego curl",
  zap: "Proxy HTTP: ver el request",
  wireshark: "El handshake se ve en el pcap",
  scapy: "Un SYN a mano para clavar L3/L4",
  responder: "LLMNR/NBT-NS: modelo, no la Wi‑Fi",
  bettercap: "MITM: gateway, spoof, sniff (lab)",
  theharvester: "OSINT pasivo vs recon activo",
  "ssh-audit": "SSH: banner ≠ hardening",
  commix: "Command injection después de a mano",
  wfuzz: "Una tool de fuzz, no tres a medias",
  fuzzdb: "Un archivo de payloads para el bug de hoy",
  cyberchef: "Encodings: el hash mal copiado",
  netexec: "Auth + módulo en Windows/SMB",
  bloodhound: "Privesc como camino en un grafo",
  "internal-all": "Pentest interno: qué existe",
  "cheatsheets-coreb1t": "Una cheat sheet por hueco",
  "searchsploit-kali": "El exploit a veces es un paper",
  dirsearch: "Dirs HTTP: quédate con una tool",
  smbmap: "Shares: READ/WRITE es el dato",
  "recon-ng": "OSINT por módulos (contraste)",
};

const TRACK_EXTRA: Record<HubTrack, CourseSection> = {
  NOTES:
    { h: "Cómo se estudia una nota", p: "Una nota de terceros es un mapa, no el brief de INE. Extrae solo lo que ya tocaste en tu VirtualBox. Donde discrepes, anota el porqué: ahí está tu modelo. No copies payloads a redes ajenas." },
  NMAP:
    { h: "Cómo se estudia Nmap aquí", p: "Cada flag responde una pregunta (vivos, puertos, versión, script). Practica contra el guest Host-Only. NSE es un runtime sobre sockets: categorías > memorizar 400 nombres. Scan solo el CIDR autorizado." },
  ENUM:
    { h: "Cómo se estudia la enumeración", p: "El puerto elige la familia. SMB no se dirbustea. Hydra necesita user. Si una herramienta falla, baja una capa (smbclient, curl). Una tool a fondo (TDAH)." },
  WEB:
    { h: "Cómo se estudia web aquí", p: "Primero el request (método, param, cookie). Luego el bug a mano en DVWA localhost. El automatizador (sqlmap, ffuf) viene después. 403 no es 404. Nunca el proxy hacia Internet." },
  MSF:
    { h: "Cómo se estudia Metasploit aquí", p: "Un módulo es un objeto con datastore (RHOSTS, LHOST). search vive de TU -sV. run sin options es teatro. Exploit solo MS2/lab con match de versión." },
  POST:
    { h: "Cómo se estudia post-ex aquí", p: "Mapa (sudo, SUID, cron, loot) antes que el exploit del año. Las tools clasifican señales; tú eliges el vector. El examen a menudo pide el valor, no el crack. Solo en la víctima de lab." },
  WORDLIST:
    { h: "Cómo se elige una wordlist", p: "El espacio de búsqueda es el arma. Lista razonable + hipótesis > 80 GB el día D. Discovery de rutas ≠ rockyou de passwords." },
  LAB:
    { h: "Cómo se monta otra víctima", p: "Misma regla: Kali host, VirtualBox, Host-Only. Cambiar de SO no cambia el método. Nunca Bridged en la LAN familiar. No publiques DVWA." },
  MAP:
    { h: "Cómo se usa un mapa sin perderse", p: "Entras por UNA pregunta ('445 qué hay'), exportas 3 bullets a tu plantilla, cierras. Taxonomía para elegir, no para coleccionar 30 tools." },
};

function academyProtocol(protocol: string): string {
  return protocol
    .replace(/\bREADME\b/gi, "la ayuda de la herramienta en Kali (man o -h)")
    .replace(/en GitHub/gi, "en este taller")
    .replace(/GitHub/gi, "el material")
    .replace(/el repo entero/gi, "todo el temario de golpe")
    .replace(/Abre el cheat sheet/gi, "Usa la hoja de este taller")
    .replace(/Busca en GitHub/gi, "Busca en tu Kali (search / man)")
    .replace(/wiki o -hh/gi, "ayuda de la tool (-hh) o man")
    .replace(/Docs:/gi, "En Kali, documenta:")
    .replace(/Lee README/gi, "Lee la ayuda local");
}

function titleOf(repo: HubRepo): string {
  return TITLES[repo.id] ?? repo.name.replace(/^[^/]+\//, "").replace(/[-_]/g, " ");
}

function toWorkshop(repo: HubRepo): AcademyWorkshop {
  const protocol = academyProtocol(repo.protocol);
  return {
    id: repo.id,
    titleEs: titleOf(repo),
    track: repo.track,
    weeks: repo.weeks,
    hours: TALLER_HOURS,
    theory: [
      TRACK_EXTRA[repo.track],
      { h: "Qué cubre este taller", p: repo.scan },
      { h: "El mecanismo (no el marketing)", p: repo.gifted },
      { h: "Protocolo de estudio de hoy", p: protocol },
    ],
    example: {
      title: `Ejemplo guiado — ${titleOf(repo)}`,
      scene: "Kali en tu PC. Víctima en VirtualBox Host-Only o DVWA en localhost. Este taller se estudia aquí, no en 40 pestañas.",
      steps: [
        { do: protocol, why: "Un protocolo cerrado vale más que una tarde de pestañas." },
        { do: "Anota 3 bullets en tu plantilla (qué, por qué, next step).", why: "El examen pide valores y criterios, no 'lo vi'." },
        { do: "Vuelve al lab de la jornada si aún no practicaste tú.", why: "El taller alimenta la práctica; no la sustituye." },
      ],
      expected: "Una nota útil y un único experimento en el lab autorizado.",
      stop: repo.safety,
    },
    practice: [
      "Tapa el ejemplo. Reescribe en una frase qué problema resuelve este taller.",
      "Ejecuta UN experimento en tu guest Host-Only o DVWA localhost (o el equivalente de papel si hoy no aplica).",
      "Guarda el resultado exacto (string, código, negativa). Cierra el tema.",
    ],
    safety: repo.safety,
  };
}

export const ACADEMY_WORKSHOPS: AcademyWorkshop[] = HUB_REPOS.map(toWorkshop);

export const WORKSHOP_TRACKS: HubTrack[] = [
  "NOTES",
  "NMAP",
  "ENUM",
  "WEB",
  "MSF",
  "POST",
  "WORDLIST",
  "LAB",
  "MAP",
];

export function getWorkshop(id: string) {
  return ACADEMY_WORKSHOPS.find((w) => w.id === id);
}

export function workshopsForWeek(week: number) {
  return ACADEMY_WORKSHOPS.filter((w) => w.weeks.includes(week));
}

export function talleresForLesson(week: number, count = 2) {
  const list = workshopsForWeek(week);
  const core = list.filter((w) => w.track !== "MAP" && w.track !== "NOTES");
  const picked = (core.length ? core : list).slice(0, count);
  return picked.length ? picked : list.slice(0, count);
}

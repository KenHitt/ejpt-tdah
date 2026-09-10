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

const TRACK_PLAIN: Record<HubTrack, CourseSection> = {
  NOTES: {
    h: "En palabras simples",
    p: "Esto no es un libro que tengas que leer entero. Es un mapa: miras UNA página relacionada con lo que ya viste hoy en tu laboratorio, copias tres ideas a tu cuaderno y cierras. Si no lo usaste hoy en tu máquina, no lo leas 'por si acaso'.",
  },
  NMAP: {
    h: "En palabras simples",
    p: "Nmap es una herramienta para preguntar a una máquina de tu laboratorio: ¿estás encendida? ¿qué puertas (puertos) tienes abiertas? ¿qué programa hay detrás? Cada opción (-sn, -sV, -p-) es una pregunta distinta. Hoy haces UNA pregunta contra TU víctima Host-Only, no contra Internet ni contra el Wi‑Fi de casa.",
  },
  ENUM: {
    h: "En palabras simples",
    p: "Enumerar es preguntar con educación técnica: usuarios, carpetas, páginas. No es 'hackear ya'. El puerto te dice qué herramienta usar: 445 es para archivos (SMB), 80 es para páginas (HTTP), 22 es SSH. Una herramienta cada vez.",
  },
  WEB: {
    h: "En palabras simples",
    p: "Una web es un diálogo: tu navegador pide algo y el servidor responde. Antes de lanzar sqlmap o Gobuster, mira la petición: método, parámetro, cookie. Practica en DVWA en tu propio Kali (localhost). Nunca apuntes estas pruebas a una web que no sea tuya.",
  },
  MSF: {
    h: "En palabras simples",
    p: "Metasploit es una caja de recetas. Cada receta (módulo) necesita datos tuyos: IP de la víctima (RHOST) e IP tuya en el laboratorio (LHOST). Si dejas esos campos vacíos o copiados de un vídeo, la receta no funciona. Primero Nmap, luego el módulo que coincida.",
  },
  POST: {
    h: "En palabras simples",
    p: "Post-explotación es lo que haces DESPUÉS de haber entrado: quién soy, qué puedo leer, si puedo ser administrador. No empieces por un exploit de kernel famoso. Empieza por comandos simples (id, sudo -l) en la máquina de laboratorio.",
  },
  WORDLIST: {
    h: "En palabras simples",
    p: "Una wordlist es una lista de palabras para probar rutas o contraseñas. No hace falta la lista más enorme del mundo. Hace falta una lista que tenga sentido para lo que estás buscando hoy.",
  },
  LAB: {
    h: "En palabras simples",
    p: "El laboratorio es un cuarto cerrado: tu Kali y una máquina hecha para practicar. Host-Only es esa red cerrada. Bridged sería poner la máquina vulnerable en el mismo Wi‑Fi que tu familia. No lo hagas. Cambiar de víctima (otra VM) no cambia el método: medir IPs, ping, luego nmap.",
  },
  MAP: {
    h: "En palabras simples",
    p: "Entras al taller con UNA pregunta (por ejemplo: 'el puerto 445, ¿qué hago?'). Sales con tres líneas en el cuaderno. No colecciones veinte herramientas. eJPT premia elegir una y usarla bien.",
  },
};

const TRACK_SCENE: Record<HubTrack, string> = {
  NOTES:
    "Tienes 20 minutos y el cerebro cansado. No vas a leer un repositorio entero. Vas a sacar solo lo que ya practicaste hoy.",
  NMAP:
    "Tu Kali y una máquina víctima se ven por Host-Only. Aún no lanzas exploits. Quieres hacerle UNA pregunta a esa máquina con Nmap y entender la respuesta.",
  ENUM:
    "Nmap ya te dijo que hay puertos abiertos. Ahora eliges UNO (por ejemplo 445 o 80) y le preguntas qué hay detrás, con la herramienta de esa familia.",
  WEB:
    "Tienes DVWA en tu Kali o un puerto 80 en tu víctima. Vas a mirar una petición de verdad (URL, parámetro) antes de cualquier automatizador.",
  MSF:
    "Ya tienes servicio y versión de Nmap. Vas a abrir Metasploit, buscar un módulo que coincida, y rellenar LHOST y RHOST con IPs que TÚ mediste hoy.",
  POST:
    "Ya tienes una sesión o un usuario en la víctima de laboratorio. Antes de buscar 'el exploit de root', vas a preguntar quién eres y qué permisos tienes.",
  WORDLIST:
    "Necesitas probar nombres de carpetas o contraseñas en el laboratorio. Vas a elegir una lista razonable, no descargar 80 GB 'por si acaso'.",
  LAB:
    "Quieres otra máquina de práctica (o DVWA). El método no cambia: Kali en tu PC, víctima en VirtualBox, red Host-Only, IPs medidas, ping, y nada de Bridged.",
  MAP:
    "Tienes una duda concreta (un puerto, un fallo). El taller es un índice. Entras, copias tres ideas, vuelves al laboratorio.",
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
      TRACK_PLAIN[repo.track],
      TRACK_EXTRA[repo.track],
      { h: "Qué cubre este taller", p: repo.scan },
      { h: "El mecanismo (no el marketing)", p: repo.gifted },
      { h: "Qué vas a hacer hoy (un solo experimento)", p: protocol },
    ],
    example: {
      title: `Caso guiado: ${titleOf(repo)}`,
      scene: TRACK_SCENE[repo.track],
      steps: [
        {
          do: `Di en voz alta, en una frase, de qué va este taller: ${repo.scan}`,
          why: "Si no puedes explicarlo a alguien que acaba de empezar, aún no abras más pestañas. El taller cabe en una idea.",
        },
        {
          do: protocol,
          why: "Un experimento cerrado. Terminar una cosa bien vale más que ojeadas a diez páginas.",
        },
        {
          do: "En el cuaderno escribe tres líneas: qué hice, qué vi, qué haría después. Luego vuelve a la práctica de la jornada de hoy.",
          why: "El examen pide un valor y un criterio. 'Lo vi' no cuenta. El taller alimenta la jornada; no la sustituye.",
        },
      ],
      expected: "decir de qué iba el taller, haber hecho un único experimento en tu laboratorio (o el equivalente en papel) y tener tres líneas escritas.",
      stop: repo.safety,
    },
    practice: [
      "Cubre el ejemplo. En una frase sencilla: ¿qué problema resuelve este taller?",
      "Haz UN experimento en tu víctima Host-Only o en DVWA en localhost (si hoy no aplica, escríbelo en papel: qué harías y qué esperarías ver).",
      "Guarda el resultado exacto (un texto, un código, o 'no pude porque…'). Cierra el tema. No abras otro taller el mismo minuto.",
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

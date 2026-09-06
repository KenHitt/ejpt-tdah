import { TroubleItem, WorkshopSection } from "@/lib/types";

/** Bloque m1-w1-b1. Orden: vivo → puertos → versión → guardar. */
export const NMAP_DISCOVERY_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. ¿Qué es Nmap aquí?",
    titleEn: "What Nmap is in this lab",
    bodyEs:
      "Nmap es el mapa de la red: quién está vivo, qué TCP/UDP escucha, y (con -sV) qué versión. No es un exploit. No sustituye a enum4linux ni a Gobuster.\n\nOrden fijo en eJPT y en tu lab:\n1) Host discovery (-sn) en TU /24 de vboxnet0.\n2) Un host (TARGET_MS2 de ~/ejpt-lab.txt).\n3) Puertos (-p- o lista). Default = solo top 1000 TCP.\n4) Versión (-sV).\n5) Guardar (-oA).\n\nCorre Nmap en Kali host, no desde dentro de MS2.",
    diagram: `-sn  red/24     →  IPs vivas
-p-  UNA IP     →  puertos TCP
-sV  esos puertos →  vsftpd 2.3.4, no solo ftp
-oA  prefijo    →  .nmap .xml .gnmap`,
  },
  {
    id: "why",
    titleEs: "02. ¿Por qué importa?",
    titleEn: "Why it matters",
    bodyEs:
      "El examen pide flags exactos y leer un output. Si mezclas -sn con -sV, o escaneas 192.168.1.0/24 (casa), pierdes tiempo y no tienes evidencia.\n\nWHAT: inventario de hosts y servicios.\nWHY: eliges la siguiente herramienta (22→SSH, 80→HTTP, 445→SMB).\nWHEN: siempre al empezar una máquina, antes de Hydra/Metasploit.\nOUTPUT: tabla PORT STATE SERVICE VERSION + archivo -oA.\nNEXT: tipos de scan (-sS/-sT/-sU) y NSE (-sC).",
  },
  {
    id: "prereq",
    titleEs: "03. Prerrequisitos",
    titleEn: "Prerequisites",
    bodyEs:
      "Lab: vboxnet0 UP, ping a MS2. Linux mínimo: sabes en qué host estás. Redes: /24 de lab ≠ wlan0 ≠ 127.0.0.1.\n\nSi nmap -sn no muestra el guest, esto no se arregla con -A. Vuelve a VirtualBox / redes.",
  },
  {
    id: "sn",
    titleEs: "04. Flag -sn — host discovery",
    titleEn: "-sn host discovery",
    bodyEs:
      "WHAT: ping scan. Pregunta quién responde (ICMP/ARP/otros probes). No lista puertos.\nWHY: no tiras 65535 puertos a 254 IPs a ciegas.\nWHEN: no conoces las IPs de los guests, o quieres confirmar el /24.\nOUTPUT: 'Nmap scan report for 192.168.56.101' + Host is up. Sin columna PORT.\nNEXT: UNA de esas IPs con -p- o -sV. No -sn otra vez en bucle.",
  },
  {
    id: "p-sv",
    titleEs: "05. Flags -p- y -sV",
    titleEn: "-p- and -sV",
    bodyEs:
      "-p- WHAT: todos los TCP (1–65535). WHY: el default son ~1000; un servicio en 8180 no sale. WHEN: baseline de UNA máquina de lab/examen. OUTPUT: lista larga de puertos. NEXT: -sV en lo que importó, o -sV junto: nmap -p- -sV <IP>.\n\n-p22,80,445 WHAT: lista explícita. WHY: rápido cuando ya sabes la hipótesis. WHEN: re-check, no el primer mapa.\n\n-sV WHAT: habla con el servicio (banner). WHY: vsftpd 2.3.4 ≠ 'ftp genérico'. WHEN: tras saber que hay puertos, o combinado. OUTPUT: columna VERSION. NEXT: NSE o enum de ESE servicio. -O es SO (otro flag). -A es el combo ruidoso (optional).",
  },
  {
    id: "oa",
    titleEs: "06. Flag -oA — evidencia",
    titleEn: "-oA output",
    bodyEs:
      "WHAT: escribe tres archivos con el mismo prefijo: .nmap (humano), .xml (máquinas), .gnmap (grep).\nWHY: el examen y tu lab piden evidencia; la terminal se pierde.\nWHEN: cualquier scan que no sea un -sn de 3 segundos.\nOUTPUT: scan_full.nmap + .xml + .gnmap en el cwd.\nNEXT: less scan_full.nmap. No relances el mismo -p- -sV porque 'no copiaste'.",
  },
  {
    id: "read",
    titleEs: "07. Cómo leer el output",
    titleEn: "How to read output",
    bodyEs:
      "PORT: número/protocolo (80/tcp).\nSTATE: open (hay servicio), closed (host responde 'nadie'), filtered (no sabes).\nSERVICE: hipótesis (http, microsoft-ds).\nVERSION: solo con -sV (Apache, Samba 3.x).\n\nUn host 'up' en -sn no implica 80 open. open en 445 no implica 'usar Gobuster'.\n\nWHAT: cuatro columnas.\nWHY: el siguiente movimiento sale de aquí, no de un write-up.\nWHEN: termina el scan.\nOUTPUT: 3–5 hallazgos escritos (puerto + servicio + versión).\nNEXT: bloque de tipos de scan, luego NSE.",
    diagram: `PORT     STATE  SERVICE     VERSION
21/tcp   open   ftp         vsftpd 2.3.4
22/tcp   open   ssh         OpenSSH …
80/tcp   open   http        Apache …
445/tcp  open   microsoft-ds Samba …`,
  },
  {
    id: "optional",
    titleEs: "08. ADVANCED / OPTIONAL — -A, -O, -Pn, IPv6",
    titleEn: "Optional flags",
    optional: true,
    bodyEs:
      "-A = -sV + -sC + OS + traceroute. Ruidoso. En lab de 50 min prefieres -sC -sV controlado.\n-O = fingerprint de SO. Útil, no obligatorio el primer día.\n-Pn = trata el host como up (salta discovery). Úsalo si ICMP está filtrado y SABES que el host existe. No -Pn a un /16 entero.\nIPv6 (-6) no es el foco de este lab Host-Only IPv4.",
  },
];

/** Bloque m1-w1-b2. */
export const NMAP_TYPES_WORKSHOP: WorkshopSection[] = [
  {
    id: "ss",
    titleEs: "01. -sS SYN scan",
    titleEn: "-sS SYN scan",
    bodyEs:
      "WHAT: manda SYN, mira SYN-ACK, no completa el handshake (half-open). En Kali root es el default.\nWHY: más rápido y menos 'conexión completa' que -sT. Sigue siendo activo y ruidoso: no es invisibilidad mágica.\nWHEN: tienes sudo/root y quieres el scan TCP habitual.\nOUTPUT: misma tabla PORT STATE; internamente no hubo ACK final.\nNEXT: si 'Need root' o no eres root → -sT.",
  },
  {
    id: "st",
    titleEs: "02. -sT connect scan",
    titleEn: "-sT TCP connect",
    bodyEs:
      "WHAT: usa connect() del SO: handshake TCP completo.\nWHY: funciona sin root. Más logs en el target (sesión completa).\nWHEN: usuario normal, o -sS no está permitido.\nOUTPUT: open/closed/filtered igual de interpretable.\nNEXT: no mezcles 'necesito sudo' con 'el puerto está closed'.",
  },
  {
    id: "su",
    titleEs: "03. -sU UDP",
    titleEn: "-sU UDP",
    bodyEs:
      "WHAT: prueba puertos UDP (DNS 53, SNMP 161). Sin handshake: lento y a menudo 'open|filtered'.\nWHY: algunos servicios no están en TCP.\nWHEN: el brief pide UDP, o TCP no explica el box. No el primer comando del día.\nOUTPUT: --top-ports 20 o 50, no -p- UDP a ciegas en 50 min.\nNEXT: si 53/udp open, piensa DNS, no SMB.",
  },
  {
    id: "timing",
    titleEs: "04. -T0 … -T5",
    titleEn: "Timing templates",
    bodyEs:
      "WHAT: velocidad vs fiabilidad. -T4 = agresivo, típico lab/eJPT. -T3 default. -T2 si la VM se cae. -T5 pierde paquetes; no es 'más pro'.\nWHY: un scan 'vacío' a veces es timing, no host down.\nWHEN: -p- se eterniza o MS2 se cuelga.\nOUTPUT: mismo mapa, distinto reloj.\nNEXT: anota qué -T usaste en el archivo -oA.",
  },
  {
    id: "when",
    titleEs: "05. Cuándo cada uno (decisión)",
    titleEn: "When to pick which",
    bodyEs:
      "Primer mapa TCP en Kali root: -sS -T4 (o el default).\nSin root: -sT.\nUDP: -sU --top-ports 20, aparte, no mezclado a ciegas con -p- TCP.\nHost discovery sigue siendo -sn, no un -sS a todo el /24.\n\nWHAT: tipo de paquete + reloj.\nWHY: el flag cambia qué preguntas a la red.\nWHEN: el drill te pide SYN vs connect vs UDP.\nOUTPUT: un comando con UN tipo principal.\nNEXT: NSE.",
    diagram: `root + TCP habitual →  sudo nmap -sS -T4 …
sin root           →  nmap -sT …
UDP acotado        →  sudo nmap -sU --top-ports 20 …`,
  },
  {
    id: "optional",
    titleEs: "06. ADVANCED / OPTIONAL — NULL/FIN/Xmas, idle scan",
    titleEn: "Optional scan types",
    optional: true,
    bodyEs:
      "eJPT espera que sepas que existen -sN/-sF/-sX y que -sS es el habitual. No conviertas este bloque en evasión IDS. Idle scan (-sI) no es el camino mínimo.",
  },
];

/** Bloque m1-w1-b3. */
export const NMAP_NSE_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. ¿Qué es NSE?",
    titleEn: "What NSE is",
    bodyEs:
      "NSE = scripts .nse en /usr/share/nmap/scripts/. No es Metasploit. Un script pregunta algo concreto (¿FTP anonymous? ¿título HTTP?).\n\nWHAT: plugins de Nmap.\nWHY: un dato (anonymous: true, title: DVWA) vale más que 40 puertos sin contexto.\nWHEN: ya tienes puertos/versiones, o en el primer combo -sC -sV.\nOUTPUT: líneas extra bajo el puerto (script output).\nNEXT: enum dedicada (enum4linux, gobuster) — Semana 2. No 'exploit' porque un script dijo vuln.",
  },
  {
    id: "sc-vuln",
    titleEs: "02. -sC vs --script vuln",
    titleEn: "-sC vs vuln category",
    bodyEs:
      "-sC WHAT: categoría default (relativamente segura). Equivale a --script default. Suele ir con -sV.\nWHY: primer pase informativo.\nWHEN: baseline. OUTPUT: banners, títulos, a veces anon FTP.\nNEXT: un script NOMBRADO si quieres una pregunta concreta.\n\n--script vuln WHAT: categoría que busca CVEs/misconfigs. WHY: más ruidoso. WHEN: el drill/examen lo pide o ya enumeraste. OUTPUT: puede ser falso positivo. NEXT: verifica (ftp-anon, smb), no copies un CVE a Metasploit a ciegas.",
  },
  {
    id: "named",
    titleEs: "03. Scripts que sí usas en MS2",
    titleEn: "Scripts you actually run",
    bodyEs:
      "ftp-anon -p21 — ¿login anonymous?\nsmb-os-discovery -p445 — OS/workgroup SMB.\nhttp-title / http-headers -p80 — qué web es.\n\nCombina: nmap --script ftp-anon -p21 <IP>\nLista: ls /usr/share/nmap/scripts/ | grep ftp\n\nWHAT: un script = una pregunta.\nWHY: -sC a veces no basta; el examen pide el flag --script nombre.\nWHEN: puerto 21/80/445 open.\nOUTPUT: una frase que copias a tus notas.\nNEXT: si anonymous OK → Semana 2 FTP. Si 445 → enum4linux. Si 80 → Gobuster. Hoy no explotas.",
  },
  {
    id: "optional",
    titleEs: "04. ADVANCED / OPTIONAL — --script-args, categorías",
    titleEn: "Optional NSE",
    optional: true,
    bodyEs:
      "Categorías: auth, brute, discovery, vuln, default. brute en NSE no sustituye Hydra en tu plan. --script-args es para labs concretos, no memorices 50 args.",
  },
];

/** Bloque m1-w1-b6: leer hallazgos, no repetir flags. */
export const NMAP_INTEGRATION_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. Qué entregar en 40 min",
    titleEn: "What to deliver",
    bodyEs:
      "Un archivo propio (notas o ms2_full.nmap): IP, cada TCP open + versión, UN hallazgo NSE (ftp-anon o smb-os-discovery).\n\nComando típico: nmap -p- -sV -sC <TARGET_MS2> -oA ms2_full\nSi -p- no termina: -T4 y/o primero -sV en top ports, luego -p-.\n\nWHAT: evidencia, no captura de pantalla de un write-up.\nWHY: el examen es contra UN box con reloj.\nWHEN: Semana 1 cerrada.\nOUTPUT: lista que podrías leer en voz alta.\nNEXT: Semana 2 enum por servicio. Rapid7 guide SOLO al final para auditarte.",
  },
];

export const NMAP_TROUBLESHOOTING: TroubleItem[] = [
  {
    id: "wrong-range",
    symptom: "nmap -sn no muestra MS2 / muestra PCs de casa",
    cause: "Rango ≠ prefijo de vboxnet0 (192.168.1.0/24 o 10.0.0.0/8).",
    diagnose: "ip addr show vboxnet0 ; cat ~/ejpt-lab.txt",
    command: "ip addr show vboxnet0",
    fix: "Usa el /24 de Host-Only. No escanees la LAN de casa.",
    verify: "Ves .1 (Kali) y el guest. TARGET_MS2 coincide.",
  },
  {
    id: "need-root",
    symptom: "Need root privileges / TCP SYN scan requires root",
    cause: "-sS exige raw sockets. Sin root Nmap cae a -sT o aborta.",
    diagnose: "id ; nmap --version",
    command: "sudo nmap -sS -T4 -p22,80,445 <TARGET_MS2>",
    fix: "sudo para -sS/-sU, o nmap -sT sin sudo.",
    verify: "El scan arranca; no confundas el aviso con host down.",
  },
  {
    id: "udp-slow",
    symptom: "UDP tarda eternamente / todo open|filtered",
    cause: "UDP no tiene handshake; -p- UDP es una trampa de tiempo.",
    diagnose: "¿Usaste -sU -p- ?",
    command: "sudo nmap -sU --top-ports 20 <TARGET_MS2>",
    fix: "Acota --top-ports. No bloquees el bloque de 45 min.",
    verify: "Terminaste con una lista corta, no un /65535 UDP.",
  },
  {
    id: "default-1000",
    symptom: "Falta un servicio que 'sé que está'",
    cause: "Sin -p- solo top 1000. O -sn no lista puertos (confusión).",
    diagnose: "Relee el comando: ¿hay -p- o -p lista? ¿Era -sn?",
    command: "nmap -p- -sV <TARGET_MS2> -oA scan_full",
    fix: "Baseline de máquina: -p-. Re-check: -p21,22,80,445.",
    verify: "El puerto alto o el que buscabas aparece, o confirmas que está closed.",
  },
  {
    id: "from-guest",
    symptom: "Nmap a 127.0.0.1 o 'desde MS2'",
    cause: "Estás dentro del guest (prompt msfadmin) o atacas localhost (DVWA).",
    diagnose: "hostname ; ip -br a ; cat ~/ejpt-lab.txt",
    command: "exit",
    fix: "exit a Kali. Target = TARGET_MS2, no 127.0.0.1.",
    verify: "Prompt de Kali; vboxnet0 visible; scan a la IP del guest.",
  },
];

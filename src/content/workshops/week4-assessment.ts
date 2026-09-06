import { TroubleItem, WorkshopSection } from "@/lib/types";

/** m1-w4-b1 — índice. No es 'pegar el .c'. */
export const SEARCHSPLOIT_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. ¿Qué es searchsploit?",
    titleEn: "What searchsploit is",
    bodyEs:
      "Copia local de Exploit-DB. searchsploit 'servicio versión' lista hits (EDB-ID, ruta). No lanza nada. No sustituye a Nmap ni a msf search.\n\nFlujo eJPT: nmap -sV te da vsftpd 2.3.4 → searchsploit vsftpd 2.3.4 → anotas que EXISTE un módulo/hit → Metasploit (Semana 3) si el lab es TU MS2.\n\nWHAT: índice offline.\nWHY: el dominio Vulnerability Assessment es el PROCESO, no memorizar CVEs.\nWHEN: tienes nombre+versión.\nOUTPUT: 1–3 líneas (título, id). NEXT: msf search del mismo nombre, o documentar 'sin hit'. NO gcc, NO python el .c hoy.",
  },
  {
    id: "flags",
    titleEs: "02. Flags que sí usas",
    titleEn: "Flags you use",
    bodyEs:
      "searchsploit apache 2.4.49  — texto libre.\nsearchsploit -w vsftpd  — a veces enlaces (si aplica).\nsearchsploit -u  — actualiza la base (red; opcional si ya está al día).\n\n-m WHAT: copia un archivo al cwd. WHY: existe en el examen. WHEN: no hoy como hábito. Si lo usas, PARAS: no lo ejecutas contra nada que no sea TU VM, y Semana 3 prefirió msfconsole.\n\nOpenVAS/Nessus: escáner de CVEs. OPTIONAL. No instales un SIEM para este bloque de 45 min.",
  },
  {
    id: "read",
    titleEs: "03. Cómo leer un hit (sin explotarlo)",
    titleEn: "How to read a hit",
    bodyEs:
      "Mira: ¿Linux o Windows? ¿versión? ¿remote o local? Si el hit es Windows y tu lab es MS2 Linux, no aplica.\n\nWHAT: filtrar ruido.\nWHY: apache 2.4.49 en un scan no significa que MS2 lo tenga.\nWHEN: la lista es larga.\nOUTPUT: 'hit X coincide con MI versión' o 'no'.\nNEXT: show options en msf, LHOST vboxnet0 si reverse. Nunca wlan0.",
  },
];

/** m1-w4-b2 */
export const REVERSE_BIND_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. Quién inicia la conexión",
    titleEn: "Who starts the TCP session",
    bodyEs:
      "Reverse: la VÍCTIMA abre TCP hacia TÚ LHOST:LPORT (Kali vboxnet0). Por eso Metasploit pide LHOST. Útil si el guest no acepta conexiones nuevas (NAT/firewall). En Host-Only ambos se ven; igual el examen ama reverse.\n\nBind: la VÍCTIMA ESCUCHA; TÚ te conectas a RHOSTS:puerto. LHOST a menudo no aplica (Semana 3: vsftpd bind).\n\nWHAT: sentido de la flecha TCP.\nWHY: mezclar LHOST con la IP del guest = no hay reverse.\nWHEN: payloads, nc, msf.\nOUTPUT: una frase 'quién llama a quién'.\nNEXT: listener en Kali.",
    diagram: `REVERSE:  MS2  ----TCP---->  Kali vboxnet0:4444   (tú escuchas)
BIND:     Kali ----TCP---->  MS2:puerto            (ella escucha)
NO:       LHOST = wlan0 ni 127.0.0.1 para MS2`,
  },
  {
    id: "nc",
    titleEs: "02. Netcat en el atacante",
    titleEn: "Netcat on the attacker",
    bodyEs:
      "nc -lvnp 4444 WHAT: escuchas en Kali (reverse). WHY: analogía del multi/handler, más crudo. WHEN: el drill/examen pide listener. OUTPUT: 'listening on … 4444'.\n\nBind (tú eres cliente): nc IP PUERTO — te conectas a quien ya escucha. No es gobuster.\n\nnc de Debian/OpenBSD a menudo NO tiene -e. No memorices 'nc -e /bin/bash' como si fuera Kali moderno.\n\nEl one-liner bash /dev/tcp es SINTAXIS de examen (drill). Lo escribes de memoria; no lo lanzas a internet ni a tu router. En lab, Semana 3 ya usó payloads de msf contra TU MS2.",
  },
  {
    id: "msf",
    titleEs: "03. Relación con Metasploit",
    titleEn: "Tie-in to Metasploit",
    bodyEs:
      "reverse_tcp → set LHOST inet vboxnet0, set LPORT 4444, a veces multi/handler.\nbind → show options: LHOST puede no ser Required.\n\nWHAT: el mismo dibujo, otra UI.\nWHY: no aprendas nc y msf como mundos distintos.\nWHEN: Semana 3 + este bloque.\nOUTPUT: eliges reverse o bind leyendo el módulo.\nNEXT: integración Mes 1 (flujo, no un CVE nuevo).",
  },
];

/** m1-w4-b3/b4 — flujo, no receta nueva. */
export const WEEK4_FLOW_WORKSHOP: WorkshopSection[] = [
  {
    id: "flow",
    titleEs: "01. Unir Semanas 1–3 (sin walkthrough nuevo)",
    titleEn: "Join weeks 1–3",
    bodyEs:
      "Orden: nmap -p- -sV -sC (Kali host) → enum del PUERTO (SMB/FTP/HTTP) → searchsploit/msf search de ESA versión → show options → RHOSTS=TARGET_MS2, LHOST=vboxnet0 si reverse → documentar whoami.\n\nSegundo vector en MS2 = el mismo flujo sobre un servicio que YA viste en el scan, no un PoC de internet.\nKioptrix = otra VM tuya Host-Only, mismo orden.\n\nWHAT: checklist mental.\nWHY: eJPT es un box, no un catálogo de exploits.\nWHEN: b3/b4.\nOUTPUT: notas con IP, puertos, herramienta, resultado.\nNEXT: skill-check Mes 1. hashdump SAM no aplica en Linux.",
  },
];

export const WEEK4_TROUBLESHOOTING: TroubleItem[] = [
  {
    id: "ss-run",
    symptom: "Compilar o python un .c/.py de searchsploit el mismo día",
    cause: "El índice se confunde con explotación.",
    diagnose: "¿Ya anotaste versión y si es Linux/Windows?",
    command: "searchsploit vsftpd 2.3.4",
    fix: "Hoy: hit + msf search. Ejecutar PoC no es este bloque. Solo TU VM si Semana 3.",
    verify: "Tienes EDB-ID o ruta de módulo, no un proceso exploit.py.",
  },
  {
    id: "ss-wrong-os",
    symptom: "Hit de Windows/Apache que MS2 no tiene",
    cause: "Buscaste el nombre genérico, no TU versión de nmap.",
    diagnose: "less ~/ms2_full.nmap o el -sV de Semana 1",
    command: "searchsploit vsftpd 2.3.4",
    fix: "La query es la columna VERSION de TU scan.",
    verify: "El hit habla del mismo producto que -sV.",
  },
  {
    id: "rev-lhost",
    symptom: "Listener nc/msf en wlan0 o 127.0.0.1; MS2 no llama",
    cause: "Reverse necesita LHOST alcanzable por el guest = vboxnet0.",
    diagnose: "ip addr show vboxnet0 ; ss -lnt | grep 4444",
    command: "nc -lvnp 4444",
    fix: "Escucha en la IP de vboxnet0 (o 0.0.0.0 en Kali lab). LHOST no es el guest.",
    verify: "Mismo /24 que TARGET_MS2.",
  },
  {
    id: "bind-rev-mix",
    symptom: "set LHOST en un bind / nc cliente cuando debías escuchar",
    cause: "No dibujaste la flecha.",
    diagnose: "¿Quién inicia TCP?",
    command: "nc -lvnp 4444",
    fix: "Reverse: tú -lvnp. Bind: tú nc RHOST puerto.",
    verify: "Una frase: víctima llama / yo llamo.",
  },
];

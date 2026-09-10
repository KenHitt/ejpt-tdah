import { S } from "@/content/course/helper";
import { CourseLesson } from "@/content/course/types";
import { termsMatching } from "@/content/v92/terms";
import { LessonGuide } from "@/content/v92/types";

const LAB_PREP = [
  "Kali (atacante) encendido.",
  "VirtualBox con red Host-Only creada (vboxnet).",
  "Víctima (MS2 u otra VM de TU lab) en esa misma red, no Bridged.",
  "IP de Kali en vboxnet medida con ip addr.",
  "Alcance escrito: solo esas VMs.",
];

const LAB_LOST = [
  "Deberías tener: Kali + guest encendidos, misma Host-Only.",
  "Comprueba: ip addr en Kali (NIC del lab) y ifconfig/ip en el guest.",
  "Ping desde Kali a la IP del guest.",
  "Si no hay ping: NIC, DHCP/estático mismo /24, VM arrancada, no Bridged.",
  "No lances exploits para 'arreglar' la red.",
];

function base(id: string, rest: Omit<LessonGuide, "lessonId">): LessonGuide {
  return { lessonId: id, decisionHref: "/train/decisions", ...rest };
}

/** Guías V9.2: se AÑADEN a la jornada. No sustituyen read/quiz/lab. */
export const LESSON_GUIDES: LessonGuide[] = [
  base("c00-d1", {
    learnGoal: "Separar atacante, hipervisor y víctima, y por qué el lab va en Host-Only.",
    whyMatters: "Sin este modelo, LHOST y nmap irán a la NIC equivocada. eJPT asume que sabes dónde estás autorizado a tocar.",
    prereqLearnIds: ["ipv4"],
    terms: [
      { term: "VirtualBox", def: "Programa que ejecuta máquinas virtuales (las víctimas) en tu PC.", purpose: "Aislar Metasploitable del Wi‑Fi de casa." },
      { term: "Kali", def: "Tu sistema atacante: ahí corren nmap y Metasploit. En este plan es el SO del PC, no una VM.", purpose: "Desde Kali atacas el guest. Mezclar Kali-dentro-de-VirtualBox rompe LHOST." },
    ],
    extraRead: [
      S("¿Qué vas a aprender?", "Quién es el atacante (Kali en tu PC), qué es el hipervisor (VirtualBox) y por qué las víctimas no van en Bridged."),
      S("¿Por qué importa?", "Pentesting empieza por alcance y topología. Un comando 'correcto' en la red de casa es un incidente, no eJPT."),
      S("Host-Only vs NAT vs Bridged", "Host-Only = switch privado Kali↔guest. NAT = el guest sale a Internet. Bridged = el guest en tu Wi‑Fi. El ataque del lab usa Host-Only."),
    ],
    prep: LAB_PREP.slice(0, 3),
    checkpoints: [
      { h: "Alcance", p: "Puedes nombrar cada VM que vas a tocar." },
      { h: "Red", p: "Ninguna víctima está en Bridged." },
    ],
    lost: ["Escribe tres líneas: atacante, hipervisor, víctimas. Si no puedes, no abras nmap."],
    errors: [
      { symptom: "Quieres instalar Kali DENTRO de VirtualBox y atacar desde Windows", fix: "Este plan usa Kali como SO del PC. Mezclar modelos rompe LHOST." },
      { symptom: "MS2 en Bridged 'para que sea real'", fix: "Vuelve a Host-Only. Realismo ≠ poner un box vulnerable en la LAN familiar." },
    ],
    verify: ["Frase escrita: 'Hoy solo ataco <nombres> por Host-Only'."],
  }),
  base("c00-d2", {
    learnGoal: "Medir LHOST y el CIDR del lab. No copiar 192.168.56.1 de un tutorial.",
    whyMatters: "Un reverse shell muere si LHOST es wlan0 y el guest solo ve vboxnet.",
    prereqLessonIds: ["c00-d1"],
    prereqLearnIds: ["ipv4", "cidr"],
    commands: [
      { fragment: "ip addr", what: "Lista interfaces e IPs.", when: "Antes de cualquier LHOST.", expect: "Una NIC del lab (vboxnet0 o similar) con IP del /24 del lab, distinta de wlan0 y de 127.0.0.1." },
      { fragment: "ip route", what: "Muestra por qué interfaz sale cada red.", when: "Para saber el CIDR del lab vs default a Internet.", expect: "Una ruta al /24 Host-Only, aparte de la ruta a Internet si existe." },
      { fragment: "ping -c 2 <IP_guest>", what: "ICMP de Kali al guest.", when: "Cuando el guest ya tiene IP en el mismo /24.", expect: "Reply. Si no: capa 3, no Metasploit." },
    ],
    extraRead: [
      S("¿Qué es LHOST?", "IP de TU Kali en la NIC que la víctima puede alcanzar. Se mide. No se memoriza."),
      S("¿Qué es RHOST?", "IP de la víctima. Nunca 127.0.0.1 (eso eres tú)."),
      S("Observación → hipótesis → acción", "Sin IP en el guest, la hipótesis es 'capa 3 rota', no 'hace falta un exploit'."),
    ],
    prep: LAB_PREP,
    labBefore: [
      "Objetivo: tres números en papel: IP Kali lab, CIDR, IP guest.",
      "VirtualBox → File/File → Host Network Manager: existe vboxnet, DHCP opcional.",
      "Guest: adaptador 1 = Host-Only de esa red.",
      "Kali: ip addr. Copia la IP de esa NIC, no de wlan0.",
    ],
    checkpoints: [
      { h: "NIC", p: "Identificaste vboxnet (o el nombre que tenga en tu Kali)." },
      { h: "IP Kali", p: "Anotada, no es loopback ni wlan0." },
      { h: "Ping", p: "O documentas que el guest aún no tiene IP (entonces no hay nmap útil)." },
    ],
    lost: LAB_LOST,
    errors: [
      { symptom: "LHOST = 127.0.0.1", fix: "Loopback. El guest no es tú." },
      { symptom: "Ping a 8.8.8.8 funciona y crees que el lab está bien", fix: "Eso es Internet del host. Ping al guest." },
    ],
    verify: ["Papel con IP Kali, CIDR, IP guest (o 'guest sin IP, DHCP pendiente')."],
  }),
  base("c00-d3", {
    learnGoal: "Importar MS2, red Host-Only, snapshot, distinguir consola vs pentest por red.",
    whyMatters: "MS2 existe para practicar recon→enum→exploit en cerrado. No es un servidor de producción.",
    prereqLessonIds: ["c00-d2"],
    extraRead: [
      S("¿Qué es Metasploitable 2?", "Ubuntu intencionalmente vulnerable (Rapid7). Servicios viejos a propósito. No la parchees si quieres practicar eJPT."),
      S("Login msfadmin/msfadmin", "Administración de consola (hipervisor). No es meterpreter. El pentest empieza cuando Kali la ve por vboxnet."),
      S("¿Para qué el snapshot?", "Volver atrás si un brute o un módulo deja el guest inestable. El examen INE no te da esto; el lab sí."),
    ],
    prep: [...LAB_PREP, "Archivo .ova de MS2 que TÚ descargaste de fuente autorizada."],
    labBefore: [
      "Importar .ova.",
      "Settings → Network → Adapter 1 → Host-Only.",
      "Snapshot 'limpia' ANTES de nmap agresivo.",
      "Arrancar. Login consola. Anotar IP.",
      "Desde Kali: ping.",
    ],
    checkpoints: [
      { h: "Import", p: "La VM aparece en VirtualBox." },
      { h: "NIC", p: "Adapter 1 = Host-Only." },
      { h: "IP guest", p: "Anotada." },
      { h: "Ping", p: "Kali → guest responde." },
    ],
    lost: LAB_LOST,
    errors: [
      { symptom: "Bridged 'para tener Internet en MS2'", fix: "NAT si necesitas descargar; el ataque sigue en Host-Only. Mejor: no parches MS2." },
    ],
    verify: ["Ping OK + snapshot listado."],
  }),
  base("c00-d4", {
    learnGoal: "Host discovery: quién está vivo en TU /24. Todavía no es enumeración de servicios.",
    whyMatters: "eJPT empieza por el rango autorizado. -sn responde 'quién', no 'qué versión'.",
    prereqLessonIds: ["c00-d2", "c00-d3"],
    prereqLearnIds: ["host-discovery", "cidr"],
    commands: [
      { fragment: "nmap -sn <CIDR>", what: "Host discovery (ping scan). No lista 80/445.", when: "Tras medir el CIDR de vboxnet. Nunca 10.0.0.0/8 ni la Wi‑Fi de casa.", expect: "IPs up: la tuya y el guest. Anota cuál es cuál." },
    ],
    extraRead: [
      S("¿Qué es nmap?", "Escáner. Cada flag = una pregunta. -sn = ¿hay alguien? -sV = ¿qué servicio/versión?"),
      S("Observación → hipótesis", "Si -sn no ve al guest: apagado, NIC, ICMP, IP. Hipótesis de lab, no 'Nmap roto'."),
    ],
    prep: ["CIDR de ayer en papel.", "Guest encendido.", "Ping previo recomendado."],
    checkpoints: [
      { h: "CIDR", p: "Es el de vboxnet, no un /8." },
      { h: "Output", p: "Marcado Kali vs guest." },
    ],
    lost: [...LAB_LOST, "Repite ping. Luego -sn. No -p- si discovery falló."],
    errors: [{ symptom: "-sn no lista 445", fix: "Correcto. Usa -p/-sV después, en el host que importa." }],
    verify: ["Output guardado. Dos IPs identificadas."],
    independentHint: "Sin mirar la guía: escribe el CIDR de memoria y el flag de discovery.",
  }),
  base("c00-d5", {
    learnGoal: "Linux como barrio del pentester: id, denied, FS. No es un curso de admin completo.",
    whyMatters: "Permission denied es hallazgo. En eJPT leerás ficheros y usuarios en la víctima.",
    prereqLearnIds: ["linux-fs", "linux-users"],
    extraRead: [
      S("¿Qué es una shell?", "El programa donde escribes comandos. En Kali ya estás. En la víctima, llega después de un acceso."),
      S("id", "Muestra uid/gid/grupos. Contexto. No sustituye sudo -l."),
    ],
    commands: [
      { fragment: "id", what: "Quién soy.", when: "En cualquier shell nueva.", expect: "uid=… No root a menos que lo seas." },
    ],
    lost: ["Si no tienes guest, practica id/ls en Kali. No es el mismo contexto, pero el comando sí."],
    decisionHref: "/train/decisions",
  }),
  base("c00-d6", {
    learnGoal: "Cerrar el checkpoint de lab: ping, snapshot, alcance, IPs en papel.",
    whyMatters: "El resto del curso asume esto. Sin ello, Nmap es teatro.",
    prereqLessonIds: ["c00-d1", "c00-d2", "c00-d3", "c00-d4"],
    checkpoints: [
      { h: "Ping", p: "Kali → guest." },
      { h: "Snapshot", p: "Existe uno limpio." },
      { h: "Alcance", p: "Frase escrita." },
    ],
    lost: LAB_LOST,
    verify: ["Los cuatro: ping, IPs, snapshot, alcance."],
  }),
  base("c01-d1", {
    learnGoal: "Pasivo vs activo. Capas: discovery ≠ puertos ≠ versión.",
    whyMatters: "Saltar a exploits es fallar el método eJPT, no ir más rápido.",
    prereqLessonIds: ["c00-d4"],
    prereqLearnIds: ["host-discovery", "attack-surface"],
    extraRead: [
      S("¿Qué es recon?", "Reunir información. Pasivo no toca el target. Activo sí (nmap). Solo en alcance."),
      S("¿Cuándo activo?", "Cuando el brief/lab te autoriza un CIDR. Host-Only o VPN INE, no el café."),
    ],
    independentHint: "Escribe en una línea la diferencia pasivo/activo sin mirar.",
  }),
  base("c01-d2", {
    learnGoal: "Elegir default 1000 vs -p- vs lista. El reloj importa.",
    whyMatters: "-p- en un /24 te come el examen. Primero vivos, luego el host que importa.",
    prereqLearnIds: ["port-scan"],
    commands: [
      { fragment: "nmap -p- <RHOST>", what: "Todos los TCP. Lento.", when: "Un host que ya sabes que está up y el brief puede tener puertos altos.", expect: "Lista larga. No lo lances al /24 entero el primer minuto." },
    ],
    extraRead: [
      S("¿Qué es un puerto?", "Número que identifica un servicio en un host (22 SSH, 80 HTTP, 445 SMB). Open = hay un listener, no un exploit."),
    ],
  }),
  base("c01-d3", {
    learnGoal: "Versiones: -sV. Banner ≈ hipótesis, no CVE confirmado.",
    prereqLearnIds: ["banner-nse"],
    commands: [
      { fragment: "nmap -sV <RHOST>", what: "Pregunta servicio y versión en puertos descubiertos.", when: "Después de saber qué puertos importan.", expect: "ssh OpenSSH x.y, http Apache… Versión cercana ≠ exploit listo." },
    ],
    extraRead: [S("¿Por qué -sV?", "Para decidir qué enumerar (SMB vs HTTP) y qué searchsploit tiene sentido como hipótesis.")],
  }),
  base("c01-d4", {
    learnGoal: "Interpretar un output: varios open ≠ un único vector.",
    extraRead: [
      S("Observación → decisión", "21, 22, 80, 445: son cuatro preguntas. Elige UNA superficie ahora (TDAH: una). SMB users o HTTP dirs, no cinco tools a medias."),
    ],
    decisionHref: "/train/decisions",
  }),
  base("c01-d5", {
    learnGoal: "NSE es un script, no un 'hack automático'.",
    extraRead: [S("¿Cuándo NSE?", "Cuando ya sabes el servicio y quieres una pregunta concreta (vuln, info). No -A a ciegas en todo el /24.")],
  }),
  base("c01-d6", {
    learnGoal: "Cerrar recon: superficie anotada, next step escrito.",
    independentHint: "Dado un output de nmap (el tuyo), escribe el next step en una frase.",
    decisionHref: "/train/whats-next",
  }),
  base("c02-d1", {
    learnGoal: "SMB: 139/445 → users/shares. No Gobuster.",
    prereqLearnIds: ["smb"],
    commands: [
      { fragment: "smbclient -L //<RHOST> -N", what: "Lista shares; -N sin pass (null session si el server lo permite).", when: "Cuando 139/445 están open.", expect: "IPC$, quizás shares. ACCESS DENIED es hallazgo." },
    ],
    extraRead: [
      S("¿Qué es SMB?", "Compartir archivos/impresoras. En lab Linux a menudo Samba. No es HTTP."),
      S("¿Para qué enumerar?", "Users que luego sirvan en SSH/FTP. Shares con READ = loot."),
    ],
  }),
  base("c02-d2", {
    learnGoal: "Leer un share permitido; no insistir en ADMIN$ por el nombre.",
    extraRead: [S("Denied", "En ADMIN$ es esperado para un user bajo. public READ es el camino. Transfer: otro host, otros shares.")],
    decisionHref: "/train/transfer",
  }),
  base("c02-d3", {
    learnGoal: "HTTP dirs: Gobuster cuando hay 80/443. 403 existe.",
    prereqLearnIds: ["web-dirs", "http-basics"],
    commands: [
      { fragment: "gobuster dir -u http://<RHOST>/ -w <wordlist>", what: "Prueba rutas contra un diccionario.", when: "HTTP abierto. Cambia -x si la app no es PHP.", expect: "200/301/403. 403 ≠ fin de superficie." },
    ],
  }),
  base("c02-d4", {
    learnGoal: "Hydra solo con usuario. Preparar insumos, no brute a ciegas.",
    prereqLearnIds: ["enum-ssh"],
    extraRead: [S("Hydra necesita user", "Sin usuario, brute es ruido y puedes bloquear cuentas. Copia el user de SMB/FTP y escribe el comando antes de lanzarlo.")],
    decisionHref: "/train/decisions",
  }),
  base("c02-d5", {
    learnGoal: "El puerto elige la tool: Gobuster vs Hydra vs enum4linux.",
    extraRead: [S("Tabla mental", "445 → SMB. 80 → HTTP dirs. 22/21 con USER → Hydra. Si dudas, enum más, brute menos.")],
    decisionHref: "/train/decisions",
  }),
  base("c02-d6", {
    learnGoal: "FTP/SSH: banner, anonymous y keys. No dirbustear el 22.",
    prereqLearnIds: ["enum-ssh", "linux-ssh"],
    extraRead: [S("Open ≠ login", "El puerto 22 abierto es un listener. Anonymous FTP a veces da loot antes que Hydra root.")],
    decisionHref: "/train/decisions",
  }),
  base("c03-d1", {
    learnGoal: "Metasploit: search → use → options. Todavía no 'run a ciegas'.",
    prereqLearnIds: ["msf-flow"],
    extraRead: [
      S("¿Qué es un módulo?", "Un procedimiento empaquetado (exploit/auxiliary). show options lista lo que TÚ debes medir: RHOSTS, LHOST."),
      S("¿Por qué no es caja negra?", "Si LHOST está mal, no hay sesión. El framework no adivina tu vboxnet."),
    ],
  }),
  base("c03-d2", {
    learnGoal: "show options y LHOST en la NIC del lab.",
    commands: [
      { fragment: "show options", what: "Required vs opcionales.", when: "Siempre antes de run.", expect: "RHOSTS y LHOST rellenados con IPs medidas." },
    ],
  }),
  base("c04-d1", {
    learnGoal: "Vuln: versión → hipótesis searchsploit. Match cercano ≠ explotado.",
    prereqLearnIds: ["cve-select"],
    extraRead: [S("Identificar ≠ explotar", "El banner miente a veces. Validar en lab. False positive existe.")],
  }),
  base("c05-d1", {
    learnGoal: "HTTP: request/response. DVWA es un gimnasio, no el examen.",
    prereqLearnIds: ["http-basics"],
    extraRead: [
      S("¿Qué es DVWA?", "Web vulnerable a propósito. En esta academy: localhost/Docker. Practicas SQLi/XSS/LFI sin tocar sistemas ajenos."),
      S("¿Cómo se usa aquí?", "Login de lab, elige la vuln, prueba a mano el parámetro, luego la tool si hay evidencia."),
    ],
  }),
  base("c05-d2", {
    learnGoal: "SQLi: el parámetro a mano antes de sqlmap ciego.",
    prereqLearnIds: ["sqli"],
    extraRead: [S("80 open ≠ SQLi", "Necesitas un parámetro que llegue a la consulta. Observa, prueba, luego tool.")],
  }),
  base("c05-d3", {
    learnGoal: "sqlmap después de ver el request. Flags = preguntas, no un botón.",
    prereqLearnIds: ["sqli"],
    extraRead: [
      S("¿Qué es sqlmap?", "Automatiza detección y extracción SQLi. No adivina el parámetro si tú no se lo das (URL/cookie)."),
      S("¿Cuándo?", "Cuando ya rompiste a mano o viste el campo. --batch no sustituye leer el output."),
    ],
  }),
  base("c05-d4", {
    learnGoal: "XSS: el navegador ejecuta tu input. Reflected vs stored.",
    prereqLearnIds: ["xss"],
    extraRead: [S("¿Qué es XSS?", "Inyectar script que corre en el contexto de la víctima. En DVWA, prueba el campo; no es SMB.")],
  }),
  base("c06-d1", {
    learnGoal: "LFI: el parámetro apunta a un fichero. Path traversal con evidencia.",
    prereqLearnIds: ["lfi"],
    extraRead: [
      S("¿Qué es LFI?", "La app incluye un fichero local según un parámetro (page=, file=). Si no hay parámetro de path, no hay LFI."),
      S("¿Cómo compruebo?", "Un path conocido (p. ej. /etc/passwd en Linux de lab) o un error que delate inclusión. 404 no es 'casi'."),
    ],
  }),
  base("c04-d2", {
    learnGoal: "searchsploit es biblioteca. El match cercano sigue siendo hipótesis.",
    prereqLearnIds: ["cve-select"],
    extraRead: [S("¿Cuándo searchsploit?", "Cuando -sV te dio producto+versión. El PoC se valida en lab, no se lanza a ciegas.")],
  }),
  base("c08-d1", {
    learnGoal: "PrivEsc Linux: sudo -l y denied antes de un kernel al azar.",
    prereqLearnIds: ["sudo", "suid-caps"],
    extraRead: [S("¿Cuándo privesc?", "Cuando ya eres user. id primero. LinPEAS no razona el examen.")],
  }),
  base("c07-d1", {
    learnGoal: "Pivoting: CUÁNDO. Kali no alcanza esa red; la víctima sí.",
    prereqLearnIds: ["portfwd"],
    extraRead: [S("Si Kali ya hace ping al host", "No inventes SOCKS. Pivot es conectividad que tú no tienes.")],
    decisionHref: "/train/decisions",
  }),
  base("c10-d1", {
    learnGoal: "Reporting: pregunta → evidencia → string exacto.",
    prereqLearnIds: ["report-finding"],
    extraRead: [S("No es un ensayo", "Asset, repro, evidencia. El executive summary no sustituye el valor.")],
  }),
];

export function guideById(lessonId: string) {
  return LESSON_GUIDES.find((g) => g.lessonId === lessonId);
}

const WEEK_CONTEXT: Record<number, { goal: string; why: string; extra: string }> = {
  0: {
    goal: "Montar un lab aislado y medir IPs antes de escanear.",
    why: "Sin Host-Only, LHOST y nmap apuntan a la red equivocada.",
    extra: "Mide la NIC del lab (vboxnet), no wlan0. Ping al guest antes de nmap. Snapshot antes de romper.",
  },
  1: {
    goal: "Recon por capas: vivos → puertos → versiones → next step.",
    why: "eJPT puntúa el método. Un exploit sin superficie es teatro.",
    extra: "-sn responde quién. -sV responde qué servicio. Open no es vulnerable.",
  },
  2: {
    goal: "Enumerar el servicio que el puerto indica, no tu tool favorita.",
    why: "Mezclar Gobuster y SMB quema el reloj y no produce evidencia.",
    extra: "Observa el puerto → elige UNA herramienta → lee el output → decide.",
  },
  3: {
    goal: "Usar Metasploit como flujo: search, options, LHOST medido, verificar sesión.",
    why: "run a ciegas no enseña eJPT. show options es el examen.",
    extra: "LHOST es tu IP en vboxnet. RHOSTS es el guest. 127.0.0.1 no es la víctima.",
  },
  4: {
    goal: "Tratar el CVE como hipótesis: match de versión, probar, verificar acceso.",
    why: "Identificar ≠ explotar. False positive existe.",
    extra: "Si no hay sesión o evidencia, el módulo no 'funcionó'. Cambia hipótesis, no el alcance.",
  },
  5: {
    goal: "Web: ver el request (método, parámetro) antes de sqlmap o XSS ciego.",
    why: "80 open no es SQLi. DVWA es gimnasio local, no el examen.",
    extra: "Intercepta. Prueba a mano. Luego la tool. Nunca contra sitios ajenos.",
  },
  6: {
    goal: "LFI/RFI: el parámetro de fichero. Path traversal con evidencia, no wordlists al azar.",
    why: "Mes 2 web. El examen espera que identifiques inclusión, no que adivines.",
    extra: "Si no hay parámetro de path, no hay LFI. 404 en /etc/passwd no es 'casi'.",
  },
  7: {
    goal: "Pivot solo cuando Kali no alcanza esa red y la víctima sí.",
    why: "Si ya haces ping, no inventes SOCKS.",
    extra: "Dibuja dos redes. Escribe qué IP ves y cuál no. Port forward es un puente, no magia.",
  },
  8: {
    goal: "PrivEsc después de ser user: id, sudo -l, denied. No un kernel al azar.",
    why: "Sin shell no hay escalada. LinPEAS no razona el examen.",
    extra: "Escribe uid. Luego sudo -l. Denied es hallazgo. Kernel exploit es last resort de lab.",
  },
  9: {
    goal: "Cadena completa bajo reloj: mismo método, otro box.",
    why: "El CVE no viaja. El método sí.",
    extra: "Una superficie 20 min. Decide. No cinco tools a medias.",
  },
  10: {
    goal: "Reporting: pregunta del brief → evidencia exacta.",
    why: "Un valor mal copiado invalida el hallazgo.",
    extra: "Asset, repro, string. El resumen ejecutivo no sustituye el campo que piden.",
  },
  11: {
    goal: "Logística de examen: VPN, triage, integridad, T-48.",
    why: "Saber nmap no basta si pierdes la VPN o el alcance.",
    extra: "Escribe el orden de los primeros 30 min. No instales tools nuevas el día D.",
  },
  12: {
    goal: "Cerrar huecos: repetir la cadena más débil, no coleccionar OVAs.",
    why: "Consolidar es eJPT. Más boxes a medias no.",
    extra: "Elige UN fallo (SMB, web o privesc). Repítelo hasta explicarlo en voz alta.",
  },
};

const COMMAND_HINTS: { test: RegExp; fragment: string; what: string; when: string; expect: string }[] = [
  {
    test: /\bnmap\b/i,
    fragment: "nmap",
    what: "Escáner. Cada flag es una pregunta (vivos, puertos, versión).",
    when: "Tras saber el CIDR autorizado y que el guest está up.",
    expect: "Hosts up y/o puertos open. Interpretar: open ≠ exploit.",
  },
  {
    test: /\bgobuster\b/i,
    fragment: "gobuster dir",
    what: "Fuerza rutas HTTP contra un wordlist.",
    when: "Hay 80/443. No contra 445.",
    expect: "200/301/403. 403 sigue siendo superficie.",
  },
  {
    test: /\bsmbclient\b/i,
    fragment: "smbclient",
    what: "Cliente SMB: listar o entrar a shares.",
    when: "139/445 open.",
    expect: "Lista de shares o ACCESS DENIED (también es dato).",
  },
  {
    test: /\bhydra\b/i,
    fragment: "hydra",
    what: "Fuerza logins. Necesita usuario y servicio.",
    when: "Último recurso, con user conocido, en lab.",
    expect: "Login válido o bloqueo. Sin user, no lo lances.",
  },
  {
    test: /\b(msfconsole|show options|search vsftpd)\b/i,
    fragment: "msfconsole / show options",
    what: "Framework: cargar módulo y ver required.",
    when: "Después de servicio+versión, no como primer comando del día.",
    expect: "RHOSTS y LHOST rellenos con IPs medidas.",
  },
  {
    test: /\bip addr\b/i,
    fragment: "ip addr",
    what: "Lista interfaces e IPs de Kali.",
    when: "Antes de LHOST.",
    expect: "IP de vboxnet, distinta de wlan0 y de 127.0.0.1.",
  },
  {
    test: /\bping\b/i,
    fragment: "ping",
    what: "Comprueba capa 3 (¿el paquete llega?).",
    when: "Antes de nmap si el guest debería estar en el mismo /24.",
    expect: "Reply. Si no: red, no exploit.",
  },
];

function lessonCorpus(lesson: CourseLesson): string {
  return [
    lesson.titleEs,
    lesson.labTitle,
    lesson.pep,
    ...lesson.labSteps,
    ...lesson.read.map((s) => `${s.h} ${s.p}`),
    ...(lesson.theoryExtra ?? []).map((s) => `${s.h} ${s.p}`),
  ].join("\n");
}

function mergeTerms(custom: LessonGuide | undefined, text: string) {
  const map = new Map<string, NonNullable<LessonGuide["terms"]>[number]>();
  for (const t of custom?.terms ?? []) map.set(t.term.toLowerCase(), t);
  for (const t of termsMatching(text)) {
    if (!map.has(t.term.toLowerCase())) {
      map.set(t.term.toLowerCase(), { term: t.term, def: t.def, purpose: t.purpose, href: t.href });
    }
  }
  return [...map.values()];
}

function mergeCommands(custom: LessonGuide | undefined, labText: string) {
  const out = [...(custom?.commands ?? [])];
  const have = new Set(out.map((c) => c.fragment.toLowerCase()));
  for (const h of COMMAND_HINTS) {
    if (!h.test.test(labText)) continue;
    if ([...have].some((f) => h.fragment.toLowerCase().includes(f) || f.includes(h.fragment.toLowerCase()))) continue;
    out.push({ fragment: h.fragment, what: h.what, when: h.when, expect: h.expect });
    have.add(h.fragment.toLowerCase());
  }
  return out;
}

const DEFAULT_PREP = [
  "Kali encendido. Víctima de TU lab (Host-Only) o DVWA en localhost, según la jornada.",
  "IPs medidas hoy (no copiadas de un tutorial).",
  "Alcance escrito: solo esas máquinas.",
];

const DEFAULT_LOST = [
  "Qué deberías tener: IPs de Kali y del target, misma red o DVWA local.",
  "Comprueba ping o curl al servicio. Si falla, para: es red, no el tema de hoy.",
  "Repite el último comando que sí funcionó. Anota el output.",
];

const DEFAULT_ERRORS = [
  { symptom: "El comando 'correcto' no responde", fix: "Verifica IP, NIC (vboxnet vs wlan0) y que el guest está up." },
  { symptom: "Quieres saltar al exploit", fix: "Vuelve a observación → hipótesis → acción. Sin output, no hay next step." },
];

/** Guía final: custom + términos detectados + contexto de módulo. No sustituye read. */
export function guideForLesson(lesson: CourseLesson): LessonGuide {
  const custom = guideById(lesson.id);
  const week = WEEK_CONTEXT[lesson.week];
  const extraRead = [
    ...(custom?.extraRead ?? []),
    ...(custom?.extraRead?.length
      ? []
      : [
          S("¿Qué vas a aprender?", week?.goal ?? "Aplicar el tema de esta jornada con evidencia, no de memoria."),
          S("¿Por qué importa?", week?.why ?? "eJPT evalúa decisiones con datos, no recetas sueltas."),
          S("Antes del laboratorio", week?.extra ?? "Concepto → propósito → ejemplo → tú lo haces → lab."),
        ]),
  ];
  const text = `${lessonCorpus(lesson)}\n${extraRead.map((s) => `${s.h} ${s.p}`).join("\n")}`;
  const labText = `${lesson.labTitle}\n${lesson.labSteps.join("\n")}`;
  return {
    lessonId: lesson.id,
    learnGoal: custom?.learnGoal ?? week?.goal,
    whyMatters: custom?.whyMatters ?? week?.why,
    terms: mergeTerms(custom, text),
    prereqLearnIds: custom?.prereqLearnIds,
    prereqLessonIds: custom?.prereqLessonIds,
    commands: mergeCommands(custom, labText),
    prep: custom?.prep?.length ? custom.prep : DEFAULT_PREP,
    checkpoints: custom?.checkpoints?.length
      ? custom.checkpoints
      : [
          { h: "Preparación", p: "Sabes qué máquinas y qué IP usas." },
          { h: "Acción", p: "Ejecutaste el procedimiento de esta jornada." },
          { h: "Evidencia", p: "Anotaste un resultado (output, status, denied, ruta)." },
        ],
    lost: custom?.lost?.length ? custom.lost : DEFAULT_LOST,
    verify: custom?.verify?.length ? custom.verify : ["Puedes decir qué observaste, qué hiciste y qué sigue."],
    errors: custom?.errors?.length ? custom.errors : DEFAULT_ERRORS,
    extraRead,
    labBefore: custom?.labBefore?.length
      ? custom.labBefore
      : [
          "Qué vamos a hacer: el labTitle de esta jornada, en TU lab.",
          "Por qué: para aplicar el concepto, no para 'terminar la página'.",
          "Comprueba IPs y conectividad antes del primer comando agresivo.",
        ],
    decisionHref: custom?.decisionHref ?? "/train/decisions",
    independentHint:
      custom?.independentHint ?? "Sin mirar: escribe observación → comando → resultado esperado → siguiente decisión.",
  };
}

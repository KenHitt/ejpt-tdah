import { Subtopic } from "@/lib/types";

/**
 * Registro central de subtemas. Cada drill, bloque y pregunta de quiz se etiqueta
 * con uno o más de estos IDs. Esto es lo que permite:
 *  - Simulacros acumulativos (solo entran subtemas con introducedAtGlobalWeek <= semana actual)
 *  - Tracking de fallos por sub-tema exacto (no "Metasploit en general")
 *  - Detección de "punto crítico de riesgo" (mismo subtema falla 2 veces tras repaso)
 */
export const SUBTOPICS: Subtopic[] = [
  // ---- Semana 1: Recon & Scanning ----
  { id: "nmap-basic", nameEs: "Escaneo básico con Nmap", nameEn: "Basic Nmap scanning", category: "scanning", introducedAtGlobalWeek: 1 },
  { id: "nmap-scripts", nameEs: "Nmap Scripting Engine (NSE)", nameEn: "Nmap NSE scripts", category: "scanning", introducedAtGlobalWeek: 1 },
  { id: "nmap-versioning", nameEs: "Detección de versión y SO", nameEn: "Service/OS version detection", category: "scanning", introducedAtGlobalWeek: 1 },
  { id: "passive-recon", nameEs: "Recon pasivo (whois, DNS, OSINT)", nameEn: "Passive reconnaissance", category: "recon", introducedAtGlobalWeek: 1 },

  // ---- Semana 2: Enumeración de servicios (huecos del usuario) ----
  { id: "enum4linux", nameEs: "Enumeración SMB con enum4linux", nameEn: "SMB enumeration with enum4linux", category: "enumeration", introducedAtGlobalWeek: 2, knownGap: true },
  { id: "smb-manual", nameEs: "Enumeración manual SMB (smbclient/smbmap)", nameEn: "Manual SMB enumeration", category: "enumeration", introducedAtGlobalWeek: 2 },
  { id: "gobuster-dir", nameEs: "Fuerza bruta de directorios/archivos web", nameEn: "Web directory/file brute-forcing (Gobuster)", category: "web", introducedAtGlobalWeek: 2, knownGap: true },
  { id: "hydra-bruteforce", nameEs: "Fuerza bruta de credenciales de servicio", nameEn: "Service credential brute-forcing (Hydra)", category: "brute-force", introducedAtGlobalWeek: 2, knownGap: true },
  { id: "tool-selection", nameEs: "Cuándo usar Gobuster vs Hydra vs enum4linux", nameEn: "Tool selection: Gobuster vs Hydra vs enum4linux", category: "enumeration", introducedAtGlobalWeek: 2, knownGap: true },
  { id: "ftp-ssh-enum", nameEs: "Enumeración de FTP/SSH", nameEn: "FTP/SSH enumeration", category: "enumeration", introducedAtGlobalWeek: 2 },

  // ---- Semana 3: Metasploit (hueco del usuario) ----
  { id: "msf-search-use", nameEs: "Búsqueda y selección de módulos (search/use)", nameEn: "Module search & selection (search/use)", category: "metasploit", introducedAtGlobalWeek: 3, knownGap: true },
  { id: "msf-options", nameEs: "Configuración de opciones (show options/set)", nameEn: "Option configuration (show options/set)", category: "metasploit", introducedAtGlobalWeek: 3, knownGap: true },
  { id: "msf-lhost-lport", nameEs: "Set correcto de LHOST/LPORT/RHOSTS", nameEn: "Setting LHOST/LPORT/RHOSTS correctly", category: "metasploit", introducedAtGlobalWeek: 3, knownGap: true },
  { id: "msf-sysinfo", nameEs: "Post-explotación básica (sysinfo, getuid)", nameEn: "Basic post-exploitation (sysinfo, getuid)", category: "metasploit", introducedAtGlobalWeek: 3, knownGap: true },
  { id: "msf-hashdump", nameEs: "Extracción de hashes (hashdump)", nameEn: "Credential dumping (hashdump)", category: "metasploit", introducedAtGlobalWeek: 3, knownGap: true },
  { id: "msf-multihandler", nameEs: "Listener multi/handler y payloads", nameEn: "multi/handler listener & payloads", category: "metasploit", introducedAtGlobalWeek: 3, knownGap: true },
  { id: "msfvenom", nameEs: "Generación de payloads con msfvenom", nameEn: "Payload generation with msfvenom", category: "metasploit", introducedAtGlobalWeek: 3 },

  // ---- Semana 4: Explotación & consolidación Mes 1 ----
  { id: "vuln-assessment", nameEs: "Evaluación de vulnerabilidades (Nessus/searchsploit)", nameEn: "Vulnerability assessment (Nessus/searchsploit)", category: "scanning", introducedAtGlobalWeek: 4 },
  { id: "exploit-linux", nameEs: "Explotación de servicios en Linux", nameEn: "Linux service exploitation", category: "exploitation", introducedAtGlobalWeek: 4 },
  { id: "exploit-windows", nameEs: "Explotación de servicios en Windows", nameEn: "Windows service exploitation", category: "exploitation", introducedAtGlobalWeek: 4 },
  { id: "reverse-vs-bind", nameEs: "Reverse shell vs Bind shell", nameEn: "Reverse shell vs bind shell", category: "exploitation", introducedAtGlobalWeek: 4 },

  // ---- Mes 2: Web, redes, post-explotación ----
  { id: "web-sqli", nameEs: "Inyección SQL (manual + sqlmap)", nameEn: "SQL Injection (manual + sqlmap)", category: "web", introducedAtGlobalWeek: 5 },
  { id: "web-xss", nameEs: "Cross-Site Scripting (XSS)", nameEn: "Cross-Site Scripting (XSS)", category: "web", introducedAtGlobalWeek: 5 },
  { id: "web-lfi-rfi", nameEs: "Local/Remote File Inclusion", nameEn: "LFI/RFI", category: "web", introducedAtGlobalWeek: 6 },
  { id: "web-auth-bypass", nameEs: "Bypass de autenticación web", nameEn: "Web authentication bypass", category: "web", introducedAtGlobalWeek: 6 },
  { id: "net-mitm", nameEs: "Ataques de red (ARP spoofing, sniffing)", nameEn: "Network attacks (ARP spoofing, sniffing)", category: "networking", introducedAtGlobalWeek: 7 },
  { id: "net-pivoting", nameEs: "Pivoting y port forwarding", nameEn: "Pivoting & port forwarding", category: "networking", introducedAtGlobalWeek: 7 },
  { id: "privesc-linux", nameEs: "Escalada de privilegios en Linux", nameEn: "Linux privilege escalation", category: "post-exploitation", introducedAtGlobalWeek: 8 },
  { id: "privesc-windows", nameEs: "Escalada de privilegios en Windows", nameEn: "Windows privilege escalation", category: "post-exploitation", introducedAtGlobalWeek: 8 },
  { id: "post-exploit-loot", nameEs: "Recolección de evidencia post-explotación", nameEn: "Post-exploitation data harvesting", category: "post-exploitation", introducedAtGlobalWeek: 8 },

  // ---- Mes 3: Integración y examen ----
  { id: "full-chain", nameEs: "Cadena completa recon->explotación->post", nameEn: "Full attack chain", category: "exploitation", introducedAtGlobalWeek: 9 },
  { id: "reporting", nameEs: "Documentación y reporte estilo eJPT", nameEn: "eJPT-style reporting", category: "reporting", introducedAtGlobalWeek: 10 },
  { id: "exam-logistics", nameEs: "Mecánica y logística del examen eJPT", nameEn: "eJPT exam mechanics & logistics", category: "exam-mechanics", introducedAtGlobalWeek: 11 },
];

export function getSubtopic(id: string): Subtopic | undefined {
  return SUBTOPICS.find((s) => s.id === id);
}

export function subtopicsAvailableAtWeek(globalWeek: number): Subtopic[] {
  return SUBTOPICS.filter((s) => s.introducedAtGlobalWeek <= globalWeek);
}

export const KNOWN_GAPS = SUBTOPICS.filter((s) => s.knownGap);

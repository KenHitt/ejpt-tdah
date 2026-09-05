/** Hints 1..5: conceptual, strategic, tool, command, solution */

export const DEFAULT_HINTS: [string, string, string, string, string] = [
  "Escribe en el formulario qué evidencia tienes (puertos, versiones). No pidas pista en vacío.",
  "Una fase: Recon → Enum → Vuln → Exploit. ¿En cuál estás atascado? Cambia de fase, no el mismo comando.",
  "Revisa el servicio con más superficie (SMB 445, FTP 21, HTTP 80) y enumera ESE primero.",
  "Si es SMB: enum4linux -a <IP>. Si es web dirs: gobuster dir -u http://<IP> -w /usr/share/wordlists/dirb/common.txt",
  "Solución completa: no la uses salvo que lleves >40 min sin evidencia nueva. Documenta el camino y pasa a recall de esa herramienta.",
];

export const HINTS_BY_SUBTOPIC: Record<string, [string, string, string, string, string]> = {
  "nmap-basic": [
    "Aún no enumeras servicios. Primero: ¿qué IPs responden?",
    "Host discovery, luego un host, luego puertos.",
    "nmap. Flags -sn y después -p- -sV.",
    "nmap -sn 192.168.56.0/24",
    "Luego nmap -p- -sV <IP> -oA baseline",
  ],
  enum4linux: [
    "445/139 abierto. Información SIN autenticación primero.",
    "Usuarios, shares, política. No Metasploit todavía.",
    "enum4linux.",
    "enum4linux -a <IP>",
    "Después smbclient -L <IP> -N y smbmap -H <IP>",
  ],
  "gobuster-dir": [
    "Es HTTP. Buscas rutas, no passwords ni SMB.",
    "Directory brute-force.",
    "gobuster modo dir.",
    "gobuster dir -u http://<IP> -w /usr/share/wordlists/dirb/common.txt",
    "Añade -x php,txt si buscas archivos.",
  ],
  "hydra-bruteforce": [
    "Tienes un LOGIN (ssh/ftp/http-form), no un path.",
    "Credential brute-force.",
    "hydra -l/-L y -p/-P.",
    "hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://<IP>",
    "Limita -t 4 si el servicio cae.",
  ],
  "msf-lhost-lport": [
    "Reverse shell = la víctima llama a TU IP de lab (vboxnet0), no a la de ella.",
    "RHOSTS víctima. LHOST atacante.",
    "set LHOST $(ip -4 -br a | awk '/vboxnet/{print $3}' | cut -d/ -f1)",
    "set RHOSTS <víctima>  luego  set LHOST 192.168.56.1  set LPORT 4444",
    "show options otra vez. Required no puede estar vacío.",
  ],
  "lab-vbox": [
    "Kali es el SO del PC. La víctima es una VM Host-Only.",
    "Sin vboxnet0 no hay ping. Crea Host-Only primero.",
    "ip -br a | grep vboxnet",
    "ping -c 3 <IP_MS2>",
    "Anota LHOST y TARGET_MS2 en ~/ejpt-lab.txt",
  ],
};

export function hintsForSubtopics(ids: string[]): [string, string, string, string, string] {
  for (const id of ids) {
    if (HINTS_BY_SUBTOPIC[id]) return HINTS_BY_SUBTOPIC[id];
  }
  return DEFAULT_HINTS;
}

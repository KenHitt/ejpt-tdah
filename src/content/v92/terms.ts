import { AcademyTerm } from "@/content/v92/types";

/** Términos que las lecciones no deben asumir. Enlaces a fichas existentes. */
export const ACADEMY_TERMS: AcademyTerm[] = [
  { term: "Kali", aliases: ["kali linux", "kali"], def: "Tu sistema atacante: el Linux donde escribes nmap, Metasploit y el resto de herramientas. En ESTE plan Kali es el SO de tu PC, no una VM Bridged.", purpose: "Desde aquí atacas las víctimas de VirtualBox. Si instalas Kali dentro de VirtualBox y atacas desde Windows, LHOST y las guías no coinciden." },
  { term: "VirtualBox", aliases: ["virtualbox", "vbox"], def: "Hipervisor: el programa que ejecuta las máquinas virtuales VÍCTIMAS (Metasploitable, Kioptrix) en tu PC.", purpose: "Aísla las boxes vulnerables de tu Wi‑Fi. No es 'otro Kali'." },
  { term: "Host-Only", aliases: ["host-only", "vboxnet", "vboxnet0"], def: "Red virtual de VirtualBox que une el host y las VMs de esa red, sin ofrecer las víctimas a tu Wi‑Fi.", purpose: "Laboratorio aislado: Kali y la víctima se ven; Internet no es el camino del ataque.", href: "/laboratorio" },
  { term: "NAT", aliases: ["nat"], def: "Modo en el que el guest sale a Internet a través del host, como detrás de un router.", purpose: "Descargar parches o ISO. No es la red donde Kali ataca a MS2.", href: "/learn/gateway" },
  { term: "Bridged", aliases: ["bridged", "bridge"], def: "La VM aparece en la misma LAN que tu Wi‑Fi, con una IP de esa red.", purpose: "Casi nunca en este plan: pondrías una máquina diseñada para ser rota junto a la familia." },
  { term: "DVWA", aliases: ["dvwa"], def: "Damn Vulnerable Web Application: web hecha para practicar fallos (SQLi, XSS, LFI) en un entorno que TÚ controlas.", purpose: "Practicar web sin atacar sitios reales. Suele correr en localhost/Docker en Kali.", href: "/learn/http-basics" },
  { term: "SMB", aliases: ["smb", "445", "microsoft-ds", "netbios"], def: "Protocolo de archivos e impresión en redes Windows/Samba. Puertos típicos 139 y 445.", purpose: "Enumerar users y shares. No se dirbustea: no es HTTP.", href: "/learn/smb" },
  { term: "FTP", aliases: ["ftp", "vsftpd"], def: "Protocolo de transferencia de archivos (puerto 21). A veces permite anonymous.", purpose: "Listar o bajar ficheros si el servidor lo permite. Banner ≠ explotado.", href: "/learn/enum-ssh" },
  { term: "SSH", aliases: ["ssh"], def: "Shell remota cifrada (puerto 22). Open significa que hay un listener, no que tengas credenciales.", purpose: "Acceso interactivo cuando hay user/clave/clave SSH. Hydra necesita un usuario.", href: "/learn/enum-ssh" },
  { term: "HTTP", aliases: ["http", "https"], def: "Protocolo de la web (80/443). Petición y respuesta: método, ruta, headers, body.", purpose: "Enumerar rutas, parámetros y autenticación. Gobuster habla HTTP, no 445.", href: "/learn/http-basics" },
  { term: "reverse shell", aliases: ["reverse shell", "reverse"], def: "La víctima inicia la conexión hacia TU listener (LHOST:LPORT).", purpose: "Cuando Kali no puede conectar hacia dentro (NAT/firewall), pero la víctima sí puede salir hacia ti — en el lab, hacia vboxnet.", href: "/learn/msf-flow" },
  { term: "payload", aliases: ["payload"], def: "Código que se ejecuta tras un exploit: qué quieres que pase (shell, meterpreter).", purpose: "Elegir reverse vs bind y el formato. No es el CVE en sí.", href: "/learn/manual-exploit" },
  { term: "exploit", aliases: ["exploit", "módulo"], def: "Pieza que aprovecha una vulnerabilidad concreta. Hipótesis hasta que hay sesión o evidencia.", purpose: "Pasar de versión+match a acceso, solo en lab autorizado.", href: "/learn/cve-select" },
  { term: "enumeration", aliases: ["enum", "enumeración", "enumerar"], def: "Preguntar a un servicio qué users, shares, dirs o versión tiene. No es explotar.", purpose: "Decidir el siguiente vector con datos, no con una receta.", href: "/learn/attack-surface" },
  { term: "pivoting", aliases: ["pivot", "pivotar", "pivoting"], def: "Usar un host comprometido como puente hacia una red que Kali no alcanza.", purpose: "Cuando ping/nmap desde Kali no ve el target interno. Si ya lo ves, no inventes pivot.", href: "/learn/portfwd" },
  { term: "privilege escalation", aliases: ["privesc", "privilege escalation", "escalada"], def: "Pasar de un usuario de pocos privilegios a uno más alto (root/SYSTEM) en la misma máquina.", purpose: "Después de initial access. Sin shell, no hay privesc.", href: "/learn/privesc-linux-c" },
  { term: "hash", aliases: ["hash", "ntlm", "hashdump"], def: "Huella de una contraseña, no el texto en claro. Crackear es una opción; a veces reutilizar el secreto en lab es otra.", purpose: "Loot que cambia el next step (otro servicio, otro user).", href: "/learn/win-hash-concept" },
  { term: "shell", aliases: ["shell"], def: "Intérprete de comandos en el objetivo (bash, cmd, meterpreter). Evidencia de acceso.", purpose: "Verificar id/whoami/sysinfo. Un módulo en verde sin sesión no es shell.", href: "/learn/msf-flow" },
  { term: "listener", aliases: ["listener", "handler", "multi/handler"], def: "Proceso en Kali que espera la conexión de un reverse payload.", purpose: "Debe coincidir LHOST/LPORT/payload con lo que ejecutó la víctima.", href: "/learn/msf-flow" },
  { term: "LHOST", aliases: ["lhost"], def: "IP de TU máquina atacante en la NIC que la víctima puede alcanzar (vboxnet, no wlan0).", purpose: "Reverse shells y Metasploit. Se mide con ip addr, no se copia de un blog.", href: "/learn/ipv4" },
  { term: "RHOST", aliases: ["rhost", "rhosts"], def: "IP de la víctima (guest). Nunca 127.0.0.1 de Kali.", purpose: "nmap, exploits, módulos. Sin IP en el guest no hay RHOST.", href: "/learn/ipv4" },
  { term: "CIDR", aliases: ["cidr", "/24"], def: "Notación de red: bits de red fijos. /24 ≈ una LAN típica de lab.", purpose: "Alcance de nmap -sn. No escanees /8 'por si acaso'.", href: "/learn/cidr" },
  { term: "nmap", aliases: ["nmap"], def: "Escáner de red: hosts, puertos, servicios, scripts. Cada flag responde una pregunta.", purpose: "Recon activo autorizado. Interpretar el output es la nota, no el ASCII.", href: "/learn/port-scan" },
  { term: "Metasploit", aliases: ["metasploit", "msf", "msfconsole"], def: "Framework para buscar módulos, configurar opciones y obtener sesiones. No es magia.", purpose: "search → show options → LHOST correcto → run → verificar sesión.", href: "/learn/msf-flow" },
  { term: "snapshot", aliases: ["snapshot"], def: "Foto del estado de una VM. Puedes volver atrás si rompes el guest.", purpose: "Antes de brute o exploits agresivos en lab. El examen INE no lo da.", href: "/laboratorio" },
  { term: "Gobuster", aliases: ["gobuster", "dirbuster"], def: "Fuerza bruta de rutas HTTP (directorios/archivos) contra un wordlist.", purpose: "Cuando hay 80/443. No lo uses contra SMB.", href: "/learn/web-dirs" },
  { term: "Hydra", aliases: ["hydra"], def: "Fuerza bruta de logins (SSH, FTP, HTTP forms…) cuando YA tienes un usuario.", purpose: "Last resort. Sin user es ruido y puedes bloquear cuentas.", href: "/learn/enum-ssh" },
];

function aliasHits(text: string, alias: string): boolean {
  const a = alias.toLowerCase();
  if (a.length <= 4) {
    const escaped = a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|[^a-záéíóúüñ0-9])${escaped}(?:[^a-záéíóúüñ0-9]|$)`, "i").test(text);
  }
  return text.toLowerCase().includes(a);
}

export function termsMatching(text: string): AcademyTerm[] {
  return ACADEMY_TERMS.filter((t) => t.aliases.some((a) => aliasHits(text, a)));
}

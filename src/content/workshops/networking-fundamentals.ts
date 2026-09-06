import { TroubleItem, WorkshopSection } from "@/lib/types";

export const NET_IP_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. ¿Qué es una red aquí?",
    titleEn: "What a network is in this lab",
    bodyEs:
      "Una red es un conjunto de interfaces que pueden enviarse paquetes si hay una ruta. En tu lab hay DOS redes relevantes: (1) Internet por wlan0/eth0 — Kali host navega y actualiza. (2) Host-Only 192.168.56.0/24 por vboxnet0 — atacante y víctimas.\n\nIPv4 es la dirección de 32 bits que ves en ip addr (cuatro octetos). No estás estudiando IPv6 ni OSPF: el eJPT te pide interpretar IPs, rangos y puertos de un scan, no diseñar un ISP.",
    diagram: `wlan0/eth0     →  default route  →  Internet (solo el HOST)
vboxnet0       →  192.168.56.0/24 →  MS2 / Kioptrix (sin Internet)`,
  },
  {
    id: "why",
    titleEs: "02. ¿Por qué importa?",
    titleEn: "Why it matters",
    bodyEs:
      "Nmap, ping y Metasploit fallan de formas distintas si la IP está mal, si el /24 no coincide, o si usas la IP de wlan0 como LHOST. LHOST/RHOSTS son IPv4 en UNA subnet de lab.\n\nWHAT: dirección, máscara, red, host, ruta.\nWHY: saber si dos IPs 'se ven' antes de escanear.\nWHEN: cada vez que anotas LHOST y TARGET_*.\nOUTPUT: ip addr + ip route ya lo viste; ahora interpretas el /24.\nNEXT: puertos (TCP/UDP) en el siguiente bloque, luego Nmap.",
  },
  {
    id: "prereq",
    titleEs: "03. Prerrequisitos",
    titleEn: "Prerequisites",
    bodyEs:
      "Lab (vboxnet0 UP, ping a MS2) y Linux mínimo (pwd, SSH). Si no hay ping, vuelve al taller de VirtualBox: esto no se arregla con CIDR.",
  },
  {
    id: "ipv4",
    titleEs: "04. IPv4, privada vs pública",
    titleEn: "IPv4 private vs public",
    bodyEs:
      "Pública: enrutable en Internet (la de tu casa en el WAN del router, no suele ser LHOST).\nPrivada (RFC1918): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Tu lab 192.168.56.0/24 es privada. Nadie 'en Internet' llega a MS2 si Host-Only está bien.\n\n127.0.0.1 = localhost (DVWA en Docker). No es RHOSTS de una VM.\n\nWHAT: un identificador de interfaz en capa 3.\nWHY: eliges LHOST en la NIC que la víctima puede alcanzar (vboxnet0), no en 8.8.8.8 ni en 127.0.0.1.\nWHEN: set LHOST / anotar IPs.\nOUTPUT: cuatro números y un /prefijo.\nNEXT: qué significa el /24.",
  },
  {
    id: "cidr",
    titleEs: "05. Subnet y CIDR",
    titleEn: "Subnet and CIDR",
    bodyEs:
      "La máscara dice cuántos bits son 'red' y cuántos 'host'. /24 = 255.255.255.0 = los primeros 24 bits fijos. En 192.168.56.0/24, 192.168.56 es la red; el último octeto es el host (.1 Kali, .101 MS2).\n\nMisma subnet = mismo prefijo. 192.168.56.1 y 192.168.56.101 se ven (si la ruta existe). 192.168.56.1 y 192.168.1.50 NO son el mismo lab: esa es tu LAN de casa (Bridged/error).\n\nNo hace falta calcular VLSM a mano en el examen típico. Sí: leer 10.10.10.0/24 y no escanear 10.10.11.0 por error.\n\nWHAT: recorte de un rango IPv4.\nWHY: nmap -sn de la red correcta; no /16 entero 'por si acaso' (lento y ruidoso).\nWHEN: host discovery.\nOUTPUT: 'estas IPs pertenecen a este /24'.\nNEXT: gateway y routing.",
    diagram: `192.168.56.0/24
  .0     red (no la pingueas como host útil)
  .1     Kali host LHOST (vboxnet0)
  .101   MS2 RHOSTS (ejemplo)
  .255   broadcast`,
  },
  {
    id: "gw-route",
    titleEs: "06. Gateway, routing, interfaz",
    titleEn: "Gateway and routing",
    bodyEs:
      "Gateway: siguiente salto hacia otra red. En Host-Only a menudo NO hay gateway a Internet para el guest. El .1 es el host Kali, no 'la puerta a Google'.\n\nip route: default via X dev wlan0 = Internet del host. 192.168.56.0/24 dev vboxnet0 = el lab no usa el WiFi.\n\nInterfaz = NIC (vboxnet0, wlan0). Socket vendrá con puertos (bloque siguiente).\n\nWHAT: cómo el kernel decide por qué NIC sale un paquete.\nWHY: ping a 8.8.8.8 no prueba el lab; ping a TARGET_MS2 sí.\nWHEN: 'tengo Internet pero no ping a la VM' o al revés.\nOUTPUT: tabla de rutas.\nNEXT: TCP/UDP y puertos.",
  },
  {
    id: "optional-vlsm",
    titleEs: "07. ADVANCED / OPTIONAL — VLSM, IPv6, OSPF",
    titleEn: "Optional: not eJPT core",
    optional: true,
    bodyEs:
      "No conviertas esto en CCNA. Si un write-up usa /27, entiende 'menos hosts'. IPv6 en eJPT no es el foco. Enrutamiento dinámico no se configura en tu lab Host-Only.",
  },
];

export const NET_PORTS_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. TCP, UDP y puertos",
    titleEn: "TCP, UDP and ports",
    bodyEs:
      "IP lleva el paquete a una máquina. El puerto lleva el paquete a UN servicio en esa máquina. Analogía: IP = edificio, puerto = piso.\n\nTCP: conexión (handshake SYN/SYN-ACK/ACK). SSH, HTTP, SMB suelen ser TCP. Si nmap dice open en TCP, algo aceptó el handshake (o un filtro inteligente; en lab suele ser el servicio).\n\nUDP: sin handshake. DNS (53), SNMP. Más lento y ambiguo de escanear (-sU). Hoy: sabes que existe; no haces UDP scans masivos.\n\nRango: 1–65535. Privilegiados <1024 suelen ser servicios de sistema (22, 80, 443, 445).",
  },
  {
    id: "why",
    titleEs: "02. ¿Por qué importa?",
    titleEn: "Why it matters",
    bodyEs:
      "El pentest empieza (después de 'quién está vivo') por 'qué escucha'. 445 no se enumera igual que 80. Hydra contra SSH no es Gobuster. Si no asocias puerto→servicio, eliges la herramienta al azar: tu hueco declarado.\n\nWHAT: multiplexación L4.\nWHY: mapa de superficie de ataque.\nWHEN: lees un nmap -sV.\nOUTPUT: PORT STATE SERVICE VERSION.\nNEXT: Semana 1 Nmap (cómo obtener esa tabla). Semana 2 enum por servicio.",
  },
  {
    id: "common",
    titleEs: "03. Puertos que sí pesan en eJPT",
    titleEn: "Ports that matter for eJPT",
    bodyEs:
      "21/tcp FTP — archivos; a veces anonymous.\n22/tcp SSH — ya lo usaste. Login, no directory brute.\n23/tcp Telnet — texto plano (raro en Kali moderno; aparece en labs viejos).\n25/tcp SMTP — correo; enum de usuarios a veces.\n53/tcp+udp DNS — nombres; recon. No es SMB.\n80/tcp HTTP — web. Gobuster, curl, no Hydra salvo login form.\n139 y 445/tcp SMB/NetBIOS — enum4linux, smbclient. Tu MS2 los tiene.\n443/tcp HTTPS — HTTP cifrado. El certificado no te da shell; el contenido sí puede (igual que HTTP) pero no sniffas passwords en claro tan fácil.\n3306/tcp MySQL — más tarde si sale en un scan.\n\nWHAT: número → hipótesis de protocolo.\nWHY: eliges la siguiente herramienta.\nWHEN: ves la columna PORT de nmap.\nOUTPUT: una hipótesis ('445 → enum SMB').\nNEXT: confirmar con -sV, no explotar a ciegas.",
    diagram: `IP 192.168.56.101
  :22   sshd      →  SSH / Hydra si hay user
  :80   apache    →  HTTP / Gobuster
  :445  smbd      →  SMB / enum4linux
No mezclar: Gobuster no habla SMB.`,
  },
  {
    id: "states",
    titleEs: "04. open / closed / filtered (idea)",
    titleEn: "Port states (idea)",
    bodyEs:
      "open — hay servicio (o algo que responde como tal).\nclosed — el host responde 'nadie escucha aquí'.\nfiltered — no sabes: firewall, drop, o UDP silencio.\n\nPing ICMP (ping -c) NO es un puerto TCP. Puedes hacer ping y tener 80 filtered. Puedes no hacer ping (ICMP bloqueado) y tener 445 open: por eso Nmap no se reduce a ping.\n\nWHAT: estado L4.\nWHY: no abandones un host solo porque ping falle (en examen a veces).\nWHEN: interpretas nmap.\nOUTPUT: la columna STATE.\nNEXT: Semana 1, flags -sn vs -p- vs -sV.",
  },
  {
    id: "dns-http-arp",
    titleEs: "05. DNS, HTTP, ARP — solo el mínimo",
    titleEn: "DNS, HTTP, ARP — minimum",
    bodyEs:
      "DNS: nombre → IP. En lab Host-Only casi no usas DNS público para MS2; usas la IP. En el examen, un hostname puede ser un hallazgo. whois/DNS pasivo es Semana 1 recon pasivo.\n\nHTTP: texto en 80; HTTPS en 443 (TLS). curl habla HTTP. No es enumeración SMB.\n\nARP: IP → MAC en la LAN local. Host-Only es una LAN: ARP existe. Envenenar ARP (MITM) es Semana 7, no hoy. Hoy: ping usa ARP debajo; si dices 'no hay ARP' y estás en /24 local, revisa la NIC.\n\nWHAT: tres protocolos de distinto piso (nombre, web, LAN).\nWHY: no uses arp spoof para 'arreglar' un ping a MS2.\nWHEN: recon vs MITM vs web.\nOUTPUT: idea, no un lab de bettercap.\nNEXT: Nmap contra TARGET_MS2.",
  },
  {
    id: "optional",
    titleEs: "06. ADVANCED / OPTIONAL — 3-way handshake a fondo, QoS, IPsec",
    titleEn: "Optional",
    optional: true,
    bodyEs:
      "Memorizar cada flag TCP no te aprueba el eJPT. -sS en Nmap aprovecha SYN; con eso basta hasta Semana 1. IPsec/VPN del examen INE es logística, no este taller.",
  },
];

export const NET_TROUBLESHOOTING: TroubleItem[] = [
  {
    id: "wrong-slash",
    symptom: "nmap / ping a un rango que no es el lab",
    cause: "Usaste 192.168.1.0/24 (casa) o 10.0.0.0/8 entero en vez de 192.168.56.0/24.",
    diagnose: "ip addr show vboxnet0 ; ip route | grep 192.168.56",
    command: "ip addr show vboxnet0",
    fix: "Descubrimiento solo en el prefijo de vboxnet0. Anótalo en ~/ejpt-lab.txt.",
    verify: "nmap -sn <tu /24 de lab> muestra Kali .1 y los guests.",
  },
  {
    id: "ping-not-http",
    symptom: "Hay ping pero 'la web no carga'",
    cause: "ICMP ≠ TCP/80. El host está vivo; apache puede estar down o no es el puerto.",
    diagnose: "ping -c 1 <IP> ; luego (cuando sepas nmap) nmap -p80,445 <IP>",
    command: "ping -c 1 192.168.56.101",
    fix: "No confundas L3 (IP) con L4 (puerto). MS2: 80 y 445 suelen existir; confirma con scan.",
    verify: "Entiendes: ping OK no implica servicio HTTP.",
  },
  {
    id: "lhost-wlan",
    symptom: "Reverse shell no vuelve / LHOST 'raro'",
    cause: "LHOST = IP de wlan0 o 127.0.0.1. La víctima en Host-Only no puede enrutar a tu WiFi público.",
    diagnose: "ip -br a | grep vboxnet  vs  ip -br a | grep wlan",
    command: "ip -br a",
    fix: "LHOST = inet de vboxnet0. RHOSTS = guest.",
    verify: "LHOST y TARGET_MS2 mismo /24, IPs distintas.",
  },
  {
    id: "localhost-rhost",
    symptom: "Atacas 127.0.0.1 pensando que es MS2",
    cause: "localhost es Kali (DVWA). MS2 es 192.168.56.x.",
    diagnose: "cat ~/ejpt-lab.txt",
    command: "cat ~/ejpt-lab.txt",
    fix: "DVWA=127.0.0.1:4280. TARGET_MS2=IP vboxnet. No mezclar.",
    verify: "ping a TARGET_MS2 no es ping a 127.0.0.1.",
  },
];

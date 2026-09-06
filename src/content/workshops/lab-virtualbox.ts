import { TroubleItem, WorkshopSection } from "@/lib/types";

/**
 * Workshop Semana 0 — laboratorio. Setup real: Kali = SO del PC (atacante).
 * VirtualBox = solo víctimas. No contradice el lab ya montado.
 */
export const LAB_HOST_DIAGRAM = `                    HOST (tu PC)
                         │
              Kali Linux (bare metal)
              ATTACKER  ·  escribes nmap aquí
              LHOST = IP de vboxnet0
              (típico: 192.168.56.1)
                         │
              Host-Only Network  (vboxnet0)
              192.168.56.0/24  ·  sin Internet
                         │
             ┌───────────┴───────────┐
             │                       │
      Metasploitable 2         Kioptrix 1
      guest / RHOSTS           guest / RHOSTS
      (típico .101)            (otra IP)

  Internet del WiFi/Ethernet real  →  solo el host Kali
  DVWA  →  Docker en Kali  →  http://127.0.0.1:4280`;

export const LAB_KALI_AS_VM_OPTIONAL = `OTRO esquema (NO es el tuyo):
  Windows/macOS host
       ├── Kali VM (atacante)
       └── Victim VM
  Mismo Host-Only entre las dos VMs.
  Tú NO haces esto: ya tienes Kali instalado en el disco.`;

export const LAB_WORKSHOP: WorkshopSection[] = [
  {
    id: "what-building",
    titleEs: "01. ¿Qué estamos construyendo?",
    titleEn: "What are we building?",
    bodyEs:
      "Un laboratorio de pentesting es una red pequeña que TÚ controlas, para atacar máquinas que están hechas para ser atacadas. No es tu WiFi de casa. No es un servidor de un tercero. Hacemos esto porque el eJPT (y cualquier trabajo de Red Team) exige practicar reconocimiento, enumeración y explotación con consecuencias reales de red — sin cometer un delito.\n\nVirtualización: un programa (el hipervisor) finge un ordenador dentro de otro. La máquina virtual (guest) cree que tiene CPU, disco y NIC propias. El host es el SO que ya está en el disco.\n\nVirtualBox es el hipervisor que usas para las VÍCTIMAS. Kali Linux es tu sistema atacante: ya está instalado como SO principal. Metasploitable 2 es un Ubuntu viejo diseñado para romperse (FTP, Samba, etc.).\n\nAtacante = donde TÚ tecleas nmap y msfconsole (Kali host). Víctima = guest que recibe el tráfico (MS2, Kioptrix). Red virtual = un switch ficticio que VirtualBox crea en el host (vboxnet0). Aislamiento = esa red no enruta hacia Internet ni hacia tu LAN doméstica si usas Host-Only bien configurado.",
    diagram: LAB_HOST_DIAGRAM,
    ejptForEs:
      "¿Para qué lo necesitas en eJPT? El examen te da un rango autorizado. El hábito es el mismo: un lab que TÚ controlas, no tu WiFi.",
  },
  {
    id: "why",
    titleEs: "02. ¿Por qué importa?",
    titleEn: "Why it matters",
    bodyEs:
      "Si no entiendes LHOST vs RHOSTS, Metasploit 'funciona en el video' y falla en tu lab: la reverse shell intenta volver a la IP equivocada. Si pones la víctima en Bridged, una máquina deliberadamente vulnerable queda en la misma LAN que tu router, móvil e impresora. Host-Only existe para que el ataque sea local, repetible y legal.\n\nEn el examen eJPT te dan un rango y un objetivo. El hábito es el mismo: ¿cuál es MI IP en esa red (LHOST)? ¿cuál es LA SUYA (RHOSTS)? ¿puedo hacer ping antes de escanear?",
    ejptForEs:
      "¿Para qué lo necesitas en eJPT? LHOST vs RHOSTS aparece en Metasploit y en reverse shells. Si no sabes tu IP de lab, el módulo 'funciona en el video' y falla aquí.",
  },
  {
    id: "prereq",
    titleEs: "03. Prerrequisitos",
    titleEn: "Prerequisites",
    bodyEs:
      "Necesitas: PC arrancando Kali (no una ventana de Kali-VM). VirtualBox instalable en ese Kali. ~2 GB RAM libres para una víctima de 512 MB. Espacio de disco para el .vmdk de Metasploitable 2.\n\nNo necesitas todavía: Nmap de memoria, Metasploit, ni una segunda red de pivoting. Eso viene después. Hoy demuestras que hay una LAN de lab y que sabes nombrar las IPs.",
  },
  {
    id: "nat-bridged-ho",
    titleEs: "04. NAT, Bridged y Host-Only",
    titleEn: "NAT vs Bridged vs Host-Only",
    bodyEs:
      "Una interfaz física es el WiFi/Ethernet real (wlan0, eth0). Una interfaz virtual es la que crea VirtualBox en el host (vboxnet0). La VM tiene su propio adaptador (eth0 DENTRO del guest) enganchado a uno de estos modos.\n\nNAT — VM → Host → Internet. La víctima puede salir (actualizar, filtrar). El host NO ataca fácil a la VM por IP fija: NAT oculta al guest. Útil para que Kali-VM descargue paquetes. INÚTIL y peligroso como único NIC de una víctima: no es tu caso de ataque, y además la VM sale a Internet.\n\nBridged — VM → router físico → LAN. La víctima obtiene una IP como otro PC de casa. Ventaja: parece una máquina real. Riesgo: MS2 es un imán de exploits; no la pongas en la red doméstica.\n\nHost-Only — Host + guests en un switch virtual. Sin camino a Internet para el guest. Ventaja: aislamiento. Riesgo: casi ninguno de exposición; el riesgo es olvidar el NIC y dejar NAT/Bridged también activos.\n\nIP privada: 192.168.56.0/24 no se anuncia en Internet. Subnet /24 = 255.255.255.0, hosts .1–.254. Gateway: en Host-Only a menudo NO hay gateway hacia Internet; el .1 suele ser el host (tú). Routing: ip route muestra por qué interfaz sale cada red. Si 192.168.56.0/24 dev vboxnet0, el tráfico de lab no usa wlan0.",
    diagram: `NAT:      VM ──► Host ──► Internet
Bridged:  VM ──► Router físico ──► LAN (incluye tu casa)
Host-Only:
          Host
           │
           └── vboxnet0 (red virtual)
                 ├── Kali host (LHOST)
                 └── Victim guest (RHOSTS)`,
    ejptForEs:
      "¿Para qué lo necesitas en eJPT? NAT oculta al objetivo; Bridged expone una VM vulnerable en casa; Host-Only replica un rango de lab aislado.",
  },
  {
    id: "vboxnet",
    titleEs: "05. Qué es vboxnet0",
    titleEn: "What vboxnet0 is",
    bodyEs:
      "vboxnet0 es el nombre típico de la NIC Host-Only en el host Kali. No es wlan0. No es tun0 (VPN). No es la IP de la víctima.\n\nWHAT: interfaz virtual del hipervisor en TU Kali.\nWHY: es la dirección a la que una reverse shell debe volver (LHOST) y la red donde viven las VMs.\nWHEN: siempre que VirtualBox Host-Only esté creado; antes de importar la víctima.\nOUTPUT de ip addr: nombre, estado UP/DOWN, inet (IP/máscara).\nNEXT: anotar LHOST y solo entonces importar MS2 (bloque 2).",
  },
  {
    id: "ip-addr",
    titleEs: "06. Cómo leer ip addr e ip route",
    titleEn: "Reading ip addr and ip route",
    bodyEs:
      "Comando: ip addr   (o ip a). Busca el bloque vboxnet0.\n\nInterfaz: el nombre (vboxnet0). Estado: UP = el enlace virtual está activo; DOWN = Host-Only no creado o deshabilitado. inet 192.168.56.1/24 = tu IP y la máscara CIDR. Si no hay inet, la interfaz existe pero no tiene IPv4: revisa el Network Manager de VirtualBox (IPv4 Address / Mask).\n\nComando: ip route. Una línea tipo 192.168.56.0/24 dev vboxnet0 significa: esa red se alcanza por vboxnet0, no por el WiFi. default via … dev wlan0 es Internet del host. Las víctimas NO deben usar esa default para 'salir'.\n\nWHAT: mapa de IPs y rutas del host.\nWHY: sin esto no sabes LHOST ni si estás en la misma subnet que la VM.\nWHEN: cada vez que el lab 'no hace ping'.\nOUTPUT: interfaz, UP/DOWN, IP/CIDR, ruta de 192.168.56.0/24.\nNEXT: ping a la víctima cuando exista; si no existe, bloque 2.",
    ejptForEs:
      "¿Para qué lo necesitas en eJPT? LHOST sale de `ip addr` en vboxnet, no de un tutorial. `ip route` te dice el CIDR real para nmap -sn.",
  },
  {
    id: "install",
    titleEs: "07. Instalación y verificación de VirtualBox",
    titleEn: "Install and verify VirtualBox",
    bodyEs:
      "En Kali host: sudo apt update && sudo apt install -y virtualbox virtualbox-qt\n\nVerifica: virtualbox --help | head -1   y que abra la GUI (VirtualBox Manager).\n\nSi el kernel module falla (vboxdrv): a veces hace falta linux-headers-$(uname -r) y reboot. No sigas importando VMs si la GUI no abre: primero el hipervisor.\n\nEsto se ejecuta SOLO en tu máquina y para VMs que tú posees o descargas de fuentes educativas (Metasploitable, VulnHub).",
  },
  {
    id: "config",
    titleEs: "08. Configuración Host-Only (este bloque)",
    titleEn: "Host-Only setup (this block)",
    bodyEs:
      "1. Confirma Kali host: cat /etc/os-release | head -3 — no estás dentro de una ventana 'Kali VM'.\n2. Instala/abre VirtualBox.\n3. File → Tools → Network Manager (o Archivo → Herramientas → Administrador de red).\n4. Create Host-Only Network. Nombre típico vboxnet0.\n5. IPv4 del adaptador: 192.168.56.1 / 255.255.255.0. DHCP opcional (.100–.254) para que MS2 coja IP sola.\n6. En Kali: ip addr  y  ip route. Identifica vboxnet0 UP e inet.\n7. Escribe LHOST=… en ~/ejpt-lab.txt.\n8. STOP. Importar la víctima es el bloque 2. Hoy no hace falta ping si aún no hay guest.",
  },
  {
    id: "demo",
    titleEs: "09. Demostración (qué 'bien' se ve)",
    titleEn: "What good looks like",
    bodyEs:
      "ip -br a | grep vboxnet  muestra algo como: vboxnet0  UP  192.168.56.1/24\n\nip route | grep 192.168.56  muestra la red por vboxnet0.\n\ncat ~/ejpt-lab.txt  tiene LHOST=192.168.56.1 (o la IP real que te salió; no copies el ejemplo si el DHCP del Host-Only usó otro prefijo).",
  },
  {
    id: "guided",
    titleEs: "10. Práctica guiada vs independiente",
    titleEn: "Guided then unaided",
    bodyEs:
      "Guiada: sigue los pasos de este bloque en Focus (un paso a la vez) con esta pestaña abierta.\n\nIndependiente: cierra el taller. En una terminal vacía: demuestra vboxnet0, explica en voz alta NAT vs Host-Only, escribe LHOST sin mirar. Luego los recall de abajo. Si no puedes explicar Host-Only, no marques el bloque: leer ≠ dominar.",
  },
  {
    id: "optional-vm-kali",
    titleEs: "11. ADVANCED / OPTIONAL — Kali también en VM",
    titleEn: "Optional: Kali as a VM",
    optional: true,
    bodyEs:
      "Si alguien estudia en Windows, Kali suele ser otra VM. Entonces LHOST es la IP Host-Only de la VM Kali, no 192.168.56.1 del host Windows. Tú no uses ese esquema: duplicarías Kali y romperías el hábito de 'atacante = este teclado'.",
    diagram: LAB_KALI_AS_VM_OPTIONAL,
  },
];

export const LAB_TROUBLESHOOTING: TroubleItem[] = [
  {
    id: "no-vboxnet",
    symptom: "No aparece vboxnet0",
    cause: "No existe la red Host-Only, o VirtualBox no está instalado / el módulo vboxnetadp no cargó.",
    diagnose: "ip -br a | grep -E 'vboxnet|192.168.56'  y  lsmod | grep vbox",
    command: "ip -br a",
    fix: "Crea Host-Only en Network Manager. Si no hay vboxnetadp: reinstala virtualbox y reboot.",
    verify: "ip -br a muestra vboxnet0 UP con inet.",
  },
  {
    id: "vboxnet-down",
    symptom: "vboxnet0 existe pero está DOWN o sin IP",
    cause: "Adaptador deshabilitado, IPv4 vacío en VirtualBox, o ip link set vboxnet0 down.",
    diagnose: "ip addr show vboxnet0",
    command: "ip addr show vboxnet0",
    fix: "Network Manager → vboxnet0 → IPv4 192.168.56.1/24. O: sudo ip link set vboxnet0 up",
    verify: "Estado UP e inet 192.168.56.1/24 (o tu prefijo).",
  },
  {
    id: "kali-no-ip",
    symptom: "Kali no obtiene IP en vboxnet0",
    cause: "Confundes wlan0 (Internet) con vboxnet0 (lab). vboxnet0 es estática en el host, no DHCP hacia ti.",
    diagnose: "ip -br a — mira TODAS las filas, no solo la del WiFi.",
    command: "ip -br a",
    fix: "Asigna IPv4 en VirtualBox Host-Only, no esperes dhclient en vboxnet0 del host.",
    verify: "LHOST escrito coincide con inet de vboxnet0.",
  },
  {
    id: "wrong-adapter",
    symptom: "Network adapter incorrecto / Host-Only 'no funciona'",
    cause: "La VM (cuando exista) tiene Adapter 1 = NAT o Bridged, o un Host-Only distinto (vboxnet1).",
    diagnose: "VirtualBox → VM Settings → Network: Attached to + Name. En host: ip -br a.",
    command: "ip -br a",
    fix: "Adapter 1 = Host-Only Adapter, Name = la misma que tiene inet en Kali. Adapter 2 deshabilitado.",
    verify: "Guest y host comparten el prefijo (ej. 192.168.56.0/24).",
  },
  {
    id: "split-nets",
    symptom: "Las máquinas están en redes diferentes",
    cause: "Host 192.168.56.1 y guest 10.0.x.x (NAT) o 192.168.1.x (Bridged/casa).",
    diagnose: "Host: ip addr show vboxnet0. Guest: ip a / ifconfig. Compara los /24.",
    command: "ip addr show vboxnet0",
    fix: "Quita NAT/Bridged del guest. Host-Only only. Si hace falta: sudo ifconfig eth0 192.168.56.101 netmask 255.255.255.0 up (dentro del guest).",
    verify: "Ambos 192.168.56.0/24 (o el prefijo que hayas fijado).",
  },
  {
    id: "no-ping",
    symptom: "Victim no responde a ping",
    cause: "VM apagada, IP mal, firewall raro (poco en MS2), o ping a la IP de Internet/wlan0.",
    diagnose: "¿La VM está Running? ping -c 3 <IP_del_guest> desde Kali. nmap -sn 192.168.56.0/24.",
    command: "ping -c 3 192.168.56.101",
    fix: "Enciende MS2. Confirma IP en el guest. No hagas ping a 8.8.8.8 para 'probar el lab'.",
    verify: "3 replies. Luego nmap -sV -p21,445 a esa IP (bloque 2).",
  },
  {
    id: "vm-wont-start",
    symptom: "VirtualBox no inicia la VM",
    cause: "VT-x deshabilitado, disco .vmdk bloqueado, RAM insuficiente, o Kali-en-Kali anidado.",
    diagnose: "Lee el error de VirtualBox. egrep -c '(vmx|svm)' /proc/cpuinfo  (0 = sin virtualización).",
    command: "egrep -c '(vmx|svm)' /proc/cpuinfo",
    fix: "Habilita virtualización en BIOS. 512 MB RAM al guest. No pongas Kali dentro de VirtualBox encima de Kali.",
    verify: "La ventana del guest llega a login msfadmin.",
  },
];

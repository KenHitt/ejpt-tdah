import { GuidedStep } from "@/lib/types";

const SAFETY =
  "Utiliza estos comandos únicamente contra máquinas propias, laboratorios o sistemas para los que tengas autorización. Este lab es Host-Only: Kali (host) ataca solo a TUS guests de VirtualBox.";

export const LAB_HOSTONLY_GUIDED: GuidedStep[] = [
  {
    id: "safety",
    kind: "concept",
    titleEs: "Regla del laboratorio",
    bodyEs: SAFETY,
  },
  {
    id: "c-vm",
    kind: "concept",
    titleEs: "Qué es una VM",
    bodyEs:
      "Una máquina virtual (guest) es un ordenador fingido: CPU, disco y red que un programa (hipervisor) simula dentro de otro. El archivo .vmdk/.ova es el disco de ese PC falso.",
    ejptForEs:
      "¿Para qué lo necesitas en eJPT? Para atacar Metasploitable/Kioptrix sin tocar tu WiFi ni un servidor ajeno. El examen te da un rango; tú ya habrás practicado el mismo hábito en un guest que TÚ controlas.",
  },
  {
    id: "c-host",
    kind: "concept",
    titleEs: "Qué es el Host",
    bodyEs:
      "Host = el sistema que ya está instalado en el disco de este PC. Aquí el host ES Kali. Es donde abres VirtualBox y donde escribes nmap.",
    ejptForEs:
      "¿Para qué lo necesitas en eJPT? Para no confundir 'dónde corro el scan'. El atacante es este teclado. Si lanzas nmap desde dentro de la víctima, estás enumerándote a ti mismo.",
  },
  {
    id: "c-guest",
    kind: "concept",
    titleEs: "Qué es el Guest",
    bodyEs:
      "Guest = la VM que corre DENTRO de VirtualBox. Tiene su propio login, su propio eth0 y su propia IP. No es una ventana de Kali duplicada.",
    ejptForEs:
      "¿Para qué lo necesitas en eJPT? RHOSTS es la IP del guest. Si pones la IP del host, el exploit apunta a Kali.",
  },
  {
    id: "c-kali",
    kind: "concept",
    titleEs: "Qué es Kali en ESTE laboratorio",
    bodyEs:
      "Kali = SO principal de este PC (bare metal). No clonamos Kali dentro de VirtualBox. VirtualBox solo corre víctimas.",
    ejptForEs:
      "¿Para qué lo necesitas en eJPT? LHOST es la IP de Kali en la red de lab, no una segunda Kali-VM ni wlan0.",
    diagram: `HOST = Kali (atacante, este teclado)
VirtualBox = solo guests (víctimas)`,
  },
  {
    id: "c-victim",
    kind: "concept",
    titleEs: "Qué es una máquina víctima",
    bodyEs:
      "Una víctima de lab es un SO hecho para romperse (Metasploitable 2, Kioptrix). No es tu router, no es el portátil de un compañero, no es un VPS de un tercero.",
    ejptForEs:
      "¿Para qué lo necesitas en eJPT? El examen te asigna objetivos en un rango controlado. El hábito es: solo enumeras y atacas lo que te autorizan.",
  },
  {
    id: "c-roles",
    kind: "concept",
    titleEs: "Atacante vs víctima",
    bodyEs:
      "Atacante = quien inicia el reconocimiento (tú, Kali). Víctima = quien recibe el tráfico (el guest). No son 'buenos y malos': son roles de red. La reverse shell sale de la víctima HACIA el atacante.",
    ejptForEs:
      "¿Para qué lo necesitas en eJPT? LHOST = atacante. RHOST / RHOSTS = víctima. Mezclarlos es el fallo #1 de Metasploit.",
  },
  {
    id: "c-vif",
    kind: "concept",
    titleEs: "Interfaz de red virtual",
    bodyEs:
      "wlan0/eth0 = hardware real (Internet de casa). vboxnet0 = interfaz que VirtualBox crea en el HOST: un switch ficticio. La VM tiene otro adaptador (eth0 DENTRO del guest) enganchado a ese switch.",
    ejptForEs:
      "¿Para qué lo necesitas en eJPT? Debes leer `ip addr` y decir cuál interfaz es lab y cuál es Internet. Si LHOST es wlan0, la víctima Host-Only no sabe volver.",
  },
  {
    id: "c-ho",
    kind: "concept",
    titleEs: "Red Host-Only",
    bodyEs:
      "Host-Only = host + guests en un switch virtual. El guest NO sale a Internet por esa NIC. Tú SÍ ves al guest. Es el diseño de este lab.",
    ejptForEs:
      "¿Para qué lo necesitas en eJPT? Aislamiento: practicas exploits contra un Ubuntu viejo sin ponerlo en la LAN de casa. El examen también te da un rango, no 'toda Internet'.",
  },
  {
    id: "c-nat",
    kind: "concept",
    titleEs: "NAT (qué es y por qué no es tu lab de ataque)",
    bodyEs:
      "NAT: la VM sale a Internet a través del host (como un móvil detrás del router). El host NO ataca fácil al guest por una IP fija y visible. Útil para actualizar una VM; inútil como único NIC de una víctima que quieres escanear.",
    ejptForEs:
      "¿Para qué lo necesitas en eJPT? Si la víctima está solo en NAT, nmap desde Kali host no ve el mismo mapa que en el examen (objetivo alcanzable en el rango).",
  },
  {
    id: "c-bridged",
    kind: "concept",
    titleEs: "Bridged (qué es y por qué no en MS2)",
    bodyEs:
      "Bridged: la VM se comporta como otro PC de tu WiFi. Coge IP del router de casa. MS2 está diseñado para ser explotado: no lo pongas al lado de tu móvil y tu impresora.",
    ejptForEs:
      "¿Para qué lo necesitas en eJPT? El examen no te pide comprometer la LAN doméstica. Host-Only replica 'rango de lab' sin exposición.",
  },
  {
    id: "q-modes",
    kind: "question",
    titleEs: "Comprueba: modos de red",
    bodyEs: "Sin mirar atrás: ¿qué modo usamos para las víctimas y por qué no Bridged?",
    check: {
      id: "q-modes",
      promptEs: "Modo de adaptador para MS2/Kioptrix en este lab, y riesgo de Bridged (una frase).",
      keywordAny: [
        ["host-only"],
        ["host only"],
        ["vboxnet"],
        ["aisl"],
      ],
      explanationEs:
        "Host-Only aísla. Bridged mete una máquina vulnerable en la LAN de casa. NAT oculta al guest y/o le da salida a Internet: no es cómo atacas aquí.",
      failKind: "reasoning",
      subtopicId: "lab-vbox",
      domain: "lab-vbox",
    },
  },
  {
    id: "a-open-vbox",
    kind: "action",
    titleEs: "Acción: abrir VirtualBox",
    bodyEs:
      "En Kali host abre VirtualBox Manager (menú o `virtualbox`). Si no abre: `sudo apt install -y virtualbox virtualbox-qt` y no sigas importando VMs todavía.\n\nEn VirtualBox 7 suele ser: File → Tools → Network Manager (o Archivo → Herramientas → Administrador de red). En versiones viejas: File → Host Network Manager.",
    lookForEs: "Ventana de VirtualBox Manager. Aún no hace falta una VM encendida.",
    commandShow: "virtualbox",
  },
  {
    id: "a-create-ho",
    kind: "action",
    titleEs: "Acción: crear o verificar Host-Only",
    bodyEs:
      "1) En Network / Host Network Manager, mira si ya hay un adaptador Host-Only (nombre típico vboxnet0; puede ser vboxnet1).\n2) Si no hay: Create / Crear.\n3) IPv4 del ADAPTADOR (el host): una dirección privada y máscara. Es común 192.168.56.1 / 255.255.255.0, PERO no la copies si VirtualBox te asignó otro prefijo (192.168.57.x, etc.).\n4) DHCP del servidor Host-Only: opcional. Si lo activas, el guest puede coger IP sola en ese rango.\n5) Anota el NOMBRE del adaptador (vboxnet0 o el que sea).",
    lookForEs: "Un adaptador Host-Only listado, con IPv4 y máscara. Nombre escrito en un papel o ~/ejpt-lab.txt.",
  },
  {
    id: "a-ip-addr",
    kind: "action",
    titleEs: "Acción: ip addr (descubrir, no adivinar)",
    bodyEs:
      "En una terminal de Kali (este PC), ejecuta el comando. NO asumas 192.168.56.1.\n\nBusca un bloque cuyo nombre sea vboxnet0 (o vboxnet1). Anota: nombre, estado UP o DOWN, línea `inet` (IP/máscara).\n\nSi no hay inet: la interfaz existe pero no tiene IPv4 → vuelve a VirtualBox y rellena IPv4 del adaptador Host-Only.\nSi no aparece vboxnet: la red no se creó o el módulo no cargó (caso A).",
    commandShow: "ip addr",
    lookForEs: "Nombre vboxnetX, UP, inet A.B.C.D/máscara. Esa inet es tu Kali en el lab (candidata a LHOST).",
  },
  {
    id: "a-ip-route",
    kind: "action",
    titleEs: "Acción: ip route (qué red es el lab)",
    bodyEs:
      "Ejecuta el comando. Busca una línea cuya `dev` sea tu vboxnetX. El prefijo (ej. 192.168.56.0/24) es la SUBRED del lab.\n\nLa línea `default via … dev wlan0` (o eth0) es Internet del HOST. Las víctimas Host-Only NO deben usar esa ruta para 'salir'.\n\n/24 = 24 bits de red (máscara 255.255.255.0). Los hosts se distinguen en el último octeto.",
    commandShow: "ip route",
    lookForEs: "Red de lab dev vboxnetX. Default = otra interfaz. Anota CIDR (ej. 192.168.56.0/24 o EL QUE TE SALGA).",
  },
  {
    id: "q-kali-ip",
    kind: "question",
    titleEs: "Resultado: IP real de Kali",
    bodyEs: "Escribe la inet que VISTE en vboxnet (no un ejemplo de un blog).",
    check: {
      id: "kali-ip",
      promptEs: "IP de Kali en la interfaz Host-Only (LHOST candidato).",
      promptEn: "Your Kali IPv4 on the host-only adapter.",
      shape: "ipv4-lab",
      explanationEs:
        "Debe ser IPv4 privada (192.168.x, 10.x o 172.16–31.x), no 127.0.0.1 (eso es localhost/DVWA) ni la IP pública. Si no la viste, vuelve a `ip addr`.",
      failKind: "technical",
      subtopicId: "lab-vbox",
      domain: "net-basic",
      critical: true,
    },
  },
  {
    id: "q-same-net",
    kind: "question",
    titleEs: "Networking en TU lab",
    bodyEs:
      "Si Kali es 192.168.X.10/24 y más tarde la víctima es 192.168.X.20/24, están en la misma red. Si una es 192.168.56.x y la otra 10.0.x o 192.168.1.x, NO.",
    check: {
      id: "cidr",
      promptEs: "¿Qué significa /24 en la inet que anotaste?",
      keywordAny: [["24"], ["mascara"], ["bits"], ["255.255.255.0"]],
      explanationEs:
        "/24 = 24 bits de red (255.255.255.0). No son '24 hosts'. El último octeto identifica hosts en esa subnet.",
      failKind: "reasoning",
      subtopicId: "net-basic",
      domain: "net-basic",
      critical: true,
    },
  },
  {
    id: "q-lhost-rhost",
    kind: "question",
    titleEs: "LHOST vs RHOST",
    bodyEs: "Todavía puede no haber víctima. Igual debes nombrar los roles.",
    check: {
      id: "lhost",
      promptEs: "¿Qué es LHOST en este lab? ¿Y RHOST/RHOSTS?",
      keywordAny: [
        ["lhost", "rhost"],
        ["atacante", "victima"],
        ["kali", "victima"],
        ["vboxnet", "guest"],
      ],
      explanationEs:
        "LHOST = IP local del atacante (Kali en vboxnet). RHOST/RHOSTS = IP remota de la víctima (guest). Si están en redes distintas, la reverse no vuelve y el ping no cruza.",
      failKind: "reasoning",
      subtopicId: "msf-lhost-lport",
      domain: "net-basic",
      critical: true,
    },
  },
  {
    id: "trouble-intro",
    kind: "trouble",
    titleEs: "Si algo no funciona",
    bodyEs:
      "No marques el bloque si vboxnet está DOWN o sin inet. Abre el caso que encaje. Luego vuelve a `ip addr` e `ip route`.",
  },
];

export const LAB_TROUBLE_GUIDED: GuidedStep[] = [
  {
    id: "case-a",
    kind: "trouble",
    troubleId: "no-vboxnet",
    titleEs: "Caso A — No aparece Host-Only / vboxnet",
    bodyEs:
      "Causas: VirtualBox no instalado; no creaste la red; módulo vboxnetadp no cargó; miras solo wlan0.\n\nHaz: `ip addr` (¿hay vboxnetX?). `lsmod | grep vbox`. Abre Network Manager y Create Host-Only.\nSi vboxdrv falla: headers del kernel y reboot. No importes MS2 todavía.",
    commandShow: "ip addr",
    lookForEs: "Tras el arreglo: bloque vboxnetX en ip addr.",
  },
  {
    id: "case-b",
    kind: "trouble",
    troubleId: "kali-no-ip",
    titleEs: "Caso B — Kali sin IP en la interfaz virtual",
    bodyEs:
      "`ip addr` — ¿la interfaz existe? ¿UP o DOWN? ¿hay `inet`?\n`ip link` — estado de enlace (UP/DOWN) por interfaz.\n`ip route` — ¿aparece la red de lab?\n\nSin inet: rellena IPv4 en VirtualBox Host-Only (el host no hace DHCP hacia sí mismo en vboxnet).\nDOWN: `sudo ip link set vboxnet0 up` o habilita el adaptador en VirtualBox.\nConfundes wlan0 con vboxnet: wlan0 es Internet; no es LHOST del guest Host-Only.",
    commandShow: "ip addr\nip link\nip route",
  },
  {
    id: "case-c",
    kind: "trouble",
    troubleId: "no-ping",
    titleEs: "Caso C — La víctima no responde a ping (bloque 2)",
    bodyEs:
      "No asumas que está apagada. Comprueba EN ORDEN:\n1) Ventana VirtualBox: ¿Running?\n2) Settings → Network: Adapter 1 = Host-Only, mismo nombre que en Kali.\n3) Misma red: compara prefijo de Kali (`ip addr` / `ip route`) con IP DENTRO del guest (`ifconfig` o `ip a`).\n4) Ping a ESA IP, no a 8.8.8.8 ni a 127.0.0.1.\n5) ICMP: MS2 suele responder ping; si hay firewall raro, `nmap -sn` a la SUBRED igualmente puede listar el host.\n6) Ruta: `ip route` debe mostrar el /24 del lab por vboxnet, no solo default por wlan0.",
    commandShow: "ip addr\nip route\nping -c 3 <IP_que_viste_en_el_guest>",
  },
  {
    id: "case-d",
    kind: "trouble",
    troubleId: "split-nets",
    titleEs: "Caso D — Kali y víctima en redes diferentes",
    bodyEs:
      "Lee `ip addr` (Kali) e `ip route`. Lee IP del guest. Si Kali es 192.168.56.x y el guest es 10.0.x (NAT) o 192.168.1.x (Bridged/casa), no hay L2 común.\n\nQué ocurre: ping falla; LHOST de una reverse en 56.x no es alcanzable desde 10.0.x.\nArreglo: Adapter 1 Host-Only only; quita NAT/Bridged. Si el guest no tiene IP: asigna una en EL MISMO /24 que viste en vboxnet (no copies un blog si tu prefijo es otro).",
    commandShow: "ip addr\nip route",
  },
  {
    id: "case-e",
    kind: "trouble",
    troubleId: "wrong-adapter",
    titleEs: "Caso E — Configuraste NAT o Bridged por error",
    bodyEs:
      "NAT: el guest sale a Internet y a menudo no es un RHOST limpio desde el host. Bridged: MS2 entra en tu LAN doméstica (riesgo inaceptable para una VM intencionalmente vulnerable).\n\nDiseño de este lab: Adapter 1 = Host-Only (mismo nombre que vboxnet en Kali). Adapter 2 deshabilitado. Internet del WiFi queda en el HOST, no en la víctima.",
  },
];

export const LAB_CHECKPOINT_GUIDED: GuidedStep[] = [
  {
    id: "cp-intro",
    kind: "checkpoint",
    titleEs: "CHECKPOINT VirtualBox",
    bodyEs: "No es 'completado'. Responde con TU lab. Si fallas: explicación → repetir → comprobar otra vez.",
  },
  {
    id: "cp1",
    kind: "checkpoint",
    titleEs: "1. IP de Kali",
    bodyEs: "La inet de vboxnet, no un ejemplo.",
    check: {
      id: "cp-kali",
      promptEs: "¿Cuál es la IP de Kali en el lab?",
      shape: "ipv4-lab",
      explanationEs: "IPv4 privada de vboxnet. No 127.0.0.1. Si no la sabes: `ip addr`.",
      failKind: "technical",
      subtopicId: "lab-vbox",
      critical: true,
    },
  },
  {
    id: "cp2",
    kind: "checkpoint",
    titleEs: "2. IP de la víctima",
    bodyEs: "Si aún no importaste MS2, escribe `pendiente` y no marques el bloque 2. Si ya la viste en el guest, escribe ESA IP.",
    check: {
      id: "cp-victim",
      promptEs: "¿Cuál es la IP de la víctima? (o la palabra pendiente)",
      keywordAny: [["pendiente"], ["192.168"], ["10."], ["172."]],
      explanationEs:
        "RHOST es la IP del guest, distinta de Kali. 'pendiente' solo vale en el bloque 1. En el bloque 2 debes descubrirla (ifconfig/ip a en el guest o nmap -sn).",
      failKind: "technical",
      subtopicId: "lab-vbox",
    },
  },
  {
    id: "cp3",
    kind: "checkpoint",
    titleEs: "3. Interfaz",
    bodyEs: "Nombre que viste en ip addr / ip link.",
    check: {
      id: "cp-if",
      promptEs: "¿Cuál es la interfaz utilizada para el lab?",
      shape: "iface",
      explanationEs: "vboxnet0 (o vboxnet1…). No wlan0. No tun0.",
      failKind: "memory",
      subtopicId: "lab-vbox",
      critical: true,
    },
  },
  {
    id: "cp4",
    kind: "checkpoint",
    titleEs: "4. Red / CIDR",
    bodyEs: "La línea de `ip route` cuya dev es vboxnet.",
    check: {
      id: "cp-cidr",
      promptEs: "¿Qué red/CIDR estás utilizando?",
      shape: "cidr",
      explanationEs: "Ejemplo de forma: 192.168.56.0/24 — el TUYO puede ser otro /24. /24 = bits de red.",
      failKind: "reasoning",
      subtopicId: "net-basic",
      critical: true,
    },
  },
  {
    id: "cp5",
    kind: "checkpoint",
    titleEs: "5. ¿Por qué Host-Only?",
    bodyEs: "",
    check: {
      id: "cp-why",
      promptEs: "¿Por qué Host-Only (no NAT/Bridged) en este lab?",
      keywordAny: [["aisl"], ["sin internet"], ["no expon"], ["local"], ["host-only"]],
      explanationEs: "Aislar atacante y víctima. Bridged expone MS2 en casa. NAT no es el mapa de ataque del host.",
      failKind: "reasoning",
      subtopicId: "lab-vbox",
    },
  },
  {
    id: "cp6",
    kind: "checkpoint",
    titleEs: "6. LHOST vs RHOST",
    bodyEs: "",
    check: {
      id: "cp-lr",
      promptEs: "¿Qué diferencia hay entre LHOST y RHOST/RHOSTS?",
      keywordAny: [
        ["local", "remot"],
        ["atacante", "victima"],
        ["kali", "guest"],
        ["lhost", "rhost"],
      ],
      explanationEs: "LHOST = tú (Kali/vboxnet). RHOSTS = objetivo (guest). Si están en subnets distintas, el lab está roto.",
      failKind: "reasoning",
      subtopicId: "msf-lhost-lport",
      critical: true,
    },
  },
  {
    id: "cp7",
    kind: "checkpoint",
    titleEs: "7. Conectividad",
    bodyEs: "",
    check: {
      id: "cp-ping",
      promptEs: "¿Cómo comprobarías conectividad hacia la víctima?",
      keywordAny: [["ping"], ["nmap -sn"], ["nmap -sn"]],
      explanationEs: "ping -c a SU IP. Si no conoces la IP: nmap -sn a TU /24 de vboxnet (ip route). No 8.8.8.8.",
      failKind: "memory",
      subtopicId: "lab-vbox",
    },
  },
  {
    id: "cp8",
    kind: "checkpoint",
    titleEs: "8. Descubrir la víctima",
    bodyEs: "",
    check: {
      id: "cp-discover",
      promptEs: "¿Cómo descubrirías la víctima si no conocieras su IP?",
      keywordAny: [
        ["nmap", "-sn"],
        ["nmap", "sn"],
        ["host discovery"],
      ],
      explanationEs: "nmap -sn <SUBRED de ip route>. Luego contrastas con .1 (tú) vs otros hosts UP. No inventes .101 de un tutorial.",
      failKind: "reasoning",
      subtopicId: "nmap-basic",
      critical: true,
    },
  },
];

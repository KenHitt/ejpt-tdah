import { GuidedStep } from "@/lib/types";
import { LAB_CHECKPOINT_GUIDED, LAB_TROUBLE_GUIDED } from "@/content/guided/lab-hostonly";

const SAFETY =
  "Utiliza estos comandos únicamente contra máquinas propias, laboratorios o sistemas para los que tengas autorización.";

export const LAB_MS2_GUIDED: GuidedStep[] = [
  {
    id: "ms2-safety",
    kind: "concept",
    titleEs: "Alcance",
    bodyEs:
      SAFETY +
      "\n\nHoy importas Metasploitable 2 (guest). No explotas. Descubres SU IP; no copies 192.168.56.101 de un blog si tu Host-Only usa otro prefijo.",
  },
  {
    id: "ms2-dl",
    kind: "action",
    titleEs: "Descargar / importar",
    bodyEs:
      "Descarga Metasploitable 2 (SourceForge, paquete oficial educativo). Descomprime hasta el .vmdk.\nVirtualBox → New → Type Linux / Ubuntu (64-bit) → Use an existing virtual hard disk → ese .vmdk.\nRAM 512 MB, 1 CPU. Aún no arranques.",
    lookForEs: "La VM aparece en el Manager, apagada.",
  },
  {
    id: "ms2-nic",
    kind: "action",
    titleEs: "Adaptador: Host-Only",
    bodyEs:
      "Settings → Network → Adapter 1: Enable. Attached to: Host-Only Adapter. Name = el mismo que viste en Kali (`ip addr`, vboxnetX).\nAdapter 2: deshabilitado. Nada de NAT ni Bridged como NIC de ataque (caso E).",
    lookForEs: "Adapter 1 Host-Only, nombre coincidente.",
  },
  {
    id: "ms2-boot",
    kind: "action",
    titleEs: "Arrancar e identificar IP en el GUEST",
    bodyEs:
      "Start. Login consola: msfadmin / msfadmin.\nDentro del GUEST: `ifconfig` o `ip a`. Anota inet de eth0. Esa es RHOST — la que salga, no un ejemplo.\nSi no hay inet: el adaptador está mal o no hay DHCP; asigna una IP en EL MISMO /24 que Kali (`ip route` en el host).",
    lookForEs: "Una IPv4 en el guest, mismo prefijo que Kali, distinta de la inet de vboxnet.",
  },
  {
    id: "ms2-ping",
    kind: "action",
    titleEs: "Desde Kali: ping a LA IP que viste",
    bodyEs:
      "Vuelve a la terminal del HOST. Sustituye por tu RHOST. Si no hay reply, Caso C (no asumas apagada).",
    commandShow: "ping -c 3 <IP_VICTIMA>",
    lookForEs: "Respuestas ICMP. Si falla: VM Running, mismo adaptador, misma /24, ruta vboxnet.",
  },
  {
    id: "ms2-sn",
    kind: "action",
    titleEs: "Descubrimiento de la SUBRED (no un /24 inventado)",
    bodyEs:
      "Coge el CIDR de `ip route` (dev vboxnet). Sustituye. Debes ver al menos: tu Kali y el guest. No escanees 192.168.1.0/24 'por si acaso'.",
    commandShow: "nmap -sn <SUBRED>",
    lookForEs: "Host is up para Kali y para la víctima. Anota TARGET_MS2= la IP del guest.",
  },
  {
    id: "ms2-sv",
    kind: "action",
    titleEs: "Versiones — interpretar, no memorizar el dump",
    bodyEs:
      "Sustituye por tu RHOST. Cuando termine, NO copies un write-up. Mira columnas PORT STATE SERVICE VERSION. El siguiente bloque de Nmap profundiza flags; hoy demuestras conectividad y que hay servicios.",
    commandShow: "nmap -sV <IP_VICTIMA>",
    lookForEs: "Puertos open. Versiones si -sV terminó. Distintas de 'host up' de ping.",
  },
  {
    id: "ms2-interpret",
    kind: "decision",
    titleEs: "¿Qué observas? (sin spoiler de exploits)",
    bodyEs: "Usa TU output. Si aún no tienes scan, este ejemplo es de un MS2 típico — prioriza el tuyo.",
    check: {
      id: "ms2-obs",
      promptEs: "¿Qué observas en un scan con 21, 22, 80, 139, 445 abiertos? (servicios, no CVE)",
      keywordAny: [
        ["ftp"],
        ["ssh"],
        ["http"],
        ["smb"],
        ["varios"],
        ["puertos"],
      ],
      explanationEs:
        "Varios servicios distintos. No es 'explotar ya'. Ping no sustituye esta lista. 445 no es Gobuster. 80 no es enum4linux.",
      failKind: "reasoning",
      subtopicId: "nmap-basic",
      domain: "nmap-basic",
    },
  },
  {
    id: "ms2-netq",
    kind: "question",
    titleEs: "¿Misma red?",
    bodyEs: "Compara LHOST y RHOST que anotaste.",
    check: {
      id: "same-net",
      promptEs: "¿Están Kali y la víctima en la misma subnet? ¿Cuál sería LHOST y RHOST?",
      keywordAny: [
        ["misma", "lhost"],
        ["si", "lhost"],
        ["vboxnet"],
        ["rhost"],
      ],
      explanationEs:
        "Misma /24 (mismo prefijo). LHOST = Kali vboxnet. RHOST = guest. Si no, Caso D: no avances a Metasploit.",
      failKind: "reasoning",
      subtopicId: "net-basic",
      domain: "net-basic",
      critical: true,
    },
  },
  ...LAB_TROUBLE_GUIDED.filter((s) => ["case-c", "case-d", "case-e"].includes(s.id)),
  ...LAB_CHECKPOINT_GUIDED.filter((s) => s.id !== "cp2").concat([
    {
      id: "cp2-ms2",
      kind: "checkpoint",
      titleEs: "2. IP de la víctima (obligatoria)",
      bodyEs: "La que descubriste. No un ejemplo.",
      check: {
        id: "cp-victim-real",
        promptEs: "¿Cuál es la IP de la víctima?",
        shape: "ipv4-lab",
        explanationEs: "IPv4 privada distinta de 127.0.0.1. Debe ser la de TU guest.",
        failKind: "technical",
        subtopicId: "lab-vbox",
        critical: true,
      },
    },
  ]),
];

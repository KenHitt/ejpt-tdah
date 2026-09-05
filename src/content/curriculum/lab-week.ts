import { StudyWeek } from "@/lib/types";

/**
 * Semana 0 — Lab. Kali = SO principal del PC. VirtualBox = SOLO las víctimas.
 */
export const labWeek: StudyWeek = {
  id: "m0-w0",
  monthId: "m0",
  title: "Semana 0 — Lab: Kali (host) + víctimas en VirtualBox",
  goal: "Ping desde TU Kali (instalado en el disco) hacia Metasploitable 2 (VM). Sin poner Kali dentro de VirtualBox.",
  detailed: true,
  blocks: [
    {
      id: "m0-w0-b1",
      weekId: "m0-w0",
      order: 1,
      title: "Red Host-Only: el host Kali ve la VM",
      titleEn: "Host-only network: Kali host reaches the guest VM",
      objective: "Ver vboxnet0 en Kali, anotar tu IP (suele ser 192.168.56.1) y dejar lista la red para la víctima del bloque 2.",
      objectiveEn: "Identify vboxnet0 on the Kali host and write down LHOST (often 192.168.56.1).",
      durationMin: 45,
      type: "practice",
      theoryEs:
        "Tú NO usas Kali dentro de VirtualBox. Arrancas el PC en Kali. VirtualBox corre encima, solo para las máquinas vulnerables. El adaptador Host-Only crea una LAN falsa: tu Kali (host) y la VM (guest) se ven; la VM no sale a Internet. NAT en la VM sería para que ella baje paquetes — no lo uses en víctimas. Kali ya tiene Internet por tu WiFi/Ethernet real.",
      theoryEn:
        "Attacker = Kali installed as the primary OS (bare metal). Targets = VirtualBox guests only. Host-Only = isolated lab LAN. Your LHOST is the host IP on vboxnet0, not tun0, not a THM VPN.",
      examPhrases: [
        "attacker machine / local host (LHOST)",
        "target host / remote host (RHOSTS)",
        "host-only adapter",
        "do not expose the lab to the Internet",
      ],
      practiceSteps: [
        "Confirma: estás en Kali instalado (no una ventana de Kali-VM). Comando: cat /etc/os-release | head -3",
        "Abre VirtualBox en Kali. File → Tools → Network Manager (o Archivo → Herramientas → Administrador de red).",
        "Create a Host-Only Network. Nombre típico: vboxnet0. IPv4 típico del host: 192.168.56.1 / 255.255.255.0. DHCP puede estar ON (192.168.56.100–254).",
        "En la TERMINAL DE KALI (host): ip -br a | grep -E 'vboxnet|192.168.56'",
        "Anota en ~/ejpt-lab.txt una línea: LHOST=192.168.56.1 (o la IP que salga). Esa es la IP que pondrás en set LHOST más adelante.",
        "STOP. Aún no hace falta ping a una víctima si no la importaste. Cierre de este bloque: vboxnet0 existe y LHOST escrito. La VM es el bloque 2.",
      ],
      subtopics: ["lab-vbox"],
      drills: [
        {
          id: "d1",
          promptEs: "Comando para listar interfaces (vas a buscar vboxnet0).",
          promptEn: "Command to list interfaces (you are looking for vboxnet0).",
          answer: "ip a",
        },
        {
          id: "d2",
          promptEs: "Host discovery Nmap en la red Host-Only típica.",
          promptEn: "Nmap host discovery on the typical Host-Only range.",
          answer: "nmap -sn 192.168.56.0/24",
        },
        {
          id: "d3",
          promptEs: "Ping de 3 paquetes a 192.168.56.101 (IP típica de la VM).",
          promptEn: "Send 3 ICMP echo requests to 192.168.56.101.",
          answer: "ping -c 3 192.168.56.101",
        },
      ],
      glossary: [
        { en: "bare metal / host OS", es: "Kali instalado en el disco, no en una VM" },
        { en: "guest VM", es: "máquina virtual víctima" },
        { en: "host-only adapter (vboxnet0)", es: "LAN de laboratorio en el host" },
        { en: "LHOST", es: "IP de TU Kali en esa LAN (atacante)" },
      ],
      comparisonTable: {
        caption: "Quién es quién (tu setup real)",
        headers: ["Máquina", "Dónde corre", "Internet", "Rol"],
        rows: [
          ["Kali Linux", "SO principal del PC (NO en VirtualBox)", "Sí (WiFi/Ethernet del portátil)", "Attacker / LHOST"],
          ["Metasploitable 2", "Guest en VirtualBox", "NO (solo Host-Only)", "Target / RHOSTS"],
          ["Kioptrix 1", "Guest en VirtualBox", "NO (solo Host-Only)", "Second target"],
          ["DVWA", "Docker en Kali host", "localhost:4280", "Web target"],
        ],
      },
      resources: [
        { label: "VirtualBox Manual — Host-Only Networking", url: "https://www.virtualbox.org/manual/ch06.html#network_hostonly", platform: "Docs" },
      ],
      closingChecklist: [
        "Kali es el SO del PC, no una VM",
        "Existe vboxnet0 (o equivalente) y escribí LHOST en ~/ejpt-lab.txt",
        "Sé que las víctimas van en VirtualBox, no Kali",
      ],
    },
    {
      id: "m0-w0-b2",
      weekId: "m0-w0",
      order: 2,
      title: "Importar Metasploitable 2 (guest)",
      titleEn: "Import Metasploitable 2 as a VirtualBox guest",
      objective: "La VM arranca, tiene IP en 192.168.56.0/24, y desde Kali host: nmap -sV -p21,445 muestra vsftpd y samba.",
      objectiveEn: "From the Kali host, nmap -sV -p21,445 against MS2 must show vsftpd and samba.",
      durationMin: 50,
      type: "practice",
      theoryEs:
        "Metasploitable 2 es un Ubuntu viejo hecho para romperlo: vsftpd 2.3.4 (backdoor), Samba, DistCC. Login de consola: msfadmin / msfadmin. Adapter 1 = Host-Only. Quita NAT. Si no, la VM sale a Internet y es un riesgo.",
      theoryEn:
        "Metasploitable 2 is an intentionally vulnerable Linux VM. Console login msfadmin/msfadmin. Nic 1 = Host-Only only. You will use it for scanning, SMB enum, and the vsftpd 2.3.4 exploit.",
      examPhrases: ["service version detection (-sV)", "open ports 21/tcp 445/tcp", "intentionally vulnerable"],
      practiceSteps: [
        "Download: https://sourceforge.net/projects/metasploitable/files/Metasploitable2/ — unzip the .vmdk",
        "VirtualBox → New → Type: Linux, Version: Ubuntu (64-bit) → Use an existing virtual hard disk file → Metasploitable.vmdk",
        "Settings → Network → Adapter 1: Enable, Attached to: Host-Only Adapter, Name: vboxnet0. Adapter 2: disabled.",
        "Settings → System: 1 CPU, 512 MB RAM. Start the VM. Login: msfadmin / msfadmin",
        "Inside the GUEST: ifconfig  (or ip a). Expect something like 192.168.56.101. If empty: sudo ifconfig eth0 192.168.56.101 netmask 255.255.255.0 up",
        "Back on KALI HOST terminal: ping -c 3 192.168.56.101   then   nmap -sV -p21,22,80,445 192.168.56.101 -oA ~/ms2_baseline",
        "Pass: you see vsftpd on 21 and microsoft-ds or netbios-ssn/samba on 445. Write TARGET_MS2=... in ~/ejpt-lab.txt",
      ],
      subtopics: ["lab-vbox", "nmap-basic"],
      drills: [
        {
          id: "d1",
          promptEs: "Credenciales de consola MS2 (user/pass).",
          promptEn: "Metasploitable 2 console credentials (user/pass).",
          answer: "msfadmin/msfadmin",
        },
        {
          id: "d2",
          promptEs: "nmap versiones en 21,22,80,445 contra 192.168.56.101",
          promptEn: "Version scan ports 21,22,80,445 on 192.168.56.101",
          answer: "nmap -sV -p21,22,80,445 192.168.56.101",
        },
      ],
      glossary: [
        { en: "guest", es: "VM víctima" },
        { en: "baseline scan", es: "primer nmap guardado" },
      ],
      resources: [
        { label: "Metasploitable 2 download (SourceForge)", url: "https://sourceforge.net/projects/metasploitable/files/Metasploitable2/", platform: "Local" },
        { label: "Rapid7 Metasploitable 2 exploitability guide", url: "https://docs.rapid7.com/metasploit/metasploitable-2-exploitability-guide/", platform: "Docs" },
      ],
      closingChecklist: [
        "Adapter 1 = Host-Only, NAT off",
        "ping -c 3 desde Kali host funciona",
        "nmap -sV muestra vsftpd y samba; -oA ~/ms2_baseline existe",
      ],
    },
    {
      id: "m0-w0-b3",
      weekId: "m0-w0",
      order: 3,
      title: "DVWA en Docker (en el Kali host)",
      titleEn: "Run DVWA in Docker on the Kali host",
      objective: "http://127.0.0.1:4280 abre DVWA; login admin/password; security = low.",
      objectiveEn: "Browse http://127.0.0.1:4280, login admin/password, set DVWA security to low.",
      durationMin: 45,
      type: "practice",
      theoryEs:
        "DVWA corre en TU Kali (Docker), no en VirtualBox. Puerto 4280 en localhost. Mes 2 (SQLi/XSS/LFI) usa esta URL. Si docker no existe: sudo apt update && sudo apt install -y docker.io && sudo usermod -aG docker $USER y CIERRA SESIÓN (logout) y vuelve a entrar.",
      theoryEn:
        "DVWA is a local web target for SQL injection, XSS, and file inclusion. Security level low = no filters. This is not a VM.",
      examPhrases: ["SQL injection", "cross-site scripting (XSS)", "local file inclusion (LFI)", "security level: low"],
      practiceSteps: [
        "On Kali host: docker --version",
        "If missing: sudo apt update && sudo apt install -y docker.io && sudo systemctl enable --now docker && sudo usermod -aG docker $USER — then log out and log in",
        "docker run --rm -d --name dvwa -p 4280:80 vulnerables/web-dvwa",
        "Firefox: http://127.0.0.1:4280 — username admin password password — Create / Reset Database if asked",
        "DVWA Security → low → Submit. You must see the left menu: Brute Force, SQL Injection, XSS, File Inclusion",
        "Add to ~/ejpt-lab.txt: DVWA=http://127.0.0.1:4280",
      ],
      subtopics: ["lab-vbox", "web-sqli"],
      drills: [
        {
          id: "d1",
          promptEs: "Comando docker para DVWA en el puerto 4280.",
          promptEn: "Docker command to bind DVWA on host port 4280.",
          answer: "docker run --rm -d --name dvwa -p 4280:80 vulnerables/web-dvwa",
        },
      ],
      glossary: [
        { en: "bind port 4280:80", es: "puerto del host 4280 → 80 del contenedor" },
        { en: "security level low", es: "sin filtros; para practicar el payload crudo" },
      ],
      resources: [
        { label: "DVWA GitHub", url: "https://github.com/digininja/DVWA", platform: "Kali" },
      ],
      extraResources: [
        { label: "Fallback: Metasploitable 2 already serves web apps on TCP/80", url: "https://docs.rapid7.com/metasploit/metasploitable-2-exploitability-guide/", platform: "Local" },
      ],
      closingChecklist: [
        "http://127.0.0.1:4280 carga",
        "admin/password y security low",
      ],
    },
    {
      id: "m0-w0-b4",
      weekId: "m0-w0",
      order: 4,
      title: "Kioptrix Level 1 (segunda guest)",
      titleEn: "Kioptrix Level 1 — second guest VM",
      objective: "Segunda IP en 192.168.56.0/24 distinta a MS2; nmap -sC -sV -p- guardado. No explotar hoy.",
      objectiveEn: "Find a second host on the lab LAN and save nmap -sC -sV -p- . Do not exploit yet.",
      durationMin: 50,
      type: "practice",
      theoryEs:
        "Kioptrix 1 = Samba/Apache antiguos. Sustituye a HTB Lame. Import OVA o disco VMware. Misma receta: Adapter 1 Host-Only, NAT off.",
      theoryEn:
        "Second Linux target for enumeration practice. Today you only scan. Exploitation is week 4.",
      examPhrases: ["default NSE scripts (-sC)", "full port scan (-p-)", "do not skip version detection"],
      practiceSteps: [
        "Download: https://www.vulnhub.com/entry/kioptrix-level-1-1,22/",
        "VirtualBox → Import (OVA) or New + existing disk. Network: Host-Only vboxnet0 only.",
        "Start VM. On Kali host: nmap -sn 192.168.56.0/24 — you must see TWO guest IPs (MS2 + Kioptrix), plus .1 (you).",
        "nmap -sC -sV -p- <IP_KIOPTRIX> -oA ~/kioptrix1",
        "Write TARGET_K1=... in ~/ejpt-lab.txt. Stop. No Metasploit today.",
      ],
      subtopics: ["lab-vbox", "nmap-scripts"],
      drills: [
        {
          id: "d1",
          promptEs: "Host discovery en 192.168.56.0/24",
          promptEn: "Host discovery on 192.168.56.0/24",
          answer: "nmap -sn 192.168.56.0/24",
        },
      ],
      glossary: [{ en: "OVA", es: "VM empaquetada para importar" }],
      resources: [
        { label: "VulnHub — Kioptrix Level 1", url: "https://www.vulnhub.com/entry/kioptrix-level-1-1,22/", platform: "VulnHub" },
      ],
      closingChecklist: [
        "Dos IPs de guests distintas en nmap -sn",
        "Archivo ~/kioptrix1.nmap (o .gnmap/.xml por -oA) existe",
      ],
    },
    {
      id: "m0-w0-b5",
      weekId: "m0-w0",
      order: 5,
      title: "Cierre de lab: 4 líneas en un archivo",
      titleEn: "Lab freeze: four lines in one file",
      objective: "Tener ~/ejpt-lab.txt con LHOST, TARGET_MS2, TARGET_K1, DVWA y no tocar más descargas hoy.",
      objectiveEn: "Freeze lab IPs in ~/ejpt-lab.txt. No more VM downloads today.",
      durationMin: 25,
      type: "checkpoint",
      theoryEs:
        "TDAH: si sigues bajando VMs, no empiezas Nmap. Mínimo = MS2 + Kioptrix + DVWA. Kali ya está. Nada de Windows pirata.",
      theoryEn:
        "Scope lock. Extra VMs are optional after week 4, not now.",
      examPhrases: ["document your findings", "target IP address"],
      comparisonTable: {
        caption: "Download list (locked)",
        headers: ["Asset", "Runs where", "URL / command"],
        rows: [
          ["Kali", "Bare metal (you already have it)", "—"],
          ["Metasploitable 2", "VirtualBox guest", "sourceforge.net/projects/metasploitable"],
          ["Kioptrix 1", "VirtualBox guest", "vulnhub.com kioptrix-level-1"],
          ["DVWA", "Docker on Kali host", "docker run ... -p 4280:80"],
        ],
      },
      practiceSteps: [
        "nano ~/ejpt-lab.txt and keep EXACTLY this shape:",
        "LHOST=192.168.56.1",
        "TARGET_MS2=192.168.56.101",
        "TARGET_K1=192.168.56.102",
        "DVWA=http://127.0.0.1:4280",
        "cat ~/ejpt-lab.txt — if a line is missing, go back to that block. Then mark this block done.",
      ],
      subtopics: ["lab-vbox"],
      resources: [
        { label: "Metasploitable 2", url: "https://sourceforge.net/projects/metasploitable/files/Metasploitable2/", platform: "Local" },
        { label: "VulnHub Kioptrix 1", url: "https://www.vulnhub.com/entry/kioptrix-level-1-1,22/", platform: "VulnHub" },
      ],
      closingChecklist: [
        "~/ejpt-lab.txt tiene 4 líneas",
        "No voy a descargar más VMs hasta terminar Semana 1",
      ],
    },
  ],
};

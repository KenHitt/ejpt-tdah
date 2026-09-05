export interface LabDownload {
  id: string;
  name: string;
  required: boolean;
  ram: string;
  url: string;
  usedIn: string;
  notesEs: string;
}

/** Lista corta: qué bajar. No llena el disco con 30 VMs. */
export const LAB_DOWNLOADS: LabDownload[] = [
  {
    id: "ms2",
    name: "Metasploitable 2",
    required: true,
    ram: "512 MB",
    url: "https://sourceforge.net/projects/metasploitable/files/Metasploitable2/",
    usedIn: "Semanas 1–4",
    notesEs: "Guest en VirtualBox (Kali es el host). Login msfadmin/msfadmin. Adapter Host-Only only. Never NAT.",
  },
  {
    id: "dvwa",
    name: "DVWA (Docker)",
    required: true,
    ram: "~200 MB",
    url: "https://github.com/digininja/DVWA",
    usedIn: "Semanas 5–6",
    notesEs: "Corre en Docker EN Kali (el SO del PC), no en VirtualBox. admin/password, security low.",
  },
  {
    id: "kioptrix1",
    name: "Kioptrix Level 1",
    required: true,
    ram: "512 MB",
    url: "https://www.vulnhub.com/entry/kioptrix-level-1-1,22/",
    usedIn: "Semanas 2 y 4",
    notesEs: "Segunda guest en VirtualBox. Host-Only. Sustituye HTB Lame / THM Kenobi.",
  },
  {
    id: "juice",
    name: "OWASP Juice Shop (Docker, extra)",
    required: false,
    ram: "~300 MB",
    url: "https://owasp.org/www-project-juice-shop/",
    usedIn: "Semana 5 extra",
    notesEs: "docker run --rm -d -p 3000:3000 bkimminich/juice-shop",
  },
  {
    id: "ms3",
    name: "Metasploitable 3 (opcional)",
    required: false,
    ram: "2–4 GB",
    url: "https://github.com/rapid7/metasploitable3",
    usedIn: "Semanas 3–4 Windows-like",
    notesEs: "Hay que construirla (Packer). Solo si te sobra RAM. No descargues Windows pirata.",
  },
];

import { TroubleItem, WorkshopSection } from "@/lib/types";

/** m1-w2-b4 — credenciales. No es Gobuster ni enum4linux. */
export const HYDRA_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. ¿Qué es Hydra?",
    titleEn: "What Hydra is",
    bodyEs:
      "Hydra prueba usuario+password contra un LOGIN (SSH, FTP, a veces HTTP form). No busca /admin. No lista shares SMB.\n\nPrerrequisito: un usuario (-l o -L). Sin user, no es el primer comando del puerto 22.\n\nSolo TU lab (TARGET_MS2 Host-Only). No tu router, no internet ajeno.",
    diagram: `Tienes USER + servicio login → Hydra
80 open sin ruta            → Gobuster primero
445 users/shares            → enum4linux
21 anonymous                → ftp, no Hydra primero`,
  },
  {
    id: "why",
    titleEs: "02. ¿Por qué importa?",
    titleEn: "Why it matters",
    bodyEs:
      "El examen pide la sintaxis (-l/-L -p/-P servicio://IP). Tu hueco es USARLA cuando toca.\n\nWHAT: diccionario de passwords (y a veces users) contra un daemon de login.\nWHY: msfadmin/msfadmin en MS2 ya lo sabes por Linux mínimo; hoy fijas FLAGS, no 'crackear Internet'.\nWHEN: user conocido (enum SMB, brief, lab) y el login no es anonymous.\nOUTPUT: login:pass o '0 valid passwords'.\nNEXT: ssh user@IP o ftp con ESA pareja. No Metasploit porque Hydra acertó.",
  },
  {
    id: "flags",
    titleEs: "03. Flags: -l -L -p -P -t",
    titleEn: "Flags",
    bodyEs:
      "-l USER  un usuario. -L archivo  lista de usuarios.\n-p PASS  una password. -P archivo  lista de passwords.\nMinúscula = uno. Mayúscula = lista.\n\nServicio: ssh://IP  ftp://IP  (el :// importa).\n-t 4  hilos. WHY: MS2 se cuelga con 64 threads. WHEN: lab inestable.\n-V  verbose al depurar sintaxis; no lo dejes en un run largo.\n\nLab de 50 min: -P ~/short-pass.txt (≤20 líneas), NO rockyou entero (millones de líneas).\nEl drill de examen puede pedir la ruta de rockyou: es SINTAXIS, no tu hábito de hoy.",
  },
  {
    id: "lab",
    titleEs: "04. Cómo hacerlo en TU MS2",
    titleEn: "How in your lab",
    bodyEs:
      "1) User: msfadmin (ya lo usaste) o uno de enum4linux -U.\n2) printf 'msfadmin\\npassword\\nadmin\\n' > ~/short-pass.txt  y añade hasta ~20 líneas si quieres.\n3) hydra -l msfadmin -P ~/short-pass.txt -t 4 ssh://<TARGET_MS2>\n4) Si sale el hit, ssh msfadmin@IP — ya sabías entrar; el punto es el comando.\n\nFTP: si anonymous funciona, Hydra es redundante. Si no, -l user -P corta ftp://IP.\n\nWHAT: prueba acotada.\nWHY: rockyou contra sshd tira el reloj y el guest.\nWHEN: este bloque.\nOUTPUT: una línea [ssh] host … login: …\nNEXT: tool-selection (cuándo NO Hydra).",
  },
  {
    id: "optional",
    titleEs: "05. ADVANCED / OPTIONAL — HTTP form, RDP",
    titleEn: "Optional",
    optional: true,
    bodyEs:
      "http-post-form pide la ruta y los nombres de campos del formulario (eso sale de Gobuster + leer el HTML). No memorices un PoC genérico hoy. RDP/rdp:// tampoco es el camino mínimo eJPT de este bloque.",
  },
];

export const HYDRA_TROUBLESHOOTING: TroubleItem[] = [
  {
    id: "no-user",
    symptom: "Hydra SSH/FTP sin -l/-L o con -l root a ciegas + rockyou",
    cause: "No hay usuario; brute no es enum.",
    diagnose: "¿De dónde salió el username? SMB -U, brief, o msfadmin de lab.",
    command: "enum4linux -U <TARGET_MS2>",
    fix: "-l user conocido. Lista ≤20. No rockyou entero hoy.",
    verify: "El comando tiene -l o -L y un -P corto.",
  },
  {
    id: "gobuster-mix",
    symptom: "Hydra contra http://IP/ (dirs) o gobuster contra ssh://",
    cause: "Rutas vs credenciales.",
    diagnose: "¿Buscas un path o un password?",
    command: "hydra -l msfadmin -P ~/short-pass.txt -t 4 ssh://<TARGET_MS2>",
    fix: "Path → Gobuster. Password de login → Hydra.",
    verify: "ssh:// o ftp://, no una wordlist de directorios.",
  },
  {
    id: "rockyou-full",
    symptom: "El bloque no acaba / MS2 lento / sshd refuse",
    cause: "rockyou.txt completo o -t alto.",
    diagnose: "wc -l /usr/share/wordlists/rockyou.txt  (millones)",
    command: "head -20 /usr/share/wordlists/rockyou.txt > ~/short-pass.txt",
    fix: "-P ~/short-pass.txt -t 4. Ctrl+C el run eterno.",
    verify: "El wordlist del lab tiene decenas de líneas, no millones.",
  },
  {
    id: "wrong-proto",
    symptom: "syntax error / protocolo no encontrado",
    cause: "ssh:IP sin //, o http-get cuando era ssh.",
    diagnose: "Relee: servicio://host",
    command: "hydra -l msfadmin -P ~/short-pass.txt ssh://<TARGET_MS2>",
    fix: "ssh://IP o ftp://IP. Espacio antes del servicio.",
    verify: "El comando se parece al drill, con tu IP de lab.",
  },
];

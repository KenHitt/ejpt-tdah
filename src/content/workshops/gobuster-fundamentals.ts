import { TroubleItem, WorkshopSection } from "@/lib/types";

/** m1-w2-b3 — HTTP/HTTPS. No es Hydra ni enum4linux. */
export const GOBUSTER_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. ¿Qué es Gobuster?",
    titleEn: "What Gobuster is",
    bodyEs:
      "Gobuster prueba RUTAS (y a veces archivos) contra un servidor HTTP/HTTPS. Es fuerza bruta de nombres en la URL, no de passwords.\n\nModo dir: -u URL -w wordlist. Eso es el 90% del eJPT.\nModo dns: -d dominio — otro problema (nombres DNS). No lo uses contra internet ajeno; drill de sintaxis o tu lab.\n\nNmap te dijo 80/tcp open. curl/http-title te dijo que hay web. Hoy: qué hay DETRÁS de /.",
    diagram: `80/443  HTTP   →  gobuster dir
445     SMB    →  enum4linux  (NO gobuster)
21/22   login  →  ftp/ssh/hydra  (NO gobuster)
Formulario /login ya visto →  Hydra http-form, no más dirs`,
  },
  {
    id: "why",
    titleEs: "02. ¿Por qué importa?",
    titleEn: "Why it matters",
    bodyEs:
      "Tu hueco: mezclar Gobuster con Hydra. /admin, /backup, dav, phpmyadmin cambian el box. Un 200 en /uploads no es una shell.\n\nWHAT: diccionario contra el árbol web.\nWHY: el examen y MS2/DVWA esconden rutas.\nWHEN: 80 o 443 open, Host-Only o DVWA en 127.0.0.1:4280 — TU lab.\nOUTPUT: Status + Size + ruta.\nNEXT: curl o el navegador a ESA ruta. Si ves un form de login, Hydra (otro bloque). Si ves SMB, te equivocaste de puerto.",
  },
  {
    id: "flags",
    titleEs: "03. Flags: dir, -u, -w, -x",
    titleEn: "Flags",
    bodyEs:
      "dir WHAT: modo directorios. WHY: no olvides la palabra dir (sin ella Gobuster no sabe el modo).\n-u WHAT: base URL (http://IP o http://IP:4280). WHY: sin esquema (http://) falla. WHEN: MS2 = http://TARGET_MS2 ; DVWA = http://127.0.0.1:4280 (no es MS2).\n-w WHAT: wordlist. Kali: /usr/share/wordlists/dirb/common.txt. WHY: sin -w no hay diccionario.\n-x php,txt,html WHAT: prueba esas extensiones (archivos, no solo carpetas). WHY: backup.php no sale solo con dir. WHEN: buscas ficheros.\n\n-t threads: baja si el apache del guest se cae. No es el foco.\n\nOUTPUT: líneas Status: 200 / 301 / 403.\nNEXT: anota 3 rutas; no relances rockyou de dirs (common.txt basta hoy).",
  },
  {
    id: "codes",
    titleEs: "04. Cómo leer 200 / 301 / 403",
    titleEn: "Status codes",
    bodyEs:
      "200: el recurso existe y se sirve (mira el size; a veces es una página vacía o custom 404 disfrazado).\n301/302: redirección (a menudo hay carpeta: /admin → /admin/).\n403: existe, no te dejan listar/entrar — sigue siendo hallazgo.\n404: no está (Gobuster suele ocultarlos).\n\nWHAT: código HTTP, no un exploit.\nWHY: 403 ≠ 'no existe'. 200 ≠ 'ya exploté'.\nWHEN: termina el run.\nOUTPUT: 3 rutas en ~/ejpt-lab.txt.\nNEXT: curl -i http://IP/ruta . No Metasploit porque viste /phpmyadmin.",
  },
  {
    id: "optional",
    titleEs: "05. ADVANCED / OPTIONAL — vhost, ffuf, SecLists grandes",
    titleEn: "Optional",
    optional: true,
    bodyEs:
      "gobuster vhost y wordlists enormes de SecLists no son el camino mínimo. ffuf es otra herramienta: mismo concepto. dns contra dominios que no son tuyos: no.",
  },
];

export const GOBUSTER_TROUBLESHOOTING: TroubleItem[] = [
  {
    id: "gobuster-445",
    symptom: "gobuster dir -u http://IP:445 o contra SMB",
    cause: "445 no es HTTP. Gobuster habla web.",
    diagnose: "nmap: 80/tcp http vs 445/tcp microsoft-ds",
    command: "gobuster dir -u http://<TARGET_MS2> -w /usr/share/wordlists/dirb/common.txt",
    fix: "80/443 → Gobuster. 445 → enum4linux.",
    verify: "La URL es http:// no el puerto 445.",
  },
  {
    id: "no-scheme",
    symptom: "error de URL / connection refused en gobuster",
    cause: "Falta http://, puerto mal, o apuntas a 127.0.0.1 pensando que es MS2 (o al revés: DVWA sí es localhost:4280).",
    diagnose: "cat ~/ejpt-lab.txt ; curl -I http://<TARGET_MS2>/",
    command: "curl -I http://<TARGET_MS2>/",
    fix: "MS2: http://IP_guest . DVWA: http://127.0.0.1:4280 . Primero curl -I; luego Gobuster.",
    verify: "curl responde algo HTTP antes de brute de rutas.",
  },
  {
    id: "wordlist-missing",
    symptom: "wordlist not found",
    cause: "Ruta -w inventada o paquete wordlists no instalado.",
    diagnose: "ls /usr/share/wordlists/dirb/common.txt",
    command: "ls /usr/share/wordlists/dirb/common.txt",
    fix: "Usa esa ruta. Si no existe: sudo apt install wordlists  (en TU Kali).",
    verify: "El fichero common.txt existe y Gobuster arranca.",
  },
  {
    id: "hydra-first",
    symptom: "Hydra contra el 80 sin saber la ruta del login",
    cause: "Credenciales antes de rutas.",
    diagnose: "¿Tienes una URL de formulario o solo 80 open?",
    command: "gobuster dir -u http://<TARGET_MS2> -w /usr/share/wordlists/dirb/common.txt",
    fix: "Primero dirs. Hydra cuando hay /login (o similar) y un usuario.",
    verify: "Una ruta anotada antes de cualquier -P rockyou.",
  },
];

import { TroubleItem, WorkshopSection } from "@/lib/types";

export const LINUX_FS_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. ¿Qué es Linux aquí?",
    titleEn: "What Linux means in this trainer",
    bodyEs:
      "No estás estudiando para ser administrador de sistemas. Estás estudiando para sobrevivir en una shell de Kali y, más tarde, en una shell de víctima.\n\nLinux es el SO del atacante (tu Kali host) y el de Metasploitable/Kioptrix. Casi todo el eJPT se teclea en una terminal: listar archivos, leer configs, redirigir salida, copiar con SSH, interpretar un 'Permission denied'.\n\nSi no sabes dónde estás en el disco, un Nmap perfecto no te sirve: no sabrás guardar el scan ni leer /etc/passwd en la víctima.",
  },
  {
    id: "why",
    titleEs: "02. ¿Por qué importa?",
    titleEn: "Why it matters",
    bodyEs:
      "En el examen te pedirán outputs (hashes, versiones, flags, usuarios). Eso vive en archivos. Los servicios (SSH, FTP, HTTP) son procesos con un usuario. Un 13 de nmap no explica por qué no puedes leer un fichero: eso es permisos.\n\nWHAT: el sistema de archivos, quién eres (uid), qué puedes leer/escribir/ejecutar.\nWHY: enumeración y post-explotación son 'leer el disco con criterio'.\nWHEN: siempre que abras una terminal, antes de Metasploit.\nOUTPUT: rutas, permisos, dueños, texto de archivos.\nNEXT: Nmap (Semana 1) asume que ya guardas resultados con -oA y lees un .nmap con less.",
  },
  {
    id: "prereq",
    titleEs: "03. Prerrequisitos",
    titleEn: "Prerequisites",
    bodyEs:
      "Lab bloque 1–2 hecho: Kali host, vboxnet0, MS2 con ping. No hace falta Nmap de memoria todavía.\n\nEste taller se hace en TU Kali. El SSH al guest es el bloque siguiente. No ataques redes que no sean tu lab.",
  },
  {
    id: "fs",
    titleEs: "04. Filesystem — dónde vive qué",
    titleEn: "Filesystem",
    bodyEs:
      "/ es la raíz. Todo cuelga de ahí. No hay C:.\n\n/home — usuarios normales (en Kali suele ser /home/kali o tu user).\n/etc — configuración (passwd, ssh, hosts).\n/var — logs y datos variables (/var/log).\n/tmp — temporal; a menudo escribible por todos (lo usarás en privesc más adelante).\n/proc — kernel y procesos (no es un disco real).\n/usr/share — wordlists y herramientas Kali (/usr/share/wordlists).\n\nComandos: pwd (dónde estoy), ls -la (listar con hidden y permisos), cd, cat, less, file.\n\nWHAT: árbol de directorios.\nWHY: saber dónde buscar configs y wordlists.\nWHEN: cada vez que 'no encuentro rockyou.txt'.\nOUTPUT: ls -la muestra tipo, permisos, dueño, tamaño, nombre.\nNEXT: interpretar esos permisos.",
    diagram: `/
├── etc/          configs (passwd, ssh)
├── home/         tu usuario
├── tmp/          temporal
├── var/log/      logs
├── usr/share/wordlists/
└── proc/         procesos (virtual)`,
  },
  {
    id: "users",
    titleEs: "05. Usuarios — whoami, id, passwd",
    titleEn: "Users",
    bodyEs:
      "whoami — tu nombre de login.\nid — uid, gid, grupos (sudo, etc.).\ncat /etc/passwd — lista de cuentas. Campos: usuario:x:uid:gid:gecos:home:shell. Las que tienen /bin/bash o /bin/sh pueden iniciar sesión.\n\nroot = uid 0. En la víctima, llegar a root es el final del juego, no el principio.\n\nWHAT: identidad del proceso actual y cuentas del sistema.\nWHY: enumeración (usuarios = Hydra/SSH más tarde) y post-ex (¿soy www-data o msfadmin?).\nWHEN: nada más obtener una shell.\nOUTPUT: un uid y un home.\nNEXT: permisos de archivos de ese usuario.",
  },
  {
    id: "perms",
    titleEs: "06. Permisos — rwx, chmod, sudo",
    titleEn: "Permissions",
    bodyEs:
      "ls -l muestra algo como -rwxr-xr-x. Tres tríos: dueño, grupo, otros. r=4 w=2 x=1. chmod 755 = rwxr-xr-x.\n\nPermission denied = el kernel te ha dicho no. No es que el archivo no exista (eso es No such file). Distinguir los dos es diagnóstico.\n\nsudo -l — qué puedes correr como root (privesc Linux, Semana 8). Hoy solo: si sudo -l pide tu password y lista comandos, entiendes el concepto.\n\nSUID (bit extra, a menudo -rwsr-xr-x): el binario corre con el uid del dueño, no el tuyo. find / -perm -4000 es Semana 8. Hoy: sabes que existe, no lo cazas en todo el disco.\n\nWHAT: control de acceso a archivos.\nWHY: sin esto no interpretas un fallo de cat /etc/shadow.\nWHEN: cada Permission denied.\nOUTPUT: letras rwx o un número octal.\nNEXT: redirecciones para guardar lo que SÍ puedes leer.",
    diagram: `-rwxr-x---  user  staff  exploit.sh
 dueño rwx | grupo r-x | otros ---
sudo: pedir permiso de root para UN comando, no 'ser root ya'.`,
  },
  {
    id: "pipes",
    titleEs: "07. Pipes y redirecciones",
    titleEn: "Pipes and redirects",
    bodyEs:
      "| envía la salida de un comando a la entrada de otro: ip -br a | grep vboxnet\n>  escribe un archivo nuevo (borra lo anterior): nmap ... -oN scan.txt equivalente mental: guardar output.\n>> añade al final.\n2> redirige errores. 2>&1 junta stderr y stdout.\n\nEn pentest: grep, awk y cut sobre un scan. No memorices awk hoy. Sí: | grep y > archivo.\n\nWHAT: conectar comandos y persistir output.\nWHY: el examen y tu lab exigen evidencia en fichero, no en la memoria de la terminal.\nWHEN: cualquier comando largo.\nOUTPUT: un fichero o una línea filtrada.\nNEXT: procesos y SSH (siguiente bloque).",
    diagram: `comando A  |  comando B     # pipe
comando    >  out.txt      # overwrite
comando    >> out.txt      # append
comando    2> err.txt      # stderr only`,
  },
  {
    id: "guided",
    titleEs: "08. Práctica guiada vs independiente",
    titleEn: "Guided then unaided",
    bodyEs:
      "Guiada: Focus de este bloque, un comando a la vez, en Kali host.\n\nIndependiente: cierra el taller. Demuestra pwd, ls -la /etc/passwd, id, y guarda whoami > ~/ejpt-who.txt. Si no puedes explicar Permission denied vs No such file, no marques el bloque.",
  },
  {
    id: "optional-suid",
    titleEs: "09. ADVANCED / OPTIONAL — SUID / LinPEAS",
    titleEn: "Optional: SUID",
    optional: true,
    bodyEs:
      "No es contenido de hoy. Semana 8 cubre find -perm -4000 y LinPEAS. Si lo corres ahora, te distraes del lab. Márcalo mentalmente: 'cuando tenga shell, enumeraré SUID'.",
  },
];

export const LINUX_SHELL_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. Procesos, servicios y SSH",
    titleEn: "Processes, services, SSH",
    bodyEs:
      "Un proceso es un programa en ejecución (nmap, sshd, apache). Un servicio suele ser un proceso que escucha un puerto (sshd en 22). SSH es cómo entras a una máquina Linux por la red, con usuario y password o clave.\n\nHoy: ver tus procesos en Kali, entender que MS2 tiene sshd, y entrar como msfadmin SOLO a tu guest Host-Only.",
  },
  {
    id: "why",
    titleEs: "02. ¿Por qué importa?",
    titleEn: "Why it matters",
    bodyEs:
      "Enumeración SSH (Semana 2) y Hydra asumen que sabes qué es un login SSH. Post-ex: 'tengo shell' a veces ES un ssh user@RHOSTS. Si no distingues tu teclado (Kali) del guest, vas a nmapear localhost y no entender nada.\n\nWHAT: procesos + acceso remoto autenticado.\nWHY: el puerto 22 abierto no es una shell; es una puerta con llave.\nWHEN: 22/tcp open en nmap.\nOUTPUT: una sesión interactiva o Permission denied / Connection refused.\nNEXT: enumerar SSH sin brute force inútil (banner, usuarios). Hydra viene después.",
  },
  {
    id: "ps",
    titleEs: "03. Procesos — ps, jobs",
    titleEn: "Processes",
    bodyEs:
      "ps aux | grep nmap — ¿sigue corriendo el scan?\nCtrl+C mata el proceso en primer plano. Ctrl+Z lo pausa; bg lo manda al fondo.\n\nNo necesitas systemd a fondo. systemctl status ssh en Kali te muestra si el servicio local está up. En MS2 a veces es un init viejo: no te bloquees. El objetivo es: un proceso = PID + usuario + comando.\n\nWHAT: lista de programas corriendo.\nWHY: saber si nmap/hydra sigue vivo y con qué usuario corre apache en la víctima (más adelante).\nWHEN: la terminal 'no responde' o quieres matar un brute force.\nOUTPUT: PID y línea de comando.\nNEXT: SSH al lab.",
  },
  {
    id: "ssh",
    titleEs: "04. SSH cliente — how you log in",
    titleEn: "SSH client",
    bodyEs:
      "ssh msfadmin@<TARGET_MS2>  — te pide el password msfadmin. Esto es autenticación, no explotación.\n\nssh -v  aumenta verbosidad si 'no conecta'.\nscp archivo msfadmin@IP:~/  copia un fichero.\n\nClaves (~/.ssh/id_rsa): el examen y el lab a menudo usan password. No generes claves para 'hacerlo bonito' hoy.\n\nHost key warning (fingerprint): la primera vez SSH pregunta yes/no. En lab, yes. Si la VM se reinstala, el fingerprint cambia: ssh-keygen -R <IP>.\n\nWHAT: shell remota cifrada.\nWHY: administración y, a veces, acceso inicial si las credenciales son débiles.\nWHEN: 22 abierto Y tienes (o bruteforceas) un user/pass.\nOUTPUT: prompt del guest (msfadmin@metasploitable).\nNEXT: whoami e id DENTRO del guest; luego exit para volver a Kali.",
    diagram: `Kali host (tú)  --ssh:22-->  MS2 guest
                 user/pass msfadmin
Connection refused = sshd down o IP mala
Permission denied  = user/pass mal
Timeout            = red (Host-Only / ping)`,
  },
  {
    id: "grep-find",
    titleEs: "05. grep y find (mínimo)",
    titleEn: "grep and find",
    bodyEs:
      "grep -i texto archivo  o  comando | grep texto\nfind /home -name '*.txt'  (en Kali; en víctima como no-root puede llover Permission denied: es normal, redirige 2>/dev/null más adelante).\n\nWHAT: buscar texto y archivos por nombre.\nWHY: wordlists, configs, 'dónde está el flag'.\nWHEN: después de tener lectura en disco.\nOUTPUT: rutas o líneas que coinciden.\nNEXT: Semana 1 Nmap. No te quedes coleccionando one-liners.",
  },
  {
    id: "errors",
    titleEs: "06. Errores comunes",
    titleEn: "Common errors",
    bodyEs:
      "ssh root@MS2 — root a menudo no tiene login SSH. Usa msfadmin.\nssh a 192.168.1.x — esa no es tu lab si vboxnet es 192.168.56.0/24.\nPegar el password en el user (ssh msfadmin/msfadmin@IP) — el user es solo msfadmin.\nQuedarte dentro del guest y correr nmap ahí — nmap se corre desde Kali host, salvo que estés pivotando (Semana 7).",
  },
];

export const LINUX_TROUBLESHOOTING: TroubleItem[] = [
  {
    id: "no-such",
    symptom: "No such file or directory",
    cause: "Ruta mal escrita o no estás donde crees (pwd).",
    diagnose: "pwd ; ls -la ; ls -la /ruta/padre",
    command: "pwd",
    fix: "Corrige la ruta. En Kali las wordlists están bajo /usr/share/wordlists.",
    verify: "ls muestra el archivo.",
  },
  {
    id: "denied",
    symptom: "Permission denied (archivo)",
    cause: "Tu uid no tiene r/x en ese path (ej. /etc/shadow como user normal).",
    diagnose: "ls -l archivo ; id",
    command: "ls -l /etc/shadow",
    fix: "No 'forces' chmod en la víctima como primer reflejo. En Kali, sudo solo si es tu host y lo entiendes. En MS2, shadow es de root: es esperado.",
    verify: "Entiendes POR QUÉ está denied, no que lo hayas borrado.",
  },
  {
    id: "ssh-refused",
    symptom: "SSH: Connection refused",
    cause: "Nada escucha en 22, o IP equivocada.",
    diagnose: "Desde Kali: ping -c 1 <IP> ; nmap -p22 <IP>  (si ya viste nmap; si no: ¿la VM está Running?)",
    command: "ping -c 1 192.168.56.101",
    fix: "Enciende MS2. Adapter Host-Only. No ssh a wlan0.",
    verify: "ssh msfadmin@<IP> pide password (no refused).",
  },
  {
    id: "ssh-denied",
    symptom: "SSH: Permission denied",
    cause: "Usuario o password mal. O root login deshabilitado.",
    diagnose: "Usuario = msfadmin (no root). Password = msfadmin. Sin espacios.",
    command: "ssh msfadmin@192.168.56.101",
    fix: "Teclea el password a ciegas (no se ve). Si falló 3 veces, estás en la IP correcta?",
    verify: "Prompt del guest. whoami → msfadmin. exit vuelve a Kali.",
  },
  {
    id: "which-host",
    symptom: "Corrí el comando 'en el sitio equivocado'",
    cause: "El prompt no se lee: no sabes si estás en Kali o en MS2.",
    diagnose: "hostname ; ip -br a ; cat /etc/os-release | head -1",
    command: "hostname",
    fix: "exit hasta volver a tu Kali. LHOST se anota en el HOST.",
    verify: "os-release dice Kali y vboxnet0 existe.",
  },
];

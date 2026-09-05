import { StudyWeek } from "@/lib/types";

/**
 * MES 1 / SEMANA 2 — Enumeración de servicios (aquí viven tus 2 huecos declarados:
 * confusión Gobuster/Hydra/enum4linux, y se prepara la base para Metasploit en semana 3).
 * Semana global: 2
 */
export const month1Week2: StudyWeek = {
  id: "m1-w2",
  monthId: "m1",
  title: "Semana 2 — Enumeración: SMB, Web, Fuerza bruta",
  goal: "Cerrar el hueco de confusión Gobuster/Hydra/enum4linux: saber EXACTAMENTE cuándo usar cada herramienta, no solo cómo se usa.",
  detailed: true,
  blocks: [
    {
      id: "m1-w2-b1",
      weekId: "m1-w2",
      order: 1,
      title: "Enumeración SMB con enum4linux",
      objective: "Extraer usuarios, shares y política de contraseñas de un servicio SMB usando enum4linux con las flags correctas.",
      durationMin: 45,
      type: "practice",
      theoryEs:
        "SMB (puerto 445/139) es uno de los servicios más preguntados en eJPT porque revela usuarios, shares compartidos y a veces credenciales. enum4linux automatiza consultas RPC/SMB que manualmente tomarían varios comandos. La flag -a corre TODAS las enumeraciones (la más usada en examen cuando el tiempo apremia).",
      practiceSteps: [
        "Enumeración completa (todo de una vez): enum4linux -a <IP>",
        "Solo usuarios: enum4linux -U <IP>",
        "Solo shares: enum4linux -S <IP>",
        "Solo política de contraseñas: enum4linux -P <IP>",
        "Anota: nombre del dominio/workgroup, usuarios encontrados, shares con acceso 'anonymous'",
      ],
      subtopics: ["enum4linux"],
      drills: [
        { id: "d1", promptEs: "Escribe el comando para hacer una enumeración COMPLETA de SMB contra 10.10.10.50 con enum4linux.", answer: "enum4linux -a 10.10.10.50" },
        { id: "d2", promptEs: "Escribe el comando para listar SOLO los usuarios vía enum4linux contra 10.10.10.50.", answer: "enum4linux -U 10.10.10.50" },
        { id: "d3", promptEs: "Escribe el comando para listar SOLO los shares vía enum4linux contra 10.10.10.50.", answer: "enum4linux -S 10.10.10.50" },
      ],
      glossary: [
        { en: "share", es: "recurso compartido" },
        { en: "null session", es: "sesión nula (sin autenticación)" },
        { en: "password policy", es: "política de contraseñas" },
        { en: "workgroup", es: "grupo de trabajo" },
      ],
      resources: [
        { label: "Target local — Metasploitable 2 (puerto 445)", url: "https://sourceforge.net/projects/metasploitable/files/Metasploitable2/", platform: "Local" },
        { label: "TryHackMe — Kenobi (opcional)", url: "https://tryhackme.com/room/kenobi", platform: "TryHackMe" },
      ],
      closingChecklist: [
        "Escribo enum4linux -a de memoria",
        "Sé qué información trae -U, -S y -P sin adivinar",
        "Identifiqué al menos un share con acceso anónimo en el lab",
      ],
    },
    {
      id: "m1-w2-b2",
      weekId: "m1-w2",
      order: 2,
      title: "Enumeración manual SMB (smbclient / smbmap)",
      objective: "Conectarse manualmente a un share SMB y listar/descargar archivos usando smbclient y smbmap, sin depender solo de enum4linux.",
      durationMin: 45,
      type: "practice",
      theoryEs:
        "enum4linux es rápido pero no deja 'entrar' a los shares. smbclient te da una shell tipo FTP dentro del share (get/put archivos). smbmap muestra permisos (read/write) de cada share de un vistazo, algo que enum4linux no siempre deja claro.",
      practiceSteps: [
        "Lista los shares disponibles: smbclient -L <IP> -N",
        "Conéctate a un share específico sin credenciales: smbclient //<IP>/<share> -N",
        "Dentro de smbclient: ls, luego get <archivo> para descargarlo",
        "Verifica permisos de todos los shares de una vez: smbmap -H <IP>",
      ],
      subtopics: ["smb-manual"],
      drills: [
        { id: "d1", promptEs: "Escribe el comando para listar los shares de 10.10.10.50 SIN usar credenciales (sesión nula).", answer: "smbclient -L 10.10.10.50 -N" },
        { id: "d2", promptEs: "Escribe el comando para conectarte al share llamado 'anonymous' de 10.10.10.50 sin credenciales.", answer: "smbclient //10.10.10.50/anonymous -N" },
        { id: "d3", promptEs: "Escribe el comando smbmap para ver los permisos de todos los shares de 10.10.10.50.", answer: "smbmap -H 10.10.10.50" },
      ],
      glossary: [
        { en: "null authentication", es: "autenticación nula" },
        { en: "read/write permissions", es: "permisos de lectura/escritura" },
      ],
      resources: [
        { label: "TryHackMe — Kenobi", url: "https://tryhackme.com/room/kenobi", platform: "TryHackMe" },
      ],
      closingChecklist: [
        "Me conecté a un share y descargué un archivo con smbclient",
        "Interpreté correctamente la salida de smbmap (qué share es READ/WRITE)",
      ],
    },
    {
      id: "m1-w2-b3",
      weekId: "m1-w2",
      order: 3,
      title: "Enumeración web con Gobuster",
      objective: "Descubrir directorios y archivos ocultos de un sitio web usando Gobuster con la wordlist y extensiones correctas.",
      durationMin: 50,
      type: "practice",
      theoryEs:
        "Gobuster hace fuerza bruta de RUTAS/ARCHIVOS en un servidor web (no de contraseñas). Sirve para encontrar paneles de admin, backups, archivos de configuración expuestos. Necesita una wordlist (SecLists es el estándar de facto) y a veces extensiones (-x php,txt) para encontrar archivos, no solo carpetas.",
      practiceSteps: [
        "Ubica la wordlist estándar: ls /usr/share/wordlists/dirb/ y /usr/share/seclists/Discovery/Web-Content/",
        "Corre un escaneo de directorios básico: gobuster dir -u http://<IP> -w /usr/share/wordlists/dirb/common.txt",
        "Repite buscando también archivos .php y .txt: gobuster dir -u http://<IP> -w /usr/share/wordlists/dirb/common.txt -x php,txt",
        "Enumera subdominios (modo distinto): gobuster dns -d <dominio> -w /usr/share/wordlists/dirb/common.txt",
        "Anota qué rutas devolvieron código 200 vs 403 vs 301",
      ],
      subtopics: ["gobuster-dir"],
      drills: [
        { id: "d1", promptEs: "Escribe el comando Gobuster (modo dir) para buscar directorios en http://10.10.10.60 usando /usr/share/wordlists/dirb/common.txt.", answer: "gobuster dir -u http://10.10.10.60 -w /usr/share/wordlists/dirb/common.txt" },
        { id: "d2", promptEs: "Escribe el mismo comando pero buscando también archivos con extensión .php y .html.", answer: "gobuster dir -u http://10.10.10.60 -w /usr/share/wordlists/dirb/common.txt -x php,html" },
        { id: "d3", promptEs: "Escribe el comando Gobuster para enumerar subdominios del dominio 'lab.local' con la misma wordlist.", answer: "gobuster dns -d lab.local -w /usr/share/wordlists/dirb/common.txt" },
      ],
      glossary: [
        { en: "directory brute-forcing", es: "fuerza bruta de directorios" },
        { en: "wordlist", es: "lista de palabras" },
        { en: "HTTP status code", es: "código de estado HTTP" },
      ],
      resources: [
        { label: "TryHackMe — Vulnversity (incluye Gobuster + reverse shell)", url: "https://tryhackme.com/room/vulnversity", platform: "TryHackMe" },
      ],
      closingChecklist: [
        "Escribo gobuster dir con -w de memoria",
        "Sé agregar -x para buscar archivos por extensión sin buscarlo en Google",
        "Interpreto códigos 200/301/403 en los resultados",
      ],
    },
    {
      id: "m1-w2-b4",
      weekId: "m1-w2",
      order: 4,
      title: "Fuerza bruta de credenciales con Hydra",
      objective: "Ejecutar un ataque de fuerza bruta contra un servicio de login (SSH o FTP) con Hydra usando la sintaxis correcta de usuario/lista y servicio.",
      durationMin: 50,
      type: "practice",
      theoryEs:
        "Hydra hace fuerza bruta de CREDENCIALES (usuario+contraseña) contra un servicio con login: SSH, FTP, HTTP form, RDP, etc. No busca rutas ni archivos (eso es Gobuster). La sintaxis clave: -l (un usuario) o -L (lista de usuarios), -p (una contraseña) o -P (lista de contraseñas), luego el target y el protocolo/servicio.",
      practiceSteps: [
        "Fuerza bruta SSH con un usuario conocido y una wordlist de passwords: hydra -l <usuario> -P /usr/share/wordlists/rockyou.txt ssh://<IP>",
        "Fuerza bruta FTP con lista de usuarios Y lista de passwords: hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ftp://<IP>",
        "Agrega -t 4 para limitar threads si el servicio se cae con muchos intentos",
        "Agrega -V para ver cada intento en pantalla (verbose) mientras depuras la sintaxis",
      ],
      subtopics: ["hydra-bruteforce"],
      drills: [
        { id: "d1", promptEs: "Escribe el comando Hydra para probar el usuario 'admin' contra una lista de passwords /usr/share/wordlists/rockyou.txt sobre SSH en 10.10.10.70.", answer: "hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://10.10.10.70" },
        { id: "d2", promptEs: "Escribe el comando Hydra para probar una LISTA de usuarios (users.txt) contra una LISTA de passwords (passwords.txt) sobre FTP en 10.10.10.70.", answer: "hydra -L users.txt -P passwords.txt ftp://10.10.10.70" },
        { id: "d3", promptEs: "Escribe el comando Hydra anterior pero limitando a 4 threads en paralelo.", answer: "hydra -L users.txt -P passwords.txt -t 4 ftp://10.10.10.70" },
      ],
      glossary: [
        { en: "brute-force attack", es: "ataque de fuerza bruta" },
        { en: "credential stuffing", es: "relleno de credenciales" },
        { en: "wordlist", es: "lista de palabras" },
        { en: "threads", es: "hilos (procesos en paralelo)" },
      ],
      resources: [
        { label: "TryHackMe — Hydra", url: "https://tryhackme.com/room/hydra", platform: "TryHackMe" },
      ],
      closingChecklist: [
        "Distingo -l/-p (singular) de -L/-P (lista) sin dudar",
        "Escribo la sintaxis servicio://IP correctamente (ssh://, ftp://)",
        "Logré al menos 1 credencial válida en el lab con Hydra",
      ],
    },
    {
      id: "m1-w2-b5",
      weekId: "m1-w2",
      order: 5,
      title: "PUNTO CRÍTICO: cuándo usar Gobuster vs Hydra vs enum4linux",
      objective: "Dado un escenario de examen (texto), decidir en menos de 10 segundos cuál de las 3 herramientas usar y por qué, sin dudar.",
      durationMin: 45,
      type: "drill",
      theoryEs:
        "Este es tu hueco declarado #2. La confusión se resuelve con UNA pregunta: '¿qué estoy buscando?' — ¿RUTAS/ARCHIVOS en un servidor web? Gobuster. ¿CREDENCIALES válidas para un login? Hydra. ¿INFORMACIÓN de un servicio SMB (usuarios, shares, dominio)? enum4linux. No memorices casos, memoriza la pregunta.",
      comparisonTable: {
        caption: "Gobuster vs Hydra vs enum4linux",
        headers: ["Herramienta", "¿Qué busca?", "¿Contra qué servicio?", "Ejemplo de cuándo SÍ usarla", "Ejemplo de cuándo NO usarla"],
        rows: [
          ["Gobuster", "Rutas, directorios, archivos ocultos", "HTTP/HTTPS (web)", "Encontrar un panel /admin oculto en un sitio web", "Encontrar credenciales de SSH (eso es Hydra)"],
          ["Hydra", "Credenciales válidas (usuario+password)", "Cualquier servicio con login: SSH, FTP, HTTP form, RDP", "Probar passwords contra un usuario 'admin' en SSH", "Buscar directorios web (eso es Gobuster)"],
          ["enum4linux", "Información del servicio SMB (usuarios, shares, dominio, política de passwords)", "SMB (puerto 445/139) únicamente", "Extraer lista de usuarios de un servidor Windows/Samba", "Atacar un sitio web o un servicio SSH (no aplica a SMB)"],
        ],
      },
      practiceSteps: [
        "Lee cada escenario de los drills y responde SOLO con el nombre de la herramienta + 1 línea de por qué",
        "Verifica tu respuesta contra la tabla comparativa antes de seguir",
        "Repite hasta responder los 6 escenarios sin ver la tabla",
      ],
      subtopics: ["tool-selection"],
      drills: [
        { id: "d1", promptEs: "Escenario: tienes un puerto 445 abierto en un Windows Server y quieres saber qué usuarios existen. ¿Qué herramienta usas?", answer: "enum4linux" },
        { id: "d2", promptEs: "Escenario: tienes un sitio web en el puerto 80 y sospechas que hay un panel de login oculto en alguna ruta. ¿Qué herramienta usas?", answer: "gobuster" },
        { id: "d3", promptEs: "Escenario: tienes un servicio SSH abierto y un usuario 'root' confirmado, pero no la contraseña. ¿Qué herramienta usas?", answer: "hydra" },
        { id: "d4", promptEs: "Escenario: encontraste un formulario de login HTTP (no SSH, no FTP) y quieres probar contraseñas comunes contra un usuario conocido. ¿Qué herramienta usas?", answer: "hydra" },
        { id: "d5", promptEs: "Escenario: quieres saber si un share SMB permite acceso anónimo y qué política de contraseñas tiene el dominio. ¿Qué herramienta usas?", answer: "enum4linux" },
        { id: "d6", promptEs: "Escenario: quieres encontrar un archivo backup.zip olvidado en la raíz de un sitio web. ¿Qué herramienta usas?", answer: "gobuster" },
      ],
      glossary: [
        { en: "attack surface", es: "superficie de ataque" },
        { en: "service enumeration", es: "enumeración de servicio" },
      ],
      closingChecklist: [
        "Respondí los 6 escenarios correctamente SIN ver la tabla",
        "Puedo explicar la 'pregunta clave' (¿qué estoy buscando?) en mis propias palabras",
        "Si fallé 2+ escenarios, hice el mini-repaso dirigido antes de seguir (ver Feedback)",
      ],
    },
    {
      id: "m1-w2-b6",
      weekId: "m1-w2",
      order: 6,
      title: "Enumeración de FTP y SSH",
      objective: "Enumerar la versión y configuración de FTP/SSH e identificar si permiten acceso anónimo o tienen vulnerabilidades conocidas.",
      durationMin: 45,
      type: "practice",
      theoryEs:
        "FTP y SSH son de los servicios más comunes en máquinas eJPT-style. FTP a veces permite login 'anonymous' (usuario anonymous, cualquier password). La versión exacta (via banner o -sV) te dice si hay un exploit público conocido (siguiente semana lo cruzamos con Metasploit/searchsploit).",
      practiceSteps: [
        "Conéctate manualmente y revisa el banner: nc -nv <IP> 21",
        "Prueba login anónimo en FTP: ftp <IP> (usuario: anonymous, password: cualquier cosa o vacío)",
        "Repite con NSE: nmap --script ftp-anon -p21 <IP>",
        "Revisa la versión exacta de SSH: nmap -sV -p22 <IP>",
        "Busca si esa versión tiene un exploit público: searchsploit <nombre y versión del servicio>",
      ],
      subtopics: ["ftp-ssh-enum"],
      drills: [
        { id: "d1", promptEs: "Escribe el comando NSE para verificar si el FTP de 10.10.10.80 permite acceso anónimo.", answer: "nmap --script ftp-anon -p21 10.10.10.80" },
        { id: "d2", promptEs: "Escribe el comando para conectarte por telnet/netcat al puerto 21 de 10.10.10.80 y ver el banner.", answer: "nc -nv 10.10.10.80 21" },
        { id: "d3", promptEs: "Escribe el comando searchsploit para buscar exploits de 'vsftpd 2.3.4'.", answer: "searchsploit vsftpd 2.3.4" },
      ],
      glossary: [
        { en: "anonymous login", es: "acceso anónimo" },
        { en: "banner grabbing", es: "captura de banner" },
        { en: "known exploit", es: "exploit conocido" },
      ],
      resources: [
        { label: "HackTheBox Starting Point — Fawn (opcional)", url: "https://app.hackthebox.com/starting-point", platform: "HackTheBox" },
        { label: "Metasploitable 2 — FTP 21 (vsftpd, a menudo anónimo)", url: "https://sourceforge.net/projects/metasploitable/files/Metasploitable2/", platform: "Local" },
      ],
      closingChecklist: [
        "Confirmé si el FTP del lab permitía acceso anónimo",
        "Identifiqué la versión exacta de SSH del lab",
        "Usé searchsploit al menos una vez con resultado real",
      ],
    },
    {
      id: "m1-w2-b7",
      weekId: "m1-w2",
      order: 7,
      title: "Skill-check Semana 2 + Lab de integración",
      objective: "Aprobar el skill-check de Semana 2 (70%+) y enumerar SMB+web+FTP en Metasploitable 2 (y Kioptrix si da tiempo).",
      durationMin: 50,
      type: "checkpoint",
      theoryEs: "Sin teoría nueva. Verificación de que el hueco #2 (confusión de herramientas) está cerrado. Target: tus VMs locales.",
      practiceSteps: [
        "Toma el skill-check de la app (Simulacros > Skill-checks > Semana 2)",
        "Contra Metasploitable 2: enum4linux -a, smbclient -L, gobuster dir al puerto 80, hydra SOLO si encuentras un login (no tires rockyou entero: usa una lista corta de 20 passwords para el drill)",
        "Documenta qué herramienta usaste para cada paso y por qué",
      ],
      subtopics: ["enum4linux", "smb-manual", "gobuster-dir", "hydra-bruteforce", "tool-selection", "ftp-ssh-enum"],
      resources: [
        { label: "Metasploitable 2", url: "https://sourceforge.net/projects/metasploitable/files/Metasploitable2/", platform: "Local" },
        { label: "Kioptrix Level 1", url: "https://www.vulnhub.com/entry/kioptrix-level-1-1,22/", platform: "VulnHub" },
      ],
      closingChecklist: [
        "Aprobé el skill-check de Semana 2 con 70% o más",
        "Enumeré SMB y HTTP en Metasploitable 2 documentando la herramienta de cada paso",
        "Ya no dudo entre Gobuster/Hydra/enum4linux en ningún escenario nuevo",
      ],
    },
  ],
};

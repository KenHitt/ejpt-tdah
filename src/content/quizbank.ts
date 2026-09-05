import { QuizQuestion } from "@/lib/types";

/**
 * Banco de preguntas para skill-checks (mini, 3-5 preguntas) y simulacros completos
 * (15 preguntas, aleatorias, acumulativas). Cada pregunta está etiquetada con:
 *  - subtopicId: para tracking de fallos por sub-tema exacto
 *  - globalWeek: semana global desde la que esta pregunta puede aparecer en un simulacro
 *
 * El motor de simulacro (ver src/lib/simulacro.ts) filtra por globalWeek <= semana actual
 * del usuario y elige aleatoriamente, para simular que el examen real no avisa qué va a preguntar.
 */
export const QUIZ_BANK: QuizQuestion[] = [
  {
    id: "q-lab-1", subtopicId: "lab-vbox", type: "single", globalWeek: 1,
    promptEn: "For a local pentest lab in VirtualBox, which network mode lets Kali attack a victim VM without exposing the victim to the Internet?",
    promptEs: "En un lab local de VirtualBox, ¿qué modo de red deja que Kali ataque a la víctima sin exponerla a Internet?",
    options: ["NAT only", "Host-Only (or Internal Network)", "Bridged on public Wi-Fi", "Not attached"],
    correctAnswer: "1",
    explanationEs: "Host-Only (o Internal) aísla el lab. NAT es para que Kali descargue paquetes, no para que las víctimas sean alcanzables.",
  },
  {
    id: "q-lab-2", subtopicId: "lab-vbox", type: "single", globalWeek: 1,
    promptEn: "Default credentials for Metasploitable 2 console login:",
    promptEs: "Credenciales por defecto de la consola de Metasploitable 2:",
    options: ["root/toor", "msfadmin/msfadmin", "admin/admin", "kali/kali"],
    correctAnswer: "1",
    explanationEs: "Usuario y password: msfadmin / msfadmin.",
  },
  {
    id: "q-lab-3", subtopicId: "lab-vbox", type: "command", globalWeek: 1,
    promptEn: "Write the Nmap host-discovery command for the typical VirtualBox Host-Only range 192.168.56.0/24.",
    promptEs: "Escribe el host discovery Nmap para el rango típico Host-Only 192.168.56.0/24.",
    correctAnswer: "nmap -sn 192.168.56.0/24",
    explanationEs: "-sn descubre hosts vivos en esa red de laboratorio.",
  },
  // ---------------- Semana 1: Nmap / Recon ----------------
  {
    id: "q-nmap-1", subtopicId: "nmap-basic", type: "single", globalWeek: 1,
    promptEn: "Which Nmap flag performs host discovery only, without scanning ports?",
    promptEs: "¿Qué flag de Nmap hace SOLO descubrimiento de hosts, sin escanear puertos?",
    options: ["-sV", "-sn", "-sC", "-A"], correctAnswer: "1",
    explanationEs: "-sn (antes -sP) hace ping scan / host discovery sin tocar puertos. -sV es versión, -sC son scripts default, -A es agresivo (todo junto).",
  },
  {
    id: "q-nmap-2", subtopicId: "nmap-basic", type: "single", globalWeek: 1,
    promptEn: "Which flag tells Nmap to scan ALL 65535 TCP ports instead of the top 1000?",
    promptEs: "¿Qué flag le dice a Nmap que escanee TODOS los 65535 puertos TCP en vez del top 1000?",
    options: ["-p-", "-p 1000", "--top-ports 1000", "-F"], correctAnswer: "0",
    explanationEs: "-p- es equivalente a -p 1-65535: escanea el rango completo de puertos.",
  },
  {
    id: "q-nmap-3", subtopicId: "nmap-basic", type: "single", globalWeek: 1,
    promptEn: "What is the main difference between -sS and -sT scans?",
    promptEs: "¿Cuál es la diferencia principal entre -sS y -sT?",
    options: [
      "-sS es UDP, -sT es TCP",
      "-sS necesita privilegios root (SYN/half-open), -sT completa el handshake y no requiere root",
      "No hay diferencia real",
      "-sT es más rápido siempre",
    ], correctAnswer: "1",
    explanationEs: "-sS (SYN scan) es semi-abierto y requiere privilegios elevados; -sT completa el handshake TCP y funciona sin privilegios root.",
  },
  {
    id: "q-nmap-4", subtopicId: "nmap-versioning", type: "single", globalWeek: 1,
    promptEn: "Which flag enables service/version detection in Nmap?",
    promptEs: "¿Qué flag activa la detección de versión de servicio en Nmap?",
    options: ["-O", "-sV", "-A", "-6"], correctAnswer: "1",
    explanationEs: "-sV activa detección de versión. -O es detección de sistema operativo. -A combina varias (incluye -sV).",
  },
  {
    id: "q-nmap-5", subtopicId: "nmap-scripts", type: "single", globalWeek: 1,
    promptEn: "Which Nmap flag runs scripts to look for known vulnerabilities?",
    promptEs: "¿Qué flag/valor de Nmap busca vulnerabilidades conocidas usando NSE?",
    options: ["-sC", "--script vuln", "-sV --version-all", "-oA"], correctAnswer: "1",
    explanationEs: "--script vuln corre la categoría de scripts NSE orientada a detectar vulnerabilidades conocidas. -sC corre solo los scripts 'default' (más generales).",
  },
  {
    id: "q-nmap-6", subtopicId: "nmap-scripts", type: "command", globalWeek: 1,
    promptEn: "Write the Nmap command to run default scripts + version detection against 10.10.10.10.",
    promptEs: "Escribe el comando Nmap para correr scripts default + detección de versión contra 10.10.10.10.",
    correctAnswer: "nmap -sC -sV 10.10.10.10",
    explanationEs: "-sC -sV es la combinación estándar para un primer escaneo informativo.",
  },
  {
    id: "q-passive-1", subtopicId: "passive-recon", type: "single", globalWeek: 1,
    promptEn: "Which of these is considered PASSIVE reconnaissance?",
    promptEs: "¿Cuál de estas se considera recon PASIVO?",
    options: ["Running Nmap against the target", "Querying whois records", "Sending a Hydra brute-force attack", "Exploiting a known CVE"], correctAnswer: "1",
    explanationEs: "whois consulta datos públicos de registro sin tocar la infraestructura del objetivo directamente: es pasivo. Nmap, Hydra y explotación son activos.",
  },

  // ---------------- Semana 2: Enumeración / Tool selection ----------------
  {
    id: "q-enum4-1", subtopicId: "enum4linux", type: "single", globalWeek: 2,
    promptEn: "Which flag makes enum4linux run ALL enumeration checks at once?",
    promptEs: "¿Qué flag hace que enum4linux corra TODAS las enumeraciones de una vez?",
    options: ["-U", "-S", "-a", "-P"], correctAnswer: "2",
    explanationEs: "-a corre una enumeración completa (usuarios, shares, política de passwords, OS, etc.).",
  },
  {
    id: "q-enum4-2", subtopicId: "enum4linux", type: "command", globalWeek: 2,
    promptEn: "Write the enum4linux command for a full enumeration against 10.10.10.5.",
    promptEs: "Escribe el comando enum4linux para una enumeración completa contra 10.10.10.5.",
    correctAnswer: "enum4linux -a 10.10.10.5",
    explanationEs: "enum4linux -a <IP> es la forma estándar de correr todo de una vez.",
  },
  {
    id: "q-smb-1", subtopicId: "smb-manual", type: "command", globalWeek: 2,
    promptEn: "Write the smbclient command to list shares on 10.10.10.5 using a null session.",
    promptEs: "Escribe el comando smbclient para listar shares de 10.10.10.5 usando sesión nula.",
    correctAnswer: "smbclient -L 10.10.10.5 -N",
    explanationEs: "-L lista shares, -N evita que te pida password (sesión nula).",
  },
  {
    id: "q-gobuster-1", subtopicId: "gobuster-dir", type: "single", globalWeek: 2,
    promptEn: "What is Gobuster primarily used for?",
    promptEs: "¿Para qué se usa principalmente Gobuster?",
    options: [
      "Fuerza bruta de credenciales de login",
      "Fuerza bruta de directorios/archivos en un servidor web",
      "Enumeración de usuarios SMB",
      "Escaneo de puertos",
    ], correctAnswer: "1",
    explanationEs: "Gobuster hace fuerza bruta de RUTAS/ARCHIVOS web (modo dir) o subdominios (modo dns), no de credenciales.",
  },
  {
    id: "q-gobuster-2", subtopicId: "gobuster-dir", type: "command", globalWeek: 2,
    promptEn: "Write the Gobuster command (dir mode) to brute-force directories on http://10.10.10.10 using /usr/share/wordlists/dirb/common.txt.",
    promptEs: "Escribe el comando Gobuster (modo dir) para buscar directorios en http://10.10.10.10 con /usr/share/wordlists/dirb/common.txt.",
    correctAnswer: "gobuster dir -u http://10.10.10.10 -w /usr/share/wordlists/dirb/common.txt",
    explanationEs: "Sintaxis estándar: gobuster dir -u <url> -w <wordlist>.",
  },
  {
    id: "q-hydra-1", subtopicId: "hydra-bruteforce", type: "single", globalWeek: 2,
    promptEn: "In Hydra, which flag is used to provide a SINGLE known username (not a list)?",
    promptEs: "En Hydra, ¿qué flag se usa para dar UN usuario conocido (no una lista)?",
    options: ["-L", "-l", "-P", "-p"], correctAnswer: "1",
    explanationEs: "-l (minúscula) es un solo usuario; -L (mayúscula) es una lista de usuarios. Igual patrón para -p/-P con passwords.",
  },
  {
    id: "q-hydra-2", subtopicId: "hydra-bruteforce", type: "command", globalWeek: 2,
    promptEn: "Write the Hydra command to brute-force SSH on 10.10.10.10 with username 'admin' and password list /usr/share/wordlists/rockyou.txt.",
    promptEs: "Escribe el comando Hydra para forzar SSH en 10.10.10.10 con usuario 'admin' y lista de passwords /usr/share/wordlists/rockyou.txt.",
    correctAnswer: "hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://10.10.10.10",
    explanationEs: "-l para usuario único, -P para lista de passwords, seguido de servicio://IP.",
  },
  {
    id: "q-toolsel-1", subtopicId: "tool-selection", type: "single", globalWeek: 2,
    promptEn: "You found an SSH service and a valid username 'root', but no password. What's the correct tool?",
    promptEs: "Encontraste un servicio SSH y un usuario válido 'root', pero no la contraseña. ¿Cuál es la herramienta correcta?",
    options: ["Gobuster", "enum4linux", "Hydra", "Nmap"], correctAnswer: "2",
    explanationEs: "Buscas CREDENCIALES válidas contra un servicio con login (SSH) -> Hydra.",
  },
  {
    id: "q-toolsel-2", subtopicId: "tool-selection", type: "single", globalWeek: 2,
    promptEn: "You have port 445 open on a Windows host and want to know what users exist. What's the correct tool?",
    promptEs: "Tienes el puerto 445 abierto en un host Windows y quieres saber qué usuarios existen. ¿Cuál es la herramienta correcta?",
    options: ["Hydra", "Gobuster", "enum4linux", "sqlmap"], correctAnswer: "2",
    explanationEs: "Información de un servicio SMB (usuarios, shares) -> enum4linux.",
  },
  {
    id: "q-toolsel-3", subtopicId: "tool-selection", type: "single", globalWeek: 2,
    promptEn: "You suspect there's a hidden admin panel on a web server. What's the correct tool?",
    promptEs: "Sospechas que hay un panel de admin oculto en un servidor web. ¿Cuál es la herramienta correcta?",
    options: ["Gobuster", "Hydra", "enum4linux", "arpspoof"], correctAnswer: "0",
    explanationEs: "Buscar RUTAS/ARCHIVOS ocultos en un servidor web -> Gobuster.",
  },
  {
    id: "q-ftpssh-1", subtopicId: "ftp-ssh-enum", type: "command", globalWeek: 2,
    promptEn: "Write the Nmap NSE command to check for anonymous FTP login on 10.10.10.20.",
    promptEs: "Escribe el comando NSE de Nmap para verificar login FTP anónimo en 10.10.10.20.",
    correctAnswer: "nmap --script ftp-anon -p21 10.10.10.20",
    explanationEs: "El script ftp-anon de NSE verifica si el servicio FTP permite acceso anónimo.",
  },

  // ---------------- Semana 3: Metasploit ----------------
  {
    id: "q-msf-1", subtopicId: "msf-search-use", type: "command", globalWeek: 3,
    promptEn: "Write the msfconsole command to search for modules related to 'eternalblue'.",
    promptEs: "Escribe el comando de msfconsole para buscar módulos relacionados a 'eternalblue'.",
    correctAnswer: "search eternalblue",
    explanationEs: "search <término> busca módulos por nombre, CVE o plataforma relacionada.",
  },
  {
    id: "q-msf-2", subtopicId: "msf-search-use", type: "single", globalWeek: 3,
    promptEn: "Which command selects a module found via search, using its full path?",
    promptEs: "¿Qué comando selecciona un módulo encontrado con search, usando su ruta completa?",
    options: ["run", "use", "set", "exploit"], correctAnswer: "1",
    explanationEs: "'use <ruta_del_módulo>' selecciona el módulo activo en la sesión de msfconsole.",
  },
  {
    id: "q-msf-3", subtopicId: "msf-options", type: "single", globalWeek: 3,
    promptEn: "Which command lists all parameters of the currently selected module, including which are required?",
    promptEs: "¿Qué comando lista todos los parámetros del módulo activo, indicando cuáles son requeridos?",
    options: ["show payloads", "show options", "info", "set"], correctAnswer: "1",
    explanationEs: "'show options' lista todos los parámetros y marca 'Required: yes/no'.",
  },
  {
    id: "q-msf-4", subtopicId: "msf-lhost-lport", type: "single", globalWeek: 3,
    promptEn: "In Metasploit, RHOSTS refers to:",
    promptEs: "En Metasploit, RHOSTS se refiere a:",
    options: ["Tu propia máquina atacante", "La(s) máquina(s) víctima que vas a atacar", "El puerto local de escucha", "El nombre del payload"], correctAnswer: "1",
    explanationEs: "RHOSTS = Remote Host(s), la IP de la víctima/objetivo.",
  },
  {
    id: "q-msf-5", subtopicId: "msf-lhost-lport", type: "single", globalWeek: 3,
    promptEn: "In Metasploit, LHOST refers to:",
    promptEs: "En Metasploit, LHOST se refiere a:",
    options: ["La IP de la víctima", "Tu propia IP (a donde la reverse shell se conecta de vuelta)", "El nombre del exploit", "El puerto remoto"], correctAnswer: "1",
    explanationEs: "LHOST = Local Host, TU IP como atacante, a donde se conecta la reverse shell.",
  },
  {
    id: "q-msf-6", subtopicId: "msf-lhost-lport", type: "command", globalWeek: 3,
    promptEn: "Write the msfvenom command to generate a Linux ELF reverse_tcp meterpreter payload with LHOST=10.8.0.5 and LPORT=4444, saved as shell.elf.",
    promptEs: "Escribe el comando msfvenom para generar un payload ELF (Linux) meterpreter reverse_tcp con LHOST=10.8.0.5 y LPORT=4444, guardado como shell.elf.",
    correctAnswer: "msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=10.8.0.5 LPORT=4444 -f elf -o shell.elf",
    explanationEs: "msfvenom -p <payload> LHOST=<tu IP> LPORT=<puerto> -f <formato> -o <archivo>.",
  },
  {
    id: "q-msf-7", subtopicId: "msf-multihandler", type: "command", globalWeek: 3,
    promptEn: "Write the msfconsole command to select the multi/handler listener module.",
    promptEs: "Escribe el comando de msfconsole para seleccionar el módulo listener multi/handler.",
    correctAnswer: "use exploit/multi/handler",
    explanationEs: "exploit/multi/handler es el listener genérico usado cuando el payload se ejecuta fuera de un exploit de Metasploit.",
  },
  {
    id: "q-msf-8", subtopicId: "msf-sysinfo", type: "command", globalWeek: 3,
    promptEn: "Inside an active meterpreter session, write the command to see target OS/hostname/architecture info.",
    promptEs: "Dentro de una sesión meterpreter activa, escribe el comando para ver info del SO/hostname/arquitectura del objetivo.",
    correctAnswer: "sysinfo",
    explanationEs: "sysinfo muestra información básica del sistema objetivo.",
  },
  {
    id: "q-msf-9", subtopicId: "msf-hashdump", type: "command", globalWeek: 3,
    promptEn: "Inside an active meterpreter session with sufficient privileges, write the command to dump password hashes.",
    promptEs: "Dentro de una sesión meterpreter con privilegios suficientes, escribe el comando para extraer hashes de contraseñas.",
    correctAnswer: "hashdump",
    explanationEs: "hashdump extrae los hashes de la base SAM (Windows) si tienes privilegios suficientes.",
  },
  {
    id: "q-msf-10", subtopicId: "msf-options", type: "command", globalWeek: 3,
    promptEn: "Write the msfconsole command to set the target IP 10.10.10.10 as RHOSTS.",
    promptEs: "Escribe el comando para configurar el target 10.10.10.10 como RHOSTS.",
    correctAnswer: "set RHOSTS 10.10.10.10",
    explanationEs: "set <PARAM> <valor> asigna valores a las opciones del módulo activo.",
  },

  // ---------------- Semana 4: Vuln assessment / Exploitation ----------------
  {
    id: "q-vuln-1", subtopicId: "vuln-assessment", type: "command", globalWeek: 4,
    promptEn: "Write the searchsploit command to look for exploits for 'Apache 2.4.49'.",
    promptEs: "Escribe el comando searchsploit para buscar exploits de 'Apache 2.4.49'.",
    correctAnswer: "searchsploit apache 2.4.49",
    explanationEs: "searchsploit <software> <versión> busca en la base local de Exploit-DB.",
  },
  {
    id: "q-revbind-1", subtopicId: "reverse-vs-bind", type: "single", globalWeek: 4,
    promptEn: "In a reverse shell, who initiates the connection?",
    promptEs: "En una reverse shell, ¿quién inicia la conexión?",
    options: ["El atacante", "La víctima", "Ambos al mismo tiempo", "Ninguno, es automático"], correctAnswer: "1",
    explanationEs: "En reverse shell la VÍCTIMA se conecta de vuelta hacia el atacante (útil cuando está detrás de NAT/firewall).",
  },
  {
    id: "q-revbind-2", subtopicId: "reverse-vs-bind", type: "command", globalWeek: 4,
    promptEn: "Write the netcat command to set up a listener on port 4444 waiting for a reverse shell.",
    promptEs: "Escribe el comando netcat para poner un listener en el puerto 4444 esperando una reverse shell.",
    correctAnswer: "nc -lvnp 4444",
    explanationEs: "-l escucha, -v verbose, -n sin resolución DNS, -p puerto.",
  },
  {
    id: "q-exploit-1", subtopicId: "exploit-windows", type: "command", globalWeek: 4,
    promptEn: "Write the Nmap NSE command to check if SMB on 10.10.10.10 is vulnerable to MS17-010 (EternalBlue).",
    promptEs: "Escribe el comando NSE para verificar si el SMB de 10.10.10.10 es vulnerable a MS17-010 (EternalBlue).",
    correctAnswer: "nmap --script smb-vuln-ms17-010 -p445 10.10.10.10",
    explanationEs: "El script smb-vuln-ms17-010 detecta la vulnerabilidad EternalBlue en SMBv1.",
  },

  // ---------------- Semana 5-6: Web (SQLi/XSS/LFI/RFI) ----------------
  {
    id: "q-sqli-1", subtopicId: "web-sqli", type: "single", globalWeek: 5,
    promptEn: "What is the goal of a UNION-based SQL injection?",
    promptEs: "¿Cuál es el objetivo de una inyección SQL basada en UNION?",
    options: [
      "Bloquear la base de datos",
      "Combinar los resultados de tu propia consulta con los de la consulta original para extraer datos",
      "Cifrar la conexión",
      "Aumentar la velocidad de la query",
    ], correctAnswer: "1",
    explanationEs: "UNION SELECT permite inyectar una consulta propia que se combina con la original, extrayendo datos arbitrarios.",
  },
  {
    id: "q-sqli-2", subtopicId: "web-sqli", type: "command", globalWeek: 5,
    promptEn: "Write the sqlmap command to list databases for the URL http://10.10.10.10/item.php?id=1",
    promptEs: "Escribe el comando sqlmap para listar bases de datos de http://10.10.10.10/item.php?id=1",
    correctAnswer: 'sqlmap -u "http://10.10.10.10/item.php?id=1" --dbs',
    explanationEs: "--dbs enumera las bases de datos disponibles una vez confirmada la inyección.",
  },
  {
    id: "q-xss-1", subtopicId: "web-xss", type: "single", globalWeek: 5,
    promptEn: "A malicious script stored in a blog comment affects every visitor who views that page. What type of XSS is this?",
    promptEs: "Un script malicioso guardado en un comentario de blog afecta a todos los visitantes que ven esa página. ¿Qué tipo de XSS es?",
    options: ["Reflected", "Stored", "DOM-based", "Blind SQLi"], correctAnswer: "1",
    explanationEs: "Stored XSS persiste en la base de datos y afecta a cualquier visitante futuro.",
  },
  {
    id: "q-lfi-1", subtopicId: "web-lfi-rfi", type: "command", globalWeek: 6,
    promptEn: "Write a basic path traversal payload to read /etc/passwd via the 'page' parameter.",
    promptEs: "Escribe un payload básico de path traversal para leer /etc/passwd vía el parámetro 'page'.",
    correctAnswer: "../../../../etc/passwd",
    explanationEs: "El path traversal con ../ repetido sube directorios hasta la raíz para acceder a /etc/passwd.",
  },
  {
    id: "q-authbypass-1", subtopicId: "web-auth-bypass", type: "command", globalWeek: 6,
    promptEn: "Write a classic SQLi payload to bypass a login form in the username field.",
    promptEs: "Escribe un payload SQLi clásico para hacer bypass de un login en el campo usuario.",
    correctAnswer: "admin' OR '1'='1' -- -",
    explanationEs: "Esto convierte la condición WHERE en siempre verdadera, evadiendo la validación de password.",
  },

  // ---------------- Semana 7: Network attacks / Pivoting ----------------
  {
    id: "q-mitm-1", subtopicId: "net-mitm", type: "single", globalWeek: 7,
    promptEn: "What does ARP spoofing achieve?",
    promptEs: "¿Qué logra el ARP spoofing?",
    options: [
      "Cifra el tráfico de red",
      "Hace que la víctima crea que el atacante es el gateway (o viceversa), permitiendo interceptar tráfico",
      "Escanea puertos abiertos",
      "Reinicia el router",
    ], correctAnswer: "1",
    explanationEs: "ARP spoofing envenena la tabla ARP para posicionar al atacante en medio del tráfico (MITM).",
  },
  {
    id: "q-pivot-1", subtopicId: "net-pivoting", type: "command", globalWeek: 7,
    promptEn: "Write the SSH command to create a dynamic SOCKS proxy on local port 1080 through host 'user@10.10.10.5'.",
    promptEs: "Escribe el comando SSH para crear un proxy SOCKS dinámico en el puerto local 1080 a través del host 'user@10.10.10.5'.",
    correctAnswer: "ssh -D 1080 user@10.10.10.5",
    explanationEs: "-D crea un proxy SOCKS dinámico que luego se usa con proxychains.",
  },

  // ---------------- Semana 8: Privesc ----------------
  {
    id: "q-privesc-lin-1", subtopicId: "privesc-linux", type: "command", globalWeek: 8,
    promptEn: "Write the command to check what you can run with sudo without a password.",
    promptEs: "Escribe el comando para ver qué puedes ejecutar con sudo sin contraseña.",
    correctAnswer: "sudo -l",
    explanationEs: "sudo -l lista los comandos permitidos para el usuario actual vía sudoers.",
  },
  {
    id: "q-privesc-lin-2", subtopicId: "privesc-linux", type: "command", globalWeek: 8,
    promptEn: "Write the find command to list all SUID binaries on the system.",
    promptEs: "Escribe el comando find para listar todos los binarios con bit SUID.",
    correctAnswer: "find / -perm -4000 -type f 2>/dev/null",
    explanationEs: "-perm -4000 filtra archivos con el bit SUID activo.",
  },
  {
    id: "q-privesc-win-1", subtopicId: "privesc-windows", type: "command", globalWeek: 8,
    promptEn: "Inside meterpreter, write the command to attempt automatic privilege escalation.",
    promptEs: "Dentro de meterpreter, escribe el comando para intentar escalada de privilegios automática.",
    correctAnswer: "getsystem",
    explanationEs: "getsystem prueba varias técnicas conocidas de escalada automática en Windows.",
  },

  // ---------------- Semana 9+: Full chain / Reporting / Exam ----------------
  {
    id: "q-fullchain-1", subtopicId: "full-chain", type: "single", globalWeek: 9,
    promptEn: "What is the correct general order of a penetration test methodology?",
    promptEs: "¿Cuál es el orden general correcto de una metodología de pentesting?",
    options: [
      "Explotación -> Recon -> Enumeración -> Reporte",
      "Recon -> Escaneo/Enumeración -> Evaluación de vulnerabilidades -> Explotación -> Post-explotación -> Reporte",
      "Post-explotación -> Recon -> Explotación",
      "Reporte -> Recon -> Explotación",
    ], correctAnswer: "1",
    explanationEs: "El flujo estándar (y el que sigue eJPT) es: recon, escaneo/enumeración, evaluación de vulnerabilidades, explotación, post-explotación, reporte.",
  },
  {
    id: "q-report-1", subtopicId: "reporting", type: "single", globalWeek: 10,
    promptEn: "What format does the eJPT exam mainly expect for answers?",
    promptEs: "¿Qué formato espera principalmente el examen eJPT para las respuestas?",
    options: ["Ensayo narrativo largo", "Respuestas cortas y precisas tipo pregunta-respuesta (flags/valores exactos)", "Solo capturas de pantalla", "No requiere respuestas, solo acceso root"], correctAnswer: "1",
    explanationEs: "El eJPT usa un cuestionario de preguntas específicas con respuestas cortas (versiones, hashes, flags), no un reporte narrativo largo como OSCP.",
  },
  {
    id: "q-examlogistics-1", subtopicId: "exam-logistics", type: "single", globalWeek: 11,
    promptEn: "What should you verify BEFORE exam day, not on the exam day itself?",
    promptEs: "¿Qué deberías verificar ANTES del día del examen, no el mismo día?",
    options: ["Nada, todo se hace el mismo día", "La conexión VPN del examen y tu entorno Kali", "El clima", "El nombre del certificado"], correctAnswer: "1",
    explanationEs: "Probar la VPN y el entorno con anticipación evita perder tiempo valioso del examen resolviendo problemas técnicos.",
  },
];

export function questionsForSubtopic(subtopicId: string): QuizQuestion[] {
  return QUIZ_BANK.filter((q) => q.subtopicId === subtopicId);
}

export function questionsAvailableAtWeek(globalWeek: number): QuizQuestion[] {
  return QUIZ_BANK.filter((q) => q.globalWeek <= globalWeek);
}

import { CourseSection } from "@/content/course/types";
import { S } from "@/content/course/helper";

/** Teoría de fondo por semana: se lee ANTES del examen corto. */
export const WEEK_THEORY: Record<number, CourseSection[]> = {
  0: [
    S(
      "El laboratorio es un sistema, no un ISO",
      "Kali en el disco es el atacante. VirtualBox es solo el hipervisor de las víctimas. Host-Only (vboxnet0) es el switch que os une. Si cambias una de esas tres piezas —Kali en VM Bridged, víctima en la Wi‑Fi, LHOST copiado de un blog— el resto de comandos del trimestre mienten. La teoría de esta semana no es 'relleno': es el contrato físico del plan. Sin ping al guest no hay Nmap útil, no hay Metasploit y no hay eJPT de laboratorio."
    ),
    S(
      "Tres redes que la gente mezcla",
      "Red 1: Internet del host (wlan0/eth0) — actualizaciones, Docker Hub, este curso. Red 2: Host-Only — Kali ↔ MS2/Kioptrix. Red 3: el rango VPN de INE el día del examen. Ping a 8.8.8.8 demuestra la 1, no la 2. Un reverse shell necesita que la víctima vea la 2 (o la 3). Bridged fusiona la 2 con la LAN familiar: Metasploitable es un producto diseñado para romperse; no lo ofrezcas a impresoras y móviles."
    ),
    S(
      "Autorización escrita antes de cualquier paquete",
      "eJPT no empieza con un exploit: empieza con un alcance. Aquí el alcance permanente es: VMs que tú importaste, DVWA en localhost, y más adelante el brief de INE. 'Es una IP privada' no autoriza. 'Es mi casa' no autoriza el router ni el portátil de otra persona. Si no puedes nombrar al dueño del target en una frase, no escaneas. Esa frase se escribe en papel el día 1 y se relee cuando el cerebro pida 'probar en algo real'."
    ),
    S(
      "Qué mides y qué ignoras",
      "ip addr en vboxnet te da LHOST. ip route te dice por qué interfaz sale cada CIDR. ifconfig/ip en el guest te da RHOST. nmap -sn en ESE CIDR lista vivos. Todo lo demás (IP pública, 127.0.0.1, la gateway de la Wi‑Fi) es ruido para el ataque de lab. Anotar esas tres cajas —Kali, switch, guest— te ahorra semanas de 'el reverse no nace' que en realidad eran capa 3."
    ),
    S(
      "Ritmo de jornada, no de reel",
      "Cada clase de este plan es una jornada de ~10 horas: teoría amplia, examen corto, ejemplos que sigues, práctica tuya en VirtualBox, y una fuente de GitHub con timer. No pretendas terminar las 78 hoy. Día 7 de cada semana: descanso o repetición. El examen INE premia método repetido, no haber 'visto' 40 vídeos."
    ),
  ],
  1: [
    S(
      "Recon es una escalera, no un botón",
      "Pasivo (brief, whois, lo publicado) no toca al target. Activo sí: ICMP, TCP, UDP. Dentro de lo activo hay capas: ¿quién está vivo? ¿qué puertos? ¿qué versión? ¿qué dice un script de descubrimiento? Cada flag de Nmap responde una sola pregunta. Saltar de 'hay un 80' a Metasploit es fallar el método, no ir más rápido. eJPT pregunta interpretación: open no es vulnerable; filtered no es 'cerrado y ya'."
    ),
    S(
      "El top 1000 miente si el servicio vive arriba",
      "Sin -p, Nmap cubre los 1000 puertos más comunes. Un listener en 31337 o 8081 no aparece. -p- cubre TCP 1–65535 y se come el reloj si lo lanzas a un /24. Orden de adulto: vivos → top 1000 en esos hosts → -p- solo en el RHOST que importa. UDP (-sU) es otro universo: lento, 161/snmp y 53/dns no salen en un SYN scan. No asumas que 'ya escaneé todo' porque viste 22 y 80."
    ),
    S(
      "Versión es el puente hacia el módulo",
      "-sV habla con el servicio. 'http' no elige exploit; 'Apache 2.2.8' acota searchsploit y search de Metasploit. -sC corre NSE default (descubrimiento, no dinamita). -oN guarda evidencia para ti: el examen pide valores exactos y la memoria heroica pierde minutos. Un banner puede mentir; igual es tu mejor pista hasta que enum SMB/HTTP lo confirme."
    ),
    S(
      "TCP que importa en eJPT",
      "Handshake: SYN, SYN-ACK, ACK. -sS (SYN) no completa; suele ser default en Kali root. -sT completa el connect; más ruidoso en logs. Ping ICMP no prueba el puerto 80. Host 'down' en -sn no niega un puerto filtrado por otra vía. Cuando un reverse 'no nace', a menudo el paquete nunca hizo el handshake hacia TU LHOST de vboxnet — no hacia wlan0."
    ),
    S(
      "Prioridad al leer un output",
      "21 FTP (¿anonymous?), 80/443 HTTP (¿dirs, params?), 139/445 SMB (¿users, shares?), 22 SSH (versión; brute después de tener user). Tres superficies, UNA misión de enum profundo si tienes TDAH. Anota IP, puerto, versión, siguiente herramienta. Eso es el oficio. Escanear sin interpretar es calorías vacías."
    ),
  ],
  2: [
    S(
      "El puerto elige la herramienta",
      "445 no se dirbustea. 80 no se enumera con enum4linux. 22 no se gobustea. Hydra no adivina rutas HTTP: adivina credenciales de un login. Esta semana existe porque mezclar esas tres familias es el hueco que más suspende en lab casero. La regla cabe en una frase: protocolo primero, binario después. Si dudas, enumera más y brute-forcea menos."
    ),
    S(
      "SMB es disco y a veces usuarios, no HTTP",
      "139/445 hablan de shares, políticas y a veces null session. enum4linux -a, smbclient -L, smbmap. Una herramienta a fondo (TDAH). Users que salgan de SMB son munición para SSH/FTP después, no un motivo para Hydra al /24. Un share con READ es loot; WRITE en lab puede ser vector de drop — solo en TU VM. hashdump SAM es Windows; MS2 es Linux-like. No mezcles el modelo."
    ),
    S(
      "Gobuster brute-forcea el espacio de nombres HTTP",
      "Wordlist + URL base. 200 se sirve, 301/302 redirige, 403 existe y niega, 404 el servidor dice que no. 403 es hallazgo. Sin 80/443 no hay Gobuster. Wordlist de 80 millones en examen come reloj: common + extensiones .php. vhost/dns son otros modos; hoy dir. Abre los 200 en el navegador del lab: el título a veces vale más que el path."
    ),
    S(
      "Hydra necesita un eje de usuario",
      "Sin username estás adivinando user × password: combinatorio. El user sale de SMB, de un formulario, de un banner FTP, de un comentario HTML. Lockouts existen. MS2 a veces perdona; el examen no siempre. Hydra contra el SSH de un amigo o el router de casa no es eJPT: es delito. Escribe el comando con user conocido antes de lanzarlo."
    ),
    S(
      "FTP y SSH cierran el triángulo",
      "FTP 21: anonymous, ls/get, reutilización de password hacia SSH. SSH 22: banner OpenSSH, password o key, nunca dirbust. Orden razonable del output 21,22,80,445: discovery ya hecho → SMB users → HTTP dirs → FTP anon → SSH solo si hay user. Cinco brutes en paralelo es ruido. Una misión, un cierre, una nota."
    ),
  ],
  3: [
    S(
      "Metasploit es un marco, no el examen",
      "Exploits, payloads, auxiliaries, post. search vive de producto+versión que sacaste con Nmap. use carga un objeto. show options es el examen real: RHOSTS, LHOST, payload. run sin options es teatro. Un módulo Windows contra MS2 Linux es un error de lectura, no de 'suerte'. Auxiliary (scanner/brute) sigue siendo enum: no te da shell por existir."
    ),
    S(
      "LHOST es una interfaz, no un número sagrado",
      "El guest Host-Only solo sabe hablarte a la IP de vboxnet. Si pones LHOST = wlan0, el reverse muere en silencio. LPORT 4444 es costumbre, no magia; si está ocupado, cambia. Reverse: la víctima conecta a ti. Bind: la víctima escucha y tú conectas. En NAT de examen, reverse suele ser más feliz. Dibuja las tres cajas antes de exploit -j."
    ),
    S(
      "Payload compatible o no hay sesión",
      "linux/x86/meterpreter/reverse_tcp no es un encantamiento para Windows. cmd/unix/reverse o el que declare el módulo. multi/handler es el listener cuando el payload va fuera de msf (msfvenom). Si el handler y el binario no coinciden, 'no pasa nada' es el síntoma correcto. No lances otro CVE: debug ese eslabón."
    ),
    S(
      "Sesión ≠ examen aprobado",
      "sysinfo, getuid, hashdump (Windows), loot. El examen quiere un valor, no tu ego. Una shell cruda se muere con Ctrl+C; python pty / script se practican en lab, no en el primer minuto de INE. Si vsftpd no es 2.3.4 en TU -sV, no fuerces el módulo meme. El match de versión es la nota."
    ),
    S(
      "Cadena mínima que debes poder repetir",
      "nmap -sV → coincidencia → search → use → set RHOSTS/LHOST/payload → run → sysinfo. Si fallas, identificas el eslabón (red, options, payload, target SO). Un vídeo de 2 h no cierra el hueco: repetición de esa cadena en TU VirtualBox sí."
    ),
  ],
  4: [
    S(
      "Identificar es un paso, explotar es otro",
      "searchsploit 'producto versión' lista Exploit-DB. Leer rank, target SO, si hay módulo msf. El primer .c de Internet no es un plan. Versión cercana ≠ garantía. Nessus/OpenVAS son scanners: generan hipótesis, no root. Confirmas el servicio real en TU guest antes de run."
    ),
    S(
      "Reverse vs bind sin poesía",
      "Reverse: outbound de la víctima hacia LHOST:LPORT. Bind: inbound tuyo hacia RHOST:puerto. Firewalls y NAT del examen suelen odiar bind y perdonar reverse. Si el reverse no nace: ¿LHOST correcto? ¿LPORT libre? ¿misma red Host-Only? ¿payload del SO correcto? Wireshark en vboxnet te dice la verdad; el feeling no."
    ),
    S(
      "Una cadena bajo control cierra el Mes 1",
      "No colecciones 12 CVEs. Una máquina, un vector que coincida, evidencia (user, SO, un archivo). Snapshot antes si el guest se pone inestable. El examen premia completar preguntas, no 'haber explotado más cosas'. Si aún no hay ping, esta semana no es para searchsploit: es para /laboratorio."
    ),
    S(
      "Linux vs Windows en el mismo cerebro",
      "MS2 es Ubuntu vulnerable. hashdump SAM, WinPEAS, psexec viven en otro SO. Puedes entender el modelo Windows sin montar AD esta semana. Si más adelante importas Metasploitable3, misma regla Host-Only. No Bridged 'para que sea más real'."
    ),
    S(
      "Criterio de parada",
      "Tienes versión, candidato, módulo o exploit entendido, sesión o evidencia de por qué no. Eso es cierre. Seguir googleando a las 3 a.m. es el hoyo. Timer. Notas. Mañana Mes 2 web o repetición de la cadena."
    ),
  ],
  5: [
    S(
      "HTTP es petición y respuesta, no 'la web'",
      "GET pone params en la URL. POST en el cuerpo. Cookies en headers. 200/301/302/401/403/404/500 cambian el siguiente movimiento. Si no ves el parámetro, no hay SQLi ni LFI. Burp o DevTools contra DVWA en localhost. Nunca el proxy hacia Internet. 403 no es 404. 500 a veces es pista de inyección, no 'el lab está roto'."
    ),
    S(
      "SQLi es concatenar input en SQL",
      "Una comilla rompe sintaxis. OR 1=1 cambia el predicado. UNION necesita el número de columnas. information_schema (MySQL) lista tablas. 80 open no implica SQLi. sqlmap -u --dbs / --tables / --dump --cookie --batch ahorra tiempo SI ya viste el param. --dump masivo come reloj. Solo DVWA o el HTTP de TU guest."
    ),
    S(
      "XSS corre en el navegador, no en el kernel",
      "Reflected: el payload vuelve en esa respuesta. Stored: se guarda y pega a otros. DOM: el JS de la página concatena inseguro. alert(1) en DVWA es PoC de lab. Robo de cookie es concepto; no robes sesiones ajenas. Confundir XSS con SQLi es el error de quien solo memoriza strings."
    ),
    S(
      "Authn no es authz",
      "Authn: quién eres (login). Authz: qué puedes (admin vs user). Cookie de sesión es un ticket. IDOR: cambiar id=1 a id=2. Un 403 a veces es authz real, no un bypass de blog. Brute de login sin user es el mismo pecado que Hydra ciego."
    ),
    S(
      "DVWA es el dojo, no un target de Internet",
      "Security low primero. localhost. No publiques el contenedor. Mes 2 vive aquí. Si DVWA no abre, /laboratorio antes que sqlmap. El simulacro no perdona 4 horas de vídeo y cero clics."
    ),
  ],
  6: [
    S(
      "LFI incluye ficheros locales según un parámetro",
      "page=../../../../etc/passwd es el ping de LFI en Linux. ../ sube directorios. Filtros a veces ceden con encoding o wrappers (php://filter) en lab. LFI no es RCE hasta un paso extra (logs, wrappers) y solo en DVWA. No es SQLi. No se practica en un CMS ajeno."
    ),
    S(
      "RFI es inclusión remota, no un hobby",
      "Requiere allow_url_include y un param que acepte URL. Si DVWA lo tiene cerrado, no fuerces php.ini del host: lee el concepto y sigue. Bajar un webshell a un host que no es tuyo no es 'probar RFI'. Es delito."
    ),
    S(
      "Bypass de auth en lab es a menudo lógica, no crypto",
      "Cookies predecibles, parámetros hidden, IDOR, default creds. Upload + command injection son superficies distintas: un archivo que se ejecuta vs un campo que llega a system(). Manual primero. commix después, y solo si ya viste la inyección a mano en DVWA."
    ),
    S(
      "El primer simulacro es una skill aparte",
      "Marcar bajo reloj no es lo mismo que entender en calma. 15 preguntas, umbral 70%, no el mismo día si suspendes el full. Llega habiendo tocado DVWA. Las preguntas mezclan SQLi, XSS, LFI, tools. El cerebro que solo leyó reprueba con estilo."
    ),
    S(
      "Cierre web Mes 2a",
      "Puedes nombrar detección SQLi, UNION conceptual, sqlmap --dbs, tres XSS, LFI vs RFI, 403 vs 404. Si no, no es 'semana 7 redes': es repetición. TDAH: una vulnerabilidad por sesión de práctica, no las cinco en paralelo."
    ),
  ],
  7: [
    S(
      "ARP y MITM no se ensayan en la familia",
      "ARP spoof envenena la tabla para que la víctima crea que tú eres el gateway. Concepto eJPT. Ejecución solo guest-a-guest en lab aislado. ettercap/bettercap hacia 192.168.1.0/24 de casa no es lab: es atacar humanos. La tabla ARP del lab se mira con ip neigh después de un ping al guest. Fin."
    ),
    S(
      "Rutas: el guest no ve wlan0",
      "ip route en Kali muestra default via Wi‑Fi (Internet) y la ruta al /24 de vboxnet. LHOST wlan0 hacia un guest Host-Only es un error de topología. Pivot existe cuando hay UNA red que Kali no ve y la víctima sí. Una NIC en MS2 a menudo significa: no hay pivot. No lo inventes."
    ),
    S(
      "Port forward y SOCKS son tuberías",
      "ssh -L, chisel, msf portfwd: un puerto de allí aparece aquí. SOCKS es un proxy; proxychains envuelve herramientas por ese proxy. Pregunta de examen: para qué sirve, no 15 flags. Practica solo si tu lab tiene 2 redes. SOCKS público en un café no es eJPT."
    ),
    S(
      "UDP no viene de regalo",
      "nmap -sU es lento. SNMP 161/udp community public. DNS 53 AXFR si TU NS de lab lo permite. -sV TCP no cubre UDP. AXFR a un DNS público no está en tu alcance. community 'public' es default de lab, no root Windows."
    ),
    S(
      "El examen mezcla géneros",
      "Un día INE no es 'solo redes'. Web + SMB + un concepto de pivot. Tú eres el DJ: no dejes un género. LHOST sigue importando. UDP hay que pedirlo. MITM a humanos sigue prohibido aunque 'haya racha'."
    ),
  ],
  8: [
    S(
      "Privesc es un mapa, no un exploit del año",
      "Linux: sudo -l, SUID, cron, capabilities, creds en ficheros, kernel (último, no primero). LinPEAS/LinEnum clasifican señales; tú eliges el vector. Windows: unquoted paths, servicios, AlwaysInstallElevated, tokens — modelo mental si no hay VM Windows. GTFOBins une 'sudo vim' con el how. No | bash desde un foro raro. No corras LinPEAS en tu Kali host 'por práctica'."
    ),
    S(
      "Cron y PATH es confused deputy",
      "Un script writable que root ejecuta por cron, o un binario en un PATH que root recorre, es el patrón. Escribes o sustituyes en lab. No es 'CVE trending'. Si no hay writable, no inventes. El examen pregunta el porqué (quién ejecuta qué con qué permisos)."
    ),
    S(
      "Loot es lo que el cuestionario pide",
      "Users, hashes, flags, versiones, contenidos de ficheros. eJPT no pide un reporte narrativo de 20 páginas: pide respuestas cortas. hashdump es Windows. /etc/shadow denied es hallazgo Linux. Anota durante, no 'después cuando recuerde'. CyberChef si un encoding te miente."
    ),
    S(
      "Cuándo NO hacer privesc",
      "Cuando la pregunta ya se responde con user. Cuando el reloj duele y tienes otra caja. Cuando no hay vector y estás googleando kernel a ciegas. Parar es skill. El Mes 2 se cierra con honestidad de ritmo, no con un root de mentira."
    ),
    S(
      "Cierre de mitad de plan",
      "¿Ping estable? ¿Tres herramientas sin mezclar? ¿Cadena msf una vez? ¿DVWA tocado? ¿Notas que sirven para un cuestionario? Si no, remedia. El simulacro #2 mezcla todo. No es el momento de BloodHound en un AD imaginario."
    ),
  ],
  9: [
    S(
      "Una máquina completa es un reloj con alcance",
      "Brief → vivos → puertos → versiones → UNA superficie → enum → match → acceso → loot de las preguntas. 80 y 445 juntos no significan 'haz los dos a la vez': prioriza, cierra una, pasa a la otra. Segunda máquina: mismas reglas, otro RHOST. El método tiene que sobrevivir al aburrimiento."
    ),
    S(
      "Atasco no es 'más tools'",
      "I'M STUCK de la app pide evidencia: IP, puertos, qué probaste. Las pistas van de concepto a comando. Un write-up de HTB no es tu lab. Nuclei/httpx a escala son RABBIT: útiles si tienes varias IPs de lab, overkill si tienes un HTTP. No nuclei-a-Internet."
    ),
    S(
      "Exam Reasoning: metodología sin teclear",
      "Te ponen un output y preguntan next step. La respuesta es la fase correcta, no el flag más largo. Practica en papel: 445 → SMB; 80 → HTTP; sin user → no Hydra. Esa skill entra al examen igual que un meterpreter."
    ),
    S(
      "Cadenas bajo tiempo",
      "40–90 min por caja de lab, no 8 h de rabbit. Snapshot. Notas. Si se acaba el tiempo, documenta lo que SÍ tienes: a veces basta para tres preguntas. Completar 70% de preguntas > root sin notas."
    ),
    S(
      "Otras víctimas, mismo aislamiento",
      "Kioptrix, MS3, VulnHub que TÚ importaste: Host-Only. IPPSec es índice de patrones, no permiso para atacar la box del vídeo en producción. Extrae el patrón (vhost, SQLi, privesc), no veas 2 h enteras el día de cadena."
    ),
  ],
  10: [
    S(
      "eJPT pregunta valores, no ensayos",
      "¿Versión del servicio en 21? ¿hash NTLM del user X? ¿nombre del share? Pregunta → evidencia → respuesta corta. Reescribir hallazgos así es el entrenamiento. Un párrafo bonito no puntúa. Un hash mal copiado es error de canal: CyberChef, hex, base64, espacios."
    ),
    S(
      "Notas durante, no después",
      "Durante: IP, puerto, versión, user, path, comando que funcionó. Después: limpia para el formato pregunta/respuesta. Si dejas 'después', el examen te come. Plantilla de 8 líneas > Notion barroco. Inglés de examen: service version, open share, local file inclusion — las frases salen en el brief."
    ),
    S(
      "Evidencia mínima por fase",
      "Recon: CIDR y vivos. Enum: puertos y versiones. Exploit: módulo/vector y por qué match. Access: uid y SO. Post: el valor que pedirán. Si una fase no tiene una línea, esa fase no ocurrió para el cuestionario."
    ),
    S(
      "Simulacro estilo reporting",
      "Te dan un output y debes extraer el string exacto. Mayúsculas, puntos, no 'casi'. Practica copiar de tu nmap real. El reporting es una skill de atención, no de pentest fancy."
    ),
    S(
      "Cierre",
      "Puedes tomar una máquina ya comprometida del lab y redactar 10 preguntas cortas como si fueras INE. Eso es el gym. No es escribir un PDF de consultora."
    ),
  ],
  11: [
    S(
      "Qué es eJPT de verdad",
      "Examen práctico de INE/eLearnSecurity: lab remoto, preguntas, tiempo limitado, Kali que TÚ llevas por VPN. No es OSCP. No es un PDF garantizado por esta web. INE decide. Aquí estudias método, isolation y ritmo. Expectativa honesta: si haces las jornadas y los labs, llegas con oficio; el día D sigue siendo un examen."
    ),
    S(
      "VPN, Kali y el día antes",
      "VPN del vendor, conectividad al rango del brief, herramientas ya en Kali (no instales el día D). Snapshot mental: LHOST será una IP de la VPN, no vboxnet. El músculo de 'medir LHOST' se transfiere. El día antes: dormir, no un kernel exploit nuevo. T-48: checklist, no contenido nuevo."
    ),
    S(
      "Tiempo en el lab de examen",
      "Triage: vivos, puertos jugosos, preguntas fáciles primero (versiones, shares). No te cases con una caja. Vuelve. Integridad: no dumps, no ayuda externa, no compartir el lab. Eso no es 'ética blanda': es el contrato que firmas."
    ),
    S(
      "Qué no hacer",
      "Capturas del examen en Discord. Payloads a redes fuera del brief. 'Un amigo me dice el next step'. Saltar el alcance porque 'es un lab'. Tu racha de 90 días no autoriza eso."
    ),
    S(
      "Plan T-48",
      "Repetir UNA cadena conocida en VirtualBox. 20 preguntas de reasoning. Revisar LHOST/VPN notes. Pack de teoría en el móvil por si viajas. Cerrar GitHub RABBIT. El hoyo el día antes es el enemigo, no la dificultad del eJPT."
    ),
  ],
  12: [
    S(
      "Huecos declarados: tools y Metasploit",
      "Gobuster/Hydra/enum4linux: tabla de semana 2 otra vez. Metasploit: search → options → LHOST vboxnet → session → sysinfo. Si fallas el flujo en papel, no es 'repasar web': es esa cadena en el guest. Web mínimo: SQLi detección, LFI passwd, XSS tipo. Una hora cada hueco, no 12 pestañas."
    ),
    S(
      "Simulacro final interno",
      "Mismas reglas que el full: tiempo, umbral, no repetir el mismo día si suspendes. Mezcla Mes 1+2+3. Las fallidas van a remediación, no a 'ya lo pillé'. Caja relámpago 40 min: una VM, notas, parar. Completar preguntas > root estético."
    ),
    S(
      "Después del trimestre",
      "eJPT no es el techo. awesome-pentest y secret-knowledge son mapas, no la próxima adicción. Elige UNA rama (web o interno) si sigues. BloodHound/AD es RABBIT consciente. El método (alcance, medir, una superficie, evidencia) es lo que se lleva a cualquier cert."
    ),
    S(
      "Cierre honesto",
      "Esta web no garantiza el PDF. Garantiza un plan, labs aislados, fuentes con timer y un flujo que puedes repetir. INE puntúa el lab de ellos. Tú puntúas si hiciste las jornadas o solo las hojeaste. Esa diferencia es el oficio."
    ),
    S(
      "Última cadena",
      "MS2 o la VM que tengas: discovery → enum → un vector match → loot en formato pregunta. Cierra el repo de GitHub. Cierra YouTube. El examen es un mezclador. Tú ya conoces las pistas. Ejecuta."
    ),
  ],
};

export function theoryForWeek(week: number): CourseSection[] {
  return WEEK_THEORY[week] ?? [];
}

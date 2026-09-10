import { CourseExample, CourseExampleStep, CourseLesson } from "@/content/course/types";

function st(doWhat: string, why: string): CourseExampleStep {
  return { do: doWhat, why };
}

function ex(title: string, scene: string, steps: CourseExampleStep[], expected: string, stop: string): CourseExample {
  return { title, scene, steps, expected, stop };
}

const VBOX =
  "Kali es el SO de tu PC (atacante). La víctima corre en VirtualBox, NIC en Host-Only (vboxnet). Nunca Bridged ni la Wi‑Fi de casa.";

/** Ejemplos guiados por lección: se siguen ANTES de tu práctica. */
export const LESSON_EXAMPLES: Record<string, CourseExample[]> = {
  "c00-d1": [
    ex(
      "Ejemplo 1 — Inventario de un laboratorio correcto",
      "Acabas de instalar Kali en tu ordenador y VirtualBox. Todavía no vas a escanear a nadie. Solo quieres tener claro quién es quién, como en un croquis.",
      [
        st(
          "En un papel escribe tres líneas: Atacante = Kali (tu PC). Hipervisor = VirtualBox (el programa). Víctimas = las máquinas que importarás (aún ninguna).",
          "Si mezclas estos roles, más adelante no sabrás qué IP es tuya. Las guías hablarán de LHOST y no coincidirán con tu pantalla."
        ),
        st(
          "Abre VirtualBox → Archivo / File → Herramientas de red (Host Network Manager) y mira si existe una red tipo vboxnet0.",
          "Esa red es el 'cuarto cerrado' entre Kali y las víctimas. Si no existe, se crea en el laboratorio. No uses Bridged para 'arreglarlo'."
        ),
        st(
          "Escribe una frase de alcance: Hoy solo toco máquinas virtuales que yo importé.",
          "Una IP privada no da permiso. El router de casa y el portátil de otra persona no entran. Si no puedes nombrar al dueño, no escaneas."
        ),
      ],
      "explicar en tres líneas quién ataca, quién es el programa de las VMs, y qué tienes permiso de tocar. Cero paquetes a la red de casa.",
      "No lances nmap contra 192.168.1.0/24 de tu Wi‑Fi 'a ver si funciona'. Eso no es práctica: es escanear tu casa."
    ),
    ex(
      "Ejemplo 2 — Por qué no usamos Bridged",
      "En Internet verás recetas que ponen la máquina vulnerable en el mismo Wi‑Fi que tu casa, 'para que se parezca a una red real'. Vamos a ver por qué en este curso no lo hacemos, con un dibujo.",
      [
        st(
          "Dibuja el salón de tu casa: el router, un móvil, una impresora y, si usas Bridged, Metasploitable 2 sentada ahí como un aparato más.",
          "Metasploitable está diseñada para romperse a propósito. Bridged la pone al alcance de todo lo que hay en tu Wi‑Fi. No es realismo: es dejar una puerta abierta en el salón."
        ),
        st(
          "Ahora dibuja el otro esquema: un cuarto cerrado (Host-Only). Dentro solo están Kali (tú) y las víctimas. El ataque no sale a Internet ni entra desde el vecino.",
          "Host-Only es un switch privado. Kali y la VM se ven entre sí. Tu familia no forma parte de esa red. Ese es el laboratorio de este plan."
        ),
        st(
          "Elige el segundo dibujo y déjalo escrito: el ataque de hoy va por Host-Only.",
          "Si mezclas Bridged 'un rato' y Host-Only 'cuando me acuerde', cada reverse shell y cada captura de red te mentirán: estarás mirando la NIC equivocada."
        ),
      ],
      "decir en una frase, con tus palabras, por qué Host-Only y no Bridged.",
      "No lo dejes para después. El modo de red se decide hoy. Si la VM ya está en Bridged, cámbiala a Host-Only antes de nmap."
    ),
  ],
  "c00-d2": [
    ex(
      "Ejemplo 1 — Medir LHOST de verdad",
      VBOX + " Aún no recuerdas 192.168.56.1 de un blog.",
      [
        st("En Kali: ip addr | less y busca vboxnet0 (o similar).", "La IP que ves AHÍ es LHOST para reverse shells del lab."),
        st("ip route y marca la línea del /24 de ese vboxnet.", "Ahí está el CIDR que usarás en nmap -sn, no 10.0.0.0/8."),
        st("Copia ambas cosas a ~/ejpt-lab.txt o papel.", "El examen y Metasploit te preguntarán este número. No lo memorices de un vídeo."),
      ],
      "Un fichero con: interfaz, IP Kali lab, CIDR.",
      "127.0.0.1 no es LHOST útil para un guest. wlan0 no es la NIC del lab Host-Only."
    ),
    ex(
      "Ejemplo 2 — Ping que sí y ping que no",
      "El guest ya tiene IP en el mismo /24 (o aún no).",
      [
        st("ping -c 2 8.8.8.8 en Kali.", "Esto solo dice que el HOST tiene Internet. No dice nada de MS2."),
        st("Si el guest tiene IP: ping -c 2 <IP_guest>.", "Esto sí prueba la LAN de ataque."),
        st("Si no hay IP en el guest: no sigas a nmap; capa 3 primero (DHCP o estático mismo /24).", "Sin RHOST no hay pentest. searchsploit no crea IPs."),
      ],
      "Sabes qué pregunta responde cada ping.",
      "No diagnostiques el lab con 'tengo Internet, luego MS2 está bien'."
    ),
  ],
  "c00-d3": [
    ex(
      "Ejemplo 1 — Importar MS2 sin exponerla",
      "Tienes el .ova de Metasploitable 2 (Rapid7). VirtualBox abierto.",
      [
        st("Archivo → Importar. Tras importar: Ajustes → Red → Adaptador 1 = Host-Only Adapter (vboxnet0).", "Si dejas Bridged, la víctima sale a tu Wi‑Fi."),
        st("Snapshot 'limpia' antes del primer ataque.", "El examen INE no te da snapshot; el lab sí. Úsalo."),
        st("Arranca, login consola msfadmin/msfadmin, corre ifconfig o ip addr, anota la IP.", "Eso es administración local, no 'ya exploté el box'."),
      ],
      "Guest en Host-Only, snapshot hecho, IP anotada.",
      "No parchees MS2 'para dejarla segura': perderías los servicios que quieres enumerar."
    ),
    ex(
      "Ejemplo 2 — Consola vs pentest por red",
      "Estás logueado en la consola de VirtualBox como msfadmin.",
      [
        st("Eso prueba que el hipervisor te deja administrar la VM.", "No es initial access de un exploit ni una sesión de Metasploit."),
        st("Desde Kali: ping a la IP que anotaste.", "Ahí empieza el pentest: Kali ve al guest por vboxnet."),
        st("Si ping falla: NIC, /24, VM encendida — no Hydra.", "El login de consola no sustituye conectividad."),
      ],
      "Puedes decir en voz alta la diferencia consola vs red.",
      "No trates msfadmin/msfadmin como 'flag de eJPT'."
    ),
  ],
  "c00-d4": [
    ex(
      "Ejemplo 1 — Discovery solo de TU /24",
      "Tienes el CIDR de vboxnet en ~/ejpt-lab.txt. Guest encendido.",
      [
        st("nmap -sn <CIDR_HOSTONLY> -oN ~/lab/disc.txt", "-sn pregunta quién está vivo. No lista 80 ni 445."),
        st("Marca en el output cuál IP es Kali (vboxnet) y cuál el guest.", "No ataques tu propia IP ni 127.0.0.1 como RHOST."),
        st("Si el guest no sale: VM, NIC, ping, IP — no 'Nmap está roto'.", "Silencio es diagnóstico de lab."),
      ],
      "Un archivo con vivos y dos IPs etiquetadas.",
      "No uses 192.168.1.0/24 de casa. No lances -p- si el discovery falló."
    ),
    ex(
      "Ejemplo 2 — Qué no concluye -sn",
      "El output muestra 2 hosts up.",
      [
        st("Escribe: 'sé que hay 2 IPs vivas. No sé puertos.'", "Tratar discovery como enum de servicios salta la mitad del método."),
        st("El siguiente movimiento (otra clase) será port scan a UN RHOST.", "El brief de eJPT te da un rango: primero vivos, no el universo."),
        st("Guarda disc.txt. No confíes en la memoria.", "El examen pide valores exactos."),
      ],
      "Una frase honesta: vivos ≠ servicios.",
      "No abras Metasploit porque viste '2 hosts up'."
    ),
  ],
  "c00-d5": [
    ex(
      "Ejemplo 1 — Linux mínimo en Kali",
      "Terminal en tu home.",
      [
        st("pwd ; ls -la / | head", "pwd es dónde estás. ls -la enseña permisos; los vas a leer en loot."),
        st("cat /etc/shadow", "Esperado: Permission denied. El archivo EXISTE. Denied es hallazgo, no 404."),
        st("ls -l /usr/bin/passwd y busca una 's' en execute (SUID).", "Hoy solo reconoces el bit. No descargas un kernel exploit."),
      ],
      "Distingues denied vs no such file. Sabes qué es SUID de vista.",
      "No corras scripts de privesc en TU Kali host 'para ver'."
    ),
    ex(
      "Ejemplo 2 — En la consola de MS2 (opcional)",
      "Login msfadmin en la VM, mismo /24.",
      [
        st("ls -la /home", "Usuarios con home son pistas, no root."),
        st("cat /etc/passwd | cut -d: -f1 | head", "passwd suele ser legible; shadow no. Eso es el modelo."),
        st("Vuelve a Kali. El pentest por red no necesita esta consola.", "No mezcles hipervisor y exploit."),
      ],
      "Has caminado el FS de la víctima sin 'hackearla'.",
      "2>/dev/null oculta stderr; no es un exploit. Úsalo al enumerar, no para esconder errores que debías leer."
    ),
  ],
  "c00-d6": [
    ex(
      "Ejemplo 1 — Salud del lab antes de Mes 1",
      "Cierre de semana 0.",
      [
        st("Ping guest OK. Snapshot 'limpia' existe. LHOST escrito en papel.", "Si ping falla, no pases a Nmap profundo."),
        st("Si ya tienes DVWA en Docker: abre http://127.0.0.1:4280 (o el puerto de /laboratorio).", "Solo localhost. No publiques el contenedor."),
        st("Anota: herramientas ofensivas viven en Kali, no las instalas dentro de MS2.", "Atacante ≠ víctima."),
      ],
      "Checklist verde o un único bloqueo de red por resolver.",
      "Esta web no garantiza el eJPT. INE decide. Hoy cierras el campo de tiro."
    ),
    ex(
      "Ejemplo 2 — Ritmo de las 78 jornadas",
      "Ves el índice de /clase y quieres leerlo todo.",
      [
        st("Una jornada = teoría + examen corto + ejemplos + TU lab + GitHub.", "No son 15 minutos. Reserva el día o parte larga del día."),
        st("Día 7: descanso o repetición. No 'adelantar semana 4'.", "TDAH: recuperar. El contenido no se caduca."),
        st("GitHub se abre con timer, no con 40 pestañas.", "El lab manda; el repo es munición."),
      ],
      "Sabes que esta clase cierra semana 0, no el trimestre.",
      "No instales 15 tools nuevas hoy. Kali ya trae nmap, msf, gobuster, hydra."
    ),
  ],
  "c01-d1": [
    ex(
      "Ejemplo 1 — Alcance en una hoja",
      VBOX,
      [
        st("Columna pasivo: lo que el brief o tus notas ya dicen (CIDR, nombres de VM).", "No envías paquetes."),
        st("Columna activo: nmap, ping, curl al guest.", "Solo ese CIDR. La Wi‑Fi de casa no entra."),
        st("Escribe la regla 'no Wi‑Fi casa' y el CIDR de vboxnet.", "Si el discovery de semana 0 falló, no lances tools nuevas: arregla el lab."),
      ],
      "Un brief de 6 líneas de TU lab.",
      "OSINT de Google no sustituye nmap en el lab eJPT."
    ),
    ex(
      "Ejemplo 2 — Capas de recon",
      "Alguien dice 'ya hice recon' y abre msf.",
      [
        st("Pregunta 1: ¿quién está vivo? (-sn)", "Discovery."),
        st("Pregunta 2: ¿qué puertos? (top 1000 o -p- en UN host)", "Port scan."),
        st("Pregunta 3: ¿qué versión? (-sV) ¿qué dice NSE default? (-sC)", "Todavía no es exploit."),
      ],
      "Cuatro capas nombradas. Exploit no es una de ellas.",
      "Anotar IPs no es decoración: el examen pide valores exactos."
    ),
  ],
  "c01-d2": [
    ex(
      "Ejemplo 1 — Top 1000 al guest",
      "RHOST = IP del guest que marcaste en -sn.",
      [
        st("nmap -sV <RHOST> -oN ~/lab/ms2-top.txt", "Sin -p cubre ~1000 comunes, no 65535."),
        st("Si el brief (o tu curiosidad de lab) huele a puerto alto: nmap -p- --min-rate razonable SOLO a ese RHOST.", "-p- a un /24 entero te come el examen."),
        st("Anota open/closed/filtered. open ≠ vulnerable.", "filtered = no sabes (drop/firewall)."),
      ],
      "Un output con estados, no una lista de CVEs.",
      "No lances -sU todavía salvo que esta jornada lo pida. UDP es otro mundo."
    ),
    ex(
      "Ejemplo 2 — 161/udp no sale en el SYN",
      "Ves 22,80,445 y concluyes 'no hay SNMP'.",
      [
        st("Recuerda: el scan típico es TCP.", "SNMP 161 y DNS 53 UDP no aparecen igual."),
        st("Si el brief o un servicio lo pide: nmap -sU -p 53,161 <RHOST> en lab.", "Lento. No lo hagas al /16."),
        st("Anota 'TCP hecho; UDP aparte'.", "Así no mientes en el examen cuando pregunten SNMP."),
      ],
      "Separaste TCP y UDP en la cabeza.",
      "No asumas 'ya escaneé todo' porque viste 80."
    ),
  ],
  "c01-d3": [
    ex(
      "Ejemplo 1 — Version scan con evidencia",
      "Mismo RHOST de ayer.",
      [
        st("nmap -sV -sC -oN ~/lab/ms2-sv.txt <RHOST>", "-sV habla con el servicio. -sC es NSE default, no un exploit pack."),
        st("Resalta 3 líneas VERSION (ej. vsftpd, Apache, Samba).", "'80 open http' no elige módulo; la versión sí acota."),
        st("Lee http-title / ssh / smb si salen. No lances --script vuln hoy.", "Un banner puede mentir; igual es tu mejor pista."),
      ],
      "Tres versiones anotadas y un archivo -oN.",
      "No abras searchsploit todavía si vas por el ritmo; el puente es la versión, no el exploit."
    ),
    ex(
      "Ejemplo 2 — Por qué -oN te salva el reloj",
      "Repites el mismo nmap porque 'no me acordaba'.",
      [
        st("Abre ms2-sv.txt en vez de reescanear.", "El examen pide valores exactos; el archivo es tu memoria."),
        st("Copia una línea de versión a tu plantilla de notas.", "INE no recoge el fichero; tú sí necesitas el string."),
        st("Si VERSION falta, el siguiente movimiento es -sV, no msf.", "Identificar ≠ explotar."),
      ],
      "Usas el archivo como evidencia, no como adorno.",
      "No borres outputs 'para tener la carpeta limpia' el día de práctica."
    ),
  ],
  "c01-d4": [
    ex(
      "Ejemplo 1 — Comparar -sT y default",
      "RHOST vivo. Eres root en Kali (típico).",
      [
        st("nmap -sT -p 22,80,445 <RHOST> y anota tiempo y estados.", "-sT completa el handshake (connect). Más ruidoso en logs."),
        st("nmap -p 22,80,445 <RHOST> (default suele ser -sS si hay raw sockets).", "-sS no completa: SYN scan."),
        st("Escribe: ping OK no implica HTTP up.", "ICMP ≠ TCP/80."),
      ],
      "Sabes qué paquete envía cada flag.",
      "filtered no significa vulnerable ni 'cerrado y ya'."
    ),
    ex(
      "Ejemplo 2 — Dibujo del handshake",
      "Papel. Tres flechas.",
      [
        st("Tú → SYN. Guest → SYN-ACK. Tú → ACK.", "Servicios eJPT típicos (22,80,445,21) son TCP. Reverse shells también."),
        st("Marca dónde se corta un -sS (no hay ACK final de datos de aplicación).", "Por eso es 'half-open'."),
        st("Si un reverse 'no nace', el handshake hacia LHOST de vboxnet es lo que debes imaginar.", "No hacia wlan0."),
      ],
      "Un dibujo que puedes rehacer en 20 segundos.",
      "No uses Scapy contra nada fuera del guest Host-Only."
    ),
  ],
  "c01-d5": [
    ex(
      "Ejemplo 1 — Leer -sC, no lanzar vuln",
      "Ya tienes ms2-sv.txt con -sC.",
      [
        st("Relee http-title, smb, ssh-hostkey si existen.", "NSE default es lupa de descubrimiento."),
        st("Si 445 está open, anota 'familia smb-* más adelante, sigue siendo enum'.", "No es shell."),
        st("No lances --script vuln masivo hoy.", "Puede ser ruidoso o inestable. safe/default primero."),
      ],
      "Tres hallazgos de script leídos, cero categoría vuln.",
      "Gobuster no es NSE http. Hydra no es NSE brute obligatorio. El puerto elige la familia."
    ),
    ex(
      "Ejemplo 2 — Categorías en una frase",
      "Alguien memoriza 400 nombres de script.",
      [
        st("Escribe: discovery / auth / brute / vuln.", "eJPT pregunta interpretación, no el catálogo."),
        st("Un ejemplo smb y un ejemplo http bastan como ancla.", "El resto es ruido intelectual."),
        st("Timer si abres nmap/nmap en GitHub: docs, no el árbol entero.", "NSE es Lua sobre sockets. Categorías > 400 nombres."),
      ],
      "Cuatro categorías y un ejemplo cada una de smb/http.",
      "NSE no te da root solo. -A no es 'aprobar'."
    ),
  ],
  "c01-d6": [
    ex(
      "Ejemplo 1 — Informe de 8 líneas de TU nmap",
      "Abre ms2-sv.txt real.",
      [
        st("Lista puertos open. Prioriza: 21,80,445,22 según lo que tengas.", "No Hydra al primer open."),
        st("Elige UNA superficie para enum profundo (TDAH).", "Varios open ≠ un único vector."),
        st("Escribe 1 herramienta de esa familia y 1 cosa que NO harás (Hydra ciego / Bridged / casa).", "Interpretar es la nota."),
      ],
      "Ocho líneas que un extraño entendería.",
      "Si no hay VERSION, el next step puede ser -sV, no msf."
    ),
    ex(
      "Ejemplo 2 — What next como en examen",
      "Output de práctica: 22,80,445 open.",
      [
        st("445 → familia SMB (enum4linux/smbclient), no Gobuster.", "Puerto manda."),
        st("80 → HTTP (curl/Gobuster), no enum4linux.", "Misma regla."),
        st("22 sin user → banner/enum users en otros servicios, no Hydra ya.", "Dos ejes combinatorios."),
      ],
      "Tres next-steps correctos en papel.",
      "Exploits aleatorios tras nmap sin -sV son mala metodología."
    ),
  ],
  "c02-d1": [
    ex(
      "Ejemplo 1 — enum4linux al guest",
      "445 open en TU -sV. RHOST de vboxnet.",
      [
        st("enum4linux -a <RHOST> | tee ~/lab/smb.txt", "Wrapper SMB/unix-like. -a es el martillo. Solo TU 445."),
        st("Anota users y shares. No lances Hydra.", "Users son munición para después, no una orden de brute al /24."),
        st("Si falla: baja una capa (smbclient -L). No abras 3 tools a medias.", "TDAH: una y termínala."),
      ],
      "smb.txt con users/shares o un error entendido.",
      "Gobuster contra 445 es el error de esta semana. No lo cometas 'a ver'."
    ),
    ex(
      "Ejemplo 2 — Null session como idea",
      "MS2 clásico a veces lista sin password.",
      [
        st("Eso es enum, no shell.", "Primero enum, luego (si acaso) un módulo Samba que coincida con -sV."),
        st("No es HTTP. No hay 'directorios' SMB con Gobuster.", "SMB habla de discos y a veces políticas."),
        st("hashdump SAM no aplica a MS2 Linux.", "Otro SO, otro modelo. Mes 2-3."),
      ],
      "Null session nombrado como enum.",
      "No explotes Samba de memoria sin versión."
    ),
  ],
  "c02-d2": [
    ex(
      "Ejemplo 1 — Listar y entrar a un share",
      "Mismo RHOST. Users de ayer o anonymous.",
      [
        st("smbclient -L //<RHOST> -N", "Lista shares. -N null/anon. Ajusta si enumeraste user."),
        st("Si hay share: smbclient //<RHOST>/<share> y ls / get de un .txt", "El examen pregunta contenidos. get + leer > 'hay un share'."),
        st("smbmap -H <RHOST> si quieres vista READ/WRITE.", "WRITE en lab puede ser vector; solo TU VM."),
      ],
      "Un fichero de texto leído desde el share, o nota de por qué no hubo acceso.",
      "No drops a redes ajenas. No mezcles SAM Windows aquí."
    ),
    ex(
      "Ejemplo 2 — Una tool a fondo",
      "Tienes enum4linux, smbclient y smbmap abiertos.",
      [
        st("Cierra dos. Termina una.", "Tres a medias es el fallo TDAH de enum."),
        st("Anota permisos en una tabla de 3 columnas: share / read / write.", "smbmap prioriza; enum4linux lista."),
        st("Para.", "Mañana Gobuster. Hoy SMB."),
      ],
      "Una herramienta cerrada con nota.",
      "No pases a Hydra porque 'ya viste users' sin haber leído un share."
    ),
  ],
  "c02-d3": [
    ex(
      "Ejemplo 1 — Gobuster dir al HTTP del guest",
      "80 o 443 open. URL http://<RHOST>/.",
      [
        st("gobuster dir -u http://<RHOST>/ -w /usr/share/wordlists/dirb/common.txt", "Brute de rutas, no de passwords. Solo HTTP de TU lab."),
        st("Anota 200 y 403. 403 = existe.", "No trates 403 como 404."),
        st("Abre los 200 en el navegador del lab (no Internet).", "El título a veces vale más que el path."),
      ],
      "Lista de paths con código. Al menos un 200 visitado.",
      "Si solo tienes 22 open, Gobuster no es el siguiente paso."
    ),
    ex(
      "Ejemplo 2 — Wordlist y reloj",
      "Alguien sugiere rockyou o una lista de 80 millones para dirs.",
      [
        st("Empieza common. Extensiones .php si el stack huele a PHP.", "En examen el reloj duele."),
        st("SecLists Discovery/Web-Content es el sitio si necesitas otra lista corta.", "Elegir lista = hipótesis, no 'más grande = mejor'."),
        st("Modo dir hoy. vhost/dns otro día.", "Una tool de dirs. No cambies a dirsearch hoy si ya fluye Gobuster."),
      ],
      "Una wordlist razonable y un comando que puedes reescribir de memoria.",
      "Gobuster no habla SMB ni SSH."
    ),
  ],
  "c02-d4": [
    ex(
      "Ejemplo 1 — Preparar Hydra SIN lanzarlo a ciegas",
      "Tienes 1 username de SMB. 22 open. Lab Host-Only.",
      [
        st("Copia el username a un fichero users.txt de una línea.", "Sin user estás adivinando dos ejes."),
        st("Escribe (en papel) el comando hydra ssh con ESE user y una wordlist recortada.", "Lockouts existen. En examen sé conservador."),
        st("Ejecuta solo si enumeraste user y es TU guest. Si no, deja el comando escrito.", "La disciplina de no brute-ciego aprueba más que el crack."),
      ],
      "Un comando con user conocido, no un /24.",
      "Hydra al SSH de un amigo o al router de casa no es práctica eJPT. 80 open sin form ≠ Hydra."
    ),
    ex(
      "Ejemplo 2 — Gobuster no es Hydra",
      "El hueco declarado: mezclarlos.",
      [
        st("Gobuster: espacio de nombres HTTP (rutas).", "Status code es el oráculo."),
        st("Hydra: credenciales de un servicio de login.", "User × pass. Por eso el user de SMB primero es información."),
        st("Dibuja dos cajas. No las fusiones nunca más.", "Puerto 22 sin user ≠ Hydra primero."),
      ],
      "Dos frases que puedes recitar.",
      "http-form requiere un formulario real, no 'hay un 80'."
    ),
  ],
  "c02-d5": [
    ex(
      "Ejemplo 1 — Decision drill 21,22,80,445",
      "Papel. Output inventado o el tuyo.",
      [
        st("445 → enum4linux/smbclient primero (users/shares).", "SMB."),
        st("80 → curl/Gobuster (rutas).", "HTTP. Sin form, no Hydra."),
        st("21 → FTP anon/banner. 22 → SSH solo si ya hay user (entonces Hydra puede entrar en cola).", "Orden: enum más, brute menos."),
      ],
      "Prioridad 1-2-3 escrita. Compárala con /train/decisions.",
      "Cinco brutes en paralelo: ruido y cero cierre. La herramienta favorita no manda."
    ),
    ex(
      "Ejemplo 2 — Errores clásicos tachados",
      "Lista prohibida del día.",
      [
        st("Tacha: Gobuster a 445. Hydra a 80 sin login. enum4linux a http://.", "Cada uno es familia equivocada."),
        st("Tacha: msfsearch antes de leer nmap.", "Identificar primero."),
        st("Deja una regla: si dudas, enum más, brute menos.", "What next en examen es metodología."),
      ],
      "La tabla está en tu cabeza, no solo en la app.",
      "Repite esta jornada mañana si aún mezclas las tres. No pases de largo."
    ),
  ],
  "c02-d6": [
    ex(
      "Ejemplo 1 — FTP anonymous al guest",
      "21 open. RHOST lab.",
      [
        st("ftp <RHOST> y prueba anonymous (o user anonymous, pass vacío/guest según el banner).", "No es SMB. No es Gobuster."),
        st("Si entra: ls. get de un fichero de texto si hay.", "Loot. Reutilización de password hacia SSH es clásico de lab: pruébalo ordenado después."),
        st("Si no entra: anota el banner (versión) y sigue.", "Banner ≠ root."),
      ],
      "ls de FTP o un banner anotado.",
      "No Gobuster a 22. No 50 combinaciones mentales sin anotar."
    ),
    ex(
      "Ejemplo 2 — SSH como versión, no como brute",
      "22 open. Banner OpenSSH x.y.",
      [
        st("ssh -v o el banner de nmap: anota versión.", "Pista para searchsploit/msf más adelante, no Hydra automático."),
        st("Si tienes user de SMB y password de FTP, UNA prueba ordenada SSH en lab.", "Reutilización, no spray."),
        st("Si mezclaste Gobuster/Hydra/enum4linux esta semana: mañana d5 otra vez.", "El hueco se cierra por repetición."),
      ],
      "Versión SSH escrita. Cero dirbust a 22.",
      "ssh-audit a TU :22 de MS2 es enum de config, no 'hack'."
    ),
  ],
};

function fallbackExamples(l: CourseLesson): CourseExample[] {
  const steps = (l.labSteps.length ? l.labSteps : ["Relee la teoría de esta jornada", "Ejecuta el lab en TU guest Host-Only"]).map((s, i) =>
    st(s, i === 0 ? "Primero preparas o mides; no saltas al 'hack'." : "Cada paso responde una pregunta, no es teatro.")
  );
  return [
    ex(
      `Ejemplo guiado — ${l.labTitle}`,
      `${VBOX} Tema de hoy: ${l.titleEs}.`,
      steps,
      "Sales con una nota escrita (IP, puerto, hallazgo), no con 'creo que salió'.",
      "Si no hay ping al guest, para. Nunca Bridged ni Wi‑Fi de casa. Solo VMs tuyas, DVWA localhost o el VPN de INE el día del examen."
    ),
    ex(
      "Ejemplo 2 — Tú cierras sin el chuleta",
      "Tras seguir el ejemplo 1, tapa la pantalla de pasos.",
      [
        st("Reescribe el objetivo de la jornada en una frase.", "Si no puedes, relee teoría. No pases a 'más tools'."),
        st("Ejecuta de memoria el primer comando del lab en TU VirtualBox (o el equivalente de papel si hoy no aplica).", "La práctica es tuya. El ejemplo ya se vio."),
        st("Anota el resultado exacto (un string, un código, un no).", "El examen pide valores, no impresiones."),
      ],
      "Un resultado medible en tus notas.",
      "No copies payloads a redes ajenas. GitHub es munición con timer, no 40 pestañas."
    ),
  ];
}

export function examplesFor(l: CourseLesson): CourseExample[] {
  return LESSON_EXAMPLES[l.id] ?? fallbackExamples(l);
}

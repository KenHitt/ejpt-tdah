import { lesson, Q, S } from "@/content/course/helper";

export const W00 = [
  lesson(
    "c00-d1",
    0,
    1,
    "LAB",
    "Quién ataca y a quién (Kali vs VirtualBox)",
    16,
    "lab-vbox",
    [
      S(
        "El modelo de este plan",
        "Kali Linux es el sistema de TU PC: ahí viven nmap, Metasploit, Gobuster, Hydra. VirtualBox no es 'otro Kali': es el hipervisor donde corren las VMs VÍCTIMAS (Metasploitable 2, Kioptrix, etc.). Si mezclas 'instalar Kali en VBox y atacar desde Windows' con este plan, los LHOST y las capturas de interfaz no coincidirán con las guías."
      ),
      S(
        "Autorización es el primer comando",
        "Pentesting sin alcance escrito no es eJPT: es un delito. Aquí el alcance es: (1) VMs que TÚ importaste en Host-Only, (2) DVWA en localhost, (3) el rango VPN del examen INE el día que pagaste. La LAN de tu casa, el router del vecino y un VPS ajeno no entran. Si no puedes nombrar al dueño del target, no escaneas."
      ),
      S(
        "Por qué Host-Only y no Bridged",
        "Bridged pone la VM vulnerable en la misma red que tu Wi‑Fi. Metasploitable está diseñada para ser rota: no la ofrezcas a impresoras y móviles de la familia. Host-Only crea un switch virtual (vboxnet0) solo entre el host Kali y los guests. NAT sirve para que una VM descargue parches, no para que Kali la ataque como RHOST."
      ),
      S(
        "Qué debes poder decir al final de la clase",
        "Soy el atacante en Kali. La víctima es una VM. Nos vemos por vboxnet. No hay Internet en el camino del ataque. Si eso no es cierto en tu setup, para y corrige el laboratorio antes de nmap."
      ),
    ],
    [
      Q("¿Dónde debe correr Kali en ESTE plan?", ["Solo como VM Bridged", "Como SO del PC atacante", "Dentro de Metasploitable", "En el router de casa"], 1, "Kali = host atacante. VirtualBox = víctimas."),
      Q("¿Qué red usas para atacar MS2?", ["Bridged en Wi‑Fi pública", "Host-Only (vboxnet)", "Solo NAT hacia Internet", "No attached"], 1, "Host-Only aísla el lab."),
      Q("¿Puedes nmap 192.168.1.0/24 de casa 'por práctica'?", ["Sí, es privado", "No: no está autorizado", "Sí si es /24", "Solo los .1"], 1, "Privado ≠ autorizado."),
      Q("NAT en VirtualBox sirve sobre todo para…", ["Ser RHOST del examen", "Que el guest salga a Internet si lo necesitas", "Sustituir vboxnet", "Hacer reverse shells"], 1, "NAT ≠ red de ataque del lab."),
      Q("El examen eJPT te autoriza…", ["Toda Internet", "El rango/VPN que INE te da ese día", "La Wi‑Fi del café", "Cualquier AWS abierto"], 1, "Alcance = brief del examen."),
    ],
    "Inventario de alcance (sin escanear ajenos)",
    [
      "Anota en un bloc: SO atacante, hipervisor, nombre de cada VM víctima, modo de red de cada NIC",
      "Confirma que ninguna víctima está en Bridged",
      "Escribe una frase: 'Hoy solo ataco <nombres de VM> por Host-Only'",
    ],
    "Alcance claro = menos pánico el día del examen. Hoy no hace falta un exploit."
  ),
  lesson(
    "c00-d2",
    0,
    2,
    "LAB",
    "vboxnet, ip addr e ip route",
    16,
    "lab-vbox",
    [
      S(
        "LHOST no se memoriza de un blog",
        "Muchos tutoriales dicen 192.168.56.1. En tu Kali el host-only puede ser .1, .100 o otra. La verdad está en `ip addr` (interfaz vboxnet0 o similar) y `ip route` (ruta al /24 del lab). Si pones LHOST = IP de wlan0, el guest Host-Only no sabe cómo hablarte: el reverse muere en silencio."
      ),
      S(
        "Tres cajas en papel",
        "Caja 1: Kali. Caja 2: switch virtual. Caja 3: guest. La flecha de un reverse shell va de 3 hacia 1 por 2. Ping de 1 a 3 prueba esa LAN. Ping a 8.8.8.8 prueba Internet del host, no el lab. No uses el segundo para diagnosticar el primero."
      ),
      S(
        "DHCP vs estático",
        "VirtualBox puede dar DHCP en Host-Only. El host Kali suele tener IP estática en vboxnet. El guest MS2 antiguo a veces necesita ifconfig a mano en el mismo /24. Sin IP en el guest no hay RHOST. Eso no se arregla con searchsploit."
      ),
      S(
        "Loopback",
        "127.0.0.1 es el propio Kali. Nunca es RHOST de una VM. Nunca es LHOST útil para que un guest te devuelva una shell (el guest no es 'tú')."
      ),
    ],
    [
      Q("¿De dónde sacas LHOST en este lab?", ["Siempre 192.168.56.1", "ip addr en la NIC del lab (vboxnet)", "La IP pública del ISP", "127.0.0.1"], 1, "Mide, no copies tutoriales."),
      Q("Ping a 8.8.8.8 demuestra…", ["Que MS2 está up", "Que el host tiene Internet, no el lab", "Que 445 está open", "Que LHOST es correcto"], 1, "Otra red, otra pregunta."),
      Q("127.0.0.1 como RHOST de MS2 es…", ["Correcto en Host-Only", "Incorrecto: es loopback de Kali", "El default de msf", "Igual que vboxnet"], 1, "Loopback ≠ guest."),
      Q("Si el guest no tiene IP…", ["Lanzas Hydra", "Arreglas capa 3 (DHCP/estático mismo /24)", "Usas Gobuster", "Ignoras nmap"], 1, "Sin IP no hay pentest."),
      Q("ip route te sirve para…", ["Ver hashes", "Ver por qué interfaz sale cada red", "Brute SSH", "XSS"], 1, "Mapa de salidas."),
    ],
    "Medir tu LAN de lab",
    [
      "En Kali: ip addr y ip route. Copia la IP de vboxnet y el CIDR del lab",
      "Enciende el guest. Desde Kali: ping -c 2 <IP_guest> cuando la tengas",
      "Si no hay IP en el guest, asígnala en el mismo /24 (documenta el comando que usaste)",
    ],
    "Una IP medida vale más que diez payloads."
  ),
  lesson(
    "c00-d3",
    0,
    3,
    "LAB",
    "Metasploitable 2: importar y credenciales de consola",
    15,
    "lab-vbox",
    [
      S(
        "Qué es MS2",
        "Metasploitable 2 es una Ubuntu intencionalmente vulnerable (Rapid7). Existe para aprender el flujo recon→enum→exploit en un entorno cerrado. No es un servidor de producción. No la parchees 'para dejarla segura' si tu objetivo es practicar eJPT: perderías los servicios que quieres enumerar."
      ),
      S(
        "Consola vs red",
        "Login de consola típico: msfadmin / msfadmin. Eso no es 'ya exploté el box'. Es administración local para configurar red. El pentest empieza cuando Kali la ve por vboxnet y corres nmap. No confundas acceso de hipervisor con initial access de un exploit."
      ),
      S(
        "Snapshots",
        "Antes del primer nmap agresivo, snapshot. Si un brute o un módulo deja el guest inestable, vuelves atrás en minutos. El examen INE no te da snapshot; el lab sí. Úsalo."
      ),
      S(
        "Otras VMs del trimestre",
        "Kioptrix, DVWA (Docker en Kali), más adelante boxes VulnHub autorizadas. Misma regla de red. No mezcles 5 VMs Bridged el primer día."
      ),
    ],
    [
      Q("Credenciales típicas de consola MS2", ["root/toor", "msfadmin/msfadmin", "kali/kali", "admin/admin"], 1, "msfadmin / msfadmin."),
      Q("Login de consola significa…", ["Ya tienes meterpreter", "Puedes administrar la VM; el pentest por red es aparte", "SMB anónimo", "El examen está aprobado"], 1, "No mezcles hipervisor y exploit."),
      Q("¿Debes poner MS2 en Bridged?", ["Sí para más realismo", "No: Host-Only", "Da igual", "Solo NAT"], 1, "Aísla la víctima."),
      Q("Un snapshot sirve para…", ["Sustituir nmap", "Recuperar el lab si lo rompes", "Escanear casa", "LHOST"], 1, "Seguro de lab."),
      Q("MS2 está hecha para…", ["Internet banking", "Laboratorio ofensivo autorizado", "Router de casa", "DC de dominio real"], 1, "Lab, no producción."),
    ],
    "MS2 lista en Host-Only",
    [
      "Importa el .ova, NIC1 = Host-Only, snapshot 'limpia'",
      "Arranca, login consola msfadmin, anota ifconfig/ip",
      "Desde Kali ping a esa IP",
    ],
    "Caja lista. Mañana hay tráfico. Hoy hay higiene."
  ),
  lesson(
    "c00-d4",
    0,
    4,
    "LAB",
    "Primer host discovery (solo tu /24)",
    16,
    "nmap-basic",
    [
      S(
        "-sn no es un port scan",
        "`nmap -sn <CIDR>` pregunta quién está vivo. No lista 80/445. Si tratas el discovery como 'ya enumeré servicios', te saltas la mitad del método. En el lab: usa el CIDR de vboxnet que mediste ayer, no 10.0.0.0/8."
      ),
      S(
        "Qué anotar",
        "IP, y si sabes cuál es Kali (tú) vs guest. Nmap te listará ambos a menudo. No ataques 127.0.0.1 ni tu propia IP de vboxnet como RHOST."
      ),
      S(
        "Silencio",
        "Si -sn no ve al guest: apagado, mala NIC, firewall ICMP, IP distinta. Diagnóstico de lab, no 'Nmap está roto'. Revisa ping e ip addr otra vez."
      ),
      S(
        "eJPT",
        "El brief te da un rango. Discovery es el primer movimiento, no Hydra. El examen premia encontrar hosts que existen, no escanear el universo."
      ),
    ],
    [
      Q("nmap -sn hace…", ["Versiones de servicio", "Host discovery", "Exploit SMB", "Dirbust"], 1, "Vivos, no banners."),
      Q("El CIDR de -sn sale de…", ["Un tweet", "Tu ip route / brief autorizado", "Siempre /16", "8.8.8.8"], 1, "Alcance medido."),
      Q("¿-sn lista el puerto 445?", ["Sí", "No", "Solo en UDP", "Solo con -A"], 1, "Para eso -sV / -p."),
      Q("Si no ves al guest…", ["searchsploit nmap", "Revisas VM, NIC, ping, IP", "Hydra root", "Bridged"], 1, "Lab primero."),
      Q("¿Escaneas la Wi‑Fi de casa con -sn?", ["Sí", "No", "Solo de noche", "Si es WPA2"], 1, "No autorizado."),
    ],
    "nmap -sn en vboxnet",
    [
      "nmap -sn <TU_CIDR_HOSTONLY> y guarda el output",
      "Marca cuál IP es Kali y cuál es el guest",
      "No lances -p- todavía si el discovery falló",
    ],
    "Ver vivos es un resultado. No es poco."
  ),
  lesson(
    "c00-d5",
    0,
    5,
    "LINUX",
    "Linux mínimo del pentester (pwd, ls, permisos)",
    16,
    "linux-basic",
    [
      S(
        "Por qué Linux en eJPT",
        "La mayoría de shells y de MS2 son Linux. pwd / ls -la / cd / cat / grep / pipes no son 'relleno': son cómo lees loot y configs. Permission denied ≠ No such file. Denied significa que el objeto existe y tu uid no alcanza."
      ),
      S(
        "passwd vs shadow",
        "/etc/passwd suele ser legible (usuarios). /etc/shadow no, para un user normal. Eso no es un bug del lab: es el modelo de permisos. En post-ex, denied es hallazgo."
      ),
      S(
        "SUID (concepto)",
        "Un binario con bit SUID corre con el uid del dueño. Es un tema de privesc posterior. Hoy solo reconoce ls -l y la 's' en execute. No descargues un kernel exploit porque viste un bit."
      ),
      S(
        "Redirección",
        "2>/dev/null oculta stderr. Útil al enumerar. No es un exploit. 1> archivo guarda stdout."
      ),
    ],
    [
      Q("pwd muestra…", ["Procesos", "Directorio de trabajo actual", "Puertos", "Hashes"], 1, "Print working directory."),
      Q("Permission denied implica…", ["El archivo no existe", "Existe y no tienes permiso", "SSH caído", "Nmap mal"], 1, "Hallazgo, no 404 del FS."),
      Q("¿cat /etc/shadow como user normal suele…?", ["Mostrar hashes", "Denied", "Formatear el disco", "Abrir 445"], 1, "Esperado."),
      Q("2>/dev/null…", ["Borra el kernel", "Tira stderr a la nada", "Es SQLi", "Es LHOST"], 1, "Silenciar errores."),
      Q("SUID significa conceptualmente…", ["El archivo es un directorio", "El binario puede correr con uid del dueño", "UDP", "NAT"], 1, "Privesc más adelante."),
    ],
    "Navegar tu Kali y, si tienes shell local de MS2, el FS",
    [
      "En Kali: pwd, ls -la /, man ls (una página)",
      "Intenta cat /etc/shadow y anota el error",
      "Opcional en consola MS2: ls -la /home",
    ],
    "La shell es un barrio. Hoy aprendiste las calles."
  ),
  lesson(
    "c00-d6",
    0,
    6,
    "LAB",
    "Examen corto semana 0 + DVWA en local",
    18,
    "lab-vbox",
    [
      S(
        "Para qué DVWA",
        "Damn Vulnerable Web App en Docker (puerto local, p. ej. 4280) es tu dojo web: SQLi, XSS, LFI con security low. No es un target de Internet. No la publiques. Mes 2 vive aquí. Hoy solo compruebas que abre el login y anotas la URL localhost."
      ),
      S(
        "Kali ya tiene las herramientas",
        "No necesitas una distro 'más hacker'. nmap, gobuster, hydra, msfconsole vienen en Kali. Si un binario falta: apt en TU máquina, no en MS2."
      ),
      S(
        "Ritmo 3 meses",
        "6 clases cortas por semana + un examen de marcar + labs. Día 7: descanso o repetición. La disciplina es tuya; el contenido está en /clase. No leas las 78 clases hoy."
      ),
      S(
        "Cierre de semana 0",
        "Si ping al guest falla, no pases a Nmap profundo. El plan de 12 semanas asume lab vivo. Arregla eso como si fuera una pregunta del examen: sin conectividad no hay flags."
      ),
    ],
    [
      Q("DVWA en este plan corre en…", ["La Wi‑Fi del vecino", "localhost/Docker en Kali", "Bridged MS2", "8.8.8.8"], 1, "Local y autorizado."),
      Q("Si ping al guest falla, el siguiente paso es…", ["sqlmap", "Diagnosticar red/VM", "Hydra", "XSS"], 1, "Capa 3."),
      Q("¿Instalas herramientas ofensivas dentro de MS2 como hábito?", ["Sí siempre", "No: Kali es el atacante", "Solo Hydra", "Solo en Bridged"], 1, "Atacante ≠ víctima."),
      Q("El descanso semanal sirve para…", ["Escanear casa", "Consolidar, no sumar caos", "Bridged", "Saltar Mes 1"], 1, "TDAH: recuperar."),
      Q("¿Esta web garantiza el eJPT?", ["Sí", "No: INE decide; aquí estudias", "Si hay racha 90", "Si lees todo en un día"], 1, "Honestidad."),
    ],
    "Chequeo de salud del lab",
    [
      "Ping guest OK, snapshot existe, DVWA local abre (si ya lo tienes en /laboratorio)",
      "Anota LHOST medido en un papel que no vas a perder",
      "Marca esta clase y lanza el examen de la semana 0",
    ],
    "Semana 0 cerrada. El Mes 1 ya no es teoría abstracta: tienes un campo de tiro."
  ),
];

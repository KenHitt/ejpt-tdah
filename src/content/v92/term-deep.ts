import { AcademyTerm } from "@/content/v92/types";

/** Mini-lección al pulsar un término. Más que la frase de la tarjeta. */
export const TERM_DEEP: Record<string, Pick<AcademyTerm, "analogy" | "how" | "compare" | "example" | "mistake">> = {
  Kali: {
    analogy: "Kali es tu mesa de trabajo. Ahí escribes los comandos. No es la casa que vamos a 'romper' en el ejercicio.",
    how: "Enciendes tu PC con Kali. Abres una terminal. Desde esa terminal hablas con las máquinas de VirtualBox. No atacas desde Windows 'porque es más cómodo'.",
    compare: "Kali = atacante. VirtualBox = el programa que ejecuta las víctimas. Metasploitable = una víctima. Tres piezas distintas.",
    example: "Abres la terminal y escribes ping. Ese ping sale de Kali. Si Kali estuviera mal colocado (por ejemplo, solo dentro de una VM Bridged y tú en Windows), las guías de LHOST no coincidirían.",
    mistake: "Instalar Kali dentro de VirtualBox y atacar desde otro sistema, mezclando dos formas de laboratorio.",
  },
  VirtualBox: {
    analogy: "VirtualBox es como un edificio de oficinas en miniatura dentro de tu PC. Cada oficina es una máquina virtual (una víctima de práctica).",
    how: "Instalas VirtualBox. Importas un archivo .ova (por ejemplo Metasploitable). Arrancas esa máquina. La administras con la ventana de VirtualBox. El ataque, en cambio, lo lanzas desde Kali por la red Host-Only.",
    compare: "VirtualBox no es Kali. No es Internet. Es solo el hipervisor: el programa que finge ordenadores.",
    example: "Ves una ventana negra de Ubuntu viejo con login msfadmin. Eso es la consola de la VM, no 'ya hackeé el examen'.",
    mistake: "Poner esa VM en Bridged 'para que se sienta real' y dejarla junto al Wi‑Fi de casa.",
  },
  "Host-Only": {
    analogy:
      "Piensa en tu casa. El Wi‑Fi es el salón: móvil, impresora, portátil de alguien. Host-Only es un cuarto con llave. Solo entran dos: tú (Kali) y la máquina de práctica. El vecino no tiene esa llave. Internet no es ese cuarto.",
    how: "En VirtualBox creas (o usas) una red Host-Only, a menudo llamada vboxnet0. En la VM víctima: Ajustes → Red → Adaptador 1 = esa red Host-Only. En Kali, ip addr te muestra una IP de esa misma red. Ping de Kali a la IP de la víctima. Si hay respuesta, el cuarto está cerrado y comunicáis.",
    compare:
      "Host-Only: Kali ↔ víctima, sin ofrecer la víctima a tu Wi‑Fi. NAT: la víctima puede salir a Internet a través de tu PC (descargas), pero NAT no es 'la calle del ataque'. Bridged: la víctima se sienta en el mismo Wi‑Fi que tu familia, con una IP de esa red. En este plan el ataque usa Host-Only.",
    example:
      "Kali tiene 192.168.56.101 en vboxnet. La víctima tiene 192.168.56.102. ping -c 2 a .102 responde. Entonces nmap contra .102 es laboratorio. Si en cambio la víctima tiene 192.168.1.50 de tu router, estás en Bridged: mal para este plan.",
    mistake:
      "Copiar un vídeo que dice ' Bridged para que sea real'. Metasploitable está hecha para romperse. En el salón (tu Wi‑Fi) no es realismo: es riesgo. Tampoco uses el ping a 8.8.8.8 como prueba de que el lab está bien: eso solo dice que TU PC tiene Internet.",
  },
  NAT: {
    analogy: "NAT es como salir a la calle usando la puerta de tu casa: la VM pide Internet a través de Kali/el host. Los de fuera no entran fácil a esa VM.",
    how: "A veces una VM necesita descargar algo. NAT le da salida. El ataque de eJPT en este laboratorio no se hace 'por NAT contra Internet'. El ataque es Kali → Host-Only → víctima.",
    compare: "NAT = salida a Internet. Host-Only = red privada de práctica. Bridged = la VM en tu Wi‑Fi.",
    example: "Si un guest no tiene actualizaciones, puedes ponerle un adaptador NAT además del Host-Only. El RHOST del nmap sigue siendo la IP Host-Only.",
    mistake: "Creer que porque hay NAT ya puedes usar esa IP como RHOST del examen o del lab de ataque.",
  },
  Bridged: {
    analogy: "Bridged es sentar a la máquina vulnerable en el sofá del salón, con el mismo Wi‑Fi que el móvil y la impresora.",
    how: "VirtualBox le pide una IP al router de casa, como otro aparato más. Cualquier cosa en esa LAN podría verla. Y tú podrías nmapear, sin querer, otros dispositivos.",
    compare: "Bridged parece 'más real'. En este curso realismo = Host-Only bien medido, no mezclar una box diseñada para ser atacada con tu red doméstica.",
    example: "MS2 en Bridged podría recibir 192.168.1.40. Un nmap 192.168.1.0/24 ya no es 'solo MS2': es tu casa.",
    mistake: "Dejarlo 'ya lo cambio después'. El modo de red se decide el día 1.",
  },
  LHOST: {
    analogy: "LHOST es tu número de teléfono en la red de práctica: el que la víctima puede marcar para devolverte la llamada (reverse shell).",
    how: "En Kali: ip addr. Elige la interfaz del lab (vboxnet), no wlan0 ni 127.0.0.1. Ese número se pega en Metasploit o en el payload.",
    compare: "LHOST = tú. RHOST = la víctima. 127.0.0.1 = solo tu propia máquina.",
    example: "Guest 192.168.56.102. Kali en vboxnet 192.168.56.101. LHOST=192.168.56.101. Si pones LHOST=192.168.1.10 (Wi‑Fi), la víctima Host-Only no sabe cómo llegar.",
    mistake: "Copiar 192.168.56.1 de un blog sin mirar ip addr hoy.",
  },
  RHOST: {
    analogy: "RHOST es la dirección de la casa que estás autorizado a visitar: la VM víctima.",
    how: "En la consola de la VM: ip addr o ifconfig. Anotas esa IP. Es el objetivo de nmap, no 127.0.0.1.",
    compare: "Sin IP en el guest no hay RHOST. searchsploit no crea IPs.",
    example: "nmap -sn del /24 Host-Only. Distingues tu Kali de la víctima. Esa otra IP es RHOST.",
    mistake: "Usar 127.0.0.1 porque 'es local'. Local eres tú.",
  },
  nmap: {
    analogy: "Nmap es un cuestionario para una máquina: ¿estás encendida? ¿qué puertas tienes abiertas? ¿qué programa hay detrás?",
    how: "Cada flag es una pregunta. -sn = ¿quién está vivo? -p / default = ¿qué puertos? -sV = ¿qué versión? No lances todas a la vez el primer minuto.",
    compare: "Open = hay alguien escuchando. No es lo mismo que 'puedo entrar'.",
    example: "nmap -sV 192.168.56.102. Lees 22/ssh, 80/http, 445/smb. Eso decide el siguiente paso, no un exploit al azar.",
    mistake: "Tratar el dibujo ASCII de Nmap como la nota. La nota es interpretar el output.",
  },
  SMB: {
    analogy: "SMB es la carpeta compartida de una oficina en red. No es una página web.",
    how: "Si Nmap dice 445 open, usas herramientas de SMB (smbclient, enum4linux), no Gobuster.",
    compare: "445/139 → archivos y usuarios. 80 → páginas y rutas.",
    example: "smbclient -L //IP -N puede listar shares. ACCESS DENIED también es información.",
    mistake: "Dirbustear el puerto 445 como si fuera HTTP.",
  },
};

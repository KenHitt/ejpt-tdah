import { CourseExample } from "@/content/course/types";
import { LESSON_EXAMPLES as A } from "@/content/course/ample-examples";

function st(doWhat: string, why: string) {
  return { do: doWhat, why };
}
function ex(title: string, scene: string, steps: ReturnType<typeof st>[], expected: string, stop: string): CourseExample {
  return { title, scene, steps, expected, stop };
}

const VBOX = "Kali host + víctima VirtualBox Host-Only. Solo TU lab.";

/** Semanas 3–12: ejemplos guiados (huecos msf/web + cadenas). */
export const LESSON_EXAMPLES_B: Record<string, CourseExample[]> = {
  "c03-d1": [
    ex("Ejemplo 1 — search con TU banner", VBOX + " Abre el -sV de semana 1.", [
      st("msfconsole, luego search vsftpd (o el producto que TÚ tengas en el banner).", "search vive de versión. Un resultado no es una orden de run."),
      st("info de UN módulo. Lee rank, targets, SO.", "Windows vs MS2 Linux debe coincidir."),
      st("No exploits todavía si vas al ritmo; o SOLO contra MS2 Host-Only.", "Auxiliary es enum, no shell."),
    ], "Un módulo leído, no disparado a ciegas.", "use no explota. Solo carga."),
    ex("Ejemplo 2 — Biblioteca, no botón", "Alguien abre msf como primer comando del día.", [
      st("Escribe: nmap+enum ANTES de search.", "Metasploit no es el examen."),
      st("search type:exploit apache solo si tu -sV es Apache.", "Keyword sin evidencia es ruido."),
      st("Cierra si no hay match. Vuelve al output.", "No colecciones 20 módulos."),
    ], "Regla 'datos primero' dicha en voz alta.", "Un search ≠ explotado."),
  ],
  "c03-d2": [
    ex("Ejemplo 1 — show options como examen", "Módulo cargado. Guest IP conocida.", [
      st("show options. Marca qué está required y vacío.", "Si required está vacío, run falla o hace el ridículo."),
      st("set RHOSTS <IP_guest>. show options otra vez.", "Paranoia barata. RPORT si no es el default."),
      st("No pongas LHOST todavía si esta clase es solo RHOSTS — o pon el de vboxnet si el módulo lo pide.", "LHOST ≠ wlan0 hacia Host-Only."),
    ], "Options rellenas y releídas.", "check verde no es sesión."),
    ex("Ejemplo 2 — RHOSTS mal puesto", "set RHOSTS 127.0.0.1 'porque es local'.", [
      st("Eso es Kali, no el guest.", "El pentest es por vboxnet."),
      st("set RHOSTS a la IP que hiciste ping en semana 0.", "Mide, no copies."),
      st("show options. Confirma.", "El hábito es el examen."),
    ], "RHOSTS = guest.", "Default de un blog no gana a ip addr."),
  ],
  "c03-d3": [
    ex("Ejemplo 1 — LHOST medido", "Dibujo: Kali, vboxnet, guest. Flecha reverse guest→Kali.", [
      st("ip addr en vboxnet. set LHOST esa IP.", "El guest no rutea a wlan0."),
      st("set LPORT 4444 o uno libre. ss -lptn | grep 4444 si dudas.", "4444 es costumbre, no magia."),
      st("Papel: 'reverse = ellos me hablan a LHOST:LPORT'.", "Bind es al revés."),
    ], "LHOST de vboxnet escrito y seteado.", "LHOST wlan0 a guest Host-Only es el bug clásico."),
    ex("Ejemplo 2 — Handler de prueba (lab)", "Sin disparar un exploit de red ajena.", [
      st("use exploit/multi/handler. set payload compatible. set LHOST vboxnet.", "Handler = tú escuchas."),
      st("exploit -j si solo pruebas el listener.", "No apuntes el payload a nada fuera del lab."),
      st("Ctrl+C mental: si nadie conecta, debug red/payload, no 'otro CVE'.", "Eslabón por eslabón."),
    ], "Listener entendido.", "Bind en NAT de examen suele ser más infeliz que reverse."),
  ],
  "c03-d4": [
    ex("Ejemplo 1 — Payload del SO correcto", "MS2 es Linux.", [
      st("info del módulo: payloads compatibles.", "linux/… no es Windows meterpreter por capricho."),
      st("set payload uno que el módulo liste. show options.", "Si no coinciden handler y binario, 'no pasa nada' es correcto."),
      st("No generes 15 msfvenom hoy si el plan es el módulo.", "Una cadena, un payload."),
    ], "Payload nombrado y seteado.", "cmd/unix vs meterpreter: el módulo decide, no Twitter."),
    ex("Ejemplo 2 — msfvenom como idea", "Payload fuera de msfconsole.", [
      st("Escribe: msfvenom genera; multi/handler recibe.", "Dos piezas, mismo LHOST/LPORT/payload."),
      st("No lo dejes en un share Bridged.", "Solo guest Host-Only si practicas drop en lab."),
      st("Si no hay match de versión, no compensas con un payload 'más elite'.", "Match > meme."),
    ], "Relación venoms/handler clara.", "No descargues 20 payloads del año pasado a ciegas."),
  ],
  "c03-d5": [
    ex("Ejemplo 1 — Sesión y sysinfo", "Solo si ya hay match y lab aislado.", [
      st("Tras run, sessions -l. sessions -i N.", "Sesión ≠ examen aprobado."),
      st("sysinfo. getuid. Copia user y SO.", "El examen quiere un valor, no tu ego."),
      st("hashdump solo cobra sentido en Windows. En MS2 Linux no lo esperes igual que en un DC.", "SO distinto."),
    ], "User y SO anotados.", "Shell cruda + Ctrl+C = se muere. Practica pty en lab, no el día D."),
    ex("Ejemplo 2 — Evidencia, no teatro", "Tienes prompt y quieres 'más'.", [
      st("Escribe el valor que pediría un cuestionario (uid, hostname).", "Loot de fase access."),
      st("No abras 12 post modules de curiosidad.", "Una pregunta, una respuesta."),
      st("Si no hay sesión: debug options/LHOST/payload/versión. Un eslabón.", "Otro CVE no arregla LHOST mal."),
    ], "Una línea de evidencia.", "Post-ex no es privesc automático."),
  ],
  "c03-d6": [
    ex("Ejemplo 1 — Cadena completa en lab", "vsftpd 2.3.4 SOLO si TU -sV lo dice.", [
      st("nmap -sV → search → use → set RHOSTS/LHOST → payload → run → sysinfo.", "Si un eslabón falla, debug ese, no el meme."),
      st("Si tu versión NO es esa, no fuerces el módulo.", "El examen premia el match."),
      st("Repite la cadena mañana si dudaste.", "Un vídeo de 2 h no cierra el hueco."),
    ], "Una cadena real en TU VM o una negativa honesta (versión distinta).", "No apuntes a nada fuera de Host-Only."),
    ex("Ejemplo 2 — Mapa de fallos", "Papel con 5 cajas: red, search, options, payload, sesión.", [
      st("Marca en cuál fallaste la última vez.", "Eso es el plan de mañana."),
      st("No marques 'todo'.", "TDAH: un eslabón."),
      st("Cierra msf. Notas.", "Mes 1 sigue; no es el techo."),
    ], "Un eslabón nombrado.", "Rank excellent no autoriza target ajeno."),
  ],
  "c04-d1": [
    ex("Ejemplo 1 — searchsploit con TU banner", "Producto+versión de -sV.", [
      st("searchsploit '<producto> <versión>'", "Índice local de Exploit-DB en Kali."),
      st("Lee descripción. ¿Hay módulo msf? Anota 1 candidato.", "El primer .c de Internet no es un plan."),
      st("Versión cercana ≠ garantía. Confirma servicio real.", "Identificar ≠ explotar."),
    ], "Un candidato y por qué.", "No lances el PoC a nada fuera del guest."),
    ex("Ejemplo 2 — Nessus como concepto", "Pregunta de examen: qué es.", [
      st("Escribe: scanner de vulns. Genera hipótesis.", "No sustituye nmap ni tu cerebro."),
      st("False positive: CVE en versión cercana.", "Confirmas en TU guest."),
      st("Guarda el nombre del exploit y el porqué.", "El examen pregunta el porqué implícito en el resultado."),
    ], "Una frase 'scanner ≠ root'.", "OpenVAS/Nessus no son LHOST."),
  ],
  "c04-d2": [
    ex("Ejemplo 1 — Un solo vector Linux en MS2", VBOX + " Versión de TU -sV, no un CVE de memoria.", [
      st("Elige UN daemon (ftp/samba/…). Snapshot 'limpia'.", "Un exploit puede tumbar el servicio. No lances 8 módulos al mismo puerto."),
      st("Listener listo (LHOST vboxnet). Un módulo o trigger que coincida. Anota getuid.", "'Exploit completed' sin sesión no es initial access."),
      st("Si falla: checklist LHOST/options/SO, no Bridged.", "Manual o msf: el que controlas y coincide."),
    ], "getuid o un fallo de eslabón nombrado.", "No celebres el banner de msf sin whoami."),
    ex("Ejemplo 2 — Estabilidad del lab", "El servicio murió.", [
      st("Snapshot atrás. Un vector otra vez.", "El examen INE no te da snapshot; el lab sí."),
      st("No compenses con otro CVE random.", "Match de versión."),
      st("Notas: qué puerto, qué módulo, qué uid.", "Evidencia."),
    ], "Lab recuperado + nota.", "8 módulos seguidos es ruido, no 'pro'."),
  ],
  "c04-d3": [
    ex("Ejemplo 1 — Reverse en tres cajas", "Papel + ip addr.", [
      st("Flecha guest → Kali:LPORT. LHOST = vboxnet.", "Reverse = la víctima llama. nc -lvnp escucha."),
      st("Si no nace: LHOST, LPORT libre, misma red, payload SO.", "Wireshark en vboxnet, no feeling."),
      st("No pruebes hacia wlan0.", "El guest no va ahí."),
    ], "Dibujo + LHOST correcto.", "Internet del host no diagnostica el reverse. nc -e no es universal en Kali."),
    ex("Ejemplo 2 — Bind en una frase", "La víctima escucha; tú conectas a RHOST:puerto.", [
      st("LHOST importa menos que en reverse. NAT/firewall de examen suele odiar bind.", "Por eso reverse suele ser más feliz."),
      st("Ensayo 60s en voz alta: quién llama en cada uno.", "El examen pregunta la flecha."),
      st("Un listener nc en vboxnet (lab), aunque no lo conectes aún.", "No abras puertos en el router de casa."),
    ], "Reverse vs bind distinguibles.", "Bind no es 'más pro'."),
  ],
  "c04-d4": [
    ex("Ejemplo 1 — Mapa Windows sin PC familiar", "Cinco diferencias en papel.", [
      st("Usuarios/SAM, SMB nativo, PowerShell, payloads windows/meterpreter, no trates un DC como MS2.", "Modelo eJPT, no AD de empresa."),
      st("Payload linux a Windows = incorrecto. Mismatch es el error #1.", "SO manda."),
      st("Si no tienes VM Windows Host-Only: concepto hoy. No ataques laptops de la familia.", "Alcance."),
    ], "5 diferencias escritas.", "445 en Windows sigue siendo enum SMB, no Gobuster."),
    ex("Ejemplo 2 — ¿Montar Windows lab?", "MS3 u otra víctima Windows.", [
      st("Solo si es TU VM. Host-Only. Misma metodología que MS2.", "Cambia el SO, no el método."),
      st("Si no la montas, cierra con el mapa. No inventes un target en la LAN.", "Honestidad."),
      st("LOLBAS/NetExec: lectura RABBIT, no el Windows de casa.", "Prohibido."),
    ], "Sí/no de lab Windows con razón.", "LAN familiar ≠ lab."),
  ],
  "c04-d5": [
    ex("Ejemplo 1 — Skill-check Mes 1 en papel", "5 preguntas de semanas 1–4, 8 min.", [
      st("LHOST de dónde, 445 qué tool, Gobuster vs Hydra, options msf, reverse vs bind.", "Mezcla: el examen mezcla."),
      st("Las fallidas: relee esa jornada, no 'toda la semana'.", "Remediación fina."),
      st("No abras YouTube de 2 h como premio.", "Repetición > vídeo."),
    ], "≥70% o lista de 1–2 huecos.", "Marcar es skill. Entrénela."),
    ex("Ejemplo 2 — Hueco declarado", "Gobuster/Hydra/enum4linux o msf.", [
      st("Si fallaste tools: /clase c02-d5 otra vez.", "La tabla ES el hueco."),
      st("Si fallaste msf: cadena en papel sin teclado, luego lab.", "search→set→LHOST→sysinfo."),
      st("Una hora, un hueco.", "No los dos en paralelo (TDAH)."),
    ], "Un hueco con plan de mañana.", "Instalar más tools no cierra huecos."),
  ],
  "c04-d6": [
    ex("Ejemplo 1 — Puente a Mes 2", "HTTP del guest o DVWA local.", [
      st("curl -I http://<RHOST>/ o abre DVWA localhost.", "Web es otra familia. No enum4linux a HTTP."),
      st("Anota si hay params o solo un index.", "Sin param, SQLi no es obvio."),
      st("Mes 1 se da por cerrado solo si ping+nmap+una tool bien elegida existen.", "Si no, no 'empieces SQLi'."),
    ], "Una petición HTTP vista.", "No sqlmap a Internet."),
    ex("Ejemplo 2 — Inventario honesto", "Checklist Mes 1.", [
      st("¿Ping? ¿-sV guardado? ¿SMB o HTTP tocado sin mezclar tools? ¿LHOST medido?", "Cuatro sí o un no que manda."),
      st("El no manda el fin de semana.", "Oficio, no adelantar."),
      st("Cierra GitHub RABBIT de msf.", "Mes 2 tiene sus repos."),
    ], "Checklist.", "Esta web no certifica. INE sí."),
  ],
  "c05-d1": [
    ex("Ejemplo 1 — Interceptar 1 request DVWA", "DVWA localhost security low. No Internet.", [
      st("Abre el login. DevTools o Burp solo a localhost.", "HTTP es petición/respuesta."),
      st("Anota método, URL, campos (user/pass).", "Si no ves el parámetro, no hay SQLi ni LFI."),
      st("Mira status. 403 ≠ 404. 401 sugiere falta authn.", "El código cambia el next step."),
    ], "Un request en papel.", "Proxy a Internet: no."),
    ex("Ejemplo 2 — GET vs POST", "Misma app.", [
      st("GET: params en URL. POST: cuerpo.", "Dónde viajan los datos cambia."),
      st("Cookies en headers tras login.", "Sesión = ticket."),
      st("500 puede ser pista de inyección en lab, no 'rompe todo y vete'.", "Lee el error."),
    ], "Método y un status interpretados.", "80 open ≠ SQLi."),
  ],
  "c05-d2": [
    ex("Ejemplo 1 — SQLi manual DVWA low", "Módulo SQL Injection. id=.", [
      st("Prueba ' y observa error o comportamiento raro.", "Romper sintaxis = detección."),
      st("ORDER BY n hasta fallar. UNION SELECT con ese número de columnas.", "UNION necesita columnas visibles."),
      st("Extrae @@version o equivalente. Solo este lab.", "80 open no implica SQLi. Hace falta param."),
    ], "Versión SQL o un error entendido.", "Nunca la web del banco. Nunca un CMS ajeno."),
    ex("Ejemplo 2 — information_schema", "MySQL de DVWA.", [
      st("Idea: metadatos de tablas/columnas.", "Enum SQL, no ARP."),
      st("Manual primero. sqlmap después.", "El orden te aprueba más que el inverso."),
      st("Para cuando tengas un string. No dumps eternos.", "Reloj."),
    ], "Una tabla nombrada o versión.", "OR 1=1 cambia el predicado; no es LHOST."),
  ],
  "c05-d3": [
    ex("Ejemplo 1 — sqlmap a DVWA con cookie", "Misma URL id= local.", [
      st("Copia URL y cookie de sesión si hace falta login.", "Olvidar cookie → 'no injectable' falso."),
      st("sqlmap -u 'URL' --cookie='…' --batch --dbs", "Lista DBs. Para. No --dump masivo."),
      st("Solo localhost/guest. --level/--risk suben agresividad en lab.", "Sin entender el request, sqlmap es palo de ciego."),
    ], "--dbs visto. Stop.", "sqlmap a un sitio random: no."),
    ex("Ejemplo 2 — --dbs vs --dump", "Papel.", [
      st("--dbs lista bases. -D db --tables lista tablas. -T t --dump vuelca.", "Tres escalones."),
      st("Elige UN escalón hoy.", "Reloj y TDAH."),
      st("¿sqlmap sustituye ver el request? No.", "Aunque --risk 3."),
    ], "Flags distinguidos.", "--dump no es nmap."),
  ],
  "c05-d4": [
    ex("Ejemplo 1 — XSS reflected DVWA low", "Campo que se refleja en la respuesta.", [
      st("Payload de lab: un alert(1) o el que pida el ejercicio.", "PoC de ejecución JS en TU navegador."),
      st("Observa si persiste al recargar (si no, es reflected).", "Stored persiste y pega a otros usuarios de la app."),
      st("Cookie theft es concepto. No robes sesiones ajenas.", "XSS corre en el browser, no en el kernel."),
    ], "Un alert de lab o un no (filtro).", "No lances payloads a un foro real."),
    ex("Ejemplo 2 — Tres tipos en una tabla", "Papel.", [
      st("Reflected | Stored | DOM", "Persistencia y dónde se concatena."),
      st("No es SQLi. No es LFI.", "Strings distintos, capas distintas."),
      st("OWASP cheat de prevención 10 min DESPUÉS, si quieres el modelo al revés.", "Atacar sin modelo de defensa es memorizar."),
    ], "Tres tipos nombrados.", "alert en DVWA ≠ root."),
  ],
  "c05-d5": [
    ex("Ejemplo 1 — Cookie en DevTools", "Login DVWA.", [
      st("Copia el NOMBRE de la cookie (no la compartas, no la subas).", "Ticket de sesión."),
      st("Cierra sesión. Mira qué pasa si falta.", "Authn = quién eres."),
      st("Si hay un id=1 de objeto, piensa id=2 (IDOR) solo en esta app.", "Authz = qué puedes. 403 a veces es real."),
    ], "Nombre de cookie y una prueba de sesión.", "Brute login sin user: mismo pecado que Hydra ciego."),
    ex("Ejemplo 2 — Authn vs authz", "Frases de examen.", [
      st("Authn: login. Authz: admin vs user.", "Login ≠ poder."),
      st("Cookie predecible o hidden field = bypass de lógica en lab, no JWT de congreso.", "eJPT ama esta diferencia."),
      st("403 no siempre se 'bypassea' con un header de blog.", "A veces es authz."),
    ], "Dos palabras usadas bien.", "No es CIDR ni SUID."),
  ],
  "c05-d6": [
    ex("Ejemplo 1 — Mini simulacro 5 min", "Papel. Semana 5.", [
      st("5 preguntas: detección SQLi, UNION, --dbs, tipos XSS, 403 vs 404.", "Marcar bajo tiempo."),
      st("Fallidas → relee d2–d4.", "No 4 horas de XSS y cero clics."),
      st("Semana 6 trae LFI y simulacro #1. Llega habiendo tocado DVWA.", "El gym de reloj no perdona solo lectura."),
    ], "80% interno o huecos listados.", "UNION es SQLi, no XSS."),
    ex("Ejemplo 2 — Qué entra al banco", "Lista.", [
      st("Detección, UNION conceptual, sqlmap --dbs, XSS 3 tipos, 403≠404.", "Eso se marca."),
      st("DVWA security low: aprender el bug sin WAF.", "No es producción."),
      st("Cierra. Descansa o GitHub sqlmap/OWASP con timer.", "Una ficha."),
    ], "Lista recitada.", "Simulacro no se aprueba leyendo."),
  ],
  "c06-d1": [
    ex("Ejemplo 1 — LFI /etc/passwd en DVWA", "File Inclusion low. page=.", [
      st("page=../../../../etc/passwd (ajusta ../).", "Ping de LFI en Linux. Lee archivos del servidor."),
      st("Anota cuántos ../ necesitaste.", "Traversal, no UNION."),
      st("LFI ≠ RCE. Hace falta más (wrappers/logs) y solo en lab.", "No LFI a un CMS de Internet."),
    ], "passwd leído o filtro anotado.", "Encoding/wrappers si filtra: lab only."),
    ex("Ejemplo 2 — LFI vs SQLi", "Misma app, otro módulo.", [
      st("SQLi: SQL. LFI: include de fichero.", "Si los mezclas, el payload miente."),
      st("/etc/passwd no es SAM ni root garantizado.", "Prueba de lectura."),
      st("php://filter es lectura de fuente en lab, no un hobby contra terceros.", "Concepto."),
    ], "Dos bugs separados.", "80 open ≠ LFI. Hace falta param de include."),
  ],
  "c06-d2": [
    ex("Ejemplo 1 — RFI concepto, no forzar php.ini", "Si DVWA RFI está cerrado.", [
      st("Escribe: inclusión remota si allow_url_include y el param acepta URL.", "Nombre y riesgo bastan para muchas preguntas."),
      st("No fuerces php.ini del host para 'hacerlo real'.", "Lee y sigue."),
      st("Nunca bajes un webshell a un host que no es tuyo.", "Eso no es eJPT."),
    ], "Definición escrita.", "RFI ≠ LFI. Remoto vs local."),
    ex("Ejemplo 2 — Wrapper de lectura", "Solo DVWA/allow.", [
      st("php://filter como idea para leer fuente.", "Lab."),
      st("Si no corre, no es fallo tuyo: config.", "No compenses con un host ajeno."),
      st("Cierra. Auth bypass mañana.", "Una idea por día."),
    ], "Wrapper nombrado.", "allow_url_include no se 'prueba' en producción ajena."),
  ],
  "c06-d3": [
    ex("Ejemplo 1 — Bypass de lógica en DVWA", "Login / cookies / hidden.", [
      st("Busca default creds del lab, cookies, params hidden.", "A menudo lógica, no crypto."),
      st("IDOR: cambiar un id de objeto en ESTA app.", "Authz rota."),
      st("Documenta qué cambiaste y qué viste.", "Evidencia corta."),
    ], "Un bypass de lab o un no honesto.", "403 no siempre cede."),
    ex("Ejemplo 2 — No es JWT de congreso", "Expectativa eJPT.", [
      st("Cookies predecibles, hidden, defaults.", "Eso sale en preguntas."),
      st("No montes un lab OAuth de 4 h hoy.", "Scope."),
      st("Una prueba, una nota.", "TDAH."),
    ], "Modelo simple.", "No brute sin user."),
  ],
  "c06-d4": [
    ex("Ejemplo 1 — Upload vs command injection", "Dos superficies.", [
      st("Upload: un archivo que el servidor ejecuta (lab). Command injection: input que llega a system().", "No son el mismo bug."),
      st("Manual en DVWA primero. commix solo si ya lo viste a mano.", "La tool miente con estilo si no hay inyección."),
      st("Solo localhost.", "Un archivo a un host ajeno no es práctica."),
    ], "Dos nombres, dos pruebas o dos conceptos escritos.", "Upload ≠ Gobuster."),
    ex("Ejemplo 2 — Criterio", "¿Hay campo que huele a OS command?", [
      st("Si no, no lances commix.", "Hipótesis primero."),
      st("Si sí, una prueba manual en DVWA.", "Luego automatizar."),
      st("Para.", "Semana de cierre web, no de kit."),
    ], "Hipótesis escrita.", "No es SMB."),
  ],
  "c06-d5": [
    ex("Ejemplo 1 — Sentar el simulacro #1", "15 preguntas, 20 min, 70%.", [
      st("Lee /simulacro reglas: si suspendes el full, no otro el mismo día.", "El reloj es la skill."),
      st("Llega habiendo tocado DVWA. No 'lo leo en el examen'.", "Mezclan SQLi/XSS/LFI/tools."),
      st("Papel y agua. Una pantalla.", "TDAH: no 6 pestañas."),
    ], "Calendario del simulacro, no improvisado.", "No es un skill-check de 5."),
    ex("Ejemplo 2 — After action", "Al terminar.", [
      st("Fallidas → remediación de ESE subtema.", "No 'toda la web'."),
      st("No abras HTB de premio.", "Cierra o reposa."),
      st("Notas de 5 líneas: qué tipo fallaste.", "Útil semana 7."),
    ], "Lista de fallos.", "Racha 30 no aprueba el simulacro."),
  ],
  "c06-d6": [
    ex("Ejemplo 1 — Cierre web: recitar", "Sin apuntes.", [
      st("SQLi detección + UNION + --dbs. XSS 3. LFI passwd. 403≠404.", "Si fallas uno, esa jornada otra vez."),
      st("Una vuln por sesión de práctica, no las cinco.", "TDAH."),
      st("Redes semana 7: otro género. No dejes web a cero.", "El examen mezcla."),
    ], "Recitado o hueco.", "No adelantes ARP si LFI no salió."),
    ex("Ejemplo 2 — DVWA off / lab on", "Checklist.", [
      st("DVWA local cierra o snapshot. Guest Host-Only sigue aislado.", "No dejes DVWA publicado."),
      st("Notas web en la plantilla pregunta/respuesta.", "Mes 3 reporting lo agradece."),
      st("GitHub: un repo WEB SCAN, timer.", "No PayloadsAllTheThings entero."),
    ], "Cierre limpio.", "Internet no es tu dojo."),
  ],
};

export const ALL_LESSON_EXAMPLES: Record<string, CourseExample[]> = { ...A, ...LESSON_EXAMPLES_B };

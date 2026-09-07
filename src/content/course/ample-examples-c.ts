import { CourseExample } from "@/content/course/types";

function st(doWhat: string, why: string) {
  return { do: doWhat, why };
}
function ex(title: string, scene: string, steps: ReturnType<typeof st>[], expected: string, stop: string): CourseExample {
  return { title, scene, steps, expected, stop };
}

const LAB = "Solo lab aislado. ARP/MITM nunca a la Wi‑Fi familiar.";

export const LESSON_EXAMPLES_C: Record<string, CourseExample[]> = {
  "c07-d1": [
    ex("Ejemplo 1 — ARP del lab, no de casa", LAB, [
      st("ping al guest. ip neigh. Anota MAC/IP del guest.", "Tabla ARP del lab."),
      st("Dibuja el ataque ARP spoof en papel (víctima cree que tú eres gateway).", "Concepto eJPT. No lo lances a wlan0."),
      st("Escribe: 'no spoof a humanos'.", "ettercap a 192.168.1.0/24 de casa no es lab."),
    ], "Dibujo + ip neigh.", "Host-Only no autoriza atacar personas."),
    ex("Ejemplo 2 — Qué preguntará el examen", "MITM = en medio.", [
      st("Nombre: envenenar ARP.", "Para qué sirve, no 15 flags."),
      st("Captura en vboxnet si algún día hay dos guests. Hoy basta el concepto.", "Sin segunda víctima, no inventes."),
      st("Cierra bettercap/Responder docs si los abriste: 10 min y stop.", "Prohibido LAN doméstica."),
    ], "Definición recitada.", "Racha 14 no autoriza MITM familiar."),
  ],
  "c07-d2": [
    ex("Ejemplo 1 — ip route leído en voz alta", "Kali.", [
      st("ip route. Marca default via wlan0/eth0 vs ruta del /24 vboxnet.", "Internet del host ≠ lab."),
      st("LHOST wlan0 hacia guest Host-Only: mal.", "El guest no rutea ahí."),
      st("Anota LHOST de vboxnet otra vez.", "Siempre importa."),
    ], "Dos rutas distinguidas.", "default via Wi‑Fi no es la ruta del lab."),
    ex("Ejemplo 2 — ¿Hay pivot?", "MS2 suele tener una NIC.", [
      st("Pivot = una red que Kali no ve y la víctima sí.", "Si no hay, no lo inventes."),
      st("Dibuja eth0 lab y una eth1 ficticia 10.0.0.0/24.", "Concepto. Practica forward solo si tu lab tiene 2 redes."),
      st("Una NIC → a menudo NO hay pivot.", "Honestidad."),
    ], "Sí/no de pivot con razón.", "80 open no implica pivot."),
  ],
  "c07-d3": [
    ex("Ejemplo 1 — Port forward en papel", "Tubería: un puerto de allí aparece aquí.", [
      st("Escribe ssh -L o msf portfwd como nombres.", "Pregunta de examen: para qué sirve."),
      st("Marca dónde pondrías el forward en el dibujo dual-homed.", "Si no hay 2 redes, tu skill es NO pivotar."),
      st("No abras puertos a Internet 'para probar'.", "Lab interno."),
    ], "Nombre + dibujo.", "Forward ≠ LHOST mágico."),
    ex("Ejemplo 2 — chisel como palabra", "Si un día hay 2 redes.", [
      st("client/server. Un puerto. Timer de lectura 10 min.", "No lo conviertas en el día."),
      st("Vuelve al guest de una NIC.", "Método > tool nueva."),
      st("Cierra.", "TDAH."),
    ], "Nombre anotado.", "No es XSS."),
  ],
  "c07-d4": [
    ex("Ejemplo 1 — SOCKS = proxy de túnel", "Papel.", [
      st("SOCKS es el proxy. proxychains envuelve tools por ese proxy.", "No es un payload Windows."),
      st("Herramientas por SOCKS: las que configures, lab interno.", "No SOCKS público en un café."),
      st("¿SOCKS sustituye enum SMB local? No.", "Otra fase."),
    ], "Dos frases.", "No dirbust SMB con SOCKS de café."),
    ex("Ejemplo 2 — Cuándo practicarlo", "¿Tienes 2 redes?", [
      st("Si no: concepto y cierre.", "eJPT pregunta el para qué."),
      st("Si sí: un proxychains nmap a UN host de la red oculta, Host-Only/internal.", "Alcance."),
      st("Para.", "No 15 flags."),
    ], "Decisión honesta.", "SOCKS ≠ DHCP."),
  ],
  "c07-d5": [
    ex("Ejemplo 1 — UDP pedido a propósito", "RHOST lab.", [
      st("nmap -sU -p 53,161 <RHOST> si quieres ver.", "UDP no viene en el SYN default."),
      st("161/udp → SNMP. community public es default de lab.", "No es root Windows."),
      st("AXFR solo a TU DNS de lab, nunca a un NS público.", "Alcance."),
    ], "UDP como apartado.", "-sV TCP no cubre UDP."),
    ex("Ejemplo 2 — Tres servicios UDP", "53, 161, otros.", [
      st("DNS 53, SNMP 161. Nombres.", "Examen: puerto típico."),
      st("AXFR = transferencia de zona (enum), no exploit kernel.", "Si el NS del lab lo permite."),
      st("Cierra. No -sU al /16.", "Lento y ruidoso."),
    ], "Puertos recitados.", "community public ≠ LHOST."),
  ],
  "c07-d6": [
    ex("Ejemplo 1 — Mezclador Mes 2", "Tres cajas: web / red / aún no privesc profundo.", [
      st("Una pregunta de cada caja en papel.", "El examen mezcla. Tú eres el DJ."),
      st("LHOST sigue importando. UDP hay que pedirlo. MITM a humanos = no.", "Reglas que no caducan."),
      st("Pivot sin 2 redes: no lo inventes.", "Honestidad."),
    ], "Tres respuestas.", "Un tema por día INE es mito: mezclan."),
    ex("Ejemplo 2 — Mapa y stop", "Semana 8 es privesc.", [
      st("Si redes están flojas: repite d2, no adelantes LinPEAS.", "Capa 3."),
      st("GitHub: un MAP 12 min (HackTricks UNA pregunta).", "Timer."),
      st("Cierra wlan0 en la cabeza para ataques.", "Lab only."),
    ], "Cierre.", "ARP Wi‑Fi no."),
  ],
  "c08-d1": [
    ex("Ejemplo 1 — Mapa Linux antes de LinPEAS", "Shell de lab en MS2 (si la hay) o consola msfadmin para enum local de estudio.", [
      st("sudo -l. ls SUID (find / -perm -4000 2>/dev/null | head). No kernel primero.", "Mapa, no exploit trending."),
      st("Si ya hay shell de red: LinPEAS en la VÍCTIMA, no en tu Kali host.", "La tool clasifica; tú eliges."),
      st("GTFOBins: UN binario tras sudo -l. No 40.", "Confused deputy."),
    ], "Una señal (sudo/SUID/cron) anotada.", "No | bash desde foros. No PEASS en tu Kali."),
    ex("Ejemplo 2 — Colores vs vector", "Output largo.", [
      st("Elige UNA señal roja/alta y verifícala a mano.", "LinPEAS no razona el examen."),
      st("Compara idea con LinEnum: mismo mapa, otra UX.", "Internaliza el mapa."),
      st("Para. No 20 kernel exploits.", "eJPT: un camino."),
    ], "Un vector o un no.", "Tool ≠ root."),
  ],
  "c08-d2": [
    ex("Ejemplo 1 — Cron writable en lab", "Si existe en MS2; si no, concepto.", [
      st("Busca cron de root que llame un script. ¿Es writable para tu user?", "Quién ejecuta qué con qué permisos."),
      st("PATH: ¿un binario writable en un dir que root recorre?", "Mismo patrón."),
      st("Si no hay writable, no inventes. Anota la negativa.", "El examen pregunta el porqué."),
    ], "Hallazgo o negativa.", "No es CVE trending."),
    ex("Ejemplo 2 — Dibujo confused deputy", "Papel.", [
      st("Root cron → script tuyo writable.", "Tú escribes, root ejecuta (lab)."),
      st("Eso no es 'más elite' que sudo -l.", "Es el mismo oficio."),
      st("Cierra.", "Una idea."),
    ], "Dibujo.", "No sustituyas scripts en TU Kali host por 'práctica'."),
  ],
  "c08-d3": [
    ex("Ejemplo 1 — Windows como modelo mental", "Sin AD obligatorio.", [
      st("Nombra: unquoted service path, servicios, tokens, AlwaysInstallElevated.", "Modelo. Lab Windows solo si es TU VM Host-Only."),
      st("LOLBAS: 1 binario (certutil idea). Relaciónalo con 'no traer malware'.", "No lo pruebes en el Windows familiar."),
      st("SAM/hashdump es este SO, no MS2 Linux.", "Separa."),
    ], "Cuatro nombres Windows.", "No recolectes AD ajeno. BloodHound es RABBIT, no semana 2."),
    ex("Ejemplo 2 — Transferir la idea a Linux", "Grafo de ataque sin Neo4j.", [
      st("cron→SUID es un path. Igual que un path to DA, más pequeño.", "La idea viaja."),
      st("No instales Neo4j hoy.", "Scope eJPT."),
      st("Si no hay VM Windows, cierra con el modelo.", "No es lab obligatorio."),
    ], "Analogía escrita.", "NetExec/CME: no AD de nadie."),
  ],
  "c08-d4": [
    ex("Ejemplo 1 — Loot formato examen", "Máquina ya tocada.", [
      st("Reescribe cada hallazgo: '¿Qué puerto SMB? → 445'.", "Pregunta + respuesta corta. No ensayo."),
      st("Users, hashes, versiones, paths, contenidos.", "eJPT pide valores."),
      st("hash mal copiado: CyberChef, no 'casi'.", "Error de canal."),
    ], "8 pares pregunta/respuesta.", "hashdump Windows ≠ shadow Linux denied (denied es hallazgo)."),
    ex("Ejemplo 2 — Durante vs después", "Plantilla.", [
      st("Durante: IP, puerto, versión, user, comando que funcionó.", "Si lo dejas para después, el examen te come."),
      st("Después: limpia al formato corto.", "8 líneas > Notion barroco."),
      st("Inglés: service version, open share…", "Frases del brief."),
    ], "Plantilla usada.", "No es reporte de consultora."),
  ],
  "c08-d5": [
    ex("Ejemplo 1 — Cuándo parar privesc", "Reloj o pregunta ya respondida.", [
      st("Si la pregunta se responde con user, no sigas a root por ego.", "Parar es skill."),
      st("Si no hay vector: no kernel a ciegas.", "Google de 3 a.m. es el hoyo."),
      st("Otra caja puede puntuar más.", "70% preguntas > root sin notas."),
    ], "Una parada consciente.", "No es obligatorio privesc en cada host."),
    ex("Ejemplo 2 — Honestidad de ritmo", "Mitad de plan.", [
      st("¿Ping, 3 tools, 1 cadena msf, DVWA, notas?", "Si no, remedia."),
      st("Simulacro #2 mezcla. No BloodHound.", "Scope."),
      st("Cierra.", "Mes 3 son cadenas, no 20 CVEs."),
    ], "Checklist mitad.", "Root de mentira no cierra Mes 2."),
  ],
  "c08-d6": [
    ex("Ejemplo 1 — Cierre Mes 2 en una hoja", "Web + red + privesc mapa + loot.", [
      st("Una línea por género.", "Mezclador."),
      st("Hueco más feo: esa jornada otra vez.", "No 'todo Mes 2'."),
      st("Descanso o simulacro según el plan.", "No RABBIT de AD."),
    ], "Hoja.", "INE no pregunta tu racha."),
    ex("Ejemplo 2 — Inventario de VMs", "VirtualBox.", [
      st("MS2 Host-Only, snapshot, DVWA local off o local only.", "Higiene."),
      st("Kioptrix/MS3 solo si ya te aburre MS2: mismo aislamiento.", "Método sobrevive al aburrimiento."),
      st("Cierra Bridged si se coló.", "Siempre."),
    ], "Lab limpio.", "Nunca Bridged en LAN familiar."),
  ],
  "c09-d1": [
    ex("Ejemplo 1 — Reloj y alcance de UNA caja", "40–90 min.", [
      st("Brief → vivos → puertos → versiones → UNA superficie → enum → match → loot de preguntas.", "Cadena."),
      st("Snapshot. Notas durante.", "Si se acaba el tiempo, documenta lo que SÍ tienes."),
      st("Completar preguntas > root estético.", "eJPT es cuestionario."),
    ], "Timer puesto. Alcance escrito.", "No 8 h de rabbit en una caja."),
    ex("Ejemplo 2 — Brief de lab", "CIDR vboxnet, RHOST, no casa.", [
      st("Las tres redes otra vez: Internet host / Host-Only / (luego VPN INE).", "LHOST medido."),
      st("Una VM. Una misión.", "TDAH."),
      st("Go.", "Método."),
    ], "Brief.", "No el /16 de casa."),
  ],
  "c09-d2": [
    ex("Ejemplo 1 — 80 y 445 juntos", "Prioriza, no paralelices.", [
      st("Cierra UNA (SMB users o HTTP dirs). Luego la otra.", "No 'haz las dos a la vez'."),
      st("What next en papel antes de teclar.", "Reasoning."),
      st("Hydra solo con user.", "Sigue vigente."),
    ], "Orden 1-2.", "Nuclei a escala es overkill con un HTTP."),
    ex("Ejemplo 2 — Tool-hopping", "Quieres ffuf + gobuster + nikto.", [
      st("Una de dirs. Termínala.", "TDAH."),
      st("Nikto: 3 findings, verifica 1 a mano (curl).", "Hallazgo ≠ exploitable. Ruidoso: solo lab."),
      st("Para.", "No Wi‑Fi ajena."),
    ], "Una tool cerrada.", "httpx si tienes VARIAS IPs de lab; si no, skip."),
  ],
  "c09-d3": [
    ex("Ejemplo 1 — Segunda máquina, mismas reglas", "Otro RHOST, mismo Host-Only.", [
      st("No copies el vector de la caja 1 a ciegas.", "Match de ESTA versión."),
      st("Mismas fases. Otras notas.", "El método sobrevive al aburrimiento."),
      st("Si es Kioptrix/VulnHub: TÚ la importaste. Bridged no.", "Alcance."),
    ], "Segunda ficha de notas.", "No la box live de IPPSec en producción."),
    ex("Ejemplo 2 — Patrón, no vídeo de 2 h", "IPPSec índice.", [
      st("Busca una técnica (smb, sqli). 1 vídeo 1.5x. 3 pasos anotados.", "Patrón."),
      st("Vuelve a TU lab.", "No la box del vídeo."),
      st("Timer.", "Hoyo."),
    ], "3 pasos.", "HTB Starting Point solo si es TU instancia autorizada."),
  ],
  "c09-d4": [
    ex("Ejemplo 1 — I'M STUCK con evidencia", "App /train o papel.", [
      st("IP, puertos, qué probaste. Luego pistas 1→5 (concepto → comando).", "No es write-up."),
      st("Más tools no es la respuesta por defecto.", "Evidencia primero."),
      st("Una pista. Ejecuta. Para.", "TDAH."),
    ], "Formulario lleno.", "Un write-up de HTB no es tu lab."),
    ex("Ejemplo 2 — Debug de eslabón", "Cinco cajas otra vez.", [
      st("¿Red? ¿Versión? ¿Tool de familia? ¿Options? ¿Loot?", "Una."),
      st("No nuclei-a-Internet.", "Lab."),
      st("Cierra el hoyo GitHub.", "Vuelve a la caja."),
    ], "Eslabón nombrado.", "Stuck ≠ instalar 5 frameworks."),
  ],
  "c09-d5": [
    ex("Ejemplo 1 — Exam Reasoning en papel", "Output sin teclado.", [
      st("445 → SMB. 80 → HTTP. sin user → no Hydra.", "Metodología."),
      st("5 outputs, 5 next steps, 10 min.", "/simulacro/reasoning."),
      st("La respuesta es la fase, no el flag más largo.", "Skill de examen."),
    ], "5 next-steps.", "No 'el binario cool de Twitter'."),
    ex("Ejemplo 2 — Mezcla a propósito", "Web + SMB + LHOST.", [
      st("Una pregunta de cada.", "INE mezcla."),
      st("Relee la fallida, no las tres.", "Remediation."),
      st("Cierra.", "Esto entra igual que meterpreter."),
    ], "Mezcla entrenada.", "Sin comandos también se puntúa el criterio."),
  ],
  "c09-d6": [
    ex("Ejemplo 1 — Cierre cadenas", "¿2 cajas con notas?", [
      st("Si una se fue a 8 h: próxima con timer 60 min.", "Reloj."),
      st("Reporting semana 10: ya tienes loot que reescribir.", "Puente."),
      st("GitHub NOTES 12 min, no el repo entero.", "Cheat sheet ≠ brief INE."),
    ], "Timer internalizado.", "No 40 pestañas de write-ups."),
    ex("Ejemplo 2 — Método vs aburrimiento", "MS2 otra vez.", [
      st("Misma cadena, menos tiempo.", "Eso es oficio."),
      st("Cambiar de SO (MS3) solo si el método ya sobrevive.", "No al revés."),
      st("Host-Only.", "Siempre."),
    ], "Tiempo anotado.", "Aburrimiento no autoriza Bridged."),
  ],
  "c10-d1": [
    ex("Ejemplo 1 — Reescribir loot a preguntas", "Una máquina ya comprometida.", [
      st("'¿Versión en 21?' → el string exacto de tu nmap.", "No un párrafo."),
      st("10 pares. Mayúsculas y puntos como en el output.", "Casi no puntúa."),
      st("Eso es eJPT, no el reporte narrativo largo.", "Formato."),
    ], "10 pares.", "No ensayos."),
    ex("Ejemplo 2 — Qué NO preguntan", "Lista.", [
      st("No tu motivación. No 20 páginas. No 'cómo me sentí'.", "Valores."),
      st("Sí: share, hash, user, versión, path.", "Corta."),
      st("Practica copiar del archivo -oN.", "Canal limpio."),
    ], "Lista.", "INE no recoge tu Notion."),
  ],
  "c10-d2": [
    ex("Ejemplo 1 — Notas DURANTE una hora de lab", "Caja conocida.", [
      st("Cada hallazgo a la plantilla en el momento.", "Después no existe."),
      st("Comando que funcionó, no 15 que no.", "Señal."),
      st("Al final: 5 min de limpia, no 50 de rediseño.", "Plantilla > barroco."),
    ], "Plantilla llena en caliente.", "Memoria heroica pierde reloj."),
    ex("Ejemplo 2 — Después = formato", "Los 5 min.", [
      st("Pregunta → evidencia → respuesta.", "Tres campos."),
      st("Borra el ruido.", "El cuestionario no quiere tu narrativa."),
      st("Guarda.", "Mes 10 es esta skill."),
    ], "Formato limpio.", "No reescribas el pentest entero."),
  ],
  "c10-d3": [
    ex("Ejemplo 1 — Frases de examen", "Inglés.", [
      st("service version, open share, local file inclusion, default credentials.", "Salen en el brief."),
      st("Traduce 5 de tus notas a esas frases.", "Retrieval."),
      st("No hace falta ensayo IELTS.", "Precisión > estilo."),
    ], "5 frases.", "Exam English vive también en /teoria."),
    ex("Ejemplo 2 — Una pregunta en inglés", "Papel.", [
      st("What is the version of the service on port 21?", "Tu string."),
      st("Copia exacta.", "Punto y mayúscula."),
      st("Repite con SMB user.", "Gym."),
    ], "2 exactas.", "Casi no vale."),
  ],
  "c10-d4": [
    ex("Ejemplo 1 — Evidencia mínima por fase", "5 líneas.", [
      st("Recon: CIDR+vivos. Enum: puertos+versiones. Exploit: vector+match. Access: uid+SO. Post: el valor.", "Si una fase no tiene línea, no ocurrió para el cuestionario."),
      st("Rellena con una caja real.", "No teórico vacío."),
      st("Hueco = esa fase mañana.", "Fino."),
    ], "5 líneas.", "Fase vacía es hallazgo de estudio."),
    ex("Ejemplo 2 — Denied como loot", "cat shadow → denied.", [
      st("Eso entra: 'shadow not readable as user X'.", "Hallazgo."),
      st("No es fallo del lab.", "Modelo de permisos."),
      st("Anota.", "Post-ex."),
    ], "Denied escrito.", "No es 404 del FS."),
  ],
  "c10-d5": [
    ex("Ejemplo 1 — Simulacro reporting", "Te dan output, extraes string.", [
      st("10 min, 8 extracciones. Exactitud.", "Skill de atención."),
      st("Fallos = canal (espacios, hex), no 'no sé pentest'.", "CyberChef si hace falta."),
      st("Cierra.", "No es fancy."),
    ], "Exactitud %.", "Hash mal copiado suspende más que un vector medio."),
    ex("Ejemplo 2 — Gym de copiar", "Tu ms2-sv.txt.", [
      st("5 versiones copiadas a una lista limpia.", "Ojo."),
      st("Compara carácter a carácter.", "Oficio."),
      st("Para.", "Reporting cerrado por hoy."),
    ], "5 limpias.", "No subas datos de clientes. Lab."),
  ],
  "c10-d6": [
    ex("Ejemplo 1 — Cierre reporting", "¿Puedes ser INE de tu propia caja?", [
      st("10 preguntas cortas sobre TU lab.", "Gym final de la semana."),
      st("Respóndelas al día siguiente sin mirar.", "Retrieval."),
      st("Logística INE es semana 11: otro género.", "No mezcles hoy dumps de examen (no existen aquí)."),
    ], "10 preguntas creadas.", "No es PDF de consultora."),
    ex("Ejemplo 2 — Plantilla definitiva", "Una hoja que reúsas.", [
      st("Fases + pregunta/respuesta + inglés ancla.", "Lista."),
      st("Imprímela o ~/lab/template.txt.", "Durante el exam la cabeza ya la tiene."),
      st("Cierra GitHub NOTES.", "Cheat de terceros ≠ brief."),
    ], "Plantilla guardada.", "No 15 PDFs."),
  ],
  "c11-d1": [
    ex("Ejemplo 1 — Expectativa honesta", "Papel.", [
      st("eJPT = lab remoto INE, preguntas, tu Kali por VPN. No es OSCP. Esta web no garantiza el PDF.", "INE decide."),
      st("Si hiciste jornadas+labs, llegas con oficio. El día D sigue siendo examen.", "Honestidad."),
      st("Escribe qué NO esperar (write-ups oficiales, dumps).", "Integridad."),
    ], "Párrafo honesto.", "Racha 90 no es diploma."),
    ex("Ejemplo 2 — Qué sí controlas", "Lista.", [
      st("Método, isolation, LHOST, notas, reloj, alcance.", "Oficio."),
      st("No controlas el brief exacto ni el criterio final.", "Acepta."),
      st("Estudia eso, no el rumor de Discord.", "Hoyo."),
    ], "Lista.", "No dumps."),
  ],
  "c11-d2": [
    ex("Ejemplo 1 — Transferir LHOST a VPN", "Día D LHOST ≠ vboxnet.", [
      st("El músculo es MEDIR ip addr en la NIC que ve el lab.", "Se transfiere."),
      st("Día antes: tools ya en Kali. No apt el día D.", "Logística."),
      st("VPN del vendor + brief. Dormir > kernel nuevo.", "T-48."),
    ], "Checklist día antes.", "No contenido nuevo a las 3 a.m."),
    ex("Ejemplo 2 — Ensayo de conectividad (lab)", "No el examen real.", [
      st("En VirtualBox: mide LHOST, ping guest, nmap -sn. 15 min.", "El ritual."),
      st("Eso es el músculo, no el rango INE.", "No escanees nada fuera."),
      st("Pack teoría móvil si viajas.", "/teoria offline."),
    ], "Ritual hecho.", "vboxnet no será la IP del examen; el hábito sí."),
  ],
  "c11-d3": [
    ex("Ejemplo 1 — Triage de 20 min", "Simulado con TU nmap viejo.", [
      st("Vivos, puertos jugosos, preguntas fáciles primero (versiones, shares).", "No te cases con una caja."),
      st("Vuelve. Otra caja puede puntuar.", "Tiempo."),
      st("Integridad: no ayuda externa, no compartir lab de examen.", "Contrato."),
    ], "Orden de triage escrito.", "Capturas del examen en Discord: no."),
    ex("Ejemplo 2 — Reloj visible", "Timer 20 min.", [
      st("3 preguntas fáciles de tu loot. Stop.", "Gym."),
      st("Si una caja se traga 40 min sin valor: suelta.", "Skill."),
      st("Agua. Una pantalla.", "TDAH."),
    ], "Suelta practicada.", "Heroísmo ≠ puntos."),
  ],
  "c11-d4": [
    ex("Ejemplo 1 — Integridad en una frase", "Lo que firmas.", [
      st("No dumps, no amigo next-step, no payloads fuera del brief.", "No es ética blanda."),
      st("Racha 90 no autoriza eso.", "Punto."),
      st("Este curso no incluye ni busca material de examen filtrado.", "GitHub hub: repos públicos de tools/notas, no dumps."),
    ], "Frase firmada (contigo).", "Saltar alcance 'porque es lab' en el exam es incumplimiento."),
    ex("Ejemplo 2 — Zona gris", "¿Puedo googlear un error de msf?", [
      st("El día D: reglas INE. Aquí: estudia ANTES para no depender.", "Logística."),
      st("No busques 'eJPT answers'.", "Integridad."),
      st("Cierra.", "Oficio."),
    ], "Criterio.", "Help externa en el exam: no."),
  ],
  "c11-d5": [
    ex("Ejemplo 1 — Plan T-48", "Dos días.", [
      st("UNA cadena conocida en VirtualBox. 20 reasoning. LHOST/VPN notes. Pack móvil. Cerrar RABBIT.", "Lista."),
      st("No contenido nuevo.", "El hoyo el día antes es el enemigo."),
      st("Dormir.", "Serio."),
    ], "T-48 en calendario.", "secret-knowledge no sustituye eJPT esa noche."),
    ex("Ejemplo 2 — Pack", "/teoria Guardar en este teléfono.", [
      st("WiFi. Pack. Icono en inicio.", "Viaje / cola."),
      st("Progreso Kali ≠ móvil salvo Supabase.", "Sabes eso."),
      st("Cierra el hub.", "Lab gana."),
    ], "Pack hecho o planificado.", "No 40 repos T-48."),
  ],
  "c11-d6": [
    ex("Ejemplo 1 — Cierre logística", "Recitar T-48 + integridad + triage.", [
      st("Tres bloques en voz alta.", "Si fallas uno, esa jornada."),
      st("Semana 12 = huecos y simulacro final, no más teoría INE.", "Puente."),
      st("Cierra rumores.", "INE docs oficiales para logística de pago/cuenta."),
    ], "Recitado.", "Esta web no es INE."),
    ex("Ejemplo 2 — Checklist de cuenta", "Tú, fuera de la app.", [
      st("Cuenta INE, voucher, fecha, Kali actualizado ANTES.", "No lo hacemos por ti."),
      st("No pegues keys aquí.", "Secretos fuera."),
      st("Vuelve al lab.", "Oficio."),
    ], "Checklist personal.", "No compartas credenciales en el curso."),
  ],
  "c12-d1": [
    ex("Ejemplo 1 — Hueco tools", "Tabla semana 2.", [
      st("21,22,80,445: herramienta 1-2-3.", "Si mezclas, c02-d5 otra vez."),
      st("Una hora. No 12 pestañas.", "Hueco declarado."),
      st("Luego para. No 'también msf' el mismo bloque TDAH.", "Uno."),
    ], "Tabla perfecta o jornada repetida.", "Más tools no cierran el hueco."),
    ex("Ejemplo 2 — Decision drill app", "/train/decisions.", [
      st("10 min. Anota fallos.", "Gym."),
      st("Relee solo esos.", "Fino."),
      st("Cierra.", "Mes 12 es consolidar, no expandir."),
    ], "Fallos listados.", "Awesome-pentest: ELEGIR una, no 30."),
  ],
  "c12-d2": [
    ex("Ejemplo 1 — Flujo msf en papel, luego lab", "Sin teclado primero.", [
      st("search → use → show options → RHOSTS/LHOST vboxnet → payload → run → sysinfo.", "Si fallas en papel, no es 'repasar web'."),
      st("Luego UNA vez en MS2 si el match existe.", "Cadena."),
      st("Debug el eslabón, no otro CVE.", "Oficio."),
    ], "Papel + lab o papel + negativa de versión.", "Vídeo 2 h no cierra."),
    ex("Ejemplo 2 — LHOST otra vez", "ip addr vboxnet.", [
      st("Mide. set. show options.", "El hueco clásico."),
      st("wlan0 tachado.", "Siempre."),
      st("Cierra.", "Web es otra jornada."),
    ], "LHOST correcto.", "Default msf no adivina tu vboxnet."),
  ],
  "c12-d3": [
    ex("Ejemplo 1 — Web mínimo", "DVWA low. 45 min.", [
      st("SQLi ' + @@version. LFI passwd. XSS tipo nombrado.", "Si uno falla, esa clase, no las tres."),
      st("sqlmap --dbs una vez si el manual salió.", "Orden."),
      st("localhost only.", "Siempre."),
    ], "Tres pocs de lab o huecos.", "No PayloadsAllTheThings entero."),
    ex("Ejemplo 2 — 403 vs 404 vs 401", "Papel 2 min.", [
      st("Existe-niega / no está / falta authn.", "Examen."),
      st("Una frase cada uno.", "Listo."),
      st("Cierra web.", "Simulacro final es otra clase."),
    ], "Tres códigos.", "No son SMB."),
  ],
  "c12-d4": [
    ex("Ejemplo 1 — Simulacro final interno", "Mismas reglas que el full.", [
      st("Tiempo, umbral, no repetir el mismo día si suspendes.", "Disciplina."),
      st("Mezcla Mes 1+2+3. Fallidas → remediación, no 'ya lo pillé'.", "Honesto."),
      st("Cierra YouTube.", "El mezclador eres tú."),
    ], "Intento registrado.", "No es skill-check de 5."),
    ex("Ejemplo 2 — After action final", "5 líneas.", [
      st("Tipos fallados. Jornadas a repetir.", "Plan T-7 si hay fecha."),
      st("No 20 repos nuevos.", "RABBIT off."),
      st("Lab o descanso.", "Oficio."),
    ], "Plan corto.", "Instalar BloodHound no es remediación eJPT."),
  ],
  "c12-d5": [
    ex("Ejemplo 1 — Caja relámpago 40 min", "Timer. Una VM.", [
      st("Discovery → enum → un vector match → loot pregunta.", "Para cuando suene."),
      st("Notas durante. Completar preguntas > root.", "eJPT."),
      st("Stop. Debrief 5 min.", "Reloj."),
    ], "40 min cumplidos.", "No extiendas a 3 h 'porque iba ganando'."),
    ex("Ejemplo 2 — Debrief", "¿Qué fase comió el tiempo?", [
      st("Esa es la jornada si aún hay días.", "Fino."),
      st("Si fue rabbit GitHub: timer más cruel.", "Hoyo."),
      st("Cierra la caja.", "Última semana."),
    ], "Fase nombrada.", "Heroísmo extra no puntúa."),
  ],
  "c12-d6": [
    ex("Ejemplo 1 — Cierre del trimestre", "Hoja final.", [
      st("Método: alcance, medir, una superficie, evidencia.", "Eso se lleva a cualquier cert."),
      st("Esta web: plan, labs aislados, fuentes con timer. INE puntúa su lab.", "Honestidad."),
      st("¿Jornadas hechas o hojeadas? Esa diferencia es el oficio.", "Contigo."),
    ], "Hoja.", "PDF no está garantizado."),
    ex("Ejemplo 2 — Después", "Una rama si sigues.", [
      st("Web o interno. UNA. awesome-pentest para elegir, no 30.", "Mapa."),
      st("AD/BloodHound = RABBIT consciente, no compulsión.", "Scope."),
      st("Cierra el curso o la última cadena en MS2. GitHub off.", "El examen es un mezclador. Ejecuta."),
    ], "Decisión o cierre.", "secret-knowledge no es eJPT."),
  ],
};

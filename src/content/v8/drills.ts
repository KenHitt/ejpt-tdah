import { DecisionScenario } from "@/lib/types";
import { V9_ALL_DRILLS, V9_DRILLS_BY_SKILL } from "@/content/v9/drills";
import { V91_ALL_DRILLS, V91_DRILLS_BY_SKILL } from "@/content/v91/drills";

const LAB = "Solo contra tu lab autorizado (Host-Only / DVWA local / alcance escrito).";

function mc(
  id: string,
  promptEs: string,
  choices: DecisionScenario["checks"][0]["choices"],
  extra: Partial<DecisionScenario["checks"][0]> = {}
): DecisionScenario["checks"][0] {
  const ok = choices?.find((c) => c.ok);
  return {
    id,
    promptEs,
    choices,
    explanationEs: ok?.whyRightEs ?? extra.explanationEs ?? "",
    failKind: extra.failKind ?? "reasoning",
    subtopicId: extra.subtopicId ?? "tool-selection",
    domain: extra.domain,
    critical: extra.critical,
    justifyPromptEs: extra.justifyPromptEs,
    justifyKeywords: extra.justifyKeywords,
    whatMissedEs: extra.whatMissedEs,
    betterApproachEs: extra.betterApproachEs,
    evidenceEs: extra.evidenceEs,
    hints: extra.hints,
    walkthroughEs: extra.walkthroughEs,
    pedagogy: extra.pedagogy,
  };
}

export const LINUX_PERM_DRILL: DecisionScenario = {
  id: "linux-perm-denied",
  titleEs: "Permission denied",
  setupEs: `${LAB}\n\nEn la víctima Linux: cat /etc/shadow → Permission denied. id muestra uid=1000(user).`,
  checks: [
    mc(
      "next",
      "¿Siguiente movimiento metodológico?",
      [
        {
          id: "a",
          textEs: "A. Insistir con sudo su sin evidencia.",
          whyWrongEs: "No hay evidencia de sudo. Denied es hallazgo, no un 404 que se ignora.",
        },
        {
          id: "b",
          textEs: "B. Anotar el denied y enumerar vectores (sudo -l, SUID, cron) según contexto.",
          ok: true,
          whyRightEs: "Denied en shadow es esperado para user. Siguiente = enumerar privilegios, no adivinar root.",
        },
        {
          id: "c",
          textEs: "C. Lanzar un exploit de kernel aleatorio.",
          whyWrongEs: "Sin uname -a interpretado y sin match, es lotería y puede tumbar el lab.",
        },
      ],
      {
        subtopicId: "linux-basic",
        domain: "linux",
        evidenceEs: "uid=1000 + /etc/shadow denied.",
        whatMissedEs: "Denied confirma que no eres root; no es un error de comando.",
        betterApproachEs: "id → sudo -l / SUID. Kernel solo con evidencia.",
        justifyPromptEs: "¿Por qué no kernel a ciegas?",
        justifyKeywords: ["sudo", "suid", "evidencia", "contexto", "denied"],
      }
    ),
  ],
};

export const VULN_MATCH_DRILL: DecisionScenario = {
  id: "vuln-version-match",
  titleEs: "Versión cercana",
  setupEs: `${LAB}\n\nnmap -sV: Apache 2.4.41. searchsploit muestra un hit de 2.4.49 (path traversal).`,
  checks: [
    mc(
      "hyp",
      "¿Qué hipótesis es honesta?",
      [
        {
          id: "a",
          textEs: "A. Es el mismo CVE. Explotar ya.",
          whyWrongEs: "2.4.41 ≠ 2.4.49. Un hit cercano no es garantía. False positive existe.",
        },
        {
          id: "b",
          textEs: "B. Candidato ≠ confirmado. Verificar versión/path y buscar match exacto o enum HTTP.",
          ok: true,
          whyRightEs: "Vuln analysis = match + validar. Enumerar el sitio puede importar más que el .c de otra versión.",
        },
        {
          id: "c",
          textEs: "C. Ignorar HTTP porque 'no hay exploit'.",
          whyWrongEs: "80 sigue siendo superficie (dirs, params). Vuln ≠ único camino.",
        },
      ],
      {
        subtopicId: "vuln-assessment",
        domain: "vuln",
        evidenceEs: "Banner 2.4.41 vs hit 2.4.49.",
        whatMissedEs: "La distancia de versión.",
        betterApproachEs: "Confirmar versión, enum HTTP, no gcc del PoC ajeno.",
      }
    ),
  ],
};

export const MSF_LHOST_DRILL: DecisionScenario = {
  id: "msf-lhost-wrong-nic",
  titleEs: "Módulo listo, sesión no",
  setupEs: `${LAB}\n\nshow options: RHOSTS = IP de MS2. LHOST = 192.168.1.24 (wlan0). El módulo 'corre' pero no hay session.`,
  checks: [
    mc(
      "why",
      "¿Cuál es el fallo más probable?",
      [
        {
          id: "a",
          textEs: "A. El exploit 'ya no funciona en 2026'.",
          whyWrongEs: "Antes de eso: LHOST está en otra NIC. La víctima Host-Only no alcanza wlan0.",
        },
        {
          id: "b",
          textEs: "B. LHOST debe ser la IP de Kali en la red del lab (vboxnet), no Wi‑Fi.",
          ok: true,
          whyRightEs: "Reverse llama a LHOST. Si LHOST no es alcanzable, no hay session. options son el examen.",
        },
        {
          id: "c",
          textEs: "C. Cambiar RHOSTS a 127.0.0.1.",
          whyWrongEs: "RHOSTS es la víctima, no loopback de Kali.",
        },
      ],
      {
        subtopicId: "msf-lhost-lport",
        domain: "metasploit",
        evidenceEs: "LHOST = wlan0 mientras el lab es Host-Only.",
        whatMissedEs: "Alcance de la reverse.",
        betterApproachEs: "ip addr en vboxnet0 → set LHOST.",
        failKind: "technical",
      }
    ),
  ],
};

export const WEB_CHAIN_LOGIN_DRILL: DecisionScenario = {
  id: "web-chain-login",
  titleEs: "Cadena web: login",
  setupEs: `${LAB}\n\nGobuster: /login.php (200). GET sin parámetros. El form POST user= & pass=.`,
  checks: [
    mc(
      "next",
      "¿Siguiente paso de menor riesgo?",
      [
        {
          id: "a",
          textEs: "A. sqlmap contra / sin parámetro.",
          whyWrongEs: "No hay param en GET /. El input está en POST del login.",
        },
        {
          id: "b",
          textEs: "B. Inspeccionar el form, probar input manual (authn), luego inyección si el parámetro existe.",
          ok: true,
          whyRightEs: "HTTP → dir → login → parámetro. Manual antes que la tool. 80 open ≠ SQLi.",
        },
        {
          id: "c",
          textEs: "C. Hydra SSH porque hay un login.",
          whyWrongEs: "El login es HTTP. 22 no aparece en este escenario.",
        },
      ],
      {
        subtopicId: "web-auth-bypass",
        domain: "web",
        evidenceEs: "/login.php + POST user/pass.",
        whatMissedEs: "El parámetro vive en el POST.",
        betterApproachEs: "Burp/ZAP o curl -X POST. Luego hipótesis SQLi/creds.",
      }
    ),
  ],
};

export const SQLI_MANUAL_DRILL: DecisionScenario = {
  id: "sqli-manual-first",
  titleEs: "¿sqlmap ya?",
  setupEs: `${LAB}\n\nhttp://127.0.0.1:4280/vulnerabilities/sqli/?id=1 (DVWA). La página refleja 'User ID'.`,
  checks: [
    mc(
      "first",
      "Primera acción",
      [
        {
          id: "a",
          textEs: "A. sqlmap -u la URL con crawl a todo el host.",
          whyWrongEs: "Crawl ciego pierde el reloj. Ya tienes un parámetro id.",
        },
        {
          id: "b",
          textEs: "B. Probar el parámetro a mano (comilla, lógica) y observar error/diferencia.",
          ok: true,
          whyRightEs: "Manual primero. sqlmap después, apuntando al param, en lab autorizado.",
        },
        {
          id: "c",
          textEs: "C. XSS porque se refleja texto.",
          whyWrongEs: "El contexto es ID SQL. Reflejo ≠ XSS stored. Distingue el sink.",
        },
      ],
      {
        subtopicId: "web-sqli",
        domain: "sqli",
        evidenceEs: "param id= en SQLi lesson de DVWA.",
        whatMissedEs: "El parámetro ya está identificado.",
        betterApproachEs: "Una comilla. Observa. Luego tool si procede.",
      }
    ),
  ],
};

export const XSS_CONTEXT_DRILL: DecisionScenario = {
  id: "xss-not-sqli",
  titleEs: "Reflejo en HTML",
  setupEs: `${LAB}\n\nUn campo de búsqueda refleja <b>test</b> en el HTML. No hay error SQL.`,
  checks: [
    mc(
      "kind",
      "¿Qué testers primero?",
      [
        {
          id: "a",
          textEs: "A. Payload XSS de contexto HTML (reflected), no sqlmap.",
          ok: true,
          whyRightEs: "Sink HTML. XSS corre en el navegador. No es SQLi por defecto.",
        },
        {
          id: "b",
          textEs: "B. UNION SELECT porque 'se refleja'.",
          whyWrongEs: "Reflejo HTML no es un error de SQL. Distingue sink.",
        },
        {
          id: "c",
          textEs: "C. LFI a /etc/passwd.",
          whyWrongEs: "No hay include/path. El hallazgo es output en página.",
        },
      ],
      {
        subtopicId: "web-xss",
        domain: "xss",
        evidenceEs: "HTML refleja markup.",
        whatMissedEs: "El sink es el navegador.",
        betterApproachEs: "Clasifica reflected vs stored. Prueba en lab DVWA.",
      }
    ),
  ],
};

export const LFI_NOT_RCE_DRILL: DecisionScenario = {
  id: "lfi-not-rce",
  titleEs: "passwd es el ping",
  setupEs: `${LAB}\n\npage=../../../../etc/passwd muestra usuarios. No hay código PHP ejecutado.`,
  checks: [
    mc(
      "claim",
      "¿Qué afirmas con honestidad?",
      [
        {
          id: "a",
          textEs: "A. Ya tengo RCE.",
          whyWrongEs: "Leer passwd es LFI. LFI ≠ RCE. Falta un vector de ejecución (log, wrapper, upload).",
        },
        {
          id: "b",
          textEs: "B. LFI confirmado. Siguiente: ver si hay camino a ejecución, o loot de archivos.",
          ok: true,
          whyRightEs: "Evidencia de include local. RCE es otra hipótesis, no un salto automático.",
        },
        {
          id: "c",
          textEs: "C. Es RFI porque hay puntos ../",
          whyWrongEs: "RFI es include remoto (http://). ../ es traversal local.",
        },
      ],
      {
        subtopicId: "web-lfi-rfi",
        domain: "lfi",
        evidenceEs: "etc/passwd leído.",
        whatMissedEs: "Lectura ≠ ejecución.",
        betterApproachEs: "Documenta LFI. Luego wrappers/logs solo en lab y con método.",
      }
    ),
  ],
};

export const WEB_UPLOAD_CHAIN: DecisionScenario = {
  id: "web-chain-upload",
  titleEs: "Cadena: upload",
  setupEs: `${LAB}\n\n/uploads permite ficheros. Subes .jpg OK. .php bloqueado. Extensión .php.jpg dudosa.`,
  checks: [
    mc(
      "order",
      "Orden metodológico",
      [
        {
          id: "a",
          textEs: "A. Tipo → filtro → bypass de extensión/MIME → dónde se sirve → ejecución. No 'shell ya'.",
          ok: true,
          whyRightEs: "HTTP → upload → análisis de tipo → bypass → ejecución. Cada paso necesita evidencia.",
        },
        {
          id: "b",
          textEs: "B. Meterpreter ya: el formulario existe.",
          whyWrongEs: "Formulario ≠ RCE. El filtro puede ser real.",
        },
        {
          id: "c",
          textEs: "C. SQLi en el nombre del archivo sin mirar el upload.",
          whyWrongEs: "Puede existir, pero el escenario apunta a file type. No cambies de superficie sin motivo.",
        },
      ],
      {
        subtopicId: "web-auth-bypass",
        domain: "web",
        evidenceEs: "jpg ok, php bloqueado.",
        whatMissedEs: "El control de tipo.",
        betterApproachEs: "Entiende el filtro. Bypass es hipótesis. Ejecución solo si se sirve como código.",
      }
    ),
  ],
};

export const LINUX_PRIVESC_DRILL: DecisionScenario = {
  id: "linux-privesc-sudo",
  titleEs: "sudo -l ruidoso",
  setupEs: `${LAB}\n\nsudo -l: (ALL) NOPASSWD: /usr/bin/vim. LinPEAS también grita 20 SUID.`,
  checks: [
    mc(
      "pick",
      "¿Qué priorizas?",
      [
        {
          id: "a",
          textEs: "A. Los 20 SUID antes que vim sudo.",
          whyWrongEs: "NOPASSWD vim es un vector claro (GTFO). No te ahogues en el dump de LinPEAS.",
        },
        {
          id: "b",
          textEs: "B. Verificar el sudo de vim (método GTFO) porque es evidencia directa.",
          ok: true,
          whyRightEs: "Prioriza la señal más barata. LinPEAS clasifica; tú eliges.",
        },
        {
          id: "c",
          textEs: "C. Hashdump sin ser root.",
          whyWrongEs: "shadow sigue denied. Post de hashes viene después de privilegio.",
        },
      ],
      {
        subtopicId: "privesc-linux",
        domain: "privesc-linux",
        evidenceEs: "NOPASSWD vim.",
        whatMissedEs: "La línea sudo es más fuerte que 20 SUID sin contexto.",
        betterApproachEs: "Un vector verificable. Luego loot.",
      }
    ),
  ],
};

export const WIN_PRIVESC_DRILL: DecisionScenario = {
  id: "win-token-first",
  titleEs: "Windows: token antes que potato",
  setupEs: `${LAB}\n\nwhoami = lab\\user. whoami /priv: SeImpersonatePrivilege Enabled. No hay BloodHound.`,
  checks: [
    mc(
      "hyp",
      "Hipótesis razonable",
      [
        {
          id: "a",
          textEs: "A. Lanzar cualquier potato sin entender el privilegio.",
          whyWrongEs: "El privilegio sugiere una familia de vectores, no un exe mágico. En eJPT: modelo mental, no el PC de la familia.",
        },
        {
          id: "b",
          textEs: "B. Documentar usuario, grupos, privilegios. Relacionar SeImpersonate con servicio/contexto. Solo lab autorizado.",
          ok: true,
          whyRightEs: "Enum Windows: users, groups, privileges, services. El nombre del exploit viene después.",
        },
        {
          id: "c",
          textEs: "C. net user /domain contra un lab sin AD.",
          whyWrongEs: "Puede fallar o irse de alcance. Primero local.",
        },
      ],
      {
        subtopicId: "privesc-windows",
        domain: "privesc-windows",
        evidenceEs: "SeImpersonate enabled.",
        whatMissedEs: "El token es la evidencia.",
        betterApproachEs: "whoami /all, net user, services. Hipótesis, luego técnica en lab.",
      }
    ),
  ],
};

export const POST_LOOT_DRILL: DecisionScenario = {
  id: "post-what-changes",
  titleEs: "Qué loot cambia el next step",
  setupEs: `${LAB}\n\nsysinfo: Linux. getuid: user. En /home/user hay id_rsa y un .bash_history con un password de MySQL local.`,
  checks: [
    mc(
      "use",
      "¿Qué dato cambia la siguiente decisión?",
      [
        {
          id: "a",
          textEs: "A. Solo el ASCII art de motd.",
          whyWrongEs: "No cambia el ataque.",
        },
        {
          id: "b",
          textEs: "B. La clave SSH y/o el password de servicio: reutilización y movimiento lateral/local.",
          ok: true,
          whyRightEs: "Loot útil = credenciales y contexto. Anota strings exactos para el cuestionario.",
        },
        {
          id: "c",
          textEs: "C. Formatear el disco para 'limpiar'.",
          whyWrongEs: "No destruyas evidencia ni el lab.",
        },
      ],
      {
        subtopicId: "post-exploit-loot",
        domain: "post",
        evidenceEs: "id_rsa + password en history.",
        whatMissedEs: "Creds > ruido.",
        betterApproachEs: "Reutilizar con permiso del scope. Anota el valor exacto.",
      }
    ),
  ],
};

export const PIVOT_TOPOLOGY_DRILL: DecisionScenario = {
  id: "pivot-topology",
  titleEs: "¿Kali ve el target?",
  setupEs: `${LAB}\n\nKali vboxnet0 192.168.56.10. Víctima eth0 192.168.56.20 y eth1 10.13.13.1. Target interno 10.13.13.50. Desde Kali: ping 10.13.13.50 timeout.`,
  output: `KALI (192.168.56.10)
    |
 PIVOT (56.20 + 10.13.13.1)
    |
 INTERNAL (10.13.13.0/24)
    |
 TARGET (10.13.13.50)`,
  checks: [
    mc(
      "need",
      "¿Necesitas pivot?",
      [
        {
          id: "a",
          textEs: "A. No: nmap -sn 10.13.13.0/24 desde Kali igual.",
          whyWrongEs: "Kali no tiene ruta a 10.13.13.0. El ping ya falló.",
        },
        {
          id: "b",
          textEs: "B. Sí: el target no es alcanzable desde Kali. Forward/SOCKS/ruta vía el dual-homed.",
          ok: true,
          whyRightEs: "Pivot identification = reachability. ip addr en el hop. Luego -L o -D, no nmap mágico.",
        },
        {
          id: "c",
          textEs: "C. Pivot al Wi‑Fi de casa porque 'es otra red'.",
          whyWrongEs: "Fuera de scope. Nunca.",
        },
      ],
      {
        subtopicId: "net-pivoting",
        domain: "pivoting",
        evidenceEs: "ping interno timeout + segunda NIC en la víctima.",
        whatMissedEs: "Dos subnets en el hop.",
        betterApproachEs: "Dibuja topología. Luego un forward concreto.",
      }
    ),
  ],
};

export const REPORTING_DRILL: DecisionScenario = {
  id: "report-short-answer",
  titleEs: "Estilo pregunta corta",
  setupEs: `${LAB}\n\nEl brief pregunta: 'What is the SSH user with UID 0 equivalent on this box?' Tú viste root en /etc/passwd.`,
  checks: [
    mc(
      "write",
      "¿Qué entregas?",
      [
        {
          id: "a",
          textEs: "A. Un párrafo sobre la historia de Unix.",
          whyWrongEs: "No puntúa. El string es root (o el user exacto).",
        },
        {
          id: "b",
          textEs: "B. El valor exacto observado (p. ej. root) con evidencia del archivo.",
          ok: true,
          whyRightEs: "Pregunta → evidencia → string. eJPT no es un ensayo.",
        },
        {
          id: "c",
          textEs: "C. 'admin' porque 'suele ser'.",
          whyWrongEs: "Inventar. Lee passwd.",
        },
      ],
      {
        subtopicId: "reporting",
        domain: "reporting",
        evidenceEs: "/etc/passwd.",
        whatMissedEs: "El formato de respuesta corta.",
        betterApproachEs: "Copia el campo. No literatura.",
      }
    ),
  ],
};

export const EXAM_PREP_DRILL: DecisionScenario = {
  id: "exam-triage",
  titleEs: "Reloj: dos boxes",
  setupEs: `${LAB}\n\nQuedan 90 min. Box A: 80+445, ya enum SMB con users. Box B: no has hecho ni ping. Integridad: no dumps.`,
  checks: [
    mc(
      "triage",
      "¿Triage?",
      [
        {
          id: "a",
          textEs: "A. Empezar B desde cero y abandonar A con users ya listos.",
          whyWrongEs: "A está a un paso de hipótesis. B puede ser 40 min de recon.",
        },
        {
          id: "b",
          textEs: "B. Cerrar A con el next step barato (usar users / HTTP) y solo luego abrir B si hay margen.",
          ok: true,
          whyRightEs: "Triage: valor esperado. No abras 5 pestañas nuevas. Integridad intacta.",
        },
        {
          id: "c",
          textEs: "C. Buscar un dump del examen.",
          whyWrongEs: "Prohibido. La academia no es INE y no copia dumps.",
        },
      ],
      {
        subtopicId: "exam-logistics",
        domain: "exam-prep",
        evidenceEs: "A ya enumerada; 90 min.",
        whatMissedEs: "Coste de cambiar de box.",
        betterApproachEs: "Termina la superficie caliente. Integridad.",
      }
    ),
  ],
};

export const EXPLOIT_MOD_DRILL: DecisionScenario = {
  id: "exploit-mod-vars",
  titleEs: "Leer un template (no es un exploit listo)",
  setupEs: `${LAB}\n\nFragmento educativo (NO ejecutar contra nada real):\n# TEMPLATE\n# RHOST = target\n# RPORT = 80\n# LHOST = attacker\n# LPORT = 4444\n# PAYLOAD = reverse\nEl archivo es un ejemplo de placeholders. No es un 0-day.`,
  output: `RHOST = "CHANGE_ME"
LHOST = "CHANGE_ME"
LPORT = 4444
# URI/PATH = /vulnerable`,
  checks: [
    mc(
      "vars",
      "Antes de pensar en 'run', ¿qué haces?",
      [
        {
          id: "a",
          textEs: "A. Identificar RHOST/RPORT/LHOST/LPORT/PATH y sustituir por valores de TU lab (ip addr).",
          ok: true,
          whyRightEs: "READ → understand → identify variables → modify → (solo lab) → troubleshoot. No es exploit dev avanzado.",
        },
        {
          id: "b",
          textEs: "B. Dejar CHANGE_ME y esperar que 'el script detecte'.",
          whyWrongEs: "CHANGE_ME no es una IP. El fallo será de configuración, no de 'la vuln'.",
        },
        {
          id: "c",
          textEs: "C. Pegarlo en producción para ver.",
          whyWrongEs: "Ilegal e inútil. Solo lab autorizado.",
        },
      ],
      {
        subtopicId: "msf-lhost-lport",
        domain: "exploit-mod",
        evidenceEs: "Placeholders CHANGE_ME.",
        whatMissedEs: "Las variables son el trabajo.",
        betterApproachEs: "Lista RHOST, LHOST, puerto, URI. Mide IPs. No copies dumps.",
      }
    ),
  ],
};

export const OSINT_STRATEGY_DRILL: DecisionScenario = {
  id: "osint-changes-strategy",
  titleEs: "¿La info pública cambia el plan?",
  setupEs: `${LAB}\n\nWHOIS/DNS (concepto, alcance autorizado): el dominio usa un WAF comercial y un correo @corp. El lab eJPT/Host-Only no es ese dominio. Pregunta de transferencia: qué harías si el brief mencionara tecnología pública.`,
  checks: [
    mc(
      "use",
      "¿Para qué sirve OSINT aquí?",
      [
        {
          id: "a",
          textEs: "A. Para nmappear Internet entera.",
          whyWrongEs: "Fuera de alcance. OSINT no autoriza scan masivo.",
        },
        {
          id: "b",
          textEs: "B. Para ajustar hipótesis (tecnología, usuarios, docs) DENTRO del scope. No sustituye Host-Only.",
          ok: true,
          whyRightEs: "¿Qué información pública puede cambiar mi estrategia? Users, stack, no 'el mapa mundial'.",
        },
        {
          id: "c",
          textEs: "C. Da igual: siempre Hydra.",
          whyWrongEs: "Sin usuarios y fuera de contexto es ruido.",
        },
      ],
      {
        subtopicId: "passive-recon",
        domain: "osint",
        evidenceEs: "Tecnología y emails públicos (concepto).",
        whatMissedEs: "OSINT alimenta enum, no reemplaza el lab.",
        betterApproachEs: "Anota stack/users. Luego el CIDR autorizado.",
      }
    ),
  ],
};

export const ATTACK_CHAIN_SRS: DecisionScenario = {
  id: "chain-80-445-22",
  titleEs: "Attack chain SRS: 80 · 445 · 22",
  setupEs: `${LAB}\n\nDescubriste: 80, 445, 22. Sin versiones aún.`,
  checks: [
    {
      id: "know",
      promptEs: "¿Qué sabes? ¿Qué no sabes?",
      keywordAny: [["80"], ["445"], ["22"], ["version"], ["no version"], ["open"]],
      explanationEs: "Sabes tres TCP open. No sabes versión, users, rutas, ni vuln. Esa diferencia es el método.",
      failKind: "reasoning",
      subtopicId: "full-chain",
      domain: "chains",
      whatMissedEs: "open ≠ explotado.",
      betterApproachEs: "Lista evidencias vs huecos.",
    },
    {
      id: "next",
      promptEs: "¿Lowest-risk next step y por qué? (una superficie, no las tres a la vez)",
      keywordAny: [["enum"], ["smb"], ["http"], ["-sV"], ["version"]],
      explanationEs: "Evidencia: 445 o 80 son enum barato. 22 brute no. Completar -sV si falta versión es válido.",
      failKind: "reasoning",
      subtopicId: "full-chain",
      domain: "chains",
      evidenceEs: "Tres puertos, cero versiones.",
      whatMissedEs: "Prioridad.",
      betterApproachEs: "Una pregunta: users SMB o dirs HTTP o -sV.",
    },
  ],
};

export const LAB_SCOPE_DRILL: DecisionScenario = {
  id: "lab-scope-nic",
  titleEs: "Cuál es LHOST",
  setupEs: `${LAB}\n\nip addr: wlan0 192.168.1.24, vboxnet0 192.168.56.1, lo 127.0.0.1. Víctima 192.168.56.101.`,
  checks: [
    mc(
      "lhost",
      "¿LHOST para reverse al guest?",
      [
        {
          id: "a",
          textEs: "A. 127.0.0.1",
          whyWrongEs: "Loopback de Kali. El guest no conecta ahí como 'tu IP de lab'.",
        },
        {
          id: "b",
          textEs: "B. 192.168.56.1 (vboxnet0)",
          ok: true,
          whyRightEs: "Misma subnet Host-Only. Mide, no copies un tutorial.",
        },
        {
          id: "c",
          textEs: "C. 192.168.1.24 (wlan0)",
          whyWrongEs: "El guest Host-Only no sale a tu Wi‑Fi por diseño.",
        },
      ],
      {
        subtopicId: "lab-vbox",
        domain: "lab",
        failKind: "technical",
        evidenceEs: "Tres NICs distintas.",
        whatMissedEs: "La NIC del lab.",
        betterApproachEs: "ip addr + ping a la víctima.",
      }
    ),
  ],
};

const BY_SKILL: Record<string, DecisionScenario[]> = {
  lab: [LAB_SCOPE_DRILL],
  linux: [LINUX_PERM_DRILL],
  vuln: [VULN_MATCH_DRILL],
  metasploit: [MSF_LHOST_DRILL],
  web: [WEB_CHAIN_LOGIN_DRILL, WEB_UPLOAD_CHAIN],
  sqli: [SQLI_MANUAL_DRILL],
  xss: [XSS_CONTEXT_DRILL],
  lfi: [LFI_NOT_RCE_DRILL],
  "privesc-linux": [LINUX_PRIVESC_DRILL],
  "privesc-windows": [WIN_PRIVESC_DRILL],
  post: [POST_LOOT_DRILL],
  pivoting: [PIVOT_TOPOLOGY_DRILL],
  reporting: [REPORTING_DRILL],
  "exam-prep": [EXAM_PREP_DRILL],
  "exploit-mod": [EXPLOIT_MOD_DRILL],
  osint: [OSINT_STRATEGY_DRILL],
  chains: [ATTACK_CHAIN_SRS],
  smb: [],
  nmap: [],
  enumeration: [],
  "http-enum": [],
  exploitation: [],
  networking: [],
  recon: [OSINT_STRATEGY_DRILL],
};

export function drillsForSkill(skillId: string): DecisionScenario[] {
  return [...(BY_SKILL[skillId] ?? []), ...(V9_DRILLS_BY_SKILL[skillId] ?? []), ...(V91_DRILLS_BY_SKILL[skillId] ?? [])];
}

export const V8_ALL_DRILLS: DecisionScenario[] = [
  LAB_SCOPE_DRILL,
  LINUX_PERM_DRILL,
  VULN_MATCH_DRILL,
  MSF_LHOST_DRILL,
  WEB_CHAIN_LOGIN_DRILL,
  WEB_UPLOAD_CHAIN,
  SQLI_MANUAL_DRILL,
  XSS_CONTEXT_DRILL,
  LFI_NOT_RCE_DRILL,
  LINUX_PRIVESC_DRILL,
  WIN_PRIVESC_DRILL,
  POST_LOOT_DRILL,
  PIVOT_TOPOLOGY_DRILL,
  REPORTING_DRILL,
  EXAM_PREP_DRILL,
  EXPLOIT_MOD_DRILL,
  OSINT_STRATEGY_DRILL,
  ATTACK_CHAIN_SRS,
  ...V9_ALL_DRILLS,
  ...V91_ALL_DRILLS,
];

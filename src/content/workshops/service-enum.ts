import { TroubleItem, WorkshopSection } from "@/lib/types";

/** m1-w2-b1 — 445/139. No es Gobuster ni Hydra. */
export const ENUM_SMB_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. ¿Qué es enumerar SMB?",
    titleEn: "What SMB enum is",
    bodyEs:
      "SMB (445/tcp, a veces 139) comparte archivos y, en Samba/Windows, usuarios, workgroup y política de passwords. Enumerar = extraer esa información, a menudo SIN password (null session).\n\nenum4linux automatiza consultas RPC/SMB. No entra al share como shell. No busca /admin en HTTP. No prueba contraseñas.\n\nYa tienes (Semana 1) nmap -sV / smb-os-discovery. Eso es el MAPA. Hoy es el CONTENIDO del servicio.",
    diagram: `445/tcp open  microsoft-ds
  →  enum4linux   (usuarios, shares, política)
  →  NO gobuster  (eso es 80/443)
  →  NO hydra     (aún no hay login que probar)`,
  },
  {
    id: "why",
    titleEs: "02. ¿Por qué importa?",
    titleEn: "Why it matters",
    bodyEs:
      "eJPT pregunta SMB porque un share anónimo o una lista de usuarios cambia el resto del box. Un usuario válido es input de Hydra (después). Un share WRITE es evidencia, no 'explotar Samba a ciegas'.\n\nWHAT: inventario SMB.\nWHY: tu hueco declarado: no mezclar herramientas.\nWHEN: 139 o 445 open en TARGET_MS2 (Host-Only).\nOUTPUT: workgroup, users, shares, password policy (si sale).\nNEXT: smbclient/smbmap para ENTRAR al share. Metasploit Semana 3, no hoy.",
  },
  {
    id: "flags",
    titleEs: "03. Flags: -a, -U, -S, -P",
    titleEn: "Flags -a -U -S -P",
    bodyEs:
      "-a WHAT: todas las comprobaciones. WHY: examen/tiempo. WHEN: primer pase. OUTPUT: volcado largo. NEXT: extrae 3 líneas a ~/ejpt-lab.txt (no dejes solo la terminal).\n\n-U WHAT: usuarios. WHY: lista para SSH/FTP/Hydra luego. WHEN: -a es ruido y solo quieres users.\n-S WHAT: shares. WHY: nombres de carpetas. WHEN: vas a smbclient.\n-P WHAT: política de passwords. WHY: complejidad / lockout. WHEN: el brief lo pide.\n\nCorre contra TARGET_MS2, no 127.0.0.1 ni 192.168.1.0/24.",
  },
  {
    id: "read",
    titleEs: "04. Cómo leer el output",
    titleEn: "How to read output",
    bodyEs:
      "Busca bloques: 'Workgroup', 'Users', 'Share', 'Password Policy'. 'anonymous' o IPC$ no son 'ya tengo shell'. IPC$ es canal RPC, no un tesoro.\n\nSi todo falla: SMBv1 cerrado, credenciales requeridas, o no es SMB (puerto mal). Entonces nmap -sV -p139,445 otra vez — no relances -a en bucle.\n\nWHAT: texto estructurado.\nWHY: el examen pide un dato (usuario, share), no el dump entero.\nWHEN: termina -a.\nOUTPUT: 3 hallazgos escritos.\nNEXT: bloque smbclient.",
  },
  {
    id: "optional",
    titleEs: "05. ADVANCED / OPTIONAL — rpcclient, crackmapexec",
    titleEn: "Optional SMB tools",
    optional: true,
    bodyEs:
      "rpcclient -U '' -N y CME/nxc son el mismo trabajo con otra UI. eJPT se aprueba con enum4linux + smbclient. No conviertas esto en OSCP AD.",
  },
];

/** m1-w2-b2 */
export const ENUM_SMB_MANUAL_WORKSHOP: WorkshopSection[] = [
  {
    id: "what",
    titleEs: "01. smbclient vs smbmap vs enum4linux",
    titleEn: "Three SMB tools",
    bodyEs:
      "enum4linux = informe. smbclient = cliente tipo FTP (ls, get, put). smbmap = tabla READ/WRITE por share.\n\nWHAT: entrar y permisos, no otro nmap.\nWHY: -a no te descarga un archivo. El examen puede pedir el contenido de un share.\nWHEN: ya listaste shares (enum4linux -S o smbclient -L).\nOUTPUT: archivo en Kali o línea READ/WRITE.\nNEXT: si hay login SMB con user/pass, Hydra/smb — solo si el brief lo pide. Hoy: -N (null).",
    diagram: `enum4linux -a     →  mapa
smbclient -L -N  →  nombres de shares
smbclient //IP/share -N  →  ls / get
smbmap -H IP     →  READ vs WRITE`,
  },
  {
    id: "smbclient",
    titleEs: "02. smbclient — WHAT/WHY/WHEN",
    titleEn: "smbclient",
    bodyEs:
      "-L WHAT: lista shares. -N WHAT: no pidas password (null session).\nWHY: MS2 y muchos labs eJPT tienen algo anónimo.\nWHEN: 445 open.\nOUTPUT: Sharename Type Comment.\nNEXT: smbclient //IP/NOMBRE -N — el nombre es el share, no '445'.\n\nDentro: ls, cd, get archivo, exit. Prompt smb:\\\\> = estás DENTRO del share, no en Kali. get copia a tu cwd de Kali.\n\n//IP/share es UNC. No http://.",
  },
  {
    id: "smbmap",
    titleEs: "03. smbmap -H",
    titleEn: "smbmap",
    bodyEs:
      "WHAT: un renglón por share con Disk READ WRITE.\nWHY: sabes dónde tiene sentido get/put.\nWHEN: varios shares y poco tiempo.\nOUTPUT: READ only vs READ, WRITE.\nNEXT: smbclient al share WRITE o al que tenga archivos. No Metasploit porque ves WRITE.",
  },
  {
    id: "optional",
    titleEs: "04. ADVANCED / OPTIONAL — credenciales, SMBv1",
    titleEn: "Optional",
    optional: true,
    bodyEs:
      "smbclient -U user%pass y versiones de dialecto importan en Windows reales. Hoy: null session en TU MS2. Forzar SMBv1 solo si el lab lo exige; no lo dejes como hábito en tu red de casa.",
  },
];

/** m1-w2-b6 — FTP 21 y SSH 22. Enum, no exploit. */
export const ENUM_FTP_SSH_WORKSHOP: WorkshopSection[] = [
  {
    id: "order",
    titleEs: "01. Orden (no mezclar con SMB/web)",
    titleEn: "Order of operations",
    bodyEs:
      "21/tcp → FTP. Pregunta: ¿anonymous? ¿qué versión?\n22/tcp → SSH. Pregunta: ¿banner/versión? ¿puedo entrar con un user que YA conozco (msfadmin en MS2)? Hydra es DESPUÉS, con usuario, no el primer comando.\n\n80 → Gobuster (otro bloque). 445 → enum4linux (ya).\n\nNmap -sV / ftp-anon ya lo viste. Hoy: cliente ftp, nc al banner, searchsploit como ÍNDICE, no como PoC.",
    diagram: `21  →  nc banner → ftp anonymous → nmap ftp-anon
22  →  nmap -sV  →  ssh user@IP si tienes user
     →  Hydra solo con -l usuario  (bloque Hydra)
NO  →  vsftpd backdoor / Metasploit hoy`,
  },
  {
    id: "ftp",
    titleEs: "02. FTP — anonymous y banner",
    titleEn: "FTP enum",
    bodyEs:
      "WHAT: servicio de archivos en 21. anonymous = usuario 'anonymous', password vacío o email ficticio.\nWHY: listar/get sin credenciales reales.\nWHEN: 21 open en el scan.\nOUTPUT: '230 Login successful' o rechazo; ls de archivos.\nNEXT: get lo interesante a Kali. Si no hay anon: anota la versión (vsftpd x.y) y searchsploit — Semana 3 explota, hoy no.\n\nnc -nv IP 21 WHAT: banner en crudo. WHY: a veces -sV basta; nc confirma. WHEN: quieres ver el texto exacto.\nnmap --script ftp-anon -p21 WHAT: la misma pregunta, automatizada.\n\nCliente: ftp IP  o  ftp -p IP. No Gobuster contra el 21.",
  },
  {
    id: "ssh",
    titleEs: "03. SSH — enum ≠ brute",
    titleEn: "SSH enum",
    bodyEs:
      "WHAT: login remoto autenticado (ya lo usaste en Linux mínimo).\nWHY: 22 open ≠ shell. Es una puerta con llave.\nWHEN: 22/tcp open.\nOUTPUT: versión OpenSSH X (nmap -sV -p22); o una sesión si tienes user/pass de lab (msfadmin/msfadmin en MS2).\nNEXT: si NO tienes usuario, enumera usuarios por OTRO servicio (SMB -U) o el brief. Hydra -l user -P lista = fuerza bruta (bloque aparte), lista CORTA en lab.\n\nNo hydra root@MS2 con rockyou entero en un bloque de 45 min. No nmap desde dentro del guest.",
  },
  {
    id: "searchsploit",
    titleEs: "04. searchsploit — índice, no exploit",
    titleEn: "searchsploit as index",
    bodyEs:
      "WHAT: busca exploits públicos por nombre/versión (copia local de Exploit-DB).\nWHY: vsftpd 2.3.4 y similares SALEN en el índice; eso no te autoriza a pegar un PoC.\nWHEN: tienes versión exacta de -sV.\nOUTPUT: rutas de archivos .txt/.c — NO los abras para copiar el ataque hoy.\nNEXT: Semana 3 Metasploit (search / use / set LHOST vboxnet0). Hoy: anota el nombre del hallazgo y para.",
  },
  {
    id: "optional",
    titleEs: "05. ADVANCED / OPTIONAL — hydra ftp, ssh-audit",
    titleEn: "Optional",
    optional: true,
    bodyEs:
      "Hydra ftp:// va en el bloque Hydra cuando tengas users. ssh-audit / algoritmos débiles no son el camino mínimo eJPT.",
  },
];

/** m1-w2-b5 — hueco declarado; incluye FTP/SSH en la pregunta clave. */
export const TOOL_SELECTION_WORKSHOP: WorkshopSection[] = [
  {
    id: "question",
    titleEs: "01. La pregunta clave",
    titleEn: "The one question",
    bodyEs:
      "¿Qué estoy buscando?\n— Rutas/archivos HTTP → Gobuster.\n— Password de un LOGIN que ya identifiqué → Hydra.\n— Usuarios/shares/política SMB → enum4linux (+ smbclient).\n— ¿FTP deja entrar sin user real? → ftp / ftp-anon, no Gobuster.\n— ¿SSH, versión o entrar con user conocido? → nmap -sV / ssh, no enum4linux.\n\nWHAT: clasificar la superficie.\nWHY: tu hueco #2.\nWHEN: lees un puerto o un párrafo de examen.\nOUTPUT: UNA herramienta.\nNEXT: el bloque de esa herramienta. No las tres a la vez 'por si acaso'.",
  },
];

export const ENUM_TROUBLESHOOTING: TroubleItem[] = [
  {
    id: "smb-on-http",
    symptom: "Gobuster o curl contra el 445",
    cause: "Tratas SMB como web. 445 no habla HTTP.",
    diagnose: "Relee nmap: 445/tcp microsoft-ds vs 80/tcp http",
    command: "enum4linux -a <TARGET_MS2>",
    fix: "445 → enum4linux/smbclient. 80 → Gobuster.",
    verify: "Dejas de usar http://IP:445 como primer movimiento.",
  },
  {
    id: "enum4-fail",
    symptom: "enum4linux no lista users / error de sesión",
    cause: "Null session cerrado, IP mal, o no es Samba accesible.",
    diagnose: "nmap -sV -p139,445 <IP> ; ping -c1 <IP>",
    command: "nmap -sV -p139,445 <TARGET_MS2>",
    fix: "Confirma TARGET_MS2 en Host-Only. Luego smbclient -L <IP> -N. Si ambos fallan, documenta 'auth required' y pasa a otro puerto.",
    verify: "O tienes users/shares, o una frase de por qué no (no un bucle de -a).",
  },
  {
    id: "smbclient-share",
    symptom: "smbclient: connection to share failed / NT_STATUS",
    cause: "Nombre de share mal, hace falta -N, o el share no es anónimo.",
    diagnose: "smbclient -L <IP> -N  — copia el Sharename exacto",
    command: "smbclient -L <TARGET_MS2> -N",
    fix: "smbclient //IP/Sharename -N con el nombre de la columna, no 'C$' inventado.",
    verify: "Prompt smb:\\\\> o un error que puedes citar.",
  },
  {
    id: "ftp-hydra-first",
    symptom: "Hydra rockyou en el 21 antes de anonymous",
    cause: "Brute como primer reflex. Anonymous es enum, no Hydra.",
    diagnose: "¿Probaste usuario anonymous?",
    command: "nmap --script ftp-anon -p21 <TARGET_MS2>",
    fix: "ftp IP → anonymous. NSE ftp-anon. Hydra solo con -l user conocido y lista CORTA.",
    verify: "Sabes si 230 anonymous o no, antes de brute.",
  },
  {
    id: "ssh-hydra-no-user",
    symptom: "Hydra SSH sin usuario / rockyou entero",
    cause: "22 open ≠ 'tirar hydra'. Falta -l/-L y el bloque se va en tiempo.",
    diagnose: "¿Tienes un username (SMB -U, brief, msfadmin en MS2)?",
    command: "nmap -sV -p22 <TARGET_MS2>",
    fix: "Enum versión. Si lab MS2 y ya practicaste ssh msfadmin, no repitas rockyou. Hydra: -l user -P lista_corta -t 4.",
    verify: "Un intento acotado o una sesión ssh conocida, no 14 millones de passwords.",
  },
  {
    id: "searchsploit-run",
    symptom: "Copiar un exploit de searchsploit el mismo día",
    cause: "Confundes índice con explotación.",
    diagnose: "¿Ya anotaste versión y LHOST? ¿Es Semana 3?",
    command: "searchsploit vsftpd 2.3.4",
    fix: "Hoy: anota el hit. Explotar = Metasploit después, LHOST=vboxnet0, solo TU VM.",
    verify: "No corriste un .c/.py de exploit en este bloque.",
  },
];

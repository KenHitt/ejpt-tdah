import { StudyWeek } from "@/lib/types";

/** MES 3 / SEMANA 11 (global 11) — Mecánica de examen + SIMULACRO #4 */
export const month3Week11: StudyWeek = {
  id: "m3-w11",
  monthId: "m3",
  title: "Semana 11 — Mecánica del examen real + Simulacro #4",
  goal: "Conocer la logística exacta del día del examen (INE/eLearnSecurity) y aprobar el Simulacro #4 en condiciones aún más realistas.",
  detailed: true,
  blocks: [
    {
      id: "m3-w11-b1",
      weekId: "m3-w11",
      order: 1,
      title: "Logística real del examen eJPT",
      objective: "Conocer de memoria: duración, formato de preguntas, entorno del examen, y qué puedes/no puedes usar el día del examen.",
      durationMin: 45,
      type: "theory",
      theoryEs:
        "El eJPT (INE/eLearnSecurity) es 100% práctico: te conectas a una red virtual con varias máquinas y respondes preguntas tipo cuestionario basadas en lo que encuentres (no hay 'reporte' que entregar como en OSCP). Duración total: 48 horas de acceso al lab, pero normalmente se resuelve en menos tiempo. Puedes tomar notas propias, usar tus herramientas de Kali normalmente. Revisa el syllabus oficial de INE para confirmar la versión vigente antes de tu fecha de examen.",
      practiceSteps: [
        "Lee el syllabus oficial actualizado de eJPT en la página de INE (enlace en Recursos)",
        "Anota: duración exacta del acceso al lab, número aproximado de preguntas, política de reintentos",
        "Prepara tu entorno de examen: Kali actualizado, VPN de INE probada, bloc de notas propio",
      ],
      subtopics: ["exam-logistics"],
      resources: [
        { label: "INE — eJPT Certification (página oficial)", url: "https://ine.com/certification/ejpt", platform: "INE" },
      ],
      glossary: [
        { en: "exam voucher", es: "cupón/voucher de examen" },
        { en: "retake policy", es: "política de reintentos" },
      ],
      closingChecklist: ["Leí el syllabus oficial vigente de eJPT", "Tengo mi entorno de examen (Kali + VPN) probado y funcionando"],
    },
    {
      id: "m3-w11-b2",
      weekId: "m3-w11",
      order: 2,
      title: "Máquina completa bajo presión de tiempo (modo examen)",
      objective: "Comprometer una máquina desconocida en máximo 75 minutos, documentando en tiempo real como si fuera el examen.",
      durationMin: 50,
      type: "practice",
      subtopics: ["full-chain", "exam-logistics"],
      practiceSteps: ["Elige una máquina de dificultad 'easy/medium' que NO hayas visto antes", "Cronómetro de 75 min, documentación en paralelo, sin pausar el reloj"],
      resources: [{ label: "HackTheBox Starting Point — Tier 2", url: "https://app.hackthebox.com/starting-point", platform: "HackTheBox" }],
      closingChecklist: ["Completé la máquina en 75 minutos o menos", "Documenté en tiempo real, no después"],
    },
    {
      id: "m3-w11-b3",
      weekId: "m3-w11",
      order: 3,
      title: "SIMULACRO COMPLETO #4",
      objective: "Responder 15 preguntas en 20 minutos, temario acumulado completo, 70%+.",
      durationMin: 30,
      type: "simulacro",
      subtopics: [],
      practiceSteps: ["Ve a Simulacros > Simulacro Completo #4 en la app"],
      closingChecklist: ["Tomé el Simulacro #4 en condiciones reales", "Revisé retroalimentación completa"],
    },
  ],
};

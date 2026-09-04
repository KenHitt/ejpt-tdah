import { StudyWeek } from "@/lib/types";

/** MES 3 / SEMANA 10 (global 10) — Reporting estilo eJPT + SIMULACRO #3 */
export const month3Week10: StudyWeek = {
  id: "m3-w10",
  monthId: "m3",
  title: "Semana 10 — Reporting + Simulacro #3",
  goal: "Aprender a documentar hallazgos en el formato que espera el examen (preguntas de 'flag'/respuesta corta) y aprobar el Simulacro #3.",
  detailed: true,
  blocks: [
    {
      id: "m3-w10-b1",
      weekId: "m3-w10",
      order: 1,
      title: "Documentación estilo eJPT",
      objective: "Redactar un mini-reporte de una máquina ya comprometida con el formato exacto que pide el examen: pregunta -> evidencia -> respuesta.",
      durationMin: 45,
      type: "practice",
      theoryEs:
        "El examen eJPT NO pide un reporte narrativo largo — pide respuestas cortas y precisas a preguntas específicas (ej. '¿cuál es la versión del servicio en el puerto 21?', '¿cuál es el hash NTLM del usuario X?'). Practicar a responder así, no a escribir ensayos, es clave para no perder tiempo el día del examen.",
      practiceSteps: [
        "Toma una máquina ya resuelta esta semana",
        "Reescribe cada hallazgo como pregunta+respuesta corta (formato examen): '¿Qué puerto corre SMB? -> 445'",
        "Practica copiar/pegar exacto de hashes, flags, versiones sin errores de transcripción",
      ],
      subtopics: ["reporting"],
      glossary: [{ en: "flag/answer format", es: "formato de respuesta tipo flag" }],
      closingChecklist: ["Redacté un mini-reporte en formato pregunta-respuesta corta"],
    },
    {
      id: "m3-w10-b2",
      weekId: "m3-w10",
      order: 2,
      title: "Repaso dirigido de puntos débiles acumulados",
      objective: "Revisar (con datos reales de tus simulacros/skill-checks previos) los 3 sub-temas con más fallos acumulados y cerrarlos.",
      durationMin: 45,
      type: "drill",
      theoryEs: "La app rastrea cada fallo por sub-tema desde el Mes 1. Este bloque usa ESOS datos reales (no genéricos) para priorizar tu repaso.",
      practiceSteps: [
        "Ve a Progreso > Sub-temas con más fallos",
        "Para cada uno de los 3 peores, repite 2 drills nuevos (no los ya fallados)",
        "Cierra cada uno con un mini skill-check de 3 preguntas",
      ],
      subtopics: [],
      closingChecklist: ["Identifiqué mis 3 sub-temas más débiles con datos reales", "Cerré los 3 con skill-check aprobado"],
    },
    {
      id: "m3-w10-b3",
      weekId: "m3-w10",
      order: 3,
      title: "SIMULACRO COMPLETO #3 (cumulativo, mayor dificultad)",
      objective: "Responder 15 preguntas en 20 minutos con temario acumulado Meses 1-3, alcanzando 70%+.",
      durationMin: 30,
      type: "simulacro",
      subtopics: [],
      practiceSteps: ["Ve a Simulacros > Simulacro Completo #3 en la app"],
      closingChecklist: ["Tomé el Simulacro #3 en condiciones reales", "Revisé retroalimentación completa"],
    },
  ],
};

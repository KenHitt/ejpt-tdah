import { StudyWeek } from "@/lib/types";

/** MES 3 / SEMANA 12 (global 12) — Semana final: solo repaso ligero + SIMULACRO FINAL */
export const month3Week12: StudyWeek = {
  id: "m3-w12",
  monthId: "m3",
  title: "Semana 12 — Repaso final + Simulacro Final + Día del examen",
  goal: "Consolidar sin quemarte: repaso ligero, un simulacro final de confirmación, y checklist de logística para presentar el examen.",
  detailed: true,
  blocks: [
    {
      id: "m3-w12-b1",
      weekId: "m3-w12",
      order: 1,
      title: "Repaso ligero dirigido por datos (sin contenido nuevo)",
      objective: "Repasar SOLO los sub-temas que históricamente más fallaste (según datos de la app), nada nuevo esta semana.",
      durationMin: 45,
      type: "drill",
      theoryEs: "Regla de esta semana: CERO contenido nuevo. Solo consolidación. Meter contenido nuevo 5-7 días antes del examen aumenta ansiedad y no mejora el desempeño (evidencia de preparación de exámenes).",
      practiceSteps: ["Ve a Progreso > Historial de fallos", "Repite drills de los 5 sub-temas más fallados en toda tu preparación", "Repite los comandos de memoria del Mes 1 (Nmap/enum/Metasploit) una vez más"],
      subtopics: [],
      closingChecklist: ["Repasé mis 5 sub-temas históricamente más débiles", "No agregué contenido nuevo esta semana"],
    },
    {
      id: "m3-w12-b2",
      weekId: "m3-w12",
      order: 2,
      title: "SIMULACRO FINAL (confirmación)",
      objective: "Aprobar el simulacro final con 70%+ como confirmación de que estás listo para el examen real.",
      durationMin: 30,
      type: "simulacro",
      theoryEs: "Si este simulacro sale por debajo de 70%, NO reserves el examen todavía — activa el ciclo de repaso dirigido y repite el simulacro final después de la siguiente sesión, según la regla fija #10.",
      subtopics: [],
      practiceSteps: ["Ve a Simulacros > Simulacro Final en la app"],
      closingChecklist: ["Aprobé el Simulacro Final con 70% o más", "Si reprobé, agendé el repaso dirigido antes de reservar el examen"],
    },
    {
      id: "m3-w12-b3",
      weekId: "m3-w12",
      order: 3,
      title: "Checklist de logística del día del examen",
      objective: "Confirmar todos los aspectos logísticos del examen real antes de presentarte, sin dejar nada a último momento.",
      durationMin: 30,
      type: "checkpoint",
      subtopics: ["exam-logistics"],
      practiceSteps: [
        "Confirma tu voucher/fecha de examen activa en la plataforma de INE",
        "Prueba la VPN del examen 24-48h antes (no el mismo día)",
        "Duerme 7+ horas la noche anterior (rendimiento cognitivo > una hora extra de estudio)",
        "Prepara bloc de notas, agua, y un espacio sin interrupciones para toda la ventana del examen",
      ],
      closingChecklist: [
        "Confirmé voucher y fecha de examen",
        "Probé la VPN del examen con anticipación",
        "Mi espacio y logística están listos para el día del examen",
      ],
    },
  ],
};

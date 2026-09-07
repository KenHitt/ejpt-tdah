/** Una jornada = 1 clase del plan, no un snack de 15 min. */
export const JORNADA_HOURS = 10;

export const JORNADA_PHASES = [
  { id: "teoria", label: "1. Teoría", detail: "2 h", minutes: 120 },
  { id: "examen", label: "2. Examen corto", detail: "15 min", minutes: 15 },
  { id: "ejemplos", label: "3. Ejemplos paso a paso", detail: "1 h 30", minutes: 90 },
  { id: "practica", label: "4. Tú practicas (VirtualBox)", detail: "5 h", minutes: 300 },
  { id: "taller", label: "5. Taller de estudio", detail: "1 h 15", minutes: 75 },
] as const;

export const WEEKLY_EXAM_HOURS = 1;
export const SIMULACRO_HOURS = 1.5;
export const SIMULACRO_COUNT = 5;

export function plannedHours(lessonCount: number, weekCount: number) {
  const jornadas = lessonCount * JORNADA_HOURS;
  const exams = weekCount * WEEKLY_EXAM_HOURS;
  const sims = SIMULACRO_COUNT * SIMULACRO_HOURS;
  return {
    jornadas,
    exams,
    sims,
    total: jornadas + exams + sims,
  };
}

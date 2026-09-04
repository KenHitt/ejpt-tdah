import { StudySessionLog } from "./types";
import { getAllBlocks } from "@/content/curriculum";

/**
 * Modelo del régimen de trabajo 20x10 declarado por el usuario:
 * 20 días de trabajo con 2h/día disponibles, 10 días libres con 6-12h/día (~9h promedio).
 * Todo esto es una ESTIMACIÓN transparente — el usuario puede ajustar sus horas reales
 * por sesión en la app; lo importante es comparar contra un número, no contra una sensación.
 */
export const REGIME_CYCLE_DAYS = 30; // 20 + 10
export const WORK_DAYS_PER_CYCLE = 20;
export const FREE_DAYS_PER_CYCLE = 10;
export const HOURS_PER_WORK_DAY = 2;
export const HOURS_PER_FREE_DAY_AVG = 9; // promedio del rango 6-12h

export const PLAN_TOTAL_DAYS = 90; // 3 meses, compromiso fijo

/**
 * Factor de colchón: los bloques de la app miden 45-50 min de INSTRUCCIÓN,
 * pero completar el lab asociado (THM room / HTB machine) casi siempre toma más
 * tiempo real del indicado. 1.35 es una estimación conservadora y honesta, no
 * un adorno — ajústala en /src/lib/regime.ts si tus datos reales dicen otra cosa.
 */
export const REAL_WORLD_BUFFER = 1.35;

export function availableHoursForDayIndex(dayIndex: number): number {
  // dayIndex 0-based desde el inicio del plan. Régimen: primeros 20 días de trabajo, luego 10 libres, se repite.
  const posInCycle = dayIndex % REGIME_CYCLE_DAYS;
  return posInCycle < WORK_DAYS_PER_CYCLE ? HOURS_PER_WORK_DAY : HOURS_PER_FREE_DAY_AVG;
}

export function availableHoursSoFar(daysElapsed: number): number {
  let total = 0;
  for (let i = 0; i < daysElapsed; i++) total += availableHoursForDayIndex(i);
  return total;
}

export function availableHoursTotal(totalDays: number = PLAN_TOTAL_DAYS): number {
  return availableHoursSoFar(totalDays);
}

export function totalRequiredHoursRaw(): number {
  const blocks = getAllBlocks();
  const minutesWithBreaks = blocks.reduce((sum, b) => sum + b.durationMin + 10, 0); // +10 min descanso por bloque
  return minutesWithBreaks / 60;
}

export function totalRequiredHoursBuffered(): number {
  return totalRequiredHoursRaw() * REAL_WORLD_BUFFER;
}

export interface PaceDiagnosis {
  daysElapsed: number;
  hoursAvailableSoFar: number;
  hoursRequiredSoFar: number;
  hoursLoggedActual: number;
  deficitHours: number; // positivo = vas atrasado
  totalHoursRequired: number;
  totalHoursAvailable: number;
  onTrack: boolean;
  projectedExtraDaysNeeded: number; // si vas atrasado, cuántos días MÁS necesitarías al ritmo real actual
}

export function diagnosePace(sessions: StudySessionLog[], planStartedAt: string | undefined): PaceDiagnosis {
  const totalHoursRequired = totalRequiredHoursBuffered();
  const totalHoursAvailable = availableHoursTotal();

  const start = planStartedAt ? new Date(planStartedAt) : new Date();
  const now = new Date();
  const daysElapsed = Math.max(0, Math.min(PLAN_TOTAL_DAYS, Math.floor((now.getTime() - start.getTime()) / 86_400_000)));

  const hoursAvailableSoFar = availableHoursSoFar(daysElapsed);
  const hoursRequiredSoFar = totalHoursRequired * (daysElapsed / PLAN_TOTAL_DAYS || 1) * (daysElapsed === 0 ? 0 : 1);
  const hoursLoggedActual = sessions.reduce((sum, s) => sum + s.hoursActual, 0);

  const deficitHours = hoursRequiredSoFar - hoursLoggedActual;

  // Ritmo real de horas/día logueadas hasta ahora
  const realPacePerDay = daysElapsed > 0 ? hoursLoggedActual / daysElapsed : 0;
  const hoursRemaining = Math.max(0, totalHoursRequired - hoursLoggedActual);
  const daysNeededAtCurrentPace = realPacePerDay > 0 ? hoursRemaining / realPacePerDay : Infinity;
  const daysRemainingInPlan = PLAN_TOTAL_DAYS - daysElapsed;
  const projectedExtraDaysNeeded = Math.max(0, Math.ceil(daysNeededAtCurrentPace - daysRemainingInPlan));

  return {
    daysElapsed,
    hoursAvailableSoFar,
    hoursRequiredSoFar: Math.round(hoursRequiredSoFar * 10) / 10,
    hoursLoggedActual: Math.round(hoursLoggedActual * 10) / 10,
    deficitHours: Math.round(deficitHours * 10) / 10,
    totalHoursRequired: Math.round(totalHoursRequired * 10) / 10,
    totalHoursAvailable: Math.round(totalHoursAvailable * 10) / 10,
    onTrack: deficitHours <= 2, // margen de tolerancia de 2h antes de marcar alerta
    projectedExtraDaysNeeded,
  };
}

import { COURSE_LESSONS } from "@/content/course";
import { EnrichedLesson } from "@/content/course/types";
import { ACADEMY_WORKSHOPS } from "@/content/academy/workshops";
import { LEARN_ARTICLES } from "@/content/learn-articles";
import { getAllBlocks } from "@/content/curriculum";
import { MICRO_BANK, TEN_MIN_PACK } from "@/content/micro-training";
import { COMMAND_BANK } from "@/content/command-bank";
import { WEEK1_DECISION_DRILLS, WEEK4_DECISION_DRILLS, EXTRA_DECISION_DRILLS } from "@/content/decision-drills";

/** Estimación por pieza de contenido real. No "1 ficha = 2.5 h". */
export function estimateLessonBreakdown(l: EnrichedLesson) {
  const theory = Math.max(8, (l.read.length + l.theoryExtra.length) * 4);
  const quiz = Math.max(8, l.quiz.length * 2);
  const guided = Math.max(10, l.examples.reduce((n, e) => n + 8 + e.steps.length * 3, 0));
  const lab = Math.max(25, l.labSteps.length * 14);
  const taller = 35;
  return {
    theory,
    quiz,
    guided,
    lab,
    taller,
    total: theory + quiz + guided + lab + taller,
  };
}

export function estimateLessonMinutes(l: EnrichedLesson): number {
  return Math.round(estimateLessonBreakdown(l).total);
}

const lessonMin = COURSE_LESSONS.reduce((n, l) => n + estimateLessonMinutes(l), 0);
const focusMin = getAllBlocks().reduce((n, b) => n + (b.durationMin || 0), 0);
/** Taller: lectura + un experimento. ~40 min, no 2.5 h inventadas. */
const tallerMin = ACADEMY_WORKSHOPS.length * 40;
const fichaMin = LEARN_ARTICLES.length * 8;
const microMin = MICRO_BANK.length * 3 + TEN_MIN_PACK.length * 8;
const recallMin = COMMAND_BANK.length * 6;
const decisionMin =
  (WEEK1_DECISION_DRILLS.length + WEEK4_DECISION_DRILLS.length + EXTRA_DECISION_DRILLS.length) * 12;
const examMin = 13 * 25 + 5 * 25;

function hours(min: number) {
  return Math.round((min / 60) * 10) / 10;
}

/**
 * Horas honestas.
 * - estimated: si haces la ruta principal (jornadas) a ritmo de sesión.
 * - complementary: talleres + fichas + train (no duplicar como "otra ruta de 800 h").
 * - focusPlan: bloques /plan (puede solaparse temáticamente con jornadas).
 * - capacity: si además haces labs largos y todo lo complementario.
 */
export const HONEST_HOURS = {
  jornadaEstimated: hours(lessonMin),
  jornadaCount: COURSE_LESSONS.length,
  avgJornadaMin: Math.round(lessonMin / COURSE_LESSONS.length),
  talleresEstimated: hours(tallerMin),
  fichasEstimated: hours(fichaMin),
  trainEstimated: hours(microMin + decisionMin + recallMin),
  examsEstimated: hours(examMin),
  focusPlanEstimated: hours(focusMin),
  get primaryEstimated() {
    return this.jornadaEstimated + this.examsEstimated;
  },
  get complementaryEstimated() {
    return this.talleresEstimated + this.fichasEstimated + this.trainEstimated;
  },
  get allCatalogEstimated() {
    return this.primaryEstimated + this.complementaryEstimated;
  },
};

export function completedLessonHours(doneIds: string[]) {
  const min = COURSE_LESSONS.filter((l) => doneIds.includes(l.id)).reduce((n, l) => n + estimateLessonMinutes(l), 0);
  return hours(min);
}

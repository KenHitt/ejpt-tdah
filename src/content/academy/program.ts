import { COURSE_LESSONS, COURSE_WEEKS } from "@/content/course";
import { JORNADA_HOURS, plannedHours } from "@/content/course/jornada";
import { ACADEMY_WORKSHOPS, TALLER_HOURS } from "@/content/academy/workshops";
import { LEARN_ARTICLES } from "@/content/learn-articles";

export const ACADEMY_NAME = "eJPT Academy";
export const ACADEMY_TAGLINE = "Bootcamp de pentesting de laboratorio · +800 horas";

const FICHA_HOURS = 0.5;

const core = plannedHours(COURSE_LESSONS.length, COURSE_WEEKS.length);
const talleresH = ACADEMY_WORKSHOPS.length * TALLER_HOURS;
const bibliotecaH = LEARN_ARTICLES.length * FICHA_HOURS;
const nucleo = core.jornadas + core.exams + core.sims;

export const ACADEMY_HOURS = {
  jornadas: core.jornadas,
  exams: core.exams,
  sims: core.sims,
  talleres: talleresH,
  biblioteca: bibliotecaH,
  nucleo,
  total: nucleo + talleresH + bibliotecaH,
};

export const ACADEMY_STATS = {
  modules: COURSE_WEEKS.length,
  jornadas: COURSE_LESSONS.length,
  jornadaHours: JORNADA_HOURS,
  talleres: ACADEMY_WORKSHOPS.length,
  fichas: LEARN_ARTICLES.length,
};

export function hoursFromLessons(done: number) {
  return done * JORNADA_HOURS;
}

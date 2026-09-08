import { COURSE_LESSONS, COURSE_WEEKS } from "@/content/course";
import { ACADEMY_WORKSHOPS } from "@/content/academy/workshops";
import { LEARN_ARTICLES } from "@/content/learn-articles";
import { HONEST_HOURS } from "@/content/v6/hours";

export const ACADEMY_NAME = "eJPT Academy";
export const ACADEMY_TAGLINE = "Una ruta. Think → enumerate → decide → act → verify → document.";

export const ACADEMY_HOURS = HONEST_HOURS;

export const ACADEMY_STATS = {
  modules: COURSE_WEEKS.length,
  jornadas: COURSE_LESSONS.length,
  talleres: ACADEMY_WORKSHOPS.length,
  fichas: LEARN_ARTICLES.length,
};

export function hoursFromLessons(done: number) {
  const avg = HONEST_HOURS.avgJornadaMin / 60;
  return Math.round(done * avg * 10) / 10;
}

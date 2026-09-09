import { theoryForWeek } from "@/content/course/ample-theory";
import { examplesFor as fallbackExamples } from "@/content/course/ample-examples";
import { ALL_LESSON_EXAMPLES } from "@/content/course/ample-examples-b";
import { LESSON_EXAMPLES_C } from "@/content/course/ample-examples-c";
import { JORNADA_HOURS } from "@/content/course/jornada";
import { CourseLesson, EnrichedLesson } from "@/content/course/types";
import { talleresForLesson } from "@/content/academy/workshops";
import { guideForLesson } from "@/content/v92/guides";

const EXAMPLES: Record<string, EnrichedLesson["examples"]> = {
  ...ALL_LESSON_EXAMPLES,
  ...LESSON_EXAMPLES_C,
};

const DEFAULT_HINT =
  "Practica en TU VirtualBox (Host-Only / vboxnet), DVWA en localhost, o el rango VPN de INE el día del examen. Kali es el atacante en este PC. Nunca Bridged, nunca la Wi‑Fi de casa, nunca terceros.";

export function enrichLesson(lesson: CourseLesson): EnrichedLesson {
  const custom = EXAMPLES[lesson.id];
  const examples = custom?.length ? custom : fallbackExamples(lesson);
  const guide = guideForLesson(lesson);
  return {
    ...lesson,
    minutes: JORNADA_HOURS * 60,
    theoryExtra: [...theoryForWeek(lesson.week), ...(lesson.theoryExtra ?? []), ...(guide.extraRead ?? [])],
    examples,
    tallerIds: talleresForLesson(lesson.week).map((w) => w.id),
    jornadaHours: JORNADA_HOURS,
    practiceHint: lesson.practiceHint ?? DEFAULT_HINT,
    guide,
  };
}

export function enrichAll(lessons: CourseLesson[]): EnrichedLesson[] {
  return lessons.map(enrichLesson);
}

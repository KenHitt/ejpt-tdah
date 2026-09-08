import { CourseState } from "@/lib/course/storage";
import { ProgressState } from "@/lib/progress/state";
import { COURSE_LESSONS, COURSE_WEEKS, getLesson, nextIncomplete } from "@/content/course";
import { estimateLessonMinutes } from "@/content/v6/hours";
import { phaseForWeek } from "@/content/v6/phases";
import { skillBySubtopic, V6_SKILLS } from "@/content/v6/skills";
import { EnergyMode, OperationNow } from "@/content/v6/types";
import { labCheckpointDone, skillStatus } from "@/lib/v6/mastery";
import { dueCommands, listWeaknesses } from "@/lib/trainer/adaptive";
import { getSubtopic } from "@/content/subtopics";

function lessonSteps(id: string, course: CourseState) {
  const rec = course.lessons[id];
  const lesson = getLesson(id);
  if (!lesson) return { done: 0, total: 5 };
  let done = 0;
  if (rec?.quizPct != null && rec.quizPct >= 70) done += 1;
  if (rec?.examplesDone) done += 1;
  if (rec?.labDone) done += 1;
  if (rec?.tallerDone || rec?.githubDone) done += 1;
  if (rec) done += 1;
  return { done: Math.min(done, 5), total: 5 };
}

function optionalFor(subtopicId: string, energy: EnergyMode): OperationNow["optional"] {
  const skill = skillBySubtopic(subtopicId);
  const opts: OperationNow["optional"] = [
    { href: "/train/5min", label: "5 min training", why: "Recall / interpretación corta." },
    { href: "/memory", label: "Recall", why: "SRS de comandos vencidos." },
  ];
  if (energy !== "low" && skill?.trainHrefs[0]) {
    opts.push({ href: skill.trainHrefs[0], label: "15 min challenge", why: "Práctica del skill actual." });
  }
  return opts.slice(0, 3);
}

export function pickOperation(
  course: CourseState,
  progress: ProgressState,
  energy: EnergyMode,
  dayNumber: number
): OperationNow {
  const weaknesses = listWeaknesses(progress);
  const due = dueCommands(progress)[0];
  const nextLesson = nextIncomplete(course.lessons);
  const phase = phaseForWeek(nextLesson.week);
  const weekMeta = COURSE_WEEKS.find((w) => w.week === nextLesson.week);
  const steps = lessonSteps(nextLesson.id, course);
  const est = estimateLessonMinutes(nextLesson);
  const nextIdx = COURSE_LESSONS.findIndex((l) => l.id === nextLesson.id);
  const after = COURSE_LESSONS[nextIdx + 1];

  const restDay = dayNumber > 1 && dayNumber % 7 === 0;
  const skill = skillBySubtopic(nextLesson.subtopicId);

  const base = {
    stepsDone: steps.done,
    stepsTotal: steps.total,
    difficulty: skill?.difficulty ?? 3,
    nextTitleEs: after?.titleEs ?? "Examen del módulo",
    nextHref: after ? `/clase/${after.id}` : `/clase/examen/w${nextLesson.week}`,
    optional: optionalFor(nextLesson.subtopicId, energy),
    phaseLabel: `Fase ${phase.n} · ${phase.titleEs}`,
    dayLabel: `Jornada ${nextLesson.week}.${nextLesson.day} · ${weekMeta?.titleEs ?? ""}`,
  };

  const critical = weaknesses.find((w) => w.severity === "critical");
  if (critical && energy !== "high") {
    return {
      ...base,
      kind: "remediate",
      href: critical.href,
      titleEs: critical.labelEs,
      objectiveEs: "Cierra este hueco antes de contenido nuevo.",
      whyEs: critical.whyEs + " Tipo de falla: revisa si es memoria, razonamiento o técnico.",
      estimatedMin: energy === "low" ? 8 : 25,
      estimatedLabel: energy === "low" ? "~8 min (estimado)" : "~25 min (estimado)",
    };
  }

  if (energy === "low" && due) {
    return {
      ...base,
      kind: "review",
      href: `/memory/${due.id}`,
      titleEs: `Recall · ${due.fragment}`,
      objectiveEs: "Producir el comando/concepto sin cheat sheet.",
      whyEs: "Energía baja: SRS vencido. La ruta curricular no cambia; solo la profundidad de hoy.",
      estimatedMin: 6,
      estimatedLabel: "~6 min (estimado)",
      optional: [{ href: `/clase/${nextLesson.id}`, label: "Jornada (cuando puedas)", why: "Sigue siendo la ruta." }],
    };
  }

  if (restDay && energy !== "high") {
    const weak = weaknesses[0];
    return {
      ...base,
      kind: "rest",
      href: weak ? weak.href : "/memory",
      titleEs: "Día 7 · catch-up / review",
      objectiveEs: "No hace falta contenido nuevo. Recupera un hueco o descansa.",
      whyEs: "El plan reserva el día 7 para consolidar. La ruta no avanza a la fuerza.",
      estimatedMin: energy === "low" ? 10 : 30,
      estimatedLabel: energy === "low" ? "~10 min (estimado)" : "~30 min (estimado)",
      optional: [
        { href: `/clase/${nextLesson.id}`, label: "Si quieres seguir la jornada", why: "Opcional." },
        { href: "/train/5min", label: "5 min", why: "Suave." },
      ],
    };
  }

  if (!labCheckpointDone(course) && nextLesson.week > 0) {
    return {
      ...base,
      kind: "lab-gate",
      href: "/clase/c00-d1",
      titleEs: "Lab checkpoint incompleto",
      objectiveEs: "Ping al guest, vboxnet, scope, snapshot. Luego recon.",
      whyEs: "PREREQUISITE MISSING · laboratorio. El contenido de Nmap sigue visible, pero no es lo recomendado ahora.",
      estimatedMin: estimateLessonMinutes(getLesson("c00-d1") ?? nextLesson),
      estimatedLabel: "~sesión (estimado)",
      dayLabel: "Fase 0 · Lab",
      phaseLabel: "Fase 0 · Lab setup",
    };
  }

  if (skill && skill.prereqIds.length) {
    const blocked = skill.prereqIds.find((id) => skillStatus(id, course, progress) === "LOCKED");
    if (blocked) {
      const pre = V6_SKILLS.find((s) => s.id === blocked);
      const href = pre?.lessonIds[0] ? `/clase/${pre.lessonIds[0]}` : `/master/${blocked}`;
      return {
        ...base,
        kind: "lab-gate",
        href,
        titleEs: `Falta fundamento: ${pre?.titleEs ?? blocked}`,
        objectiveEs: "Cierra el prerequisito. Luego vuelve a este tema.",
        whyEs: `PREREQUISITE MISSING · ${skill.titleEs} pide ${pre?.titleEs ?? blocked}.`,
        estimatedMin: 25,
        estimatedLabel: "~25 min (estimado)",
      };
    }
  }

  if (energy === "low") {
    return {
      ...base,
      kind: "lesson",
      href: `/clase/${nextLesson.id}`,
      titleEs: nextLesson.titleEs,
      objectiveEs: "Hoy solo teoría + examen corto de la jornada actual.",
      whyEs: `${phase.thinkEs} Energía baja: no hace falta el lab de 5 h. La ruta sigue siendo esta jornada.`,
      estimatedMin: Math.min(20, est),
      estimatedLabel: "~15–20 min (estimado)",
    };
  }

  if (energy === "high") {
    return {
      ...base,
      kind: "lesson",
      href: `/clase/${nextLesson.id}`,
      titleEs: nextLesson.titleEs,
      objectiveEs: nextLesson.labTitle,
      whyEs: `${phase.thinkEs} Energía alta: prioriza VirtualBox / boss del módulo, no pestañas nuevas.`,
      estimatedMin: est,
      estimatedLabel: `~${est} min (estimado; el lab puede alargarse)`,
    };
  }

  const openFail = weaknesses.find((w) => w.severity === "open");
  if (openFail && (course.lessons[nextLesson.id]?.quizPct ?? 100) >= 70) {
    base.optional = [{ href: openFail.href, label: `Hueco: ${openFail.labelEs}`, why: openFail.whyEs }, ...base.optional].slice(0, 3);
  }

  return {
    ...base,
    kind: "lesson",
    href: `/clase/${nextLesson.id}`,
    titleEs: nextLesson.titleEs,
    objectiveEs: nextLesson.labTitle || phase.goalEs,
    whyEs: phase.thinkEs,
    estimatedMin: Math.min(est, 90),
    estimatedLabel: `~${Math.min(est, 90)} min (estimado)`,
  };
}

export function failKindAdvice(progress: ProgressState): string | null {
  const attempts = progress.trainer?.attempts ?? [];
  const recent = attempts.slice(-12);
  const bad = recent.filter((a) => !a.correct);
  if (bad.length < 2) return null;
  const counts = { memory: 0, reasoning: 0, technical: 0 };
  for (const a of bad) {
    if (a.failKind) counts[a.failKind] += 1;
  }
  const top = (Object.entries(counts) as [keyof typeof counts, number][]).sort((a, b) => b[1] - a[1])[0];
  if (!top || top[1] === 0) return null;
  if (top[0] === "reasoning") {
    return "Tu problema reciente parece REASONING, no command memory. Decision drills / What's Next.";
  }
  if (top[0] === "memory") {
    return "Tu problema reciente parece COMMAND MEMORY. Recall / 5 min training.";
  }
  return "Tu problema reciente parece TÉCNICO (lab/config). Revisa vboxnet, LHOST e IP de la víctima.";
}

export function trainRecommendation(progress: ProgressState): { href: string; title: string; why: string } {
  const w = listWeaknesses(progress)[0];
  if (w?.severity === "critical" || w?.severity === "open") {
    return { href: w.href, title: w.labelEs, why: w.whyEs };
  }
  if (w) return { href: w.href, title: w.labelEs, why: w.whyEs };
  return { href: "/train/5min", title: "5-min training", why: "Sin huecos abiertos: mantenimiento corto." };
}

export { getSubtopic };

import { QuizQuestion } from "@/lib/types";
import { questionsAvailableAtWeek, questionsForSubtopic, QUIZ_BANK } from "@/content/quizbank";
import { LEARNING_PASS_PERCENT } from "@/lib/trainer/bands";

export const FULL_SIMULACRO_QUESTION_COUNT = 15;
export const FULL_SIMULACRO_DURATION_SEC = 20 * 60; // 20 minutos
export { LEARNING_PASS_PERCENT, MASTERED_PERCENT, CRITICAL_SKILL_PERCENT } from "@/lib/trainer/bands";
/** Alias: Learning Pass interno, no dominio ni criterio INE. */
export const PASS_THRESHOLD_PERCENT = LEARNING_PASS_PERCENT;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Elige preguntas ALEATORIAS de TODO lo cubierto hasta la semana global actual,
 * no solo del bloque/semana más reciente (regla fija #10: el examen real no avisa).
 */
export function pickFullSimulacroQuestions(currentGlobalWeek: number, count = FULL_SIMULACRO_QUESTION_COUNT): QuizQuestion[] {
  const pool = questionsAvailableAtWeek(currentGlobalWeek);
  const source = pool.length >= count ? pool : QUIZ_BANK; // fallback si aún no hay suficiente contenido cubierto
  return shuffle(source).slice(0, Math.min(count, source.length));
}

/** Mini skill-check de 3-5 preguntas enfocado en sub-temas específicos (cierre de bloque/semana o remediación). */
export function pickSkillCheckQuestions(subtopicIds: string[], count = 5): QuizQuestion[] {
  const pool = subtopicIds.flatMap((id) => questionsForSubtopic(id));
  const unique = Array.from(new Map(pool.map((q) => [q.id, q])).values());
  return shuffle(unique).slice(0, Math.min(count, unique.length));
}

/** Repaso dirigido: preguntas de un sub-tema, EXCLUYENDO las que ya se usaron en el intento fallado. */
export function pickRemediationQuestions(subtopicId: string, excludeIds: string[], count = 2): QuizQuestion[] {
  const pool = questionsForSubtopic(subtopicId).filter((q) => !excludeIds.includes(q.id));
  const finalPool = pool.length > 0 ? pool : questionsForSubtopic(subtopicId);
  return shuffle(finalPool).slice(0, Math.min(count, finalPool.length));
}

export interface GradedQuestionResult {
  questionId: string;
  subtopicId: string;
  correct: boolean;
}

export interface GradedAttempt {
  score: number; // 0-100
  passed: boolean;
  results: GradedQuestionResult[];
  failedSubtopics: string[]; // únicos, sin duplicar
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function isAnswerCorrect(question: QuizQuestion, answer: string | string[] | undefined): boolean {
  if (answer === undefined) return false;
  if (question.type === "command") {
    if (typeof answer !== "string") return false;
    return normalize(answer) === normalize(question.correctAnswer as string);
  }
  if (question.type === "single") {
    return String(answer) === String(question.correctAnswer);
  }
  // multiple: compara sets
  const correct = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
  const given = Array.isArray(answer) ? answer : [answer];
  if (correct.length !== given.length) return false;
  return correct.every((c) => given.includes(c));
}

export function gradeAttempt(questions: QuizQuestion[], answers: Record<string, string | string[]>): GradedAttempt {
  const results: GradedQuestionResult[] = questions.map((q) => ({
    questionId: q.id,
    subtopicId: q.subtopicId,
    correct: isAnswerCorrect(q, answers[q.id]),
  }));

  const correctCount = results.filter((r) => r.correct).length;
  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const passed = score >= LEARNING_PASS_PERCENT;
  const failedSubtopics = Array.from(new Set(results.filter((r) => !r.correct).map((r) => r.subtopicId)));

  return { score, passed, results, failedSubtopics };
}

import { CONCEPT_LESSONS, ConceptDiagnosis, ConceptLesson } from "@/content/v93/concept-reviews";
import { FailKind } from "@/lib/types";
import { FailureClass } from "@/content/v9/types";

export interface ReviewQuery {
  prompt: string;
  extra?: string;
  subtopicId?: string;
  failKind?: FailKind;
  pedagogy?: FailureClass;
}

function scoreLesson(text: string, lesson: ConceptLesson) {
  const blob = text.toLowerCase();
  let n = 0;
  for (const k of lesson.keywords) {
    if (blob.includes(k.toLowerCase())) n += k.length > 4 ? 2 : 1;
  }
  return n;
}

export function reviewForQuestion(q: ReviewQuery): ConceptLesson {
  const text = `${q.prompt} ${q.extra ?? ""} ${q.subtopicId ?? ""}`;
  const ranked = CONCEPT_LESSONS.map((c) => ({ c, n: scoreLesson(text, c) })).sort((a, b) => b.n - a.n);
  const best = ranked[0]?.n ? ranked[0].c : CONCEPT_LESSONS.find((c) => c.id === "enum-vs-exploit")!;
  return withDiagnosis(best, q);
}

function withDiagnosis(lesson: ConceptLesson, q: ReviewQuery): ConceptLesson {
  const d = diagnosisFrom(q) ?? lesson.diagnosis;
  return { ...lesson, diagnosis: d };
}

function diagnosisFrom(q: ReviewQuery): ConceptDiagnosis | undefined {
  if (q.pedagogy === "COMMAND_RECALL_FAILURE" || q.failKind === "memory") return "command_recall";
  if (q.pedagogy === "INTERPRETATION_FAILURE") return "interpretation";
  if (q.pedagogy === "DECISION_FAILURE") return "decision";
  if (q.pedagogy === "EXECUTION_FAILURE" || q.failKind === "technical") return "execution";
  if (q.pedagogy === "METHODOLOGY_FAILURE") return "methodology";
  if (q.pedagogy === "RETENTION_FAILURE") return "retention";
  if (q.pedagogy === "KNOWLEDGE_FAILURE") return "knowledge_gap";
  if (q.pedagogy === "REASONING_FAILURE") return "reasoning";
  return undefined;
}

export function stillStuckCopy(lesson: ConceptLesson) {
  return `Todavía no. Parece que el problema está en ${label(lesson.diagnosis)}, no en adivinar la letra. Revisar concepto: ${lesson.titleEs}.`;
}

function label(d: ConceptDiagnosis) {
  const map: Record<ConceptDiagnosis, string> = {
    knowledge_gap: "el concepto",
    terminology: "el término",
    command_recall: "recordar qué pregunta hace el flag",
    interpretation: "interpretar el resultado",
    reasoning: "el razonamiento",
    decision: "elegir el next step",
    execution: "medir IPs / opciones",
    methodology: "el orden (enum antes que exploit)",
    retention: "retenerlo sin copiar",
  };
  return map[d];
}

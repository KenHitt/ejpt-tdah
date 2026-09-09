// Tipos centrales del sistema de estudio eJPT.
// Todo el contenido curricular (currículo) vive en /src/content y usa estos tipos.
// El progreso del usuario (qué completó, qué falló, resultados de simulacros)
// vive en Supabase (o localStorage como fallback) — ver /src/lib/progress.

export type BlockType =
  | "theory" // bloque mayormente teórico (máx 20% del plan total)
  | "practice" // laboratorio guiado paso a paso
  | "drill" // repetición de fijación (escribir comando de memoria)
  | "checkpoint" // mini quiz / skill-check de 3-5 preguntas
  | "simulacro"; // examen simulado cronometrado

export type RegimeDayType = "trabajo" | "libre"; // régimen 20x10

export interface GlossaryEntry {
  en: string;
  es: string;
}

export interface ResourceLink {
  label: string;
  url: string;
  platform: "TryHackMe" | "HackTheBox" | "INE" | "Docs" | "Kali" | "VulnHub" | "Local" | "Otro";
  /** Si es true, el recurso requiere una suscripción de pago en esa plataforma */
  paid?: boolean;
}

export interface DrillItem {
  id: string;
  promptEs: string;
  promptEn?: string;
  answer: string;
  hint?: string;
  /** Explicación conceptual al fallar. NO incluir el comando completo. */
  explanation?: string;
  explanationEn?: string;
  /** Pregunta de recall de concepto tras acertar el comando */
  conceptQuestion?: string;
  conceptAnswer?: string;
  mandatoryRepeat?: boolean;
  subtopicId?: string;
  /** Si existe, se evalúa por palabras clave (conceptos), no por comando exacto. */
  answerKeywords?: string[];
  howToEs?: string;
}

export type FailKind = "memory" | "reasoning" | "technical";
export type SkillKind = "recall" | "reasoning" | "machine";
export type KillPhase = "recon" | "enum" | "vuln" | "exploit" | "access" | "privesc" | "post";

export type GuidedKind = "concept" | "action" | "result" | "question" | "decision" | "checkpoint" | "trouble";

export interface ChoiceOption {
  id: string;
  textEs: string;
  ok?: boolean;
  whyWrongEs?: string;
  whyRightEs?: string;
}

export interface PromptCheck {
  id: string;
  promptEs: string;
  promptEn?: string;
  keywords?: string[];
  /** Cualquier grupo completo vale (OR de ANDs). */
  keywordAny?: string[][];
  /** Validación especial: ipv4 | ipv4-lab | cidr | iface */
  shape?: "ipv4" | "ipv4-lab" | "cidr" | "iface";
  choices?: ChoiceOption[];
  justifyPromptEs?: string;
  justifyKeywords?: string[];
  explanationEs: string;
  failKind: FailKind;
  subtopicId: string;
  domain?: string;
  critical?: boolean;
  /** V8 feedback extra (opcional, no rompe checks antiguos). */
  whatMissedEs?: string;
  betterApproachEs?: string;
  evidenceEs?: string;
  /** V9.1 — hints progresivos (1..5). No pisa checks antiguos. */
  hints?: [string, string, string, string, string];
  walkthroughEs?: string;
  pedagogy?:
    | "KNOWLEDGE_FAILURE"
    | "COMMAND_RECALL_FAILURE"
    | "INTERPRETATION_FAILURE"
    | "REASONING_FAILURE"
    | "DECISION_FAILURE"
    | "EXECUTION_FAILURE"
    | "METHODOLOGY_FAILURE"
    | "TIME_MANAGEMENT_FAILURE"
    | "RETENTION_FAILURE";
}

export interface GuidedStep {
  id: string;
  kind: GuidedKind;
  titleEs: string;
  bodyEs: string;
  /** Cierra cada concepto. */
  ejptForEs?: string;
  diagram?: string;
  lookForEs?: string;
  commandShow?: string;
  troubleId?: string;
  check?: PromptCheck;
}

export interface DecisionScenario {
  id: string;
  titleEs: string;
  setupEs: string;
  output?: string;
  checks: PromptCheck[];
}

export interface WorkshopSection {
  id: string;
  titleEs: string;
  titleEn?: string;
  bodyEs: string;
  diagram?: string;
  ejptForEs?: string;
  /** Contenido útil pero no es tu setup ni el camino mínimo eJPT. */
  optional?: boolean;
}

export interface TroubleItem {
  id: string;
  symptom: string;
  cause: string;
  diagnose: string;
  command?: string;
  fix: string;
  verify: string;
}

export interface StudyBlock {
  id: string;
  weekId: string;
  order: number;
  title: string;
  titleEn?: string;
  objective: string;
  objectiveEn?: string;
  durationMin: number;
  type: BlockType;
  theoryEs?: string;
  /** Exam-style English (short). Shown next to Spanish so you train reading the real exam. */
  theoryEn?: string;
  /** English phrases you will see on the eJPT (commands stay in English anyway). */
  examPhrases?: string[];
  practiceSteps?: string[];
  subtopics: string[];
  drills?: DrillItem[];
  glossary?: GlossaryEntry[];
  resources?: ResourceLink[];
  closingChecklist: string[];
  extraResources?: ResourceLink[];
  comparisonTable?: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
  /** Taller pedagógico (qué / por qué / cuándo). Focus Mode no lo vuelca entero. */
  workshop?: WorkshopSection[];
  troubleshooting?: TroubleItem[];
  /** Laboratorio guiado: una misión por pantalla (Focus). */
  guidedLab?: GuidedStep[];
  /** Interpretación / siguiente movimiento / attack path. */
  decisionDrills?: DecisionScenario[];
}

export interface StudyWeek {
  id: string; // ej: m1-w1
  monthId: string; // ej: m1
  title: string;
  goal: string;
  /** true si esta semana ya tiene bloques 100% detallados, false si es esqueleto */
  detailed: boolean;
  blocks: StudyBlock[];
}

export interface StudyMonth {
  id: string; // m1, m2, m3
  title: string;
  summary: string;
  weeks: StudyWeek[];
}

export interface Subtopic {
  id: string;
  nameEs: string;
  nameEn: string;
  category:
    | "recon"
    | "scanning"
    | "enumeration"
    | "web"
    | "brute-force"
    | "metasploit"
    | "exploitation"
    | "post-exploitation"
    | "networking"
    | "linux"
    | "reporting"
    | "exam-mechanics";
  /** Índice de semana global (1-12) desde la cual este subtema entra al pool de simulacros */
  introducedAtGlobalWeek: number;
  /** true = explícitamente marcado por el usuario como hueco/debilidad conocida */
  knownGap?: boolean;
}

export type QuestionType = "single" | "multiple" | "command";

export interface QuizQuestion {
  id: string;
  subtopicId: string;
  type: QuestionType;
  promptEn: string; // el examen real es en inglés
  promptEs: string; // apoyo en español
  options?: string[]; // para single/multiple
  correctAnswer: string | string[]; // index(es) como string, o comando esperado para "command"
  explanationEs: string; // retroalimentación de por qué
  globalWeek: number; // semana global en que se puede empezar a usar esta pregunta
}

export interface SimulacroAttempt {
  id: string;
  userId: string;
  startedAt: string;
  finishedAt?: string;
  durationSec: number; // 20 min = 1200
  questionIds: string[];
  answers: Record<string, string | string[]>;
  score?: number; // 0-100
  passed?: boolean;
}

export interface SubtopicFailure {
  subtopicId: string;
  failCount: number;
  lastFailedAt: string;
  status: "open" | "remediating" | "resolved" | "critical-risk";
  remediationAttempts: number;
}

export interface StudySessionLog {
  id: string;
  date: string; // ISO date
  regimeDayType: RegimeDayType;
  hoursPlanned: number;
  hoursActual: number;
  blocksCompleted: string[];
}

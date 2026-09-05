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
  /** Same drill in English (exam wording) */
  promptEn?: string;
  answer: string;
  hint?: string;
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

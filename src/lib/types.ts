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
  platform: "TryHackMe" | "HackTheBox" | "INE" | "Docs" | "Kali" | "Otro";
  /** Si es true, el recurso requiere una suscripción de pago en esa plataforma */
  paid?: boolean;
}

export interface DrillItem {
  id: string;
  /** Instrucción del ejercicio de fijación (en español) */
  promptEs: string;
  /** Respuesta esperada exacta o patrón (comando en inglés, tal cual se usa) */
  answer: string;
  /** Pista opcional si el usuario se traba */
  hint?: string;
}

export interface StudyBlock {
  id: string; // ej: m1-w1-b3
  weekId: string; // ej: m1-w1
  order: number; // orden dentro de la semana
  title: string;
  /** Objetivo de una sola línea, verificable, mostrado al inicio del bloque */
  objective: string;
  durationMin: number; // 45-50
  type: BlockType;
  /** Explicación conceptual corta en español (el "por qué"). Mantener breve: ~20% teoría. */
  theoryEs?: string;
  /** Pasos prácticos, comandos y flags en inglés tal cual se usan en el examen */
  practiceSteps?: string[];
  /** IDs de subtemas que este bloque cubre (para tracking de fallos y simulacros) */
  subtopics: string[];
  drills?: DrillItem[];
  glossary?: GlossaryEntry[];
  resources?: ResourceLink[];
  /** Checklist de cierre: lo que debe quedar dominado al terminar el bloque */
  closingChecklist: string[];
  /** Recursos extra opcionales para cuando el bloque se termina antes de tiempo */
  extraResources?: ResourceLink[];
  /** Tabla comparativa opcional (herramientas/conceptos) para fijar visualmente */
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

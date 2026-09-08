export type EnergyMode = "low" | "normal" | "high";

export type MasteryStatus =
  | "LOCKED"
  | "AVAILABLE"
  | "IN_PROGRESS"
  | "PRACTICING"
  | "WEAK"
  | "READY"
  | "MASTERED";

export type ContentDepth = "QUICK" | "DEEP" | "MASTERCLASS";

export type AcademyTrack = "ejpt-prep" | "red-team-foundation";

export interface V6Skill {
  id: string;
  titleEs: string;
  whyEs: string;
  phaseId: string;
  prereqIds: string[];
  subtopicIds: string[];
  learnIds: string[];
  lessonIds: string[];
  workshopIds: string[];
  trainHrefs: string[];
  recallCategories: string[];
  boss: { titleEs: string; href: string };
  difficulty: 1 | 2 | 3 | 4 | 5;
  track: AcademyTrack;
}

export interface V6Phase {
  id: string;
  n: number;
  titleEs: string;
  /** Subtítulo pedagógico corto, ej. "Reconocimiento y descubrimiento" (V7 sección 3). */
  subtitleEs: string;
  goalEs: string;
  thinkEs: string;
  weekIds: number[];
  skillIds: string[];
  boss: { titleEs: string; href: string; whyEs: string };
  checkpoint?: { titleEs: string; lessonIds: string[]; href: string };
}

export interface SourceMeta {
  id: string;
  titleEs: string;
  url: string;
  type: "tool" | "notes" | "lab" | "wiki" | "wordlist";
  topic: string;
  difficulty: "intro" | "core" | "deep";
  license: string;
  whySelected: string;
  lastReviewed: string;
  relatedSkills: string[];
  relatedWorkshopId: string;
}

export interface CycleFlags {
  theory: boolean;
  quiz: boolean;
  guided: boolean;
  independent: boolean;
  lab: boolean;
  decision: boolean;
  challenge: boolean;
  assessment: boolean;
  srs: boolean;
}

export interface OperationNow {
  href: string;
  titleEs: string;
  objectiveEs: string;
  whyEs: string;
  phaseLabel: string;
  dayLabel: string;
  difficulty: number;
  estimatedMin: number;
  estimatedLabel: string;
  stepsDone: number;
  stepsTotal: number;
  kind: "lesson" | "lab-gate" | "review" | "remediate" | "rest" | "exam" | "boss";
  nextTitleEs: string;
  nextHref: string;
  optional: { href: string; label: string; why: string }[];
}

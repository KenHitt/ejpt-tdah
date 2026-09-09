import { FailureClass } from "@/content/v9/types";
import { getSkill } from "@/content/v6/skills";
import { drillsForSkill } from "@/content/v8/drills";

export interface RemediationStep {
  min: number;
  titleEs: string;
  href: string;
}

/** Ruta proporcional al tipo de fallo. No reenvía el módulo entero. */
export function remediationPath(skillId: string, failure: FailureClass): RemediationStep[] {
  const skill = getSkill(skillId);
  const lesson = skill?.lessonIds[0];
  const learn = skill?.learnIds[0];
  const drill = drillsForSkill(skillId)[0];
  const train = skill?.trainHrefs[0] ?? "/train/decisions";

  const recall: RemediationStep = { min: 5, titleEs: "Recall / SRS", href: "/memory" };
  const theory: RemediationStep = {
    min: 12,
    titleEs: learn ? "Ficha (concepto puntual)" : "Lección (solo el hueco)",
    href: learn ? `/learn/${learn}` : lesson ? `/clase/${lesson}` : `/master/${skillId}`,
  };
  const interpret: RemediationStep = {
    min: 10,
    titleEs: "Interpretación / 10-min",
    href: "/train/10min",
  };
  const decision: RemediationStep = {
    min: 12,
    titleEs: drill ? "Decision drill de la skill" : "Decision drills",
    href: "/train/decisions",
  };
  const lab: RemediationStep = {
    min: 25,
    titleEs: "Lab de la jornada",
    href: lesson ? `/clase/${lesson}` : "/laboratorio",
  };
  const retry: RemediationStep = { min: 15, titleEs: "Retry del assessment", href: train };

  switch (failure) {
    case "COMMAND_RECALL_FAILURE":
    case "RETENTION_FAILURE":
      return [recall, { min: 5, titleEs: "5-min fire", href: "/train/5min" }, retry];
    case "KNOWLEDGE_FAILURE":
      return [theory, recall, retry];
    case "INTERPRETATION_FAILURE":
      return [interpret, decision, retry];
    case "DECISION_FAILURE":
    case "REASONING_FAILURE":
      return [
        { min: 5, titleEs: "Reconocimiento del puerto/servicio", href: "/train/5min" },
        decision,
        interpret,
        retry,
      ];
    case "EXECUTION_FAILURE":
      return [lab, { min: 8, titleEs: "Lab HUD / LHOST", href: "/laboratorio" }, retry];
    case "METHODOLOGY_FAILURE":
      return [{ min: 15, titleEs: "Attack path", href: "/train/whats-next" }, decision, retry];
    case "TIME_MANAGEMENT_FAILURE":
      return [
        { min: 10, titleEs: "Emergency session", href: "/train/emergency" },
        { min: 12, titleEs: "Decision con reloj", href: "/train/15min" },
        retry,
      ];
    default:
      return [recall, decision];
  }
}

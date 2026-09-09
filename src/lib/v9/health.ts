import { auditAll } from "@/content/v6/audit";
import { V6_SKILLS } from "@/content/v6/skills";
import { drillsForSkill } from "@/content/v8/drills";
import { V8_MACHINES, V8_BOSSES } from "@/content/v8/operations";
import { COMMAND_BANK } from "@/content/command-bank";

/** Salud de la academia (contenido), no del alumno. */
export function academyHealth() {
  const rows = auditAll();
  const n = rows.length || 1;
  const decision = rows.filter((r) => r.flags.decision).length;
  const lab = rows.filter((r) => r.flags.lab).length;
  const assess = rows.filter((r) => r.flags.assessment).length;
  const srs = rows.filter((r) => r.flags.srs).length;
  const transfer = V6_SKILLS.filter((s) => V8_MACHINES.some((m) => m.skillIds.includes(s.id))).length;
  const extraDrills = V6_SKILLS.filter((s) => drillsForSkill(s.id).length > 0).length;
  return {
    contentCoverage: Math.round(rows.reduce((n, r) => n + r.coverage, 0) / n),
    assessmentCoverage: Math.round((assess / n) * 100),
    practicalCoverage: Math.round((lab / n) * 100),
    decisionCoverage: Math.round((decision / n) * 100),
    transferCoverage: Math.round((transfer / n) * 100),
    retentionCoverage: Math.round((srs / n) * 100),
    skills: n,
    machines: V8_MACHINES.length,
    bosses: V8_BOSSES.length,
    srsCards: COMMAND_BANK.length,
    skillsWithDrills: extraDrills,
  };
}

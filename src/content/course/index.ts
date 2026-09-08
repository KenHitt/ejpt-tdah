import { CourseLesson, CourseWeekMeta, EnrichedLesson } from "@/content/course/types";
import { enrichAll } from "@/content/course/enrich";
import { plannedHours } from "@/content/course/jornada";
import { W00 } from "@/content/course/w00";
import { W01 } from "@/content/course/w01";
import { W02 } from "@/content/course/w02";
import { W03 } from "@/content/course/w03";
import { W04 } from "@/content/course/w04";
import { W05, W06 } from "@/content/course/w05";
import { W07, W08 } from "@/content/course/w07";
import { W09, W10, W11, W12 } from "@/content/course/w09";

export const COURSE_WEEKS: CourseWeekMeta[] = [
  { week: 0, monthLabel: "Mes 0", titleEs: "Fundamentos y laboratorio", goalEs: "Kali, vboxnet, MS2 viva, alcance escrito." },
  { week: 1, monthLabel: "Mes 1", titleEs: "Reconocimiento y descubrimiento", goalEs: "Discovery, puertos, versiones, interpretar." },
  { week: 2, monthLabel: "Mes 1", titleEs: "Enumeración de servicios", goalEs: "SMB, Gobuster, Hydra: no mezclarlos." },
  { week: 3, monthLabel: "Mes 1", titleEs: "Explotación con Metasploit", goalEs: "search → set → LHOST → session → sysinfo." },
  { week: 4, monthLabel: "Mes 1", titleEs: "Explotación y acceso inicial", goalEs: "Match de versión, reverse/bind, una cadena." },
  { week: 5, monthLabel: "Mes 2", titleEs: "Seguridad web: inyección y XSS", goalEs: "Params, SQLi manual/sqlmap, XSS, cookies." },
  { week: 6, monthLabel: "Mes 2", titleEs: "Inclusión de archivos y repaso", goalEs: "LFI/RFI concepto, bypass, primer gym de reloj." },
  { week: 7, monthLabel: "Mes 2", titleEs: "Redes internas y pivoting", goalEs: "Rutas, ARP concepto, forward/SOCKS, UDP." },
  { week: 8, monthLabel: "Mes 2", titleEs: "Escalada de privilegios", goalEs: "Mapa Linux/Windows, notas, cuándo parar." },
  { week: 9, monthLabel: "Mes 3", titleEs: "Cadenas de ataque", goalEs: "Boxes bajo reloj, 80+445, reasoning." },
  { week: 10, monthLabel: "Mes 3", titleEs: "Documentación de hallazgos", goalEs: "Valores exactos, plantilla, inglés de examen." },
  { week: 11, monthLabel: "Mes 3", titleEs: "Preparación logística del examen", goalEs: "VPN, triage, integridad, T-48." },
  { week: 12, monthLabel: "Mes 3", titleEs: "Consolidación final", goalEs: "Huecos, simulacro final interno, última cadena." },
];

const COURSE_LESSONS_RAW: CourseLesson[] = [
  ...W00,
  ...W01,
  ...W02,
  ...W03,
  ...W04,
  ...W05,
  ...W06,
  ...W07,
  ...W08,
  ...W09,
  ...W10,
  ...W11,
  ...W12,
];

export const COURSE_LESSONS: EnrichedLesson[] = enrichAll(COURSE_LESSONS_RAW);

export const COURSE_HOURS = plannedHours(COURSE_LESSONS.length, COURSE_WEEKS.length);

export function lessonsForWeek(week: number) {
  return COURSE_LESSONS.filter((l) => l.week === week).sort((a, b) => a.day - b.day);
}

export function getLesson(id: string) {
  return COURSE_LESSONS.find((l) => l.id === id);
}

export function nextIncomplete(done: Record<string, unknown>) {
  return COURSE_LESSONS.find((l) => !done[l.id]) ?? COURSE_LESSONS[COURSE_LESSONS.length - 1];
}

export function pepForStreak(n: number): string {
  if (n <= 1) return "Día 1 cuenta. Abre la clase, no el feed.";
  if (n < 7) return `${n} días seguidos. El oficio se construye así, no con un finde heroico.`;
  if (n < 21) return `${n} de racha. Ya no es novedad: es identidad de estudiante.`;
  if (n < 45) return `${n} días. Mes 2 se aguanta con esto, no con motivación de Instagram.`;
  return `${n} días. Disciplina tuya. Contenido aquí. INE decide el PDF.`;
}

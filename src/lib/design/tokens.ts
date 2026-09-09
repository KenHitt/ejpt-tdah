/**
 * V7 design tokens — Offensive Security identity.
 * Un solo lugar para color de acción, estados y superficies.
 * Rojo controlado = identidad ofensiva. Ámbar = SOLO warning/pending.
 * No se inventa paleta nueva: reusa los tokens ya remapeados en globals.css
 * (--color-red-500/600, --color-emerald-*, --color-amber-*).
 */

export const ACCENT = {
  bg: "bg-red-600",
  bgHover: "hover:bg-red-500",
  text: "text-red-400",
  textStrong: "text-red-300",
  border: "border-red-700",
  borderStrong: "border-red-600",
  ring: "ring-red-600",
  soft: "bg-red-500/10",
};

export const SUCCESS = {
  bg: "bg-emerald-600",
  text: "text-emerald-400",
  border: "border-emerald-700",
  soft: "bg-emerald-500/10",
};

export const WARNING = {
  bg: "bg-amber-500",
  text: "text-amber-300",
  border: "border-amber-700",
  soft: "bg-amber-500/10",
};

export const INFO = {
  text: "text-sky-400",
  border: "border-sky-800",
  soft: "bg-sky-500/5",
};

export const CRITICAL = {
  bg: "bg-red-700",
  text: "text-red-300",
  border: "border-red-700",
  soft: "bg-red-500/10",
};

/** Surface base para cards: mismo panel en toda la app. */
export const SURFACE = "rounded-xl border border-slate-800 bg-slate-900/40";
export const SURFACE_RAISED = "rounded-xl border border-slate-700 bg-slate-900/70";
export const SURFACE_ACTIVE = `rounded-xl border-2 ${ACCENT.border} bg-slate-950`;

/** Botón primario único por pantalla (sección 38: one primary action). */
export const PRIMARY_BUTTON =
  "block w-full rounded-xl bg-red-600 py-3.5 text-center text-base font-bold text-white transition hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed";

export const SECONDARY_BUTTON =
  "rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white";

/** Badges de estado (sección 29 / 39). */
export type UiStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "practicing"
  | "weak"
  | "ready"
  | "mastered"
  | "recommended"
  | "failed"
  | "review_due"
  | "completed"
  | "active";

export function statusBadgeClass(status: UiStatus | string): string {
  switch (status.toLowerCase()) {
    case "mastered":
    case "completed":
    case "transfer_ready":
      return "bg-emerald-950 text-emerald-300 border border-emerald-800";
    case "ready":
    case "competent":
      return "bg-sky-950 text-sky-300 border border-sky-800";
    case "recommended":
    case "active":
      return "bg-red-950 text-red-300 border border-red-800";
    case "weak":
    case "failed":
    case "needs_review":
      return "bg-red-950 text-red-300 border border-red-900";
    case "review_due":
      return "bg-amber-950 text-amber-300 border border-amber-800";
    case "practicing":
    case "in_progress":
    case "learning":
    case "exposed":
      return "bg-amber-950/60 text-amber-300 border border-amber-900";
    case "locked":
    case "blocked":
    case "not_started":
      return "bg-slate-800/60 text-slate-500 border border-slate-800";
    default:
      return "bg-slate-800 text-slate-300 border border-slate-700";
  }
}

export function statusLabelEn(status: string): string {
  return status.split("_").join(" ").toUpperCase();
}

/** Barra de progreso consistente. */
export function progressBarClass(pct: number): string {
  if (pct >= 85) return "bg-emerald-500";
  if (pct >= 50) return "bg-red-500";
  if (pct > 0) return "bg-amber-500";
  return "bg-slate-700";
}

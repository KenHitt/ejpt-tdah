export function statusLabel(status: string) {
  return status.split("_").join(" ");
}

export function statusClass(status: string) {
  if (status === "MASTERED") return "bg-emerald-950 text-emerald-300";
  if (status === "READY") return "bg-sky-950 text-sky-300";
  if (status === "WEAK") return "bg-red-950 text-red-300";
  if (status === "LOCKED") return "bg-slate-800 text-slate-500";
  if (status === "PRACTICING" || status === "IN_PROGRESS") return "bg-amber-950 text-amber-300";
  return "bg-slate-800 text-slate-300";
}

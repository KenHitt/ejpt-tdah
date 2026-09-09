export function statusLabel(status: string) {
  return status.split("_").join(" ");
}

export function statusClass(status: string) {
  if (status === "MASTERED" || status === "TRANSFER_READY") return "bg-emerald-950 text-emerald-300";
  if (status === "READY" || status === "COMPETENT") return "bg-sky-950 text-sky-300";
  if (status === "WEAK" || status === "NEEDS_REVIEW") return "bg-red-950 text-red-300";
  if (status === "LOCKED" || status === "BLOCKED") return "bg-slate-800 text-slate-500";
  if (status === "PRACTICING" || status === "IN_PROGRESS" || status === "LEARNING" || status === "EXPOSED") {
    return "bg-amber-950 text-amber-300";
  }
  return "bg-slate-800 text-slate-300";
}

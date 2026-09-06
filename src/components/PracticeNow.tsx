import Link from "next/link";

export function PracticeNow({ topicLabel }: { topicLabel: string }) {
  return (
    <div className="rounded-lg border border-emerald-800/40 bg-emerald-500/5 p-4">
      <p className="font-mono text-xs text-emerald-400">YOU JUST READ ABOUT {topicLabel.toUpperCase()}.</p>
      <p className="mt-1 text-sm text-white">WHAT NOW?</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/train/5min" className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">
          5-MIN DRILL
        </Link>
        <Link href="/train/10min" className="rounded-md border border-emerald-700 px-3 py-2 text-xs text-emerald-200">
          10-MIN CHALLENGE
        </Link>
        <Link href="/laboratorio" className="rounded-md border border-slate-600 px-3 py-2 text-xs text-slate-300">
          LAB
        </Link>
        <Link href="/memory" className="rounded-md border border-slate-600 px-3 py-2 text-xs text-slate-300">
          RECALL
        </Link>
      </div>
    </div>
  );
}

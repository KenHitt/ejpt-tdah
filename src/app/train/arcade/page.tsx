import Link from "next/link";

export default function ArcadePage() {
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link href="/train" className="text-xs text-slate-500">
        ← TRAIN
      </Link>
      <p className="font-mono text-xs text-amber-400">ARCADE · práctica ligera, no el examen</p>
      <h1 className="text-2xl font-bold text-white">RED TEAM ARCADE</h1>
      <div className="grid grid-cols-2 gap-2">
        {[
          ["/train/arcade/port-hunt", "PORT HUNT"],
          ["/train/arcade/nmap-rush", "NMAP RUSH"],
          ["/train/whats-next", "WHAT'S NEXT?"],
          ["/memory", "COMMAND MEMORY"],
          ["/train/decisions", "SMB / WEB / NEXT"],
          ["/train/5min", "LINUX / MSF / WEB"],
        ].map(([href, t]) => (
          <Link key={href} href={href} className="rounded-md border border-slate-800 p-3 text-center text-sm text-emerald-300 hover:border-emerald-600">
            {t}
          </Link>
        ))}
      </div>
      <p className="text-xs text-slate-500">Partidas 1–5 min. El lab serio está en OPERATE.</p>
    </div>
  );
}

import Link from "next/link";
import { V6_SKILLS } from "@/content/v6/skills";
import { getSkill } from "@/content/v6/skills";

const CHAIN = ["networking", "nmap", "enumeration", "vuln", "exploitation", "post", "privesc-linux"];

export default function SkillMapPage() {
  return (
    <div className="mx-auto max-w-xl space-y-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-red-400">Skill map</p>
      <h1 className="text-3xl font-bold text-white">Dependencies</h1>
      <p className="text-sm text-slate-400">Prerequisites and where this leads. Not a video game map.</p>

      <ol className="space-y-1 font-mono text-sm text-slate-300">
        {CHAIN.map((id, i) => {
          const s = getSkill(id);
          return (
            <li key={id}>
              {i > 0 && <p className="pl-4 text-slate-600">↓</p>}
              <Link href={`/master/${id}`} className="text-red-300 hover:underline">
                {s?.titleEs ?? id}
              </Link>
            </li>
          );
        })}
      </ol>

      <section className="space-y-2 text-sm">
        <h2 className="font-semibold text-white">Web branch</h2>
        <p className="font-mono text-slate-400">HTTP enum → Web → SQLi / XSS / LFI</p>
        <p>
          {["http-enum", "web", "sqli", "xss", "lfi"].map((id, i) => (
            <span key={id}>
              {i > 0 ? " · " : ""}
              <Link href={`/master/${id}`} className="text-red-400">
                {getSkill(id)?.titleEs ?? id}
              </Link>
            </span>
          ))}
        </p>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="font-semibold text-white">SMB / Windows branch</h2>
        <p>
          {["smb", "privesc-windows"].map((id, i) => (
            <span key={id}>
              {i > 0 ? " · " : ""}
              <Link href={`/master/${id}`} className="text-red-400">
                {getSkill(id)?.titleEs ?? id}
              </Link>
            </span>
          ))}
        </p>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="font-semibold text-white">Internal</h2>
        <p>
          {["networking", "pivoting"].map((id, i) => (
            <span key={id}>
              {i > 0 ? " · " : ""}
              <Link href={`/master/${id}`} className="text-red-400">
                {getSkill(id)?.titleEs ?? id}
              </Link>
            </span>
          ))}
        </p>
      </section>

      <ul className="space-y-2">
        {V6_SKILLS.map((s) => (
          <li key={s.id} className="rounded-lg border border-slate-800 p-3">
            <Link href={`/master/${s.id}`} className="font-semibold text-white hover:text-red-400">
              {s.titleEs}
            </Link>
            <p className="text-[11px] text-slate-500">
              Why: {s.whyEs}
            </p>
            <p className="text-[11px] text-slate-500">
              Prerequisites: {s.prereqIds.length ? s.prereqIds.map((id) => getSkill(id)?.titleEs ?? id).join(", ") : "—"}
            </p>
            <p className="text-[11px] text-slate-600">
              Leads to: {V6_SKILLS.filter((x) => x.prereqIds.includes(s.id))
                .map((x) => x.titleEs)
                .join(", ") || "—"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

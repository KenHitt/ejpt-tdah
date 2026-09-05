import { ResourceLink } from "@/lib/types";

const PLATFORM_COLOR: Record<ResourceLink["platform"], string> = {
  TryHackMe: "bg-red-500/10 text-red-400",
  HackTheBox: "bg-green-500/10 text-green-400",
  INE: "bg-blue-500/10 text-blue-400",
  Docs: "bg-slate-500/10 text-slate-300",
  Kali: "bg-sky-500/10 text-sky-400",
  VulnHub: "bg-orange-500/10 text-orange-300",
  Local: "bg-lime-500/10 text-lime-400",
  Otro: "bg-slate-500/10 text-slate-300",
};

export function ResourceList({ resources, title = "Recursos" }: { resources: ResourceLink[]; title?: string }) {
  if (!resources.length) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      <ul className="space-y-1.5">
        {resources.map((r) => (
          <li key={r.url} className="flex items-center gap-2 text-sm">
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${PLATFORM_COLOR[r.platform]}`}>{r.platform}</span>
            <a href={r.url} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
              {r.label}
            </a>
            {r.paid && <span className="text-[10px] text-amber-400">(de pago)</span>}
          </li>
        ))}
      </ul>
      <p className="mt-1 text-[11px] text-slate-500">
        Si algún link cambió de slug, busca el nombre exacto en la barra de búsqueda de la plataforma.
      </p>
    </div>
  );
}

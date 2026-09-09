"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProgress } from "@/lib/progress/context";
import { ACADEMY_NAME } from "@/content/academy/program";

/** Primary nav = las 5 funciones que responden "qué hago ahora / qué aprendo / dónde practico /
 * qué reforzar / estoy listo" (V7 sección 1). Nada más compite visualmente con esto. */
const PRIMARY = [
  { href: "/", label: "Mission" },
  { href: "/clase", label: "Academy" },
  { href: "/laboratorio", label: "Lab" },
  { href: "/memory", label: "Review" },
  { href: "/simulacro", label: "Exam" },
];

/** Secondary nav agrupado (V7 sección 2). Reference = consulta rápida.
 * Analytics = cómo voy. System = cuenta / ayuda. Train vive dentro de Review. */
const SECONDARY_GROUPS: { label: string; links: { href: string; label: string }[] }[] = [
  {
    label: "Practice",
    links: [
      { href: "/operaciones", label: "Operations" },
      { href: "/train", label: "Training Gym" },
    ],
  },
  {
    label: "Reference",
    links: [
      { href: "/learn", label: "Reference" },
      { href: "/talleres", label: "Deep Dives" },
      { href: "/fuentes", label: "Sources & Provenance" },
    ],
  },
  {
    label: "Analytics",
    links: [
      { href: "/progreso", label: "Dashboard" },
      { href: "/plan", label: "Plan" },
      { href: "/auditoria", label: "Audit" },
      { href: "/mapa", label: "Skill Map" },
    ],
  },
  {
    label: "System",
    links: [
      { href: "/como-usar", label: "Cómo usar" },
      { href: "/login", label: "Cuenta" },
    ],
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { syncMode } = useProgress();
  const inFocus = pathname.startsWith("/focus");

  if (inFocus) {
    return (
      <header className="border-b border-red-900/60 bg-black px-4 py-2">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <span className="font-mono text-xs text-red-400">FOCUS · una pantalla</span>
          <Link href="/" className="text-xs text-slate-400 hover:text-white">
            Salir
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-semibold tracking-tight text-white">
            {ACADEMY_NAME}
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {PRIMARY.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    active ? "bg-red-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <span className={`hidden h-2 w-2 rounded-full sm:inline ${syncMode === "cloud" ? "bg-emerald-400" : "bg-slate-600"}`} />
        </div>
        <nav className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1">
          {SECONDARY_GROUPS.map((group) => (
            <span key={group.label} className="flex items-center gap-2 text-[11px]">
              <span className="uppercase tracking-wide text-slate-600">{group.label}</span>
              {group.links.map((l) => (
                <Link key={l.href} href={l.href} className="text-slate-500 hover:text-red-400">
                  {l.label}
                </Link>
              ))}
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
}

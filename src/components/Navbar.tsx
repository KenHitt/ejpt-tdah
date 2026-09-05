"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProgress } from "@/lib/progress/context";

const LINKS = [
  { href: "/", label: "Hoy" },
  { href: "/teoria", label: "Teoría" },
  { href: "/como-usar", label: "Cómo usar" },
  { href: "/laboratorio", label: "Lab" },
  { href: "/memory", label: "Recall" },
  { href: "/plan", label: "Plan" },
  { href: "/simulacro", label: "Examen" },
  { href: "/progreso", label: "Horas" },
  { href: "/glosario", label: "EN/ES" },
  { href: "/login", label: "Cuenta" },
];

export function Navbar() {
  const pathname = usePathname();
  const { syncMode } = useProgress();
  const inFocus = pathname.startsWith("/focus");

  if (inFocus) {
    return (
      <header className="border-b border-emerald-900/40 bg-slate-950 px-4 py-2">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <span className="font-mono text-xs text-emerald-500">FOCUS · hide the rest</span>
          <Link href="/" className="text-xs text-slate-400 hover:text-white">
            Salir
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2 font-mono text-sm font-semibold text-emerald-400">
          <span>eJPT_in_3</span>
          <span className="text-slate-500">:: plan de ataque</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  active
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
          <span
            className={`h-2 w-2 rounded-full ${syncMode === "cloud" ? "bg-emerald-400" : "bg-amber-400"}`}
            title={syncMode === "cloud" ? "Sincronizado con Supabase" : "Guardado en este navegador (sobrevive al reinicio)"}
          />
          {syncMode === "cloud" ? "Nube" : "Local OK"}
        </div>
      </div>
    </header>
  );
}

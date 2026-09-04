"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProgress } from "@/lib/progress/context";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/plan", label: "Plan" },
  { href: "/simulacro", label: "Simulacros" },
  { href: "/progreso", label: "Progreso" },
  { href: "/glosario", label: "Glosario" },
  { href: "/login", label: "Cuenta" },
];

export function Navbar() {
  const pathname = usePathname();
  const { syncMode } = useProgress();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2 font-mono text-sm font-semibold text-emerald-400">
          <span>eJPT_in_3</span>
          <span className="text-slate-500">:: plan de ataque</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {LINKS.map((link) => {
            const active = pathname === link.href;
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
            title={syncMode === "cloud" ? "Sincronizado con Supabase" : "Guardado local (Supabase no configurado o sin sesión)"}
          />
          {syncMode === "cloud" ? "Supabase" : "Local"}
        </div>
      </div>
    </header>
  );
}

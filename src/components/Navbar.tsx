"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProgress } from "@/lib/progress/context";
import { ACADEMY_NAME } from "@/content/academy/program";

const PRIMARY = [
  { href: "/", label: "Hoy" },
  { href: "/clase", label: "Academia" },
  { href: "/laboratorio", label: "Lab" },
  { href: "/talleres", label: "Talleres" },
  { href: "/train", label: "Práctica" },
  { href: "/simulacro", label: "Exámenes" },
  { href: "/progreso", label: "Progreso" },
];

const SECONDARY = [
  { href: "/learn", label: "Biblioteca" },
  { href: "/teoria", label: "Repaso móvil" },
  { href: "/glosario", label: "EN/ES" },
  { href: "/como-usar", label: "Cómo usar" },
  { href: "/login", label: "Cuenta" },
  { href: "/plan", label: "Plan detallado" },
];

export function Navbar() {
  const pathname = usePathname();
  const { syncMode } = useProgress();
  const inFocus = pathname.startsWith("/focus");

  if (inFocus) {
    return (
      <header className="border-b border-emerald-900/80 bg-black px-4 py-2">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <span className="font-mono text-xs text-emerald-400">FOCUS · una pantalla</span>
          <Link href="/" className="text-xs text-amber-300 hover:text-white">
            Salir
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-semibold tracking-tight text-white">
            {ACADEMY_NAME}
          </Link>
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {PRIMARY.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    active ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <span className={`hidden h-2 w-2 rounded-full sm:inline ${syncMode === "cloud" ? "bg-emerald-400" : "bg-amber-400"}`} />
        </div>
        <nav className="mt-1 flex flex-wrap gap-3 text-[11px] text-slate-500">
          {SECONDARY.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-emerald-400">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

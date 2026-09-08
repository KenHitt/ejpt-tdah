"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProgress } from "@/lib/progress/context";
import { ACADEMY_NAME } from "@/content/academy/program";

const PRIMARY = [
  { href: "/", label: "Mission" },
  { href: "/clase", label: "Academy" },
  { href: "/laboratorio", label: "Lab" },
  { href: "/train", label: "Train" },
  { href: "/memory", label: "Review" },
  { href: "/simulacro", label: "Exam" },
];

const SECONDARY = [
  { href: "/learn", label: "Library" },
  { href: "/talleres", label: "Workshops" },
  { href: "/fuentes", label: "Sources" },
  { href: "/progreso", label: "Progress" },
  { href: "/plan", label: "Plan" },
  { href: "/auditoria", label: "Audit" },
  { href: "/como-usar", label: "Cómo usar" },
  { href: "/login", label: "Cuenta" },
];

export function Navbar() {
  const pathname = usePathname();
  const { syncMode } = useProgress();
  const inFocus = pathname.startsWith("/focus");

  if (inFocus) {
    return (
      <header className="border-b border-amber-900/60 bg-black px-4 py-2">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <span className="font-mono text-xs text-amber-400">FOCUS · una pantalla</span>
          <Link href="/" className="text-xs text-slate-400 hover:text-white">
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
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    active ? "bg-amber-500 text-black" : "text-slate-300 hover:bg-slate-800 hover:text-white"
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
            <Link key={l.href} href={l.href} className="hover:text-amber-400">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

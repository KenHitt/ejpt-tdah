"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProgress } from "@/lib/progress/context";

const PRIMARY = [
  { href: "/", label: "OPERATE" },
  { href: "/clase", label: "CLASE" },
  { href: "/hub", label: "GITHUB" },
  { href: "/train", label: "TRAIN" },
  { href: "/learn", label: "LEARN" },
  { href: "/laboratorio", label: "LAB" },
  { href: "/memory", label: "RECALL" },
  { href: "/simulacro", label: "EXAM" },
];

const SECONDARY = [
  { href: "/plan", label: "Plan" },
  { href: "/progreso", label: "Horas" },
  { href: "/teoria", label: "Teoría bloques" },
  { href: "/como-usar", label: "Cómo usar" },
  { href: "/glosario", label: "EN/ES" },
  { href: "/login", label: "Cuenta" },
];

export function Navbar() {
  const pathname = usePathname();
  const { syncMode } = useProgress();
  const inFocus = pathname.startsWith("/focus");

  if (inFocus) {
    return (
      <header className="border-b border-red-900/80 bg-black px-4 py-2">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <span className="font-mono text-xs text-red-400">OPERATION MODE · HUD only</span>
          <Link href="/" className="text-xs text-amber-300 hover:text-white">
            EXIT
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-red-900/50 bg-black/85 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="font-mono text-sm font-semibold text-red-400">
            eJPT_RT
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
                  className={`rounded-md px-2.5 py-1.5 font-mono text-xs tracking-wide ${
                    active ? "bg-red-600 text-white" : "text-slate-200 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <span className={`hidden h-2 w-2 rounded-full sm:inline ${syncMode === "cloud" ? "bg-emerald-400" : "bg-amber-400"}`} />
        </div>
        <nav className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-400">
          {SECONDARY.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-red-400">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

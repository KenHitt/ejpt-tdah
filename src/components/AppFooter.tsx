"use client";

import { usePathname } from "next/navigation";

export function AppFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/focus")) return null;
  return (
    <footer className="border-t border-red-900/40 px-4 py-4 text-center text-xs text-slate-300">
      Red team lab: Kali host · VirtualBox víctimas Host-Only. Esta web no es INE. Contraste alto · una misión.
    </footer>
  );
}

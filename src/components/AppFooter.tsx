"use client";

import { usePathname } from "next/navigation";

export function AppFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/focus")) return null;
  return (
    <footer className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-500">
      Objetivo fijo: eJPT en 3 meses, primer intento. Kali = host OS. VirtualBox = victims only. Focus → fail → explain →
      repeat.
    </footer>
  );
}

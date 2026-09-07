"use client";

import { usePathname } from "next/navigation";

export function AppFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/focus")) return null;
  return (
    <footer className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-500">
      eJPT Academy · Kali host · víctimas en VirtualBox Host-Only · no es INE
    </footer>
  );
}

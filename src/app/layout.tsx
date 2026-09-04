import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/lib/progress/context";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "eJPT en 3 Meses — Plan de estudio",
  description: "Plan de estudio calibrado para aprobar el eJPT en 3 meses, diseñado para TDAH.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <ProgressProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
          <footer className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-500">
            Objetivo fijo: aprobar el eJPT en 3 meses, al primer intento. Sin excepciones.
          </footer>
        </ProgressProvider>
      </body>
    </html>
  );
}

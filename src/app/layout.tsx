import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/lib/progress/context";
import { CourseProvider } from "@/lib/course/context";
import { Navbar } from "@/components/Navbar";
import { AppFooter } from "@/components/AppFooter";
import { PwaRegister } from "@/components/PwaRegister";

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
  applicationName: "eJPT en 3 meses",
  appleWebApp: {
    capable: true,
    title: "eJPT",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#8b1515",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="rt-scanlines min-h-full flex flex-col bg-slate-950 text-slate-100">
        <ProgressProvider>
          <CourseProvider>
          <PwaRegister />
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
          <AppFooter />
          </CourseProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}

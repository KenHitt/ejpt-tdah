"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { getAllBlocks } from "@/content/curriculum";
import { useProgress } from "@/lib/progress/context";

export default function ComoUsarPage() {
  const { state } = useProgress();
  const nextBlock = getAllBlocks().find((b) => state.blockStatus[b.id] !== "completed");

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs text-emerald-400">HOW THIS SITE WORKS · TDAH: un paso a la vez</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Esta web no es un curso. Es un temporizador + checklist.</h1>
        <p className="mt-2 text-sm text-slate-400">
          No leas el Plan entero. No abras 6 pestañas. Hoy haces <strong>un bloque</strong> (45–50 min) y cierras.
        </p>
      </div>

      <ol className="space-y-4">
        <HowStep n={1} en="Open ONE block" es="Abre UN bloque">
          Pulsa el botón verde del Dashboard (&quot;Empezar bloque&quot;). No entres a Plan a mirar las 12 semanas.
          {nextBlock && (
            <Link href={`/plan/${nextBlock.id}`} className="mt-2 inline-block text-emerald-400 underline">
              Ir ahora al siguiente bloque: {nextBlock.title} →
            </Link>
          )}
        </HowStep>
        <HowStep n={2} en="Read the objective (ES + EN)" es="Lee el objetivo (español e inglés)">
          Arriba del bloque hay el objetivo en español y debajo en inglés (como el examen). Si no puedes marcarlo como hecho al
          final, el bloque no está cerrado.
        </HowStep>
        <HowStep n={3} en="Do the commands in YOUR Kali terminal" es="Los comandos van en TU Kali (SO principal)">
          Kali está instalado en el disco, no dentro de VirtualBox. VirtualBox solo corre las <em>víctimas</em>{" "}
          (Metasploitable 2, Kioptrix). Tú atacas desde la terminal de Kali: <code className="text-emerald-300">nmap</code>,{" "}
          <code className="text-emerald-300">msfconsole</code>, etc.
        </HowStep>
        <HowStep n={4} en="Type drills from memory" es="Escribe los drills de memoria">
          Caja verde = comando en inglés exacto. Si no sale, no copies-pega del paso de arriba: cierra los ojos 10 s y reescribe.
        </HowStep>
        <HowStep n={5} en="Tick the closing checklist + mark block done" es="Checklist + marcar bloque">
          Eso se guarda en este navegador. Reiniciar el PC no lo borra. Luego 10 min de descanso. Fin.
        </HowStep>
      </ol>

      <div className="grid gap-3 sm:grid-cols-2">
        <Dont title="NO hagas hoy" items={["Leer todo el Plan", "Empezar Metasploit si aún no hay ping a la VM", "Abrir THM y esta web a la vez"]} />
        <Do title="SÍ haces hoy (elige 1)" items={["Si no hay ping → Lab local, bloque 1", "Si hay ping → el botón verde del Dashboard", "Si fallaste un drill → Repaso, no el siguiente tema"]} />
      </div>

      <div className="rounded-lg border border-slate-800 p-4 text-sm text-slate-300">
        <p className="font-semibold text-white">Mapa de la barra (qué es cada cosa)</p>
        <ul className="mt-2 space-y-1 text-slate-400">
          <li>
            <strong className="text-slate-200">Dashboard</strong> — único sitio de &quot;qué hago ahora&quot;.
          </li>
          <li>
            <strong className="text-slate-200">Cómo usar</strong> — esta página. Vuelve si te pierdes.
          </li>
          <li>
            <strong className="text-slate-200">Lab local</strong> — descargas + red. Kali = host. VirtualBox = víctimas.
          </li>
          <li>
            <strong className="text-slate-200">Plan</strong> — lista larga. Úsala solo para marcar o saltar a un bloque concreto.
          </li>
          <li>
            <strong className="text-slate-200">Simulacros</strong> — quizzes. Mes 1 = skill-checks cortos. Mes 2+ = examen de 20 min.
          </li>
          <li>
            <strong className="text-slate-200">Progreso</strong> — horas + backup JSON.
          </li>
        </ul>
      </div>
    </div>
  );
}

function HowStep({ n, en, es, children }: { n: number; en: string; es: string; children: ReactNode }) {
  return (
    <li className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <p className="font-mono text-xs text-emerald-400">
        STEP {n} · {en}
      </p>
      <p className="font-semibold text-white">{es}</p>
      <div className="mt-1 text-sm text-slate-400">{children}</div>
    </li>
  );
}

function Dont({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-red-900/50 bg-red-500/5 p-4">
      <p className="text-sm font-semibold text-red-300">{title}</p>
      <ul className="mt-2 list-disc pl-5 text-sm text-slate-400">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function Do({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-emerald-900/50 bg-emerald-500/5 p-4">
      <p className="text-sm font-semibold text-emerald-300">{title}</p>
      <ul className="mt-2 list-disc pl-5 text-sm text-slate-400">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { LEARN_ARTICLES } from "@/content/learn-articles";

export default function LearnIndexPage() {
  const tracks = Array.from(new Set(LEARN_ARTICLES.map((a) => a.track)));
  return (
    <div className="space-y-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">Biblioteca</p>
      <h1 className="mt-2 text-2xl font-bold text-white">Fichas de repaso</h1>
      <p className="text-sm text-slate-400">
        {LEARN_ARTICLES.length} fichas (redes, Linux, recon, enum, web, explotación, post, pivot, Windows). Ampliar
        superficie sube probabilidad; no garantiza el aprobado de INE. Una ficha por sesión: recall, challenge, práctica.
      </p>
      {tracks.map((t) => (
        <section key={t}>
          <h2 className="mb-2 font-mono text-xs text-emerald-500">{t}</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {LEARN_ARTICLES.filter((a) => a.track === t).map((a) => (
              <li key={a.id}>
                <Link href={`/learn/${a.id}`} className="block rounded-md border border-slate-800 p-3 hover:border-emerald-600">
                  <p className="text-white">{a.titleEs}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <Link href="/teoria" className="text-sm text-emerald-400 underline">
        Teoría por bloque (offline) →
      </Link>
    </div>
  );
}

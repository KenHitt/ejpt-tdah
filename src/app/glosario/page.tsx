"use client";

import { useMemo, useState } from "react";
import { getAllBlocks } from "@/content/curriculum";

export default function GlosarioPage() {
  const [query, setQuery] = useState("");

  const entries = useMemo(() => {
    const all = getAllBlocks().flatMap((b) => b.glossary ?? []);
    const map = new Map<string, string>();
    all.forEach((e) => map.set(e.en.toLowerCase(), e.es));
    return Array.from(map.entries())
      .map(([en, es]) => ({ en, es }))
      .sort((a, b) => a.en.localeCompare(b.en));
  }, []);

  const filtered = entries.filter(
    (e) => e.en.toLowerCase().includes(query.toLowerCase()) || e.es.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Glosario bilingüe completo</h1>
        <p className="mt-1 text-sm text-slate-400">
          Todos los términos técnicos acumulados del plan, en inglés (como aparecen en el examen real) y español.
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar término (inglés o español)..."
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
      />

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-3 py-2 font-mono">English</th>
              <th className="px-3 py-2">Español</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((e) => (
              <tr key={e.en}>
                <td className="px-3 py-2 font-mono text-emerald-400">{e.en}</td>
                <td className="px-3 py-2 text-slate-300">{e.es}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">{filtered.length} términos</p>
    </div>
  );
}

import { GlossaryEntry } from "@/lib/types";

export function GlossaryTable({ entries }: { entries: GlossaryEntry[] }) {
  if (!entries.length) return null;
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900 text-slate-400">
          <tr>
            <th className="px-3 py-2 font-mono">English</th>
            <th className="px-3 py-2">Español</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {entries.map((e) => (
            <tr key={e.en}>
              <td className="px-3 py-2 font-mono text-emerald-400">{e.en}</td>
              <td className="px-3 py-2 text-slate-300">{e.es}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

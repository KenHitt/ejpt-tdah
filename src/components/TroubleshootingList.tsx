import { TroubleItem } from "@/lib/types";

export function TroubleshootingList({ items }: { items: TroubleItem[] }) {
  if (!items.length) return null;
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-400">Si algo falla</h2>
      <p className="text-xs text-slate-500">Causa → diagnóstico → comando → arreglo → cómo comprobar. Solo tu lab.</p>
      <ul className="space-y-3">
        {items.map((t) => (
          <li key={t.id} className="rounded-lg border border-amber-900/40 bg-amber-500/5 p-3 text-sm">
            <p className="font-semibold text-amber-200">{t.symptom}</p>
            <p className="mt-1 text-slate-300">
              <span className="text-xs text-slate-500">Causa: </span>
              {t.cause}
            </p>
            <p className="mt-1 text-slate-300">
              <span className="text-xs text-slate-500">Diagnóstico: </span>
              {t.diagnose}
            </p>
            {t.command && (
              <pre className="mt-2 overflow-x-auto font-mono text-xs text-emerald-300">{t.command}</pre>
            )}
            <p className="mt-1 text-slate-300">
              <span className="text-xs text-slate-500">Solución: </span>
              {t.fix}
            </p>
            <p className="mt-1 text-slate-300">
              <span className="text-xs text-slate-500">Verificar: </span>
              {t.verify}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

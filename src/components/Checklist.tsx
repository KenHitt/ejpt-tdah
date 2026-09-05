"use client";

import { useProgress } from "@/lib/progress/context";

export function Checklist({ items, storageKey }: { items: string[]; storageKey: string }) {
  const { state, toggleChecklistItem } = useProgress();
  const checked = (state.checklists ?? {})[storageKey] ?? {};
  const doneCount = items.filter((_, i) => checked[String(i)]).length;

  return (
    <div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={`${storageKey}-${i}`}>
            <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={!!checked[String(i)]}
                onChange={(e) => toggleChecklistItem(storageKey, i, e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
              />
              <span className={checked[String(i)] ? "text-slate-500 line-through" : ""}>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-slate-500">
        {doneCount}/{items.length} marcados (se guardan al reiniciar el portátil)
      </p>
    </div>
  );
}

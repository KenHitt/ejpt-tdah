"use client";

import { useState } from "react";

export function Checklist({ items, storageKey }: { items: string[]; storageKey: string }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const toggle = (i: number) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={`${storageKey}-${i}`}>
            <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => toggle(i)}
                className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
              />
              <span className={checked[i] ? "text-slate-500 line-through" : ""}>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-slate-500">
        {doneCount}/{items.length} marcados
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { PRIMARY_BUTTON } from "@/lib/design/tokens";

export default function FullOperationBriefPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href="/operaciones" className="text-xs text-slate-500">
        ← Operations
      </Link>
      <p className="text-[11px] uppercase tracking-wide text-red-400">Full red team operation</p>
      <h1 className="text-2xl font-bold text-white">Unknown path</h1>
      <p className="text-sm text-slate-400">
        You receive scope, target(s), objective and rules. You do not receive commands, the attack path, the tool
        choice or the vulnerability. Tabletop — still only your authorized lab.
      </p>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-[10px] uppercase text-slate-500">Scope</dt>
          <dd>Your Host-Only / written CIDR. Nothing else.</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase text-slate-500">Objective</dt>
          <dd>Prove a method: recon → enum → hypothesis → validate → (maybe) exploit → notes.</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase text-slate-500">You log</dt>
          <dd className="text-slate-400">
            Recon, enumeration, hypothesis, validation, exploitation, access, privesc, post, pivot if needed,
            evidence, reporting strings.
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase text-slate-500">You do not get</dt>
          <dd className="text-slate-400">Walkthrough, HINT 5, or a skill checklist on the boss.</dd>
        </div>
      </dl>
      <Link href="/operaciones/m09" className={PRIMARY_BUTTON}>
        START FULL CHAIN (M09)
      </Link>
      <Link href="/operaciones/m10" className="block text-center text-sm text-slate-500 hover:text-red-400">
        Or Boss M10 (no skill list)
      </Link>
    </div>
  );
}

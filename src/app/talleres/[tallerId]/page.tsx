"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ACADEMY_WORKSHOPS, getWorkshop } from "@/content/academy/workshops";
import { TallerBlock } from "@/components/course/TallerBlock";

export default function TallerPage() {
  const params = useParams<{ tallerId: string }>();
  const workshop = getWorkshop(params.tallerId);
  const idx = ACADEMY_WORKSHOPS.findIndex((w) => w.id === params.tallerId);
  const prev = idx > 0 ? ACADEMY_WORKSHOPS[idx - 1] : null;
  const next = idx >= 0 && idx < ACADEMY_WORKSHOPS.length - 1 ? ACADEMY_WORKSHOPS[idx + 1] : null;

  if (!workshop) {
    return (
      <Link href="/talleres" className="text-emerald-400">
        Talleres
      </Link>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/talleres" className="text-xs text-slate-500 hover:text-emerald-400">
        ← Talleres
      </Link>
      <TallerBlock workshop={workshop} />
      <p className="text-sm text-slate-400">
        Cuando termines, vuelve a la jornada de Academia o abre el siguiente taller. Lab: solo tus VMs y localhost.
      </p>
      <div className="flex justify-between text-sm">
        {prev ? (
          <Link href={`/talleres/${prev.id}`} className="text-slate-400">
            ← {prev.titleEs}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/talleres/${next.id}`} className="text-emerald-400">
            {next.titleEs} →
          </Link>
        ) : (
          <Link href="/clase" className="text-emerald-400">
            Academia →
          </Link>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress/context";
import { diagnosePace } from "@/lib/regime";
import { getSubtopic } from "@/content/subtopics";
import { RegimeDayType } from "@/lib/types";
import { ProgressState } from "@/lib/progress/state";

export default function ProgresoPage() {
  const { state, addSession, ensurePlanStarted, importState, syncMode } = useProgress();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [regimeDayType, setRegimeDayType] = useState<RegimeDayType>("trabajo");
  const [hoursPlanned, setHoursPlanned] = useState(2);
  const [hoursActual, setHoursActual] = useState(2);

  const diagnosis = diagnosePace(state.sessions, state.planStartedAt);

  const failuresList = Object.values(state.failures).filter((f) => f.status !== "resolved");

  const handleLogSession = (e: React.FormEvent) => {
    e.preventDefault();
    ensurePlanStarted();
    addSession({
      id: `session:${Date.now()}`,
      date,
      regimeDayType,
      hoursPlanned,
      hoursActual,
      blocksCompleted: [],
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Progreso honesto</h1>
        <p className="mt-1 text-sm text-slate-400">
          Regla fija #8: sin motivación vacía. Estos números comparan tus horas reales contra las horas que el plan necesita para
          los 3 meses, según tu régimen 20x10.
        </p>
      </div>

      {!state.planStartedAt && (
        <div className="rounded-lg border border-sky-700/50 bg-sky-500/5 p-4 text-sm text-sky-200">
          Todavía no marcaste el inicio de tu plan de 3 meses. Se marcará automáticamente al registrar tu primera sesión.
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Horas requeridas (total, con colchón real)" value={`${diagnosis.totalHoursRequired} h`} />
        <StatCard label="Horas disponibles según régimen 20x10 (90 días)" value={`${diagnosis.totalHoursAvailable} h`} />
        <StatCard label="Horas que deberías tener acumuladas hoy" value={`${diagnosis.hoursRequiredSoFar} h`} />
        <StatCard label="Horas reales registradas" value={`${diagnosis.hoursLoggedActual} h`} highlight={!diagnosis.onTrack} />
      </section>

      <section
        className={`rounded-lg border p-5 ${
          diagnosis.onTrack ? "border-emerald-700 bg-emerald-500/5" : "border-red-700 bg-red-500/10"
        }`}
      >
        {diagnosis.onTrack ? (
          <p className="text-sm text-emerald-300">
            ✔ Vas dentro del margen esperado (déficit de {diagnosis.deficitHours}h, tolerancia 2h). Sigue el plan como está.
          </p>
        ) : (
          <div className="space-y-2 text-sm text-red-200">
            <p className="font-semibold">
              ⚠ Diagnóstico honesto: llevas un déficit de {diagnosis.deficitHours} horas respecto a lo que el plan necesita a esta
              fecha.
            </p>
            <p>
              Al ritmo real que llevas, necesitarías aproximadamente {diagnosis.projectedExtraDaysNeeded} día(s) MÁS de los 90
              planeados para cubrir todo el contenido con el mismo nivel de profundidad.
            </p>
            <p className="text-red-300">
              Opciones honestas: (1) usa tus próximos días libres del régimen 20x10 para compensar horas, (2) comprime bloques de
              teoría/drill redundantes que ya domines, o (3) acepta el riesgo de menos margen antes del examen. No hay una cuarta
              opción de &ldquo;ponerte al día sin invertir horas&rdquo;.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Registrar sesión de estudio</h2>
        <form onSubmit={handleLogSession} className="grid gap-3 sm:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Fecha
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-200"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Tipo de día (régimen 20x10)
            <select
              value={regimeDayType}
              onChange={(e) => setRegimeDayType(e.target.value as RegimeDayType)}
              className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-200"
            >
              <option value="trabajo">Día de trabajo (2h)</option>
              <option value="libre">Día libre (6-12h)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Horas planeadas
            <input
              type="number"
              min={0}
              step={0.5}
              value={hoursPlanned}
              onChange={(e) => setHoursPlanned(Number(e.target.value))}
              className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-200"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Horas reales invertidas
            <input
              type="number"
              min={0}
              step={0.5}
              value={hoursActual}
              onChange={(e) => setHoursActual(Number(e.target.value))}
              className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-200"
            />
          </label>
          <button
            type="submit"
            className="col-span-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Registrar sesión
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">
          Historial de sesiones ({state.sessions.length})
        </h2>
        <div className="max-h-64 space-y-1 overflow-y-auto">
          {[...state.sessions].reverse().map((s) => (
            <div key={s.id} className="flex justify-between rounded-md bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300">
              <span>
                {s.date} · {s.regimeDayType}
              </span>
              <span>
                {s.hoursActual}h reales / {s.hoursPlanned}h planeadas
              </span>
            </div>
          ))}
          {state.sessions.length === 0 && <p className="text-xs text-slate-500">Aún no registras sesiones.</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">
          Sub-temas abiertos / en riesgo ({failuresList.length})
        </h2>
        <div className="space-y-2">
          {failuresList.map((f) => {
            const sub = getSubtopic(f.subtopicId);
            return (
              <div
                key={f.subtopicId}
                className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
                  f.status === "critical-risk" ? "border-red-700 bg-red-500/10" : "border-amber-700/50 bg-amber-500/5"
                }`}
              >
                <span className="text-slate-200">{sub?.nameEs ?? f.subtopicId}</span>
                <span className={f.status === "critical-risk" ? "font-semibold text-red-400" : "text-amber-300"}>
                  {f.status === "critical-risk" ? "⚠ crítico" : "en repaso"} · {f.failCount} fallo(s)
                </span>
              </div>
            );
          })}
          {failuresList.length === 0 && <p className="text-xs text-slate-500">Ningún sub-tema pendiente de repaso.</p>}
        </div>
      </section>

      <BackupPanel state={state} importState={importState} syncMode={syncMode} />
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${highlight ? "border-red-700 bg-red-500/10" : "border-slate-800 bg-slate-900/40"}`}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function BackupPanel({
  state,
  importState,
  syncMode,
}: {
  state: ProgressState;
  importState: (next: ProgressState) => void;
  syncMode: "local" | "cloud";
}) {
  const [msg, setMsg] = useState<string | null>(null);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ejpt-progreso-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Archivo descargado. Guárdalo fuera del portátil si quieres doble copia.");
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as ProgressState;
      if (!parsed || typeof parsed !== "object" || !parsed.blockStatus) {
        setMsg("El JSON no parece un backup de esta app.");
        return;
      }
      importState(parsed);
      setMsg("Progreso importado.");
    } catch {
      setMsg("No pude leer ese archivo.");
    }
  };

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-300">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">Dónde se guarda tu avance</h2>
      <ul className="mb-4 list-disc space-y-1 pl-5 text-slate-400">
        <li>
          <strong className="text-slate-200">Siempre, en este navegador</strong> (localStorage). Reiniciar Kali o el portátil no lo
          borra. Borrar datos del sitio / modo incógnito sí.
        </li>
        <li>
          <strong className="text-slate-200">Supabase (nube)</strong> es opcional. Ahora mismo:{" "}
          {syncMode === "cloud" ? "sesion activa, se sube solo." : "no hay sesión — no hace falta para estudiar en un solo PC."}
        </li>
        <li>
          <strong className="text-slate-200">Archivo JSON</strong> (botón de abajo): copia de seguridad que puedes guardar en USB o
          Drive.
        </li>
      </ul>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={exportJson} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
          Descargar backup JSON
        </button>
        <label className="cursor-pointer rounded-md border border-slate-600 px-4 py-2 text-sm hover:border-emerald-600">
          Importar backup
          <input type="file" accept="application/json" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
      </div>
      {msg && <p className="mt-2 text-xs text-emerald-400">{msg}</p>}
    </section>
  );
}

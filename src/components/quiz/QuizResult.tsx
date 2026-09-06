import Link from "next/link";
import { GradedAttempt } from "@/lib/simulacro";
import { QuizQuestion } from "@/lib/types";
import { getSubtopic } from "@/content/subtopics";
import { bandLabelEs, scoreBand } from "@/lib/trainer/bands";

interface QuizResultProps {
  graded: GradedAttempt;
  questions: QuizQuestion[];
  isFullSimulacro?: boolean;
  cooldownBlocked?: boolean;
}

export function QuizResult({ graded, questions, isFullSimulacro, cooldownBlocked }: QuizResultProps) {
  const byId = new Map(questions.map((q) => [q.id, q]));

  return (
    <div className="space-y-5">
      <div
        className={`rounded-lg border p-5 text-center ${
          graded.passed ? "border-emerald-700 bg-emerald-500/10" : "border-red-700 bg-red-500/10"
        }`}
      >
        <p className="text-3xl font-bold">{graded.score}%</p>
        <p className={`mt-1 text-sm font-semibold ${graded.passed ? "text-emerald-400" : "text-red-400"}`}>
          {graded.passed ? bandLabelEs(graded.score) : "Por debajo de Learning Pass"}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          70% = Learning Pass (puedes continuar; las lagunas se registran). 85% = Mastered (interno). 90% = Critical
          Skill. No es el criterio oficial de INE.
        </p>
        {scoreBand(graded.score) === "learning-pass" && (
          <p className="mt-2 text-xs text-amber-300">Learning Pass ≠ dominio. Revisa los subtemas fallados abajo.</p>
        )}
        {!graded.passed && isFullSimulacro && (
          <p className="mt-2 text-xs text-amber-300">
            Regla fija: no tomes otro simulacro completo hoy. Haz el repaso dirigido de abajo y vuelve en tu próxima sesión de estudio.
          </p>
        )}
        {cooldownBlocked && (
          <p className="mt-2 text-xs text-amber-300">
            Ya reprobaste un simulacro completo hoy — este resultado no cuenta como nuevo intento completo hasta la próxima sesión.
          </p>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-300">Detalle por pregunta</h3>
        <ul className="space-y-2">
          {graded.results.map((r) => {
            const q = byId.get(r.questionId);
            if (!q) return null;
            const sub = getSubtopic(r.subtopicId);
            return (
              <li
                key={r.questionId}
                className={`rounded-md border p-3 text-sm ${
                  r.correct ? "border-slate-800 bg-slate-900/40" : "border-red-800/60 bg-red-500/5"
                }`}
              >
                <p className={`font-mono ${r.correct ? "text-slate-300" : "text-red-300"}`}>
                  {r.correct ? "✔" : "✘"} {q.promptEs}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Sub-tema: <span className="text-slate-300">{sub?.nameEs ?? r.subtopicId}</span>
                </p>
                {!r.correct && <p className="mt-1 text-xs text-amber-300">{q.explanationEs}</p>}
              </li>
            );
          })}
        </ul>
      </div>

      {graded.failedSubtopics.length > 0 && (
        <div className="rounded-lg border border-amber-700/50 bg-amber-500/5 p-4">
          <h3 className="mb-2 text-sm font-semibold text-amber-300">Sub-temas a repasar (punto 9 del plan)</h3>
          <ul className="space-y-1.5">
            {graded.failedSubtopics.map((id) => {
              const sub = getSubtopic(id);
              return (
                <li key={id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-slate-200">{sub?.nameEs ?? id}</span>
                  <Link href={`/remediation/${id}`} className="text-emerald-400 hover:underline">
                    Repasar ahora →
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

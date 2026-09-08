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

const CATEGORY_LABEL: Record<string, string> = {
  recon: "Reconnaissance",
  scanning: "Scanning",
  enumeration: "Enumeration",
  web: "Web",
  "brute-force": "Brute force",
  metasploit: "Metasploit",
  exploitation: "Exploitation",
  "post-exploitation": "Post-exploitation",
  networking: "Networking",
  linux: "Linux",
  reporting: "Reporting",
  "exam-mechanics": "Exam mechanics",
};

/** Sección 26 — After Action Review. Weak areas por categoría real (no inventada). */
function weakAreas(graded: GradedAttempt) {
  const byCategory: Record<string, { correct: number; total: number }> = {};
  for (const r of graded.results) {
    const cat = getSubtopic(r.subtopicId)?.category ?? "exam-mechanics";
    byCategory[cat] ??= { correct: 0, total: 0 };
    byCategory[cat].total += 1;
    if (r.correct) byCategory[cat].correct += 1;
  }
  return Object.entries(byCategory)
    .map(([cat, v]) => ({ cat, pct: Math.round((v.correct / v.total) * 100), ...v }))
    .sort((a, b) => a.pct - b.pct);
}

export function QuizResult({ graded, questions, isFullSimulacro, cooldownBlocked }: QuizResultProps) {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const areas = weakAreas(graded);
  const weakest = areas.find((a) => a.pct < 70);

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

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Weak areas</h3>
        <ul className="space-y-1.5 text-sm">
          {areas.map((a) => (
            <li key={a.cat} className="flex items-center justify-between gap-2">
              <span className="text-slate-200">{CATEGORY_LABEL[a.cat] ?? a.cat}</span>
              <span className="font-mono text-xs">
                <span className={a.pct >= 70 ? "text-emerald-400" : "text-red-400"}>{a.pct >= 70 ? "🟢" : "🔴"}</span>{" "}
                <span className="text-slate-400">
                  {a.correct}/{a.total}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {weakest && (
        <div className="rounded-xl border-2 border-red-700 bg-slate-950 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-red-400">Recommended next step</p>
          <p className="mt-1 font-bold text-white">{CATEGORY_LABEL[weakest.cat] ?? weakest.cat} Review</p>
          <p className="mt-1 text-sm text-slate-400">
            {weakest.correct}/{weakest.total} correct in this area during this assessment.
          </p>
          <Link
            href={graded.failedSubtopics[0] ? `/remediation/${graded.failedSubtopics[0]}` : "/memory"}
            className="mt-3 inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500"
          >
            REVIEW WEAK AREAS
          </Link>
        </div>
      )}

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

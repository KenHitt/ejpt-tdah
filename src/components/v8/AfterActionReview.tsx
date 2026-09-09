import Link from "next/link";

export interface AfterActionReviewProps {
  titleEs?: string;
  score?: number;
  correctLabel?: string;
  timeLabel?: string;
  attempts?: number;
  hints?: number;
  errors?: string[];
  failureTypes?: string[];
  skillsUsed?: string[];
  wellEs?: string;
  reviewEs?: string;
  nextHref: string;
  nextLabel: string;
}

export function AfterActionReview({
  titleEs = "After action review",
  score,
  correctLabel,
  timeLabel,
  attempts,
  hints,
  errors,
  failureTypes,
  skillsUsed,
  wellEs,
  reviewEs,
  nextHref,
  nextLabel,
}: AfterActionReviewProps) {
  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-red-400">{titleEs}</p>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        {score !== undefined && (
          <div>
            <dt className="text-[10px] uppercase text-slate-500">Score</dt>
            <dd className="text-xl font-bold text-white">{score}%</dd>
          </div>
        )}
        {correctLabel && (
          <div>
            <dt className="text-[10px] uppercase text-slate-500">Correct</dt>
            <dd>{correctLabel}</dd>
          </div>
        )}
        {timeLabel && (
          <div>
            <dt className="text-[10px] uppercase text-slate-500">Time</dt>
            <dd className="font-mono text-slate-300">{timeLabel}</dd>
          </div>
        )}
        {attempts !== undefined && (
          <div>
            <dt className="text-[10px] uppercase text-slate-500">Attempts</dt>
            <dd>{attempts}</dd>
          </div>
        )}
        {hints !== undefined && (
          <div>
            <dt className="text-[10px] uppercase text-slate-500">Hints</dt>
            <dd>{hints}</dd>
          </div>
        )}
      </dl>
      {failureTypes && failureTypes.length > 0 && (
        <p className="text-sm text-slate-400">Failure types: {failureTypes.join(" · ")}</p>
      )}
      {skillsUsed && skillsUsed.length > 0 && (
        <p className="text-sm text-slate-400">Skills used: {skillsUsed.join(" · ")}</p>
      )}
      {errors && errors.length > 0 && (
        <ul className="text-sm text-red-300">
          {errors.map((e) => (
            <li key={e}>· {e}</li>
          ))}
        </ul>
      )}
      {wellEs && (
        <p className="text-sm text-emerald-300">
          <span className="uppercase text-[10px] text-emerald-500">What went well</span> · {wellEs}
        </p>
      )}
      {reviewEs && (
        <p className="text-sm text-slate-300">
          <span className="uppercase text-[10px] text-slate-500">Review</span> · {reviewEs}
        </p>
      )}
      <Link href={nextHref} className="block rounded-xl bg-red-600 py-3 text-center font-bold text-white hover:bg-red-500">
        {nextLabel}
      </Link>
    </section>
  );
}

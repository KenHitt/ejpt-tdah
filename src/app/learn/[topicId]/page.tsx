"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { LEARN_ARTICLES } from "@/content/learn-articles";
import { PracticeNow } from "@/components/PracticeNow";
import { PromptCheckCard } from "@/components/trainer/PromptCheckCard";

export default function LearnArticlePage() {
  const params = useParams<{ topicId: string }>();
  const a = LEARN_ARTICLES.find((x) => x.id === params.topicId);
  if (!a) {
    return (
      <Link href="/learn" className="text-emerald-400 underline">
        LEARN
      </Link>
    );
  }
  const sections = [
    ["WHAT", a.what],
    ["WHY", a.why],
    ["HOW", a.how],
    ["WHEN", a.when],
    ["EXAMPLE", a.example],
    ["COMMON MISTAKE", a.mistake],
    ["RED TEAM THINKING", a.redTeam],
  ] as const;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link href="/learn" className="text-xs text-slate-500">
        ← LEARN
      </Link>
      <p className="font-mono text-xs text-emerald-400">{a.track}</p>
      <h1 className="text-2xl font-bold text-white">{a.titleEs}</h1>
      {sections.map(([k, v]) => (
        <section key={k} className="rounded-md border border-slate-800 p-3">
          <p className="font-mono text-[10px] text-sky-400">{k}</p>
          <p className="mt-1 text-sm text-slate-200">{v}</p>
        </section>
      ))}
      <section>
        <p className="mb-2 font-mono text-[10px] text-purple-400">ACTIVE RECALL</p>
        <PromptCheckCard
          check={{
            id: `${a.id}-r`,
            promptEs: a.recall,
            keywordAny: a.recallKeywords.map((k) => [k]),
            explanationEs: a.what,
            failKind: "memory",
            subtopicId: "net-basic",
          }}
          exerciseId={`learn:${a.id}:recall`}
          onPassed={() => undefined}
        />
      </section>
      <section>
        <p className="mb-2 font-mono text-[10px] text-purple-400">MINI CHALLENGE</p>
        <PromptCheckCard
          check={{
            id: `${a.id}-c`,
            promptEs: a.challenge,
            keywordAny: a.challengeKeywords.map((k) => [k]),
            explanationEs: a.redTeam,
            failKind: "reasoning",
            subtopicId: "net-basic",
          }}
          exerciseId={`learn:${a.id}:chal`}
          onPassed={() => undefined}
        />
      </section>
      <PracticeNow topicLabel={a.titleEs} />
    </div>
  );
}

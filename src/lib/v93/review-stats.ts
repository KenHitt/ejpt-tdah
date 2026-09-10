import { ProgressState } from "@/lib/progress/state";
import { CONCEPT_LESSONS } from "@/content/v93/concept-reviews";

export function conceptReviewClusters(progress: ProgressState) {
  const map = new Map<string, number>();
  for (const r of progress.trainer?.conceptReviews ?? []) {
    map.set(r.conceptId, (map.get(r.conceptId) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([id, n]) => {
      const lesson = CONCEPT_LESSONS.find((c) => c.id === id);
      return {
        id,
        n,
        titleEs: lesson?.titleEs ?? id,
        href: lesson?.deepenHref ?? "/train/decisions",
        recurrent: n >= 3,
      };
    })
    .sort((a, b) => b.n - a.n);
}

"use client";

import { useState } from "react";
import { ConceptLesson } from "@/content/v93/concept-reviews";
import { reviewForQuestion, ReviewQuery } from "@/lib/v93/review-for-question";
import { useProgress } from "@/lib/progress/context";
import { ConceptReviewModal, RevisarConceptoButton } from "@/components/v93/ConceptReviewModal";

export function useConceptReview(query: ReviewQuery, exerciseId: string) {
  const { recordConceptReview } = useProgress();
  const [open, setOpen] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const lesson = reviewForQuestion(query);

  const openReview = () => {
    recordConceptReview({
      exerciseId,
      conceptId: lesson.id,
      diagnosis: lesson.diagnosis,
    });
    setOpen(true);
  };

  return {
    lesson,
    openReview,
    modal: (
      <ConceptReviewModal
        lesson={open ? lesson : null}
        onClose={() => setOpen(false)}
        showExample={showExample}
        onToggleExample={() => setShowExample((v) => !v)}
      />
    ),
    button: <RevisarConceptoButton onClick={openReview} />,
  };
}

export type { ConceptLesson };

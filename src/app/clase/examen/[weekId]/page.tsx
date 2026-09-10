"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { COURSE_WEEKS, lessonsForWeek } from "@/content/course";
import { ClickQuiz } from "@/components/course/ClickQuiz";
import { useCourse } from "@/lib/course/context";
import { CourseQuizItem } from "@/content/course/types";

export default function WeekExamPage() {
  const params = useParams<{ weekId: string }>();
  const week = Number(String(params.weekId).replace(/^w/, ""));
  const meta = COURSE_WEEKS.find((w) => w.week === week);
  const { markExam, state } = useCourse();
  const [pct, setPct] = useState<number | null>(state.exams[`w${week}`]?.pct ?? null);

  const items: CourseQuizItem[] = useMemo(() => {
    const lessons = lessonsForWeek(week);
    const picked: CourseQuizItem[] = [];
    lessons.forEach((l) => {
      if (l.quiz[0]) picked.push(l.quiz[0]);
      if (l.quiz[2] && picked.length < 10) picked.push(l.quiz[2]);
    });
    return picked.slice(0, 10);
  }, [week]);

  if (!meta || Number.isNaN(week)) {
    return <Link href="/clase">CLASE</Link>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link href="/clase" className="text-xs text-slate-500">
        ← CLASE
      </Link>
      <p className="font-mono text-xs text-amber-400">EXAMEN SEMANAL · S{week}</p>
      <h1 className="text-xl font-bold text-white">{meta.titleEs}</h1>
      <p className="text-sm text-slate-400">
        10 preguntas para marcar. Interno: 70% Learning Pass. No es el corte de INE.
      </p>
      <ClickQuiz key={week} items={items} onGraded={(p) => { setPct(p); markExam(`w${week}`, p); }} exercisePrefix={`exam-w${week}`} />
      {pct !== null && (
        <p className="text-center text-emerald-300">
          {pct}% {pct >= 70 ? "· pass interno. Siguiente semana o remedia lo rojo." : "· debajo de 70. Relee las clases de la semana."}
        </p>
      )}
    </div>
  );
}

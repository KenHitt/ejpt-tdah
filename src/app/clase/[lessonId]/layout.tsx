import { COURSE_LESSONS } from "@/content/course";

export function generateStaticParams() {
  return COURSE_LESSONS.map((l) => ({ lessonId: l.id }));
}

export const dynamicParams = false;

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

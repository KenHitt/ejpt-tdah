import { COURSE_WEEKS } from "@/content/course";

export function generateStaticParams() {
  return COURSE_WEEKS.map((w) => ({ weekId: `w${w.week}` }));
}

export const dynamicParams = false;

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

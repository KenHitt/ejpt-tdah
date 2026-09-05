import { SUBTOPICS } from "@/content/subtopics";

export function generateStaticParams() {
  return SUBTOPICS.map((s) => ({ subtopicId: s.id }));
}

export const dynamicParams = false;

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

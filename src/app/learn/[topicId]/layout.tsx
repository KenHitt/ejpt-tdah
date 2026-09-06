import { LEARN_ARTICLES } from "@/content/learn-articles";

export function generateStaticParams() {
  return LEARN_ARTICLES.map((a) => ({ topicId: a.id }));
}

export const dynamicParams = false;

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

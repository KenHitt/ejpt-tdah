import { getAllWeeks } from "@/content/curriculum";

export function generateStaticParams() {
  return getAllWeeks().map((w) => ({ weekId: w.id }));
}

export const dynamicParams = false;

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

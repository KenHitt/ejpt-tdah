import { getAllBlocks } from "@/content/curriculum";

export function generateStaticParams() {
  return getAllBlocks().map((b) => ({ blockId: b.id }));
}

export const dynamicParams = false;

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

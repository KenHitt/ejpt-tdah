import { ACADEMY_WORKSHOPS } from "@/content/academy/workshops";

export function generateStaticParams() {
  return ACADEMY_WORKSHOPS.map((w) => ({ tallerId: w.id }));
}

export const dynamicParams = false;

export default function TallerLayout({ children }: { children: React.ReactNode }) {
  return children;
}

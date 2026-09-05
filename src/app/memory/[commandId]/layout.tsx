import { COMMAND_BANK } from "@/content/command-bank";

export function generateStaticParams() {
  return COMMAND_BANK.map((c) => ({ commandId: c.id }));
}

export const dynamicParams = false;

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

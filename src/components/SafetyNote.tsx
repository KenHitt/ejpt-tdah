export function SafetyNote({ compact }: { compact?: boolean }) {
  return (
    <p className={`rounded-md border border-amber-800/50 bg-amber-500/5 text-amber-100 ${compact ? "p-2 text-[11px]" : "p-3 text-xs"}`}>
      Utiliza estos comandos únicamente contra máquinas propias, laboratorios o sistemas para los que tengas autorización.
    </p>
  );
}

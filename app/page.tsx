import Landing from "@/components/ui/Landing";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[var(--nx-bg)]">
      {/* Ambient aurora backdrop */}
      <div className="pointer-events-none absolute inset-0 nx-grid-bg opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px] animate-aurora" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-[360px] w-[360px] rounded-full bg-cyan-500/15 blur-[120px] animate-aurora" />
      <div className="relative z-10">
        <Landing />
      </div>
    </main>
  );
}

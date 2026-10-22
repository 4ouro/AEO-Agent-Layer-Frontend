import { ScanForm } from '@/features/scan';

// Shown along the bottom: the AI visitors we test the store against.
const BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User'];

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col bg-forest px-6 text-white md:px-16">
      <header className="flex h-24 items-center text-2xl font-extrabold tracking-tight">AgentLayer</header>

      <section className="flex flex-1 flex-col justify-center gap-14 py-10">
        {/* Sized to the screen width so the line spans the whole page. */}
        <h1 className="text-[13vw] leading-[0.95] font-extrabold tracking-tight md:text-[8.4vw]">Can AI see your store?</h1>
        <ScanForm />
      </section>

      <footer className="flex flex-wrap justify-between gap-x-8 gap-y-3 border-t border-white/15 py-8 text-lg text-sprout">
        {BOTS.map((bot) => (
          <span key={bot} className="whitespace-nowrap">
            {bot}
          </span>
        ))}
      </footer>
    </main>
  );
}

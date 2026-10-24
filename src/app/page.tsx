import { Logo } from '@/components/layout/logo';
import { ScanForm } from '@/features/scan';

// What the score is made of (same weights as the scanner), shown so the seller knows what they're about to get.
const CHECKS = [
  { area: 'Access', detail: 'Firewalls and robots.txt let AI bots in', weight: 30 },
  { area: 'Your offer', detail: 'Products, pricing or services in a form AI reads', weight: 25 },
  { area: 'Visibility', detail: 'Key content readable without JavaScript', weight: 20 },
  { area: 'Trust', detail: 'Contact, policies and who you are', weight: 10 },
  { area: 'AI files', detail: 'llms.txt and AI-friendly files', weight: 10 },
  { area: 'Discovery', detail: 'Sitemap, speed and broken pages', weight: 5 },
];

// The AI visitors we test the site against.
const BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User'];

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col bg-white">
      <header className="flex h-20 items-center border-b border-line px-4 md:px-10">
        <Logo />
      </header>

      <section className="grid flex-1 grid-cols-1 items-center gap-14 px-4 py-14 md:px-10 lg:grid-cols-[7fr_5fr] lg:gap-20 lg:py-20">
        <div className="flex min-w-0 flex-col gap-8">
          <h1 className="text-[clamp(2.75rem,6vw,5.5rem)] font-serif leading-[1.02] font-medium tracking-[-0.02em]">Can AI see your business?</h1>
          <p className="max-w-[46ch] text-xl text-muted">
            We visit your site the way ChatGPT, Claude and Perplexity do, and show what they miss. Free, in under a minute.
          </p>
          <ScanForm />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <h2 className="text-lg font-semibold">What we check</h2>
          <ul className="divide-y divide-line border-y border-line">
            {CHECKS.map((c) => (
              <li key={c.area} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-4">
                <span className="text-lg font-semibold">{c.area}</span>
                <span className="row-span-2 flex w-28 items-center gap-3">
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-lime-soft">
                    <span className="block h-full rounded-full bg-moss" style={{ width: `${(c.weight / 30) * 100}%` }} />
                  </span>
                  <span className="w-9 text-right text-base font-semibold tabular-nums">{c.weight}%</span>
                </span>
                <span className="text-base text-muted">{c.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="flex flex-col gap-3 border-t border-line bg-lime-soft px-4 py-6 md:flex-row md:items-center md:gap-10 md:px-10">
        <span className="text-base font-semibold text-moss">We test as</span>
        <ul className="flex flex-1 flex-wrap justify-between gap-x-6 gap-y-2 text-base">
          {BOTS.map((bot) => (
            <li key={bot} className="whitespace-nowrap">
              {bot}
            </li>
          ))}
        </ul>
      </footer>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/layout/logo';
import { scanEventsUrl } from '@/lib/api/scans';

// The engine's steps, in order, with the words the seller sees.
const STEPS = [
  { step: 'discover', label: 'Opening your site' },
  { step: 'fetch', label: 'Visiting as AI bots' },
  { step: 'render', label: 'Opening in a browser' },
  { step: 'check', label: 'Checking what AI sees' },
  { step: 'score', label: 'Scoring' },
] as const;

/** Streams progress from the backend; when the scan ends, re-renders the page so the server shows the report. */
export function ScanProgress({ scanId, domain }: { scanId: string; domain: string }) {
  const router = useRouter();
  const [reached, setReached] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const source = new EventSource(scanEventsUrl(scanId));
    source.addEventListener('progress', (e) => {
      const { step } = JSON.parse((e as MessageEvent<string>).data) as { step: string };
      setReached((prev) => (prev.includes(step) ? prev : [...prev, step]));
    });
    source.addEventListener('end', () => {
      source.close();
      router.refresh();
    });
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      source.close();
      clearInterval(timer);
    };
  }, [scanId, router]);

  const current = STEPS.findLastIndex((s) => reached.includes(s.step));

  return (
    <main className="grid min-h-dvh flex-1 bg-white lg:grid-cols-[2fr_3fr]">
      <section className="flex flex-col justify-between bg-lime px-4 py-8 md:px-10">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex flex-col gap-4 py-16">
          <span className="text-2xl font-semibold text-moss">Scanning</span>
          <span className="font-serif text-5xl font-medium tracking-[-0.02em] break-all md:text-7xl">{domain}</span>
        </div>
        <span className="text-2xl font-semibold tabular-nums">{seconds}s</span>
      </section>

      <ol className="flex flex-col justify-center px-4 py-10 md:px-16" aria-live="polite">
        {STEPS.map((s, i) => {
          const state = i < current ? 'done' : i === current ? 'active' : 'waiting';
          return (
            <li key={s.step} className="flex items-center gap-6 border-b border-line py-6 last:border-b-0">
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                  state === 'done' ? 'bg-moss text-white' : state === 'active' ? 'bg-lime' : 'bg-canvas'
                }`}
              >
                {state === 'done' && (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                )}
                {state === 'active' && <span className="h-3 w-3 animate-ping rounded-full bg-moss" />}
              </span>
              <span className={`text-3xl font-bold transition-colors duration-300 md:text-4xl ${state === 'waiting' ? 'text-forest/30' : 'text-forest'}`}>
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </main>
  );
}

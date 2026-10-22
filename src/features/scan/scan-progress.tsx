'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { scanEventsUrl } from '@/lib/api/scans';

// The engine's steps, in order, with the words the seller sees.
const STEPS = [
  { step: 'discover', label: 'Opening your store' },
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
    <main className="grid min-h-dvh flex-1 lg:grid-cols-[2fr_3fr]">
      <section className="flex flex-col justify-between bg-forest px-6 py-10 text-white md:px-16">
        <span className="text-2xl font-extrabold">AgentLayer</span>
        <div className="flex flex-col gap-6 py-16">
          <span className="text-2xl text-sprout">Scanning</span>
          <span className="text-5xl font-extrabold break-all md:text-7xl">{domain}</span>
        </div>
        <span className="text-2xl text-sprout tabular-nums">{seconds}s</span>
      </section>

      <ol className="flex flex-col justify-center gap-2 px-6 py-10 md:px-16">
        {STEPS.map((s, i) => {
          const state = i < current ? 'done' : i === current ? 'active' : 'waiting';
          return (
            <li key={s.step} className="flex items-center gap-6 border-b border-line py-6 last:border-b-0">
              <span
                className={`h-5 w-5 shrink-0 ${state === 'done' ? 'bg-leaf' : state === 'active' ? 'animate-pulse bg-sprout' : 'bg-line'}`}
              />
              <span className={`text-3xl font-bold md:text-4xl ${state === 'waiting' ? 'text-forest/30' : 'text-forest'}`}>{s.label}</span>
            </li>
          );
        })}
      </ol>
    </main>
  );
}

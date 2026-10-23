import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from './logo';

/** Full-page message (not found, failed scan, error): logo on top, the message across the page, actions below. */
export function MessagePage({ kicker, title, detail, children }: { kicker?: string; title: string; detail?: string | null; children?: ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-1 flex-col bg-white px-4 md:px-10">
      <header className="flex h-24 items-center">
        <Link href="/">
          <Logo />
        </Link>
      </header>
      <section className="flex flex-1 flex-col justify-center gap-8 border-t border-line py-16">
        {kicker && <span className="text-2xl font-semibold break-all text-moss">{kicker}</span>}
        <h1 className="max-w-[18ch] font-serif text-5xl leading-[1.05] font-medium tracking-[-0.02em] md:text-7xl">{title}</h1>
        {detail && <p className="max-w-[60ch] text-xl text-muted">{detail}</p>}
        {children && <div className="flex flex-wrap gap-3">{children}</div>}
      </section>
    </main>
  );
}

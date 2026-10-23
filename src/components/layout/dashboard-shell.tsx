'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Logo } from './logo';

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

/**
 * Sidebar + content. The sidebar links jump to sections of the page and highlight the one in view.
 * On small screens the sidebar becomes a sticky bar with the same links.
 */
export function DashboardShell({ nav, children }: { nav: NavItem[]; children: ReactNode }) {
  const [active, setActive] = useState(nav[0]?.id);
  const content = useRef<HTMLDivElement>(null);

  // Active section: the last one whose top has passed a third of the way down the screen (at the bottom of the page, the last one).
  // Scroll events already arrive at most once per frame, and this only reads four positions.
  useEffect(() => {
    const update = () => {
      // Look inside this shell only: while React streams a page in, a hidden copy with the same ids can exist.
      const sections = nav.map((n) => content.current?.querySelector<HTMLElement>(`#${n.id}`)).filter((el): el is HTMLElement => !!el);
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      const passed = sections.filter((s) => s.getBoundingClientRect().top <= window.innerHeight / 3);
      const current = atBottom ? sections.at(-1) : passed.at(-1);
      setActive(current?.id ?? nav[0]?.id);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [nav]);

  return (
    <div className="flex min-h-dvh flex-1">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-10 border-r border-line bg-white px-5 py-7 lg:flex">
        <Link href="/" className="px-3">
          <Logo />
        </Link>
        <nav aria-label="Report sections" className="flex flex-col gap-1">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'true' : undefined}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-base font-semibold transition-colors duration-150 ${
                active === item.id ? 'bg-lime text-forest' : 'text-muted hover:bg-lime-soft hover:text-forest'
              }`}
            >
              <span className="h-5 w-5 shrink-0">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <Link
          href="/"
          className="mt-auto flex items-center gap-3 rounded-2xl border border-line px-3 py-2.5 text-base font-semibold transition-[background-color,transform] duration-150 ease-out hover:bg-lime-soft active:scale-[0.97]"
        >
          <span className="h-5 w-5 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          Scan another store
        </Link>
      </aside>

      <div ref={content} className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-line bg-white/95 px-4 pt-4 backdrop-blur lg:hidden">
          <Link href="/">
            <Logo />
          </Link>
          <nav aria-label="Report sections" className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-3">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`rounded-full px-4 py-1.5 text-base font-semibold whitespace-nowrap ${active === item.id ? 'bg-lime' : 'text-muted'}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}

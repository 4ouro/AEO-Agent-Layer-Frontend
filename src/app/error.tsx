'use client';

import { Button } from '@/components/ui/button';

// Next.js 16: retry() re-fetches and re-renders the page.
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="flex min-h-dvh flex-1 flex-col justify-center gap-10 bg-forest px-6 text-white md:px-16">
      <h1 className="text-6xl leading-none font-extrabold md:text-8xl">Something went wrong.</h1>
      <Button variant="light" onClick={() => retry()} className="self-start">
        Try again
      </Button>
    </main>
  );
}

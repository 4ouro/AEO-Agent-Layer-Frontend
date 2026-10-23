'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { startScan } from '@/lib/api/scans';

/** One search-style field: the address and the Scan button share a single bar. */
export function ScanForm() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const result = await startScan(url);
    if ('error' in result) {
      setError(result.error);
      setPending(false);
      return;
    }
    router.push(`/scans/${result.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-2xl flex-col gap-3">
      <div className="flex h-16 items-center gap-2 rounded-full border border-line bg-canvas p-1.5 pl-6 transition-[border-color,background-color] duration-150 focus-within:border-moss focus-within:bg-white">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yourstore.com"
          aria-label="Store address"
          aria-invalid={error ? true : undefined}
          required
          autoFocus
          className="h-full min-w-0 flex-1 bg-transparent text-xl text-forest placeholder:text-muted focus:outline-none"
        />
        <Button type="submit" disabled={pending} className="h-full px-8">
          {pending ? 'Starting' : 'Scan'}
        </Button>
      </div>
      {error && (
        <p role="alert" className="pl-6 text-base text-red">
          {error}
        </p>
      )}
    </form>
  );
}

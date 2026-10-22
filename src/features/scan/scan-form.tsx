'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { startScan } from '@/lib/api/scans';

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
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yourstore.com"
          aria-label="Store address"
          required
          autoFocus
          className="h-20 w-full min-w-0 flex-1 border-2 border-white/30 bg-white px-8 text-2xl text-forest placeholder:text-forest/40 focus:border-sprout focus:outline-none"
        />
        <Button type="submit" disabled={pending} className="h-20 md:w-64">
          {pending ? 'Starting' : 'Scan'}
        </Button>
      </div>
      {error && <p className="text-xl text-sprout">{error}</p>}
    </form>
  );
}

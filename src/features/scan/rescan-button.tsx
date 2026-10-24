'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { startScan, type BusinessType } from '@/lib/api/scans';

/** Scans the same site again, e.g. after the seller fixed things. */
export function RescanButton({ scanId, url, businessTypes }: { scanId: string; url: string; businessTypes: BusinessType[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    setMessage(null);
    const result = await startScan(url, { rescan: true, businessTypes });
    setPending(false);
    if ('error' in result) return setMessage(result.error);
    // The backend returns this same scan when it finished moments ago.
    if (result.id === scanId) return setMessage('Scanned moments ago. Try again in two minutes.');
    router.push(`/scans/${result.id}`);
  }

  return (
    <div className="flex flex-col items-start gap-2 md:items-end">
      <Button onClick={onClick} disabled={pending}>
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${pending ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
          <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" />
        </svg>
        {pending ? 'Starting' : 'Scan again'}
      </Button>
      {message && (
        <p role="status" className="text-base text-muted">
          {message}
        </p>
      )}
    </div>
  );
}

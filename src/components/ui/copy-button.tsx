'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

/** Copies text to the clipboard and says "Copied" for 2 seconds. */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="w-fit"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        } catch {
          // Clipboard blocked: leave the label as it is.
        }
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}

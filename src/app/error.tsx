'use client';

import { MessagePage } from '@/components/layout/message-page';
import { Button } from '@/components/ui/button';

// Next.js 16: retry() re-fetches and re-renders the page.
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <MessagePage title="Something went wrong.">
      <Button onClick={() => retry()}>Try again</Button>
    </MessagePage>
  );
}

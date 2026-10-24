import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/** A white dashboard panel with a label and an optional action on the right. */
export function Panel({ label, action, className = '', children }: { label: string; action?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <Card className={cn('min-w-0 gap-6 rounded-2xl border-line p-6 shadow-none md:p-7', className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h2 className="text-lg font-semibold">{label}</h2>
        {action}
      </div>
      {children}
    </Card>
  );
}

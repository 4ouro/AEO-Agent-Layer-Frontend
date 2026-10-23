import type { ReactNode } from 'react';

/** A white dashboard panel with a label and an optional action on the right. */
export function Panel({ label, action, className = '', children }: { label: string; action?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={`flex min-w-0 flex-col gap-6 rounded-2xl border border-line bg-white p-6 md:p-7 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h2 className="text-lg font-semibold">{label}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

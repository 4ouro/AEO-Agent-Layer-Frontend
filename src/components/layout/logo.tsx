/** Wordmark with a small mark echoing the score gauge's segments. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 text-xl font-extrabold tracking-tight ${className}`}>
      <svg viewBox="0 0 28 28" className="h-7 w-7" aria-hidden>
        <rect width="28" height="28" rx="8" fill="var(--color-lime)" />
        <rect x="6" y="14" width="4" height="8" rx="2" fill="var(--color-moss)" />
        <rect x="12" y="10" width="4" height="12" rx="2" fill="var(--color-moss)" />
        <rect x="18" y="6" width="4" height="16" rx="2" fill="var(--color-forest)" />
      </svg>
      AgentLayer
    </span>
  );
}

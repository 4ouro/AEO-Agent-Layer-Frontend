import { Panel } from '@/components/ui/panel';
import type { Issue } from '@/lib/api/scans';
import { SEVERITIES, SEVERITY_FILL, SEVERITY_LABELS } from './labels';

/** How many problems, how bad, and who fixes them. */
export function ProblemSummary({ issues }: { issues: Issue[] }) {
  const counts = SEVERITIES.map((s) => ({ severity: s, count: issues.filter((i) => i.severity === s).length }));
  const ours = issues.filter((i) => i.fixedBy === 'us').length;

  return (
    <Panel label="Problems found" className="lg:col-span-4">
      <div className="flex items-baseline gap-3">
        <span className="text-6xl leading-none font-extrabold tabular-nums">{issues.length}</span>
        <span className="text-base text-muted">{issues.length === 1 ? 'problem' : 'problems'}</span>
      </div>

      {issues.length > 0 ? (
        <>
          {/* One bar, split by severity. */}
          <div className="flex h-10 gap-1 overflow-hidden rounded-xl">
            {counts
              .filter((c) => c.count)
              .map((c) => (
                <span key={c.severity} className={`${SEVERITY_FILL[c.severity]} motion-grow-x`} style={{ flexGrow: c.count }} />
              ))}
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
            {counts.map((c) => (
              <li key={c.severity} className="flex items-center gap-2.5 text-base">
                <span className={`h-3 w-3 shrink-0 rounded-full ${SEVERITY_FILL[c.severity]}`} />
                <span className="text-muted">{SEVERITY_LABELS[c.severity]}</span>
                <span className="ml-auto font-semibold tabular-nums">{c.count}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-base text-muted">AI can read your store. Nothing to fix.</p>
      )}

      <dl className="mt-auto grid grid-cols-2 divide-x divide-line border-t border-line pt-5">
        <div className="flex flex-col gap-1 pr-4">
          <dt className="text-base text-muted">We fix</dt>
          <dd className="text-3xl font-bold tabular-nums">{ours}</dd>
        </div>
        <div className="flex flex-col gap-1 pl-5">
          <dt className="text-base text-muted">You fix</dt>
          <dd className="text-3xl font-bold tabular-nums">{issues.length - ours}</dd>
        </div>
      </dl>
    </Panel>
  );
}

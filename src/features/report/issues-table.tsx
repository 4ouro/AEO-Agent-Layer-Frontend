import { Panel } from '@/components/ui/panel';
import type { Issue } from '@/lib/api/scans';
import { AREA_LABELS, SEVERITY_FILL, SEVERITY_LABELS } from './labels';

// Shared column layout for the header and every row.
const COLUMNS = 'md:grid-cols-[minmax(0,1fr)_9rem_8rem_7rem_4rem]';

/** Every problem, most important first. Open a row for why it matters and how to fix it. */
export function IssuesTable({ issues }: { issues: Issue[] }) {
  return (
    <Panel label="Problems to fix" className="lg:col-span-12" action={<span className="text-base text-muted">Most important first</span>}>
      {issues.length === 0 ? (
        <p className="text-base text-muted">AI can read your store. Nothing to fix.</p>
      ) : (
        <div className="-mx-6 md:-mx-7">
          <div className={`hidden gap-4 border-y border-line bg-canvas px-7 py-3 text-base text-muted md:grid ${COLUMNS}`}>
            <span>Problem</span>
            <span>Area</span>
            <span>Severity</span>
            <span>Fixed by</span>
            <span className="text-right">Points</span>
          </div>
          <ul>
            {issues.map((issue) => (
              <li key={issue.checkId} className="border-b border-line last:border-b-0">
                <details className="group">
                  <summary
                    className={`grid cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-6 py-5 transition-colors duration-150 hover:bg-lime-soft/60 md:px-7 [&::-webkit-details-marker]:hidden ${COLUMNS}`}
                  >
                    <span className="flex items-start gap-3">
                      <Chevron />
                      <span className="text-base font-semibold">{issue.summary}</span>
                    </span>
                    <span className="hidden text-base text-muted md:block">{AREA_LABELS[issue.area]}</span>
                    <span className="col-start-1 flex items-center gap-2 pl-8 text-base md:col-start-auto md:pl-0">
                      <span className={`h-2.5 w-2.5 rounded-full ${SEVERITY_FILL[issue.severity]}`} />
                      {SEVERITY_LABELS[issue.severity]}
                      <span className="text-muted md:hidden">· {AREA_LABELS[issue.area]}</span>
                    </span>
                    <span className="hidden md:block">
                      <FixedBy who={issue.fixedBy} />
                    </span>
                    <span className="row-start-1 text-right text-base font-semibold text-leaf tabular-nums md:row-start-auto">
                      {issue.scoreGain > 0 ? `+${issue.scoreGain}` : ''}
                    </span>
                  </summary>
                  <div className="grid gap-6 px-6 pt-1 pb-6 md:grid-cols-2 md:px-7 md:pl-[4.25rem]">
                    <div className="flex flex-col gap-2">
                      <span className="text-base font-semibold">Why it matters</span>
                      <p className="max-w-[65ch] text-base text-muted">{issue.why}</p>
                      <span className="mt-2 md:hidden">
                        <FixedBy who={issue.fixedBy} />
                      </span>
                    </div>
                    {issue.steps.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <span className="text-base font-semibold">How to fix it</span>
                        <ol className="flex flex-col gap-2">
                          {issue.steps.map((step, i) => (
                            <li key={i} className="flex gap-3 text-base">
                              <span className="w-5 shrink-0 font-semibold text-moss tabular-nums">{i + 1}.</span>
                              <span className="max-w-[65ch] pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}

function FixedBy({ who }: { who: Issue['fixedBy'] }) {
  return who === 'us' ? <span className="text-base font-semibold text-leaf">We fix</span> : <span className="text-base font-semibold text-muted">You fix</span>;
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-5 w-5 shrink-0 text-muted transition-transform duration-200 ease-out group-open:rotate-90"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

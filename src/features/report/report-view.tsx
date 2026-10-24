import { DashboardShell, type NavItem } from '@/components/layout/dashboard-shell';
import { RescanButton } from '@/features/scan';
import type { Report, Scan } from '@/lib/api/scans';
import { AreaScores } from './area-scores';
import { BotAccess } from './bot-access';
import { FixPackSummary } from './fix-pack-summary';
import { SkippedChecks } from './skipped-checks';
import { IssuesTable } from './issues-table';
import { BUSINESS_TYPE_LABELS, formatDate, isStoreReport, PLATFORM_LABELS } from './labels';
import { PagesTable } from './pages-table';
import { ProblemSummary } from './problem-summary';
import { ScoreGauge } from './score-gauge';
import { ScoreHistory } from './score-history';

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const NAV: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: icon('M4 13h6V4H4zM14 20h6v-9h-6zM14 4h6v4h-6zM4 20h6v-4H4z') },
  { id: 'problems', label: 'Problems', icon: icon('M12 9v4M12 17h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z') },
  { id: 'bots', label: 'AI bots', icon: icon('M12 8V4M8 8h8a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4zM9 14h.01M15 14h.01') },
  { id: 'pages', label: 'Pages', icon: icon('M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5') },
];

export function ReportView({ report, scan, history, domain }: { report: Report; scan: Scan; history: Scan[]; domain: string }) {
  const issues = report.issues.filter((i) => i.status === 'fail' || i.status === 'warn');
  const noun = isStoreReport(report.businessTypes) ? 'store' : 'site';
  const types = report.businessTypes ?? [];
  const notApplicable = report.checks.filter((c) => c.status === 'not_applicable');
  const unknown = report.checks.filter((c) => c.status === 'unknown');
  const c = report.coverage;
  const coverage = c
    ? [
        `${c.applied} checks applied.`,
        c.notApplicable > 0 && `${c.notApplicable} ${c.notApplicable === 1 ? "doesn't" : "don't"} apply to your ${noun}.`,
        c.unknown > 0 && `${c.unknown} couldn't be checked.`,
      ]
        .filter(Boolean)
        .join(' ')
    : null;

  return (
    <DashboardShell nav={NAV}>
      <main className="flex flex-1 flex-col gap-6 px-4 py-6 md:px-8 md:py-8 xl:px-10">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            {/* Long domains wrap at the dots, never mid-word. */}
            <h1 className="font-serif text-4xl font-medium tracking-[-0.02em] md:text-5xl">
              {domain.split('.').map((part, i) => (
                <span key={i}>
                  {i > 0 && '.'}
                  {i > 0 && <wbr />}
                  {part}
                </span>
              ))}
            </h1>
            <p className="flex flex-wrap gap-x-5 gap-y-1 text-base text-muted">
              {types.length > 0 && (
                <span>
                  {types.map((t) => BUSINESS_TYPE_LABELS[t]).join(', ')} ({report.businessTypesSource === 'user' ? 'You told us' : 'Detected'})
                </span>
              )}
              <span>{PLATFORM_LABELS[report.platform]}</span>
              <span>Scanned {formatDate(scan.finishedAt ?? scan.createdAt)}</span>
              <span className="tabular-nums">Took {Math.round(report.durationMs / 1000)} s</span>
              {report.partial && <span className="font-semibold text-amber">Partial scan, some pages were too slow</span>}
            </p>
          </div>
          <RescanButton scanId={scan.id} url={scan.url} businessTypes={scan.businessTypes ?? []} />
        </header>

        {coverage && <p className="text-lg text-muted">{coverage}</p>}

        <div id="overview" className="grid scroll-mt-28 gap-6 lg:grid-cols-12 lg:scroll-mt-8">
          <ScoreGauge score={report.score} previewScore={report.previewScore} pagesChecked={report.pages.length} />
          <ProblemSummary issues={issues} noun={noun} />
          <FixPackSummary summary={report.fixPackSummary} noun={noun} href={`/scans/${scan.id}/fix-pack`} />
          <AreaScores areas={report.areas} />
          <ScoreHistory scans={history} currentId={scan.id} />
        </div>

        <div id="problems" className="grid scroll-mt-28 lg:grid-cols-12 lg:scroll-mt-8">
          <IssuesTable issues={issues} noun={noun} />
        </div>

        {(unknown.length > 0 || notApplicable.length > 0) && (
          <div className="grid lg:grid-cols-12">
            <SkippedChecks unknown={unknown} notApplicable={notApplicable} noun={noun} />
          </div>
        )}

        <div id="bots" className="grid scroll-mt-28 lg:scroll-mt-8">
          <BotAccess bots={report.botAccess} noun={noun} />
        </div>

        <div id="pages" className="grid scroll-mt-28 lg:scroll-mt-8">
          <PagesTable pages={report.pages} />
        </div>
      </main>
    </DashboardShell>
  );
}

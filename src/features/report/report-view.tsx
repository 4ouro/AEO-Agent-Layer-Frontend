import { ButtonLink } from '@/components/ui/button';
import type { Issue, Report } from '@/lib/api/scans';

const AREA_LABELS: Record<Report['areas'][number]['area'], string> = {
  access: 'Access',
  visibility: 'Visibility',
  productData: 'Product data',
  trust: 'Trust',
  aiCommerce: 'AI commerce',
  discovery: 'Discovery',
};

// Severity is the only place colors other than green appear.
const SEVERITY_BAR: Record<Issue['severity'], string> = {
  critical: 'bg-red',
  high: 'bg-red',
  medium: 'bg-amber',
  low: 'bg-amber',
};

export function ReportView({ report, domain }: { report: Report; domain: string }) {
  const issues = report.issues.filter((i) => i.status === 'fail' || i.status === 'warn');

  return (
    <main className="grid min-h-dvh flex-1 lg:grid-cols-[2fr_3fr]">
      <section className="flex flex-col justify-between gap-10 bg-forest px-6 py-10 text-white md:px-16">
        <span className="text-2xl font-extrabold">AgentLayer</span>

        <div className="flex flex-col gap-4">
          <span className="text-3xl font-bold break-all text-sprout">{domain}</span>
          <span className="text-[9rem] leading-none font-extrabold tabular-nums md:text-[12rem]">{report.score}</span>
          <span className="text-2xl text-sprout">out of 100</span>
          {report.previewScore > report.score && (
            <span className="mt-6 text-3xl font-bold">
              {report.previewScore} with our fixes
            </span>
          )}
          {report.partial && <span className="text-2xl text-amber">Partial scan. Some pages took too long.</span>}
        </div>

        <ButtonLink href="/" variant="light" className="self-start">
          Scan another store
        </ButtonLink>
      </section>

      <section className="flex flex-col">
        <ul className="flex flex-col">
          {issues.length === 0 && <li className="px-6 py-10 text-3xl font-bold md:px-16">AI can read your store. Nothing to fix.</li>}
          {issues.map((issue) => (
            <li key={issue.checkId} className="flex items-stretch border-b border-line">
              <span className={`w-3 shrink-0 ${SEVERITY_BAR[issue.severity]}`} />
              <div className="flex flex-1 flex-col gap-4 px-6 py-7 md:flex-row md:items-center md:justify-between md:px-12">
                <span className="text-2xl font-bold">{issue.summary}</span>
                <span className="flex shrink-0 gap-6 text-xl">
                  <span className="text-forest/60">{issue.fixedBy === 'us' ? 'We fix' : 'You fix'}</span>
                  {issue.scoreGain > 0 && <span className="font-bold text-leaf tabular-nums">+{issue.scoreGain}</span>}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 border-b border-line md:grid-cols-4">
          {report.botAccess.map((bot) => {
            const blocked = bot.likelyBlocked || !bot.allowedByRobots;
            const tone = !blocked ? 'text-leaf' : bot.type === 'training' ? 'text-amber' : 'text-red';
            return (
              <div key={bot.token} className="flex flex-col gap-2 border-r border-b border-line px-5 py-6">
                <span className="text-lg font-bold whitespace-nowrap">{bot.token}</span>
                <span className={`text-lg ${tone}`}>{blocked ? 'Blocked' : 'Allowed'}</span>
              </div>
            );
          })}
        </div>

        <div className="grid flex-1 grid-cols-1 content-center gap-x-12 gap-y-8 bg-mint px-6 py-10 md:grid-cols-2 md:px-16 xl:grid-cols-3">
          {report.areas
            .filter((a) => a.score >= 0)
            .map((a) => (
              <div key={a.area} className="flex flex-col gap-3">
                <span className="flex justify-between text-xl font-bold">
                  <span>{AREA_LABELS[a.area]}</span>
                  <span className="tabular-nums">{a.score}</span>
                </span>
                <span className="h-3 w-full bg-line">
                  <span className="block h-3 bg-leaf" style={{ width: `${a.score}%` }} />
                </span>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}

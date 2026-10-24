import { Panel } from '@/components/ui/panel';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Report } from '@/lib/api/scans';
import { AREA_LABELS } from './labels';

type Check = Report['checks'][number];

const AREA_ORDER: Check['area'][] = ['access', 'offering', 'productData', 'visibility', 'trust', 'aiCommerce', 'discovery'];

const STATUS: Record<Check['status'], { label: string; tone: string }> = {
  pass: { label: 'Passed', tone: 'text-leaf' },
  warn: { label: 'Warning', tone: 'text-amber' },
  fail: { label: 'Problem', tone: 'text-red' },
  unknown: { label: "Couldn't check", tone: 'text-muted' },
  not_applicable: { label: "Doesn't apply", tone: 'text-muted' },
};

/** Found / Missing for a file check, from its status and wording. */
function fileState(check: Check | undefined, missingWhen: (c: Check) => boolean) {
  if (!check) return { label: "Couldn't check", tone: 'text-muted' };
  if (check.status === 'not_applicable') return { label: "Doesn't apply", tone: 'text-muted' };
  if (check.status === 'unknown') return { label: "Couldn't check", tone: 'text-muted' };
  return missingWhen(check) ? { label: 'Missing', tone: 'text-red' } : { label: 'Found', tone: 'text-leaf' };
}

const FILES: { name: string; id: string; missingWhen: (c: Check) => boolean }[] = [
  { name: 'robots.txt', id: 'reach.robots-search-bots', missingWhen: (c) => /^No robots\.txt/i.test(c.summary) }, // a site without robots.txt passes (all bots allowed) but the file is missing; one that blocks bots has it
  { name: 'llms.txt', id: 'extras.llms-txt', missingWhen: (c) => c.status !== 'pass' },
  { name: 'sitemap.xml', id: 'extras.sitemap', missingWhen: (c) => c.status !== 'pass' },
  { name: 'UCP profile', id: 'extras.ucp', missingWhen: (c) => c.status !== 'pass' },
];

/** Every check we ran, not just the problems: the files we looked for, then each area's checks. */
export function AllChecks({ checks }: { checks: Check[] }) {
  const byId = new Map(checks.map((c) => [c.checkId, c]));
  // Checks that don't apply to this business are listed under "Not scored"; here only what we actually ran.
  const areas = AREA_ORDER.map((area) => ({ area, items: checks.filter((c) => c.area === area && c.status !== 'not_applicable') })).filter((a) => a.items.length > 0);

  return (
    <Panel label="Everything we checked" className="lg:col-span-12">
      <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
        {FILES.map((f) => {
          const s = fileState(byId.get(f.id), f.missingWhen);
          return (
            <li key={f.id} className="flex flex-col">
              <span className="text-base text-muted">{f.name}</span>
              <span className={`text-base font-semibold ${s.tone}`}>{s.label}</span>
            </li>
          );
        })}
      </ul>

      <Accordion type="multiple" defaultValue={areas.slice(0, 2).map((a) => a.area)}>
        {areas.map(({ area, items }) => {
          const passed = items.filter((c) => c.status === 'pass').length;
          const unknown = items.filter((c) => c.status === 'unknown').length;
          return (
            <AccordionItem key={area} value={area} className="border-line">
              <AccordionTrigger>
                <span className="flex flex-wrap gap-x-3">
                  {AREA_LABELS[area]}
                  <span className="font-normal text-muted tabular-nums">
                    {items.length - unknown} checked, {passed} passed{unknown > 0 && `, ${unknown} couldn't check`}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col divide-y divide-line">
                  {items.map((c) => {
                    const s = STATUS[c.status];
                    return (
                      <li key={c.checkId} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                        <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                          <span className="text-base font-semibold">{c.title}</span>
                          <span className={`text-base font-semibold ${s.tone}`}>
                            {s.label}
                            {c.informational && <span className="font-normal text-muted"> · Not scored</span>}
                          </span>
                        </span>
                        <span className="max-w-[65ch] text-base text-muted">{c.summary}</span>
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Panel>
  );
}

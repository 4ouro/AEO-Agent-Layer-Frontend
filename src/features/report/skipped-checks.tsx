import { Panel } from '@/components/ui/panel';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Report } from '@/lib/api/scans';

type Check = Report['checks'][number];

/** Checks that were left out of the score: ones that don't fit this business, and ones we couldn't run. */
export function SkippedChecks({ unknown, notApplicable, noun }: { unknown: Check[]; notApplicable: Check[]; noun: string }) {
  return (
    <Panel label="Not scored" className="lg:col-span-12">
      <Accordion type="multiple" defaultValue={unknown.length > 0 ? ['unknown'] : []}>
        {unknown.length > 0 && (
          <AccordionItem value="unknown" className="border-line">
            <AccordionTrigger>
              <span className="flex gap-3">
                Couldn&apos;t check
                <span className="font-normal text-muted tabular-nums">{unknown.length}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <CheckList checks={unknown} />
            </AccordionContent>
          </AccordionItem>
        )}
        {notApplicable.length > 0 && (
          <AccordionItem value="na" className="border-line">
            <AccordionTrigger>
              <span className="flex gap-3">
                Doesn&apos;t apply to your {noun}
                <span className="font-normal text-muted tabular-nums">{notApplicable.length}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <CheckList checks={notApplicable} />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </Panel>
  );
}

function CheckList({ checks }: { checks: Check[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {checks.map((c) => (
        <li key={c.checkId} className="flex flex-col">
          <span className="text-base font-semibold">{c.title}</span>
          <span className="max-w-[65ch] text-base text-muted">{c.summary}</span>
        </li>
      ))}
    </ul>
  );
}

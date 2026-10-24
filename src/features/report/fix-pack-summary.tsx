import { ButtonLink } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import type { Report } from '@/lib/api/scans';
import { FIX_FILE_LABELS } from './labels';

/** What the fix pack holds for this site, with a link to the files (open to everyone while the API runs with FIX_PACK_OPEN for demos). */
export function FixPackSummary({ summary, noun, href }: { summary: Report['fixPackSummary']; noun: string; href: string }) {
  const items = [
    ...summary.files.map((path) => ({ key: path, name: path.slice(1), detail: FIX_FILE_LABELS[path] ?? 'Ready to upload' })),
    ...(summary.productSchemas ? [{ key: 'schema', name: 'Product data', detail: `For ${summary.productSchemas} ${summary.productSchemas === 1 ? 'page' : 'pages'}` }] : []),
    ...(summary.schemas ? [{ key: 'snippets', name: 'Schema snippets', detail: `${summary.schemas} to paste into your ${summary.schemas === 1 ? 'page' : 'pages'}` }] : []),
    ...(summary.sellerSteps ? [{ key: 'steps', name: 'Your steps', detail: `${summary.sellerSteps} ${summary.sellerSteps === 1 ? 'thing' : 'things'} only you can change` }] : []),
  ];

  return (
    <Panel label="Fix pack" className="lg:col-span-12 xl:col-span-3">
      {items.length ? (
        <ul className="flex flex-col divide-y divide-line lg:flex-row lg:gap-10 lg:divide-y-0 xl:flex-col xl:gap-0 xl:divide-y">
          {items.map((item) => (
            <li key={item.key} className="flex flex-col py-3 first:pt-0">
              <span className="truncate text-base font-semibold">{item.name}</span>
              <span className="text-base text-muted">{item.detail}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-base text-muted">Nothing to add. Your {noun} already has what AI needs.</p>
      )}
      {items.length > 0 && (
        <ButtonLink href={href} className="mt-auto self-start">
          View fix pack
        </ButtonLink>
      )}
    </Panel>
  );
}

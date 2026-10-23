import { Panel } from '@/components/ui/panel';
import type { Report } from '@/lib/api/scans';
import { FIX_FILE_LABELS } from './labels';

/** What the fix pack holds for this store. The files themselves unlock once the seller verifies ownership. */
export function FixPackSummary({ summary }: { summary: Report['fixPackSummary'] }) {
  const items = [
    ...summary.files.map((path) => ({ key: path, name: path.slice(1), detail: FIX_FILE_LABELS[path] ?? 'Ready to upload' })),
    ...(summary.productSchemas ? [{ key: 'schema', name: 'Product data', detail: `For ${summary.productSchemas} ${summary.productSchemas === 1 ? 'page' : 'pages'}` }] : []),
    ...(summary.sellerSteps ? [{ key: 'steps', name: 'Your steps', detail: `${summary.sellerSteps} ${summary.sellerSteps === 1 ? 'thing' : 'things'} only you can change` }] : []),
  ];

  return (
    <Panel label="Fix pack" className="lg:col-span-3">
      {items.length ? (
        <ul className="flex flex-col divide-y divide-line">
          {items.map((item) => (
            <li key={item.key} className="flex flex-col py-3 first:pt-0">
              <span className="truncate text-base font-semibold">{item.name}</span>
              <span className="text-base text-muted">{item.detail}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-base text-muted">Nothing to add. Your store already has what AI needs.</p>
      )}
      <p className="mt-auto text-base text-moss">Unlocks when you verify you own this store.</p>
    </Panel>
  );
}

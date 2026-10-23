import { Panel } from '@/components/ui/panel';
import type { ScannedPage } from '@/lib/api/scans';
import { PAGE_KIND_LABELS } from './labels';

/** The pages we looked at: what an AI bot got (raw HTML) and what a shopper's browser got. */
export function PagesTable({ pages }: { pages: ScannedPage[] }) {
  return (
    <Panel label="Pages checked" action={<span className="text-base text-muted tabular-nums">{pages.length} pages</span>}>
      <div className="-mx-6 overflow-x-auto md:-mx-7">
        <table className="w-full min-w-[30rem] table-fixed text-base">
          <colgroup>
            <col className="w-[55%]" />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr className="border-y border-line bg-canvas text-left text-muted">
              <th className="px-6 py-3 font-normal md:pl-7">Page</th>
              <th className="px-3 py-3 font-normal">AI bot</th>
              <th className="px-6 py-3 font-normal md:pr-7">Browser</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.url} className="border-b border-line last:border-b-0">
                <td className="px-6 py-3.5 md:pl-7">
                  <span className="flex flex-col">
                    <span className="font-semibold">{PAGE_KIND_LABELS[p.kind]}</span>
                    <a href={p.url} target="_blank" rel="noreferrer" className="truncate text-muted underline-offset-4 hover:text-forest hover:underline">
                      {path(p.url)}
                    </a>
                  </span>
                </td>
                <td className="px-3 py-3.5">
                  <Status code={p.rawStatus} ms={p.rawMs} />
                </td>
                <td className="px-6 py-3.5 md:pr-7">
                  <Status code={p.renderStatus} ms={p.renderMs} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

const path = (url: string) => {
  const { pathname, search } = new URL(url);
  return pathname === '/' && !search ? 'Homepage' : decodeURIComponent(pathname + search);
};

function Status({ code, ms }: { code: number | null; ms: number | null }) {
  if (code === null) return <span className="text-muted">Not checked</span>;
  const ok = code >= 200 && code < 400;
  return (
    <span className="flex items-center gap-2 whitespace-nowrap tabular-nums">
      <span className={`h-2.5 w-2.5 rounded-full ${ok ? 'bg-leaf' : 'bg-red'}`} />
      <span className="font-semibold">{code}</span>
      {ms !== null && <span className="text-muted">{(ms / 1000).toFixed(1)} s</span>}
    </span>
  );
}

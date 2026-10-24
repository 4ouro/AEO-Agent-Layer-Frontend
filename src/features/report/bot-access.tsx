import { Panel } from '@/components/ui/panel';
import type { BotAccess as Bot } from '@/lib/api/scans';

const TYPES = [
  { type: 'search', label: 'Search' },
  { type: 'user', label: 'Assistant' },
  { type: 'training', label: 'Training' },
] as const;

/** Which AI bots can read the site, by company and job. Blocking training bots is allowed (a business choice), so it shows amber, not red. */
export function BotAccess({ bots, noun }: { bots: Bot[]; noun: string }) {
  const vendors = [...new Set(bots.map((b) => b.vendor))];
  const allowed = bots.filter((b) => !blocked(b)).length;

  return (
    <Panel label="AI bots" action={<span className="text-base text-muted tabular-nums">{allowed} of {bots.length} can read your {noun}</span>}>
      <div className="-mx-6 overflow-x-auto px-6 md:-mx-7 md:px-7">
        <table className="w-full min-w-[30rem] border-separate border-spacing-y-3 text-base">
          <thead>
            <tr className="text-left text-muted">
              <th className="pb-1 font-normal">Company</th>
              {TYPES.map((t) => (
                <th key={t.type} className="pb-1 font-normal">
                  {t.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor}>
                <td className="py-1 pr-4 font-semibold">{vendor}</td>
                {TYPES.map((t) => {
                  const bot = bots.find((b) => b.vendor === vendor && b.type === t.type);
                  return <td key={t.type} className="py-1 pr-3">{bot ? <BotStatus bot={bot} /> : <span className="text-muted">None</span>}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-base text-muted">Search and assistant bots decide whether AI answers mention you. Blocking training bots is your choice.</p>
    </Panel>
  );
}

const blocked = (b: Bot) => b.likelyBlocked || !b.allowedByRobots;

function BotStatus({ bot }: { bot: Bot }) {
  const isBlocked = blocked(bot);
  const dot = !isBlocked ? 'bg-leaf' : bot.type === 'training' ? 'bg-amber' : 'bg-red';
  return (
    <span className="flex flex-col">
      <span className="flex items-center gap-2 font-semibold whitespace-nowrap">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
        {isBlocked ? 'Blocked' : 'Allowed'}
      </span>
      <span className="pl-[1.125rem] whitespace-nowrap text-muted">{bot.token}</span>
    </span>
  );
}

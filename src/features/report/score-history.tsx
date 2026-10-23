import Link from 'next/link';
import { Panel } from '@/components/ui/panel';
import type { Scan } from '@/lib/api/scans';
import { formatDate, formatTime } from './labels';

/**
 * Score over time for this store (oldest to newest). The line is SVG stretched to the box; dots and labels are HTML
 * so they stay round and readable at any width.
 */
export function ScoreHistory({ scans, currentId }: { scans: Scan[]; currentId: string }) {
  const points = scans
    .filter((s) => s.score !== null)
    .slice(0, 12)
    .reverse()
    .map((s, i, all) => ({ ...s, score: s.score!, x: all.length > 1 ? (i / (all.length - 1)) * 100 : 50, y: 100 - s.score! }));
  const first = points[0];
  const last = points.at(-1);
  const change = first && last && points.length > 1 ? last.score - first.score : 0;
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
  // All scans on one day: label the axis with times instead of the same date twice.
  const sameDay = !!first && !!last && formatDate(first.createdAt, false) === formatDate(last.createdAt, false);
  const axisLabel = (iso: string) => (sameDay ? formatTime(iso) : formatDate(iso, false));

  return (
    <Panel
      label="Score over time"
      className="lg:col-span-5"
      action={
        points.length > 1 && (
          <span className={`text-base font-semibold tabular-nums ${change > 0 ? 'text-leaf' : change < 0 ? 'text-red' : 'text-muted'}`}>
            {change === 0 ? 'No change' : `${change > 0 ? '+' : ''}${change} since ${axisLabel(first!.createdAt)}`}
          </span>
        )
      }
    >
      <div className="flex gap-3">
        <div className="flex h-52 flex-col justify-between text-base text-muted tabular-nums">
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>
        <div className="relative h-52 flex-1">
          <div className="absolute inset-0 flex flex-col justify-between" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="border-t border-dashed border-line" />
            ))}
          </div>
          {points.length > 1 && (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              <path d={`${line} L100,100 L0,100 Z`} fill="var(--color-lime-soft)" />
              <path d={line} fill="none" stroke="var(--color-moss)" strokeWidth={2.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>
          )}
          {points.map((p) => {
            const current = p.id === currentId;
            return (
              <Link
                key={p.id}
                href={`/scans/${p.id}`}
                aria-label={`Score ${p.score} on ${formatDate(p.createdAt)}`}
                title={`${p.score} on ${formatDate(p.createdAt)}`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-white transition-transform duration-150 ease-out hover:scale-125 ${
                  current ? 'h-5 w-5 border-4 bg-moss shadow-[0_0_0_2px_var(--color-moss)]' : 'h-3.5 w-3.5 border-2 bg-sage'
                }`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              />
            );
          })}
        </div>
      </div>
      {points.length > 1 ? (
        <div className="flex justify-between pl-10 text-base text-muted">
          <span>{axisLabel(first!.createdAt)}</span>
          <span>{axisLabel(last!.createdAt)}</span>
        </div>
      ) : (
        <p className="text-base text-muted">Fix something, then scan again to see your score move.</p>
      )}
    </Panel>
  );
}

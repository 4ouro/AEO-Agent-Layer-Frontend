import { Panel } from '@/components/ui/panel';
import type { Report } from '@/lib/api/scans';
import { AREA_LABELS } from './labels';

/** The six areas the score is made of, heaviest first. */
export function AreaScores({ areas }: { areas: Report['areas'] }) {
  const sorted = [...areas].sort((a, b) => b.weight - a.weight);
  return (
    <Panel label="Score by area" className="lg:col-span-7">
      <ul className="flex flex-col gap-5">
        {sorted.map((a, i) => {
          const measured = a.score >= 0;
          return (
            <li key={a.area} className="grid grid-cols-[minmax(7rem,9rem)_1fr_3rem] items-center gap-4">
              <span className="flex flex-col">
                <span className="text-base font-semibold">{AREA_LABELS[a.area]}</span>
                <span className="text-base text-muted tabular-nums">{a.weight}% of score</span>
              </span>
              <span className="h-3 overflow-hidden rounded-full bg-lime-soft">
                {measured && (
                  <span
                    className="block h-full motion-grow-x rounded-full bg-moss"
                    style={{ width: `${Math.max(a.score, 2)}%`, animationDelay: `${i * 60}ms` }}
                  />
                )}
              </span>
              <span className={`text-right text-base font-semibold tabular-nums ${measured ? '' : 'text-muted'}`}>{measured ? a.score : 'n/a'}</span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

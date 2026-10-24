import { Panel } from '@/components/ui/panel';
import type { Report } from '@/lib/api/scans';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AREA_DETAILS, AREA_LABELS } from './labels';

/** The areas the score is made of, heaviest first. */
export function AreaScores({ areas }: { areas: Report['areas'] }) {
  const sorted = areas.filter((a) => a.score >= 0).sort((a, b) => b.weight - a.weight);
  return (
    <Panel label="Score by area" className="lg:col-span-6 xl:col-span-7">
      <TooltipProvider>
      <ul className="flex flex-col gap-5">
        {sorted.map((a) => {
          return (
            <li key={a.area} className="grid grid-cols-[minmax(7rem,9rem)_1fr_3rem] items-center gap-4">
              <span className="flex flex-col">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="w-fit cursor-help text-base font-semibold">{AREA_LABELS[a.area]}</span>
                  </TooltipTrigger>
                  <TooltipContent>{AREA_DETAILS[a.area]}</TooltipContent>
                </Tooltip>
                <span className="text-base text-muted tabular-nums">{a.weight}% of score</span>
              </span>
              <Progress value={Math.max(a.score, 2)} />
              <span className="text-right text-base font-semibold tabular-nums">{a.score}</span>
            </li>
          );
        })}
      </ul>
      </TooltipProvider>
    </Panel>
  );
}

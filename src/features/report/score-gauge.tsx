import { Panel } from '@/components/ui/panel';

const SEGMENTS = 30;
const CX = 160;
const CY = 158;
const RADIUS = 122;

/** Along the arc: moss, then leaf green, then lime (a two-step mix keeps the middle vivid instead of grey). */
const litColour = (t: number) =>
  t < 0.5
    ? `color-mix(in oklch, var(--color-leaf) ${Math.round(t * 200)}%, var(--color-moss))`
    : `color-mix(in oklch, var(--color-lime) ${Math.round((t - 0.5) * 200)}%, var(--color-leaf))`;

/** The score as a segmented arc (like the 4ouro "AI citation rate"), with the points our fixes would add drawn in outline. */
export function ScoreGauge({ score, previewScore, pagesChecked }: { score: number; previewScore: number; pagesChecked: number }) {
  const lit = Math.round((score / 100) * SEGMENTS);
  const withFixes = Math.round((previewScore / 100) * SEGMENTS);
  const gain = previewScore - score;

  return (
    <Panel label="AI visibility score" className="lg:col-span-6 xl:col-span-5">
      <div className="relative mx-auto w-full max-w-[22rem]">
        <svg viewBox="0 0 320 172" className="w-full" role="img" aria-label={`Score ${score} out of 100${gain > 0 ? `, ${previewScore} with our fixes` : ''}`}>
          {Array.from({ length: SEGMENTS }, (_, i) => {
            const angle = 180 - (i * 180) / (SEGMENTS - 1);
            const rad = (angle * Math.PI) / 180;
            const x = CX + RADIUS * Math.cos(rad);
            const y = CY - RADIUS * Math.sin(rad);
            const t = i / (SEGMENTS - 1);
            const state = i < lit ? 'lit' : i < withFixes ? 'fix' : 'empty';
            return (
              <rect
                key={i}
                x={-6.5}
                y={-19}
                width={13}
                height={38}
                rx={6.5}
                transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${90 - angle})`}
                className={state === 'lit' ? 'motion-light-up' : undefined}
                style={{
                  fill: state === 'lit' ? litColour(t) : state === 'fix' ? 'var(--color-lime-soft)' : 'var(--color-line)',
                  stroke: state === 'fix' ? 'var(--color-sage)' : 'none',
                  strokeWidth: 1.5,
                  strokeDasharray: state === 'fix' ? '4 3' : undefined,
                  animationDelay: `${i * 22}ms`,
                }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className="text-6xl leading-none font-extrabold tabular-nums">{score}</span>
          <span className="mt-1 text-base text-muted">out of 100</span>
        </div>
      </div>

      <dl className="mt-auto grid grid-cols-2 divide-x divide-line border-t border-line pt-5">
        <div className="flex flex-col gap-1 pr-4">
          <dt className="text-base text-muted">With our fixes</dt>
          <dd className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums">{previewScore}</span>
            {gain > 0 && <span className="text-base font-semibold text-leaf tabular-nums">+{gain}</span>}
          </dd>
        </div>
        <div className="flex flex-col gap-1 pl-5">
          <dt className="text-base text-muted">Pages checked</dt>
          <dd className="text-3xl font-bold tabular-nums">{pagesChecked}</dd>
        </div>
      </dl>
    </Panel>
  );
}

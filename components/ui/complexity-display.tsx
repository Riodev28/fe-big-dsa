import { COMPLEXITY_COLORS } from '@/consts/complexity-colors-mapper';
import { Separator } from './separator';

const ComplexityDisplay = ({
  complexity,
  space,
}: {
  complexity: string;
  space: string;
}) => {
  const color = COMPLEXITY_COLORS[complexity] ?? '#71717a';

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
          Calculated Complexity
        </p>
        <p
          className="font-mono text-4xl font-bold tracking-tight"
          style={{ color }}
        >
          {complexity}
        </p>
        <p className="mt-2 text-xs text-zinc-400">
          {complexity === 'O(log n)'
            ? 'This algorithm uses a divide-and-conquer strategy, reducing the search space by half in each iteration of the while loop.'
            : complexity === 'O(n)'
              ? 'This algorithm iterates through the input once, growing linearly with the size of the input.'
              : complexity === 'O(n²)'
                ? 'This algorithm uses nested loops, growing quadratically with the size of the input.'
                : complexity === 'O(1)'
                  ? 'This algorithm runs in constant time regardless of input size.'
                  : 'Complexity could not be determined.'}
        </p>
      </div>

      <Separator className="bg-zinc-800" />

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-zinc-800 bg-zinc-900 p-3">
          <p className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">
            Space
          </p>
          <p
            className="font-mono text-sm font-semibold text-zinc-100"
            style={{ color }}
          >
            {space}
          </p>
        </div>
        <div className="rounded-md border border-zinc-800 bg-zinc-900 p-3">
          <p className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">
            Time
          </p>
          <p className="font-mono text-sm font-semibold" style={{ color }}>
            {complexity}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComplexityDisplay;

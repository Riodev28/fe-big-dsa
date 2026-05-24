import { Area, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './chart';
import { AreaChart } from 'recharts';

const generateChartData = (complexity: string) => {
  const points = Array.from({ length: 12 }, (_, i) => {
    const n = (i + 1) * 10;
    let current = n;
    let linear = n;
    if (complexity === 'O(1)') current = 1;
    else if (complexity === 'O(log n)') current = Math.log2(n) * 10;
    else if (complexity === 'O(n)') current = n;
    else if (complexity === 'O(n²)') current = n * n * 0.1;
    return { n, current, linear };
  });
  return points;
};

const COMPLEXITY_COLORS: Record<string, string> = {
  'O(1)': '#22c55e',
  'O(log n)': '#3b82f6',
  'O(n)': '#f59e0b',
  'O(n²)': '#ef4444',
  unknown: '#71717a',
};

const chartConfig = {
  current: { label: 'Current Algorithm', color: '#22c55e' },
  linear: { label: 'Linear Baseline O(n)', color: '#3f3f46' },
};

const NotationChart = ({ complexity }: { complexity: string }) => {
  const data = generateChartData(complexity);
  const color = COMPLEXITY_COLORS[complexity] ?? '#71717a';

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
        Growth Visualization
      </p>
      <ChartContainer config={chartConfig} className="h-44 w-full">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLinear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3f3f46" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3f3f46" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="n"
            tick={{ fill: '#52525b', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: 'Inputs',
              position: 'insideBottomRight',
              fill: '#52525b',
              fontSize: 10,
              offset: -4,
            }}
          />
          <YAxis hide />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="linear"
            stroke="#3f3f46"
            strokeWidth={1.5}
            fill="url(#colorLinear)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="current"
            stroke={color}
            strokeWidth={2}
            fill="url(#colorCurrent)"
            dot={false}
          />
        </AreaChart>
      </ChartContainer>

      {/* Legend */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: color }} />
          <span className="text-xs text-zinc-400">Current Algorithm</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-zinc-600" />
          <span className="text-xs text-zinc-400">Linear Baseline O(n)</span>
        </div>
      </div>
    </div>
  );
};

export default NotationChart;

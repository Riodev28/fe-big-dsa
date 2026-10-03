'use client';

import { Area, AreaChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatMonth, formatMonthYear } from '@/lib/format';
import { TrendPoint } from '@/types/dto';

// Months without analyses are null and render as gaps: a missing score is not a score of 0
export default function TrendsChart({ points }: { points: TrendPoint[] }) {
  const hasData = points.some((point) => point.current !== null || point.baseline !== null);

  if (!hasData) {
    return (
      <div className="flex h-full items-center justify-center text-center text-xs text-zinc-500">
        Run a few analyses to see your code health over time.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={points} margin={{ top: 16, right: 4, left: -32, bottom: 0 }}>
        <defs>
          <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fff" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#71717a" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#71717a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tickFormatter={(month: string) => formatMonth(month).toUpperCase()}
          tick={{ fill: '#52525b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide domain={[0, 100]} />
        <Tooltip
          labelFormatter={(month) => formatMonthYear(String(month))}
          formatter={(value) => (value == null ? 'No data' : `${value} / 100`)}
          contentStyle={{
            background: '#18181b',
            border: '1px solid #27272a',
            borderRadius: 8,
            color: '#f4f4f5',
            fontSize: 12,
          }}
          cursor={{ stroke: '#3f3f46', strokeWidth: 1 }}
        />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ fontSize: 11, color: '#71717a', paddingBottom: 8 }}
          formatter={(value) => <span style={{ color: '#71717a' }}>{value}</span>}
        />
        <Area
          type="monotone"
          dataKey="baseline"
          name="All users"
          stroke="#52525b"
          strokeWidth={1.5}
          fill="url(#baselineGrad)"
          dot={false}
          activeDot={{ r: 3, fill: '#52525b' }}
        />
        <Area
          type="monotone"
          dataKey="current"
          name="You"
          stroke="#f4f4f5"
          strokeWidth={2}
          fill="url(#currentGrad)"
          dot={{ r: 2, fill: '#f4f4f5' }}
          activeDot={{ r: 4, fill: '#fff' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

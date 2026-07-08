'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart2,
  Zap,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Braces,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const trendData = [
  { month: 'JAN', current: 18, baseline: 32 },
  { month: 'FEB', current: 22, baseline: 34 },
  { month: 'MAR', current: 20, baseline: 33 },
  { month: 'APR', current: 28, baseline: 36 },
  { month: 'MAY', current: 35, baseline: 37 },
  { month: 'JUN', current: 52, baseline: 39 },
  { month: 'JUL', current: 78, baseline: 41 },
];

const reports = [
  {
    name: 'dijkstra_v2.py',
    complexity: 'O(E LOG V)',
    color: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
    language: 'Python 3.11',
    date: 'Oct 24, 2023',
  },
  {
    name: 'bubble_sort.py',
    complexity: 'O(N²)',
    color: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    language: 'Python 3.11',
    date: 'Oct 22, 2023',
  },
  {
    name: 'hash_map_impl.py',
    complexity: 'O(1) AMORTIZED',
    color: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
    language: 'Python 3.11',
    date: 'Oct 21, 2023',
  },
  {
    name: 'matrix_mult.py',
    complexity: 'O(N³)',
    color: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    language: 'Python 3.11',
    date: 'Oct 19, 2023',
  },
];

const statCards = [
  {
    label: 'Total Analyses',
    value: '1,284',
    sub: '+12% from last week',
    subColor: 'text-emerald-400',
    icon: BarChart2,
  },
  {
    label: 'Mode Complexity',
    value: 'O(n log n)',
    sub: 'Quicksort dominant pattern',
    subColor: 'text-zinc-500',
    icon: Zap,
    valueMono: true,
  },
  {
    label: 'Avg Analysis Time',
    value: '420ms',
    sub: 'Optimized inference engine',
    subColor: 'text-zinc-500',
    icon: Clock,
  },
  {
    label: 'Code Health Score',
    value: '92.4%',
    sub: null,
    progress: 92.4,
    subColor: '',
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <div className="h-full overflow-y-auto bg-zinc-950 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
              >
                <div className="mb-3 flex items-start justify-between">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                    {card.label}
                  </p>
                  <Icon className="h-4 w-4 text-zinc-600" />
                </div>
                <p
                  className={`text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl ${
                    card.valueMono ? 'font-mono' : ''
                  }`}
                >
                  {card.value}
                </p>
                {card.sub && (
                  <p className={`mt-1.5 text-xs ${card.subColor}`}>{card.sub}</p>
                )}
                {card.progress !== undefined && (
                  <div className="mt-3">
                    <div className="h-0.5 w-full rounded-full bg-zinc-800">
                      <div
                        className="h-0.5 rounded-full bg-zinc-100"
                        style={{ width: `${card.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Chart + New Analysis */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Complexity Trends */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 lg:col-span-2">
            <div className="mb-1">
              <p className="text-sm font-semibold text-zinc-100">Complexity Trends</p>
              <p className="text-xs text-zinc-500">Historical growth analysis of code library</p>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 16, right: 4, left: -32, bottom: 0 }}>
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
                    tick={{ fill: '#52525b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
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
                    formatter={(value) => (
                      <span style={{ color: '#71717a', textTransform: 'capitalize' }}>{value}</span>
                    )}
                  />
                  <Area
                    type="monotone"
                    dataKey="baseline"
                    name="Baseline"
                    stroke="#52525b"
                    strokeWidth={1.5}
                    fill="url(#baselineGrad)"
                    dot={false}
                    activeDot={{ r: 3, fill: '#52525b' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="current"
                    name="Current"
                    stroke="#f4f4f5"
                    strokeWidth={2}
                    fill="url(#currentGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Analysis */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col">
            <p className="text-sm font-semibold text-zinc-100">New Analysis</p>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
              Upload your source code or paste a snippet to receive an instant Big-O complexity
              breakdown and optimization suggestions.
            </p>

            <div className="mt-5 space-y-2.5 flex-1">
              <div className="flex items-center gap-2.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2.5">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                <span className="text-xs text-zinc-300">AI Explanation Included</span>
              </div>
            </div>

            <Link
              href="/big-o"
              className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-zinc-100 px-4 py-2.5 text-xs font-semibold tracking-widest text-zinc-900 uppercase transition-colors hover:bg-white"
            >
              Launch Analyzer
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Complexity Reports */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="flex items-center justify-between px-5 py-4">
            <p className="text-sm font-semibold text-zinc-100">Recent Complexity Reports</p>
            <button className="text-xs text-zinc-500 transition-colors hover:text-zinc-300">
              View All Records
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-130">
              <thead>
                <tr className="border-t border-zinc-800">
                  {[
                    { label: 'Algorithm Name', className: '' },
                    { label: 'Detected Complexity', className: '' },
                    { label: 'Language', className: 'hidden md:table-cell' },
                    { label: 'Date', className: 'hidden md:table-cell' },
                    { label: 'Actions', className: '' },
                  ].map(({ label, className }) => (
                    <th
                      key={label}
                      className={`px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-600 sm:px-5 ${className}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((row, i) => (
                  <tr
                    key={row.name}
                    className={`border-t border-zinc-800 ${
                      i % 2 === 0 ? 'bg-transparent' : 'bg-zinc-800/30'
                    }`}
                  >
                    <td className="px-4 py-3.5 text-sm text-zinc-200 sm:px-5">{row.name}</td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <span
                        className={`inline-block rounded border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide ${row.color}`}
                      >
                        {row.complexity}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3.5 text-sm text-zinc-400 md:table-cell sm:px-5">
                      {row.language}
                    </td>
                    <td className="hidden px-4 py-3.5 text-sm text-zinc-400 md:table-cell sm:px-5">
                      {row.date}
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <button className="text-zinc-600 transition-colors hover:text-zinc-300">
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

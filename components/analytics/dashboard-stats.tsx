import type { ReactNode } from 'react';
import { BarChart2, Clock, ShieldCheck, Zap, type LucideIcon } from 'lucide-react';
import { formatDuration, formatNumber, formatSignedPercent } from '@/lib/format';
import { cn } from '@/lib/utils';
import { DashboardSummaryResult, TotalAnalysesMetric } from '@/types/dto';

const EMPTY_VALUE = '—';

interface StatCardProps {
  label: string;
  icon: LucideIcon;
  value: ReactNode;
  sub?: ReactNode;
  subClassName?: string;
  mono?: boolean;
  /** 0 to 100; renders a progress bar under the value */
  progress?: number | null;
}

function StatCard({ label, icon: Icon, value, sub, subClassName, mono, progress }: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">{label}</p>
        <Icon className="h-4 w-4 text-zinc-600" />
      </div>
      <p
        className={cn(
          'truncate text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl',
          mono && 'font-mono'
        )}
      >
        {value}
      </p>
      {sub && <p className={cn('mt-1.5 text-xs text-zinc-500', subClassName)}>{sub}</p>}
      {progress != null && (
        <div
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="mt-3 h-0.5 w-full rounded-full bg-zinc-800"
        >
          <div className="h-0.5 rounded-full bg-zinc-100" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function weeklyChange({ this_week, change_vs_last_week_pct: pct }: TotalAnalysesMetric) {
  // No analyses last week means growth is undefined, so show the raw count instead
  if (pct === null) {
    return { text: `${formatNumber(this_week)} this week`, className: undefined };
  }
  return {
    text: `${formatSignedPercent(pct)} from last week`,
    className: pct > 0 ? 'text-emerald-400' : pct < 0 ? 'text-red-400' : undefined,
  };
}

export default function DashboardStats({ summary }: { summary: DashboardSummaryResult }) {
  const {
    total_analyses: total,
    mode_complexity: mode,
    average_analysis_time_ms: avgMs,
    code_health_score: health,
  } = summary;
  const change = weeklyChange(total);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Analyses"
        icon={BarChart2}
        value={formatNumber(total.value)}
        sub={change.text}
        subClassName={change.className}
      />
      <StatCard
        label="Mode Complexity"
        icon={Zap}
        mono
        value={mode?.notation ?? EMPTY_VALUE}
        sub={
          mode
            ? `${mode.complexity_class.label} · ${mode.share_pct}% of analyses`
            : 'No analyses yet'
        }
      />
      <StatCard
        label="Avg Analysis Time"
        icon={Clock}
        value={avgMs !== null ? formatDuration(avgMs) : EMPTY_VALUE}
        sub="Engine time per analysis"
      />
      <StatCard
        label="Code Health Score"
        icon={ShieldCheck}
        value={
          health !== null ? (
            <>
              {health}
              <span className="ml-1 text-sm font-medium text-zinc-500">/ 100</span>
            </>
          ) : (
            EMPTY_VALUE
          )
        }
        sub={health === null ? 'No analyses yet' : undefined}
        progress={health}
      />
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading summary"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="mb-4 h-3 w-1/2 rounded bg-zinc-800" />
          <div className="h-8 w-2/3 rounded bg-zinc-800" />
          <div className="mt-2.5 h-2.5 w-1/3 rounded bg-zinc-800/60" />
        </div>
      ))}
    </div>
  );
}

'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { ArrowUpRight, History, Sparkles } from 'lucide-react';
import AnalysesTable from '@/components/analytics/analyses-table';
import DashboardStats, { DashboardStatsSkeleton } from '@/components/analytics/dashboard-stats';
import KindFilter from '@/components/analytics/kind-filter';
import QueryError from '@/components/analytics/query-error';
import TrendsChart from '@/components/analytics/trends-chart';
import { useApiQuery } from '@/hooks/use-api-query';
import { ANALYSIS_KIND_LABELS, DEFAULT_ANALYSIS_KIND } from '@/lib/analytics';
import { getAnalyses, getDashboardSummary, getDashboardTrends } from '@/lib/api';
import { AnalysisKind } from '@/types/dto';

const TREND_MONTHS = 6;
const RECENT_ANALYSES_LIMIT = 5;

function dashboardHref(kind: AnalysisKind | undefined): string {
  return kind && kind !== DEFAULT_ANALYSIS_KIND ? `/?kind=${kind}` : '/';
}

export default function Dashboard({ kind }: { kind: AnalysisKind }) {
  const summary = useApiQuery(
    useCallback((signal) => getDashboardSummary({ kind }, signal), [kind]),
    'Could not load your summary.'
  );
  const trends = useApiQuery(
    useCallback((signal) => getDashboardTrends({ kind, months: TREND_MONTHS }, signal), [kind]),
    'Could not load complexity trends.'
  );
  const recent = useApiQuery(
    useCallback((signal) => getAnalyses({ kind, limit: RECENT_ANALYSES_LIMIT }, signal), [kind]),
    'Could not load recent reports.'
  );

  const kindLabel = ANALYSIS_KIND_LABELS[kind].toLowerCase();

  return (
    <div className="h-full overflow-y-auto bg-zinc-950 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">
        <header className="flex items-center justify-between gap-3 max-lg:pl-12">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">Dashboard</h1>
          <KindFilter value={kind} hrefFor={dashboardHref} />
        </header>

        {/* Stat Cards */}
        {summary.error && !summary.data ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <QueryError message={summary.error} onRetry={summary.reload} />
          </div>
        ) : summary.data ? (
          <div className={summary.loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <DashboardStats summary={summary.data} />
          </div>
        ) : (
          <DashboardStatsSkeleton />
        )}

        {/* Chart + New Analysis */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <section
            aria-labelledby="trends-heading"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 lg:col-span-2"
          >
            <div className="mb-1">
              <h2 id="trends-heading" className="text-sm font-semibold text-zinc-100">
                Complexity Trends
              </h2>
              <p className="text-xs text-zinc-500">
                Monthly {kindLabel} code health score, compared with all users
              </p>
            </div>
            <div className="h-56" aria-busy={trends.loading}>
              {trends.error && !trends.data ? (
                <QueryError
                  message={trends.error}
                  onRetry={trends.reload}
                  className="h-full justify-center"
                />
              ) : trends.data ? (
                <TrendsChart points={trends.data.points} />
              ) : (
                <div className="mt-4 h-48 animate-pulse rounded-lg bg-zinc-800/40" />
              )}
            </div>
          </section>

          {/* New Analysis */}
          <div className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm font-semibold text-zinc-100">New Analysis</p>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
              Upload your source code or paste a snippet to receive an instant Big-O complexity
              breakdown and optimization suggestions.
            </p>

            <div className="mt-5 flex-1 space-y-2.5">
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
        <section
          aria-labelledby="recent-heading"
          className="rounded-xl border border-zinc-800 bg-zinc-900"
        >
          <div className="flex items-center justify-between px-5 py-4">
            <h2 id="recent-heading" className="text-sm font-semibold text-zinc-100">
              Recent Complexity Reports
            </h2>
            <Link
              href={`/analyses?kind=${kind}`}
              className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              View All Records
            </Link>
          </div>

          {recent.error && !recent.data ? (
            <QueryError message={recent.error} onRetry={recent.reload} className="px-5 pb-5" />
          ) : recent.data && recent.data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-1.5 border-t border-zinc-800 px-5 py-10 text-center">
              <History className="h-5 w-5 text-zinc-600" />
              <p className="text-xs text-zinc-400">No {kindLabel} analyses yet</p>
              <p className="text-[11px] text-zinc-500">
                Analyze code in the Big-O Analyzer to see your reports here.
              </p>
            </div>
          ) : (
            <AnalysesTable
              items={recent.data?.items ?? []}
              loading={recent.loading}
              skeletonRows={RECENT_ANALYSES_LIMIT}
            />
          )}
        </section>
      </div>
    </div>
  );
}

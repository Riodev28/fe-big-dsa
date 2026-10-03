'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, History } from 'lucide-react';
import AnalysesTable from '@/components/analytics/analyses-table';
import KindFilter from '@/components/analytics/kind-filter';
import QueryError from '@/components/analytics/query-error';
import { useApiQuery } from '@/hooks/use-api-query';
import { getAnalyses } from '@/lib/api';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { AnalysisKind } from '@/types/dto';

const PAGE_SIZE = 20;

function listHref(kind: AnalysisKind | undefined, page = 1): string {
  const params = new URLSearchParams();
  if (kind) params.set('kind', kind);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `/analyses?${query}` : '/analyses';
}

interface AnalysesListProps {
  /** `undefined` lists every kind */
  kind?: AnalysisKind;
  /** 1-based */
  page: number;
}

export default function AnalysesList({ kind, page }: AnalysesListProps) {
  const { data, error, loading, reload } = useApiQuery(
    useCallback(
      (signal) => getAnalyses({ kind, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }, signal),
      [kind, page]
    ),
    'Could not load your analyses.'
  );

  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const firstItem = data && data.items.length > 0 ? data.offset + 1 : 0;
  const lastItem = data ? data.offset + data.items.length : 0;
  // A stale or hand-edited URL can point past the last page
  const outOfRange = data !== undefined && data.items.length === 0 && page > 1;

  return (
    <div className="h-full overflow-y-auto bg-zinc-950 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3 max-lg:pl-12">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-100">Analysis History</h1>
            <p className="text-xs text-zinc-500">Every complexity report you have run, newest first</p>
          </div>
          <KindFilter value={kind} hrefFor={(next) => listHref(next)} allowAll />
        </header>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900">
          {error && !data ? (
            <QueryError message={error} onRetry={reload} className="p-5" />
          ) : outOfRange ? (
            <EmptyState
              title="This page is empty"
              action={<Link href={listHref(kind)} className="text-zinc-300 hover:underline">Go to the first page</Link>}
            />
          ) : data && data.items.length === 0 ? (
            <EmptyState
              title="No analyses yet"
              action={<Link href="/big-o" className="text-zinc-300 hover:underline">Open the Big-O Analyzer</Link>}
            />
          ) : (
            <>
              <AnalysesTable items={data?.items ?? []} loading={loading} skeletonRows={8} />
              {data && (
                <nav
                  aria-label="Pagination"
                  className="flex items-center justify-between gap-3 border-t border-zinc-800 px-5 py-3 text-xs text-zinc-500"
                >
                  <p aria-live="polite">
                    {formatNumber(firstItem)}–{formatNumber(lastItem)} of {formatNumber(total)}
                  </p>
                  <div className="flex items-center gap-1">
                    <PageLink
                      href={listHref(kind, page - 1)}
                      disabled={page <= 1}
                      label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </PageLink>
                    <span className="px-2 tabular-nums">
                      Page {page} of {pageCount}
                    </span>
                    <PageLink
                      href={listHref(kind, page + 1)}
                      disabled={page >= pageCount}
                      label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </PageLink>
                  </div>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const className = 'rounded-md border border-zinc-800 p-1.5 transition-colors';

  if (disabled) {
    return (
      <span aria-disabled="true" aria-label={label} className={cn(className, 'text-zinc-700')}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      scroll={false}
      className={cn(className, 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200')}
    >
      {children}
    </Link>
  );
}

function EmptyState({ title, action }: { title: string; action: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-5 py-12 text-center">
      <History className="h-5 w-5 text-zinc-600" />
      <p className="text-xs text-zinc-400">{title}</p>
      <p className="text-[11px] text-zinc-500">{action}</p>
    </div>
  );
}

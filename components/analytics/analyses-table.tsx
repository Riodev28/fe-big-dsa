import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ComplexityBadge from '@/components/analytics/complexity-badge';
import { ANALYSIS_KIND_LABELS } from '@/lib/analytics';
import { formatDate, parseApiDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { AnalysisListItem } from '@/types/dto';

export const UNTITLED_ANALYSIS = 'Untitled analysis';

const COLUMNS = [
  { label: 'Algorithm Name', className: '' },
  { label: 'Detected Complexity', className: '' },
  { label: 'Kind', className: 'hidden sm:table-cell' },
  { label: 'Language', className: 'hidden md:table-cell' },
  { label: 'Date', className: 'hidden md:table-cell' },
  { label: 'Actions', className: 'sr-only' },
];

const CELL = 'px-4 py-3.5 sm:px-5';

interface AnalysesTableProps {
  items: AnalysisListItem[];
  /** Number of placeholder rows to show while the first page loads */
  skeletonRows?: number;
  loading?: boolean;
}

export function analysisHref(id: string): string {
  return `/analyses/${encodeURIComponent(id)}`;
}

export default function AnalysesTable({ items, skeletonRows = 5, loading = false }: AnalysesTableProps) {
  const showSkeleton = loading && items.length === 0;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-130" aria-busy={loading}>
        <thead>
          <tr className="border-t border-zinc-800">
            {COLUMNS.map(({ label, className }) => (
              <th
                key={label}
                scope="col"
                className={cn(
                  'px-4 py-3 text-left text-[10px] font-medium uppercase tracking-widest text-zinc-600 sm:px-5',
                  className
                )}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={cn('transition-opacity', loading && !showSkeleton && 'opacity-60')}>
          {showSkeleton
            ? Array.from({ length: skeletonRows }, (_, i) => <SkeletonRow key={i} />)
            : items.map((item, i) => (
                <tr
                  key={item.id}
                  className={cn(
                    'border-t border-zinc-800',
                    i % 2 === 0 ? 'bg-transparent' : 'bg-zinc-800/30'
                  )}
                >
                  <td className={cn(CELL, 'max-w-56 truncate text-sm text-zinc-200')}>
                    <Link href={analysisHref(item.id)} className="hover:underline">
                      {item.title ?? <span className="text-zinc-500 italic">{UNTITLED_ANALYSIS}</span>}
                    </Link>
                  </td>
                  <td className={CELL}>
                    <ComplexityBadge notation={item.complexity} complexityClass={item.complexity_class} />
                  </td>
                  <td className={cn(CELL, 'hidden text-sm text-zinc-400 sm:table-cell')}>
                    {ANALYSIS_KIND_LABELS[item.kind]}
                  </td>
                  <td className={cn(CELL, 'hidden text-sm text-zinc-400 md:table-cell')}>
                    {item.language}
                  </td>
                  <td className={cn(CELL, 'hidden text-sm text-zinc-400 md:table-cell')}>
                    <time dateTime={parseApiDate(item.created_at).toISOString()}>
                      {formatDate(item.created_at)}
                    </time>
                  </td>
                  <td className={CELL}>
                    <Link
                      href={analysisHref(item.id)}
                      aria-label={`Open ${item.title ?? UNTITLED_ANALYSIS}`}
                      className="flex text-zinc-600 transition-colors hover:text-zinc-300"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-t border-zinc-800">
      <td className={CELL}>
        <div className="h-3 w-32 rounded bg-zinc-800" />
      </td>
      <td className={CELL}>
        <div className="h-4 w-16 rounded bg-zinc-800" />
      </td>
      <td className={cn(CELL, 'hidden sm:table-cell')}>
        <div className="h-3 w-10 rounded bg-zinc-800/60" />
      </td>
      <td className={cn(CELL, 'hidden md:table-cell')}>
        <div className="h-3 w-20 rounded bg-zinc-800/60" />
      </td>
      <td className={cn(CELL, 'hidden md:table-cell')}>
        <div className="h-3 w-20 rounded bg-zinc-800/60" />
      </td>
      <td className={CELL} />
    </tr>
  );
}

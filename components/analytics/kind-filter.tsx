import Link from 'next/link';
import { ANALYSIS_KIND_LABELS, ANALYSIS_KINDS } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { AnalysisKind } from '@/types/dto';

interface KindFilterProps {
  value: AnalysisKind | undefined;
  /** Builds the URL that selects a kind; `undefined` means "all kinds". */
  hrefFor: (kind: AnalysisKind | undefined) => string;
  /** Adds an "All" option that clears the filter. */
  allowAll?: boolean;
  className?: string;
}

/** Segmented control backed by links, so the selection lives in the URL and is shareable. */
export default function KindFilter({ value, hrefFor, allowAll = false, className }: KindFilterProps) {
  const options: { kind: AnalysisKind | undefined; label: string }[] = [
    ...(allowAll ? [{ kind: undefined, label: 'All' }] : []),
    ...ANALYSIS_KINDS.map((kind) => ({ kind, label: ANALYSIS_KIND_LABELS[kind] })),
  ];

  return (
    <nav
      aria-label="Complexity kind"
      className={cn('inline-flex rounded-lg border border-zinc-800 bg-zinc-900 p-0.5', className)}
    >
      {options.map(({ kind, label }) => {
        const active = kind === value;
        return (
          <Link
            key={label}
            href={hrefFor(kind)}
            replace
            scroll={false}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'rounded-md px-3 py-1 text-xs font-medium transition-colors',
              active ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

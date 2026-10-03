'use client';

import { useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import { UNTITLED_ANALYSIS } from '@/components/analytics/analyses-table';
import ComplexityBadge from '@/components/analytics/complexity-badge';
import QueryError from '@/components/analytics/query-error';
import CodeEditor from '@/components/ui/code-editor';
import { useApiQuery } from '@/hooks/use-api-query';
import { ANALYSIS_KIND_LABELS } from '@/lib/analytics';
import { getAnalysis } from '@/lib/api';
import { formatDateTime, formatDuration, parseApiDate } from '@/lib/format';
import { AnalysisDetailResult, SpatialAnalysisReport, TemporalAnalysisReport } from '@/types/dto';

const NOT_FOUND = 404;

// The stored code is a snapshot, so the editor is read-only and edits are discarded
const ignoreChange = () => {};

export default function AnalysisDetail({ id }: { id: string }) {
  const { data, error, errorStatus, reload } = useApiQuery(
    useCallback((signal) => getAnalysis(id, signal), [id]),
    'Could not load this analysis.'
  );

  return (
    <div className="h-full overflow-y-auto bg-zinc-950 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">
        <Link
          href="/analyses"
          className="flex w-fit items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300 max-lg:ml-12"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Analysis history
        </Link>

        {errorStatus === NOT_FOUND ? (
          <div className="flex flex-col items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-12 text-center">
            <FileQuestion className="h-5 w-5 text-zinc-600" />
            <p className="text-sm text-zinc-300">Analysis not found</p>
            <p className="text-xs text-zinc-500">It may have been removed, or it belongs to another account.</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <QueryError message={error} onRetry={reload} />
          </div>
        ) : data ? (
          <AnalysisContent analysis={data} />
        ) : (
          <DetailSkeleton />
        )}
      </div>
    </div>
  );
}

function AnalysisContent({ analysis }: { analysis: AnalysisDetailResult }) {
  return (
    <>
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="truncate font-mono text-lg font-semibold tracking-tight text-zinc-100">
          {analysis.title ?? UNTITLED_ANALYSIS}
        </h1>
        <ComplexityBadge
          notation={analysis.complexity}
          complexityClass={analysis.complexity_class}
          className="text-xs"
        />
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section
          aria-label="Analyzed code"
          className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 lg:col-span-2"
        >
          <CodeEditor
            value={analysis.code}
            onChange={ignoreChange}
            readOnly
            className="h-96 lg:h-[32rem]"
          />
        </section>

        <div className="flex flex-col gap-4">
          <DetailCard title="Overview">
            <Field label={`${ANALYSIS_KIND_LABELS[analysis.kind]} complexity`}>
              <span className="font-mono">{analysis.complexity}</span>
            </Field>
            <Field label="Growth class">{analysis.complexity_class.label}</Field>
            <Field label="Language">{analysis.language}</Field>
            <Field label="Analyzed">
              <time dateTime={parseApiDate(analysis.created_at).toISOString()}>
                {formatDateTime(analysis.created_at)}
              </time>
            </Field>
            <Field label="Engine time">
              {formatDuration(analysis.duration_ms)}
              {analysis.cached && <span className="ml-1.5 text-zinc-500">(cached)</span>}
            </Field>
            <Field label="AI explanation">{analysis.ai_explained ? 'Included' : 'Not requested'}</Field>
          </DetailCard>

          <DetailCard title="Report">
            {analysis.kind === 'temporal' ? (
              <TemporalReportFields report={analysis.report} />
            ) : (
              <SpatialReportFields report={analysis.report} />
            )}
            {analysis.report.recursion_kind && (
              <Field label="Recursion">{analysis.report.recursion_kind}</Field>
            )}
            {analysis.report.variables.length > 0 && (
              <Field label="Variables">
                <ul className="space-y-0.5 text-right">
                  {analysis.report.variables.map(({ symbol, source }) => (
                    <li key={symbol} className="font-mono">
                      {symbol} <span className="text-zinc-500">→ {source}</span>
                    </li>
                  ))}
                </ul>
              </Field>
            )}
          </DetailCard>
        </div>
      </div>
    </>
  );
}

function TemporalReportFields({ report }: { report: TemporalAnalysisReport }) {
  return (
    <>
      <Field label="Loops">{report.loop_count}</Field>
      <Field label="Max loop depth">{report.max_loop_depth}</Field>
      <Field label="Recursive">{report.recursive ? 'Yes' : 'No'}</Field>
    </>
  );
}

function SpatialReportFields({ report }: { report: SpatialAnalysisReport }) {
  return (
    <>
      <Field label="Total allocations">{report.total_allocations}</Field>
      <Field label="Lists / dicts / sets">
        {report.list_allocations} / {report.dict_allocations} / {report.set_allocations}
      </Field>
      <Field label="Comprehensions">{report.comprehensions}</Field>
      <Field label="Generator expressions">{report.generator_expressions}</Field>
      <Field label="Dynamic growth ops">{report.dynamic_growth_operations}</Field>
      <Field label="Recursive functions">{report.recursive_functions}</Field>
    </>
  );
}

function DetailCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h2 className="mb-3 text-[10px] font-medium uppercase tracking-widest text-zinc-500">{title}</h2>
      <dl className="space-y-2.5">{children}</dl>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 text-xs">
      <dt className="shrink-0 text-zinc-500">{label}</dt>
      <dd className="text-right text-zinc-200">{children}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading analysis" className="animate-pulse space-y-4">
      <div className="h-6 w-56 rounded bg-zinc-800" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="h-96 rounded-xl bg-zinc-900 lg:col-span-2 lg:h-[32rem]" />
        <div className="h-72 rounded-xl bg-zinc-900" />
      </div>
    </div>
  );
}

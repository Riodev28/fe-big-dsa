'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { parseAISummarySections } from '@/lib/ai-summary';

interface AISummaryGroupProps {
  temporal?: string;
  temporalTitle?: string;
  spatial?: string;
  spatialTitle?: string;
}

function AISummaryEntry({
  title,
  summary,
}: {
  title: string;
  summary?: string;
}) {
  const sections = summary ? parseAISummarySections(summary) : [];

  return (
    <div>
      <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
        {title}
      </p>

      {sections.length === 0 ? (
        <p className="text-xs leading-relaxed text-zinc-600 italic">
          Enable AI explanation and run the analysis to get a summary.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {sections.map(({ heading, body }, i) => (
            <div key={i}>
              <p className="mb-1 text-xs font-semibold text-zinc-200">{heading}</p>
              <p className="text-xs leading-relaxed text-zinc-400">{body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AISummaryGroup({
  temporal,
  temporalTitle = 'Temporal',
  spatial,
  spatialTitle = 'Spatial',
}: AISummaryGroupProps) {
  const [open, setOpen] = useState(false);
  const hasSummary = Boolean(temporal || spatial);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <Button
        variant="outline"
        className="w-full justify-start gap-2 text-zinc-300"
        disabled={!hasSummary}
        onClick={() => setOpen(true)}
      >
        <Sparkles className="h-3.5 w-3.5 text-violet-400" />
        AI Summary
      </Button>

      {!hasSummary && (
        <p className="mt-2 text-xs leading-relaxed text-zinc-600 italic">
          Enable AI explanation and run the analysis to get a summary.
        </p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" />
              AI Summary
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <AISummaryEntry title={temporalTitle} summary={temporal} />
            <Separator orientation="vertical" className="hidden sm:block" />
            <AISummaryEntry title={spatialTitle} summary={spatial} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

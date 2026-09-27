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
import { parseAISummarySections } from '@/lib/ai-summary';

const AISummary = ({ summary, title }: { summary?: string; title: string }) => {
  const [open, setOpen] = useState(false);
  const sections = summary ? parseAISummarySections(summary) : [];
  const hasSummary = sections.length > 0;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <Button
        variant="outline"
        className="w-full justify-start gap-2 text-zinc-300"
        disabled={!hasSummary}
        onClick={() => setOpen(true)}
      >
        <Sparkles className="h-3.5 w-3.5 text-violet-400" />
        {title}
      </Button>

      {!hasSummary && (
        <p className="mt-2 text-xs leading-relaxed text-zinc-600 italic">
          Enable AI explanation and run the analysis to get a summary.
        </p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" />
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {sections.map(({ heading, body }, i) => (
              <div key={i}>
                <p className="mb-1 text-xs font-semibold text-zinc-200">{heading}</p>
                <p className="text-xs leading-relaxed text-zinc-400">{body}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AISummary;

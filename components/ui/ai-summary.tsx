'use client';

import { Sparkles } from 'lucide-react';

interface Section {
  heading: string;
  body: string;
}

function parseSections(text: string): Section[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  const sections: Section[] = [];

  for (let i = 1; i < parts.length; i += 2) {
    const heading = parts[i].trim();
    const body = (parts[i + 1] ?? '').trim();
    if (heading) sections.push({ heading, body });
  }

  return sections;
}

const AISummary = ({ summary, title }: { summary?: string, title: string}) => {
  const sections = summary ? parseSections(summary) : [];

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-violet-400" />
        <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
          { title }
        </p>
      </div>

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
};

export default AISummary;

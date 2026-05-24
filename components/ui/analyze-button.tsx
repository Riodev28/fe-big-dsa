'use client';

import { Button } from '@/components/ui/button';
import { BrainCircuit, Calculator } from 'lucide-react';
import { FC, MouseEventHandler } from 'react';

interface AnalyzerButtonProps {
  loading: boolean;
  analyze: MouseEventHandler;
  toggleAI: MouseEventHandler;
  isAIActive: boolean;
}

const AnalyzeButton: FC<AnalyzerButtonProps> = ({
  loading,
  analyze,
  toggleAI,
  isAIActive
}) => {
  return (
    <div className="flex flex-col gap-3 border-t border-zinc-800 p-3 sm:grid sm:grid-cols-2">
      <Button
        onClick={analyze}
        disabled={loading}
        className="gap-2 bg-zinc-800 text-zinc-100 hover:bg-zinc-700 transition-colors duration-500"
        variant="secondary"
      >
        <Calculator className="h-4 w-4" />
        Analyze
      </Button>

      <Button
        onClick={toggleAI}
        disabled={loading}
        className={`gap-2 transition-all duration-500 ${isAIActive
          ? "bg-zinc-200 text-zinc-900 hover:bg-zinc-300"
          : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"}`}
        >
        <BrainCircuit className="h-4 w-4" />
        {isAIActive ? "AI active" : "Explanation with AI"}
      </Button>
    </div>
  );
};

export default AnalyzeButton;

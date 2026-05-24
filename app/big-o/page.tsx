'use client';

import { useState } from 'react';
import {
  analyzeTemporalComplexity,
} from '@/lib/api';
import CodeEditor from '@/components/ui/code-editor';
import AnalyzeButton from '@/components/ui/analyze-button';
import ComplexityDisplay from '@/components/ui/complexity-display';
import NotationChart from '@/components/ui/notation-chart';
import AISummary from '@/components/ui/ai-summary';
import EditorHeader from '@/components/ui/code-editor-header';
import { BigOAiResult } from '@/types/dto';
import { TemporalAnalysisPayload } from '@/types/request';

const EXAMPLE_CODE = `def twoSum(nums, target):
    map = {}

    for n, value in enumerate(nums):
        complement = target - value

        if complement in map:
            return [map[complement], n]

        map[value] = n
`;

const BigOPage = () => {
  const [code, setCode] = useState(EXAMPLE_CODE);
  const [explainAI, setAiExplain] = useState<boolean>(false)
  const [result, setResult] = useState<BigOAiResult>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runAnalysis() {
    setError(null);
    setResult(undefined);
    setLoading(true);
    try {
        setResult(await analyzeTemporalComplexity({code, explain_ai: explainAI} as TemporalAnalysisPayload));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const toggleAI = () => {
    setAiExplain(!explainAI)
  }

  const timeComplexity = result?.analysis.time_complexity ?? '—';

  /* const spaceComplexity = result?.analysis.space_complexity ?? '—'; */

  return (
    <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden bg-zinc-950 text-zinc-100 lg:flex-row lg:overflow-hidden flex-1 gap-4 p-4">
      <div className="flex flex-1 flex-col lg:overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 min-h-100">
        <EditorHeader />
        <CodeEditor value={code} onChange={setCode} />
        <AnalyzeButton
          loading={loading}
          analyze={() => runAnalysis()}
          toggleAI={() => toggleAI()}
          isAIActive={explainAI}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Right panel */}
      <div className="flex w-full lg:w-72 flex-col gap-4 lg:overflow-y-auto">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <ComplexityDisplay
            complexity={timeComplexity}
            space={"O(1)"} /* TODO: change hard code (service not exists yet) */
          />
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <NotationChart complexity={timeComplexity} />
        </div>
        <AISummary summary={result?.ai?.temporal_explanation} />
      </div>
    </div>
  );
};

export default BigOPage;

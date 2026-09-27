'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Trash2 } from 'lucide-react';
import {
  analyzeSpatialComplexity,
  analyzeTemporalComplexity,
  getFile,
  updateFile,
} from '@/lib/api';
import { getApiErrorMessage } from '@/lib/auth';
import CodeEditor from '@/components/ui/code-editor';
import AnalyzeButton from '@/components/ui/analyze-button';
import ComplexityDisplay from '@/components/ui/complexity-display';
import NotationChart from '@/components/ui/notation-chart';
import AISummaryGroup from '@/components/ui/ai-summary-group';
import EditorHeader from '@/components/ui/code-editor-header';
import SaveFileDialog from '@/components/ui/save-file-dialog';
import DeleteFileDialog from '@/components/ui/delete-file-dialog';
import { Button } from '@/components/ui/button';
import { useFiles } from '@/components/files-provider';
import { useUnsavedChangesGuard } from '@/components/unsaved-changes-provider';
import { SpatialAiResult, TemporalAiResult } from '@/types/dto';
import { SpatialAnalysisPayload, TemporalAnalysisPayload } from '@/types/request';

const EXAMPLE_CODE = `def twoSum(nums, target):
    map = {}

    for n, value in enumerate(nums):
        complement = target - value

        if complement in map:
            return [map[complement], n]

        map[value] = n
`;

interface BigOAnalyzerProps {
  /** When set, the file is fetched and loaded into the editor. */
  fileId?: string;
}

export default function BigOAnalyzer({ fileId }: BigOAnalyzerProps) {
  const [code, setCode] = useState(fileId ? '' : EXAMPLE_CODE);
  const [explainAI, setAiExplain] = useState<boolean>(false)
  const [temporalResult, setTemporalResult] = useState<TemporalAiResult>();
  const [spatialResult, setSpatialResult] = useState<SpatialAiResult>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [fileTitle, setFileTitle] = useState<string>();
  const [fileLoading, setFileLoading] = useState(Boolean(fileId));
  const [fileError, setFileError] = useState<string | null>(null);
  // Last persisted version of the opened file, used to detect unsaved changes.
  const [savedFile, setSavedFile] = useState<{ title: string; content: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { addFile, replaceFile } = useFiles();
  const router = useRouter();

  // Compared against the last save; a never-saved new file counts as dirty once the example is edited.
  const isDirty = savedFile
    ? code !== savedFile.content || fileTitle !== savedFile.title
    : !fileId && code !== EXAMPLE_CODE;
  const canSave = fileId
    ? isDirty && !saving && Boolean(fileTitle?.trim())
    : !fileLoading;

  useUnsavedChangesGuard(isDirty);

  // The parent keys this component by fileId, so state starts fresh for every file.
  useEffect(() => {
    if (!fileId) return;

    let ignore = false;
    getFile(fileId)
      .then((file) => {
        if (ignore) return;
        setCode(file.content);
        setFileTitle(file.title);
        setSavedFile({ title: file.title, content: file.content });
      })
      .catch((err) => {
        if (!ignore) setFileError(getApiErrorMessage(err, 'Could not open this file.'));
      })
      .finally(() => {
        if (!ignore) setFileLoading(false);
      });

    return () => {
      ignore = true;
    }
  }, [fileId]);

  async function saveChanges(id: string) {
    const title = fileTitle?.trim();
    if (!title) return;

    setError(null);
    setSaving(true);
    try {
      const updated = await updateFile(id, { title, content: code });
      setFileTitle(updated.title);
      setSavedFile({ title: updated.title, content: updated.content });
      replaceFile(id, updated);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not save your changes.'));
    } finally {
      setSaving(false);
    }
  }

  // Opened files are updated in place; new files ask for a name first.
  function requestSave() {
    if (!canSave) return;
    if (fileId) {
      saveChanges(fileId);
    } else {
      setSaveOpen(true);
    }
  }

  // Keeps the shortcut listener stable while always calling the latest requestSave.
  const requestSaveRef = useRef(requestSave);
  useEffect(() => {
    requestSaveRef.current = requestSave;
  });

  // Ctrl/Cmd + S saves instead of triggering the browser's "Save page".
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        requestSaveRef.current();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  async function runAnalysis() {
    setError(null);
    setTemporalResult(undefined);
    setSpatialResult(undefined);
    setLoading(true);
    try {
        setTemporalResult(await analyzeTemporalComplexity({code, explain_ai: explainAI} as TemporalAnalysisPayload));
        setSpatialResult(await analyzeSpatialComplexity({code, explain_ai: explainAI} as SpatialAnalysisPayload))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const toggleAI = () => {
    setAiExplain(!explainAI)
  }

  const timeComplexity = temporalResult?.analysis.time_complexity ?? '—';

  const spaceComplexity = spatialResult?.analysis.space_complexity ?? '—';

  return (
    <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden bg-zinc-950 text-zinc-100 lg:flex-row lg:overflow-hidden flex-1 gap-4 p-4">
      <div className="flex flex-1 flex-col lg:overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 min-h-100">
        <EditorHeader filename={fileTitle} onFilenameChange={setFileTitle} dirty={isDirty}>
          <Button
            size="sm"
            variant="ghost"
            onClick={requestSave}
            disabled={!canSave}
            title={fileId ? 'Save changes (Ctrl+S)' : 'Save file (Ctrl+S)'}
            className="text-zinc-400 hover:text-zinc-100"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save />}
            {saving ? 'Saving…' : 'Save'}
          </Button>
          {fileId && savedFile && (
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setDeleteOpen(true)}
              disabled={saving}
              aria-label="Delete file"
              title="Delete file"
              className="text-zinc-400 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 />
            </Button>
          )}
        </EditorHeader>
        {fileError ? (
          <div
            role="alert"
            className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center"
          >
            <p className="text-sm text-destructive">{fileError}</p>
            <Button asChild size="sm" variant="outline">
              <Link href="/big-o">Start a new file</Link>
            </Button>
          </div>
        ) : (
          <div className="relative flex flex-1 flex-col min-h-0">
            <CodeEditor value={code} onChange={setCode} readOnly={fileLoading} />
            {fileLoading && (
              <div
                aria-live="polite"
                className="absolute inset-0 flex items-center justify-center gap-2 bg-zinc-900/80 text-sm text-muted-foreground"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Opening file…
              </div>
            )}
          </div>
        )}
        <AnalyzeButton
          loading={loading || fileLoading || Boolean(fileError)}
          analyze={() => runAnalysis()}
          toggleAI={() => toggleAI()}
          isAIActive={explainAI}
        />
      </div>

      {fileId && savedFile && (
        <DeleteFileDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          file={{ id: fileId, title: savedFile.title }}
          onDeleted={() => router.replace('/big-o')}
        />
      )}

      <SaveFileDialog
        open={saveOpen}
        onOpenChange={setSaveOpen}
        content={code}
        defaultTitle={fileTitle}
        onSaved={(file) => {
          setFileTitle(file.title);
          setSavedFile({ title: file.title, content: file.content });
          addFile(file);
        }}
      />

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
            space={spaceComplexity}
          />
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <NotationChart complexity={timeComplexity} />
        </div>
        <AISummaryGroup
          temporal={temporalResult?.ai?.temporal_explanation}
          temporalTitle="Temporal AI Summary"
          spatial={spatialResult?.ai?.spatial_explanation}
          spatialTitle="Spatial AI Summary"
        />
      </div>
    </div>
  );
}

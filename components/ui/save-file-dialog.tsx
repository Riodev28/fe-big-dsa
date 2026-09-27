'use client';

import { useState, type SubmitEvent } from 'react';
import { Loader2, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Label from '@/components/label';
import { saveFile } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/auth';
import { FileResult } from '@/types/dto';

// Mirrors FileModel.title max_length in the backend.
const TITLE_MAX_LENGTH = 100;

interface SaveFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  defaultTitle?: string;
  onSaved?: (file: FileResult) => void;
}

export default function SaveFileDialog({
  open,
  onOpenChange,
  content,
  defaultTitle = '',
  onSaved,
}: SaveFileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save file</DialogTitle>
          <DialogDescription>
            Store the current editor content in your files.
          </DialogDescription>
        </DialogHeader>

        {/* Rendered inside DialogContent so its state resets every time the dialog opens. */}
        <SaveFileForm
          content={content}
          defaultTitle={defaultTitle}
          onCancel={() => onOpenChange(false)}
          onSaved={(file) => {
            onSaved?.(file);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

interface SaveFileFormProps {
  content: string;
  defaultTitle: string;
  onCancel: () => void;
  onSaved: (file: FileResult) => void;
}

function SaveFileForm({ content, defaultTitle, onCancel, onSaved }: SaveFileFormProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const trimmedTitle = title.trim();
  const isEmptyContent = content.trim().length === 0;
  const canSubmit = trimmedTitle.length > 0 && !isEmptyContent && !loading;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setLoading(true);
    try {
      onSaved(await saveFile({ title: trimmedTitle, content }));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not save the file. Try again.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="file-title">File name</Label>
        <Input
          id="file-title"
          autoFocus
          autoComplete="off"
          spellCheck={false}
          maxLength={TITLE_MAX_LENGTH}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="two_sum.py"
          className="font-mono"
        />
        <p className="text-right text-xs text-muted-foreground tabular-nums">
          {title.length}/{TITLE_MAX_LENGTH}
        </p>
      </div>

      {isEmptyContent && (
        <p className="text-sm text-muted-foreground">
          The editor is empty — write some code before saving.
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          {loading ? <Loader2 className="animate-spin" /> : <Save />}
          {loading ? 'Saving…' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  );
}

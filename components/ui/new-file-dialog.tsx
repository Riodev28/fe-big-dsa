'use client';

import { useState, type SubmitEvent } from 'react';
import { FilePlus, Loader2 } from 'lucide-react';
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
import { FILE_TITLE_MAX_LENGTH } from '@/consts/file';

interface NewFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (file: FileResult) => void;
}

export default function NewFileDialog({ open, onOpenChange, onCreated }: NewFileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New file</DialogTitle>
          <DialogDescription>Create an empty file and open it in the editor.</DialogDescription>
        </DialogHeader>

        {/* Rendered inside DialogContent so its state resets every time the dialog opens. */}
        <NewFileForm
          onCancel={() => onOpenChange(false)}
          onCreated={(file) => {
            onOpenChange(false);
            onCreated?.(file);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

interface NewFileFormProps {
  onCancel: () => void;
  onCreated: (file: FileResult) => void;
}

function NewFileForm({ onCancel, onCreated }: NewFileFormProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const trimmedTitle = title.trim();
  const canSubmit = trimmedTitle.length > 0 && !loading;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setLoading(true);
    try {
      onCreated(await saveFile({ title: trimmedTitle, content: '' }));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not create the file. Try again.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="new-file-title">File name</Label>
        <Input
          id="new-file-title"
          autoFocus
          autoComplete="off"
          spellCheck={false}
          maxLength={FILE_TITLE_MAX_LENGTH}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="binary_search.py"
          className="font-mono"
        />
        <p className="text-right text-xs text-muted-foreground tabular-nums">
          {title.length}/{FILE_TITLE_MAX_LENGTH}
        </p>
      </div>

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
          {loading ? <Loader2 className="animate-spin" /> : <FilePlus />}
          {loading ? 'Creating…' : 'Create'}
        </Button>
      </DialogFooter>
    </form>
  );
}

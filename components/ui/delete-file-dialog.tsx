'use client';

import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFiles } from '@/components/files-provider';
import { deleteFile } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/auth';

interface DeleteFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: { id: string; title: string } | null;
  onDeleted?: (id: string) => void;
}

export default function DeleteFileDialog({
  open,
  onOpenChange,
  file,
  onDeleted,
}: DeleteFileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete file?</DialogTitle>
          <DialogDescription>
            <span className="font-mono text-foreground">{file?.title}</span> will be
            permanently deleted. This can’t be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Rendered inside DialogContent so its state resets every time the dialog opens. */}
        {file && (
          <DeleteFileActions
            file={file}
            onCancel={() => onOpenChange(false)}
            onDeleted={(id) => {
              onOpenChange(false);
              onDeleted?.(id);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface DeleteFileActionsProps {
  file: { id: string; title: string };
  onCancel: () => void;
  onDeleted: (id: string) => void;
}

function DeleteFileActions({ file, onCancel, onDeleted }: DeleteFileActionsProps) {
  const { removeFile } = useFiles();
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setError(null);
    setDeleting(true);
    try {
      await deleteFile(file.id);
      removeFile(file.id);
      onDeleted(file.id);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not delete the file. Try again.'));
      setDeleting(false);
    }
  }

  return (
    <>
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <DialogFooter>
        <Button variant="ghost" onClick={onCancel} disabled={deleting}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
          {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
          {deleting ? 'Deleting…' : 'Delete'}
        </Button>
      </DialogFooter>
    </>
  );
}

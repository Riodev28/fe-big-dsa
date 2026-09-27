'use client';

import { useState, type KeyboardEvent } from 'react';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mirrors FileModel.title max_length in the backend.
const FILENAME_MAX_LENGTH = 100;

interface EditableFilenameProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function EditableFilename({ value, onChange, className }: EditableFilenameProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function startEditing() {
    setDraft(value);
    setEditing(true);
  }

  function commit() {
    const next = draft.trim();
    if (next && next !== value) onChange(next);
    setEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      commit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <input
        data-slot="editable-filename"
        aria-label="File name"
        autoFocus
        spellCheck={false}
        maxLength={FILENAME_MAX_LENGTH}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onFocus={(event) => event.target.select()}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className={cn(
          'min-w-0 rounded-sm border border-ring bg-transparent px-1 font-mono text-xs text-foreground outline-none',
          className
        )}
        style={{ width: `${Math.max(draft.length, 8) + 2}ch` }}
      />
    );
  }

  return (
    <button
      type="button"
      data-slot="editable-filename"
      onClick={startEditing}
      title="Rename file"
      className={cn(
        'group/filename flex min-w-0 items-center gap-1.5 rounded-sm border border-transparent px-1 font-mono text-xs text-muted-foreground transition-colors hover:cursor-text hover:border-border hover:text-foreground focus-visible:border-ring focus-visible:outline-none',
        className
      )}
    >
      <span className="truncate">{value}</span>
      <Pencil className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover/filename:opacity-100 group-focus-visible/filename:opacity-100" />
    </button>
  );
}

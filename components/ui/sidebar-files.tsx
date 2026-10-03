'use client';

import { useState } from 'react';
import GuardedLink from '@/components/guarded-link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FileCode, FolderOpen, Plus, RotateCw, Trash2 } from 'lucide-react';
import { useFiles } from '@/components/files-provider';
import { useUnsavedChanges } from '@/components/unsaved-changes-provider';
import DeleteFileDialog from '@/components/ui/delete-file-dialog';
import NewFileDialog from '@/components/ui/new-file-dialog';
import { cn } from '@/lib/utils';
import { FileResult } from '@/types/dto';

const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
];

function formatRelative(isoDate: string): string {
  const seconds = (new Date(isoDate).getTime() - Date.now()) / 1000;
  for (const [unit, unitSeconds] of TIME_UNITS) {
    if (Math.abs(seconds) >= unitSeconds) {
      return relativeTime.format(Math.round(seconds / unitSeconds), unit);
    }
  }
  return 'just now';
}

// Freshly created files may not carry an id yet, so fall back to title + creation time.
function fileKey(file: FileResult): string {
  return file.id ?? `${file.title}-${file.created_at}`;
}

function fileHref(id: string): string {
  return `/big-o?file=${encodeURIComponent(id)}`;
}

// Matches the sidebar nav items so "New file" reads as a primary action, not a header icon
const NEW_FILE_BUTTON_CLASS =
  'flex items-center rounded-md border border-transparent px-2.5 py-2 text-sm text-zinc-500 transition-colors hover:cursor-pointer hover:border-zinc-800 hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50';

const ITEM_CLASS =
  'flex flex-col rounded-md border px-2.5 py-1.5 transition-colors';

interface SidebarFilesProps {
  collapsed?: boolean;
  className?: string;
  /** Called when a file is opened, e.g. to close the mobile drawer. */
  onNavigate?: () => void;
}

export default function SidebarFiles({
  collapsed = false,
  className,
  onNavigate,
}: SidebarFilesProps) {
  const { files, loading, error, refresh, addFile } = useFiles();
  const { requestLeave } = useUnsavedChanges();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeFileId = pathname === '/big-o' ? searchParams.get('file') : null;
  // Target is kept separate from `open` so the dialog text survives its close animation.
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newFileOpen, setNewFileOpen] = useState(false);

  function confirmDelete(target: { id: string; title: string }) {
    setDeleteTarget(target);
    setDeleteOpen(true);
  }

  function handleDeleted(id: string) {
    // The open file no longer exists, so fall back to a fresh editor.
    if (id === activeFileId) router.replace('/big-o');
  }

  function handleCreated(file: FileResult) {
    addFile(file);
    if (!file.id) return;

    const href = fileHref(file.id);
    const openFile = () => {
      router.push(href);
      onNavigate?.();
    };
    // The new file is already listed, so declining to discard unsaved edits just keeps the current editor.
    if (requestLeave(openFile)) openFile();
  }

  const newFileDialog = (
    <NewFileDialog open={newFileOpen} onOpenChange={setNewFileOpen} onCreated={handleCreated} />
  );

  if (collapsed) {
    return (
      <div
        data-slot="sidebar-files"
        className={cn('flex flex-col items-center gap-1 py-2 text-muted-foreground', className)}
      >
        <span title={`Your files (${files.length})`} className="p-1">
          <FileCode className="h-4 w-4" />
        </span>
        <button
          type="button"
          onClick={() => setNewFileOpen(true)}
          aria-label="New file"
          title="New file"
          className={cn(NEW_FILE_BUTTON_CLASS, 'justify-center')}
        >
          <Plus className="h-4 w-4 shrink-0" />
        </button>
        {newFileDialog}
      </div>
    );
  }

  return (
    <section
      data-slot="sidebar-files"
      aria-labelledby="sidebar-files-heading"
      className={cn('flex min-h-0 flex-col', className)}
    >
      <div className="flex items-center gap-2.5 px-2.5 py-2">
        <FileCode className="h-4 w-4 shrink-0 text-muted-foreground" />
        <h2
          id="sidebar-files-heading"
          className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
        >
          Your files
        </h2>
        {!loading && files.length > 0 && (
          <span className="ml-auto rounded-full bg-muted px-1.5 text-[10px] font-medium text-muted-foreground tabular-nums">
            {files.length}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => setNewFileOpen(true)}
        className={cn(NEW_FILE_BUTTON_CLASS, 'mb-1 gap-2.5')}
      >
        <Plus className="h-4 w-4 shrink-0" />
        New file
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading && files.length === 0 ? (
          <FilesSkeleton />
        ) : error ? (
          <div role="alert" className="flex flex-col gap-2 px-2.5 py-2 text-xs">
            <p className="text-destructive">{error}</p>
            <button
              onClick={refresh}
              className="flex w-fit items-center gap-1.5 text-muted-foreground transition-colors hover:cursor-pointer hover:text-foreground"
            >
              <RotateCw className="h-3 w-3" />
              Try again
            </button>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 px-2.5 py-6 text-center">
            <FolderOpen className="h-5 w-5 text-muted-foreground/60" />
            <p className="text-xs text-muted-foreground">No files yet</p>
            <p className="text-[11px] text-muted-foreground/70">
              Create a new file, or save code from the editor.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {files.map((file) => {
              const { id } = file;
              const isActive = id !== null && id === activeFileId;
              const body = (
                <>
                  <span
                    className={cn(
                      'truncate font-mono text-xs',
                      isActive ? 'text-foreground' : 'text-foreground/80'
                    )}
                  >
                    {file.title}
                  </span>
                  <time
                    dateTime={file.updated_at ?? file.created_at}
                    className="text-[11px] text-muted-foreground"
                  >
                    {formatRelative(file.updated_at ?? file.created_at)}
                  </time>
                </>
              );

              return (
                <li key={fileKey(file)} className="group/file relative">
                  {file.id ? (
                    <GuardedLink
                      href={fileHref(file.id)}
                      title={file.title}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={onNavigate}
                      className={cn(
                        ITEM_CLASS,
                        'pr-8',
                        isActive
                          ? 'border-border bg-muted/60'
                          : 'border-transparent hover:border-border hover:bg-muted/40'
                      )}
                    >
                      {body}
                    </GuardedLink>
                  ) : (
                    <div title={file.title} className={cn(ITEM_CLASS, 'border-transparent opacity-70')}>
                      {body}
                    </div>
                  )}
                  {id && (
                    <button
                      type="button"
                      onClick={() => confirmDelete({ id, title: file.title })}
                      aria-label={`Delete ${file.title}`}
                      title="Delete file"
                      className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity group-hover/file:opacity-100 group-focus-within/file:opacity-100 hover:cursor-pointer hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 max-lg:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <DeleteFileDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        file={deleteTarget}
        onDeleted={handleDeleted}
      />
      {newFileDialog}
    </section>
  );
}

function FilesSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading files" className="flex flex-col gap-2 px-2.5 py-1.5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex animate-pulse flex-col gap-1.5">
          <div className="h-3 w-3/4 rounded bg-muted" />
          <div className="h-2.5 w-1/3 rounded bg-muted/60" />
        </div>
      ))}
    </div>
  );
}

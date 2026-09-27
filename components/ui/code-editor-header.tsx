import { FC, ReactNode } from 'react';
import { Badge } from './badge';
import { Separator } from './separator';
import EditableFilename from './editable-filename';

interface EditorHeaderProps {
  filename?: string;
  onFilenameChange?: (filename: string) => void;
  /** Shows an unsaved-changes indicator next to the filename. */
  dirty?: boolean;
  children?: ReactNode;
}

const EditorHeader: FC<EditorHeaderProps> = ({
  filename = 'complexity_analyzer.py',
  onFilenameChange,
  dirty = false,
  children,
}) => {
  return (
    <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2.5">
      <div className="flex gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-red-700" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-700" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-700" />
      </div>
      <Separator orientation="vertical" className="mx-1 h-4 bg-zinc-700" />
      {onFilenameChange ? (
        <EditableFilename value={filename} onChange={onFilenameChange} />
      ) : (
        <span className="truncate font-mono text-xs text-zinc-400">{filename}</span>
      )}
      {dirty && (
        <span
          role="status"
          aria-label="Unsaved changes"
          title="Unsaved changes"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"
        />
      )}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <Badge
          variant="outline"
          className="hidden border-zinc-700 font-mono text-[10px] text-zinc-500 sm:inline-flex"
        >
          PYTHON 3 UTF-8
        </Badge>
        {children}
      </div>
    </div>
  );
};

export default EditorHeader;

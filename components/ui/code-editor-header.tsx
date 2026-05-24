import { FC } from 'react';
import { Badge } from './badge';
import { Separator } from './separator';

const EditorHeader: FC<{ filename?: string }> = ({
  filename = 'complexity_analyzer.ts',
}) => {
  return (
    <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2.5">
      <div className="flex gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-red-700" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-700" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-700" />
      </div>
      <Separator orientation="vertical" className="mx-1 h-4 bg-zinc-700" />
      <span className="font-mono text-xs text-zinc-400">{filename}</span>
      <Badge
        variant="outline"
        className="ml-auto border-zinc-700 font-mono text-[10px] text-zinc-500"
      >
        PYTHON 3 UTF-8
      </Badge>
    </div>
  );
};

export default EditorHeader;

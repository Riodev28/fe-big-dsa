import { RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QueryErrorProps {
  message: string;
  onRetry: () => void;
  className?: string;
}

export default function QueryError({ message, onRetry, className }: QueryErrorProps) {
  return (
    <div role="alert" className={cn('flex flex-col items-start gap-2 text-xs', className)}>
      <p className="text-destructive">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-1.5 text-zinc-500 transition-colors hover:cursor-pointer hover:text-zinc-300"
      >
        <RotateCw className="h-3 w-3" />
        Try again
      </button>
    </div>
  );
}

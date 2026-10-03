'use client';

import { FC } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

const ErrorAlert: FC<ErrorAlertProps> = ({ message, onDismiss }) => {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-md border border-red-900/60 bg-red-950/40 p-3 text-xs text-red-300"
    >
      <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0 text-red-400" />
      <p className="flex-1 break-words leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss error"
        className="shrink-0 text-red-400/60 transition-colors hover:text-red-300"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default ErrorAlert;

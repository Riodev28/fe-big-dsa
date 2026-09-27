'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getFiles } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/auth';
import { FileResult } from '@/types/dto';

interface FilesContextValue {
  files: FileResult[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addFile: (file: FileResult) => void;
  replaceFile: (id: string, file: FileResult) => void;
  removeFile: (id: string) => void;
}

const FilesContext = createContext<FilesContextValue | null>(null);

function lastModified(file: FileResult): number {
  return new Date(file.updated_at ?? file.created_at).getTime();
}

function sortByMostRecent(files: FileResult[]): FileResult[] {
  return [...files].sort((a, b) => lastModified(b) - lastModified(a));
}

export function FilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      setFiles(sortByMostRecent(await getFiles()));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load your files.'));
    } finally {
      setLoading(false);
    }
  }, []);

  const addFile = useCallback((file: FileResult) => {
    setFiles((prev) => sortByMostRecent([file, ...prev]));
  }, []);

  const replaceFile = useCallback((id: string, file: FileResult) => {
    // Keep the known id: the update response may not include it.
    setFiles((prev) =>
      sortByMostRecent(prev.map((current) => (current.id === id ? { ...file, id } : current)))
    );
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  }, []);

  // The auth token lives in localStorage, so files can only be fetched on the client.
  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ files, loading, error, refresh, addFile, replaceFile, removeFile }),
    [files, loading, error, refresh, addFile, replaceFile, removeFile]
  );

  return <FilesContext.Provider value={value}>{children}</FilesContext.Provider>;
}

export function useFiles(): FilesContextValue {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
}

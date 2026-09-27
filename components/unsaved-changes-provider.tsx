'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UnsavedChangesContextValue {
  setDirty: (dirty: boolean) => void;
  /**
   * Returns true when it is safe to leave right away (the caller navigates itself).
   * Otherwise opens the confirmation dialog, returns false, and runs `onDiscard` only if the
   * user chooses to discard their changes.
   */
  requestLeave: (onDiscard: () => void) => boolean;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null);

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  // A ref, not state: toggling it on every keystroke must not re-render the whole app.
  const dirtyRef = useRef(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const setDirty = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);

  const requestLeave = useCallback((onDiscard: () => void) => {
    if (!dirtyRef.current) return true;

    setPendingNavigation(() => onDiscard);
    setDialogOpen(true);
    return false;
  }, []);

  // Closing the tab, reloading or leaving the site: only the browser's native prompt is allowed here.
  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirtyRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  function discardAndLeave() {
    dirtyRef.current = false;
    setDialogOpen(false);
    pendingNavigation?.();
  }

  const value = useMemo(() => ({ setDirty, requestLeave }), [setDirty, requestLeave]);

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Discard unsaved changes?</DialogTitle>
            <DialogDescription>
              You have changes that haven’t been saved. If you leave now, they’ll be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} autoFocus>
              Keep editing
            </Button>
            <Button variant="destructive" onClick={discardAndLeave}>
              Discard changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges(): UnsavedChangesContextValue {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error('useUnsavedChanges must be used within an UnsavedChangesProvider');
  }
  return context;
}

/** Marks the current screen as having unsaved work while `dirty` is true. */
export function useUnsavedChangesGuard(dirty: boolean) {
  const { setDirty } = useUnsavedChanges();

  useEffect(() => {
    setDirty(dirty);
  }, [dirty, setDirty]);

  // Leaving the screen (e.g. after discarding) must not keep blocking navigation.
  useEffect(() => () => setDirty(false), [setDirty]);
}

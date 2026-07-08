'use client';

import { LogOut, Mail, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { clearAuthToken, getApiErrorMessage } from '@/lib/auth';
import { me as fetchMe } from '@/lib/api';
import { UserPayload } from '@/types/request';
import { useEffect, useState } from 'react';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserDialog({ open, onOpenChange }: UserDialogProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleLogout() {
    clearAuthToken();
    onOpenChange(false);
    router.push('/auth/login');
  }

  async function me() {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchMe();
      setUser(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Error to get user detail'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      me();
    }
  }, [open]);

  const initials = user?.username
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-zinc-100">
              {initials}
            </div>
            <div>
              <DialogTitle>{user?.username}</DialogTitle>
              <DialogDescription>{user?.email}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2 text-zinc-400">
          <div className="flex items-center gap-2.5">
            <UserIcon className="h-4 w-4 shrink-0" />
            <span>{loading ? 'Loading…' : user?.username}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 shrink-0" />
            <span>{loading ? 'Loading…' : user?.email}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

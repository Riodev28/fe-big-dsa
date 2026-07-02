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
import { clearAuthToken } from '@/lib/auth';

// TODO: replace with the authenticated user (GET /me) once wired up
const MOCK_USER = {
  name: 'Rio Developer',
  email: 'riodev28@gmail.com',
};

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserDialog({ open, onOpenChange }: UserDialogProps) {
  const router = useRouter();

  function handleLogout() {
    clearAuthToken();
    onOpenChange(false);
    router.push('/auth/login');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-zinc-100">
              {MOCK_USER.name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <DialogTitle>{MOCK_USER.name}</DialogTitle>
              <DialogDescription>{MOCK_USER.email}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="flex flex-col gap-2 text-zinc-400">
          <div className="flex items-center gap-2.5">
            <UserIcon className="h-4 w-4 shrink-0" />
            <span>{MOCK_USER.name}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 shrink-0" />
            <span>{MOCK_USER.email}</span>
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

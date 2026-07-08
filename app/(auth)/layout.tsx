import { GitBranch } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-950 px-4 py-12">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-100">
          <GitBranch className="h-4 w-4 text-zinc-900" />
        </div>
        <p className="text-sm font-semibold tracking-tight text-zinc-100">BigDSA</p>
      </div>
      {children}
    </div>
  );
}

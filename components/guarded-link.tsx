'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';
import { useUnsavedChanges } from '@/components/unsaved-changes-provider';

type GuardedLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

function opensElsewhere(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

/** A `next/link` that asks before leaving a screen with unsaved changes. */
export default function GuardedLink({ href, onClick, ...props }: GuardedLinkProps) {
  const router = useRouter();
  const { requestLeave } = useUnsavedChanges();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    // New tabs/windows keep the current page, and re-clicking the current URL goes nowhere.
    if (event.defaultPrevented || opensElsewhere(event)) return;
    if (href === window.location.pathname + window.location.search) return;

    if (!requestLeave(() => router.push(href))) {
      event.preventDefault();
    }
  }

  return <Link href={href} onClick={handleClick} {...props} />;
}

'use client';

import {
  FlaskConical,
  GitBranch,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: FlaskConical, label: 'Big-O Analyzer', href: '/big-o' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (!e.matches) setMobileOpen(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Close drawer on navigation
  useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [pathName, isMobile]);

  const navContent = (mobile = false) => (
    <>
      {/* Logo + toggle */}
      <div
        className={`mb-8 flex items-center ${
          !mobile && collapsed ? 'justify-center' : 'justify-between px-2'
        }`}
      >
        <div className="flex items-center gap-2">
          {(mobile || !collapsed) && (
          <div className='flex items-center gap-2'>
            <div className="flex h-7 w-7 gap-25 shrink-0 items-center justify-center rounded-md bg-zinc-100">
              <GitBranch className="h-4 w-4 text-zinc-900" />
            </div>
            <p className="text-sm font-semibold tracking-tight text-zinc-100">BigDSA</p>
          </div>
          )}
        </div>

        {mobile ? (
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="rounded-md p-3 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-300 hover:cursor-pointer"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = pathName === href;
          return (
            <Link
              href={href}
              key={label}
              title={!mobile && collapsed ? label : undefined}
              className={`flex items-center rounded-md px-2.5 py-2 text-sm transition-colors ${
                !mobile && collapsed ? 'justify-center' : 'gap-2.5'
              } ${
                isActive
                  ? 'border border-zinc-800 bg-zinc-900/60 text-zinc-100'
                  : 'text-zinc-500 border border-transparent hover:border-zinc-800 hover:text-zinc-300'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {(mobile || !collapsed) && label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto">
        <Separator className="mb-4 bg-zinc-800" />
        <div className="flex flex-col gap-1">
          <button
            title={!mobile && collapsed ? 'Profile' : undefined}
            className={`flex items-center rounded-md px-2.5 py-2 text-sm text-zinc-500 transition-colors border border-transparent hover:border-zinc-800 hover:text-zinc-300 hover:cursor-pointer ${
              !mobile && collapsed ? 'justify-center' : 'gap-2.5'
            }`}
          >
            <User className="h-4 w-4 shrink-0" />
            {(mobile || !collapsed) && 'Profile'}
          </button>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Hamburger trigger */}
        {!mobileOpen && (
          <button
            onClick={() => setMobileOpen(true)}
            className="fixed left-4 top-4 z-40 rounded-md border bg-zinc-900 p-2 text-zinc-400 shadow-lg transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        {/* Backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Drawer */}
        <aside
          className={`fixed left-0 top-0 z-50 flex h-screen w-full flex-col border-zinc-800 bg-linear-to-r from-zinc-950/50 to-transparent px-3 py-5 transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {navContent(true)}
        </aside>
      </>
    );
  }

  return (
    <aside
      className={`flex h-screen flex-col border-r border-zinc-800 bg-zinc-950 py-5 transition-all duration-300 ${
        collapsed ? 'w-14 px-2' : 'w-56 px-3'
      }`}
    >
      {navContent(false)}
    </aside>
  );
};

export default Sidebar;

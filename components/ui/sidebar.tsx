'use client';

import {
  FlaskConical,
  GitBranch,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS = [
  { icon: FlaskConical, label: 'Big-O Analyzer', href: '/big-o' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathName = usePathname();

  return (
    <aside
      className={`flex h-screen flex-col border-r border-zinc-800 bg-zinc-950 py-5 transition-all duration-300 ${
        collapsed ? 'w-14 px-2' : 'w-56 px-3'
      }`}
    >
      {/* Logo + toggle */}
      <div className={`mb-8 flex items-center ${collapsed ? 'justify-center' : 'justify-between px-2'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-100">
              <GitBranch className="h-4 w-4 text-zinc-900" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-zinc-100">BigDSA</p>
              <p className="text-[10px] text-zinc-500">v1.0.4-beta</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className="rounded-md p-3 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-300 hover:cursor-pointer"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = pathName === href;
          return (
            <Link
              href={href}
              key={label}
              title={collapsed ? label : undefined}
              className={`flex items-center rounded-md px-2.5 py-2 text-sm transition-colors ${
                collapsed ? 'justify-center' : 'gap-2.5'
              } ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto">
        <Separator className="mb-4 bg-zinc-800" />

        <div className="flex flex-col gap-1">
          <button
            title={collapsed ? 'Profile' : undefined}
            className={`flex items-center rounded-md px-2.5 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-300 hover:cursor-pointer ${collapsed ? 'justify-center' : 'gap-2.5'}`}
          >
            <User className="h-4 w-4 shrink-0" />
            {!collapsed && 'Profile'}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

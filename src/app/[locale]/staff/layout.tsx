'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const STAFF_ROLES = ['admin', 'super_admin', 'research_staff'];

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const locale = pathname.split('/')[1] || 'en';

  const navItems: NavItem[] = [
    {
      href: `/${locale}/staff`,
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: `/${locale}/staff/modules`,
      label: 'Modules',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      href: `/${locale}/staff/users`,
      label: 'Users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: `/${locale}/staff/settings`,
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push(`/${locale}/auth/login`);
      return;
    }

    if (!STAFF_ROLES.includes(session.user.role)) {
      router.push(`/${locale}/dashboard`);
    }
  }, [session, status, router, locale]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session?.user || !STAFF_ROLES.includes(session.user.role)) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === `/${locale}/staff`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">Staff Portal</h1>
            <p className="text-sm text-gray-500 mt-1">CHOP ETA Platform</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive(item.href) && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <div className="mb-4 px-4">
              <p className="text-sm font-medium text-gray-900">
                {session.user.name || session.user.email}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {session.user.role.replace('_', ' ')}
              </p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      <main className="lg:pl-64">
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

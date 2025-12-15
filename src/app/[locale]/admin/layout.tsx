'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FlaskConical, 
  BarChart3, 
  Download, 
  Settings,
  ChevronLeft,
  Shield
} from 'lucide-react';

const ADMIN_ROLES = ['coach', 'chop_admin', 'chop_researcher', 'site_admin'] as const;

function isAdminRole(role: string | undefined): boolean {
  return role ? ADMIN_ROLES.includes(role as any) : false;
}

function getRoleTranslationKey(role: string): string {
  const roleMap: Record<string, string> = {
    'parent': 'roles.parent',
    'teen': 'roles.teen',
    'professional': 'roles.professional',
    'coach': 'roles.coach',
    'chop_admin': 'roles.chopAdmin',
    'chop_researcher': 'roles.chopResearcher',
    'site_admin': 'roles.siteAdmin',
  };
  return roleMap[role] || 'roles.parent';
}

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ReactNode;
  roles?: readonly string[];
}

const navItems: NavItem[] = [
  { href: '/admin', labelKey: 'admin.dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/admin/users', labelKey: 'admin.users', icon: <Users className="h-4 w-4" />, roles: ['chop_admin', 'site_admin'] },
  { href: '/admin/content', labelKey: 'admin.content', icon: <FileText className="h-4 w-4" />, roles: ['chop_admin', 'site_admin'] },
  { href: '/admin/studies', labelKey: 'admin.studies', icon: <FlaskConical className="h-4 w-4" />, roles: ['chop_researcher', 'chop_admin', 'site_admin'] },
  { href: '/admin/analytics', labelKey: 'admin.analytics', icon: <BarChart3 className="h-4 w-4" /> },
  { href: '/admin/exports', labelKey: 'admin.exports', icon: <Download className="h-4 w-4" />, roles: ['chop_researcher', 'chop_admin', 'site_admin'] },
  { href: '/admin/settings', labelKey: 'admin.settings', icon: <Settings className="h-4 w-4" />, roles: ['site_admin'] },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/auth/login`);
    } else if (status === 'authenticated' && !isAdminRole(session?.user?.role)) {
      router.push(`/${locale}`);
    }
  }, [status, session, router, locale]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-muted/30 p-4">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </aside>
        <main className="flex-1 p-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  if (status === 'unauthenticated' || !isAdminRole(session?.user?.role)) {
    return null;
  }

  const userRole = session?.user?.role || '';
  const visibleNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">ETA</span>
            </div>
            <span className="font-semibold">{t('common.appName')}</span>
          </Link>
        </div>
        
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>{t(getRoleTranslationKey(userRole) as any)}</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {visibleNavItems.map(item => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {item.icon}
                {t(item.labelKey as any)}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t space-y-2">
          <LanguageSwitcher />
          <Link href="/">
            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
              <ChevronLeft className="h-4 w-4" />
              {t('nav.home')}
            </Button>
          </Link>
        </div>
      </aside>
      
      <main className="flex-1 bg-background">
        {children}
      </main>
    </div>
  );
}

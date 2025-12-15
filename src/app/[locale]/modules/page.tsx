'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface Module {
  id: string;
  slug: string;
  phase: 'pre_permit' | 'learning_to_drive';
  orderIndex: number;
  titleEn: string;
  titleEs: string;
  descriptionEn: string | null;
  descriptionEs: string | null;
  estimatedMinutes: number | null;
  isActive: boolean;
}

async function fetchModules(): Promise<{ modules: Module[] }> {
  const response = await fetch('/api/modules');
  if (!response.ok) {
    throw new Error('Failed to fetch modules');
  }
  return response.json();
}

function getLocalizedText(
  enText: string | null | undefined,
  esText: string | null | undefined,
  locale: string
): string {
  if (locale === 'es' && esText) return esText;
  return enText || '';
}

export default function ModulesPage() {
  const t = useTranslations();
  const locale = useLocale();

  const { data, isLoading, error } = useQuery({
    queryKey: ['modules', locale],
    queryFn: fetchModules,
  });

  const prePermitModules = data?.modules.filter((m) => m.phase === 'pre_permit') || [];
  const learningToDriveModules = data?.modules.filter((m) => m.phase === 'learning_to_drive') || [];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">ETA</span>
            </div>
            <span className="font-semibold text-lg">{t('common.appName')}</span>
          </Link>
          <nav className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/auth/login">
              <Button>{t('nav.signIn')}</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('modules.title')}</h1>
          <p className="text-muted-foreground">{t('modules.subtitle')}</p>
        </div>

        {isLoading && (
          <div className="space-y-8">
            <div>
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">{t('common.error')}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              {t('common.retry')}
            </Button>
          </div>
        )}

        {data && (
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {t('modules.phase1')}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {t('modules.prePermitDescription')}
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {prePermitModules.map((mod) => (
                  <ModuleCard key={mod.id} module={mod} locale={locale} t={t} />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {t('modules.phase2')}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {t('modules.learningToDriveDescription')}
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {learningToDriveModules.map((mod) => (
                  <ModuleCard key={mod.id} module={mod} locale={locale} t={t} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Children&apos;s Hospital of Philadelphia. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ModuleCard({
  module,
  locale,
  t,
}: {
  module: Module;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const title = getLocalizedText(module.titleEn, module.titleEs, locale);
  const description = getLocalizedText(module.descriptionEn, module.descriptionEs, locale);

  return (
    <Link href={`/modules/${module.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                {module.orderIndex}
              </span>
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                {module.estimatedMinutes && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {module.estimatedMinutes} {t('modules.minutes')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}

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
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  Video,
  ListChecks,
  ClipboardCheck,
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';

interface Step {
  id: string;
  moduleId: string;
  slug: string;
  stepType: 'content' | 'video' | 'checklist' | 'assessment' | 'interactive';
  orderIndex: number;
  titleEn: string;
  titleEs: string;
  bodyMdEn: string | null;
  bodyMdEs: string | null;
  isRequired: boolean;
}

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
}

interface ModuleResponse {
  module: Module;
  steps: Step[];
}

function getLocalizedText(
  enText: string | null | undefined,
  esText: string | null | undefined,
  locale: string
): string {
  if (locale === 'es' && esText) return esText;
  return enText || '';
}

function getStepIcon(stepType: Step['stepType']) {
  switch (stepType) {
    case 'video':
      return Video;
    case 'checklist':
      return ListChecks;
    case 'assessment':
      return ClipboardCheck;
    case 'interactive':
      return PlayCircle;
    default:
      return FileText;
  }
}

export default function ModuleDetailPage() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const moduleId = params.moduleId as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['module', moduleId, locale],
    queryFn: async (): Promise<ModuleResponse> => {
      const response = await fetch(`/api/modules/${moduleId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch module');
      }
      return response.json();
    },
    enabled: !!moduleId,
  });

  const module = data?.module;
  const steps = data?.steps || [];

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
        <Link href="/modules" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          {t('modules.backToModules')}
        </Link>

        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-4 mt-8">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">{t('common.error')}</p>
            <Link href="/modules">
              <Button variant="outline" className="mt-4">
                {t('modules.backToModules')}
              </Button>
            </Link>
          </div>
        )}

        {module && (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                  {module.orderIndex}
                </span>
                <div>
                  <h1 className="text-3xl font-bold">
                    {getLocalizedText(module.titleEn, module.titleEs, locale)}
                  </h1>
                  <div className="flex items-center gap-4 mt-1">
                    <Badge variant="outline">
                      {module.phase === 'pre_permit' ? t('modules.phase1') : t('modules.phase2')}
                    </Badge>
                    {module.estimatedMinutes && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {module.estimatedMinutes} {t('modules.minutes')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-lg">
                {getLocalizedText(module.descriptionEn, module.descriptionEs, locale)}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">{t('modules.stepsTitle')}</h2>
              <div className="space-y-3">
                {steps.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    {t('modules.noSteps')}
                  </p>
                ) : (
                  steps.map((step, index) => (
                    <StepCard
                      key={step.id}
                      step={step}
                      index={index + 1}
                      locale={locale}
                      t={t}
                    />
                  ))
                )}
              </div>
            </div>

            {steps.length > 0 && (
              <div className="flex justify-center mt-8">
                <Button size="lg" className="gap-2">
                  <PlayCircle className="h-5 w-5" />
                  {t('modules.startModule')}
                </Button>
              </div>
            )}
          </>
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

function StepCard({
  step,
  index,
  locale,
  t,
}: {
  step: Step;
  index: number;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const title = getLocalizedText(step.titleEn, step.titleEs, locale);
  const Icon = getStepIcon(step.stepType);

  const stepTypeLabels: Record<Step['stepType'], string> = {
    content: t('modules.stepTypes.content'),
    video: t('modules.stepTypes.video'),
    checklist: t('modules.stepTypes.checklist'),
    assessment: t('modules.stepTypes.assessment'),
    interactive: t('modules.stepTypes.interactive'),
  };

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardHeader className="py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-muted text-muted-foreground text-sm font-medium">
            {index}
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {stepTypeLabels[step.stepType]}
              </span>
              {step.isRequired && (
                <Badge variant="secondary" className="text-xs">
                  {t('modules.required')}
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm">
            {t('modules.view')}
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}

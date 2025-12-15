'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/language-switcher';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle2, 
  Circle, 
  PlayCircle,
  Award,
  TrendingUp,
  Calendar,
  Star
} from 'lucide-react';

interface ModuleProgress {
  moduleId: string;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  lastAccessedAt: string | null;
  moduleSlug: string;
  moduleTitleEn: string;
  moduleTitleEs: string;
  modulePhase: string;
  moduleOrderIndex: number;
}

interface Module {
  id: string;
  slug: string;
  titleEn: string;
  titleEs: string;
  phase: string;
  orderIndex: number;
  estimatedMinutes: number | null;
}

interface Milestone {
  id: string;
  earnedAt: string;
  milestoneId: string;
  milestoneSlug: string;
  milestoneType: string;
  titleEn: string;
  titleEs: string;
  descriptionEn: string | null;
  descriptionEs: string | null;
  iconName: string | null;
  badgeColor: string | null;
  points: number;
}

interface ProgressEvent {
  id: string;
  eventType: string;
  moduleId: string | null;
  stepId: string | null;
  createdAt: string;
}

interface ProgressData {
  summary: {
    completedModules: number;
    totalModules: number;
    overallProgress: number;
    totalMilestones: number;
    totalPoints: number;
  };
  moduleProgress: ModuleProgress[];
  allModules: Module[];
  milestones: Milestone[];
  recentEvents: ProgressEvent[];
}

function getLocalizedText(
  enText: string | null | undefined,
  esText: string | null | undefined,
  locale: string
): string {
  if (locale === 'es' && esText) return esText;
  return enText || '';
}

function formatDate(dateString: string | null, locale: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatRelativeTime(dateString: string, t: ReturnType<typeof useTranslations>): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t('progress.time.justNow');
  if (diffMins < 60) return t('progress.time.minutesAgo', { count: diffMins });
  if (diffHours < 24) return t('progress.time.hoursAgo', { count: diffHours });
  return t('progress.time.daysAgo', { count: diffDays });
}

function getEventLabel(eventType: string, t: ReturnType<typeof useTranslations>): string {
  const eventMap: Record<string, string> = {
    'module_started': 'progress.events.moduleStarted',
    'module_completed': 'progress.events.moduleCompleted',
    'step_started': 'progress.events.stepStarted',
    'step_completed': 'progress.events.stepCompleted',
    'assessment_started': 'progress.events.assessmentStarted',
    'assessment_completed': 'progress.events.assessmentCompleted',
    'milestone_earned': 'progress.events.milestoneEarned',
    'session_started': 'progress.events.sessionStarted',
    'session_ended': 'progress.events.sessionEnded',
  };
  const key = eventMap[eventType];
  return key ? t(key as any) : eventType;
}

export default function ProgressPage() {
  const t = useTranslations();
  const locale = useLocale();

  const { data, isLoading, error } = useQuery<ProgressData>({
    queryKey: ['progress', locale],
    queryFn: async () => {
      const response = await fetch('/api/progress');
      if (!response.ok) throw new Error('Failed to fetch progress');
      return response.json();
    },
  });

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
            <Link href="/modules" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {t('nav.modules')}
            </Link>
            <LanguageSwitcher />
            <Link href="/auth/login">
              <Button>{t('nav.signIn')}</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t('progress.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('progress.subtitle')}
          </p>
        </div>

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        )}

        {error && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-destructive">{t('common.error')}</p>
            </CardContent>
          </Card>
        )}

        {data && (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('progress.overallProgress')}
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{data.summary.overallProgress}%</div>
                  <Progress value={data.summary.overallProgress} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {data.summary.completedModules} / {data.summary.totalModules} {t('progress.modules')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('progress.milestones')}
                  </CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{data.summary.totalMilestones}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('progress.achievementsEarned')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('progress.totalPoints')}
                  </CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{data.summary.totalPoints}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('progress.pointsEarned')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('progress.recentActivity')}
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{data.recentEvents.length}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('progress.recentEvents')}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {t('progress.moduleProgress')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.allModules.map(module => {
                      const progress = data.moduleProgress.find(p => p.moduleId === module.id);
                      const status = progress?.status || 'not_started';
                      
                      return (
                        <div key={module.id} className="flex items-center gap-4">
                          <div className="shrink-0">
                            {status === 'completed' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : status === 'in_progress' ? (
                              <PlayCircle className="h-5 w-5 text-blue-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {getLocalizedText(module.titleEn, module.titleEs, locale)}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="secondary" className="text-xs">
                                {module.phase === 'pre_permit' 
                                  ? t('progress.phase.prePermit')
                                  : t('progress.phase.learningToDrive')}
                              </Badge>
                              {module.estimatedMinutes && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {module.estimatedMinutes} min
                                </span>
                              )}
                            </div>
                          </div>
                          <Badge
                            variant={status === 'completed' ? 'default' : status === 'in_progress' ? 'secondary' : 'outline'}
                          >
                            {status === 'completed' 
                              ? t('progress.status.completed')
                              : status === 'in_progress' 
                                ? t('progress.status.inProgress')
                                : t('progress.status.notStarted')}
                          </Badge>
                        </div>
                      );
                    })}
                    {data.allModules.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        {t('progress.noModules')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {t('progress.achievements')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.milestones.map(milestone => (
                      <div key={milestone.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                        <div className="shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">
                            {getLocalizedText(milestone.titleEn, milestone.titleEs, locale)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getLocalizedText(milestone.descriptionEn, milestone.descriptionEs, locale)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(milestone.earnedAt, locale)}
                          </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          +{milestone.points} pts
                        </Badge>
                      </div>
                    ))}
                    {data.milestones.length === 0 && (
                      <div className="text-center py-8">
                        <Trophy className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground">
                          {t('progress.noAchievements')}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('progress.recentActivity')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.recentEvents.map(event => (
                    <div key={event.id} className="flex items-center gap-4 py-2 border-b last:border-0">
                      <div className="shrink-0 h-2 w-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {getEventLabel(event.eventType, t)}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(event.createdAt, t)}
                      </span>
                    </div>
                  ))}
                  {data.recentEvents.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      {t('progress.noActivity')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
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

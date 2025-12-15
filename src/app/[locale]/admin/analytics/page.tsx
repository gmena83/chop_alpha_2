'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  CheckCircle, 
  TrendingUp, 
  Award,
  Activity,
  RefreshCw,
  Globe
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeModules: number;
    activeUsersLast30Days: number;
    activeUsersLast7Days: number;
    completedAssessments: number;
    totalFamilies: number;
    completionRate: number;
    milestonesEarned: number;
  };
  usersByRole: Array<{ role: string; count: number }>;
  usersByLocale: Array<{ locale: string; count: number }>;
  registrationTrend: Array<{ date: string; count: number }>;
  progressDistribution: Array<{ status: string; count: number }>;
  recentActivity: Array<{
    id: string;
    eventType: string;
    userId: string;
    createdAt: string;
  }>;
}

function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon
}: { 
  title: string; 
  value: string | number; 
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const t = useTranslations();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(t('common.error'));
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'parent': t('admin.roleParent'),
      'teen': t('admin.roleTeen'),
      'professional': t('admin.roleProfessional'),
      'research_staff': t('admin.roleResearchStaff'),
      'admin': t('admin.roleAdmin'),
      'super_admin': t('admin.roleSuperAdmin'),
      'system': t('admin.roleSystem')
    };
    return roleMap[role] || role;
  };

  const getLocaleLabel = (locale: string) => {
    const localeMap: Record<string, string> = {
      'en': t('admin.localeEnglish'),
      'es': t('admin.localeSpanish')
    };
    return localeMap[locale] || locale;
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'completed': t('admin.statusCompleted'),
      'in_progress': t('admin.statusInProgress'),
      'not_started': t('admin.statusNotStarted')
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'not_started': return 'bg-gray-300';
      default: return 'bg-gray-400';
    }
  };

  const formatEventType = (eventType: string) => {
    const eventMap: Record<string, string> = {
      'module_started': t('admin.eventModuleStarted'),
      'module_completed': t('admin.eventModuleCompleted'),
      'step_started': t('admin.eventStepStarted'),
      'step_completed': t('admin.eventStepCompleted'),
      'assessment_started': t('admin.eventAssessmentStarted'),
      'assessment_completed': t('admin.eventAssessmentCompleted'),
      'milestone_earned': t('admin.eventMilestoneEarned'),
      'login': t('admin.eventLogin'),
      'logout': t('admin.eventLogout')
    };
    return eventMap[eventType] || eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          {[1, 2].map(i => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">{error || t('admin.noDataAvailable')}</p>
            <Button onClick={fetchAnalytics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common.retry')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalProgressCount = data.progressDistribution.reduce((sum, p) => sum + p.count, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.analyticsTitle')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('admin.analyticsDescription')}
          </p>
        </div>
        <Button variant="outline" onClick={fetchAnalytics}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('admin.refresh')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('admin.totalUsers')}
          value={data.overview.totalUsers}
          description={t('admin.registeredUsers')}
          icon={Users}
        />
        <StatCard
          title={t('admin.activeModules')}
          value={data.overview.activeModules}
          description={t('admin.publishedContent')}
          icon={BookOpen}
        />
        <StatCard
          title={t('admin.completionRate')}
          value={`${data.overview.completionRate}%`}
          description={t('admin.averageProgress')}
          icon={TrendingUp}
        />
        <StatCard
          title={t('admin.milestonesEarned')}
          value={data.overview.milestonesEarned}
          description={t('admin.achievementsAwarded')}
          icon={Award}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        <StatCard
          title={t('admin.active7Days')}
          value={data.overview.activeUsersLast7Days}
          description={t('admin.usersActiveThisWeek')}
          icon={Activity}
        />
        <StatCard
          title={t('admin.active30Days')}
          value={data.overview.activeUsersLast30Days}
          description={t('admin.usersActiveThisMonth')}
          icon={Activity}
        />
        <StatCard
          title={t('admin.assessments')}
          value={data.overview.completedAssessments}
          description={t('admin.completedAssessments')}
          icon={CheckCircle}
        />
        <StatCard
          title={t('admin.families')}
          value={data.overview.totalFamilies}
          description={t('admin.registeredFamilies')}
          icon={Users}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('admin.usersByRole')}
            </CardTitle>
            <CardDescription>{t('admin.usersByRoleDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.usersByRole.map(item => {
                const percentage = data.overview.totalUsers > 0 
                  ? Math.round((item.count / data.overview.totalUsers) * 100) 
                  : 0;
                return (
                  <div key={item.role} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{getRoleLabel(item.role)}</span>
                      <span className="text-sm text-muted-foreground">{item.count} ({percentage}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
              {data.usersByRole.length === 0 && (
                <p className="text-center text-muted-foreground py-4">{t('admin.noUsersYet')}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('admin.languagePreference')}
            </CardTitle>
            <CardDescription>{t('admin.languageDistribution')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.usersByLocale.map(item => {
                const percentage = data.overview.totalUsers > 0 
                  ? Math.round((item.count / data.overview.totalUsers) * 100) 
                  : 0;
                return (
                  <div key={item.locale} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{getLocaleLabel(item.locale)}</span>
                      <span className="text-sm text-muted-foreground">{item.count} ({percentage}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
              {data.usersByLocale.length === 0 && (
                <p className="text-center text-muted-foreground py-4">{t('admin.noDataAvailable')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t('admin.progressDistribution')}
            </CardTitle>
            <CardDescription>{t('admin.progressDistributionDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.progressDistribution.map(item => {
                const percentage = totalProgressCount > 0 
                  ? Math.round((item.count / totalProgressCount) * 100) 
                  : 0;
                return (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${getStatusColor(item.status)}`} />
                        <span className="text-sm font-medium">{getStatusLabel(item.status)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.count} ({percentage}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
              {data.progressDistribution.length === 0 && (
                <p className="text-center text-muted-foreground py-4">{t('admin.noProgressData')}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {t('admin.recentActivity')}
            </CardTitle>
            <CardDescription>{t('admin.recentActivityDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentActivity.map(event => (
                <div key={event.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {formatEventType(event.eventType)}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(event.createdAt)}</span>
                </div>
              ))}
              {data.recentActivity.length === 0 && (
                <p className="text-center text-muted-foreground py-4">{t('admin.noRecentActivity')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {data.registrationTrend.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('admin.registrationTrend')}
            </CardTitle>
            <CardDescription>{t('admin.registrationTrendDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {data.registrationTrend.map((day, index) => {
                const maxCount = Math.max(...data.registrationTrend.map(d => d.count), 1);
                const height = (day.count / maxCount) * 100;
                return (
                  <div
                    key={day.date}
                    className="flex-1 bg-primary/80 hover:bg-primary rounded-t transition-colors"
                    style={{ height: `${Math.max(height, 4)}%` }}
                    title={`${day.date}: ${day.count}`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{data.registrationTrend[0]?.date}</span>
              <span>{data.registrationTrend[data.registrationTrend.length - 1]?.date}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

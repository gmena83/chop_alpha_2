'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard, DropoffChart } from '@/components/analytics';
import { 
  BookOpen, 
  Users, 
  FileCheck, 
  TrendingUp,
  Clock,
  Target,
  Activity,
  UserCheck,
  Users2,
  AlertTriangle,
  Rocket,
  Timer,
  Heart
} from 'lucide-react';

interface Stats {
  totalModules: number;
  activeModules: number;
  totalUsers: number;
  totalSteps: number;
}

interface MetricData {
  value: number;
  unit: string;
  trend: number;
  trendLabel: string;
  sparklineData?: number[];
}

interface DropoffData {
  moduleName: string;
  dropoffCount: number;
  dropoffPercentage: number;
}

interface DashboardMetrics {
  avgLessonCompletionTime: MetricData;
  quizPassRateFirstTry: MetricData;
  moduleDropoffPoints: DropoffData[];
  avgSessionsPerWeek: MetricData;
  coPilotRatio: MetricData & { parentSessions: number; studentSessions: number };
  churnWarning14d: MetricData;
  onboardingSuccess: MetricData;
  velocityToMilestone: MetricData;
  userSentimentNPS: MetricData;
}

export default function StaffDashboard() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const [stats, setStats] = useState<Stats>({
    totalModules: 0,
    activeModules: 0,
    totalUsers: 0,
    totalSteps: 0,
  });
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [modulesRes, usersRes, analyticsRes] = await Promise.all([
          fetch('/api/admin/modules?includeInactive=true'),
          fetch('/api/admin/users?limit=1'),
          fetch('/api/admin/analytics'),
        ]);

        if (modulesRes.ok) {
          const modulesData = await modulesRes.json();
          const allModules = modulesData.modules || [];
          const activeModules = allModules.filter((m: any) => m.isActive);
          const totalSteps = allModules.reduce(
            (acc: number, m: any) => acc + (m.steps?.length || 0),
            0
          );
          setStats((prev) => ({
            ...prev,
            totalModules: allModules.length,
            activeModules: activeModules.length,
            totalSteps,
          }));
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setStats((prev) => ({
            ...prev,
            totalUsers: usersData.pagination?.total || 0,
          }));
        }

        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setMetrics(analyticsData.dashboardMetrics);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Modules',
      value: stats.totalModules,
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Active Modules',
      value: stats.activeModules,
      icon: FileCheck,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Total Steps',
      value: stats.totalSteps,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Research Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Anonymized aggregate metrics for user progress and engagement tracking
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {loading ? (
                  <div className="h-9 w-16 bg-gray-200 animate-pulse rounded" />
                ) : (
                  card.value
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Engagement Metrics</h2>
        <p className="text-sm text-gray-500">Key performance indicators for learning outcomes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Avg. Lesson Completion Time"
          value={metrics?.avgLessonCompletionTime.value ?? 0}
          unit={metrics?.avgLessonCompletionTime.unit}
          trend={metrics?.avgLessonCompletionTime.trend ?? 0}
          trendLabel={metrics?.avgLessonCompletionTime.trendLabel}
          sparklineData={metrics?.avgLessonCompletionTime.sparklineData}
          icon={<Clock className="h-4 w-4" />}
          accentColor="#3b82f6"
          loading={loading}
        />

        <MetricCard
          title="Quiz Pass Rate (1st Try)"
          value={metrics?.quizPassRateFirstTry.value ?? 0}
          unit={metrics?.quizPassRateFirstTry.unit}
          trend={metrics?.quizPassRateFirstTry.trend ?? 0}
          trendLabel={metrics?.quizPassRateFirstTry.trendLabel}
          sparklineData={metrics?.quizPassRateFirstTry.sparklineData}
          icon={<Target className="h-4 w-4" />}
          accentColor="#22c55e"
          loading={loading}
        />

        <DropoffChart
          data={metrics?.moduleDropoffPoints ?? []}
          loading={loading}
        />

        <MetricCard
          title="Avg. Sessions per Week"
          value={metrics?.avgSessionsPerWeek.value ?? 0}
          unit={metrics?.avgSessionsPerWeek.unit}
          trend={metrics?.avgSessionsPerWeek.trend ?? 0}
          trendLabel={metrics?.avgSessionsPerWeek.trendLabel}
          sparklineData={metrics?.avgSessionsPerWeek.sparklineData}
          icon={<Activity className="h-4 w-4" />}
          accentColor="#8b5cf6"
          loading={loading}
        />

        <MetricCard
          title="Co-Pilot Ratio"
          value={metrics?.coPilotRatio.value ?? 0}
          unit=""
          trend={metrics?.coPilotRatio.trend ?? 0}
          trendLabel={metrics?.coPilotRatio.trendLabel}
          sparklineData={metrics?.coPilotRatio.sparklineData}
          icon={<Users2 className="h-4 w-4" />}
          accentColor="#06b6d4"
          subtitle={metrics ? `${metrics.coPilotRatio.parentSessions} parent vs ${metrics.coPilotRatio.studentSessions} student sessions` : undefined}
          loading={loading}
        />

        <MetricCard
          title="Churn Warning (14d)"
          value={metrics?.churnWarning14d.value ?? 0}
          unit={metrics?.churnWarning14d.unit}
          trend={metrics?.churnWarning14d.trend ?? 0}
          trendLabel={metrics?.churnWarning14d.trendLabel}
          sparklineData={metrics?.churnWarning14d.sparklineData}
          icon={<AlertTriangle className="h-4 w-4" />}
          accentColor="#f59e0b"
          loading={loading}
        />

        <MetricCard
          title="Onboarding Success"
          value={metrics?.onboardingSuccess.value ?? 0}
          unit={metrics?.onboardingSuccess.unit}
          trend={metrics?.onboardingSuccess.trend ?? 0}
          trendLabel={metrics?.onboardingSuccess.trendLabel}
          sparklineData={metrics?.onboardingSuccess.sparklineData}
          icon={<UserCheck className="h-4 w-4" />}
          accentColor="#10b981"
          loading={loading}
        />

        <MetricCard
          title="Velocity to Milestone"
          value={metrics?.velocityToMilestone.value ?? 0}
          unit={metrics?.velocityToMilestone.unit}
          trend={metrics?.velocityToMilestone.trend ?? 0}
          trendLabel={metrics?.velocityToMilestone.trendLabel}
          sparklineData={metrics?.velocityToMilestone.sparklineData}
          icon={<Rocket className="h-4 w-4" />}
          accentColor="#6366f1"
          subtitle="Account created to Permit Readiness"
          loading={loading}
        />

        <MetricCard
          title="User Sentiment (NPS)"
          value={metrics?.userSentimentNPS.value ?? 0}
          unit=""
          trend={metrics?.userSentimentNPS.trend ?? 0}
          trendLabel={metrics?.userSentimentNPS.trendLabel}
          sparklineData={metrics?.userSentimentNPS.sparklineData}
          icon={<Heart className="h-4 w-4" />}
          accentColor="#ec4899"
          subtitle="Net Promoter Score from surveys"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              href={`/${locale}/staff/modules`}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Manage Modules</p>
                  <p className="text-sm text-gray-500">
                    Create, edit, and organize learning modules
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href={`/${locale}/staff/users`}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Manage Users</p>
                  <p className="text-sm text-gray-500">
                    Add users, assign roles, and manage accounts
                  </p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database</span>
                <span className="flex items-center gap-2 text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Status</span>
                <span className="flex items-center gap-2 text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">LMS Engine</span>
                <span className="flex items-center gap-2 text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Running
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

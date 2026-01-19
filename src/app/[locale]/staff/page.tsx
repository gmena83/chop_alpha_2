'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, FileCheck, TrendingUp } from 'lucide-react';

interface Stats {
  totalModules: number;
  activeModules: number;
  totalUsers: number;
  totalSteps: number;
}

export default function StaffDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalModules: 0,
    activeModules: 0,
    totalUsers: 0,
    totalSteps: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [modulesRes, usersRes] = await Promise.all([
          fetch('/api/admin/modules?includeInactive=true'),
          fetch('/api/admin/users?limit=1'),
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
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of your learning management system
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <a
              href="/en/staff/modules"
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
            </a>
            <a
              href="/en/staff/users"
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
            </a>
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

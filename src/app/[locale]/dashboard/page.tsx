'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressCard } from '@/components/lms/ProgressCard';
import { MilestoneCard } from '@/components/lms/MilestoneCard';
import { Button } from '@/components/ui/button';
import { BookOpen, Trophy, Clock, TrendingUp, LogOut, User } from 'lucide-react';

interface Module {
  id: string;
  slug: string;
  titleEn: string;
  titleEs: string;
  descriptionEn?: string;
  descriptionEs?: string;
  estimatedMinutes?: number;
  phase: string;
}

interface ModuleProgress {
  moduleId: string;
  status: string;
  startedAt?: string;
  completedAt?: string;
  moduleSlug: string;
  moduleTitleEn: string;
  moduleTitleEs: string;
}

interface Milestone {
  id: string;
  titleEn: string;
  titleEs: string;
  descriptionEn?: string;
  descriptionEs?: string;
  points: number;
  iconName?: string;
  badgeColor?: string;
  earned: boolean;
  earnedAt?: string;
}

interface ProgressData {
  moduleProgress: ModuleProgress[];
  allModules: Module[];
  milestones: Milestone[];
  summary: {
    totalModules: number;
    completedModules: number;
    inProgressModules: number;
    totalPoints: number;
    percentComplete: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/progress');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/en/auth/login');
          return;
        }
        throw new Error('Failed to fetch progress');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getModuleProgress = (moduleId: string): number => {
    const progress = data?.moduleProgress.find(p => p.moduleId === moduleId);
    if (!progress) return 0;
    if (progress.status === 'completed') return 100;
    if (progress.status === 'in_progress') return 50;
    return 0;
  };

  const getModuleStatus = (moduleId: string): 'not_started' | 'in_progress' | 'completed' => {
    const progress = data?.moduleProgress.find(p => p.moduleId === moduleId);
    if (!progress) return 'not_started';
    return progress.status as 'not_started' | 'in_progress' | 'completed';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a5276]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchProgress}>Try Again</Button>
        </div>
      </div>
    );
  }

  const prePermitModules = data?.allModules.filter(m => m.phase === 'pre_permit') || [];
  const learningToDriveModules = data?.allModules.filter(m => m.phase === 'learning_to_drive') || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#5b2c6f] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-[#f4d03f]">ETA</span>
            <span className="text-sm">Empowering Transportation among Autistic adolescents</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm hover:text-[#f4d03f]">
              <User className="h-4 w-4" />
              Profile
            </button>
            <button className="flex items-center gap-2 text-sm hover:text-[#f4d03f]">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a5276] mb-2">My Learning Dashboard</h1>
          <p className="text-gray-600">Track your progress and continue your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a5276]">{data?.summary.totalModules || 0}</p>
                <p className="text-sm text-gray-500">Total Modules</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a5276]">{data?.summary.completedModules || 0}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a5276]">{data?.summary.inProgressModules || 0}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a5276]">{data?.summary.totalPoints || 0}</p>
                <p className="text-sm text-gray-500">Points Earned</p>
              </div>
            </div>
          </div>
        </div>

        {prePermitModules.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#1a5276] mb-4">Pre-Permit Phase</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prePermitModules.map((module) => (
                <ProgressCard
                  key={module.id}
                  title={module.titleEn}
                  description={module.descriptionEn}
                  progress={getModuleProgress(module.id)}
                  status={getModuleStatus(module.id)}
                  estimatedMinutes={module.estimatedMinutes}
                  onClick={() => router.push(`/en/modules/${module.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {learningToDriveModules.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#1a5276] mb-4">Learning to Drive Phase</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningToDriveModules.map((module) => (
                <ProgressCard
                  key={module.id}
                  title={module.titleEn}
                  description={module.descriptionEn}
                  progress={getModuleProgress(module.id)}
                  status={getModuleStatus(module.id)}
                  estimatedMinutes={module.estimatedMinutes}
                  onClick={() => router.push(`/en/modules/${module.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {data?.milestones && data.milestones.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#1a5276] mb-4">Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.milestones.map((milestone) => (
                <MilestoneCard
                  key={milestone.id}
                  title={milestone.titleEn}
                  description={milestone.descriptionEn}
                  points={milestone.points}
                  earned={milestone.earned}
                  earnedAt={milestone.earnedAt}
                  iconName={milestone.iconName}
                  badgeColor={milestone.badgeColor}
                />
              ))}
            </div>
          </section>
        )}

        {(!data?.allModules || data.allModules.length === 0) && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No modules available yet</h3>
            <p className="text-gray-500">Check back soon for new learning content!</p>
          </div>
        )}
      </main>
    </div>
  );
}

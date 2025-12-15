import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { users, modules, userProgress, assessmentResponses, progressEvents, families, userMilestones } from '@/db/schema';
import { count, sql, eq, gte, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['admin', 'super_admin', 'research_staff'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsersResult,
      activeModulesResult,
      activeUsersLast30Days,
      activeUsersLast7Days,
      completedAssessments,
      usersByRole,
      usersByLocale,
      recentEvents,
      registrationsByDay,
      familiesCount
    ] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(modules).where(eq(modules.isActive, true)),
      db.select({ count: sql<number>`count(distinct ${progressEvents.userId})` })
        .from(progressEvents)
        .where(gte(progressEvents.createdAt, thirtyDaysAgo)),
      db.select({ count: sql<number>`count(distinct ${progressEvents.userId})` })
        .from(progressEvents)
        .where(gte(progressEvents.createdAt, sevenDaysAgo)),
      db.select({ count: count() })
        .from(assessmentResponses)
        .where(eq(assessmentResponses.status, 'completed')),
      db.select({ 
        role: users.role, 
        count: count() 
      })
        .from(users)
        .groupBy(users.role),
      db.select({ 
        locale: users.localePreference, 
        count: count() 
      })
        .from(users)
        .groupBy(users.localePreference),
      db.select({
        id: progressEvents.id,
        eventType: progressEvents.eventType,
        userId: progressEvents.userId,
        createdAt: progressEvents.createdAt
      })
        .from(progressEvents)
        .orderBy(desc(progressEvents.createdAt))
        .limit(10),
      db.select({
        date: sql<string>`DATE(${users.createdAt})`,
        count: count()
      })
        .from(users)
        .where(gte(users.createdAt, thirtyDaysAgo))
        .groupBy(sql`DATE(${users.createdAt})`)
        .orderBy(sql`DATE(${users.createdAt})`),
      db.select({ count: count() }).from(families)
    ]);

    const completionStats = await db.select({
      status: userProgress.status,
      count: count()
    })
      .from(userProgress)
      .groupBy(userProgress.status);

    const totalProgress = completionStats.reduce((sum, s) => sum + s.count, 0);
    const completedProgress = completionStats.find(s => s.status === 'completed')?.count || 0;
    const completionRate = totalProgress > 0 ? Math.round((completedProgress / totalProgress) * 100) : 0;

    const milestonesEarned = await db.select({ count: count() }).from(userMilestones);

    return NextResponse.json({
      overview: {
        totalUsers: totalUsersResult[0]?.count || 0,
        activeModules: activeModulesResult[0]?.count || 0,
        activeUsersLast30Days: activeUsersLast30Days[0]?.count || 0,
        activeUsersLast7Days: activeUsersLast7Days[0]?.count || 0,
        completedAssessments: completedAssessments[0]?.count || 0,
        totalFamilies: familiesCount[0]?.count || 0,
        completionRate,
        milestonesEarned: milestonesEarned[0]?.count || 0
      },
      usersByRole: usersByRole.map(r => ({
        role: r.role,
        count: r.count
      })),
      usersByLocale: usersByLocale.map(l => ({
        locale: l.locale,
        count: l.count
      })),
      registrationTrend: registrationsByDay.map(d => ({
        date: d.date,
        count: d.count
      })),
      progressDistribution: completionStats.map(s => ({
        status: s.status,
        count: s.count
      })),
      recentActivity: recentEvents.map(e => ({
        id: e.id,
        eventType: e.eventType,
        userId: e.userId,
        createdAt: e.createdAt
      }))
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

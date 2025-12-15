import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';
import { 
  userProgress, 
  modules, 
  steps,
  userMilestones,
  milestones,
  progressEvents
} from '../../../db/schema';
import { eq, and, desc, asc, count, sql } from 'drizzle-orm';
import { auth } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const moduleProgress = await db
      .select({
        moduleId: userProgress.moduleId,
        status: userProgress.status,
        startedAt: userProgress.startedAt,
        completedAt: userProgress.completedAt,
        lastAccessedAt: userProgress.lastAccessedAt,
        moduleSlug: modules.slug,
        moduleTitleEn: modules.titleEn,
        moduleTitleEs: modules.titleEs,
        modulePhase: modules.phase,
        moduleOrderIndex: modules.orderIndex,
      })
      .from(userProgress)
      .innerJoin(modules, eq(userProgress.moduleId, modules.id))
      .where(eq(userProgress.userId, userId))
      .orderBy(asc(modules.orderIndex));

    const allModules = await db
      .select({
        id: modules.id,
        slug: modules.slug,
        titleEn: modules.titleEn,
        titleEs: modules.titleEs,
        phase: modules.phase,
        orderIndex: modules.orderIndex,
        estimatedMinutes: modules.estimatedMinutes,
      })
      .from(modules)
      .where(eq(modules.isActive, true))
      .orderBy(asc(modules.orderIndex));

    const earnedMilestones = await db
      .select({
        id: userMilestones.id,
        earnedAt: userMilestones.earnedAt,
        milestoneId: milestones.id,
        milestoneSlug: milestones.slug,
        milestoneType: milestones.milestoneType,
        titleEn: milestones.titleEn,
        titleEs: milestones.titleEs,
        descriptionEn: milestones.descriptionEn,
        descriptionEs: milestones.descriptionEs,
        iconName: milestones.iconName,
        badgeColor: milestones.badgeColor,
        points: milestones.points,
      })
      .from(userMilestones)
      .innerJoin(milestones, eq(userMilestones.milestoneId, milestones.id))
      .where(eq(userMilestones.userId, userId))
      .orderBy(desc(userMilestones.earnedAt));

    const recentEvents = await db
      .select({
        id: progressEvents.id,
        eventType: progressEvents.eventType,
        moduleId: progressEvents.moduleId,
        stepId: progressEvents.stepId,
        createdAt: progressEvents.createdAt,
      })
      .from(progressEvents)
      .where(eq(progressEvents.userId, userId))
      .orderBy(desc(progressEvents.createdAt))
      .limit(20);

    const completedModules = moduleProgress.filter(p => p.status === 'completed').length;
    const totalModules = allModules.length;
    const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    const totalPoints = earnedMilestones.reduce((sum, m) => sum + m.points, 0);

    return NextResponse.json({
      summary: {
        completedModules,
        totalModules,
        overallProgress,
        totalMilestones: earnedMilestones.length,
        totalPoints,
      },
      moduleProgress,
      allModules,
      milestones: earnedMilestones,
      recentEvents,
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { moduleId, stepId, status, eventType } = body;

    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId is required' }, { status: 400 });
    }

    const existingProgress = await db
      .select()
      .from(userProgress)
      .where(and(
        eq(userProgress.userId, session.user.id),
        eq(userProgress.moduleId, moduleId)
      ))
      .limit(1);

    const now = new Date();

    if (existingProgress.length === 0) {
      await db.insert(userProgress).values({
        userId: session.user.id,
        moduleId,
        stepId: stepId || null,
        status: status || 'in_progress',
        startedAt: now,
        lastAccessedAt: now,
      });

      if (eventType) {
        await db.insert(progressEvents).values({
          userId: session.user.id,
          eventType,
          moduleId,
          stepId: stepId || null,
        });
      }
    } else {
      const updateData: Record<string, unknown> = {
        lastAccessedAt: now,
        updatedAt: now,
      };

      if (status) {
        updateData.status = status;
        if (status === 'completed' && !existingProgress[0].completedAt) {
          updateData.completedAt = now;
        }
      }

      if (stepId) {
        updateData.stepId = stepId;
      }

      await db
        .update(userProgress)
        .set(updateData)
        .where(eq(userProgress.id, existingProgress[0].id));

      if (eventType) {
        await db.insert(progressEvents).values({
          userId: session.user.id,
          eventType,
          moduleId,
          stepId: stepId || null,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

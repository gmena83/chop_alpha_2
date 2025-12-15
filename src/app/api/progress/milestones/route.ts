import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { milestones, userMilestones, progressEvents } from '../../../../db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { auth } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allMilestones = await db
      .select({
        id: milestones.id,
        slug: milestones.slug,
        milestoneType: milestones.milestoneType,
        titleEn: milestones.titleEn,
        titleEs: milestones.titleEs,
        descriptionEn: milestones.descriptionEn,
        descriptionEs: milestones.descriptionEs,
        iconName: milestones.iconName,
        badgeColor: milestones.badgeColor,
        points: milestones.points,
      })
      .from(milestones)
      .where(eq(milestones.isActive, true))
      .orderBy(asc(milestones.createdAt));

    const earnedMilestones = await db
      .select({
        milestoneId: userMilestones.milestoneId,
        earnedAt: userMilestones.earnedAt,
      })
      .from(userMilestones)
      .where(eq(userMilestones.userId, session.user.id));

    const earnedMap = new Map(earnedMilestones.map(m => [m.milestoneId, m.earnedAt]));

    const milestonesWithStatus = allMilestones.map(milestone => ({
      ...milestone,
      earned: earnedMap.has(milestone.id),
      earnedAt: earnedMap.get(milestone.id) || null,
    }));

    return NextResponse.json({ milestones: milestonesWithStatus });
  } catch (error) {
    console.error('Error fetching milestones:', error);
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
    const { milestoneId } = body;

    if (!milestoneId) {
      return NextResponse.json({ error: 'milestoneId is required' }, { status: 400 });
    }

    const milestone = await db
      .select()
      .from(milestones)
      .where(and(eq(milestones.id, milestoneId), eq(milestones.isActive, true)))
      .limit(1);

    if (milestone.length === 0) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    const existing = await db
      .select()
      .from(userMilestones)
      .where(and(
        eq(userMilestones.userId, session.user.id),
        eq(userMilestones.milestoneId, milestoneId)
      ))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ message: 'Milestone already earned' });
    }

    const [userMilestone] = await db
      .insert(userMilestones)
      .values({
        userId: session.user.id,
        milestoneId,
      })
      .returning();

    await db.insert(progressEvents).values({
      userId: session.user.id,
      eventType: 'milestone_earned',
      milestoneId,
    });

    return NextResponse.json({
      success: true,
      userMilestone,
      milestone: milestone[0],
    });
  } catch (error) {
    console.error('Error awarding milestone:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

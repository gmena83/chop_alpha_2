import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { coachingSessions, coachAssignments } from '@/db/schema-telecoaching';
import { families, users } from '@/db/schema';
import { eq, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const family = await db.query.families.findFirst({
      where: or(
        eq(families.parentId, userId),
        eq(families.teenId, userId)
      )
    });

    if (!family) {
      return NextResponse.json({ sessions: [] });
    }

    const sessionsData = await db
      .select({
        id: coachingSessions.id,
        scheduledAt: coachingSessions.scheduledAt,
        durationMinutes: coachingSessions.durationMinutes,
        status: coachingSessions.status,
        videoUrl: coachingSessions.videoUrl,
        coachName: users.name
      })
      .from(coachingSessions)
      .leftJoin(users, eq(coachingSessions.coachId, users.id))
      .where(eq(coachingSessions.familyId, family.id))
      .orderBy(desc(coachingSessions.scheduledAt));

    return NextResponse.json({ sessions: sessionsData });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const family = await db.query.families.findFirst({
      where: or(
        eq(families.parentId, userId),
        eq(families.teenId, userId)
      )
    });

    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    const assignment = await db.query.coachAssignments.findFirst({
      where: and(
        eq(coachAssignments.familyId, family.id),
        eq(coachAssignments.isActive, true)
      )
    });

    if (!assignment) {
      return NextResponse.json({ 
        error: 'No coach assigned',
        message: 'Please contact support to be assigned a coach before scheduling sessions.'
      }, { status: 400 });
    }

    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + 3);
    scheduledAt.setHours(10, 0, 0, 0);

    const [newSession] = await db
      .insert(coachingSessions)
      .values({
        familyId: family.id,
        coachId: assignment.coachId,
        scheduledAt,
        durationMinutes: 30,
        status: 'scheduled'
      })
      .returning();

    return NextResponse.json({ 
      session: newSession,
      message: 'Session request submitted. Your coach will confirm the time.'
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { coachingMessages, coachAssignments } from '@/db/schema-telecoaching';
import { families } from '@/db/schema';
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
      return NextResponse.json({ messages: [] });
    }

    const messages = await db
      .select()
      .from(coachingMessages)
      .where(eq(coachingMessages.familyId, family.id))
      .orderBy(coachingMessages.createdAt);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
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
    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

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

    const recipientId = assignment?.coachId || userId;

    const [message] = await db
      .insert(coachingMessages)
      .values({
        familyId: family.id,
        senderId: userId,
        recipientId,
        content: content.trim(),
        isFromCoach: false
      })
      .returning();

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

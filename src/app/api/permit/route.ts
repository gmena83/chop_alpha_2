import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { permitTracking } from '@/db/schema-permit';
import { families } from '@/db/schema';
import { eq, or } from 'drizzle-orm';

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
      return NextResponse.json({ permit: null });
    }

    const permit = await db.query.permitTracking.findFirst({
      where: eq(permitTracking.familyId, family.id)
    });

    return NextResponse.json({ permit });
  } catch (error) {
    console.error('Error fetching permit:', error);
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

    const existing = await db.query.permitTracking.findFirst({
      where: eq(permitTracking.familyId, family.id)
    });

    if (existing) {
      return NextResponse.json({ permit: existing });
    }

    const teenId = family.teenId || userId;

    const [permit] = await db.insert(permitTracking).values({
      familyId: family.id,
      teenId,
      status: 'not_started',
      practiceHoursRequired: 50,
      practiceHoursCompleted: 0,
      nightHoursRequired: 10,
      nightHoursCompleted: 0
    }).returning();

    return NextResponse.json({ permit });
  } catch (error) {
    console.error('Error creating permit tracking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const updates = await request.json();

    const family = await db.query.families.findFirst({
      where: or(
        eq(families.parentId, userId),
        eq(families.teenId, userId)
      )
    });

    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    const [permit] = await db
      .update(permitTracking)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(permitTracking.familyId, family.id))
      .returning();

    return NextResponse.json({ permit });
  } catch (error) {
    console.error('Error updating permit:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

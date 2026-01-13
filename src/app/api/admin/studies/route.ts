import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { studies } from '@/db/schema-research';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (!['admin', 'super_admin', 'research_staff'].includes(userRole || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const allStudies = await db
      .select()
      .from(studies)
      .orderBy(desc(studies.createdAt));

    return NextResponse.json({ studies: allStudies });
  } catch (error) {
    console.error('Error fetching studies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (!['admin', 'super_admin'].includes(userRole || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    const [study] = await db.insert(studies).values({
      slug: body.slug,
      titleEn: body.titleEn,
      titleEs: body.titleEs,
      principalInvestigator: body.principalInvestigator || null,
      irbNumber: body.irbNumber || null,
      targetEnrollment: body.targetEnrollment || null,
      createdBy: session.user.id
    }).returning();

    return NextResponse.json({ study });
  } catch (error) {
    console.error('Error creating study:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

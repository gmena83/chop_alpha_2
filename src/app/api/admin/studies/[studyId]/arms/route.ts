import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { studyArms } from '@/db/schema-research';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studyId: string }> }
) {
  try {
    const { studyId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (!['admin', 'super_admin', 'research_staff'].includes(userRole || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const arms = await db
      .select()
      .from(studyArms)
      .where(eq(studyArms.studyId, studyId));

    return NextResponse.json({ arms });
  } catch (error) {
    console.error('Error fetching study arms:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ studyId: string }> }
) {
  try {
    const { studyId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (!['admin', 'super_admin'].includes(userRole || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    const [arm] = await db.insert(studyArms).values({
      studyId,
      slug: body.slug,
      nameEn: body.nameEn,
      nameEs: body.nameEs,
      allocationWeight: body.allocationWeight || 1,
      isControl: body.isControl || false
    }).returning();

    return NextResponse.json({ arm });
  } catch (error) {
    console.error('Error creating study arm:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

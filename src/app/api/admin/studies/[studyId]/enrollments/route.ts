import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { studyEnrollments, studyArms } from '@/db/schema-research';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { studyId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (!['admin', 'super_admin', 'research_staff'].includes(userRole || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const enrollments = await db
      .select({
        id: studyEnrollments.id,
        participantId: studyEnrollments.participantId,
        status: studyEnrollments.status,
        armName: studyArms.nameEn,
        randomizedAt: studyEnrollments.randomizedAt
      })
      .from(studyEnrollments)
      .leftJoin(studyArms, eq(studyEnrollments.armId, studyArms.id))
      .where(eq(studyEnrollments.studyId, params.studyId));

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

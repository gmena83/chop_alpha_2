import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { studyEnrollments, studyArms, randomizationLog, studies } from '@/db/schema-research';
import { eq, and } from 'drizzle-orm';

function weightedRandomSelect(arms: { id: string; allocationWeight: number }[]): string {
  const totalWeight = arms.reduce((sum, arm) => sum + arm.allocationWeight, 0);
  let random = Math.random() * totalWeight;
  
  for (const arm of arms) {
    random -= arm.allocationWeight;
    if (random <= 0) {
      return arm.id;
    }
  }
  
  return arms[arms.length - 1].id;
}

export async function POST(
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

    const { enrollmentId } = await request.json();

    const enrollment = await db.query.studyEnrollments.findFirst({
      where: and(
        eq(studyEnrollments.id, enrollmentId),
        eq(studyEnrollments.studyId, params.studyId)
      )
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    if (enrollment.armId) {
      return NextResponse.json({ error: 'Already randomized' }, { status: 400 });
    }

    // Validate consent/eligibility before randomization
    if (enrollment.status !== 'consented') {
      return NextResponse.json({ 
        error: 'Participant must have consented status before randomization',
        currentStatus: enrollment.status 
      }, { status: 400 });
    }

    const arms = await db
      .select({ id: studyArms.id, allocationWeight: studyArms.allocationWeight })
      .from(studyArms)
      .where(and(
        eq(studyArms.studyId, params.studyId),
        eq(studyArms.isActive, true)
      ));

    if (arms.length === 0) {
      return NextResponse.json({ error: 'No active study arms' }, { status: 400 });
    }

    const selectedArmId = weightedRandomSelect(arms);
    const seed = crypto.randomUUID();

    await db
      .update(studyEnrollments)
      .set({
        armId: selectedArmId,
        status: 'randomized',
        randomizedAt: new Date(),
        randomizationSeed: seed,
        updatedAt: new Date()
      })
      .where(eq(studyEnrollments.id, enrollmentId));

    await db.insert(randomizationLog).values({
      enrollmentId,
      studyId: params.studyId,
      armId: selectedArmId,
      randomizationMethod: 'weighted_random',
      seed,
      performedBy: session.user.id
    });

    await db
      .update(studyArms)
      .set({
        currentParticipants: (await db.query.studyArms.findFirst({
          where: eq(studyArms.id, selectedArmId)
        }))!.currentParticipants + 1,
        updatedAt: new Date()
      })
      .where(eq(studyArms.id, selectedArmId));

    await db
      .update(studies)
      .set({
        currentEnrollment: (await db.query.studies.findFirst({
          where: eq(studies.id, params.studyId)
        }))!.currentEnrollment + 1,
        updatedAt: new Date()
      })
      .where(eq(studies.id, params.studyId));

    return NextResponse.json({ 
      success: true,
      armId: selectedArmId,
      message: 'Participant randomized successfully'
    });
  } catch (error) {
    console.error('Error randomizing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

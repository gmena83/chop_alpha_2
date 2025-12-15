import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { assessments, assessmentQuestions } from '../../../../db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { auth } from '../../../../lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assessmentId } = await params;

    const assessment = await db
      .select()
      .from(assessments)
      .where(and(eq(assessments.id, assessmentId), eq(assessments.isActive, true)))
      .limit(1);

    if (assessment.length === 0) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const questions = await db
      .select({
        id: assessmentQuestions.id,
        orderIndex: assessmentQuestions.orderIndex,
        questionType: assessmentQuestions.questionType,
        questionTextEn: assessmentQuestions.questionTextEn,
        questionTextEs: assessmentQuestions.questionTextEs,
        helpTextEn: assessmentQuestions.helpTextEn,
        helpTextEs: assessmentQuestions.helpTextEs,
        optionsEn: assessmentQuestions.optionsEn,
        optionsEs: assessmentQuestions.optionsEs,
        isRequired: assessmentQuestions.isRequired,
      })
      .from(assessmentQuestions)
      .where(and(
        eq(assessmentQuestions.assessmentId, assessmentId),
        eq(assessmentQuestions.isActive, true)
      ))
      .orderBy(asc(assessmentQuestions.orderIndex));

    return NextResponse.json({
      assessment: assessment[0],
      questions
    });
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

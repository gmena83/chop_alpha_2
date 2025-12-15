import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';
import { assessments, assessmentQuestions } from '../../../db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { auth } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const includeQuestions = searchParams.get('includeQuestions') === 'true';

    const assessmentsList = await db
      .select()
      .from(assessments)
      .where(eq(assessments.isActive, true))
      .orderBy(asc(assessments.createdAt));

    if (includeQuestions) {
      const assessmentsWithQuestions = await Promise.all(
        assessmentsList.map(async (assessment) => {
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
              eq(assessmentQuestions.assessmentId, assessment.id),
              eq(assessmentQuestions.isActive, true)
            ))
            .orderBy(asc(assessmentQuestions.orderIndex));
          return { ...assessment, questions };
        })
      );
      return NextResponse.json({ assessments: assessmentsWithQuestions });
    }

    return NextResponse.json({ assessments: assessmentsList });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

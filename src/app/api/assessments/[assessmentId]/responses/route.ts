import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { 
  assessments, 
  assessmentQuestions, 
  assessmentResponses,
  recommendations,
  userRecommendations 
} from '../../../../../db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { auth } from '../../../../../lib/auth';

interface AnswerValue {
  questionId: string;
  answer: string | string[] | number;
}

function calculateScore(
  questions: typeof assessmentQuestions.$inferSelect[],
  answers: Record<string, AnswerValue>
): { score: number; maxPossible: number } {
  let score = 0;
  let maxPossible = 0;

  for (const question of questions) {
    maxPossible += question.points;
    const answer = answers[question.id];
    
    if (!answer) continue;

    if (question.correctAnswer) {
      const correctAnswer = question.correctAnswer as { value: string | string[] | number };
      
      if (question.questionType === 'single_choice' || question.questionType === 'rating') {
        if (answer.answer === correctAnswer.value) {
          score += question.points;
        }
      } else if (question.questionType === 'multiple_choice') {
        const correctValues = correctAnswer.value as string[];
        const userAnswers = answer.answer as string[];
        if (Array.isArray(userAnswers) && Array.isArray(correctValues)) {
          const allCorrect = correctValues.every(v => userAnswers.includes(v)) &&
                            userAnswers.every(v => correctValues.includes(v));
          if (allCorrect) score += question.points;
        }
      } else if (question.questionType === 'likert_scale') {
        const likertValue = answer.answer as number;
        if (typeof likertValue === 'number') {
          const maxLikert = 5;
          score += Math.round((likertValue / maxLikert) * question.points);
        }
      }
    } else {
      if (question.questionType === 'likert_scale') {
        const likertValue = answer.answer as number;
        if (typeof likertValue === 'number') {
          const maxLikert = 5;
          score += Math.round((likertValue / maxLikert) * question.points);
        }
      } else {
        score += question.points;
      }
    }
  }

  return { score, maxPossible };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assessmentId } = await params;
    const body = await request.json();
    const { answers, stepId, familyId, timeTakenSeconds } = body;

    const assessment = await db
      .select()
      .from(assessments)
      .where(and(eq(assessments.id, assessmentId), eq(assessments.isActive, true)))
      .limit(1);

    if (assessment.length === 0) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const questions = await db
      .select()
      .from(assessmentQuestions)
      .where(and(
        eq(assessmentQuestions.assessmentId, assessmentId),
        eq(assessmentQuestions.isActive, true)
      ))
      .orderBy(asc(assessmentQuestions.orderIndex));

    const { score, maxPossible } = calculateScore(questions, answers);
    const percentageScore = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;
    const passed = assessment[0].passingScore 
      ? percentageScore >= assessment[0].passingScore 
      : true;

    const [response] = await db
      .insert(assessmentResponses)
      .values({
        userId: session.user.id,
        assessmentId,
        stepId: stepId || null,
        familyId: familyId || null,
        status: 'completed',
        answers,
        score,
        maxPossibleScore: maxPossible,
        percentageScore,
        passed,
        timeTakenSeconds: timeTakenSeconds || null,
        completedAt: new Date()
      })
      .returning();

    const applicableRecommendations = await db
      .select()
      .from(recommendations)
      .where(and(
        eq(recommendations.assessmentId, assessmentId),
        eq(recommendations.isActive, true)
      ))
      .orderBy(asc(recommendations.priority));

    const userRecs = [];
    for (const rec of applicableRecommendations) {
      const condition = rec.conditionValue as { 
        minScore?: number; 
        maxScore?: number; 
        questionId?: string;
        answerValue?: string | number;
      };
      
      let applies = false;
      
      if (rec.conditionType === 'score_range') {
        if (condition.minScore !== undefined && condition.maxScore !== undefined) {
          applies = percentageScore >= condition.minScore && percentageScore <= condition.maxScore;
        } else if (condition.minScore !== undefined) {
          applies = percentageScore >= condition.minScore;
        } else if (condition.maxScore !== undefined) {
          applies = percentageScore <= condition.maxScore;
        }
      } else if (rec.conditionType === 'specific_answer' && condition.questionId) {
        const userAnswer = answers[condition.questionId];
        if (userAnswer && userAnswer.answer === condition.answerValue) {
          applies = true;
        }
      } else if (rec.conditionType === 'always') {
        applies = true;
      }

      if (applies) {
        const [userRec] = await db
          .insert(userRecommendations)
          .values({
            userId: session.user.id,
            responseId: response.id,
            recommendationId: rec.id
          })
          .returning();
        userRecs.push({ ...rec, userRecommendationId: userRec.id });
      }
    }

    return NextResponse.json({
      response: {
        id: response.id,
        score,
        maxPossibleScore: maxPossible,
        percentageScore,
        passed,
        completedAt: response.completedAt
      },
      recommendations: userRecs
    });
  } catch (error) {
    console.error('Error submitting assessment response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assessmentId } = await params;

    const responses = await db
      .select()
      .from(assessmentResponses)
      .where(and(
        eq(assessmentResponses.userId, session.user.id),
        eq(assessmentResponses.assessmentId, assessmentId)
      ))
      .orderBy(asc(assessmentResponses.createdAt));

    return NextResponse.json({ responses });
  } catch (error) {
    console.error('Error fetching assessment responses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

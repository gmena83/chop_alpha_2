import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { userProgress, modules, steps } from '../../../../../db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '../../../../../lib/auth';
import { logModuleEvent } from '../../../../../lib/audit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId } = await params;

    const progress = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, session.user.id),
          eq(userProgress.moduleId, moduleId)
        )
      );

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId } = await params;
    const body = await request.json();
    const { stepId, status, progressData } = body;

    const [mod] = await db
      .select()
      .from(modules)
      .where(eq(modules.id, moduleId))
      .limit(1);

    if (!mod) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const existingProgress = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, session.user.id),
          eq(userProgress.moduleId, moduleId),
          stepId ? eq(userProgress.stepId, stepId) : undefined
        )
      )
      .limit(1);

    const now = new Date();

    if (existingProgress.length > 0) {
      const [updated] = await db
        .update(userProgress)
        .set({
          status: status || existingProgress[0].status,
          lastAccessedAt: now,
          completedAt: status === 'completed' ? now : existingProgress[0].completedAt,
          progressData: progressData || existingProgress[0].progressData,
          updatedAt: now,
        })
        .where(eq(userProgress.id, existingProgress[0].id))
        .returning();

      if (status === 'completed' && stepId) {
        await logModuleEvent(session.user.id, 'module.step_completed', stepId, { moduleId });
      } else if (status === 'completed') {
        await logModuleEvent(session.user.id, 'module.completed', moduleId);
      }

      return NextResponse.json({ progress: updated });
    }

    const [newProgress] = await db
      .insert(userProgress)
      .values({
        userId: session.user.id,
        moduleId,
        stepId: stepId || null,
        status: status || 'in_progress',
        startedAt: now,
        lastAccessedAt: now,
        completedAt: status === 'completed' ? now : null,
        progressData: progressData || null,
      })
      .returning();

    await logModuleEvent(session.user.id, 'module.started', moduleId);

    return NextResponse.json({ progress: newProgress }, { status: 201 });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

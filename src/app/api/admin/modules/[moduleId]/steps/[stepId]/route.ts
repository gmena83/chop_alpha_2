import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { steps, auditLog } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

const ADMIN_ROLES = ['admin', 'super_admin', 'research_staff'];

async function isAdmin(session: any): Promise<boolean> {
  return session?.user?.role && ADMIN_ROLES.includes(session.user.role);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string; stepId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { moduleId, stepId } = await params;
    const [step] = await db.select().from(steps).where(and(eq(steps.id, stepId), eq(steps.moduleId, moduleId)));

    if (!step) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    return NextResponse.json({ step });
  } catch (error) {
    console.error('Error fetching step:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string; stepId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { moduleId, stepId } = await params;
    const body = await request.json();

    const [existingStep] = await db.select().from(steps).where(and(eq(steps.id, stepId), eq(steps.moduleId, moduleId)));
    if (!existingStep) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };
    const allowedFields = ['slug', 'stepType', 'orderIndex', 'titleEn', 'titleEs', 'bodyMdEn', 'bodyMdEs', 'videoUrlEn', 'videoUrlEs', 'checklistItemsEn', 'checklistItemsEs', 'isRequired', 'isActive'];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const [updatedStep] = await db.update(steps)
      .set(updateData)
      .where(eq(steps.id, stepId))
      .returning();

    await db.insert(auditLog).values({
      actorUserId: session.user.id,
      action: 'step_updated',
      targetType: 'step',
      targetId: stepId,
      metadata: { moduleId, changes: body }
    });

    return NextResponse.json({ step: updatedStep });
  } catch (error) {
    console.error('Error updating step:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string; stepId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { moduleId, stepId } = await params;

    const [existingStep] = await db.select().from(steps).where(and(eq(steps.id, stepId), eq(steps.moduleId, moduleId)));
    if (!existingStep) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    await db.delete(steps).where(eq(steps.id, stepId));

    await db.insert(auditLog).values({
      actorUserId: session.user.id,
      action: 'step_deleted',
      targetType: 'step',
      targetId: stepId,
      metadata: { moduleId, slug: existingStep.slug }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting step:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

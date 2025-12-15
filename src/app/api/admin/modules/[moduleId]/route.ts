import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { modules, steps, auditLog } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq, asc } from 'drizzle-orm';

const ADMIN_ROLES = ['admin', 'super_admin', 'research_staff'];

async function isAdmin(session: any): Promise<boolean> {
  return session?.user?.role && ADMIN_ROLES.includes(session.user.role);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { moduleId } = await params;
    const [mod] = await db.select().from(modules).where(eq(modules.id, moduleId));

    if (!mod) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const stepsList = await db.select().from(steps).where(eq(steps.moduleId, moduleId)).orderBy(asc(steps.orderIndex));

    return NextResponse.json({ module: { ...mod, steps: stepsList } });
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { moduleId } = await params;
    const body = await request.json();

    const [existingModule] = await db.select().from(modules).where(eq(modules.id, moduleId));
    if (!existingModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };
    const allowedFields = ['slug', 'phase', 'orderIndex', 'titleEn', 'titleEs', 'descriptionEn', 'descriptionEs', 'estimatedMinutes', 'isActive'];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const [updatedModule] = await db.update(modules)
      .set(updateData)
      .where(eq(modules.id, moduleId))
      .returning();

    await db.insert(auditLog).values({
      actorUserId: session.user.id,
      action: 'module_updated',
      targetType: 'module',
      targetId: moduleId,
      metadata: { changes: body }
    });

    return NextResponse.json({ module: updatedModule });
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { steps, modules, auditLog } from '@/db/schema';
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
    const stepsList = await db.select().from(steps).where(eq(steps.moduleId, moduleId)).orderBy(asc(steps.orderIndex));

    return NextResponse.json({ steps: stepsList });
  } catch (error) {
    console.error('Error fetching steps:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
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

    const [mod] = await db.select().from(modules).where(eq(modules.id, moduleId));
    if (!mod) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const { slug, stepType, orderIndex, titleEn, titleEs, bodyMdEn, bodyMdEs, videoUrlEn, videoUrlEs, checklistItemsEn, checklistItemsEs, isRequired, isActive } = body;

    if (!slug || !stepType || !titleEn || !titleEs) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newStep] = await db.insert(steps).values({
      moduleId,
      slug,
      stepType,
      orderIndex: orderIndex || 0,
      titleEn,
      titleEs,
      bodyMdEn,
      bodyMdEs,
      videoUrlEn,
      videoUrlEs,
      checklistItemsEn,
      checklistItemsEs,
      isRequired: isRequired !== false,
      isActive: isActive !== false
    }).returning();

    await db.insert(auditLog).values({
      actorUserId: session.user.id,
      action: 'step_created',
      targetType: 'step',
      targetId: newStep.id,
      metadata: { moduleId, slug: newStep.slug }
    });

    return NextResponse.json({ step: newStep }, { status: 201 });
  } catch (error) {
    console.error('Error creating step:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { modules, steps, auditLog } from '@/db/schema';
import { auth } from '@/lib/auth';
import { asc, eq } from 'drizzle-orm';

const ADMIN_ROLES = ['admin', 'super_admin', 'research_staff'];

async function isAdmin(session: any): Promise<boolean> {
  return session?.user?.role && ADMIN_ROLES.includes(session.user.role);
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const includeSteps = searchParams.get('includeSteps') !== 'false';

    let modulesList;
    if (includeInactive) {
      modulesList = await db.select().from(modules).orderBy(asc(modules.phase), asc(modules.orderIndex));
    } else {
      modulesList = await db.select().from(modules).where(eq(modules.isActive, true)).orderBy(asc(modules.phase), asc(modules.orderIndex));
    }

    if (includeSteps) {
      const modulesWithSteps = await Promise.all(
        modulesList.map(async (mod) => {
          let stepsList;
          if (includeInactive) {
            stepsList = await db.select().from(steps).where(eq(steps.moduleId, mod.id)).orderBy(asc(steps.orderIndex));
          } else {
            stepsList = await db.select().from(steps).where(eq(steps.moduleId, mod.id)).orderBy(asc(steps.orderIndex));
          }
          return { ...mod, steps: stepsList };
        })
      );
      return NextResponse.json({ modules: modulesWithSteps });
    }

    return NextResponse.json({ modules: modulesList });
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { slug, phase, orderIndex, titleEn, titleEs, descriptionEn, descriptionEs, estimatedMinutes, isActive } = body;

    if (!slug || !phase || !titleEn || !titleEs) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newModule] = await db.insert(modules).values({
      slug,
      phase,
      orderIndex: orderIndex || 0,
      titleEn,
      titleEs,
      descriptionEn,
      descriptionEs,
      estimatedMinutes,
      isActive: isActive !== false
    }).returning();

    await db.insert(auditLog).values({
      actorUserId: session.user.id,
      action: 'module_created',
      targetType: 'module',
      targetId: newModule.id,
      metadata: { slug: newModule.slug }
    });

    return NextResponse.json({ module: newModule }, { status: 201 });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

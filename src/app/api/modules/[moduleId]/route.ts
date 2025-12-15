import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { modules, steps } from '../../../../db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { auth } from '../../../../lib/auth';

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

    const [mod] = await db
      .select()
      .from(modules)
      .where(and(eq(modules.id, moduleId), eq(modules.isActive, true)))
      .limit(1);

    if (!mod) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const stepsList = await db
      .select()
      .from(steps)
      .where(and(eq(steps.moduleId, moduleId), eq(steps.isActive, true)))
      .orderBy(asc(steps.orderIndex));

    return NextResponse.json({ module: mod, steps: stepsList });
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

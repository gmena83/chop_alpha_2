import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';
import { modules, steps } from '../../../db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { auth } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const phase = searchParams.get('phase');
    const includeSteps = searchParams.get('includeSteps') === 'true';

    let modulesList;
    const validPhases = ['pre_permit', 'learning_to_drive'] as const;

    if (phase && validPhases.includes(phase as typeof validPhases[number])) {
      modulesList = await db
        .select()
        .from(modules)
        .where(and(eq(modules.isActive, true), eq(modules.phase, phase as typeof validPhases[number])))
        .orderBy(asc(modules.orderIndex));
    } else {
      modulesList = await db
        .select()
        .from(modules)
        .where(eq(modules.isActive, true))
        .orderBy(asc(modules.orderIndex));
    }

    if (includeSteps) {
      const modulesWithSteps = await Promise.all(
        modulesList.map(async (mod) => {
          const stepsList = await db
            .select()
            .from(steps)
            .where(and(eq(steps.moduleId, mod.id), eq(steps.isActive, true)))
            .orderBy(asc(steps.orderIndex));
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

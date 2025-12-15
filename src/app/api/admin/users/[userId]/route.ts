import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, auditLog } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

const ADMIN_ROLES = ['admin', 'super_admin', 'research_staff'];

async function isAdmin(session: any): Promise<boolean> {
  return session?.user?.role && ADMIN_ROLES.includes(session.user.role);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = await params;
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      localePreference: users.localePreference,
      createdAt: users.createdAt,
      emailVerified: users.emailVerified,
    }).from(users).where(eq(users.id, userId));

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !(await isAdmin(session))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = await params;
    const body = await request.json();
    const { name, role, localePreference } = body;

    const [existingUser] = await db.select().from(users).where(eq(users.id, userId));
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (localePreference !== undefined) updateData.localePreference = localePreference;

    const [updatedUser] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        localePreference: users.localePreference,
        createdAt: users.createdAt
      });

    await db.insert(auditLog).values({
      actorUserId: session.user.id,
      action: 'user_updated',
      targetType: 'user',
      targetId: userId,
      metadata: { changes: body, previousRole: existingUser.role }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = await params;

    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const [existingUser] = await db.select().from(users).where(eq(users.id, userId));
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await db.delete(users).where(eq(users.id, userId));

    await db.insert(auditLog).values({
      actorUserId: session.user.id,
      action: 'user_deleted',
      targetType: 'user',
      targetId: userId,
      metadata: { email: existingUser.email, role: existingUser.role }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

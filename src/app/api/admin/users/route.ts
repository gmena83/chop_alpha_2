import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, auditLog } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq, desc, ilike, or, count } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

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
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      localePreference: users.localePreference,
      createdAt: users.createdAt,
      emailVerified: users.emailVerified,
    }).from(users);

    const conditions = [];
    if (search) {
      conditions.push(
        or(
          ilike(users.email, `%${search}%`),
          ilike(users.name, `%${search}%`)
        )
      );
    }
    if (role) {
      conditions.push(eq(users.role, role as any));
    }

    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : or(...conditions)) as any;
    }

    const [usersList, totalResult] = await Promise.all([
      query.orderBy(desc(users.createdAt)).limit(limit).offset(offset),
      db.select({ count: count() }).from(users)
    ]);

    return NextResponse.json({
      users: usersList,
      pagination: {
        page,
        limit,
        total: totalResult[0].count,
        pages: Math.ceil(totalResult[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
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
    const { email, name, password, role, localePreference } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    if (existing.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db.insert(users).values({
      email: email.toLowerCase(),
      name: name || null,
      password: hashedPassword,
      role: role || 'parent',
      localePreference: localePreference || 'en'
    }).returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      localePreference: users.localePreference,
      createdAt: users.createdAt
    });

    await db.insert(auditLog).values({
      actorUserId: session.user.id,
      action: 'user_created',
      targetType: 'user',
      targetId: newUser.id,
      metadata: { email: newUser.email, role: newUser.role }
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

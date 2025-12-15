import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { users, userProgress, assessmentResponses, progressEvents, families, userMilestones, modules, steps, assessments } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { logAuditEvent } from '@/lib/audit';

type ExportType = 'users' | 'progress' | 'assessments' | 'events' | 'families';

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function arrayToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const headerRow = headers.join(',');
  const rows = data.map(row => 
    headers.map(header => escapeCSV(row[header])).join(',')
  );
  return [headerRow, ...rows].join('\n');
}

async function exportUsers() {
  const data = await db.select({
    id: users.id,
    email: users.email,
    name: users.name,
    role: users.role,
    localePreference: users.localePreference,
    emailVerified: users.emailVerified,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt
  }).from(users).orderBy(desc(users.createdAt));
  
  return data.map(u => ({
    ...u,
    emailVerified: u.emailVerified?.toISOString() || '',
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString()
  }));
}

async function exportProgress() {
  const data = await db.select({
    progressId: userProgress.id,
    userId: userProgress.userId,
    familyId: userProgress.familyId,
    moduleId: userProgress.moduleId,
    stepId: userProgress.stepId,
    status: userProgress.status,
    startedAt: userProgress.startedAt,
    completedAt: userProgress.completedAt,
    lastAccessedAt: userProgress.lastAccessedAt,
    createdAt: userProgress.createdAt
  }).from(userProgress).orderBy(desc(userProgress.createdAt));
  
  return data.map(p => ({
    ...p,
    startedAt: p.startedAt?.toISOString() || '',
    completedAt: p.completedAt?.toISOString() || '',
    lastAccessedAt: p.lastAccessedAt?.toISOString() || '',
    createdAt: p.createdAt.toISOString()
  }));
}

async function exportAssessments() {
  const data = await db.select({
    responseId: assessmentResponses.id,
    userId: assessmentResponses.userId,
    familyId: assessmentResponses.familyId,
    assessmentId: assessmentResponses.assessmentId,
    stepId: assessmentResponses.stepId,
    status: assessmentResponses.status,
    score: assessmentResponses.score,
    maxPossibleScore: assessmentResponses.maxPossibleScore,
    percentageScore: assessmentResponses.percentageScore,
    passed: assessmentResponses.passed,
    timeTakenSeconds: assessmentResponses.timeTakenSeconds,
    startedAt: assessmentResponses.startedAt,
    completedAt: assessmentResponses.completedAt,
    createdAt: assessmentResponses.createdAt
  }).from(assessmentResponses).orderBy(desc(assessmentResponses.createdAt));
  
  return data.map(a => ({
    ...a,
    passed: a.passed ? 'Yes' : 'No',
    startedAt: a.startedAt.toISOString(),
    completedAt: a.completedAt?.toISOString() || '',
    createdAt: a.createdAt.toISOString()
  }));
}

async function exportEvents() {
  const data = await db.select({
    eventId: progressEvents.id,
    userId: progressEvents.userId,
    familyId: progressEvents.familyId,
    eventType: progressEvents.eventType,
    moduleId: progressEvents.moduleId,
    stepId: progressEvents.stepId,
    assessmentId: progressEvents.assessmentId,
    milestoneId: progressEvents.milestoneId,
    createdAt: progressEvents.createdAt
  }).from(progressEvents).orderBy(desc(progressEvents.createdAt));
  
  return data.map(e => ({
    ...e,
    createdAt: e.createdAt.toISOString()
  }));
}

async function exportFamilies() {
  const data = await db.select({
    familyId: families.id,
    parentId: families.parentId,
    teenId: families.teenId,
    professionalId: families.professionalId,
    phase: families.phase,
    status: families.status,
    createdAt: families.createdAt,
    updatedAt: families.updatedAt
  }).from(families).orderBy(desc(families.createdAt));
  
  return data.map(f => ({
    ...f,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString()
  }));
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['admin', 'super_admin', 'research_staff'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as ExportType;

    if (!type || !['users', 'progress', 'assessments', 'events', 'families'].includes(type)) {
      return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

    let data: Record<string, unknown>[];
    let filename: string;

    switch (type) {
      case 'users':
        data = await exportUsers();
        filename = 'users_export.csv';
        break;
      case 'progress':
        data = await exportProgress();
        filename = 'progress_export.csv';
        break;
      case 'assessments':
        data = await exportAssessments();
        filename = 'assessments_export.csv';
        break;
      case 'events':
        data = await exportEvents();
        filename = 'events_export.csv';
        break;
      case 'families':
        data = await exportFamilies();
        filename = 'families_export.csv';
        break;
      default:
        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

    const csv = arrayToCSV(data);

    await logAuditEvent({
      actorUserId: session.user.id,
      action: 'data_export',
      targetType: type,
      metadata: {
        exportType: type,
        recordCount: data.length,
        exportedAt: new Date().toISOString()
      }
    });

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}

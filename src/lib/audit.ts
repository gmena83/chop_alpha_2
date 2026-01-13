import { db } from '../db';
import { auditLog } from '../db/schema';
import { headers } from 'next/headers';

export type AuditAction =
  | 'user.login'
  | 'user.logout'
  | 'user.login_failed'
  | 'user.registered'
  | 'user.password_changed'
  | 'user.profile_updated'
  | 'user.role_changed'
  | 'user.deleted'
  | 'family.created'
  | 'family.updated'
  | 'family.member_added'
  | 'family.member_removed'
  | 'module.started'
  | 'module.completed'
  | 'module.step_completed'
  | 'assessment.started'
  | 'assessment.submitted'
  | 'admin.user_created'
  | 'admin.user_updated'
  | 'admin.user_deleted'
  | 'admin.content_updated'
  | 'admin.data_exported'
  | 'ai_coach_query'
  | 'system.error';

export type AuditTargetType =
  | 'user'
  | 'family'
  | 'module'
  | 'step'
  | 'assessment'
  | 'content'
  | 'system'
  | 'ai_conversation';

interface AuditLogParams {
  actorUserId?: string | null;
  action: AuditAction;
  targetType?: AuditTargetType;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAuditEvent(params: AuditLogParams): Promise<void> {
  const { actorUserId, action, targetType, targetId, metadata } = params;
  
  let ipAddress = params.ipAddress;
  let userAgent = params.userAgent;
  
  if (!ipAddress || !userAgent) {
    try {
      const headersList = await headers();
      ipAddress = ipAddress || headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || headersList.get('x-real-ip') || undefined;
      userAgent = userAgent || headersList.get('user-agent') || undefined;
    } catch {
    }
  }

  try {
    await db.insert(auditLog).values({
      actorUserId: actorUserId || null,
      action,
      targetType: targetType || null,
      targetId: targetId || null,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      metadata: metadata || null,
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

export async function logLoginSuccess(userId: string): Promise<void> {
  await logAuditEvent({
    actorUserId: userId,
    action: 'user.login',
    targetType: 'user',
    targetId: userId,
  });
}

export async function logLoginFailure(email: string, reason: string): Promise<void> {
  await logAuditEvent({
    action: 'user.login_failed',
    targetType: 'user',
    metadata: { email, reason },
  });
}

export async function logLogout(userId: string): Promise<void> {
  await logAuditEvent({
    actorUserId: userId,
    action: 'user.logout',
    targetType: 'user',
    targetId: userId,
  });
}

export async function logUserRegistered(userId: string, email: string): Promise<void> {
  await logAuditEvent({
    actorUserId: userId,
    action: 'user.registered',
    targetType: 'user',
    targetId: userId,
    metadata: { email },
  });
}

export async function logProfileUpdated(userId: string, changes: Record<string, unknown>): Promise<void> {
  await logAuditEvent({
    actorUserId: userId,
    action: 'user.profile_updated',
    targetType: 'user',
    targetId: userId,
    metadata: { changes },
  });
}

export async function logRoleChanged(
  adminUserId: string,
  targetUserId: string,
  oldRole: string,
  newRole: string
): Promise<void> {
  await logAuditEvent({
    actorUserId: adminUserId,
    action: 'user.role_changed',
    targetType: 'user',
    targetId: targetUserId,
    metadata: { oldRole, newRole },
  });
}

export async function logModuleEvent(
  userId: string,
  action: 'module.started' | 'module.completed' | 'module.step_completed',
  moduleId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await logAuditEvent({
    actorUserId: userId,
    action,
    targetType: action === 'module.step_completed' ? 'step' : 'module',
    targetId: moduleId,
    metadata,
  });
}

export async function logAssessmentEvent(
  userId: string,
  action: 'assessment.started' | 'assessment.submitted',
  assessmentId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await logAuditEvent({
    actorUserId: userId,
    action,
    targetType: 'assessment',
    targetId: assessmentId,
    metadata,
  });
}

export async function logAdminAction(
  adminUserId: string,
  action: 'admin.user_created' | 'admin.user_updated' | 'admin.user_deleted' | 'admin.content_updated' | 'admin.data_exported',
  targetType: AuditTargetType,
  targetId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await logAuditEvent({
    actorUserId: adminUserId,
    action,
    targetType,
    targetId,
    metadata,
  });
}

export async function logDataExport(
  adminUserId: string,
  exportType: string,
  recordCount: number
): Promise<void> {
  await logAuditEvent({
    actorUserId: adminUserId,
    action: 'admin.data_exported',
    targetType: 'system',
    metadata: { exportType, recordCount },
  });
}

import type { UserRole } from '../db/schema';

type Permission =
  | 'view_own_profile'
  | 'edit_own_profile'
  | 'view_own_family'
  | 'view_modules'
  | 'complete_modules'
  | 'view_assessments'
  | 'submit_assessments'
  | 'view_own_progress'
  | 'view_family_progress'
  | 'manage_users'
  | 'manage_content'
  | 'view_analytics'
  | 'export_data'
  | 'manage_studies'
  | 'manage_system'
  | 'impersonate_users';

const rolePermissions: Record<UserRole, Permission[]> = {
  parent: [
    'view_own_profile',
    'edit_own_profile',
    'view_own_family',
    'view_modules',
    'complete_modules',
    'view_assessments',
    'submit_assessments',
    'view_own_progress',
  ],
  teen: [
    'view_own_profile',
    'edit_own_profile',
    'view_modules',
    'view_own_progress',
  ],
  professional: [
    'view_own_profile',
    'edit_own_profile',
    'view_family_progress',
    'view_assessments',
  ],
  research_staff: [
    'view_own_profile',
    'edit_own_profile',
    'view_analytics',
    'export_data',
    'manage_studies',
  ],
  admin: [
    'view_own_profile',
    'edit_own_profile',
    'manage_users',
    'manage_content',
    'view_analytics',
    'export_data',
  ],
  super_admin: [
    'view_own_profile',
    'edit_own_profile',
    'manage_users',
    'manage_content',
    'view_analytics',
    'export_data',
    'manage_studies',
    'manage_system',
    'impersonate_users',
  ],
  system: [
    'manage_system',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

export function getPermissions(role: UserRole): Permission[] {
  return rolePermissions[role] ?? [];
}

export function isAdminRole(role: UserRole): boolean {
  return ['admin', 'super_admin', 'system'].includes(role);
}

export function isStaffRole(role: UserRole): boolean {
  return ['research_staff', 'admin', 'super_admin', 'system'].includes(role);
}

export type { Permission };

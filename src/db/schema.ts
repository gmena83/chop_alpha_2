import { pgTable, uuid, varchar, text, timestamp, pgEnum, jsonb, inet } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'parent',
  'teen',
  'professional',
  'research_staff',
  'admin',
  'super_admin',
  'system'
]);

export const localeEnum = pgEnum('locale', ['en', 'es']);

export const familyPhaseEnum = pgEnum('family_phase', ['pre_permit', 'learning_to_drive']);

export const familyStatusEnum = pgEnum('family_status', ['active', 'inactive', 'completed']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  role: userRoleEnum('role').notNull().default('parent'),
  localePreference: localeEnum('locale_preference').notNull().default('en'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const families = pgTable('families', {
  id: uuid('id').primaryKey().defaultRandom(),
  parentId: uuid('parent_id').references(() => users.id),
  teenId: uuid('teen_id').references(() => users.id),
  professionalId: uuid('professional_id').references(() => users.id),
  phase: familyPhaseEnum('phase').notNull().default('pre_permit'),
  status: familyStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  actorUserId: uuid('actor_user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  targetType: varchar('target_type', { length: 100 }),
  targetId: uuid('target_id'),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Family = typeof families.$inferSelect;
export type NewFamily = typeof families.$inferInsert;
export type AuditLogEntry = typeof auditLog.$inferSelect;
export type NewAuditLogEntry = typeof auditLog.$inferInsert;

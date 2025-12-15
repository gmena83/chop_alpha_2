import { pgTable, uuid, varchar, text, timestamp, pgEnum, jsonb, inet, integer, primaryKey, boolean } from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

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
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  name: varchar('name', { length: 255 }),
  password: varchar('password', { length: 255 }),
  image: text('image'),
  role: userRoleEnum('role').notNull().default('parent'),
  localePreference: localeEnum('locale_preference').notNull().default('en'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const accounts = pgTable('accounts', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).$type<AdapterAccountType>().notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
}, (account) => ({
  pk: primaryKey({ columns: [account.provider, account.providerAccountId] })
}));

export const sessions = pgTable('sessions', {
  sessionToken: varchar('session_token', { length: 255 }).primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull()
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull()
}, (vt) => ({
  pk: primaryKey({ columns: [vt.identifier, vt.token] })
}));

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

export const stepTypeEnum = pgEnum('step_type', [
  'content',
  'video',
  'checklist',
  'assessment',
  'interactive'
]);

export const modules = pgTable('modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  phase: familyPhaseEnum('phase').notNull(),
  orderIndex: integer('order_index').notNull(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleEs: varchar('title_es', { length: 255 }).notNull(),
  descriptionEn: text('description_en'),
  descriptionEs: text('description_es'),
  estimatedMinutes: integer('estimated_minutes'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const steps = pgTable('steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  moduleId: uuid('module_id').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  slug: varchar('slug', { length: 100 }).notNull(),
  stepType: stepTypeEnum('step_type').notNull(),
  orderIndex: integer('order_index').notNull(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleEs: varchar('title_es', { length: 255 }).notNull(),
  bodyMdEn: text('body_md_en'),
  bodyMdEs: text('body_md_es'),
  videoUrlEn: varchar('video_url_en', { length: 500 }),
  videoUrlEs: varchar('video_url_es', { length: 500 }),
  checklistItemsEn: jsonb('checklist_items_en'),
  checklistItemsEs: jsonb('checklist_items_es'),
  assessmentId: uuid('assessment_id'),
  metadata: jsonb('metadata'),
  isRequired: boolean('is_required').notNull().default(true),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const userProgress = pgTable('user_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  familyId: uuid('family_id').references(() => families.id, { onDelete: 'set null' }),
  moduleId: uuid('module_id').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  stepId: uuid('step_id').references(() => steps.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 50 }).notNull().default('not_started'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  lastAccessedAt: timestamp('last_accessed_at'),
  progressData: jsonb('progress_data'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserRole = User['role'];
export type Family = typeof families.$inferSelect;
export type NewFamily = typeof families.$inferInsert;
export type AuditLogEntry = typeof auditLog.$inferSelect;
export type NewAuditLogEntry = typeof auditLog.$inferInsert;
export type Module = typeof modules.$inferSelect;
export type NewModule = typeof modules.$inferInsert;
export type Step = typeof steps.$inferSelect;
export type NewStep = typeof steps.$inferInsert;
export type StepType = Step['stepType'];
export type UserProgressEntry = typeof userProgress.$inferSelect;
export type NewUserProgressEntry = typeof userProgress.$inferInsert;

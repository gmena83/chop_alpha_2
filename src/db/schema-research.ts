import { pgTable, uuid, varchar, text, timestamp, pgEnum, jsonb, boolean, integer } from 'drizzle-orm/pg-core';
import { users, families } from './schema';

export const studyStatusEnum = pgEnum('study_status', [
  'draft',
  'active',
  'paused',
  'completed',
  'archived'
]);

export const studies = pgTable('studies', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleEs: varchar('title_es', { length: 255 }).notNull(),
  descriptionEn: text('description_en'),
  descriptionEs: text('description_es'),
  principalInvestigator: varchar('principal_investigator', { length: 255 }),
  irbNumber: varchar('irb_number', { length: 100 }),
  status: studyStatusEnum('status').notNull().default('draft'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  targetEnrollment: integer('target_enrollment'),
  currentEnrollment: integer('current_enrollment').notNull().default(0),
  eligibilityCriteria: jsonb('eligibility_criteria'),
  metadata: jsonb('metadata'),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const studyArms = pgTable('study_arms', {
  id: uuid('id').primaryKey().defaultRandom(),
  studyId: uuid('study_id').notNull().references(() => studies.id, { onDelete: 'cascade' }),
  slug: varchar('slug', { length: 100 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }).notNull(),
  nameEs: varchar('name_es', { length: 255 }).notNull(),
  descriptionEn: text('description_en'),
  descriptionEs: text('description_es'),
  allocationWeight: integer('allocation_weight').notNull().default(1),
  maxParticipants: integer('max_participants'),
  currentParticipants: integer('current_participants').notNull().default(0),
  isControl: boolean('is_control').notNull().default(false),
  interventionConfig: jsonb('intervention_config'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const enrollmentStatusEnum = pgEnum('enrollment_status', [
  'pending',
  'screened',
  'eligible',
  'consented',
  'randomized',
  'active',
  'completed',
  'withdrawn',
  'lost_to_followup'
]);

export const studyEnrollments = pgTable('study_enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  studyId: uuid('study_id').notNull().references(() => studies.id, { onDelete: 'cascade' }),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  armId: uuid('arm_id').references(() => studyArms.id, { onDelete: 'set null' }),
  status: enrollmentStatusEnum('status').notNull().default('pending'),
  participantId: varchar('participant_id', { length: 50 }),
  screenedAt: timestamp('screened_at'),
  consentedAt: timestamp('consented_at'),
  randomizedAt: timestamp('randomized_at'),
  completedAt: timestamp('completed_at'),
  withdrawnAt: timestamp('withdrawn_at'),
  withdrawalReason: text('withdrawal_reason'),
  eligibilityData: jsonb('eligibility_data'),
  consentVersion: varchar('consent_version', { length: 50 }),
  siteId: varchar('site_id', { length: 100 }),
  randomizationSeed: varchar('randomization_seed', { length: 100 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const consentRecords = pgTable('consent_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  enrollmentId: uuid('enrollment_id').notNull().references(() => studyEnrollments.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  consentType: varchar('consent_type', { length: 100 }).notNull(),
  consentVersion: varchar('consent_version', { length: 50 }).notNull(),
  locale: varchar('locale', { length: 10 }).notNull(),
  signedAt: timestamp('signed_at').notNull(),
  signatureHash: varchar('signature_hash', { length: 255 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  documentUrl: varchar('document_url', { length: 500 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const randomizationLog = pgTable('randomization_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  enrollmentId: uuid('enrollment_id').notNull().references(() => studyEnrollments.id, { onDelete: 'cascade' }),
  studyId: uuid('study_id').notNull().references(() => studies.id, { onDelete: 'cascade' }),
  armId: uuid('arm_id').notNull().references(() => studyArms.id, { onDelete: 'cascade' }),
  stratificationFactors: jsonb('stratification_factors'),
  randomizationMethod: varchar('randomization_method', { length: 100 }).notNull(),
  seed: varchar('seed', { length: 255 }),
  sequenceNumber: integer('sequence_number'),
  performedBy: uuid('performed_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export type Study = typeof studies.$inferSelect;
export type NewStudy = typeof studies.$inferInsert;
export type StudyArm = typeof studyArms.$inferSelect;
export type NewStudyArm = typeof studyArms.$inferInsert;
export type StudyEnrollment = typeof studyEnrollments.$inferSelect;
export type NewStudyEnrollment = typeof studyEnrollments.$inferInsert;
export type ConsentRecord = typeof consentRecords.$inferSelect;
export type NewConsentRecord = typeof consentRecords.$inferInsert;
export type RandomizationLog = typeof randomizationLog.$inferSelect;
export type NewRandomizationLog = typeof randomizationLog.$inferInsert;

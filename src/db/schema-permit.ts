import { pgTable, uuid, varchar, text, timestamp, pgEnum, jsonb, boolean, integer, date } from 'drizzle-orm/pg-core';
import { users, families } from './schema';

export const permitStatusEnum = pgEnum('permit_status', [
  'not_started',
  'studying',
  'ready_for_test',
  'test_scheduled',
  'test_passed',
  'permit_obtained',
  'practicing',
  'license_test_scheduled',
  'license_obtained'
]);

export const permitTracking = pgTable('permit_tracking', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  teenId: uuid('teen_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: permitStatusEnum('status').notNull().default('not_started'),
  state: varchar('state', { length: 50 }),
  permitTestDate: date('permit_test_date'),
  permitObtainedDate: date('permit_obtained_date'),
  permitExpiryDate: date('permit_expiry_date'),
  licenseTestDate: date('license_test_date'),
  licenseObtainedDate: date('license_obtained_date'),
  practiceHoursRequired: integer('practice_hours_required'),
  practiceHoursCompleted: integer('practice_hours_completed').notNull().default(0),
  nightHoursRequired: integer('night_hours_required'),
  nightHoursCompleted: integer('night_hours_completed').notNull().default(0),
  supervisedDrivingMonths: integer('supervised_driving_months'),
  notes: text('notes'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const practiceLogTypeEnum = pgEnum('practice_log_type', [
  'daytime',
  'nighttime',
  'highway',
  'parking',
  'inclement_weather',
  'other'
]);

export const practiceLogs = pgTable('practice_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  permitTrackingId: uuid('permit_tracking_id').notNull().references(() => permitTracking.id, { onDelete: 'cascade' }),
  loggedBy: uuid('logged_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  practiceDate: date('practice_date').notNull(),
  practiceType: practiceLogTypeEnum('practice_type').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  distanceMiles: integer('distance_miles'),
  supervisorName: varchar('supervisor_name', { length: 255 }),
  routeDescription: text('route_description'),
  weatherConditions: varchar('weather_conditions', { length: 100 }),
  skillsPracticed: jsonb('skills_practiced'),
  challengesNoted: text('challenges_noted'),
  successesNoted: text('successes_noted'),
  coachFeedback: text('coach_feedback'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const permitMilestones = pgTable('permit_milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  permitTrackingId: uuid('permit_tracking_id').notNull().references(() => permitTracking.id, { onDelete: 'cascade' }),
  milestoneType: varchar('milestone_type', { length: 100 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleEs: varchar('title_es', { length: 255 }).notNull(),
  achievedAt: timestamp('achieved_at').notNull().defaultNow(),
  notes: text('notes'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export type PermitTracking = typeof permitTracking.$inferSelect;
export type NewPermitTracking = typeof permitTracking.$inferInsert;
export type PracticeLog = typeof practiceLogs.$inferSelect;
export type NewPracticeLog = typeof practiceLogs.$inferInsert;
export type PermitMilestone = typeof permitMilestones.$inferSelect;
export type NewPermitMilestone = typeof permitMilestones.$inferInsert;

import { pgTable, uuid, varchar, text, timestamp, pgEnum, jsonb, boolean, integer } from 'drizzle-orm/pg-core';
import { users, families } from './schema';

export const coachingSessionStatusEnum = pgEnum('coaching_session_status', [
  'scheduled',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
]);

export const messageStatusEnum = pgEnum('message_status', [
  'sent',
  'delivered',
  'read'
]);

export const coachingSessions = pgTable('coaching_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  coachId: uuid('coach_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  scheduledAt: timestamp('scheduled_at').notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(30),
  status: coachingSessionStatusEnum('status').notNull().default('scheduled'),
  videoUrl: varchar('video_url', { length: 500 }),
  meetingId: varchar('meeting_id', { length: 255 }),
  notesEn: text('notes_en'),
  notesEs: text('notes_es'),
  summaryEn: text('summary_en'),
  summaryEs: text('summary_es'),
  metadata: jsonb('metadata'),
  completedAt: timestamp('completed_at'),
  cancelledAt: timestamp('cancelled_at'),
  cancelReason: text('cancel_reason'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const coachingMessages = pgTable('coaching_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  recipientId: uuid('recipient_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  status: messageStatusEnum('status').notNull().default('sent'),
  isFromCoach: boolean('is_from_coach').notNull().default(false),
  readAt: timestamp('read_at'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const coachAssignments = pgTable('coach_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  coachId: uuid('coach_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  assignedBy: uuid('assigned_by').references(() => users.id, { onDelete: 'set null' }),
  isActive: boolean('is_active').notNull().default(true),
  startDate: timestamp('start_date').notNull().defaultNow(),
  endDate: timestamp('end_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export type CoachingSession = typeof coachingSessions.$inferSelect;
export type NewCoachingSession = typeof coachingSessions.$inferInsert;
export type CoachingMessage = typeof coachingMessages.$inferSelect;
export type NewCoachingMessage = typeof coachingMessages.$inferInsert;
export type CoachAssignment = typeof coachAssignments.$inferSelect;
export type NewCoachAssignment = typeof coachAssignments.$inferInsert;

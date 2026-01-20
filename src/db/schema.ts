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
  // Quiz questions for video steps (array of {question, options[], correctIndex})
  quizQuestionsEn: jsonb('quiz_questions_en'),
  quizQuestionsEs: jsonb('quiz_questions_es'),
  // Passing threshold percentage (70, 80, 90, or 100)
  quizPassingThreshold: integer('quiz_passing_threshold'),
  // Helper text displayed with the video
  helperTextEn: text('helper_text_en'),
  helperTextEs: text('helper_text_es'),
  // Extra help resources (video URL or text)
  extraHelpVideoUrlEn: varchar('extra_help_video_url_en', { length: 500 }),
  extraHelpVideoUrlEs: varchar('extra_help_video_url_es', { length: 500 }),
  extraHelpTextEn: text('extra_help_text_en'),
  extraHelpTextEs: text('extra_help_text_es'),
  assessmentId: uuid('assessment_id').references(() => assessments.id, { onDelete: 'set null' }),
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

export const questionTypeEnum = pgEnum('question_type', [
  'single_choice',
  'multiple_choice',
  'likert_scale',
  'text_short',
  'text_long',
  'rating'
]);

export const assessments = pgTable('assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleEs: varchar('title_es', { length: 255 }).notNull(),
  descriptionEn: text('description_en'),
  descriptionEs: text('description_es'),
  instructionsEn: text('instructions_en'),
  instructionsEs: text('instructions_es'),
  estimatedMinutes: integer('estimated_minutes'),
  passingScore: integer('passing_score'),
  maxScore: integer('max_score'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const assessmentQuestions = pgTable('assessment_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  assessmentId: uuid('assessment_id').notNull().references(() => assessments.id, { onDelete: 'cascade' }),
  orderIndex: integer('order_index').notNull(),
  questionType: questionTypeEnum('question_type').notNull(),
  questionTextEn: text('question_text_en').notNull(),
  questionTextEs: text('question_text_es').notNull(),
  helpTextEn: text('help_text_en'),
  helpTextEs: text('help_text_es'),
  optionsEn: jsonb('options_en'),
  optionsEs: jsonb('options_es'),
  correctAnswer: jsonb('correct_answer'),
  points: integer('points').notNull().default(1),
  isRequired: boolean('is_required').notNull().default(true),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const assessmentResponseStatusEnum = pgEnum('assessment_response_status', [
  'in_progress',
  'completed',
  'abandoned'
]);

export const assessmentResponses = pgTable('assessment_responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  familyId: uuid('family_id').references(() => families.id, { onDelete: 'set null' }),
  assessmentId: uuid('assessment_id').notNull().references(() => assessments.id, { onDelete: 'cascade' }),
  stepId: uuid('step_id').references(() => steps.id, { onDelete: 'set null' }),
  status: assessmentResponseStatusEnum('status').notNull().default('in_progress'),
  answers: jsonb('answers').notNull().default('{}'),
  score: integer('score'),
  maxPossibleScore: integer('max_possible_score'),
  percentageScore: integer('percentage_score'),
  passed: boolean('passed'),
  timeTakenSeconds: integer('time_taken_seconds'),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const recommendationTypeEnum = pgEnum('recommendation_type', [
  'content',
  'resource',
  'action',
  'followup'
]);

export const recommendations = pgTable('recommendations', {
  id: uuid('id').primaryKey().defaultRandom(),
  assessmentId: uuid('assessment_id').notNull().references(() => assessments.id, { onDelete: 'cascade' }),
  conditionType: varchar('condition_type', { length: 50 }).notNull(),
  conditionValue: jsonb('condition_value').notNull(),
  recommendationType: recommendationTypeEnum('recommendation_type').notNull(),
  priority: integer('priority').notNull().default(0),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleEs: varchar('title_es', { length: 255 }).notNull(),
  bodyEn: text('body_en').notNull(),
  bodyEs: text('body_es').notNull(),
  resourceUrl: varchar('resource_url', { length: 500 }),
  metadata: jsonb('metadata'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const userRecommendations = pgTable('user_recommendations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  responseId: uuid('response_id').notNull().references(() => assessmentResponses.id, { onDelete: 'cascade' }),
  recommendationId: uuid('recommendation_id').notNull().references(() => recommendations.id, { onDelete: 'cascade' }),
  isViewed: boolean('is_viewed').notNull().default(false),
  isDismissed: boolean('is_dismissed').notNull().default(false),
  viewedAt: timestamp('viewed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export type Assessment = typeof assessments.$inferSelect;
export type NewAssessment = typeof assessments.$inferInsert;
export type AssessmentQuestion = typeof assessmentQuestions.$inferSelect;
export type NewAssessmentQuestion = typeof assessmentQuestions.$inferInsert;
export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
export type NewAssessmentResponse = typeof assessmentResponses.$inferInsert;
export type Recommendation = typeof recommendations.$inferSelect;
export type NewRecommendation = typeof recommendations.$inferInsert;
export type UserRecommendation = typeof userRecommendations.$inferSelect;
export type NewUserRecommendation = typeof userRecommendations.$inferInsert;

export const milestoneTypeEnum = pgEnum('milestone_type', [
  'module_complete',
  'phase_complete',
  'assessment_passed',
  'streak',
  'first_login',
  'profile_complete',
  'custom'
]);

export const milestones = pgTable('milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  milestoneType: milestoneTypeEnum('milestone_type').notNull(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleEs: varchar('title_es', { length: 255 }).notNull(),
  descriptionEn: text('description_en'),
  descriptionEs: text('description_es'),
  iconName: varchar('icon_name', { length: 50 }),
  badgeColor: varchar('badge_color', { length: 20 }),
  points: integer('points').notNull().default(0),
  conditionType: varchar('condition_type', { length: 50 }).notNull(),
  conditionValue: jsonb('condition_value').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const userMilestones = pgTable('user_milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  milestoneId: uuid('milestone_id').notNull().references(() => milestones.id, { onDelete: 'cascade' }),
  earnedAt: timestamp('earned_at').notNull().defaultNow(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const progressEventTypeEnum = pgEnum('progress_event_type', [
  'module_started',
  'module_completed',
  'step_started',
  'step_completed',
  'assessment_started',
  'assessment_completed',
  'milestone_earned',
  'session_started',
  'session_ended'
]);

export const progressEvents = pgTable('progress_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  familyId: uuid('family_id').references(() => families.id, { onDelete: 'set null' }),
  eventType: progressEventTypeEnum('event_type').notNull(),
  moduleId: uuid('module_id').references(() => modules.id, { onDelete: 'set null' }),
  stepId: uuid('step_id').references(() => steps.id, { onDelete: 'set null' }),
  assessmentId: uuid('assessment_id').references(() => assessments.id, { onDelete: 'set null' }),
  milestoneId: uuid('milestone_id').references(() => milestones.id, { onDelete: 'set null' }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export type Milestone = typeof milestones.$inferSelect;
export type NewMilestone = typeof milestones.$inferInsert;
export type UserMilestone = typeof userMilestones.$inferSelect;
export type NewUserMilestone = typeof userMilestones.$inferInsert;
export type ProgressEvent = typeof progressEvents.$inferSelect;
export type NewProgressEvent = typeof progressEvents.$inferInsert;

export const learningPaths = pgTable('learning_paths', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleEs: varchar('title_es', { length: 255 }).notNull(),
  descriptionEn: text('description_en'),
  descriptionEs: text('description_es'),
  imageUrl: varchar('image_url', { length: 500 }),
  orderIndex: integer('order_index').notNull().default(0),
  estimatedWeeks: integer('estimated_weeks'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const learningPathModules = pgTable('learning_path_modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  learningPathId: uuid('learning_path_id').notNull().references(() => learningPaths.id, { onDelete: 'cascade' }),
  moduleId: uuid('module_id').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  orderIndex: integer('order_index').notNull().default(0),
  isRequired: boolean('is_required').notNull().default(true),
  prerequisiteModuleId: uuid('prerequisite_module_id').references(() => modules.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const userLearningPaths = pgTable('user_learning_paths', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  learningPathId: uuid('learning_path_id').notNull().references(() => learningPaths.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).notNull().default('not_started'),
  enrolledAt: timestamp('enrolled_at').notNull().defaultNow(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export type LearningPath = typeof learningPaths.$inferSelect;
export type NewLearningPath = typeof learningPaths.$inferInsert;
export type LearningPathModule = typeof learningPathModules.$inferSelect;
export type NewLearningPathModule = typeof learningPathModules.$inferInsert;
export type UserLearningPath = typeof userLearningPaths.$inferSelect;
export type NewUserLearningPath = typeof userLearningPaths.$inferInsert;

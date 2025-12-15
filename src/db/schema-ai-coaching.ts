import { pgTable, uuid, varchar, text, timestamp, pgEnum, jsonb, boolean, integer } from 'drizzle-orm/pg-core';
import { users, families } from './schema';

export const aiConversationStatusEnum = pgEnum('ai_conversation_status', [
  'active',
  'archived'
]);

export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  familyId: uuid('family_id').references(() => families.id, { onDelete: 'set null' }),
  titleEn: varchar('title_en', { length: 255 }),
  titleEs: varchar('title_es', { length: 255 }),
  status: aiConversationStatusEnum('status').notNull().default('active'),
  messageCount: integer('message_count').notNull().default(0),
  lastMessageAt: timestamp('last_message_at'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const aiMessageRoleEnum = pgEnum('ai_message_role', [
  'user',
  'assistant',
  'system'
]);

export const aiMessages = pgTable('ai_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => aiConversations.id, { onDelete: 'cascade' }),
  role: aiMessageRoleEnum('role').notNull(),
  content: text('content').notNull(),
  contentEs: text('content_es'),
  citations: jsonb('citations'),
  tokensUsed: integer('tokens_used'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const aiKnowledgeBase = pgTable('ai_knowledge_base', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  categoryEn: varchar('category_en', { length: 100 }).notNull(),
  categoryEs: varchar('category_es', { length: 100 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleEs: varchar('title_es', { length: 255 }).notNull(),
  contentEn: text('content_en').notNull(),
  contentEs: text('content_es').notNull(),
  keywords: jsonb('keywords'),
  relatedModuleId: uuid('related_module_id'),
  priority: integer('priority').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  version: integer('version').notNull().default(1),
  approvedBy: uuid('approved_by').references(() => users.id, { onDelete: 'set null' }),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const aiUsageLog = pgTable('ai_usage_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  conversationId: uuid('conversation_id').references(() => aiConversations.id, { onDelete: 'set null' }),
  promptTokens: integer('prompt_tokens').notNull(),
  completionTokens: integer('completion_tokens').notNull(),
  model: varchar('model', { length: 50 }).notNull(),
  wasEscalated: boolean('was_escalated').notNull().default(false),
  escalationReason: text('escalation_reason'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export type AiConversation = typeof aiConversations.$inferSelect;
export type NewAiConversation = typeof aiConversations.$inferInsert;
export type AiMessage = typeof aiMessages.$inferSelect;
export type NewAiMessage = typeof aiMessages.$inferInsert;
export type AiKnowledgeBase = typeof aiKnowledgeBase.$inferSelect;
export type NewAiKnowledgeBase = typeof aiKnowledgeBase.$inferInsert;
export type AiUsageLog = typeof aiUsageLog.$inferSelect;
export type NewAiUsageLog = typeof aiUsageLog.$inferInsert;

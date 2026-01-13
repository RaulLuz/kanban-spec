import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const boards = sqliteTable('boards', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  createdAtIdx: index('idx_boards_created_at').on(table.createdAt),
}));

export const columns = sqliteTable('columns', {
  id: text('id').primaryKey(),
  boardId: text('board_id').notNull().references(() => boards.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  color: text('color').notNull().default('#635FC7'),
  position: integer('position').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  boardIdIdx: index('idx_columns_board_id').on(table.boardId),
  positionIdx: index('idx_columns_position').on(table.boardId, table.position),
}));

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  columnId: text('column_id').notNull().references(() => columns.id, { onDelete: 'cascade' }),
  boardId: text('board_id').notNull().references(() => boards.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  position: integer('position').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  columnIdIdx: index('idx_tasks_column_id').on(table.columnId),
  boardIdIdx: index('idx_tasks_board_id').on(table.boardId),
  positionIdx: index('idx_tasks_position').on(table.columnId, table.position),
}));

export const subtasks = sqliteTable('subtasks', {
  id: text('id').primaryKey(),
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  isCompleted: integer('is_completed', { mode: 'boolean' }).notNull().default(false),
  position: integer('position').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  taskIdIdx: index('idx_subtasks_task_id').on(table.taskId),
  positionIdx: index('idx_subtasks_position').on(table.taskId, table.position),
}));

export const themePreferences = sqliteTable('theme_preferences', {
  id: text('id').primaryKey().default('default'),
  theme: text('theme').notNull().default('light'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

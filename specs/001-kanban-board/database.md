# Database Design: Robust Kanban Board

**Feature**: Robust Kanban Board  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Database Technology

**Database**: SQLite 3  
**Driver**: better-sqlite3 (synchronous, server-side)  
**ORM**: Drizzle ORM  
**Location**: `./data/kanban.db` (development) / user data directory (production)

## Database Schema

### Tables

#### boards

Stores Kanban board information.

```sql
CREATE TABLE boards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  CONSTRAINT boards_name_length CHECK (length(name) >= 1 AND length(name) <= 100)
);
```

**Indexes**:
- `idx_boards_created_at`: `CREATE INDEX idx_boards_created_at ON boards(created_at)`

#### columns

Stores column information within boards.

```sql
CREATE TABLE columns (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#635FC7',
  position INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
  CONSTRAINT columns_name_length CHECK (length(name) >= 1 AND length(name) <= 50),
  CONSTRAINT columns_position_unique UNIQUE (board_id, position),
  CONSTRAINT columns_color_format CHECK (color LIKE '#______')
);
```

**Indexes**:
- `idx_columns_board_id`: `CREATE INDEX idx_columns_board_id ON columns(board_id)`
- `idx_columns_position`: `CREATE INDEX idx_columns_position ON columns(board_id, position)`

#### tasks

Stores task information within columns.

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  column_id TEXT NOT NULL,
  board_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
  CONSTRAINT tasks_title_length CHECK (length(title) >= 1 AND length(title) <= 200),
  CONSTRAINT tasks_description_length CHECK (description IS NULL OR length(description) <= 5000),
  CONSTRAINT tasks_position_unique UNIQUE (column_id, position)
);
```

**Indexes**:
- `idx_tasks_column_id`: `CREATE INDEX idx_tasks_column_id ON tasks(column_id)`
- `idx_tasks_board_id`: `CREATE INDEX idx_tasks_board_id ON tasks(board_id)`
- `idx_tasks_position`: `CREATE INDEX idx_tasks_position ON tasks(column_id, position)`

#### subtasks

Stores subtask information within tasks.

```sql
CREATE TABLE subtasks (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  title TEXT NOT NULL,
  is_completed INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  CONSTRAINT subtasks_title_length CHECK (length(title) >= 1 AND length(title) <= 200),
  CONSTRAINT subtasks_is_completed CHECK (is_completed IN (0, 1)),
  CONSTRAINT subtasks_position_unique UNIQUE (task_id, position)
);
```

**Indexes**:
- `idx_subtasks_task_id`: `CREATE INDEX idx_subtasks_task_id ON subtasks(task_id)`
- `idx_subtasks_position`: `CREATE INDEX idx_subtasks_position ON subtasks(task_id, position)`

#### theme_preferences

Stores user theme preference (light/dark mode).

```sql
CREATE TABLE theme_preferences (
  id TEXT PRIMARY KEY DEFAULT 'default',
  theme TEXT NOT NULL DEFAULT 'light',
  updated_at INTEGER NOT NULL,
  CONSTRAINT theme_preferences_theme CHECK (theme IN ('light', 'dark'))
);
```

## Drizzle Schema Definition

```typescript
// src/lib/db/schema.ts
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
```

## Database Connection

```typescript
// src/lib/db/index.ts
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

const dbPath = process.env.DATABASE_PATH || './data/kanban.db';
const sqlite = new Database(dbPath);

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });
export type Database = typeof db;
```

## Migrations

Migrations managed by Drizzle Kit:

```bash
# Generate migration
npm run db:generate

# Run migrations
npm run db:migrate

# Push schema (dev only)
npm run db:push
```

Migration files stored in `src/lib/db/migrations/` with versioning.

## Database Operations

### Transactions

All multi-table operations use transactions:

```typescript
db.transaction((tx) => {
  // Multiple operations
  tx.insert(boards).values(...);
  tx.insert(columns).values(...);
});
```

### Query Patterns

- **Select with relations**: Use Drizzle relations API
- **Position updates**: Use transactions to maintain consistency
- **Cascade deletes**: Handled by foreign key constraints
- **Bulk operations**: Use batch inserts/updates for performance

## Performance Considerations

### Indexing Strategy
- Foreign keys indexed for join performance
- Position columns indexed for ordering
- Created_at indexed for sorting

### Query Optimization
- Use prepared statements for repeated queries
- Batch operations in transactions
- Limit result sets with pagination if needed
- Use SELECT with specific columns (not SELECT *)

### Database Size
- SQLite supports databases up to 281TB
- For 1000 boards × 100 tasks × 10 subtasks ≈ 1.1M rows
- Estimated database size: ~50-100MB (well within limits)

## Backup and Recovery

### Backup Strategy
- Database file can be copied for backup
- Implement export/import functionality for user data
- Future: Cloud sync capability

### Recovery
- Foreign key constraints prevent orphaned records
- Transactions ensure atomicity
- Migration system handles schema updates

## Testing Database

### Test Database Setup
- Use in-memory SQLite for unit tests: `:memory:`
- Use separate test database file for integration tests
- Reset database between test suites

### Test Utilities
```typescript
// tests/unit/db/test-utils.ts
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

export function createTestDb() {
  const sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');
  return drizzle(sqlite, { schema });
}
```

## Environment Variables

```env
# Database
DATABASE_PATH=./data/kanban.db

# Development
NODE_ENV=development

# Production (future)
DATABASE_BACKUP_PATH=./backups
```

## Database Initialization

On first run:
1. Check if database file exists
2. If not, create database file
3. Run migrations to create schema
4. Create default board with default columns if no boards exist
5. Initialize theme preference to 'light'

## Data Integrity

### Constraints
- Foreign key constraints ensure referential integrity
- Check constraints validate data format and length
- Unique constraints prevent duplicates (position within parent)

### Validation
- Application layer validates before database operations
- Database constraints provide second layer of validation
- Type safety via Drizzle ORM prevents type errors

## Future Enhancements

- Database encryption (SQLCipher)
- Cloud sync (sync database file to cloud storage)
- Multi-user support (add user_id to tables)
- Database replication for backup
- Query performance monitoring
- Database analytics and insights

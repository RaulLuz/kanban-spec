# Data Model: Robust Kanban Board

**Feature**: Robust Kanban Board  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Entity Definitions

### Board

Represents a Kanban board container that organizes tasks into columns.

**Attributes**:
- `id`: string (unique identifier, UUID)
- `name`: string (board name, required, max 100 chars)
- `columns`: Column[] (array of columns in this board)
- `createdAt`: Date (timestamp when board was created)
- `updatedAt`: Date (timestamp when board was last modified)

**Relationships**:
- Has many Columns (one-to-many)
- Belongs to User (future: multi-user support)

**Validation Rules**:
- Name must be non-empty string
- Name length between 1 and 100 characters
- Must have at least one column (default columns: "Todo", "Doing", "Done")

**State Transitions**:
- Created → Active (when created)
- Active → Deleted (when deleted)

**Business Rules**:
- Board name must be unique per user
- Cannot delete board if it's the last remaining board
- When board is deleted, all associated columns and tasks are deleted

### Column

Represents a workflow stage within a board. Tasks are organized into columns.

**Attributes**:
- `id`: string (unique identifier, UUID)
- `boardId`: string (foreign key to Board)
- `name`: string (column name, required, max 50 chars)
- `color`: string (hex color code for color indicator, default: #635FC7)
- `position`: number (order/position of column in board, 0-indexed)
- `tasks`: Task[] (array of tasks in this column)
- `createdAt`: Date (timestamp when column was created)
- `updatedAt`: Date (timestamp when column was last modified)

**Relationships**:
- Belongs to Board (many-to-one)
- Has many Tasks (one-to-many)

**Validation Rules**:
- Name must be non-empty string
- Name length between 1 and 50 characters
- Color must be valid hex color code (format: #RRGGBB)
- Position must be non-negative integer
- Position must be unique within a board

**State Transitions**:
- Created → Active (when created)
- Active → Deleted (when deleted)
- Position can change (when reordered)

**Business Rules**:
- Column name must be unique within a board
- Cannot delete column if it's the last column in board
- When column is deleted, all tasks move to a default column or are deleted
- Color indicator must be visible and accessible (contrast requirements)

### Task

Represents a work item that can be moved between columns and contains subtasks.

**Attributes**:
- `id`: string (unique identifier, UUID)
- `columnId`: string (foreign key to Column, current column)
- `boardId`: string (foreign key to Board, for quick access)
- `title`: string (task title, required, max 200 chars)
- `description`: string (task description, optional, max 5000 chars)
- `status`: string (task status, enum: "todo" | "doing" | "done", derived from column)
- `position`: number (order/position of task within column, 0-indexed)
- `subtasks`: Subtask[] (array of subtasks)
- `createdAt`: Date (timestamp when task was created)
- `updatedAt`: Date (timestamp when task was last modified)

**Relationships**:
- Belongs to Column (many-to-one)
- Belongs to Board (many-to-one, denormalized for performance)
- Has many Subtasks (one-to-many)

**Validation Rules**:
- Title must be non-empty string
- Title length between 1 and 200 characters
- Description length max 5000 characters
- Position must be non-negative integer
- Position must be unique within a column

**State Transitions**:
- Created → Todo (when created, default status)
- Todo → Doing (when moved to "Doing" column)
- Doing → Done (when moved to "Done" column)
- Any → Any (when moved between columns, status updates automatically)
- Position can change (when reordered within column or moved between columns)

**Business Rules**:
- Task status is derived from column name/type (not stored separately)
- When task is moved to new column, status updates automatically
- Task position updates when moved within or between columns
- Subtask completion does not affect task status (separate concerns)

### Subtask

Represents a sub-item within a task, displayed as a checkbox.

**Attributes**:
- `id`: string (unique identifier, UUID)
- `taskId`: string (foreign key to Task)
- `title`: string (subtask title/description, required, max 200 chars)
- `isCompleted`: boolean (completion status, default: false)
- `position`: number (order/position of subtask within task, 0-indexed)
- `createdAt`: Date (timestamp when subtask was created)
- `updatedAt`: Date (timestamp when subtask was last modified)

**Relationships**:
- Belongs to Task (many-to-one)

**Validation Rules**:
- Title must be non-empty string
- Title length between 1 and 200 characters
- Position must be non-negative integer
- Position must be unique within a task

**State Transitions**:
- Created → Incomplete (isCompleted: false)
- Incomplete → Completed (isCompleted: true, when checkbox checked)
- Completed → Incomplete (isCompleted: false, when checkbox unchecked)

**Business Rules**:
- Subtask completion is independent of task status
- Subtask position can be reordered
- When task is deleted, all subtasks are deleted

## Data Relationships Diagram

```
User (future)
  └── has many ──> Board
                    └── has many ──> Column
                                      └── has many ──> Task
                                                        └── has many ──> Subtask
```

## Database Schema

### SQLite Tables

See [database.md](./database.md) for complete database schema definition.

**Tables**:
- `boards`: Board entities
- `columns`: Column entities (foreign key to boards)
- `tasks`: Task entities (foreign key to columns and boards)
- `subtasks`: Subtask entities (foreign key to tasks)
- `theme_preferences`: Theme preference storage

**Relationships**:
- boards → columns (one-to-many, CASCADE delete)
- boards → tasks (one-to-many, CASCADE delete)
- columns → tasks (one-to-many, CASCADE delete)
- tasks → subtasks (one-to-many, CASCADE delete)

**Indexes**:
- Foreign keys indexed for join performance
- Position columns indexed for ordering
- Created_at indexed for sorting

## Data Validation

### Board Validation
- Name: Required, 1-100 characters, trimmed
- Columns: Must have at least one column

### Column Validation
- Name: Required, 1-50 characters, trimmed
- Color: Valid hex color (#RRGGBB format)
- Position: Non-negative integer, unique within board

### Task Validation
- Title: Required, 1-200 characters, trimmed
- Description: Optional, max 5000 characters
- Position: Non-negative integer, unique within column

### Subtask Validation
- Title: Required, 1-200 characters, trimmed
- Position: Non-negative integer, unique within task

## Data Migration

### Database Migrations
- Migrations managed by Drizzle Kit
- Migration files in `src/lib/db/migrations/`
- Automatic migration on app startup
- Version tracking in database

### Initial Data Setup
- Run migrations to create schema
- Create default board with name "My Board" if no boards exist
- Create default columns: "Todo", "Doing", "Done" for new boards
- Set default theme: "light" in theme_preferences table

### Future Migrations
- Add user authentication (multi-user support)
- Add indexes for performance optimization
- Add database encryption (SQLCipher)
- Add cloud sync capabilities

## Performance Considerations

### Optimization Strategies
- Denormalize boardId in Task for faster queries (stored in tasks table)
- Index columns by boardId and position
- Index tasks by columnId, boardId, and position
- Use prepared statements for repeated queries
- Batch operations in transactions
- Cache computed values (subtask completion counts) in application layer
- Lazy load task details (only load full task when modal opens)
- Use SELECT with specific columns (not SELECT *)

### Data Size Estimates
- Board row: ~200 bytes
- Column row: ~150 bytes
- Task row: ~500 bytes (without subtasks)
- Subtask row: ~100 bytes
- Estimated: 1000 boards × 100 tasks × 10 subtasks ≈ 1.1M rows
- Database size: ~50-100MB (well within SQLite limits of 281TB)

### Query Performance
- Foreign key indexes ensure fast JOINs
- Position indexes enable efficient ordering
- Transactions ensure atomic bulk operations
- Prepared statements improve repeated query performance

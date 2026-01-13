# API Contracts: Robust Kanban Board

**Feature**: Robust Kanban Board  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the API contracts for the Kanban board application. All operations are handled via Next.js API routes that interact with SQLite database using Drizzle ORM. API routes provide RESTful endpoints for all data operations.

## Service Contracts

### BoardService

Manages board operations (create, read, update, delete).

#### `createBoard(name: string): Board`
Creates a new board with default columns.

**Parameters**:
- `name`: string (required, 1-100 chars)

**Returns**: Board object

**Errors**:
- ValidationError if name is invalid
- StorageError if storage operation fails

#### `getBoard(id: string): Board | null`
Retrieves a board by ID.

**Parameters**:
- `id`: string (required, UUID)

**Returns**: Board object or null if not found

**Errors**:
- StorageError if storage operation fails

#### `getAllBoards(): Board[]`
Retrieves all boards.

**Returns**: Array of Board objects

**Errors**:
- StorageError if storage operation fails

#### `updateBoard(id: string, updates: Partial<Board>): Board`
Updates board properties.

**Parameters**:
- `id`: string (required, UUID)
- `updates`: Partial<Board> (name, etc.)

**Returns**: Updated Board object

**Errors**:
- NotFoundError if board doesn't exist
- ValidationError if updates are invalid
- StorageError if storage operation fails

#### `deleteBoard(id: string): void`
Deletes a board and all associated data.

**Parameters**:
- `id`: string (required, UUID)

**Returns**: void

**Errors**:
- NotFoundError if board doesn't exist
- BusinessRuleError if trying to delete last board
- StorageError if storage operation fails

### ColumnService

Manages column operations within a board.

#### `createColumn(boardId: string, name: string, color?: string): Column`
Creates a new column in a board.

**Parameters**:
- `boardId`: string (required, UUID)
- `name`: string (required, 1-50 chars)
- `color`: string (optional, hex color, default: #635FC7)

**Returns**: Column object

**Errors**:
- NotFoundError if board doesn't exist
- ValidationError if name/color invalid
- StorageError if storage operation fails

#### `updateColumn(id: string, updates: Partial<Column>): Column`
Updates column properties (name, color, position).

**Parameters**:
- `id`: string (required, UUID)
- `updates`: Partial<Column>

**Returns**: Updated Column object

**Errors**:
- NotFoundError if column doesn't exist
- ValidationError if updates invalid
- StorageError if storage operation fails

#### `deleteColumn(id: string): void`
Deletes a column and moves tasks to default column.

**Parameters**:
- `id`: string (required, UUID)

**Returns**: void

**Errors**:
- NotFoundError if column doesn't exist
- BusinessRuleError if trying to delete last column
- StorageError if storage operation fails

#### `reorderColumns(boardId: string, columnIds: string[]): Column[]`
Reorders columns within a board.

**Parameters**:
- `boardId`: string (required, UUID)
- `columnIds`: string[] (ordered array of column IDs)

**Returns**: Array of reordered Column objects

**Errors**:
- NotFoundError if board doesn't exist
- ValidationError if columnIds invalid
- StorageError if storage operation fails

### TaskService

Manages task operations within columns.

#### `createTask(columnId: string, title: string, description?: string): Task`
Creates a new task in a column.

**Parameters**:
- `columnId`: string (required, UUID)
- `title`: string (required, 1-200 chars)
- `description`: string (optional, max 5000 chars)

**Returns**: Task object

**Errors**:
- NotFoundError if column doesn't exist
- ValidationError if title invalid
- StorageError if storage operation fails

#### `getTask(id: string): Task | null`
Retrieves a task by ID.

**Parameters**:
- `id`: string (required, UUID)

**Returns**: Task object or null if not found

**Errors**:
- StorageError if storage operation fails

#### `updateTask(id: string, updates: Partial<Task>): Task`
Updates task properties.

**Parameters**:
- `id`: string (required, UUID)
- `updates`: Partial<Task> (title, description, etc.)

**Returns**: Updated Task object

**Errors**:
- NotFoundError if task doesn't exist
- ValidationError if updates invalid
- StorageError if storage operation fails

#### `deleteTask(id: string): void`
Deletes a task and all subtasks.

**Parameters**:
- `id`: string (required, UUID)

**Returns**: void

**Errors**:
- NotFoundError if task doesn't exist
- StorageError if storage operation fails

#### `moveTask(taskId: string, targetColumnId: string, position?: number): Task`
Moves a task to a different column (drag and drop).

**Parameters**:
- `taskId`: string (required, UUID)
- `targetColumnId`: string (required, UUID)
- `position`: number (optional, target position in column)

**Returns**: Updated Task object

**Errors**:
- NotFoundError if task or column doesn't exist
- ValidationError if position invalid
- StorageError if storage operation fails

#### `reorderTask(taskId: string, newPosition: number): Task`
Reorders a task within its column.

**Parameters**:
- `taskId`: string (required, UUID)
- `newPosition`: number (required, 0-indexed)

**Returns**: Updated Task object

**Errors**:
- NotFoundError if task doesn't exist
- ValidationError if position invalid
- StorageError if storage operation fails

### SubtaskService

Manages subtask operations within tasks.

#### `createSubtask(taskId: string, title: string): Subtask`
Creates a new subtask for a task.

**Parameters**:
- `taskId`: string (required, UUID)
- `title`: string (required, 1-200 chars)

**Returns**: Subtask object

**Errors**:
- NotFoundError if task doesn't exist
- ValidationError if title invalid
- StorageError if storage operation fails

#### `updateSubtask(id: string, updates: Partial<Subtask>): Subtask`
Updates subtask properties (title, isCompleted, position).

**Parameters**:
- `id`: string (required, UUID)
- `updates`: Partial<Subtask>

**Returns**: Updated Subtask object

**Errors**:
- NotFoundError if subtask doesn't exist
- ValidationError if updates invalid
- StorageError if storage operation fails

#### `toggleSubtask(id: string): Subtask`
Toggles subtask completion status.

**Parameters**:
- `id`: string (required, UUID)

**Returns**: Updated Subtask object

**Errors**:
- NotFoundError if subtask doesn't exist
- StorageError if storage operation fails

#### `deleteSubtask(id: string): void`
Deletes a subtask.

**Parameters**:
- `id`: string (required, UUID)

**Returns**: void

**Errors**:
- NotFoundError if subtask doesn't exist
- StorageError if storage operation fails

#### `reorderSubtasks(taskId: string, subtaskIds: string[]): Subtask[]`
Reorders subtasks within a task.

**Parameters**:
- `taskId`: string (required, UUID)
- `subtaskIds`: string[] (ordered array of subtask IDs)

**Returns**: Array of reordered Subtask objects

**Errors**:
- NotFoundError if task doesn't exist
- ValidationError if subtaskIds invalid
- StorageError if storage operation fails

### ThemeService

Manages theme (light/dark mode) operations.

#### `getTheme(): 'light' | 'dark'`
Retrieves current theme preference.

**Returns**: Theme string

**Errors**: None (defaults to 'light')

#### `setTheme(theme: 'light' | 'dark'): void`
Sets theme preference and persists.

**Parameters**:
- `theme`: 'light' | 'dark' (required)

**Returns**: void

**Errors**:
- StorageError if storage operation fails

#### `toggleTheme(): 'light' | 'dark'`
Toggles between light and dark theme.

**Returns**: New theme string

**Errors**:
- StorageError if storage operation fails

### StorageService

Abstracts storage operations (LocalStorage initially).

#### `save(key: string, data: any): void`
Saves data to storage.

**Parameters**:
- `key`: string (required)
- `data`: any (required, must be serializable)

**Returns**: void

**Errors**:
- StorageError if storage quota exceeded
- StorageError if storage operation fails

#### `load<T>(key: string): T | null`
Loads data from storage.

**Parameters**:
- `key`: string (required)

**Returns**: Data of type T or null if not found

**Errors**:
- StorageError if storage operation fails

#### `remove(key: string): void`
Removes data from storage.

**Parameters**:
- `key`: string (required)

**Returns**: void

**Errors**:
- StorageError if storage operation fails

## Error Types

### ValidationError
Thrown when input validation fails.

**Properties**:
- `message`: string (human-readable error message)
- `field`: string (field that failed validation)
- `value`: any (invalid value)

### NotFoundError
Thrown when requested resource doesn't exist.

**Properties**:
- `message`: string (human-readable error message)
- `resource`: string (resource type: 'board', 'column', 'task', 'subtask')
- `id`: string (ID of missing resource)

### BusinessRuleError
Thrown when business rule violation occurs.

**Properties**:
- `message`: string (human-readable error message)
- `rule`: string (violated business rule)

### StorageError
Thrown when storage operation fails.

**Properties**:
- `message`: string (human-readable error message)
- `operation`: string (failed operation: 'save', 'load', 'remove')
- `originalError`: Error (original error if available)

## Next.js API Routes

All service contracts map to Next.js API routes:

### Board Endpoints

- `GET /api/boards` - List all boards
  - Response: `{ boards: Board[] }`
  - Status: 200

- `POST /api/boards` - Create board
  - Body: `{ name: string }`
  - Response: `{ board: Board }`
  - Status: 201

- `GET /api/boards/[id]` - Get board with columns and tasks
  - Response: `{ board: Board, columns: Column[], tasks: Task[] }`
  - Status: 200, 404

- `PATCH /api/boards/[id]` - Update board
  - Body: `{ name?: string }`
  - Response: `{ board: Board }`
  - Status: 200, 404

- `DELETE /api/boards/[id]` - Delete board
  - Response: `{ success: boolean }`
  - Status: 200, 404, 400 (if last board)

### Column Endpoints

- `POST /api/columns` - Create column
  - Body: `{ boardId: string, name: string, color?: string }`
  - Response: `{ column: Column }`
  - Status: 201, 404

- `PATCH /api/columns/[id]` - Update column
  - Body: `{ name?: string, color?: string, position?: number }`
  - Response: `{ column: Column }`
  - Status: 200, 404

- `DELETE /api/columns/[id]` - Delete column
  - Response: `{ success: boolean }`
  - Status: 200, 404, 400 (if last column)

- `PATCH /api/columns/reorder` - Reorder columns
  - Body: `{ boardId: string, columnIds: string[] }`
  - Response: `{ columns: Column[] }`
  - Status: 200, 404

### Task Endpoints

- `POST /api/tasks` - Create task
  - Body: `{ columnId: string, title: string, description?: string }`
  - Response: `{ task: Task }`
  - Status: 201, 404

- `GET /api/tasks/[id]` - Get task with subtasks
  - Response: `{ task: Task, subtasks: Subtask[] }`
  - Status: 200, 404

- `PATCH /api/tasks/[id]` - Update task
  - Body: `{ title?: string, description?: string, position?: number }`
  - Response: `{ task: Task }`
  - Status: 200, 404

- `DELETE /api/tasks/[id]` - Delete task
  - Response: `{ success: boolean }`
  - Status: 200, 404

- `PATCH /api/tasks/[id]/move` - Move task to different column
  - Body: `{ targetColumnId: string, position?: number }`
  - Response: `{ task: Task }`
  - Status: 200, 404

- `PATCH /api/tasks/reorder` - Reorder tasks within column
  - Body: `{ columnId: string, taskIds: string[] }`
  - Response: `{ tasks: Task[] }`
  - Status: 200, 404

### Subtask Endpoints

- `POST /api/subtasks` - Create subtask
  - Body: `{ taskId: string, title: string }`
  - Response: `{ subtask: Subtask }`
  - Status: 201, 404

- `PATCH /api/subtasks/[id]` - Update subtask
  - Body: `{ title?: string, isCompleted?: boolean, position?: number }`
  - Response: `{ subtask: Subtask }`
  - Status: 200, 404

- `DELETE /api/subtasks/[id]` - Delete subtask
  - Response: `{ success: boolean }`
  - Status: 200, 404

- `PATCH /api/subtasks/[id]/toggle` - Toggle subtask completion
  - Response: `{ subtask: Subtask }`
  - Status: 200, 404

### Theme Endpoint

- `GET /api/theme` - Get theme preference
  - Response: `{ theme: 'light' | 'dark' }`
  - Status: 200

- `PATCH /api/theme` - Update theme preference
  - Body: `{ theme: 'light' | 'dark' }`
  - Response: `{ theme: 'light' | 'dark' }`
  - Status: 200

## Error Responses

All endpoints return consistent error format:

```typescript
{
  error: {
    code: string,        // 'VALIDATION_ERROR', 'NOT_FOUND', 'BUSINESS_RULE_ERROR', 'STORAGE_ERROR'
    message: string,     // Human-readable error message
    field?: string,      // Field that failed validation (if applicable)
    details?: any        // Additional error details
  }
}
```

**Status Codes**:
- 200: Success
- 201: Created
- 400: Bad Request (validation error, business rule violation)
- 404: Not Found
- 500: Internal Server Error

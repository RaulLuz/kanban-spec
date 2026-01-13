import Database from 'better-sqlite3';

/**
 * Run database migrations
 * This is a simple migration runner - in production, use drizzle-kit migrations
 */
export async function runMigrations() {
  const dbPath = process.env.DATABASE_PATH || './data/kanban.db';
  const sqlite = new Database(dbPath);
  
  try {
    // Create tables if they don't exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS boards (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        CHECK (length(name) >= 1 AND length(name) <= 100)
      );

      CREATE INDEX IF NOT EXISTS idx_boards_created_at ON boards(created_at);

      CREATE TABLE IF NOT EXISTS columns (
        id TEXT PRIMARY KEY,
        board_id TEXT NOT NULL,
        name TEXT NOT NULL,
        color TEXT NOT NULL DEFAULT '#635FC7',
        position INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
        CHECK (length(name) >= 1 AND length(name) <= 50),
        CHECK (color LIKE '#______'),
        UNIQUE (board_id, position)
      );

      CREATE INDEX IF NOT EXISTS idx_columns_board_id ON columns(board_id);
      CREATE INDEX IF NOT EXISTS idx_columns_position ON columns(board_id, position);

      CREATE TABLE IF NOT EXISTS tasks (
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
        CHECK (length(title) >= 1 AND length(title) <= 200),
        CHECK (description IS NULL OR length(description) <= 5000),
        UNIQUE (column_id, position)
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_column_id ON tasks(column_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_board_id ON tasks(board_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_position ON tasks(column_id, position);

      CREATE TABLE IF NOT EXISTS subtasks (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL,
        title TEXT NOT NULL,
        is_completed INTEGER NOT NULL DEFAULT 0,
        position INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        CHECK (length(title) >= 1 AND length(title) <= 200),
        CHECK (is_completed IN (0, 1)),
        UNIQUE (task_id, position)
      );

      CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON subtasks(task_id);
      CREATE INDEX IF NOT EXISTS idx_subtasks_position ON subtasks(task_id, position);

      CREATE TABLE IF NOT EXISTS theme_preferences (
        id TEXT PRIMARY KEY DEFAULT 'default',
        theme TEXT NOT NULL DEFAULT 'light',
        updated_at INTEGER NOT NULL,
        CHECK (theme IN ('light', 'dark'))
      );
    `);

    // Enable foreign keys
    sqlite.pragma('foreign_keys = ON');
  } finally {
    sqlite.close();
  }
}

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';
import { runMigrations } from './migrate';
import { initializeDatabase } from './init';

const dbPath = process.env.DATABASE_PATH || './data/kanban.db';

// Ensure data directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(dbPath);

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

// Run migrations on startup
runMigrations().catch(console.error);

// Initialize database with default board if needed
initializeDatabase().catch(console.error);

export const db = drizzle(sqlite, { schema });
export type Database = typeof db;

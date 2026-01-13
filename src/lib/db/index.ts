import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type Database from 'better-sqlite3';
import * as schema from './schema';

let sqliteInstance: Database | null = null;
let dbInstance: BetterSQLite3Database<typeof schema> | null = null;
let isInitialized = false;

/**
 * Check if we're in a build context
 */
function isBuildContext(): boolean {
  // During Next.js build, these conditions are true
  return (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-development-build' ||
    // Check if we're in webpack compilation
    typeof process.env.WEBPACK !== 'undefined'
  );
}

/**
 * Get or create database connection
 * Lazy initialization to avoid issues during Next.js build
 */
function getDatabase(): BetterSQLite3Database<typeof schema> {
  // Never initialize during build
  if (isBuildContext()) {
    throw new Error('Database not available during build');
  }

  // Only initialize in server-side runtime
  if (typeof window !== 'undefined') {
    throw new Error('Database can only be accessed on the server');
  }

  if (!sqliteInstance) {
    try {
      // Dynamic import to avoid loading during build
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const BetterSqlite3Database = require('better-sqlite3');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const path = require('path');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs');

      // Use /tmp in Vercel (only writable directory) or DATABASE_PATH env var
      let dbPath = process.env.DATABASE_PATH;
      
      if (!dbPath) {
        // Check if we're in Vercel
        if (process.env.VERCEL || process.env.VERCEL_ENV) {
          // Use /tmp in Vercel serverless functions
          dbPath = '/tmp/kanban.db';
        } else {
          // Local development
          dbPath = './data/kanban.db';
        }
      }

      // Ensure data directory exists (only for local paths)
      if (!dbPath.startsWith('/tmp') && !dbPath.startsWith('/')) {
        const dbDir = path.dirname(dbPath);
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }
      }

      const instance = new BetterSqlite3Database(dbPath);
      instance.pragma('foreign_keys = ON');
      sqliteInstance = instance;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new Error(`Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  if (!dbInstance && sqliteInstance) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { drizzle } = require('drizzle-orm/better-sqlite3');
    dbInstance = drizzle(sqliteInstance, { schema });
  }

  if (!dbInstance) {
    throw new Error('Failed to initialize database');
  }

  // Initialize database only once, and only in runtime (not during build)
  if (!isInitialized) {
    isInitialized = true;
    // Use dynamic imports to avoid loading during build
    Promise.all([
      import('./migrate').then(m => m.runMigrations()),
      import('./init').then(m => m.initializeDatabase())
    ]).catch(console.error);
  }

  return dbInstance;
}

export const db = new Proxy({} as BetterSQLite3Database<typeof schema>, {
  get(_target, prop) {
    // During build, return a no-op to avoid errors
    if (isBuildContext()) {
      return () => {
        throw new Error('Database not available during build');
      };
    }
    const db = getDatabase();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (db as any)[prop];
    return typeof value === 'function' ? value.bind(db) : value;
  },
});

export type Database = BetterSQLite3Database<typeof schema>;

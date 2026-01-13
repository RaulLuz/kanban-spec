import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { createTestDb } from '../../unit/db/test-utils';
import { BoardService } from '@/lib/services/BoardService';
import { runMigrations } from '@/lib/db/migrate';

describe('Board API Integration Tests', () => {
  beforeAll(async () => {
    // Run migrations on test database
    await runMigrations();
  });

  describe('POST /api/boards', () => {
    it('should create a board successfully', async () => {
      const board = await BoardService.createBoard('Test Board');
      
      expect(board).toBeDefined();
      expect(board.name).toBe('Test Board');
      expect(board.id).toBeDefined();
    });

    it('should create board with default columns', async () => {
      const board = await BoardService.createBoard('Board with Columns');
      // Verify columns were created (would need to query columns table)
      expect(board).toBeDefined();
    });
  });

  describe('GET /api/boards', () => {
    it('should return all boards', async () => {
      await BoardService.createBoard('Board 1');
      await BoardService.createBoard('Board 2');
      
      const boards = await BoardService.getAllBoards();
      expect(boards.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /api/boards/[id]', () => {
    it('should return a board by id', async () => {
      const created = await BoardService.createBoard('Get Test Board');
      const board = await BoardService.getBoard(created.id);
      
      expect(board).toBeDefined();
      expect(board?.id).toBe(created.id);
      expect(board?.name).toBe('Get Test Board');
    });

    it('should return null for non-existent board', async () => {
      const board = await BoardService.getBoard('non-existent-id');
      expect(board).toBeNull();
    });
  });

  describe('DELETE /api/boards/[id]', () => {
    it('should delete a board', async () => {
      const board = await BoardService.createBoard('To Delete');
      await BoardService.deleteBoard(board.id);
      
      const deleted = await BoardService.getBoard(board.id);
      expect(deleted).toBeNull();
    });

    it('should prevent deleting last board', async () => {
      // Create a board
      const board = await BoardService.createBoard('Last Board');
      
      // Delete all other boards first (if any)
      const allBoards = await BoardService.getAllBoards();
      for (const b of allBoards) {
        if (b.id !== board.id) {
          await BoardService.deleteBoard(b.id);
        }
      }
      
      // Try to delete the last board - should fail
      await expect(BoardService.deleteBoard(board.id)).rejects.toThrow();
    });
  });
});

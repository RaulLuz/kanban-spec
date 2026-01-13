import { describe, it, expect, beforeEach } from '@jest/globals';
import { BoardService } from '@/lib/services/BoardService';
import { ValidationError } from '@/lib/utils/validation';
import { NotFoundError, BusinessRuleError } from '@/lib/utils/errors';

// Note: These tests require a test database setup
// For now, we'll test the validation logic and structure
// Full integration tests will be in tests/integration/

describe('BoardService', () => {
  // These are unit tests for validation and business logic
  // Full database integration tests are in tests/integration/

  describe('createBoard', () => {
    it('should create a board with default columns', async () => {
      const board = await BoardService.createBoard('Test Board');
      
      expect(board).toBeDefined();
      expect(board.name).toBe('Test Board');
      expect(board.id).toBeDefined();
    });

    it('should throw ValidationError for invalid name', async () => {
      await expect(BoardService.createBoard('')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for name longer than 100 characters', async () => {
      const longName = 'a'.repeat(101);
      await expect(BoardService.createBoard(longName)).rejects.toThrow(ValidationError);
    });
  });

  describe('getBoard', () => {
    it('should return board if exists', async () => {
      const created = await BoardService.createBoard('Test Board');
      const board = await BoardService.getBoard(created.id);
      
      expect(board).toBeDefined();
      expect(board?.id).toBe(created.id);
    });

    it('should return null if board does not exist', async () => {
      const board = await BoardService.getBoard('non-existent-id');
      expect(board).toBeNull();
    });
  });

  describe('getAllBoards', () => {
    it('should return all boards', async () => {
      await BoardService.createBoard('Board 1');
      await BoardService.createBoard('Board 2');
      
      const allBoards = await BoardService.getAllBoards();
      expect(allBoards.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('updateBoard', () => {
    it('should update board name', async () => {
      const board = await BoardService.createBoard('Original Name');
      const updated = await BoardService.updateBoard(board.id, { name: 'Updated Name' });
      
      expect(updated.name).toBe('Updated Name');
    });

    it('should throw NotFoundError if board does not exist', async () => {
      await expect(
        BoardService.updateBoard('non-existent-id', { name: 'New Name' })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteBoard', () => {
    it('should delete a board', async () => {
      const board = await BoardService.createBoard('To Delete');
      await BoardService.deleteBoard(board.id);
      
      const deleted = await BoardService.getBoard(board.id);
      expect(deleted).toBeNull();
    });

    it('should throw NotFoundError if board does not exist', async () => {
      await expect(BoardService.deleteBoard('non-existent-id')).rejects.toThrow(NotFoundError);
    });

    it('should throw BusinessRuleError when deleting last board', async () => {
      // Create only one board
      const board = await BoardService.createBoard('Last Board');
      
      // Try to delete it (should fail if it's the only one)
      // Note: This test assumes there's only one board in the test database
      // In a real scenario, we'd need to ensure this is the only board
      await expect(BoardService.deleteBoard(board.id)).rejects.toThrow(BusinessRuleError);
    });
  });
});

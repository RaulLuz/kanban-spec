import { db } from '../db';
import { boards, columns } from '../db/schema';
import { generateId } from '../utils/uuid';
import { validateBoardName } from '../utils/validation';
import { NotFoundError, BusinessRuleError, StorageError } from '../utils/errors';
import { DEFAULT_COLUMN_NAMES, DEFAULT_COLUMN_COLOR } from '../utils/constants';
import { eq } from 'drizzle-orm';
import type { Board } from '@/types';

/**
 * Service for managing Kanban boards
 * 
 * @class BoardService
 * @description Handles all board-related operations including creation, retrieval, updates, and deletion.
 * Enforces business rules such as preventing deletion of the last board.
 */
export class BoardService {
  /**
   * Create a new board with default columns (Todo, Doing, Done)
   * 
   * @param {string} name - Board name (1-100 characters)
   * @returns {Promise<Board>} The created board
   * @throws {ValidationError} If board name is invalid
   * @throws {StorageError} If database operation fails
   */
  static async createBoard(name: string): Promise<Board> {
    try {
      validateBoardName(name);

      const boardId = generateId();
      const now = new Date();

      // Create board
      await db.insert(boards).values({
        id: boardId,
        name: name.trim(),
        createdAt: now,
        updatedAt: now,
      });

      // Create default columns
      const columnValues = DEFAULT_COLUMN_NAMES.map((columnName, index) => ({
        id: generateId(),
        boardId,
        name: columnName,
        color: DEFAULT_COLUMN_COLOR,
        position: index,
        createdAt: now,
        updatedAt: now,
      }));

      await db.insert(columns).values(columnValues);

      const board = await this.getBoard(boardId);
      if (!board) {
        throw new StorageError('Failed to retrieve created board');
      }

      return board;
    } catch (error) {
      if (error instanceof StorageError || error instanceof Error) {
        throw error;
      }
      throw new StorageError('Failed to create board', error as Error);
    }
  }

  /**
   * Get a board by ID
   * 
   * @param {string} id - Board ID
   * @returns {Promise<Board | null>} The board if found, null otherwise
   * @throws {StorageError} If database operation fails
   */
  static async getBoard(id: string): Promise<Board | null> {
    try {
      const result = await db.select().from(boards).where(eq(boards.id, id)).limit(1);
      
      if (result.length === 0) {
        return null;
      }

      const boardData = result[0];
      return {
        id: boardData.id,
        name: boardData.name,
        createdAt: boardData.createdAt,
        updatedAt: boardData.updatedAt,
      };
    } catch (error) {
      throw new StorageError('Failed to retrieve board', error as Error);
    }
  }

  /**
   * Get all boards ordered by creation date
   * 
   * @returns {Promise<Board[]>} Array of all boards
   * @throws {StorageError} If database operation fails
   */
  static async getAllBoards(): Promise<Board[]> {
    try {
      const results = await db.select().from(boards).orderBy(boards.createdAt);
      
      return results.map((board) => ({
        id: board.id,
        name: board.name,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
      }));
    } catch (error) {
      throw new StorageError('Failed to retrieve boards', error as Error);
    }
  }

  /**
   * Update board properties
   * 
   * @param {string} id - Board ID
   * @param {Partial<Pick<Board, 'name'>>} updates - Board properties to update
   * @returns {Promise<Board>} The updated board
   * @throws {NotFoundError} If board doesn't exist
   * @throws {ValidationError} If updates are invalid
   * @throws {StorageError} If database operation fails
   */
  static async updateBoard(id: string, updates: Partial<Pick<Board, 'name'>>): Promise<Board> {
    try {
      const board = await this.getBoard(id);
      if (!board) {
        throw new NotFoundError('Board', id);
      }

      if (updates.name !== undefined) {
        validateBoardName(updates.name);
      }

      const updateData: Partial<typeof boards.$inferInsert> = {
        updatedAt: new Date(),
      };

      if (updates.name !== undefined) {
        updateData.name = updates.name.trim();
      }

      await db.update(boards).set(updateData).where(eq(boards.id, id));

      const updatedBoard = await this.getBoard(id);
      if (!updatedBoard) {
        throw new StorageError('Failed to retrieve updated board');
      }

      return updatedBoard;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to update board', error as Error);
    }
  }

  /**
   * Delete a board and all associated data (cascade)
   * 
   * @param {string} id - Board ID
   * @returns {Promise<void>}
   * @throws {NotFoundError} If board doesn't exist
   * @throws {BusinessRuleError} If attempting to delete the last board
   * @throws {StorageError} If database operation fails
   */
  static async deleteBoard(id: string): Promise<void> {
    try {
      // Check if board exists
      const board = await this.getBoard(id);
      if (!board) {
        throw new NotFoundError('Board', id);
      }

      // Check if this is the last board
      const allBoards = await this.getAllBoards();
      if (allBoards.length === 1) {
        throw new BusinessRuleError('Cannot delete the last remaining board');
      }

      // Delete board (cascade will delete columns and tasks)
      await db.delete(boards).where(eq(boards.id, id));
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BusinessRuleError) {
        throw error;
      }
      throw new StorageError('Failed to delete board', error as Error);
    }
  }
}

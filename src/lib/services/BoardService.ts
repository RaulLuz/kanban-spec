import { getStorageData, saveStorageData, initializeStorage } from '../storage/localStorage';
import { generateId } from '../utils/uuid';
import { validateBoardName } from '../utils/validation';
import { NotFoundError, BusinessRuleError, StorageError } from '../utils/errors';
import { DEFAULT_COLUMN_NAMES, DEFAULT_COLUMN_COLOR } from '../utils/constants';
import type { Board } from '@/types';

/**
 * Service for managing Kanban boards using localStorage
 */
export class BoardService {
  /**
   * Create a new board with default columns (Todo, Doing, Done)
   */
  static async createBoard(name: string): Promise<Board> {
    try {
      validateBoardName(name);
      initializeStorage();

      const data = getStorageData();
      const boardId = generateId();
      const now = new Date().toISOString();

      // Create board
      const newBoard = {
        id: boardId,
        name: name.trim(),
        createdAt: now,
        updatedAt: now,
      };

      data.boards.push(newBoard);

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

      data.columns.push(...columnValues);
      saveStorageData(data);

      return {
        id: newBoard.id,
        name: newBoard.name,
        createdAt: new Date(newBoard.createdAt),
        updatedAt: new Date(newBoard.updatedAt),
      };
    } catch (error) {
      throw new StorageError('Failed to create board', error as Error);
    }
  }

  /**
   * Get a board by ID
   */
  static async getBoard(id: string): Promise<Board | null> {
    try {
      const data = getStorageData();
      const board = data.boards.find((b) => b.id === id);
      
      if (!board) {
        return null;
      }

      return {
        id: board.id,
        name: board.name,
        createdAt: new Date(board.createdAt),
        updatedAt: new Date(board.updatedAt),
      };
    } catch (error) {
      throw new StorageError('Failed to retrieve board', error as Error);
    }
  }

  /**
   * Get all boards ordered by creation date
   */
  static async getAllBoards(): Promise<Board[]> {
    try {
      initializeStorage();
      const data = getStorageData();
      
      return data.boards
        .map((board) => ({
          id: board.id,
          name: board.name,
          createdAt: new Date(board.createdAt),
          updatedAt: new Date(board.updatedAt),
        }))
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    } catch (error) {
      throw new StorageError('Failed to retrieve boards', error as Error);
    }
  }

  /**
   * Update board properties
   */
  static async updateBoard(id: string, updates: Partial<Pick<Board, 'name'>>): Promise<Board> {
    try {
      const data = getStorageData();
      const boardIndex = data.boards.findIndex((b) => b.id === id);
      
      if (boardIndex === -1) {
        throw new NotFoundError('Board', id);
      }

      if (updates.name !== undefined) {
        validateBoardName(updates.name);
        data.boards[boardIndex].name = updates.name.trim();
      }

      data.boards[boardIndex].updatedAt = new Date().toISOString();
      saveStorageData(data);

      const updated = data.boards[boardIndex];
      return {
        id: updated.id,
        name: updated.name,
        createdAt: new Date(updated.createdAt),
        updatedAt: new Date(updated.updatedAt),
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new StorageError('Failed to update board', error as Error);
    }
  }

  /**
   * Delete a board and all associated data
   */
  static async deleteBoard(id: string): Promise<void> {
    try {
      const data = getStorageData();
      const boardIndex = data.boards.findIndex((b) => b.id === id);
      
      if (boardIndex === -1) {
        throw new NotFoundError('Board', id);
      }

      // Check if this is the last board
      if (data.boards.length === 1) {
        throw new BusinessRuleError('Cannot delete the last remaining board');
      }

      // Delete board and associated columns, tasks, and subtasks
      data.boards.splice(boardIndex, 1);
      data.columns = data.columns.filter((c) => c.boardId !== id);
      data.tasks = data.tasks.filter((t) => t.boardId !== id);
      data.subtasks = data.subtasks.filter((st) => {
        const task = data.tasks.find((t) => t.id === st.taskId);
        return task && task.boardId !== id;
      });

      saveStorageData(data);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BusinessRuleError) {
        throw error;
      }
      throw new StorageError('Failed to delete board', error as Error);
    }
  }
}

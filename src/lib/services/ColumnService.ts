import { getStorageData, saveStorageData, generateId } from '../storage/localStorage';
import { validateColumnName, validateColor } from '../utils/validation';
import { NotFoundError, StorageError, BusinessRuleError } from '../utils/errors';
import { DEFAULT_COLUMN_COLOR } from '../utils/constants';
import type { Column } from '@/types';

export class ColumnService {
  static async createColumn(
    boardId: string,
    name: string,
    color: string = DEFAULT_COLUMN_COLOR,
    position?: number
  ): Promise<Column> {
    try {
      validateColumnName(name);
      validateColor(color);

      const data = getStorageData();
      
      // Get current max position if not provided
      let columnPosition = position;
      if (columnPosition === undefined) {
        const existingColumns = data.columns.filter((c) => c.boardId === boardId);
        columnPosition = existingColumns.length;
      }

      const columnId = generateId();
      const now = new Date();

      const newColumn = {
        id: columnId,
        boardId,
        name: name.trim(),
        color,
        position: columnPosition,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      data.columns.push(newColumn);
      saveStorageData(data);

      return {
        id: newColumn.id,
        boardId: newColumn.boardId,
        name: newColumn.name,
        color: newColumn.color,
        position: newColumn.position,
        createdAt: new Date(newColumn.createdAt),
        updatedAt: new Date(newColumn.updatedAt),
      };
    } catch (error) {
      throw new StorageError('Failed to create column', error as Error);
    }
  }

  static async getColumnsByBoard(boardId: string): Promise<Column[]> {
    try {
      const data = getStorageData();
      const results = data.columns
        .filter((c) => c.boardId === boardId)
        .sort((a, b) => a.position - b.position);

      return results.map((column) => ({
        id: column.id,
        boardId: column.boardId,
        name: column.name,
        color: column.color,
        position: column.position,
        createdAt: new Date(column.createdAt),
        updatedAt: new Date(column.updatedAt),
      }));
    } catch (error) {
      throw new StorageError('Failed to retrieve columns', error as Error);
    }
  }

  static async getColumn(id: string): Promise<Column | null> {
    try {
      const data = getStorageData();
      const column = data.columns.find((c) => c.id === id);

      if (!column) {
        return null;
      }

      return {
        id: column.id,
        boardId: column.boardId,
        name: column.name,
        color: column.color,
        position: column.position,
        createdAt: new Date(column.createdAt),
        updatedAt: new Date(column.updatedAt),
      };
    } catch (error) {
      throw new StorageError('Failed to retrieve column', error as Error);
    }
  }

  static async updateColumn(
    id: string,
    updates: Partial<Pick<Column, 'name' | 'color' | 'position'>>
  ): Promise<Column> {
    try {
      const data = getStorageData();
      const columnIndex = data.columns.findIndex((c) => c.id === id);

      if (columnIndex === -1) {
        throw new NotFoundError('Column', id);
      }

      if (updates.name !== undefined) {
        validateColumnName(updates.name);
        data.columns[columnIndex].name = updates.name.trim();
      }
      if (updates.color !== undefined) {
        validateColor(updates.color);
        data.columns[columnIndex].color = updates.color;
      }
      if (updates.position !== undefined) {
        data.columns[columnIndex].position = updates.position;
      }

      data.columns[columnIndex].updatedAt = new Date().toISOString();
      saveStorageData(data);

      const updated = data.columns[columnIndex];
      return {
        id: updated.id,
        boardId: updated.boardId,
        name: updated.name,
        color: updated.color,
        position: updated.position,
        createdAt: new Date(updated.createdAt),
        updatedAt: new Date(updated.updatedAt),
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new StorageError('Failed to update column', error as Error);
    }
  }

  static async deleteColumn(id: string): Promise<void> {
    try {
      const data = getStorageData();
      const columnIndex = data.columns.findIndex((c) => c.id === id);

      if (columnIndex === -1) {
        throw new NotFoundError('Column', id);
      }

      const column = data.columns[columnIndex];

      // Check if this is the last column in the board
      const allColumns = data.columns.filter((c) => c.boardId === column.boardId);
      if (allColumns.length === 1) {
        throw new BusinessRuleError('Cannot delete the last remaining column in a board');
      }

      // Delete column and associated tasks/subtasks
      data.columns.splice(columnIndex, 1);
      data.tasks = data.tasks.filter((t) => t.columnId !== id);
      data.subtasks = data.subtasks.filter((st) => {
        const task = data.tasks.find((t) => t.id === st.taskId);
        return task && task.columnId !== id;
      });

      saveStorageData(data);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BusinessRuleError) {
        throw error;
      }
      throw new StorageError('Failed to delete column', error as Error);
    }
  }
}

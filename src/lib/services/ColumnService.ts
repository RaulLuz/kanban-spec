import { db } from '../db';
import { columns } from '../db/schema';
import { generateId } from '../utils/uuid';
import { validateColumnName, validateColor } from '../utils/validation';
import { NotFoundError, StorageError, BusinessRuleError } from '../utils/errors';
import { eq } from 'drizzle-orm';
import { DEFAULT_COLUMN_COLOR } from '../utils/constants';
import type { Column } from '@/types';

export class ColumnService {
  /**
   * Create a new column in a board
   */
  static async createColumn(
    boardId: string,
    name: string,
    color: string = DEFAULT_COLUMN_COLOR,
    position?: number
  ): Promise<Column> {
    try {
      validateColumnName(name);
      validateColor(color);

      // Get current max position if not provided
      let columnPosition = position;
      if (columnPosition === undefined) {
        const existingColumns = await db
          .select()
          .from(columns)
          .where(eq(columns.boardId, boardId))
          .orderBy(columns.position);
        columnPosition = existingColumns.length;
      }

      const columnId = generateId();
      const now = new Date();

      await db.insert(columns).values({
        id: columnId,
        boardId,
        name: name.trim(),
        color,
        position: columnPosition,
        createdAt: now,
        updatedAt: now,
      });

      const column = await this.getColumn(columnId);
      if (!column) {
        throw new StorageError('Failed to retrieve created column');
      }

      return column;
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to create column', error as Error);
    }
  }

  /**
   * Get all columns for a board
   */
  static async getColumnsByBoard(boardId: string): Promise<Column[]> {
    try {
      const results = await db
        .select()
        .from(columns)
        .where(eq(columns.boardId, boardId))
        .orderBy(columns.position);

      return results.map((column) => ({
        id: column.id,
        boardId: column.boardId,
        name: column.name,
        color: column.color,
        position: column.position,
        createdAt: column.createdAt,
        updatedAt: column.updatedAt,
      }));
    } catch (error) {
      throw new StorageError('Failed to retrieve columns', error as Error);
    }
  }

  /**
   * Get a column by ID
   */
  static async getColumn(id: string): Promise<Column | null> {
    try {
      const result = await db.select().from(columns).where(eq(columns.id, id)).limit(1);

      if (result.length === 0) {
        return null;
      }

      const columnData = result[0];
      return {
        id: columnData.id,
        boardId: columnData.boardId,
        name: columnData.name,
        color: columnData.color,
        position: columnData.position,
        createdAt: columnData.createdAt,
        updatedAt: columnData.updatedAt,
      };
    } catch (error) {
      throw new StorageError('Failed to retrieve column', error as Error);
    }
  }

  /**
   * Update column properties
   */
  static async updateColumn(
    id: string,
    updates: Partial<Pick<Column, 'name' | 'color' | 'position'>>
  ): Promise<Column> {
    try {
      const column = await this.getColumn(id);
      if (!column) {
        throw new NotFoundError('Column', id);
      }

      if (updates.name !== undefined) {
        validateColumnName(updates.name);
      }
      if (updates.color !== undefined) {
        validateColor(updates.color);
      }

      const updateData: Partial<typeof columns.$inferInsert> = {
        updatedAt: new Date(),
      };

      if (updates.name !== undefined) {
        updateData.name = updates.name.trim();
      }
      if (updates.color !== undefined) {
        updateData.color = updates.color;
      }
      if (updates.position !== undefined) {
        updateData.position = updates.position;
      }

      await db.update(columns).set(updateData).where(eq(columns.id, id));

      const updatedColumn = await this.getColumn(id);
      if (!updatedColumn) {
        throw new StorageError('Failed to retrieve updated column');
      }

      return updatedColumn;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to update column', error as Error);
    }
  }

  /**
   * Delete a column
   */
  static async deleteColumn(id: string): Promise<void> {
    try {
      const column = await this.getColumn(id);
      if (!column) {
        throw new NotFoundError('Column', id);
      }

      // Check if this is the last column in the board
      const allColumns = await this.getColumnsByBoard(column.boardId);
      if (allColumns.length === 1) {
        throw new BusinessRuleError('Cannot delete the last remaining column in a board');
      }

      await db.delete(columns).where(eq(columns.id, id));
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BusinessRuleError) {
        throw error;
      }
      throw new StorageError('Failed to delete column', error as Error);
    }
  }
}

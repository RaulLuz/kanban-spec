import { db } from '../db';
import { subtasks, tasks } from '../db/schema';
import { generateId } from '../utils/uuid';
import { validateSubtaskTitle } from '../utils/validation';
import { NotFoundError, StorageError } from '../utils/errors';
import { eq } from 'drizzle-orm';
import type { Subtask } from '@/types';

export class SubtaskService {
  /**
   * Create a new subtask for a task
   */
  static async createSubtask(taskId: string, title: string): Promise<Subtask> {
    try {
      validateSubtaskTitle(title);

      // Verify task exists
      const task = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
      if (task.length === 0) {
        throw new NotFoundError('Task', taskId);
      }

      // Get current max position
      const existingSubtasks = await db
        .select()
        .from(subtasks)
        .where(eq(subtasks.taskId, taskId))
        .orderBy(subtasks.position);

      const position = existingSubtasks.length;

      const subtaskId = generateId();
      const now = new Date();

      await db.insert(subtasks).values({
        id: subtaskId,
        taskId,
        title: title.trim(),
        isCompleted: false,
        position,
        createdAt: now,
        updatedAt: now,
      });

      const subtask = await this.getSubtask(subtaskId);
      if (!subtask) {
        throw new StorageError('Failed to retrieve created subtask');
      }

      return subtask;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to create subtask', error as Error);
    }
  }

  /**
   * Get a subtask by ID
   */
  static async getSubtask(id: string): Promise<Subtask | null> {
    try {
      const result = await db.select().from(subtasks).where(eq(subtasks.id, id)).limit(1);

      if (result.length === 0) {
        return null;
      }

      const subtaskData = result[0];
      return {
        id: subtaskData.id,
        taskId: subtaskData.taskId,
        title: subtaskData.title,
        isCompleted: subtaskData.isCompleted,
        position: subtaskData.position,
        createdAt: subtaskData.createdAt,
        updatedAt: subtaskData.updatedAt,
      };
    } catch (error) {
      throw new StorageError('Failed to retrieve subtask', error as Error);
    }
  }

  /**
   * Get all subtasks for a task
   */
  static async getSubtasksByTask(taskId: string): Promise<Subtask[]> {
    try {
      const results = await db
        .select()
        .from(subtasks)
        .where(eq(subtasks.taskId, taskId))
        .orderBy(subtasks.position);

      return results.map((subtask) => ({
        id: subtask.id,
        taskId: subtask.taskId,
        title: subtask.title,
        isCompleted: subtask.isCompleted,
        position: subtask.position,
        createdAt: subtask.createdAt,
        updatedAt: subtask.updatedAt,
      }));
    } catch (error) {
      throw new StorageError('Failed to retrieve subtasks', error as Error);
    }
  }

  /**
   * Update subtask properties
   */
  static async updateSubtask(
    id: string,
    updates: Partial<Pick<Subtask, 'title' | 'isCompleted'>>
  ): Promise<Subtask> {
    try {
      const subtask = await this.getSubtask(id);
      if (!subtask) {
        throw new NotFoundError('Subtask', id);
      }

      if (updates.title !== undefined) {
        validateSubtaskTitle(updates.title);
      }

      const updateData: Partial<typeof subtasks.$inferInsert> = {
        updatedAt: new Date(),
      };

      if (updates.title !== undefined) {
        updateData.title = updates.title.trim();
      }
      if (updates.isCompleted !== undefined) {
        updateData.isCompleted = updates.isCompleted;
      }

      await db.update(subtasks).set(updateData).where(eq(subtasks.id, id));

      const updatedSubtask = await this.getSubtask(id);
      if (!updatedSubtask) {
        throw new StorageError('Failed to retrieve updated subtask');
      }

      return updatedSubtask;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to update subtask', error as Error);
    }
  }

  /**
   * Delete a subtask
   */
  static async deleteSubtask(id: string): Promise<void> {
    try {
      const subtask = await this.getSubtask(id);
      if (!subtask) {
        throw new NotFoundError('Subtask', id);
      }

      await db.delete(subtasks).where(eq(subtasks.id, id));
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new StorageError('Failed to delete subtask', error as Error);
    }
  }

  /**
   * Toggle subtask completion status
   */
  static async toggleSubtask(id: string): Promise<Subtask> {
    try {
      const subtask = await this.getSubtask(id);
      if (!subtask) {
        throw new NotFoundError('Subtask', id);
      }

      return await this.updateSubtask(id, { isCompleted: !subtask.isCompleted });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to toggle subtask', error as Error);
    }
  }
}

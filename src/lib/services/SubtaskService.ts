import { getStorageData, saveStorageData, generateId } from '../storage/localStorage';
import { validateSubtaskTitle } from '../utils/validation';
import { NotFoundError, StorageError } from '../utils/errors';
import type { Subtask } from '@/types';

export class SubtaskService {
  static async createSubtask(taskId: string, title: string): Promise<Subtask> {
    try {
      validateSubtaskTitle(title);

      const data = getStorageData();

      // Verify task exists
      const task = data.tasks.find((t) => t.id === taskId);
      if (!task) {
        throw new NotFoundError('Task', taskId);
      }

      // Get current max position
      const existingSubtasks = data.subtasks
        .filter((st) => st.taskId === taskId)
        .sort((a, b) => a.position - b.position);

      const position = existingSubtasks.length;

      const subtaskId = generateId();
      const now = new Date();

      const newSubtask = {
        id: subtaskId,
        taskId,
        title: title.trim(),
        isCompleted: false,
        position,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      data.subtasks.push(newSubtask);
      saveStorageData(data);

      return {
        id: newSubtask.id,
        taskId: newSubtask.taskId,
        title: newSubtask.title,
        isCompleted: newSubtask.isCompleted,
        position: newSubtask.position,
        createdAt: new Date(newSubtask.createdAt),
        updatedAt: new Date(newSubtask.updatedAt),
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new StorageError('Failed to create subtask', error as Error);
    }
  }

  static async getSubtask(id: string): Promise<Subtask | null> {
    try {
      const data = getStorageData();
      const subtask = data.subtasks.find((st) => st.id === id);

      if (!subtask) {
        return null;
      }

      return {
        id: subtask.id,
        taskId: subtask.taskId,
        title: subtask.title,
        isCompleted: subtask.isCompleted,
        position: subtask.position,
        createdAt: new Date(subtask.createdAt),
        updatedAt: new Date(subtask.updatedAt),
      };
    } catch (error) {
      throw new StorageError('Failed to retrieve subtask', error as Error);
    }
  }

  static async getSubtasksByTask(taskId: string): Promise<Subtask[]> {
    try {
      const data = getStorageData();
      const results = data.subtasks
        .filter((st) => st.taskId === taskId)
        .sort((a, b) => a.position - b.position);

      return results.map((subtask) => ({
        id: subtask.id,
        taskId: subtask.taskId,
        title: subtask.title,
        isCompleted: subtask.isCompleted,
        position: subtask.position,
        createdAt: new Date(subtask.createdAt),
        updatedAt: new Date(subtask.updatedAt),
      }));
    } catch (error) {
      throw new StorageError('Failed to retrieve subtasks', error as Error);
    }
  }

  static async updateSubtask(
    id: string,
    updates: Partial<Pick<Subtask, 'title' | 'isCompleted'>>
  ): Promise<Subtask> {
    try {
      const data = getStorageData();
      const subtaskIndex = data.subtasks.findIndex((st) => st.id === id);

      if (subtaskIndex === -1) {
        throw new NotFoundError('Subtask', id);
      }

      if (updates.title !== undefined) {
        validateSubtaskTitle(updates.title);
        data.subtasks[subtaskIndex].title = updates.title.trim();
      }
      if (updates.isCompleted !== undefined) {
        data.subtasks[subtaskIndex].isCompleted = updates.isCompleted;
      }

      data.subtasks[subtaskIndex].updatedAt = new Date().toISOString();
      saveStorageData(data);

      const updated = data.subtasks[subtaskIndex];
      return {
        id: updated.id,
        taskId: updated.taskId,
        title: updated.title,
        isCompleted: updated.isCompleted,
        position: updated.position,
        createdAt: new Date(updated.createdAt),
        updatedAt: new Date(updated.updatedAt),
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new StorageError('Failed to update subtask', error as Error);
    }
  }

  static async deleteSubtask(id: string): Promise<void> {
    try {
      const data = getStorageData();
      const subtaskIndex = data.subtasks.findIndex((st) => st.id === id);

      if (subtaskIndex === -1) {
        throw new NotFoundError('Subtask', id);
      }

      data.subtasks.splice(subtaskIndex, 1);
      saveStorageData(data);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new StorageError('Failed to delete subtask', error as Error);
    }
  }

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

import { getStorageData, saveStorageData, generateId } from '../storage/localStorage';
import { validateTaskTitle, validateTaskDescription } from '../utils/validation';
import { NotFoundError, StorageError } from '../utils/errors';
import type { Task } from '@/types';

export class TaskService {
  /**
   * Find column by status (todo, doing, done) for a board
   */
  static findColumnByStatus(boardId: string, status: 'todo' | 'doing' | 'done'): string | null {
    const data = getStorageData();
    const column = data.columns.find(
      (c) => c.boardId === boardId && c.name.toLowerCase() === status
    );
    return column?.id || null;
  }

  static async createTask(
    columnId: string,
    boardId: string,
    title: string,
    description: string | null = null
  ): Promise<Task> {
    try {
      validateTaskTitle(title);
      validateTaskDescription(description);

      const data = getStorageData();

      // Verify column exists and belongs to board
      const column = data.columns.find((c) => c.id === columnId && c.boardId === boardId);
      if (!column) {
        throw new NotFoundError('Column', columnId);
      }

      // Get current max position in column
      const existingTasks = data.tasks
        .filter((t) => t.columnId === columnId)
        .sort((a, b) => a.position - b.position);

      const position = existingTasks.length;

      const taskId = generateId();
      const now = new Date();

      const newTask = {
        id: taskId,
        columnId,
        boardId,
        title: title.trim(),
        description: description?.trim() || null,
        position,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      data.tasks.push(newTask);
      saveStorageData(data);

      // Get column to derive status
      const taskColumn = data.columns.find((c) => c.id === columnId);
      const status = taskColumn
        ? (taskColumn.name.toLowerCase() as 'todo' | 'doing' | 'done')
        : undefined;

      return {
        id: newTask.id,
        columnId: newTask.columnId,
        boardId: newTask.boardId,
        title: newTask.title,
        description: newTask.description,
        position: newTask.position,
        createdAt: new Date(newTask.createdAt),
        updatedAt: new Date(newTask.updatedAt),
        status,
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new StorageError('Failed to create task', error as Error);
    }
  }

  /**
   * Create a task by status (finds the appropriate column)
   */
  static async createTaskByStatus(
    boardId: string,
    status: 'todo' | 'doing' | 'done',
    title: string,
    description: string | null = null
  ): Promise<Task> {
    const columnId = this.findColumnByStatus(boardId, status);
    if (!columnId) {
      throw new NotFoundError('Column', `No column found for status: ${status}`);
    }
    return this.createTask(columnId, boardId, title, description);
  }

  static async getTask(id: string): Promise<Task | null> {
    try {
      const data = getStorageData();
      const task = data.tasks.find((t) => t.id === id);

      if (!task) {
        return null;
      }

      // Get column name to derive status
      const column = data.columns.find((c) => c.id === task.columnId);
      const status = column
        ? (column.name.toLowerCase() as 'todo' | 'doing' | 'done')
        : undefined;

      return {
        id: task.id,
        columnId: task.columnId,
        boardId: task.boardId,
        title: task.title,
        description: task.description,
        position: task.position,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        status,
      };
    } catch (error) {
      throw new StorageError('Failed to retrieve task', error as Error);
    }
  }

  static async getTasksByColumn(columnId: string): Promise<Task[]> {
    try {
      const data = getStorageData();
      const column = data.columns.find((c) => c.id === columnId);
      const status = column
        ? (column.name.toLowerCase() as 'todo' | 'doing' | 'done')
        : undefined;

      const results = data.tasks
        .filter((t) => t.columnId === columnId)
        .sort((a, b) => a.position - b.position);

      return results.map((task) => ({
        id: task.id,
        columnId: task.columnId,
        boardId: task.boardId,
        title: task.title,
        description: task.description,
        position: task.position,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        status,
      }));
    } catch (error) {
      throw new StorageError('Failed to retrieve tasks', error as Error);
    }
  }

  static async getTasksByBoard(boardId: string): Promise<Task[]> {
    try {
      const data = getStorageData();
      const boardColumns = data.columns.filter((c) => c.boardId === boardId);
      const columnMap = new Map(boardColumns.map((c) => [c.id, c.name.toLowerCase()]));

      const results = data.tasks
        .filter((t) => t.boardId === boardId)
        .sort((a, b) => {
          if (a.columnId !== b.columnId) {
            return a.columnId.localeCompare(b.columnId);
          }
          return a.position - b.position;
        });

      return results.map((task) => ({
        id: task.id,
        columnId: task.columnId,
        boardId: task.boardId,
        title: task.title,
        description: task.description,
        position: task.position,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        status: columnMap.get(task.columnId) as 'todo' | 'doing' | 'done' | undefined,
      }));
    } catch (error) {
      throw new StorageError('Failed to retrieve tasks', error as Error);
    }
  }

  static async updateTask(
    id: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'columnId'>>
  ): Promise<Task> {
    try {
      const data = getStorageData();
      const taskIndex = data.tasks.findIndex((t) => t.id === id);

      if (taskIndex === -1) {
        throw new NotFoundError('Task', id);
      }

      if (updates.title !== undefined) {
        validateTaskTitle(updates.title);
        data.tasks[taskIndex].title = updates.title.trim();
      }
      if (updates.description !== undefined) {
        validateTaskDescription(updates.description);
        data.tasks[taskIndex].description = updates.description?.trim() || null;
      }
      if (updates.columnId !== undefined) {
        // Verify new column exists
        const column = data.columns.find((c) => c.id === updates.columnId);
        if (!column) {
          throw new NotFoundError('Column', updates.columnId);
        }

        // Get new position in target column
        const existingTasks = data.tasks
          .filter((t) => t.columnId === updates.columnId)
          .sort((a, b) => a.position - b.position);

        data.tasks[taskIndex].columnId = updates.columnId;
        data.tasks[taskIndex].boardId = column.boardId;
        data.tasks[taskIndex].position = existingTasks.length;
      }

      data.tasks[taskIndex].updatedAt = new Date().toISOString();
      saveStorageData(data);

      const updated = data.tasks[taskIndex];
      const column = data.columns.find((c) => c.id === updated.columnId);
      const status = column
        ? (column.name.toLowerCase() as 'todo' | 'doing' | 'done')
        : undefined;

      return {
        id: updated.id,
        columnId: updated.columnId,
        boardId: updated.boardId,
        title: updated.title,
        description: updated.description,
        position: updated.position,
        createdAt: new Date(updated.createdAt),
        updatedAt: new Date(updated.updatedAt),
        status,
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new StorageError('Failed to update task', error as Error);
    }
  }

  static async deleteTask(id: string): Promise<void> {
    try {
      const data = getStorageData();
      const taskIndex = data.tasks.findIndex((t) => t.id === id);

      if (taskIndex === -1) {
        throw new NotFoundError('Task', id);
      }

      // Delete task and associated subtasks
      data.tasks.splice(taskIndex, 1);
      data.subtasks = data.subtasks.filter((st) => st.taskId !== id);

      saveStorageData(data);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new StorageError('Failed to delete task', error as Error);
    }
  }

  static async moveTask(
    taskId: string,
    targetColumnId: string,
    newPosition: number
  ): Promise<Task> {
    try {
      const data = getStorageData();
      const taskIndex = data.tasks.findIndex((t) => t.id === taskId);

      if (taskIndex === -1) {
        throw new NotFoundError('Task', taskId);
      }

      const task = data.tasks[taskIndex];

      // Verify target column exists
      const column = data.columns.find((c) => c.id === targetColumnId);
      if (!column) {
        throw new NotFoundError('Column', targetColumnId);
      }

      // Get all tasks in target column
      const targetTasks = data.tasks
        .filter((t) => t.columnId === targetColumnId)
        .sort((a, b) => a.position - b.position);

      // Adjust positions
      if (task.columnId === targetColumnId) {
        // Moving within same column
        const currentIndex = targetTasks.findIndex((t) => t.id === taskId);
        if (currentIndex === -1) {
          const foundTask = await this.getTask(taskId);
          if (!foundTask) {
            throw new NotFoundError('Task', taskId);
          }
          return foundTask;
        }

        // Reorder within same column
        targetTasks.forEach((t, index) => {
          if (t.id === taskId) return;
          let newPos = index;
          if (index >= newPosition) newPos = index + 1;
          if (newPos !== t.position) {
            const tIndex = data.tasks.findIndex((task) => task.id === t.id);
            if (tIndex !== -1) {
              data.tasks[tIndex].position = newPos;
            }
          }
        });
        data.tasks[taskIndex].position = newPosition;
      } else {
        // Moving to different column
        // Shift tasks in target column
        targetTasks.forEach((t, index) => {
          if (index >= newPosition) {
            const tIndex = data.tasks.findIndex((task) => task.id === t.id);
            if (tIndex !== -1) {
              data.tasks[tIndex].position = index + 1;
            }
          }
        });

        // Shift tasks in source column
        const sourceTasks = data.tasks
          .filter((t) => t.columnId === task.columnId)
          .sort((a, b) => a.position - b.position);

        sourceTasks.forEach((t) => {
          if (t.position > task.position) {
            const tIndex = data.tasks.findIndex((task) => task.id === t.id);
            if (tIndex !== -1) {
              data.tasks[tIndex].position = t.position - 1;
            }
          }
        });

        data.tasks[taskIndex].columnId = targetColumnId;
        data.tasks[taskIndex].boardId = column.boardId;
        data.tasks[taskIndex].position = newPosition;
      }

      data.tasks[taskIndex].updatedAt = new Date().toISOString();
      saveStorageData(data);

      const movedTask = await this.getTask(taskId);
      if (!movedTask) {
        throw new StorageError('Failed to retrieve moved task');
      }

      return movedTask;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to move task', error as Error);
    }
  }
}

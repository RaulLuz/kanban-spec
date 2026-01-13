import { db } from '../db';
import { tasks, columns } from '../db/schema';
import { generateId } from '../utils/uuid';
import { validateTaskTitle, validateTaskDescription } from '../utils/validation';
import { NotFoundError, StorageError } from '../utils/errors';
import { eq, and } from 'drizzle-orm';
import type { Task } from '@/types';

export class TaskService {
  /**
   * Create a new task in a column
   */
  static async createTask(
    columnId: string,
    boardId: string,
    title: string,
    description: string | null = null
  ): Promise<Task> {
    try {
      validateTaskTitle(title);
      validateTaskDescription(description);

      // Verify column exists and belongs to board
      const column = await db
        .select()
        .from(columns)
        .where(and(eq(columns.id, columnId), eq(columns.boardId, boardId)))
        .limit(1);

      if (column.length === 0) {
        throw new NotFoundError('Column', columnId);
      }

      // Get current max position in column
      const existingTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.columnId, columnId))
        .orderBy(tasks.position);

      const position = existingTasks.length;

      const taskId = generateId();
      const now = new Date();

      await db.insert(tasks).values({
        id: taskId,
        columnId,
        boardId,
        title: title.trim(),
        description: description?.trim() || null,
        position,
        createdAt: now,
        updatedAt: now,
      });

      const task = await this.getTask(taskId);
      if (!task) {
        throw new StorageError('Failed to retrieve created task');
      }

      return task;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to create task', error as Error);
    }
  }

  /**
   * Get a task by ID
   */
  static async getTask(id: string): Promise<Task | null> {
    try {
      const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);

      if (result.length === 0) {
        return null;
      }

      const taskData = result[0];
      
      // Get column name to derive status
      const column = await db
        .select()
        .from(columns)
        .where(eq(columns.id, taskData.columnId))
        .limit(1);

      const status = column.length > 0 
        ? column[0].name.toLowerCase() as 'todo' | 'doing' | 'done'
        : undefined;

      return {
        id: taskData.id,
        columnId: taskData.columnId,
        boardId: taskData.boardId,
        title: taskData.title,
        description: taskData.description,
        position: taskData.position,
        createdAt: taskData.createdAt,
        updatedAt: taskData.updatedAt,
        status,
      };
    } catch (error) {
      throw new StorageError('Failed to retrieve task', error as Error);
    }
  }

  /**
   * Get all tasks for a column
   */
  static async getTasksByColumn(columnId: string): Promise<Task[]> {
    try {
      const results = await db
        .select()
        .from(tasks)
        .where(eq(tasks.columnId, columnId))
        .orderBy(tasks.position);

      // Get column for status derivation
      const column = await db
        .select()
        .from(columns)
        .where(eq(columns.id, columnId))
        .limit(1);

      const status = column.length > 0
        ? column[0].name.toLowerCase() as 'todo' | 'doing' | 'done'
        : undefined;

      return results.map((task) => ({
        id: task.id,
        columnId: task.columnId,
        boardId: task.boardId,
        title: task.title,
        description: task.description,
        position: task.position,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        status,
      }));
    } catch (error) {
      throw new StorageError('Failed to retrieve tasks', error as Error);
    }
  }

  /**
   * Get all tasks for a board
   */
  static async getTasksByBoard(boardId: string): Promise<Task[]> {
    try {
      const results = await db
        .select()
        .from(tasks)
        .where(eq(tasks.boardId, boardId))
        .orderBy(tasks.columnId, tasks.position);

      // Get columns for status derivation
      const boardColumns = await db
        .select()
        .from(columns)
        .where(eq(columns.boardId, boardId));

      const columnMap = new Map(boardColumns.map((c) => [c.id, c.name.toLowerCase()]));

      return results.map((task) => ({
        id: task.id,
        columnId: task.columnId,
        boardId: task.boardId,
        title: task.title,
        description: task.description,
        position: task.position,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        status: columnMap.get(task.columnId) as 'todo' | 'doing' | 'done' | undefined,
      }));
    } catch (error) {
      throw new StorageError('Failed to retrieve tasks', error as Error);
    }
  }

  /**
   * Update task properties
   */
  static async updateTask(
    id: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'columnId'>>
  ): Promise<Task> {
    try {
      const task = await this.getTask(id);
      if (!task) {
        throw new NotFoundError('Task', id);
      }

      if (updates.title !== undefined) {
        validateTaskTitle(updates.title);
      }
      if (updates.description !== undefined) {
        validateTaskDescription(updates.description);
      }

      const updateData: Partial<typeof tasks.$inferInsert> = {
        updatedAt: new Date(),
      };

      if (updates.title !== undefined) {
        updateData.title = updates.title.trim();
      }
      if (updates.description !== undefined) {
        updateData.description = updates.description?.trim() || null;
      }
      if (updates.columnId !== undefined) {
        // Verify new column exists
        const column = await db
          .select()
          .from(columns)
          .where(eq(columns.id, updates.columnId))
          .limit(1);

        if (column.length === 0) {
          throw new NotFoundError('Column', updates.columnId);
        }

        // Get new position in target column
        const existingTasks = await db
          .select()
          .from(tasks)
          .where(eq(tasks.columnId, updates.columnId))
          .orderBy(tasks.position);

        updateData.columnId = updates.columnId;
        updateData.position = existingTasks.length;
        updateData.boardId = column[0].boardId; // Update boardId to match new column
      }

      await db.update(tasks).set(updateData).where(eq(tasks.id, id));

      const updatedTask = await this.getTask(id);
      if (!updatedTask) {
        throw new StorageError('Failed to retrieve updated task');
      }

      return updatedTask;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('Failed to update task', error as Error);
    }
  }

  /**
   * Delete a task
   */
  static async deleteTask(id: string): Promise<void> {
    try {
      const task = await this.getTask(id);
      if (!task) {
        throw new NotFoundError('Task', id);
      }

      await db.delete(tasks).where(eq(tasks.id, id));
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new StorageError('Failed to delete task', error as Error);
    }
  }

  /**
   * Move task to a different column and position
   */
  static async moveTask(
    taskId: string,
    targetColumnId: string,
    newPosition: number
  ): Promise<Task> {
    try {
      const task = await this.getTask(taskId);
      if (!task) {
        throw new NotFoundError('Task', taskId);
      }

      // Verify target column exists
      const column = await db
        .select()
        .from(columns)
        .where(eq(columns.id, targetColumnId))
        .limit(1);

      if (column.length === 0) {
        throw new NotFoundError('Column', targetColumnId);
      }

      // Get all tasks in target column
      const targetTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.columnId, targetColumnId))
        .orderBy(tasks.position);

      // Adjust positions
      const tasksToUpdate: Array<{ id: string; position: number }> = [];

      // If moving within same column
      if (task.columnId === targetColumnId) {
        const currentIndex = targetTasks.findIndex((t) => t.id === taskId);
        if (currentIndex === -1) return task;

        // Reorder within same column
        targetTasks.forEach((t, index) => {
          if (t.id === taskId) return;
          let newPos = index;
          if (index >= newPosition) newPos = index + 1;
          if (newPos !== t.position) {
            tasksToUpdate.push({ id: t.id, position: newPos });
          }
        });
        tasksToUpdate.push({ id: taskId, position: newPosition });
      } else {
        // Moving to different column
        // Shift tasks in target column
        targetTasks.forEach((t, index) => {
          if (index >= newPosition) {
            tasksToUpdate.push({ id: t.id, position: index + 1 });
          }
        });

        // Shift tasks in source column
        const sourceTasks = await db
          .select()
          .from(tasks)
          .where(eq(tasks.columnId, task.columnId))
          .orderBy(tasks.position);

        sourceTasks.forEach((t) => {
          if (t.position > task.position) {
            tasksToUpdate.push({ id: t.id, position: t.position - 1 });
          }
        });

        tasksToUpdate.push({
          id: taskId,
          position: newPosition,
        });
      }

      // Update all positions
      for (const update of tasksToUpdate) {
        if (update.id === taskId) {
          await db
            .update(tasks)
            .set({
              columnId: targetColumnId,
              boardId: column[0].boardId,
              position: update.position,
              updatedAt: new Date(),
            })
            .where(eq(tasks.id, update.id));
        } else {
          await db
            .update(tasks)
            .set({
              position: update.position,
              updatedAt: new Date(),
            })
            .where(eq(tasks.id, update.id));
        }
      }

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

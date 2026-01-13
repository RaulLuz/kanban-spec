'use client';

import { useState, useCallback } from 'react';
import { TaskService } from '@/lib/services/TaskService';
import { SubtaskService } from '@/lib/services/SubtaskService';
import type { Task, Subtask } from '@/types';

export function useTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = useCallback(async (
    columnId: string,
    boardId: string,
    title: string,
    description?: string | null
  ): Promise<Task> => {
    try {
      setLoading(true);
      setError(null);
      return await TaskService.createTask(columnId, boardId, title, description);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTaskByStatus = useCallback(async (
    boardId: string,
    status: 'todo' | 'doing' | 'done',
    title: string,
    description?: string | null
  ): Promise<Task> => {
    try {
      setLoading(true);
      setError(null);
      return await TaskService.createTaskByStatus(boardId, status, title, description);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTask = useCallback(async (id: string): Promise<Task & { subtasks?: Subtask[] }> => {
    try {
      setLoading(true);
      setError(null);

      const [task, subtasks] = await Promise.all([
        TaskService.getTask(id),
        SubtaskService.getSubtasksByTask(id),
      ]);

      if (!task) {
        throw new Error('Task not found');
      }

      return { ...task, subtasks };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (
    id: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'columnId'>>
  ): Promise<Task> => {
    try {
      setLoading(true);
      setError(null);
      return await TaskService.updateTask(id, updates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await TaskService.deleteTask(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSubtask = useCallback(async (taskId: string, title: string): Promise<Subtask> => {
    try {
      setLoading(true);
      setError(null);
      return await SubtaskService.createSubtask(taskId, title);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create subtask';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleSubtask = useCallback(async (id: string): Promise<Subtask> => {
    try {
      setLoading(true);
      setError(null);
      return await SubtaskService.toggleSubtask(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle subtask';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const moveTask = useCallback(async (
    taskId: string,
    targetColumnId: string,
    newPosition: number
  ): Promise<Task> => {
    try {
      setLoading(true);
      setError(null);
      return await TaskService.moveTask(taskId, targetColumnId, newPosition);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to move task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createTask,
    createTaskByStatus,
    getTask,
    updateTask,
    deleteTask,
    createSubtask,
    toggleSubtask,
    moveTask,
  };
}

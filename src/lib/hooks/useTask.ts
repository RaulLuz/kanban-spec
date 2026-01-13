'use client';

import { useState, useCallback } from 'react';
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

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columnId, boardId, title, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create task');
      }

      const data = await response.json();
      return data.task;
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

      const [taskResponse, subtasksResponse] = await Promise.all([
        fetch(`/api/tasks/${id}`),
        fetch(`/api/tasks/${id}/subtasks`),
      ]);

      if (!taskResponse.ok) {
        throw new Error('Failed to fetch task');
      }

      const taskData = await taskResponse.json();
      const task = taskData.task;

      // Fetch subtasks
      if (subtasksResponse.ok) {
        const subtasksData = await subtasksResponse.json();
        return { ...task, subtasks: subtasksData.subtasks || [] };
      }

      return { ...task, subtasks: [] };
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

      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update task');
      }

      const data = await response.json();
      return data.task;
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

      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete task');
      }
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

      const response = await fetch('/api/subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, title }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create subtask');
      }

      const data = await response.json();
      return data.subtask;
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

      const response = await fetch(`/api/subtasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggle: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to toggle subtask');
      }

      const data = await response.json();
      return data.subtask;
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

      const response = await fetch('/api/tasks/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, targetColumnId, newPosition }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to move task');
      }

      const data = await response.json();
      return data.task;
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
    getTask,
    updateTask,
    deleteTask,
    createSubtask,
    toggleSubtask,
    moveTask,
  };
}

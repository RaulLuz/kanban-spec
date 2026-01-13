'use client';

import { useState, useCallback, useEffect } from 'react';
import { TaskService } from '@/lib/services/TaskService';
import type { Task } from '@/types';

export function useBoardTasks(boardId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    if (!boardId) {
      setTasks([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const boardTasks = await TaskService.getTasksByBoard(boardId);
      setTasks(boardTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    error,
    refreshTasks: loadTasks,
  };
}

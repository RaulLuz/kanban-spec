'use client';

import { useState, useEffect } from 'react';
import { SubtaskList } from '../task/SubtaskList';
import { useTask } from '@/lib/hooks/useTask';
import { Button } from '../ui/Button';
import type { Task, Subtask, Column } from '@/types';

// Close modal on Escape key
const useModalClose = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
};

interface ViewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  columns: Column[];
  onTaskUpdated?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ViewTaskModal({
  isOpen,
  onClose,
  taskId,
  columns,
  onTaskUpdated,
  onEdit,
  onDelete,
}: ViewTaskModalProps) {
  const { getTask, toggleSubtask, createSubtask, loading } = useTask();
  const [task, setTask] = useState<(Task & { subtasks?: Subtask[] }) | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && taskId) {
      loadTask();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, taskId]);

  useModalClose(isOpen, onClose);

  const loadTask = async () => {
    try {
      const loadedTask = await getTask(taskId);
      setTask(loadedTask);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load task');
    }
  };

  const handleToggleSubtask = async (id: string) => {
    try {
      await toggleSubtask(id);
      await loadTask(); // Reload to get updated subtasks
      onTaskUpdated?.();
    } catch (err) {
      console.error('Failed to toggle subtask:', err);
    }
  };

  const handleAddSubtask = async (title: string) => {
    try {
      await createSubtask(taskId, title);
      await loadTask(); // Reload to get new subtask
      onTaskUpdated?.();
    } catch (err) {
      console.error('Failed to add subtask:', err);
    }
  };

  if (!isOpen || !task) return null;

  const column = columns.find((c) => c.id === task.columnId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-grey rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-heading-l text-black dark:text-white flex-1 pr-4">
            {task.title}
          </h2>
          <button
            onClick={onClose}
            className="text-medium-grey hover:text-red transition-colors focus:outline-none focus:ring-2 focus:ring-main-purple rounded"
            aria-label="Close modal"
          >
            <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
              <g fill="currentColor" fillRule="evenodd">
                <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
                <path d="M0 2.122 2.122 0 14.85 12.728 12.728 14.85z" />
              </g>
            </svg>
          </button>
        </div>

        {error && (
          <p className="text-red text-body-m mb-4">{error}</p>
        )}

        {task.description && (
          <p className="text-body-l text-medium-grey mb-6">{task.description}</p>
        )}

        <div className="mb-6">
          <p className="text-body-m text-medium-grey mb-2">Current Status</p>
          <p className="text-heading-m text-black dark:text-white capitalize">
            {column?.name || task.status}
          </p>
        </div>

        {task.subtasks && (
          <div className="mb-6">
            <SubtaskList
              subtasks={task.subtasks}
              onToggle={handleToggleSubtask}
              onAdd={handleAddSubtask}
              disabled={loading}
            />
          </div>
        )}

        <div className="flex gap-4">
          {onEdit && (
            <Button
              variant="secondary"
              onClick={onEdit}
              className="flex-1"
            >
              Edit Task
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              onClick={onDelete}
              className="flex-1"
            >
              Delete Task
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

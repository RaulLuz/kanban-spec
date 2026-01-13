'use client';

import { useState, useEffect } from 'react';
import { TaskForm } from '../task/TaskForm';
import { useTask } from '@/lib/hooks/useTask';
import type { Task, Column } from '@/types';

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

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  columns: Column[];
  onTaskUpdated?: () => void;
}

export function EditTaskModal({
  isOpen,
  onClose,
  taskId,
  columns,
  onTaskUpdated,
}: EditTaskModalProps) {
  const { getTask, updateTask, loading } = useTask();
  const [task, setTask] = useState<Task | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && taskId) {
      loadTask();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, taskId]);

  const loadTask = async () => {
    try {
      const loadedTask = await getTask(taskId);
      setTask(loadedTask);
      setSelectedColumnId(loadedTask.columnId);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load task');
    }
  };

  const handleSubmit = async (title: string, description: string | null) => {
    if (!task) return;

    try {
      await updateTask(task.id, {
        title,
        description,
        columnId: selectedColumnId !== task.columnId ? selectedColumnId : undefined,
      });
      onTaskUpdated?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-grey rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-heading-l text-black dark:text-white mb-6">Edit Task</h2>

        {error && (
          <p className="text-red text-body-m mb-4">{error}</p>
        )}

        <div className="mb-6">
          <label htmlFor="edit-task-column" className="block text-body-m text-medium-grey mb-2">
            Status
          </label>
          <select
            id="edit-task-column"
            value={selectedColumnId}
            onChange={(e) => setSelectedColumnId(e.target.value)}
            className="w-full px-4 py-2 rounded border border-medium-grey border-opacity-25 bg-white dark:bg-dark-grey text-black dark:text-white focus:outline-none focus:border-main-purple"
          >
            {columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.name}
              </option>
            ))}
          </select>
        </div>

        <TaskForm
          initialTitle={task.title}
          initialDescription={task.description || ''}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Save Changes"
          loading={loading}
        />
      </div>
    </div>
  );
}
